const { TextDecoder, TextEncoder } = require("util");

async function executeRustWasm(wasmBuffer, global) {
  let instance;
  let lastQueryResult = null;

  function readStringFromMemoryRust(ptr) {
    const memory = new Uint8Array(instance.exports.memory.buffer);
    let len = 0;
    while (memory[ptr + len] !== 0) len++;
    return new TextDecoder().decode(memory.subarray(ptr, ptr + len));
  }

  function writeStringToMemoryRust(str) {
    const encoder = new TextEncoder();
    const encodedStr = encoder.encode(str + "\0");
    const ptr = instance.exports.alloc(encodedStr.length);
    const memory = new Uint8Array(instance.exports.memory.buffer);
    memory.set(encodedStr, ptr);
    return { ptr, len: encodedStr.length - 1 };
  }

  const importObject = {
    env: {
      log_message: (ptr, len) => {
        console.log("Rust log_message called with ptr:", ptr, "len:", len);
        const memory = new Uint8Array(instance.exports.memory.buffer);
        const slice = memory.subarray(ptr, ptr + len);
        console.log("Rust log:", new TextDecoder().decode(slice));
      },
    },
  };

  console.log("Instantiating Rust WebAssembly module...");
  try {
    const result = await WebAssembly.instantiate(wasmBuffer, importObject);
    instance = result.instance;
    console.log("Available Rust exports:", Object.keys(instance.exports));

    // Define setQueryResult after instance is created
    global.setQueryResult = (result) => {
      console.log("JavaScript: setQueryResult called with result:", result);
      lastQueryResult = result; // Store the result for later use
      if (typeof instance.exports.set_query_result !== "function") {
        throw new Error("set_query_result function not found in exports");
      }
      const { ptr, len } = writeStringToMemoryRust(result);
      console.log(`JavaScript: Calling WASM set_query_result with ptr: ${ptr}, len: ${len}`);
      instance.exports.set_query_result(ptr, len);
      console.log("JavaScript: WASM set_query_result finished");
      instance.exports.custom_dealloc_str(ptr);
    };

    global.runTest = async () => {
      console.log("Running Rust SDK test");

      const amount = "100.00";
      const account = "account123";
      const { ptr: amountPtr, len: amountLen } = writeStringToMemoryRust(amount);
      const { ptr: accountPtr, len: accountLen } = writeStringToMemoryRust(account);

      console.log("Calling run_test function");
      const queryPtr = instance.exports.run_test(amountPtr, amountLen, accountPtr, accountLen);
      const query = readStringFromMemoryRust(queryPtr);
      console.log("Credit leg query:", query);

      let rdfQueryResult;
      try {
        rdfQueryResult = await global.executeRdfQuery(query);
        console.log("RDF query result:", rdfQueryResult);
      } catch (error) {
        console.error("Error executing RDF query:", error);
        rdfQueryResult = { error: error.message };
      }

      // Use the stored lastQueryResult instead of rdfQueryResult
      const resultJson = lastQueryResult || JSON.stringify(rdfQueryResult);
      const { ptr: resultPtr, len: resultLen } = writeStringToMemoryRust(resultJson);
      console.log("Calling set_query_result function");
      const processedResultPtr = instance.exports.set_query_result(resultPtr, resultLen, amountPtr, amountLen);
      const processedResult = readStringFromMemoryRust(processedResultPtr);
      console.log("Processed credit result:", processedResult);

      instance.exports.custom_dealloc_str(amountPtr);
      instance.exports.custom_dealloc_str(accountPtr);
      instance.exports.custom_dealloc_str(resultPtr);
      instance.exports.custom_dealloc_str(processedResultPtr);

      return {
        creditQuery: query,
        creditResult: processedResult,
      };
    };

    console.log("Executing Rust runTest function");
    const testResult = await global.runTest();
    console.log("Rust test results:", testResult);
    return {
      success: true,
      message: "Rust module executed successfully",
      result: testResult,
    };
  } catch (error) {
    console.error("Error instantiating or executing Rust module:", error);
    return { success: false, error: error.message };
  }
}

module.exports = { executeRustWasm };
