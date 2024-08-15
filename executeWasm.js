const fs = require("fs");
const { promisify } = require("util");
const { TextDecoder, TextEncoder } = require("util");
const axios = require("axios");
const util = require("util");
const { spawn } = require("child_process");
const readFile = util.promisify(fs.readFile);
const crypto = require("crypto");
if (typeof globalThis.crypto !== "object") {
  globalThis.crypto = {
    getRandomValues(buffer) {
      return crypto.randomFillSync(buffer);
    },
  };
}

let apiServer = null;

require("./wasm_exec.js");
/** @type {typeof import('./wasm_exec').Go} */
const Go = globalThis.Go;

console.log('wasm_exec.js loaded successfully');
console.log(Go)
if (typeof Go !== 'function') {
  console.error('Go class is not defined. Make sure wasm_exec.js is loaded correctly.');
}

async function isGoWasm(wasmBuffer) {
  try {
    const module = await WebAssembly.compile(wasmBuffer);
    const exports = WebAssembly.Module.exports(module);
    
    console.log('Available exports:', exports.map(exp => exp.name));

    // Check for Go-specific exports
    const requiredExports = ["run", "resume", "getsp", "mem"];
    const hasAllExports = requiredExports.every(
      (exp) => exports.some(e => e.name === exp)
    );
    console.log('Has all required exports:', hasAllExports);

    return hasAllExports;
  } catch (error) {
    console.error("Error during Go WASM detection:", error);
    return false;
  }
}

async function executeRdfQuery(query) {
  try {
    const response = await axios.post('http://127.0.0.1:3000/rdf/query', { query });
    return response.data;
  } catch (error) {
    console.error('Error executing RDF query:', error);
    throw error;
  }
}

