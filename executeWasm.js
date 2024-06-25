//executeWasm.js
const fs = require("fs");
const { promisify } = require("util");

async function executeWasmFile(filePath) {
  try {
    const wasmBuffer = await promisify(fs.readFile)(filePath);
    const importObject = {
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
      env: {
        abort: () => { console.error("Abort called"); },
        'console.log': (argPtr) => {
          const memory = new Uint8Array(instance.exports.memory.buffer);
          let str = '';
          let i = argPtr;
          while (memory[i] !== 0) {
            str += String.fromCharCode(memory[i]);
            i++;
          }
          console.log(str);
        },
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

    const { instance: wasmInstance } = await WebAssembly.instantiate(wasmBuffer, importObject);
    instance = wasmInstance;
    console.log(instance.exports);

    const memory = new Uint8Array(instance.exports.memory.buffer);

    function writeStringToMemory(str, offset) {
      for (let i = 0; i < str.length; i++) {
        memory[offset + i] = str.charCodeAt(i);
      }
      memory[offset + str.length] = 0; // Null-terminate the string
    }

    // Test httpRequest function
    const httpRequest = instance.exports.http_request;
    if (typeof httpRequest === "function") {
      const result = httpRequest(9, 4);
      console.log(`httpRequest result: ${result}`);
    } else {
      console.log("httpRequest function not found.");
    }

    // Test executeCreditLeg function
    const executeCreditLeg = instance.exports.execute_credit_leg;
    if (typeof executeCreditLeg === "function") {
      const amount = 100;
      const account = "Account123";
      const accountPtr = 935; // Assume this is a safe memory location
      writeStringToMemory(account, accountPtr);

      console.log("Calling executeCreditLeg...");
      executeCreditLeg(amount, accountPtr);
    } else {
      console.log("executeCreditLeg function not found.");
    }

    // Test executeDebitLeg function
    const executeDebitLeg = instance.exports.execute_debit_leg;
    if (typeof executeDebitLeg === "function") {
      const amount = 50;
      const account = "Account456";
      const accountPtr = 2048; // Assume this is a safe memory location
      writeStringToMemory(account, accountPtr);

      console.log("Calling executeDebitLeg...");
      executeDebitLeg(amount, accountPtr);
    } else {
      console.log("executeDebitLeg function not found.");
    }

    return { success: true };
  } catch (error) {
    console.error("Error executing WASM file:", error);
    return { success: false };
  }
}

module.exports = { executeWasmFile };