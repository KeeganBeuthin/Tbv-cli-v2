const fs = require("fs");
const { promisify } = require("util");
const { TextDecoder, TextEncoder } = require("util");
const axios = require('axios');
const { startServer } = require('./simpleApi');

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
      const buffer = new Uint8Array(instance.exports.memory.buffer, ptr, len);
      const str = new TextDecoder().decode(buffer);
      console.log(`JS: Read string: "${str}"`);
      return str;
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
    } else if (isTinyGo) {
      // TinyGo logic
      const server = await startServer();
      try {
        // Call the API to get the test data
        const response = await axios.get('http://localhost:3000/test');
        const testData = JSON.stringify(response.data);
    
        // Call the logList function
        const encoder = new TextEncoder();
        const encodedTestData = encoder.encode(testData);
        const ptr = writeStringToMemoryTinyGo(testData);
        instance.exports.logList(ptr, encodedTestData.length);
    
        // Process each item from the API response
        for (const item of response.data) {
          const { amount, account } = item;
          console.log(`Processing item: Amount ${amount}, Account ${account}`);
    
          const amountPtr = writeStringToMemoryTinyGo(amount);
          const accountPtr = writeStringToMemoryTinyGo(account);
    
          const creditResultPtr = instance.exports.execute_credit_leg(
            amountPtr,
            amount.length,
            accountPtr,
            account.length
          );
          const creditResult = readStringFromMemoryTinyGo(creditResultPtr);
          console.log("Credit Result:", creditResult);
    
          const debitResultPtr = instance.exports.execute_debit_leg(
            amountPtr,
            amount.length,
            accountPtr,
            account.length
          );
          const debitResult = readStringFromMemoryTinyGo(debitResultPtr);
          console.log("Debit Result:", debitResult);
        }
      } finally {
        // Close the server
        server.close(() => {
          console.log('API server closed');
        });
      }

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
    }

    console.log(`Testing WASM file: ${filePath}`);
    return { success: true, creditResult, debitResult };
  } catch (error) {
    console.error("Error executing WASM file:", error);
    return { success: false, error: error.message };
  }
}

module.exports = { executeWasmFile };
