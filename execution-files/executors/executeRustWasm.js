const { readStringFromMemoryRust, writeStringToMemoryRust } = require('../memoryUtils');
const { executeRdfQuery } = require('../rdfQueryHandler');

/**
 * Executes a Rust-compiled WebAssembly module
 * @param {ArrayBuffer} wasmBuffer - The WebAssembly binary buffer
 * @returns {Promise<Object>} Execution result
 */
async function executeRustWasm(wasmBuffer) {
  console.log("Executing Rust-compiled WebAssembly module");

  try {
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
    const result = await WebAssembly.instantiate(wasmBuffer, importObject);
    const instance = result.instance;
    console.log("Available Rust exports:", Object.keys(instance.exports));

    // Execute test
    const testResult = await executeRustTest(instance);
    return testResult;
  } catch (error) {
    console.error("Error executing Rust WASM:", error);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Executes the Rust test function
 * @param {WebAssembly.Instance} instance - The WebAssembly instance
 * @returns {Promise<Object>} Test execution result
 */
async function executeRustTest(instance) {
  try {
    console.log("Running Rust SDK test");

    // Set up test parameters
    const amount = "100.00";
    const account = "account123";
    const { ptr: amountPtr, len: amountLen } = writeStringToMemoryRust(instance, amount);
    const { ptr: accountPtr, len: accountLen } = writeStringToMemoryRust(instance, account);

    // Execute test
    console.log("Calling run_test function");
    const queryPtr = instance.exports.run_test(amountPtr, amountLen, accountPtr, accountLen);
    const query = readStringFromMemoryRust(instance, queryPtr);
    console.log("Credit leg query:", query);

    // Execute RDF query
    let rdfQueryResult;
    try {
      rdfQueryResult = await executeRdfQuery(query);
      console.log("RDF query result:", rdfQueryResult);
    } catch (error) {
      console.error("Error executing RDF query:", error);
      rdfQueryResult = { error: error.message };
    }

    // Process results
    const { ptr: resultPtr, len: resultLen } = writeStringToMemoryRust(
      instance,
      JSON.stringify(rdfQueryResult)
    );
    
    console.log("Calling set_query_result function");
    const processedResultPtr = instance.exports.set_query_result(
      resultPtr,
      resultLen,
      amountPtr,
      amountLen
    );
    const processedResult = readStringFromMemoryRust(instance, processedResultPtr);
    console.log("Processed credit result:", processedResult);

    // Cleanup
    instance.exports.custom_dealloc_str(amountPtr);
    instance.exports.custom_dealloc_str(accountPtr);
    instance.exports.custom_dealloc_str(resultPtr);

    return {
      success: true,
      creditQuery: query,
      creditResult: processedResult
    };
  } catch (error) {
    console.error("Error executing Rust test:", error);
    return {
      success: false,
      error: error.message
    };
  }
}

module.exports = { executeRustWasm };