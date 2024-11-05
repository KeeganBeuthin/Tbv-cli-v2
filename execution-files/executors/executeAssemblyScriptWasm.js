const { readStringFromMemory, writeStringToMemory } = require('../memoryUtils');

/**
 * Executes an AssemblyScript-compiled WebAssembly module
 * @param {ArrayBuffer} wasmBuffer - The WebAssembly binary buffer
 * @returns {Promise<Object>} Execution result
 */
async function executeAssemblyScriptWasm(wasmBuffer) {
    console.log("Executing AssemblyScript-compiled WebAssembly module");
    let instance = null;
    let rdfQueryComplete = false;
    let queryResult = null;
    let creditQuery = null;

    try {
        const memory = new WebAssembly.Memory({ initial: 256, maximum: 512 });
        
        const importObject = {
            env: {
                memory: memory,
                abort: (message, fileName, lineNumber, columnNumber) => {
                    console.error(
                        `Abort called at ${fileName}:${lineNumber}:${columnNumber}: ${message}`
                    );
                },
                logMessage: (ptr, len) => {
                    const message = readStringFromMemory(instance, ptr, len);
                    console.log("WASM:", message);
                },
                "console.log": (messagePtr) => {
                    const message = readStringFromMemory(instance, messagePtr);
                    console.log("WASM console.log:", message);
                }
            },
            index: {
                executeRdfQuery: (queryPtr, queryLen) => {
                    try {
                        const query = readStringFromMemory(instance, queryPtr, queryLen);
                        console.log("Executing RDF query:", query);
                        creditQuery = query; // Store the query
                        global.executeRdfQuery(query);
                    } catch (error) {
                        console.error("Error in executeRdfQuery:", error);
                    }
                },
                setFinalResult: (resultPtr, resultLen) => {
                    try {
                        const result = readStringFromMemory(instance, resultPtr, resultLen);
                        console.log("Setting final result:", result);
                        global.setFinalResult(result);
                        rdfQueryComplete = true;
                        queryResult = result;
                    } catch (error) {
                        console.error("Error in setFinalResult:", error);
                    }
                }
            }
        };

        console.log("Instantiating AssemblyScript WebAssembly module...");
        const result = await WebAssembly.instantiate(wasmBuffer, importObject);
        instance = result.instance;
        console.log("Available exports:", Object.keys(instance.exports));

        // Set up global functions
        global.setQueryResult = (result) => {
            console.log("JavaScript: setQueryResult called with result:", result);
            if (!result) {
                console.error("Error: Null result received");
                return;
            }

            try {
                const parsedResult = JSON.parse(result);
                if (!parsedResult.results || !parsedResult.results[0] || !parsedResult.results[0].balance) {
                    throw new Error("Invalid result structure");
                }

                const balance = parsedResult.results[0].balance;
                const formattedResult = {
                    creditQuery: creditQuery,
                    creditResult: `Current balance: ${balance}. After credit of 100.00, new balance: ${Number(balance) + 100}.00`
                };

                console.log("Formatted result:", formattedResult);

                // Convert the formatted result to a string
                const resultString = JSON.stringify(formattedResult);
                
                // Allocate memory for the string using AssemblyScript's allocator
                const stringPtr = instance.exports.allocateString(resultString.length);
                if (!stringPtr) {
                    throw new Error("Failed to allocate memory for result string");
                }

                // Write the string to memory
                const dataView = new DataView(instance.exports.memory.buffer);
                const encoder = new TextEncoder();
                const bytes = encoder.encode(resultString);
                
                for (let i = 0; i < bytes.length; i++) {
                    dataView.setUint8(stringPtr + i, bytes[i]);
                }

                console.log(`JavaScript: Calling WASM setQueryResult with ptr: ${stringPtr}, len: ${resultString.length}`);
                instance.exports.setQueryResult(stringPtr, resultString.length);
                console.log("JavaScript: WASM setQueryResult finished");
                
                rdfQueryComplete = true;
                queryResult = formattedResult;
            } catch (error) {
                console.error("Error in setQueryResult:", error);
                throw error;
            }
        };

        // Execute main function if it exists
        if (instance.exports.main) {
            console.log("Executing AssemblyScript main function");
            instance.exports.main();
        }

        // Execute test function
        console.log("Executing AssemblyScript runTest function");
        instance.exports.runTest();

        // Wait for completion or timeout
        await new Promise((resolve) => setTimeout(resolve, 5000));

        return {
            success: true,
            message: "AssemblyScript module executed successfully",
            rdfQueryComplete: rdfQueryComplete,
            result: queryResult,
            completed: true
        };

    } catch (error) {
        console.error("Error executing AssemblyScript WASM:", error);
        return {
            success: false,
            error: error.message,
            rdfQueryComplete: rdfQueryComplete,
            completed: false
        };
    } finally {
        // Cleanup if necessary
        if (instance && instance.exports.__collect) {
            try {
                instance.exports.__collect();
            } catch (error) {
                console.warn("Error during AssemblyScript cleanup:", error);
            }
        }
    }
}

module.exports = { executeAssemblyScriptWasm };