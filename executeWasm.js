const fs = require("fs");
const { promisify } = require("util");
const { TextDecoder, TextEncoder } = require("util");
const axios = require("axios");
const util = require("util");
const { spawn } = require("child_process");
const readFile = util.promisify(fs.readFile);

let apiServer = null;

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

  try {
    const wasmBuffer = await promisify(fs.readFile)(filePath);

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
        "runtime.ticks": () => {},
        "runtime.sleepTicks": () => {},
        "syscall/js.valueGet": () => {},
        "syscall/js.valuePrepareString": () => {},
        "syscall/js.valueLoadString": () => {},
        "syscall/js.finalizeRef": () => {},
        "syscall/js.stringVal": () => {},
        "syscall/js.valueSet": () => {},
        "syscall/js.valueNew": () => {},
        "syscall/js.valueLength": () => {},
        "syscall/js.valueIndex": () => {},
        "syscall/js.valueCall": () => {},
        "syscall/js.valueSetIndex": () => {},
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

    async function makeTbvCliCall(action, data) {
      return new Promise((resolve, reject) => {
        console.log(`Executing TBV-CLI command: ${action} with data: ${data}`);
        const child = spawn("node", ["index.js", action, data]);

        let output = "";
        child.stdout.on("data", (data) => {
          output += data.toString();
          console.log(`TBV-CLI output: ${data}`);
        });

        child.stderr.on("data", (data) => {
          console.error(`TBV-CLI Error: ${data}`);
        });

        child.on("close", (code) => {
          if (code !== 0) {
            reject(new Error(`TBV-CLI process exited with code ${code}`));
          } else {
            console.log("Full TBV-CLI output:", output);
            try {
              const resultStart = output.indexOf("RDF Query Result:");
              if (resultStart !== -1) {
                const resultJson = output
                  .slice(resultStart + "RDF Query Result:".length)
                  .trim();
                console.log(`Parsed TBV-CLI result: ${resultJson}`);
                resolve(resultJson);
              } else {
                reject(
                  new Error("Failed to find RDF Query Result in TBV-CLI output")
                );
              }
            } catch (error) {
              reject(
                new Error("Failed to parse TBV-CLI output: " + error.message)
              );
            }
          }
        });
      });
    }

    const { instance } = await WebAssembly.instantiate(
      wasmBuffer,
      importObject
    );
    console.log('Available exports:', Object.keys(instance.exports));
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

      console.log('Writing to Rust memory:', str);
      console.log('Instance:', instance);
      console.log('Instance exports:', instance.exports);
      console.log('Alloc function:', instance.exports.alloc);
      if (!instance || !instance.exports) {
        console.error('Error: WebAssembly instance not available');
        return null;
      }
      if (typeof instance.exports.alloc !== 'function') {
        console.error('Error: alloc function not available in exports');
        console.log('Available exports:', Object.keys(instance.exports));
        return null;
      }
    
      const encoder = new TextEncoder();
      const encodedStr = encoder.encode(str + '\0'); // Null-terminated string
      const len = encodedStr.length;
    
      // Allocate memory in the Rust-compiled WebAssembly module
      const ptr = instance.exports.alloc(len);
    
      // Write the string to the allocated memory
      const memory = new Uint8Array(instance.exports.memory.buffer);
      for (let i = 0; i < len; i++) {
        memory[ptr + i] = encodedStr[i];
      }
    
      console.log(`JS: Wrote string "${str}" to Rust memory at address ${ptr} with length ${len}`);
    
      // Return both the pointer and the length, which is useful for Rust FFI
      return { ptr, len: len - 1 }; // Subtract 1 to not count null terminator in length
    }

    async function makeTbvCliCallSync(action, data) {
      console.log(`Executing TBV-CLI command: ${action} with data: ${data}`);
      const { exec } = require("child_process");

      return new Promise((resolve, reject) => {
        exec(`node index.js ${action} '${data}'`, (error, stdout, stderr) => {
          if (error) {
            console.error(`Error executing TBV-CLI command: ${error.message}`);
            reject(error);
            return;
          }
          if (stderr) {
            console.error(`TBV-CLI stderr: ${stderr}`);
          }
          console.log(`TBV-CLI stdout: ${stdout}`);

          try {
            const resultStart = stdout.indexOf("RDF Query Result:");
            if (resultStart !== -1) {
              const resultJson = stdout
                .slice(resultStart + "RDF Query Result:".length)
                .trim();
              console.log(`Parsed TBV-CLI result: ${resultJson}`);
              resolve(resultJson);
            } else {
              reject(
                new Error("Failed to find RDF Query Result in TBV-CLI output")
              );
            }
          } catch (parseError) {
            console.error("Error parsing TBV-CLI output:", parseError);
            reject(parseError);
          }
        });
      });
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
    console.log("Successfully called alloc function. Returned pointer:", ptr);
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
    throw new Error('Failed to write RDF query result to memory');
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