async function startApiServer() {
  if (apiServer) {
    console.log("API server already running");
    return apiServer;
  }
  const { server, closeServer } = require("./simpleApi");
  apiServer = { server, closeServer };
  return new Promise((resolve) => {
    server.on("listening", () => {
      console.log("Mock API server is now running on http://127.0.0.1:3000");
      resolve(apiServer);
    });
  });
}

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function executeWasmFile(filePath) {
  let apiServerInstance;
  let rdfQueryComplete = false;
  const rdfQueryPromise = new Promise((resolve) => {
    global.resolveRdfQuery = () => {
      rdfQueryComplete = true;
      resolve();
    };
  });

  global.executeRdfQuery = async (query) => {
    try {
      const result = await executeRdfQuery(query);
      global.setQueryResult(JSON.stringify(result));
    } catch (error) {
      console.error('Error executing RDF query:', error);
      global.setQueryResult(JSON.stringify({ error: error.message }));
    }
  };
  
  global.setFinalResult = (result) => {
    console.log('Final result:', result);
    // You can do something with the final result here
  };
  
  try {

    
    const wasmBuffer = await promisify(fs.readFile)(filePath);

    const isGoModule = await isGoWasm(wasmBuffer);


    if (isGoModule) {
      console.log('Detected Go-compiled WebAssembly module');
      const go = new Go();
      
      let memory = new WebAssembly.Memory({ initial: 256, maximum: 256 });
      let heap = new Uint8Array(memory.buffer);
      let heapNext = 1;

      function malloc(size) {
        const addr = heapNext;
        heapNext += size;
        if (heapNext > heap.length) {
          console.error('Out of memory');
          return 0;
        }
        return addr;
      }

      const importObject = {
        ...go.importObject,
        env: {
          ...go.importObject.env,
          // Add missing functions
          malloc: (size) => {
            console.log('malloc called with size:', size);
            return malloc(size);
          },
          free: (ptr) => {
            console.log('free called with ptr:', ptr);
            // In this simple implementation, we don't actually free memory
          },
          query_rdf_tbv_cli: (queryPtr, queryLen) => {
            const query = go.mem.loadString(queryPtr, queryLen);
            console.log("Executing RDF query via TBV-CLI:", query);
          
            executeRdfQuery(query)
              .then(result => {
                console.log("RDF query result:", result);
                const resultJson = JSON.stringify(result);
                const resultPtr = go.mem.stringToPtr(resultJson);
                go._resolveCallbackPromise(resultPtr);
              })
              .catch(error => {
                console.error("Error executing RDF query:", error);
                const errorJson = JSON.stringify({ error: error.message });
                const errorPtr = go.mem.stringToPtr(errorJson);
                go._resolveCallbackPromise(errorPtr);
              });
          
            return 0;
          },
          'syscall/js.valueGet': () => {},
          'syscall/js.valueSet': () => {},
          'syscall/js.valueIndex': () => {},
          'syscall/js.valueSetIndex': () => {},
          'syscall/js.valueCall': () => {},
          'syscall/js.valueNew': () => {},
          'syscall/js.valueLength': () => {},
          'syscall/js.valuePrepareString': () => {},
          'syscall/js.valueLoadString': () => {},
          'syscall/js.stringVal': () => {},
          'syscall/js.valueInstanceOf': () => {},
          'syscall/js.copyBytesToGo': () => {},
          'syscall/js.copyBytesToJS': () => {},
        },
      };

      console.log('Instantiating Go WebAssembly module...');
      console.log('Import object keys:', Object.keys(importObject));
      console.log('Env keys:', Object.keys(importObject.env));

      const result = await WebAssembly.instantiate(wasmBuffer, importObject);
      
      console.log('Go WebAssembly module instantiated successfully');
      console.log('Available exports:', Object.keys(result.instance.exports));
    
      // Run the Go program
      console.log('Running Go program...');
      const runPromise = go.run(result.instance);
    
      // Wait a short time for the Go program to set up
      await new Promise(resolve => setTimeout(resolve, 100));
    
      // After running, the global scope should have the 'runTest' function
      if (typeof global.runTest === 'function') {
        console.log('Executing runTest function...');
        try {
          const testResult = global.runTest();
          console.log('runTest raw result:', testResult);
          if (testResult) {
            try {
              const parsedResult = JSON.parse(testResult);
              console.log('runTest parsed result:', parsedResult);
            } catch (parseError) {
              console.error('Error parsing runTest result:', parseError);
              console.log('Unparsed result:', testResult);
            }
          } else {
            console.log('runTest returned null or undefined');
          }
        } catch (error) {
          console.error('Error executing runTest function:', error);
        }
      } else {
        console.log('runTest function not found in global scope');
      }
    
      // Wait for the Go program to complete (or timeout after 10 seconds)
      try {
        await Promise.race([
          runPromise,
          new Promise((_, reject) => setTimeout(() => reject(new Error('Go program execution timed out')), 10000))
        ]);
      } catch (error) {
        console.error('Error or timeout while running Go program:', error);
      }

      console.log('Go program execution completed or timed out');

      return { success: true, result: "Go program execution attempt completed" };
    }

    apiServerInstance = await startApiServer();



    console.log("Waiting for API server to fully start...");
    await delay(500);

    const importObject = {
      env: {
        abort: () => {
          console.error("Abort called");
        },
        logMessage: (ptr, len) => {
          const memory = new Uint8Array(instance.exports.memory.buffer);
          const message = new TextDecoder().decode(
            memory.subarray(ptr, ptr + len)
          );
          console.log("WASM:", message);
        },
        query_rdf: (queryPtr, queryLen) => {
          const query = readStringFromMemory(instance, queryPtr, queryLen);
          console.log("Executing RDF query:", query);

          // Simulate an RDF query (replace this with actual RDF query logic)
          const mockResult = JSON.stringify({ results: [{ balance: 1000 }] });
          const resultPtr = writeStringToMemory(instance, mockResult);
          return resultPtr;
        },
        query_rdf_tbv_cli: async (queryPtr, queryLen) => {
          const query = readStringFromMemory(instance, queryPtr, queryLen);
          console.log("Executing RDF query via TBV-CLI:", query);

          try {
            const result = await makeTbvCliCall("rdf-query", query);
            console.log("TBV-CLI result:", result);
            if (isTinyGo) {
              const resultPtr = writeStringToMemoryTinyGo(instance, result);
              console.log("Result written to memory at pointer:", resultPtr);
              return resultPtr;
            } else if (isAssemblyScript) {
              const resultPtr = writeStringToMemory(instance, result);
              console.log("Result written to memory at pointer:", resultPtr);
              return resultPtr;
            }
          } catch (error) {
            console.error("Error executing RDF query via TBV-CLI:", error);
            return 0;
          }
        },

        set_query_result: (resultPtr) => {
          const result = readStringFromMemory(
            instance,
            resultPtr,
            instance.exports.getStringLen(resultPtr)
          );
          console.log("Credit leg result:", result);
        },

        query_rdf_tbv_cli: async (queryPtr, queryLen) => {
          const query = readStringFromMemory(instance, queryPtr, queryLen);
          console.log("Executing RDF query via TBV-CLI:", query);
          try {
            const result = await makeTbvCliCall("rdf-query", query);
            console.log("TBV-CLI result:", result);
            let resultPtr;
            if (isTinyGo) {
              resultPtr = writeStringToMemoryTinyGo(result); // Remove 'instance' parameter
            } else if (isAssemblyScript) {
              resultPtr = writeStringToMemory(instance, result);
            }
            console.log("Result written to memory at pointer:", resultPtr);
            global.resolveRdfQuery(); // Signal that the RDF query is complete
            return resultPtr;
          } catch (error) {
            console.error("Error executing RDF query via TBV-CLI:", error);
            return 0;
          }
        },

        get_result_row: (resultPtr) => {
          const results = JSON.parse(readStringFromMemory(instance, resultPtr));
          if (results.length > 0) {
            const row = results.shift();
            const rowStr = JSON.stringify(row);
            const rowPtr = instance.exports.allocateString(rowStr.length);
            writeStringToMemory(instance, rowStr, rowPtr);
            return rowPtr;
          }
          return 0;
        },
        free_result: (resultPtr) => {
          console.log("Freeing result at:", resultPtr);
          // In a real implementation, you might want to properly deallocate memory
        },
        log_message: (ptr, len) => {
          const memory = new Uint8Array(instance.exports.memory.buffer);
          const message = new TextDecoder().decode(
            memory.subarray(ptr, ptr + len)
          );
          console.log("Rust log:", message);
        },
      },
      gojs: {
        "malloc": () => {},
        "runtime.ticks": () => {},
        "runtime.scheduleTimeoutEvent": () => {},
        "runtime.clearTimeoutEvent": () => {},
        "runtime.resetMemoryDataView": () => {},
        "runtime.getRandomData": () => {},
        "runtime.nanotime1": () => {},
        "runtime.wasmExit": () => {},
        "runtime.walltime": () => {},
        "runtime.wasmWrite": () => {},
        "runtime.sleepTicks": () => {},
        "syscall/js.valueGet": () => {},
        "syscall/js.copyBytesToJS": () => {},
        "syscall/js.valuePrepareString": () => {},
        "syscall/js.valueLoadString": () => {},
        "syscall/js.finalizeRef": () => {},
        "syscall/js.stringVal": () => {},
        "syscall/js.valueSet": () => {},
        "syscall/js.valueNew": () => {},
        "syscall/js.valueLength": () => {},
        "syscall/js.valueIndex": () => {},
        "syscall/js.valueCall": () => {},
        "syscall/js.valueIndex": () => {},
        "syscall/js.valueSetIndex": () => {},
        "malloc": () => {},
        "env": () => {},
      },
      wbg: {
        __wbg_new_abda76e883ba8a5f: () => {},
        __wbg_stack_658279fe44541cf6: () => {},
        __wbg_error_f851667af71bcfc6: () => {},
        __wbindgen_object_drop_ref: () => {},
      },
      __wbindgen_placeholder__: {
        __wbg_new_abda76e883ba8a5f: () => {},
        __wbg_stack_658279fe44541cf6: () => {},
        __wbg_error_f851667af71bcfc6: () => {},
        __wbindgen_object_drop_ref: () => {},
      },
      wasi_snapshot_preview1: {
        args_get: () => {},
        args_sizes_get: () => {},
        environ_get: () => {},
        environ_sizes_get: () => {},
        clock_res_get: () => {},
        clock_time_get: () => {},
        fd_advise: () => {},
        fd_close: () => {},
        fd_datasync: () => {},
        fd_fdstat_get: () => {},
        fd_fdstat_set_flags: () => {},
        fd_filestat_get: () => {},
        fd_filestat_set_size: () => {},
        fd_filestat_set_times: () => {},
        fd_pread: () => {},
        fd_prestat_get: () => {},
        fd_prestat_dir_name: () => {},
        fd_pwrite: () => {},
        fd_read: () => {},
        fd_readdir: () => {},
        fd_seek: () => {},
        fd_sync: () => {},
        fd_tell: () => {},
        fd_write: () => {},
        path_create_directory: () => {},
        path_filestat_get: () => {},
        path_filestat_set_times: () => {},
        path_link: () => {},
        path_open: () => {},
        path_readlink: () => {},
        path_remove_directory: () => {},
        path_rename: () => {},
        path_symlink: () => {},
        path_unlink_file: () => {},
        poll_oneoff: () => {},
        proc_exit: () => {},
        sched_yield: () => {},
        random_get: () => {},
        sock_accept: () => {},
        sock_recv: () => {},
        sock_send: () => {},
        sock_shutdown: () => {},
      },
    };

    const { instance } = await WebAssembly.instantiate(
      wasmBuffer,
      importObject
    );
    console.log("Available exports:", Object.keys(instance.exports));
    const { memory } = instance.exports;

    console.log(`Initial memory size: ${memory.buffer.byteLength} bytes`);

    const isTinyGo = typeof instance.exports.TinyGo === "function";
    const isRust = typeof instance.exports.alloc === "function";
    const isAssemblyScript = !isTinyGo && !isRust;

    function readStringFromMemory(instance, ptr, maxLen) {
      console.log(
        `JS: Reading string from memory at ${ptr} with max length ${maxLen}`
      );
      if (ptr === 0) {
        console.log("JS: Received null pointer");
        return "";
      }
      const memory = new Uint8Array(instance.exports.memory.buffer);
      let end = ptr;
      while (end < ptr + maxLen && memory[end] !== 0) {
        end++;
      }
      const str = new TextDecoder().decode(memory.subarray(ptr, end));
      console.log(`JS: Read string: "${str}"`);
      return str;
    }

    function writeStringToMemoryTinyGo(str) {
      console.log(`JS: Writing string "${str}" to memory (TinyGo)`);
      const encoder = new TextEncoder();
      const encodedStr = encoder.encode(str + "\0");
      const ptr = instance.exports.malloc(encodedStr.length);
      const memory = new Uint8Array(instance.exports.memory.buffer);
      memory.set(encodedStr, ptr);
      console.log(
        `JS: Allocated string at ${ptr} with length ${encodedStr.length}`
      );
      return { ptr, length: encodedStr.length - 1 }; // Subtract 1 to exclude null terminator
    }

    function readStringFromMemoryTinyGo(ptr, maxLen) {
      console.log(
        `JS: Reading string from memory at ${ptr} with max length ${maxLen} (TinyGo)`
      );
      if (ptr === 0) {
        console.log("JS: Received null pointer");
        return "";
      }
      const view = new Uint8Array(instance.exports.memory.buffer);
      let len = 0;
      while (len < maxLen && view[ptr + len] !== 0) {
        len++;
      }
      const str = new TextDecoder().decode(view.subarray(ptr, ptr + len));
      console.log(`JS: Read string: "${str}"`);
      return str;
    }

    function writeStringToMemory(instance, str) {
      console.log(`JS: Writing string "${str}" to memory`);
      const encoder = new TextEncoder();
      const encodedStr = encoder.encode(str);
      const ptr = instance.exports.allocateString(encodedStr.length);
      new Uint8Array(instance.exports.memory.buffer).set(encodedStr, ptr);
      console.log(`JS: Allocated string at ${ptr}`);
      return ptr;
    }

    function readStringFromMemoryRust(ptr) {
      console.log(`JS: Reading string from memory at ${ptr} (Rust)`);
      let len = 0;
      while (new Uint8Array(memory.buffer)[ptr + len] !== 0) len++;
      const buffer = new Uint8Array(memory.buffer, ptr, len);
      const str = new TextDecoder().decode(buffer);
      console.log(`JS: Read string: "${str}"`);
      return str;
    }

    function writeStringToMemoryRust(instance, str) {
      console.log("Writing to Rust memory:", str);
      console.log("Instance:", instance);
      console.log("Instance exports:", instance.exports);
      console.log("Alloc function:", instance.exports.alloc);
      if (!instance || !instance.exports) {
        console.error("Error: WebAssembly instance not available");
        return null;
      }
      if (typeof instance.exports.alloc !== "function") {
        console.error("Error: alloc function not available in exports");
        console.log("Available exports:", Object.keys(instance.exports));
        return null;
      }

      const encoder = new TextEncoder();
      const encodedStr = encoder.encode(str + "\0"); // Null-terminated string
      const len = encodedStr.length;

      // Allocate memory in the Rust-compiled WebAssembly module
      const ptr = instance.exports.alloc(len);

      // Write the string to the allocated memory
      const memory = new Uint8Array(instance.exports.memory.buffer);
      for (let i = 0; i < len; i++) {
        memory[ptr + i] = encodedStr[i];
      }

      console.log(
        `JS: Wrote string "${str}" to Rust memory at address ${ptr} with length ${len}`
      );

      // Return both the pointer and the length, which is useful for Rust FFI
      return { ptr, len: len - 1 }; // Subtract 1 to not count null terminator in length
    }

    const amount = "100";
    const account = "1234567";

    let amountPtr,
      accountPtr,
      creditResultPtr,
      debitResultPtr,
      creditResult,
      debitResult;

    if (isAssemblyScript) {
      // AssemblyScript logic

      const amountPtr = writeStringToMemory(instance, amount);
      const accountPtr = writeStringToMemory(instance, account);

      importObject.env.query_rdf_tbv_cli = (queryPtr, queryLen) => {
        const query = readStringFromMemoryTinyGo(queryPtr, queryLen);
        console.log("Executing RDF query via TBV-CLI (TinyGo):", query);

        let result;
        try {
          result = makeTbvCliCallSync("rdf-query", query);
          console.log("TBV-CLI result:", result);
        } catch (error) {
          console.error("Error executing RDF query via TBV-CLI:", error);
          result = JSON.stringify({ error: error.message });
        }

        const resultMem = writeStringToMemoryTinyGo(result);
        return resultMem.ptr;
      };

      console.log("JS: Calling execute_credit_leg");
      const queryPtr = instance.exports.execute_credit_leg(
        amountPtr,
        accountPtr
      );
      const query = readStringFromMemory(
        instance,
        queryPtr,
        instance.exports.getStringLen(queryPtr)
      );
      console.log("Generated RDF query:", query);

      // Execute the query using TBV-CLI
      console.log("JS: Executing RDF query via TBV-CLI");
      try {
        const result = await makeTbvCliCall("rdf-query", query);
        console.log("TBV-CLI result:", result);

        // Pass the result back to WebAssembly
        const resultPtr = writeStringToMemory(instance, result);
        const processedResult =
          instance.exports.process_credit_result(resultPtr);
        const processedResultStr = readStringFromMemory(
          instance,
          processedResult,
          instance.exports.getStringLen(processedResult)
        );
        console.log("Processed result:", processedResultStr);
      } catch (error) {
        console.error("Error executing RDF query:", error);
      }

      console.log("JS: Calling execute_debit_leg");
      const debitResultPtr = instance.exports.execute_debit_leg(
        amountPtr,
        accountPtr
      );
      console.log("JS: Reading debit result from memory");
      const debitResult = readStringFromMemory(
        instance,
        debitResultPtr,
        instance.exports.getStringLen(debitResultPtr)
      );
      console.log("Result of execute_debit_leg:", debitResult);
    } else if (isTinyGo) {
      // TinyGo logic

      console.log("JS: Writing amount string to memory (TinyGo)");
      const amountMem = writeStringToMemoryTinyGo(amount);
      console.log("JS: Writing account string to memory (TinyGo)");
      const accountMem = writeStringToMemoryTinyGo(account);

      console.log("JS: Calling execute_credit_leg (TinyGo)");
      const queryPtr = instance.exports.execute_credit_leg(
        amountMem.ptr,
        amountMem.length,
        accountMem.ptr,
        accountMem.length
      );

      console.log("JS: Reading RDF query from memory (TinyGo)");
      const query = readStringFromMemory(instance, queryPtr, 1000);
      console.log("Generated RDF query:", query);

      console.log("JS: Executing RDF query via TBV-CLI");
      const result = await makeTbvCliCall("rdf-query", query);
      console.log("TBV-CLI result:", result);

      const resultMem = writeStringToMemoryTinyGo(result);

      console.log("JS: Calling process_credit_result (TinyGo)");
      const processedResultPtr = instance.exports.process_credit_result(
        resultMem.ptr
      );
      const processedResult = readStringFromMemory(
        instance,
        processedResultPtr,
        1000
      );
      console.log("Processed result:", processedResult);

      console.log("JS: Calling execute_debit_leg (TinyGo)");
      const debitResultPtr = instance.exports.execute_debit_leg(
        amountMem.ptr,
        amountMem.length,
        accountMem.ptr,
        accountMem.length
      );
      const debitResult = readStringFromMemory(instance, debitResultPtr, 1000);
      console.log("Result of execute_debit_leg:", debitResult);
    } else if (isRust) {
      // Rust logic

      const isRust = typeof instance.exports.alloc === "function";
      console.log("Is Rust:", isRust);

      try {
        const ptr = instance.exports.alloc(10);
        console.log(
          "Successfully called alloc function. Returned pointer:",
          ptr
        );
      } catch (error) {
        console.error("Error calling alloc function:", error);
      }

      console.log("JS: Writing amount string to memory (Rust)");
      const amountMem = writeStringToMemoryRust(instance, amount);
      console.log("JS: Writing account string to memory (Rust)");
      const accountMem = writeStringToMemoryRust(instance, account);

      console.log("JS: Calling execute_credit_leg (Rust)");
      const queryPtr = instance.exports.execute_credit_leg(
        amountMem.ptr,
        amountMem.len,
        accountMem.ptr,
        accountMem.len
      );
      console.log("JS: Reading RDF query from memory (Rust)");
      const query = readStringFromMemoryRust(queryPtr);
      console.log("Generated RDF query:", query);

      console.log("JS: Executing RDF query via TBV-CLI");
      const result = await makeTbvCliCall("rdf-query", query);
      console.log("TBV-CLI result:", result);

      console.log("JS: Writing RDF query result to memory (Rust)");
      const resultMem = writeStringToMemoryRust(instance, result); // Pass 'instance' here, not 'result'
      if (!resultMem) {
        throw new Error("Failed to write RDF query result to memory");
      }

      console.log("JS: Calling process_credit_result (Rust)");
      console.log("resultMem:", resultMem);
      console.log("amountMem:", amountMem);
      const processedResultPtr = instance.exports.process_credit_result(
        resultMem.ptr,
        resultMem.len,
        amountMem.ptr,
        amountMem.len
      );
      const processedResult = readStringFromMemoryRust(processedResultPtr);
      console.log("Processed result:", processedResult);

      console.log("JS: Calling execute_debit_leg (Rust)");
      debitResultPtr = instance.exports.execute_debit_leg(
        amountMem.ptr,
        amountMem.len,
        accountMem.ptr,
        accountMem.len
      );
      console.log("JS: Reading debit result from memory (Rust)");
      debitResult = readStringFromMemoryRust(debitResultPtr);
      console.log("Result of execute_debit_leg:", debitResult);

      instance.exports.dealloc(amountMem.ptr, amountMem.len);
      instance.exports.dealloc(accountMem.ptr, accountMem.len);
    }

    console.log(`Testing WASM file: ${filePath}`);

    console.log(
      "WebAssembly execution completed, waiting for RDF query to complete"
    );
    await Promise.race([
      rdfQueryPromise,
      delay(10000), // 10 second timeout
    ]);

    if (!rdfQueryComplete) {
      console.log("RDF query timed out");
    } else {
      console.log("RDF query completed successfully");
    }

    return { success: true, creditResult };
  } catch (error) {
    console.error("Error executing WASM file:", error);
    return { success: false, error: error.message };
  } finally {
    if (apiServerInstance) {
      console.log("Closing API server");
      apiServerInstance.closeServer();
    }
  }
}

module.exports = { executeWasmFile, startApiServer };
