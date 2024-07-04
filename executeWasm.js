//executeWasm.js
const fs = require("fs");
const {promisify} = require("util");
const { TextDecoder, TextEncoder } = require("util");

async function executeWasmFile(filePath) {
  try {
    const wasmBuffer = await promisify(fs.readFile)(filePath);

    const importObject = {
      env: {
        abort: () => { console.error("Abort called"); },
        logMessage: (ptr, len) => {
          const memory = new Uint8Array(instance.exports.memory.buffer);
          const message = new TextDecoder().decode(memory.subarray(ptr, ptr + len));
          console.log("WASM:", message);
        },
      },
      gojs: {
        'runtime.ticks': () => {},
        'runtime.sleepTicks': () => {},
        'syscall/js.valueGet': () => {},
        'syscall/js.valuePrepareString': () => {},
        'syscall/js.valueLoadString': () => {},
        'syscall/js.finalizeRef': () => {},
        'syscall/js.stringVal': () => {},
        'syscall/js.valueSet': () => {},
        'syscall/js.valueNew': () => {},
        'syscall/js.valueLength': () => {},
        'syscall/js.valueIndex': () => {},
        'syscall/js.valueCall': () => {},
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

    const goImportObject = {
      gojs: {
        'runtime.ticks': () => {},
        'runtime.sleepTicks': () => {},
        'syscall/js.valueGet': () => {},
        'syscall/js.valuePrepareString': () => {},
        'syscall/js.valueLoadString': () => {},
        'syscall/js.finalizeRef': () => {},
        'syscall/js.stringVal': () => {},
        'syscall/js.valueSet': () => {},
        'syscall/js.valueNew': () => {},
        'syscall/js.valueLength': () => {},
        'syscall/js.valueIndex': () => {},
        'syscall/js.valueCall': () => {},
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

    const { instance } = await WebAssembly.instantiate(wasmBuffer, importObject);
    const { memory } = instance.exports;
    
    console.log(`Initial memory size: ${memory.buffer.byteLength} bytes`);
    
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

    const amount = "100.50";
    const account = "12358";
    
    console.log('JS: Writing amount string to memory');
    const amountPtr = writeStringToMemory(amount);
    console.log('JS: Writing account string to memory');
    const accountPtr = writeStringToMemory(account);
    
    console.log('JS: Calling execute_credit_leg');
    const creditResultPtr = instance.exports.execute_credit_leg(amountPtr, accountPtr);
    console.log('JS: Reading credit result from memory');
    const creditResult = readStringFromMemory(creditResultPtr);
    console.log('Result of execute_credit_leg:', creditResult);
    
    console.log('JS: Calling execute_debit_leg');
    const debitResultPtr = instance.exports.execute_debit_leg(amountPtr, accountPtr);
    console.log('JS: Reading debit result from memory');
    const debitResult = readStringFromMemory(debitResultPtr);
    console.log('Result of execute_debit_leg:', debitResult);

    return { success: true };
  } catch (error) {
    console.error("Error executing WASM file:", error);
    return { success: false };
  }
}

module.exports = { executeWasmFile };