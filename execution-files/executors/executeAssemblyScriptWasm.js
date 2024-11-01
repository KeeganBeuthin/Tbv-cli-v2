const { readStringFromMemory, writeStringToMemory } = require('../memoryUtils');

/**
 * Executes an AssemblyScript-compiled WebAssembly module
 * @param {ArrayBuffer} wasmBuffer - The WebAssembly binary buffer
 * @returns {Promise<Object>} Execution result
 */
async function executeAssemblyScriptWasm(wasmBuffer) {
  console.log("Executing AssemblyScript-compiled WebAssembly module");

  try {
    let instance;
    let memoryBase = 0;
    const memory = new WebAssembly.Memory({ initial: 256, maximum: 512 });

    const importObject = {
      env: {
        abort: (message, fileName, lineNumber, columnNumber) => {
          console.error(
            `Abort called at ${fileName}:${lineNumber}:${columnNumber}: ${message}`
          );
        },
        logMessage: (ptr, len) => {
          const message = readStringFromMemory(instance, ptr, len, true);
          console.log("WASM:", message);
        },
        "console.log": (ptr) => {
          let len = 0;
          const view = new Uint8Array(memory.buffer, ptr);
          while (view[len] !== 0) len++;
          const str = readStringFromMemory(instance, ptr, len, true);
          console.log("WASM console.log:", str);
        },
        memory: memory,
      },
      index: {
        executeRdfQuery: (queryPtr, queryLen) => {
          const query = readStringFromMemory(instance, queryPtr, queryLen);
          console.log("Executing RDF query:", query);
          global.executeRdfQuery(query);
        },
        setFinalResult: (resultPtr, resultLen) => {
          const result = readStringFromMemory(instance, resultPtr, resultLen);
          console.log("Final result:", result);
          global.setFinalResult(result);
        },
      },
    };

    console.log("Instantiating AssemblyScript WebAssembly module...");
    const result = await WebAssembly.instantiate(wasmBuffer, importObject);
    instance = result.instance;
    console.log("Available exports:", Object.keys(instance.exports));

    // Set up global functions
    global.runTest = () => {
      if (typeof instance.exports.runTest !== "function") {
        throw new Error("runTest function not found in exports");
      }
      console.log("Executing AssemblyScript runTest function");
      instance.exports.runTest();
    };

    global.setQueryResult = (result) => {
      console.log("JavaScript: setQueryResult called");
      if (typeof instance.exports.setQueryResult !== "function") {
        throw new Error("setQueryResult function not found in exports");
      }
      const { ptr, len } = writeStringToMemory(instance, result);
      console.log(
        `JavaScript: Calling WASM setQueryResult with ptr: ${ptr}, len: ${len}`
      );
      instance.exports.setQueryResult(ptr, len);
      console.log("JavaScript: WASM setQueryResult finished");
    };

    // Execute main and test functions
    console.log("Executing AssemblyScript main function");
    instance.exports.main();

    console.log("Executing AssemblyScript runTest function");
    global.runTest();

    // Wait for asynchronous operations to complete
    await new Promise((resolve) => setTimeout(resolve, 5000));

    return {
      success: true,
      message: "AssemblyScript module executed successfully"
    };
  } catch (error) {
    console.error("Error executing AssemblyScript WASM:", error);
    return {
      success: false,
      error: error.message
    };
  }
}

module.exports = { executeAssemblyScriptWasm };