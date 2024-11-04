const { setupCryptoPolyfill } = require('../polyfillUtil.js');
const { HeapManager, createWasmMemory } = require('../memoryUtils.js');
const { executeRdfQuery } = require('../rdfQueryHandler.js');

// Set up crypto polyfill before loading Go runtime
setupCryptoPolyfill();

// Now load the Go runtime
require('../wasm_exec.js');
const Go = globalThis.Go;

if (typeof Go !== 'function') {
    throw new Error('Go class is not defined. Make sure wasm_exec.js is loaded correctly.');
}

/**
 * Executes a Go-compiled WebAssembly module
 * @param {ArrayBuffer} wasmBuffer - The WebAssembly binary buffer
 * @returns {Promise<Object>} Execution result
 */
async function executeGoWasm(wasmBuffer) {
    console.log("Executing Go-compiled WebAssembly module");
    
    try {
        const go = new Go();
        const memory = createWasmMemory(256, 256);
        const heapManager = new HeapManager(memory);
        let executionComplete = false;
        let executionResult = null;
        let finalResult = null;
        let checkInterval = null;

        // Store the final result when it's set
        global.setFinalResult = (result) => {
            console.log("Setting final result:", result);
            finalResult = result;
            executionComplete = true;
        };

        const importObject = {
            ...go.importObject,
            env: {
                ...go.importObject.env,
                malloc: (size) => {
                    console.log("malloc called with size:", size);
                    return heapManager.malloc(size);
                },
                free: (ptr) => {
                    console.log("free called with ptr:", ptr);
                    heapManager.free(ptr);
                },
                query_rdf_tbv_cli: async (queryPtr, queryLen) => {
                    const query = go.mem.loadString(queryPtr, queryLen);
                    console.log("Executing RDF query via TBV-CLI:", query);

                    try {
                        const result = await executeRdfQuery(query);
                        console.log("RDF query result:", result);
                        const resultJson = JSON.stringify(result);
                        const resultPtr = go.mem.stringToPtr(resultJson);
                        return resultPtr;
                    } catch (error) {
                        console.error("Error executing RDF query:", error);
                        const errorJson = JSON.stringify({ error: error.message });
                        const errorPtr = go.mem.stringToPtr(errorJson);
                        return errorPtr;
                    }
                },
                // Go syscall/js implementations
                "syscall/js.valueGet": () => {},
                "syscall/js.valueSet": () => {},
                "syscall/js.valueIndex": () => {},
                "syscall/js.valueSetIndex": () => {},
                "syscall/js.valueCall": () => {},
                "syscall/js.valueNew": () => {},
                "syscall/js.valueLength": () => {},
                "syscall/js.valuePrepareString": () => {},
                "syscall/js.valueLoadString": () => {},
                "syscall/js.stringVal": () => {},
                "syscall/js.valueInstanceOf": () => {},
                "syscall/js.copyBytesToGo": () => {},
                "syscall/js.copyBytesToJS": () => {},
            },
        };

        console.log("Instantiating Go WebAssembly module...");
        const result = await WebAssembly.instantiate(wasmBuffer, importObject);
        const instance = result.instance;

        console.log("Available exports:", Object.keys(instance.exports));

        // Set up global functions
        global.runTest = () => {
            if (typeof instance.exports.runTest !== "function") {
                throw new Error("runTest function not found in exports");
            }
            console.log("Executing Go runTest function");
            const testResult = instance.exports.runTest();
            if (testResult) {
                try {
                    executionResult = {
                        success: true,
                        result: testResult
                    };
                } catch (parseError) {
                    executionResult = {
                        success: false,
                        error: "Failed to parse test result",
                        rawResult: testResult
                    };
                }
            }
            return testResult;
        };

        // Run the Go program
        console.log("Running Go program...");
        const runPromise = go.run(instance);

        // Wait for initial setup
        await new Promise(resolve => setTimeout(resolve, 100));

        // Execute test if available
        if (typeof global.runTest === "function") {
            console.log("Executing runTest function...");
            try {
                global.runTest();
            } catch (error) {
                console.error("Error executing runTest function:", error);
                executionResult = {
                    success: false,
                    error: error.message
                };
            }
        }

        // Set up completion promise with interval checking
        const completionPromise = new Promise((resolve) => {
            checkInterval = setInterval(() => {
                if (finalResult !== null || go.exited) {
                    clearInterval(checkInterval);
                    executionComplete = true;
                    resolve();
                }
            }, 100);
        });

        // Clean up function
        const cleanup = () => {
            if (checkInterval) {
                clearInterval(checkInterval);
                checkInterval = null;
            }
        };

        // Wait for completion or timeout
        try {
            await Promise.race([
                completionPromise,
                new Promise((_, reject) => 
                    setTimeout(() => {
                        if (!executionComplete) {
                            reject(new Error("Go program execution timed out"));
                        }
                    }, 30000) // 30 second timeout
                )
            ]);

            cleanup();
            return {
                success: true,
                result: finalResult,
                rdfQueryComplete: true
            };
        } catch (error) {
            cleanup();
            console.error("Error or timeout while running Go program:", error);
            return {
                success: finalResult !== null,
                error: finalResult === null ? error.message : undefined,
                result: finalResult,
                rdfQueryComplete: finalResult !== null
            };
        }
    } catch (error) {
        console.error("Error executing Go WASM:", error);
        return {
            success: false,
            error: error.message
        };
    }
}

module.exports = { executeGoWasm };