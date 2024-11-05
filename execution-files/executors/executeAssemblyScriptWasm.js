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
                        creditQuery = query;
                        global.executeRdfQuery(query);
                    } catch (error) {
                        console.error("Error in executeRdfQuery:", error);
                    }
                },
                setFinalResult: (resultPtr, resultLen) => {
                    try {
                        const result = readStringFromMemory(instance, resultPtr, resultLen);
                        console.log("Setting final result:", result);
                        queryResult = {
                            creditQuery: creditQuery,
                            creditResult: result
                        };
                        rdfQueryComplete = true;
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
            try {
                const parsedResult = JSON.parse(result);
                
                if (!parsedResult.results || !parsedResult.results[0] || !parsedResult.results[0].balance) {
                    console.error("Invalid result structure:", parsedResult);
                    return;
                }

                const balance = parsedResult.results[0].balance;
                const formattedResult = `Current balance: ${balance}. After credit of 100.00, new balance: ${Number(balance) + 100}.00`;

                // Store result in JavaScript
                queryResult = {
                    creditQuery: creditQuery,
                    creditResult: formattedResult
                };

                console.log("Formatted result:", queryResult);
                rdfQueryComplete = true;

                // Pass plain string to WASM
                if (instance.exports.setQueryResult) {
                    // Create a JSON string that won't need to be parsed
                    const wasmResult = JSON.stringify({ result: formattedResult });
                    const ptr = instance.exports.allocateString(wasmResult.length);
                    const dataView = new DataView(instance.exports.memory.buffer);
                    const encoder = new TextEncoder();
                    const bytes = encoder.encode(wasmResult);
                    
                    for (let i = 0; i < bytes.length; i++) {
                        dataView.setUint8(ptr + i, bytes[i]);
                    }

                    instance.exports.setQueryResult(ptr, wasmResult.length);
                }

            } catch (error) {
                console.error("Error processing query result:", error);
                queryResult = {
                    error: error.message,
                    creditQuery: creditQuery
                };
                rdfQueryComplete = true;
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

        // Wait for completion
        await new Promise((resolve) => setTimeout(resolve, 2000));

        return {
            success: true,
            message: "AssemblyScript module executed successfully",
            rdfQueryComplete: rdfQueryComplete,
            result: queryResult,
            completed: rdfQueryComplete
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