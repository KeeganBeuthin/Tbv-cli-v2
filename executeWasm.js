const fs = require("fs");
const { promisify } = require("util");
const { TextDecoder, TextEncoder } = require("util");
const axios = require("axios");
const apiServer = require("./simpleApi");

async function executeWasmFile(filePath) {
  try {
    const wasmBuffer = await promisify(fs.readFile)(filePath);

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
    const { memory } = instance.exports;

    console.log(`Initial memory size: ${memory.buffer.byteLength} bytes`);

    const isTinyGo = typeof instance.exports.TinyGo === "function";
    const isRust = typeof instance.exports.alloc === "function";
    const isAssemblyScript = !isTinyGo && !isRust;

    function writeStringToMemory(str) {
      console.log(`JS: Writing string "${str}" to memory`);
      const encoder = new TextEncoder();
      const encodedStr = encoder.encode(str);
      const ptr = instance.exports.allocateString(encodedStr.length);
      new Uint8Array(instance.exports.memory.buffer).set(encodedStr, ptr);
      console.log(`JS: Allocated string at ${ptr}`);
      return ptr;
    }

    function readStringFromMemory(ptr) {
      console.log(`JS: Reading string from memory at ${ptr}`);
      const len = instance.exports.getStringLen(ptr);
      console.log(`JS: String length: ${len}`);
      const buffer = new Uint8Array(instance.exports.memory.buffer, ptr, len);
      console.log(
        `JS: Raw bytes:`,
        Array.from(buffer)
          .map((b) => b.toString(16).padStart(2, "0"))
          .join("")
      );
      const str = new TextDecoder().decode(buffer);
      console.log(`JS: Read string: "${str}"`);
      return str;
    }

    function sanitizeString(str) {
      return str.replace(/[\x00-\x1F\x7F]/g, "");
    }

    function writeStringToMemoryTinyGo(str) {
      console.log(`JS: Writing string "${str}" to memory (TinyGo)`);
      const encoder = new TextEncoder();
      const encodedStr = encoder.encode(str);
      const ptr = instance.exports.malloc(encodedStr.length);
      new Uint8Array(instance.exports.memory.buffer).set(encodedStr, ptr);
      console.log(`JS: Allocated string at ${ptr}`);
      return { ptr, length: encodedStr.length };
    }

    function readStringFromMemoryTinyGo(ptr) {
      console.log(`JS: Reading string from memory at ${ptr} (TinyGo)`);
      const len = instance.exports.getStringLength(ptr);
      const buffer = new Uint8Array(instance.exports.memory.buffer, ptr, len);
      const str = new TextDecoder().decode(buffer);
      console.log(`JS: Read string: "${str}"`);
      return str;
    }

    function writeStringToMemoryRust(str) {
      console.log(`JS: Writing string "${str}" to memory (Rust)`);
      const encoder = new TextEncoder();
      const bytes = encoder.encode(str);
      const ptr = instance.exports.alloc(bytes.length);
      const buffer = new Uint8Array(memory.buffer, ptr, bytes.length);
      buffer.set(bytes);
      console.log(`JS: Allocated string at ${ptr}`);
      return { ptr, len: bytes.length };
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

    const amount = "745";
    const account = "1234567";

    let amountPtr,
      accountPtr,
      creditResultPtr,
      debitResultPtr,
      creditResult,
      debitResult;

    if (isAssemblyScript) {
      // AssemblyScript logic
      console.log("JS: Writing amount string to memory");
      amountPtr = writeStringToMemory(amount);
      console.log("JS: Writing account string to memory");
      accountPtr = writeStringToMemory(account);

      console.log("JS: Calling execute_credit_leg");
      creditResultPtr = instance.exports.execute_credit_leg(
        amountPtr,
        accountPtr
      );
      console.log("JS: Reading credit result from memory");
      creditResult = readStringFromMemory(creditResultPtr);
      console.log("Result of execute_credit_leg:", creditResult);

      console.log("JS: Calling execute_debit_leg");
      debitResultPtr = instance.exports.execute_debit_leg(
        amountPtr,
        accountPtr
      );
      console.log("JS: Reading debit result from memory");
      debitResult = readStringFromMemory(debitResultPtr);
      console.log("Result of execute_debit_leg:", debitResult);

      console.log("JS: Calling add_to_list");
      const addItemPtr = writeStringToMemory("grape");
      const addResultPtr = instance.exports.add_to_list(addItemPtr);
      const addResult = readStringFromMemory(addResultPtr);
      const sanitizedAddResult = sanitizeString(addResult);
      console.log(`JS: Sanitized add result: "${sanitizedAddResult}"`);
      console.log(
        "Result of add_to_list:",
        await callApiAddToList(sanitizedAddResult.split(":")[1])
      );

      console.log("JS: Calling delete_from_list");
      const deleteItemPtr = writeStringToMemory("banana");
      const deleteResultPtr = instance.exports.delete_from_list(deleteItemPtr);
      const deleteResult = readStringFromMemory(deleteResultPtr);
      console.log(
        "Result of delete_from_list:",
        await callApiDeleteFromList(deleteResult.split(":")[1])
      );

      console.log("JS: Calling get_from_list");
      const getIndexPtr = writeStringToMemory("1");
      const getResultPtr = instance.exports.get_from_list(getIndexPtr);
      const getResult = readStringFromMemory(getResultPtr);
      console.log(
        "Result of get_from_list:",
        await callApiGetFromList(parseInt(getResult))
      );

      console.log("JS: Adding another item");
      const addItemPtr2 = writeStringToMemory("kiwi");
      const addResultPtr2 = instance.exports.add_to_list(addItemPtr2);
      const addResult2 = readStringFromMemory(addResultPtr2);
      const sanitizedAddResult2 = sanitizeString(addResult2);
      console.log(`JS: Sanitized add result: "${sanitizedAddResult2}"`);
      console.log(
        "Result of add_to_list:",
        await callApiAddToList(sanitizedAddResult2.split(":")[1])
      );

      console.log("JS: Getting item at index 3");
      const getIndexPtr2 = writeStringToMemory("3");
      const getResultPtr2 = instance.exports.get_from_list(getIndexPtr2);
      const getResult2 = readStringFromMemory(getResultPtr2);
      console.log(
        "Result of get_from_list:",
        await callApiGetFromList(parseInt(getResult2))
      );

      apiServer.close();
    } else if (isTinyGo) {
      // TinyGo logic
      console.log("JS: Writing amount string to memory (TinyGo)");
      const amountMem = writeStringToMemoryTinyGo(amount);
      console.log("JS: Writing account string to memory (TinyGo)");
      const accountMem = writeStringToMemoryTinyGo(account);

      console.log("JS: Calling execute_credit_leg (TinyGo)");
      creditResultPtr = instance.exports.execute_credit_leg(
        amountMem.ptr,
        amountMem.length,
        accountMem.ptr,
        accountMem.length
      );
      console.log("JS: Reading credit result from memory (TinyGo)");
      creditResult = readStringFromMemoryTinyGo(creditResultPtr);
      console.log("Result of execute_credit_leg:", creditResult);

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

      apiServer.close();
    }

    console.log(`Testing WASM file: ${filePath}`);
    return { success: true, creditResult, debitResult };
  } catch (error) {
    console.error("Error executing WASM file:", error);
    return { success: false, error: error.message };
  }
}

module.exports = { executeWasmFile };
