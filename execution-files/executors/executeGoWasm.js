const { setupCryptoPolyfill } = require('../polyfillUtil.js');
const { HeapManager, createWasmMemory } = require('../memoryUtils.js');
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
        let memory = new WebAssembly.Memory({ initial: 256, maximum: 256 });
        const heapManager = new HeapManager(memory);

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
                query_rdf_tbv_cli: (queryPtr, queryLen) => {
                    const query = go.mem.loadString(queryPtr, queryLen);
                    console.log("Executing RDF query via TBV-CLI:", query);

                    return new Promise((resolve, reject) => {
                        executeRdfQuery(query)
                            .then((result) => {
                                console.log("RDF query result:", result);
                                const resultJson = JSON.stringify(result);
                                const resultPtr = go.mem.stringToPtr(resultJson);
                                resolve(resultPtr);
                            })
                            .catch((error) => {
                                console.error("Error executing RDF query:", error);
                                const errorJson = JSON.stringify({ error: error.message });
                                const errorPtr = go.mem.stringToPtr(errorJson);
                                resolve(errorPtr);
                            });
                    });
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
            return instance.exports.runTest();
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
                const testResult = global.runTest();
                console.log("runTest raw result:", testResult);
                if (testResult) {
                    try {
                        const parsedResult = JSON.parse(testResult);
                        console.log("runTest parsed result:", parsedResult);
                        return {
                            success: true,
                            result: parsedResult
                        };
                    } catch (parseError) {
                        console.error("Error parsing runTest result:", parseError);
                        return {
                            success: false,
                            error: "Failed to parse test result",
                            rawResult: testResult
                        };
                    }
                }
            } catch (error) {
                console.error("Error executing runTest function:", error);
                return {
                    success: false,
                    error: error.message
                };
            }
        }

        // Wait for program completion or timeout
        try {
            await Promise.race([
                runPromise,
                new Promise((_, reject) => 
                    setTimeout(() => reject(new Error("Go program execution timed out")), 10000)
                )
            ]);
            return {
                success: true,
                message: "Go program completed successfully"
            };
        } catch (error) {
            console.error("Error or timeout while running Go program:", error);
            return {
                success: false,
                error: error.message
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