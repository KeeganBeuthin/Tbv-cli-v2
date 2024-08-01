const fs = require("fs");
const { promisify } = require("util");
const { TextDecoder, TextEncoder } = require("util");
const axios = require("axios");
const { spawn } = require('child_process');


let apiServer = null;

function startApiServer() {
  if (!apiServer) {
    apiServer = require("./simpleApi");
    console.log("Mock API server is running on port 3000");
  }
}

async function executeWasmFile(filePath) {
  try {
    const wasmBuffer = await promisify(fs.readFile)(filePath);

    startApiServer();

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
        query_rdf_tbv_cli: async (queryPtr, queryLen, callbackPtr) => {
          const query = readStringFromMemory(instance, queryPtr, queryLen);
          console.log("Executing RDF query via TBV-CLI:", query);
          
          try {
            const result = await makeTbvCliCall('rdf-query', query);
            console.log("TBV-CLI result:", result);
            const resultPtr = writeStringToMemory(instance, result);
            instance.exports.process_credit_result(resultPtr);
          } catch (error) {
            console.error("Error executing RDF query via TBV-CLI:", error);
            instance.exports.process_credit_result(0);
          }
        },
        
        set_query_result: (resultPtr) => {
          const result = readStringFromMemory(instance, resultPtr, instance.exports.getStringLen(resultPtr));
          console.log("Credit leg result:", result);
        },

        query_rdf_go: (queryPtr, queryLen) => {
          const query = readStringFromMemoryTinyGo(queryPtr, queryLen);
          console.log("Executing RDF query (Go):", query);
          
          // Simulate an RDF query (replace this with actual RDF query logic)
          const mockResult = JSON.stringify({ results: [{ balance: 1000 }] });
          const resultMem = writeStringToMemoryTinyGo(mockResult);
          return resultMem.ptr;
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
        const child = spawn('node', ['index.js', action, data]);
        
        let output = '';
        child.stdout.on('data', (data) => {
          output += data.toString();
          console.log(`TBV-CLI output: ${data}`);
        });
    
        child.stderr.on('data', (data) => {
          console.error(`TBV-CLI Error: ${data}`);
        });
    
        child.on('close', (code) => {
          if (code !== 0) {
            reject(new Error(`TBV-CLI process exited with code ${code}`));
          } else {
            try {
              const resultStart = output.indexOf('RDF Query Result:');
              if (resultStart !== -1) {
                const resultJson = output.slice(resultStart + 'RDF Query Result:'.length).trim();
                console.log(`Parsed TBV-CLI result: ${resultJson}`);
                resolve(resultJson);
              } else {
                reject(new Error('Failed to find RDF Query Result in TBV-CLI output'));
              }
            } catch (error) {
              reject(new Error('Failed to parse TBV-CLI output: ' + error.message));
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

    function writeStringToMemory(instance, str) {
      console.log(`JS: Writing string "${str}" to memory`);
      const encoder = new TextEncoder();
      const encodedStr = encoder.encode(str);
      const ptr = instance.exports.allocateString(encodedStr.length);
      new Uint8Array(instance.exports.memory.buffer).set(encodedStr, ptr);
      console.log(`JS: Allocated string at ${ptr}`);
      return ptr;
    }

    function readStringFromMemory(instance, ptr, len) {
      console.log(`JS: Reading string from memory at ${ptr} with length ${len}`);
      if (ptr === 0 || len === 0) {
        console.log("JS: Received null or empty string");
        return "";
      }
      const buffer = new Uint8Array(instance.exports.memory.buffer, ptr, len);
      const str = new TextDecoder().decode(buffer);
      console.log(`JS: Read string: "${str}"`);
      return str;
    }

    function sanitizeString(str) {
      return str.replace(/[\x00-\x1F\x7F]/g, "");
    }



    async function addRDFData(data) {
      try {
        const response = await axios.post("http://localhost:3000/rdf", {
          data,
        });
        console.log("RDF data added:", response.data.message);
        return response.data.currentStore;
      } catch (error) {
        console.error("Error adding RDF data:", error);
        return null;
      }
    }

    async function queryRDFData(query) {
      try {
        const response = await axios.get("http://localhost:3000/rdf/query", {
          params: { query },
        });
        return response.data.result;
      } catch (error) {
        console.error("Error querying RDF data:", error);
        return null;
      }
    }

    async function getRDFData() {
      try {
        const response = await axios.get("http://localhost:3000/rdf");
        return response.data.data;
      } catch (error) {
        console.error("Error fetching RDF data:", error);
        return null;
      }
    }

    async function addBook(title, authorName) {
      try {
        const response = await axios.post("http://localhost:3000/books", { title, authorName });
        console.log("Book added:", response.data.message);
        return response.data.currentBooks;
      } catch (error) {
        console.error("Error adding book:", error);
        return null;
      }
    }

    async function deleteBook(title) {
      try {
        const response = await axios.delete(`http://localhost:3000/books/${encodeURIComponent(title)}`);
        console.log("Book deleted:", response.data.message);
        return response.data.currentBooks;
      } catch (error) {
        console.error("Error deleting book:", error);
        return null;
      }
    }

    async function getBook(title) {
      try {
        const response = await axios.get(`http://localhost:3000/books/${encodeURIComponent(title)}`);
        return response.data.book;
      } catch (error) {
        console.error("Error getting book:", error);
        return null;
      }
    }

    function writeStringToMemoryTinyGo(str) {
      console.log(`JS: Writing string "${str}" to memory (TinyGo)`);
      const encoder = new TextEncoder();
      const encodedStr = encoder.encode(str + '\0'); // Add null terminator
      const ptr = instance.exports.malloc(encodedStr.length);
      new Uint8Array(instance.exports.memory.buffer).set(encodedStr, ptr);
      console.log(`JS: Allocated string at ${ptr}`);
      return { ptr, length: encodedStr.length - 1 }; // Subtract 1 to exclude null terminator
    }

    function readStringFromMemoryTinyGo(ptr) {
      console.log(`JS: Reading string from memory at ${ptr} (TinyGo)`);
      let len = 0;
      const view = new Uint8Array(instance.exports.memory.buffer);
      while (view[ptr + len] !== 0) {
        len++;
      }
      const buffer = new Uint8Array(instance.exports.memory.buffer, ptr, len);
      const str = new TextDecoder().decode(buffer);
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

    async function callApiAddToList(item) {
      try {
        console.log("Sending item:", item);
        console.log("Item length:", item.length);
        console.log("Item bytes:", Buffer.from(item).toString("hex"));
        const response = await axios.post("http://localhost:3000/list", {
          item,
        });
        console.log(
          `Current list after adding ${item}:`,
          response.data.currentList
        );
        return response.data.message;
      } catch (error) {
        return `Error: ${error.response.data.error}`;
      }
    }

    async function callApiDeleteFromList(item) {
      try {
        const response = await axios.delete(
          `http://localhost:3000/list/${item}`
        );
        console.log(
          `Current list after deleting ${item}:`,
          response.data.currentList
        );
        return response.data.message;
      } catch (error) {
        return `Error: ${error.response.data.error}`;
      }
    }

    async function callApiGetFromList(index) {
      try {
        const response = await axios.get(`http://localhost:3000/list/${index}`);
        console.log(
          `Current list when getting item at index ${index}:`,
          response.data.currentList
        );
        return response.data.item;
      } catch (error) {
        return `Error: ${error.response.data.error}`;
      }
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
    
      console.log("JS: Calling execute_credit_leg");
      instance.exports.execute_credit_leg(amountPtr, accountPtr);
    
      console.log("JS: Calling execute_debit_leg");
      const debitResultPtr = instance.exports.execute_debit_leg(amountPtr, accountPtr);
      console.log("JS: Reading debit result from memory");
      const debitResult = readStringFromMemory(instance, debitResultPtr, instance.exports.getStringLen(debitResultPtr));
      console.log("Result of execute_debit_leg:", debitResult);
    
      console.log("JS: Calling add_to_list");
      const addItemPtr = writeStringToMemory(instance, "grape");
      const addResultPtr = instance.exports.add_to_list(addItemPtr);
      const addResult = readStringFromMemory(instance, addResultPtr, instance.exports.getStringLen(addResultPtr));
      console.log("Result of add_to_list:", addResult);
      const sanitizedAddResult = sanitizeString(addResult);
      console.log(`JS: Sanitized add result: "${sanitizedAddResult}"`);
      await callApiAddToList(sanitizedAddResult.split(":")[1]);

      console.log("JS: Calling delete_from_list");
      const deleteItemPtr = writeStringToMemory(instance, "banana");
      const deleteResultPtr = instance.exports.delete_from_list(deleteItemPtr);
      const deleteResult = readStringFromMemory(instance, deleteResultPtr, instance.exports.getStringLen(deleteResultPtr));
      console.log("Result of delete_from_list:", deleteResult);
      await callApiDeleteFromList(deleteResult.split(":")[1]);

      console.log("JS: Calling get_from_list");
      const getIndexPtr = writeStringToMemory(instance, "1");
      const getResultPtr = instance.exports.get_from_list(getIndexPtr);
      const getResult = readStringFromMemory(instance, getResultPtr, instance.exports.getStringLen(getResultPtr));
      console.log("Result of get_from_list:", getResult);
      await callApiGetFromList(parseInt(getResult));

      console.log("JS: Adding another item");
      const addItemPtr2 = writeStringToMemory(instance, "kiwi");
      const addResultPtr2 = instance.exports.add_to_list(addItemPtr2);
      const addResult2 = readStringFromMemory(instance, addResultPtr2, instance.exports.getStringLen(addResultPtr2));
      const sanitizedAddResult2 = sanitizeString(addResult2);
      console.log(`JS: Sanitized add result: "${sanitizedAddResult2}"`);
      await callApiAddToList(sanitizedAddResult2.split(":")[1]);

      console.log("JS: Getting item at index 3");
      const getIndexPtr2 = writeStringToMemory(instance, "3");
      const getResultPtr2 = instance.exports.get_from_list(getIndexPtr2);
      const getResult2 = readStringFromMemory(instance, getResultPtr2, instance.exports.getStringLen(getResultPtr2));
      console.log("Result of get_from_list:", getResult2);
      await callApiGetFromList(parseInt(getResult2));

      console.log("JS: Running Book Tests (AssemblyScript)");
      const booksData = await getRDFData();
      console.log("Initial Books Data:", booksData);
      const booksDataPtr = writeStringToMemory(booksData);
      const booksResultPtr = instance.exports.Rdf_Test(booksDataPtr);
      const booksTestResult = readStringFromMemory(booksResultPtr);
      console.log("Books Test Result:", booksTestResult);

      // Add a new book
      console.log("JS: Adding a new book");
      const newBookTitle = "New Book Title";
      const newBookAuthor = "New Book Author";
      const addBookPtr = writeStringToMemory(JSON.stringify({ title: newBookTitle, authorName: newBookAuthor }));
      const addBookResultPtr = instance.exports.add_book(addBookPtr);
      const addBookResult = readStringFromMemory(addBookResultPtr);
      console.log("Add Book Result:", addBookResult);
      await addBook(newBookTitle, newBookAuthor);

      // Delete a book
      console.log("JS: Deleting a book");
      const deleteBookPtr = writeStringToMemory("To Kill a Mockingbird");
      const deleteBookResultPtr = instance.exports.delete_book(deleteBookPtr);
      const deleteBookResult = readStringFromMemory(deleteBookResultPtr);
      console.log("Delete Book Result:", deleteBookResult);
      await deleteBook("To Kill a Mockingbird");

      // Get a book
      console.log("JS: Getting a book");
      const getBookPtr = writeStringToMemory("1984");
      const getBookResultPtr = instance.exports.get_book(getBookPtr);
      const getBookResult = readStringFromMemory(getBookResultPtr);
      console.log("Get Book Result:", getBookResult);
      const apiGetBookResult = await getBook("1984");
      console.log("API Get Book Result:", apiGetBookResult);

      apiServer.close();
    } else if (isTinyGo) {
      // TinyGo logic
      console.log("JS: Writing amount string to memory (TinyGo)");
      const amountMem = writeStringToMemoryTinyGo(amount);
      console.log("JS: Writing account string to memory (TinyGo)");
      const accountMem = writeStringToMemoryTinyGo(account);
    
      // Modify the importObject to include a mock query_rdf_go function
      importObject.env.query_rdf_go = (queryPtr, queryLen) => {
        const query = readStringFromMemoryTinyGo(queryPtr);
        console.log("Executing RDF query (Go):", query);
        
        // Simulate an RDF query (replace this with actual RDF query logic)
        const mockResult = JSON.stringify({ results: [{ balance: 1000 }] });
        const resultMem = writeStringToMemoryTinyGo(mockResult);
        return resultMem.ptr;
      };
    
      console.log("JS: Calling execute_credit_leg (TinyGo)");
      creditResultPtr = instance.exports.execute_credit_leg(
        amountMem.ptr,
        amountMem.length,
        accountMem.ptr,
        accountMem.length
      );
      
      if (creditResultPtr === 0) {
        console.error("Error: execute_credit_leg returned null pointer");
      } else {
        console.log("JS: Reading credit result from memory (TinyGo)");
        creditResult = readStringFromMemoryTinyGo(creditResultPtr);
        console.log("Result of execute_credit_leg:", creditResult);
      
        if (creditResult.startsWith("Error:")) {
          console.error("Error in execute_credit_leg:", creditResult);
        } else {
          console.log("Credit operation successful:", creditResult);
        }
      }
    
      console.log("JS: Calling execute_debit_leg (TinyGo)");
      debitResultPtr = instance.exports.execute_debit_leg(
        amountMem.ptr,
        amountMem.length,
        accountMem.ptr,
        accountMem.length
      );
      console.log("JS: Reading debit result from memory (TinyGo)");
      debitResult = readStringFromMemoryTinyGo(debitResultPtr);
      console.log("Result of execute_debit_leg:", debitResult);

      console.log("JS: Calling add_to_list (TinyGo)");
      const addItemMem = writeStringToMemoryTinyGo("grape");
      const addResultPtr = instance.exports.add_to_list(
        addItemMem.ptr,
        addItemMem.length
      );
      const addResult = readStringFromMemoryTinyGo(addResultPtr);
      console.log(
        "Result of add_to_list:",
        await callApiAddToList(addResult.split(":")[1])
      );

      console.log("JS: Calling delete_from_list (TinyGo)");
      const deleteItemMem = writeStringToMemoryTinyGo("banana");
      const deleteResultPtr = instance.exports.delete_from_list(
        deleteItemMem.ptr,
        deleteItemMem.length
      );
      const deleteResult = readStringFromMemoryTinyGo(deleteResultPtr);
      console.log(
        "Result of delete_from_list:",
        await callApiDeleteFromList(deleteResult.split(":")[1])
      );

      console.log("JS: Calling get_from_list (TinyGo)");
      const getIndexMem = writeStringToMemoryTinyGo("1");
      const getResultPtr = instance.exports.get_from_list(
        getIndexMem.ptr,
        getIndexMem.length
      );
      const getResult = readStringFromMemoryTinyGo(getResultPtr);
      console.log(
        "Result of get_from_list:",
        await callApiGetFromList(parseInt(getResult))
      );

      // Add more test cases
      console.log("JS: Adding another item (TinyGo)");
      const addItemMem2 = writeStringToMemoryTinyGo("kiwi");
      const addResultPtr2 = instance.exports.add_to_list(
        addItemMem2.ptr,
        addItemMem2.length
      );
      const addResult2 = readStringFromMemoryTinyGo(addResultPtr2);
      console.log(
        "Result of add_to_list:",
        await callApiAddToList(addResult2.split(":")[1])
      );

      console.log("JS: Getting item at index 3 (TinyGo)");
      const getIndexMem2 = writeStringToMemoryTinyGo("3");
      const getResultPtr2 = instance.exports.get_from_list(
        getIndexMem2.ptr,
        getIndexMem2.length
      );
      const getResult2 = readStringFromMemoryTinyGo(getResultPtr2);
      console.log(
        "Result of get_from_list:",
        await callApiGetFromList(parseInt(getResult2))
      );

      console.log("JS: Running Book Tests (TinyGo)");
      const booksData = await getRDFData();
      console.log("Initial Books Data:", booksData);
      const booksDataMem = writeStringToMemoryTinyGo(booksData);
      const booksResultPtr = instance.exports.Rdf_Test(booksDataMem.ptr, booksDataMem.length);
      const booksTestResult = readStringFromMemoryTinyGo(booksResultPtr);
      console.log("Books Test Result:", booksTestResult);

      // Add a new book
      console.log("JS: Adding a new book");
      const newBookTitle = "New Book Title";
      const newBookAuthor = "New Book Author";
      const addBookMem = writeStringToMemoryTinyGo(JSON.stringify({ title: newBookTitle, authorName: newBookAuthor }));
      const addBookResultPtr = instance.exports.add_book(addBookMem.ptr, addBookMem.length);
      const addBookResult = readStringFromMemoryTinyGo(addBookResultPtr);
      console.log("Add Book Result:", addBookResult);
      await addBook(newBookTitle, newBookAuthor);

      // Delete a book
      console.log("JS: Deleting a book");
      const deleteBookMem = writeStringToMemoryTinyGo("To Kill a Mockingbird");
      const deleteBookResultPtr = instance.exports.delete_book(deleteBookMem.ptr, deleteBookMem.length);
      const deleteBookResult = readStringFromMemoryTinyGo(deleteBookResultPtr);
      console.log("Delete Book Result:", deleteBookResult);
      await deleteBook("To Kill a Mockingbird");

      // Get a book
      console.log("JS: Getting a book");
      const getBookMem = writeStringToMemoryTinyGo("1984");
      const getBookResultPtr = instance.exports.get_book(getBookMem.ptr, getBookMem.length);
      const getBookResult = readStringFromMemoryTinyGo(getBookResultPtr);
      console.log("Get Book Result:", getBookResult);
      const apiGetBookResult = await getBook("1984");
      console.log("API Get Book Result:", apiGetBookResult);

      apiServer.close();
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
      const booksResultPtr = instance.exports.Rdf_Test(booksDataMem.ptr, booksDataMem.len);
      const booksTestResult = readStringFromMemoryRust(booksResultPtr);
      console.log("Books Test Result:", booksTestResult);

      // Add a new book
      console.log("JS: Adding a new book");
      const newBookTitle = "New Book Title";
      const newBookAuthor = "New Book Author";
      const addBookMem = writeStringToMemoryRust(JSON.stringify({ title: newBookTitle, authorName: newBookAuthor }));
      const addBookResultPtr = instance.exports.add_book(addBookMem.ptr, addBookMem.len);
      const addBookResult = readStringFromMemoryRust(addBookResultPtr);
      console.log("Add Book Result:", addBookResult);
      await addBook(newBookTitle, newBookAuthor);

      // Delete a book
      console.log("JS: Deleting a book");
      const deleteBookMem = writeStringToMemoryRust("To Kill a Mockingbird");
      const deleteBookResultPtr = instance.exports.delete_book(deleteBookMem.ptr, deleteBookMem.len);
      const deleteBookResult = readStringFromMemoryRust(deleteBookResultPtr);
      console.log("Delete Book Result:", deleteBookResult);
      await deleteBook("To Kill a Mockingbird");

      // Get a book
      console.log("JS: Getting a book");
      const getBookMem = writeStringToMemoryRust("1984");
      const getBookResultPtr = instance.exports.get_book(getBookMem.ptr, getBookMem.len);
      const getBookResult = readStringFromMemoryRust(getBookResultPtr);
      console.log("Get Book Result:", getBookResult);
      const apiGetBookResult = await getBook("1984");
      console.log("API Get Book Result:", apiGetBookResult);

      instance.exports.dealloc(booksDataMem.ptr, booksDataMem.len);
      instance.exports.dealloc(addBookMem.ptr, addBookMem.len);
      instance.exports.dealloc(deleteBookMem.ptr, deleteBookMem.len);
      instance.exports.dealloc(getBookMem.ptr, getBookMem.len);

      apiServer.close();
    }

    console.log(`Testing WASM file: ${filePath}`);
    return { success: true, creditResult };
  } catch (error) {
    console.error("Error executing WASM file:", error);
    return { success: false, error: error.message };
  }
}

module.exports = { executeWasmFile, startApiServer };
