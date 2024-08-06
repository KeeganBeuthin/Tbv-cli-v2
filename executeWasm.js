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
      console.log("JS: Writing amount string to memory (Rust)");
      const amountMem = writeStringToMemoryRust(amount);
      console.log("JS: Writing account string to memory (Rust)");
      const accountMem = writeStringToMemoryRust(account);

      console.log("JS: Calling execute_credit_leg (Rust)");
      creditResultPtr = instance.exports.execute_credit_leg(
        amountMem.ptr,
        amountMem.len,
        accountMem.ptr,
        accountMem.len
      );
      console.log("JS: Reading credit result from memory (Rust)");
      creditResult = readStringFromMemoryRust(creditResultPtr);
      console.log("Result of execute_credit_leg:", creditResult);

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

      console.log("JS: Calling add_to_list (Rust)");
      const addItemMem = writeStringToMemoryRust("grape");
      const addResultPtr = instance.exports.add_to_list(
        addItemMem.ptr,
        addItemMem.len
      );
      const addResult = readStringFromMemoryRust(addResultPtr);
      console.log(
        "Result of add_to_list:",
        await callApiAddToList(addResult.split(":")[1])
      );

      console.log("JS: Calling delete_from_list (Rust)");
      const deleteItemMem = writeStringToMemoryRust("banana");
      const deleteResultPtr = instance.exports.delete_from_list(
        deleteItemMem.ptr,
        deleteItemMem.len
      );
      const deleteResult = readStringFromMemoryRust(deleteResultPtr);
      console.log(
        "Result of delete_from_list:",
        await callApiDeleteFromList(deleteResult.split(":")[1])
      );

      console.log("JS: Calling get_from_list (Rust)");
      const getIndexMem = writeStringToMemoryRust("1");
      const getResultPtr = instance.exports.get_from_list(
        getIndexMem.ptr,
        getIndexMem.len
      );
      const getResult = readStringFromMemoryRust(getResultPtr);
      console.log(
        "Result of get_from_list:",
        await callApiGetFromList(parseInt(getResult))
      );

      // Add more test cases
      console.log("JS: Adding another item (Rust)");
      const addItemMem2 = writeStringToMemoryRust("kiwi");
      const addResultPtr2 = instance.exports.add_to_list(
        addItemMem2.ptr,
        addItemMem2.len
      );
      const addResult2 = readStringFromMemoryRust(addResultPtr2);
      console.log(
        "Result of add_to_list:",
        await callApiAddToList(addResult2.split(":")[1])
      );

      console.log("JS: Getting item at index 3 (Rust)");
      const getIndexMem2 = writeStringToMemoryRust("3");
      const getResultPtr2 = instance.exports.get_from_list(
        getIndexMem2.ptr,
        getIndexMem2.len
      );
      const getResult2 = readStringFromMemoryRust(getResultPtr2);
      console.log(
        "Result of get_from_list:",
        await callApiGetFromList(parseInt(getResult2))
      );

      instance.exports.dealloc(addItemMem.ptr, addItemMem.len);
      instance.exports.dealloc(deleteItemMem.ptr, deleteItemMem.len);
      instance.exports.dealloc(getIndexMem.ptr, getIndexMem.len);
      instance.exports.dealloc(addItemMem2.ptr, addItemMem2.len);
      instance.exports.dealloc(getIndexMem2.ptr, getIndexMem2.len);

      console.log("JS: Running Book Tests (Rust)");
      const booksData = await getRDFData();
      console.log("Initial Books Data:", booksData);
      const booksDataMem = writeStringToMemoryRust(booksData);
      const booksResultPtr = instance.exports.Rdf_Test(
        booksDataMem.ptr,
        booksDataMem.len
      );
      const booksTestResult = readStringFromMemoryRust(booksResultPtr);
      console.log("Books Test Result:", booksTestResult);

      // Add a new book
      console.log("JS: Adding a new book");
      const newBookTitle = "New Book Title";
      const newBookAuthor = "New Book Author";
      const addBookMem = writeStringToMemoryRust(
        JSON.stringify({ title: newBookTitle, authorName: newBookAuthor })
      );
      const addBookResultPtr = instance.exports.add_book(
        addBookMem.ptr,
        addBookMem.len
      );
      const addBookResult = readStringFromMemoryRust(addBookResultPtr);
      console.log("Add Book Result:", addBookResult);
      await addBook(newBookTitle, newBookAuthor);

      // Delete a book
      console.log("JS: Deleting a book");
      const deleteBookMem = writeStringToMemoryRust("To Kill a Mockingbird");
      const deleteBookResultPtr = instance.exports.delete_book(
        deleteBookMem.ptr,
        deleteBookMem.len
      );
      const deleteBookResult = readStringFromMemoryRust(deleteBookResultPtr);
      console.log("Delete Book Result:", deleteBookResult);
      await deleteBook("To Kill a Mockingbird");

      // Get a book
      console.log("JS: Getting a book");
      const getBookMem = writeStringToMemoryRust("1984");
      const getBookResultPtr = instance.exports.get_book(
        getBookMem.ptr,
        getBookMem.len
      );
      const getBookResult = readStringFromMemoryRust(getBookResultPtr);
      console.log("Get Book Result:", getBookResult);
      const apiGetBookResult = await getBook("1984");
      console.log("API Get Book Result:", apiGetBookResult);

      instance.exports.dealloc(booksDataMem.ptr, booksDataMem.len);
      instance.exports.dealloc(addBookMem.ptr, addBookMem.len);
      instance.exports.dealloc(deleteBookMem.ptr, deleteBookMem.len);
      instance.exports.dealloc(getBookMem.ptr, getBookMem.len);
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
