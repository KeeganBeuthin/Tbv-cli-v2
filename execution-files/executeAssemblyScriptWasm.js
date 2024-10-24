const { TextDecoder, TextEncoder } = require("util");

async function executeAssemblyScriptWasm(wasmBuffer, global) {
  let instance;
  let memoryBase = 0;
  const memory = new WebAssembly.Memory({ initial: 256, maximum: 512 });

  function readStringFromMemory(ptr, len, quiet = false) {
    const view = new Uint8Array(memory.buffer, ptr, len);
    const str = new TextDecoder().decode(view);
    if (!quiet) {
      console.log(`Read string from memory: "${str}" (length: ${len})`);
    }
    return str;
  }

  function writeStringToMemory(str) {
    console.log(`Writing string to memory: "${str}" (length: ${str.length})`);
    const encoder = new TextEncoder();
    const encodedStr = encoder.encode(str);
    let ptr = memoryBase;
    if (ptr === 0) {
      ptr = 1; // Ensure we're not using address 0
      console.log("Warning: Memory base was 0, adjusted to 1");
    }
    memoryBase += encodedStr.length + 1;

    if (memoryBase > memory.buffer.byteLength) {
      const pages = Math.ceil(
        (memoryBase - memory.buffer.byteLength) / 65536
      );
      memory.grow(pages);
    }

    new Uint8Array(memory.buffer).set(encodedStr, ptr);
    new Uint8Array(memory.buffer)[ptr + encodedStr.length] = 0;
    console.log(`String written to memory at address: ${ptr}`);
    return { ptr, len: encodedStr.length };
  }

  const importObject = {
    env: {
      abort: (message, fileName, lineNumber, columnNumber) => {
        console.error(
          `Abort called at ${fileName}:${lineNumber}:${columnNumber}: ${message}`
        );
      },
      logMessage: (ptr, len) => {
        const message = readStringFromMemory(ptr, len);
        console.log("WASM:", message);
      },
      "console.log": (ptr) => {
        const message = readStringFromMemory(ptr, -1);
        console.log("WASM console.log:", message);
      },
      memory: memory,
    },
    index: {
      executeRdfQuery: (queryPtr, queryLen) => {
        const query = readStringFromMemory(queryPtr, queryLen);
        console.log("Executing RDF query:", query);
        global.executeRdfQuery(query);
      },
      setFinalResult: (resultPtr, resultLen) => {
        const result = readStringFromMemory(resultPtr, resultLen);
        console.log("Final result:", result);
        global.setFinalResult(result);
      },
    },
  };

  console.log("Instantiating AssemblyScript WebAssembly module...");
  try {
    const result = await WebAssembly.instantiate(wasmBuffer, importObject);
    instance = result.instance;
    console.log("Available exports:", Object.keys(instance.exports));

    if (typeof instance.exports.main !== "function") {
      throw new Error("main function not found in exports");
    }

    global.runTest = () => {
      if (typeof instance.exports.runTest !== "function") {
        throw new Error("runTest function not found in exports");
      }
      console.log("Executing AssemblyScript runTest function");
      instance.exports.runTest();
    };

    global.setQueryResult = (result) => {
      console.log("JavaScript: setQueryResult called");
      console.log(`JavaScript: Result type: ${typeof result}`);
      console.log(`JavaScript: Result: ${result}`);
      const { ptr, len } = writeStringToMemory(result);
      if (ptr === 0) {
        console.error("Error: Received null pointer from writeStringToMemory");
        return;
      }
      console.log(`JavaScript: Calling WASM setQueryResult with ptr: ${ptr}, len: ${len}`);
      try {
        instance.exports.setQueryResult(ptr, len);
        console.log("JavaScript: WASM setQueryResult completed successfully");
      } catch (error) {
        console.error("JavaScript: Error in WASM setQueryResult:", error);
        console.error("JavaScript: Error details:", error.stack);
        // Try to read memory at the given pointer to see what's there
        try {
          const memoryView = new Uint8Array(instance.exports.memory.buffer);
          const bytes = memoryView.slice(ptr, ptr + len);
          console.log("JavaScript: Memory at ptr:", bytes);
        } catch (memoryError) {
          console.error("JavaScript: Error reading memory:", memoryError);
        }
      }
    };

    global.setFinalResult = (result) => {
      console.log(
        `JavaScript: setFinalResult called with result: ${result}`
      );
    };

    console.log("Executing AssemblyScript main function");
    instance.exports.main();

    console.log("Executing AssemblyScript runTest function");
    global.runTest();

    // Wait for asynchronous operations to complete
    await new Promise((resolve) => setTimeout(resolve, 5000));

    return {
      success: true,
      message: "AssemblyScript module executed successfully",
    };
  } catch (error) {
    console.error(
      "Error instantiating or executing AssemblyScript module:",
      error
    );
    return { success: false, error: error.message };
  }
}

module.exports = { executeAssemblyScriptWasm };
