const fs = require("fs");
const { promisify } = require("util");

async function executeWasmFile(filePath) {
  try {
    const wasmBuffer = await promisify(fs.readFile)(filePath);
    const importObject = {
      gojs: {
        "runtime.sleepTicks": () => {},
        "runtime.ticks": () => {},
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
      wasi_snapshot_preview1: {
        fd_write: () => {},
      },
    };
    const { instance } = await WebAssembly.instantiate(wasmBuffer, importObject);
    console.log(instance.exports.executeDebitLeg(60.1));

    // Test executeCreditLeg function
    // Test executeCreditLeg function
    const executeCreditLeg = instance.exports.executeCreditLeg;
    if (typeof executeCreditLeg === "function") {
      const result = executeCreditLeg(100.0);
      console.log(result);
    } else {
      console.log("executeCreditLeg function not found.");
    }

    // Test executeDebitLeg function
    const executeDebitLeg = instance.exports.executeDebitLeg;
    if (typeof executeDebitLeg === "function") {
      const result = executeDebitLeg(50.0);
      console.log(result);
    } else {
      console.log("executeDebitLeg function not found.");
    }

    // Test httpRequest function
    const httpRequest = instance.exports.httpRequest;
    if (typeof httpRequest === "function") {
      const result = httpRequest("https://jsonplaceholder.typicode.com/posts/1");
      console.log(result);
    } else {
      console.log("httpRequest function not found.");
    }

    return { success: true };
  } catch (error) {
    console.error("Error executing WASM file:", error);
    return { success: false };
  }
}

module.exports = { executeWasmFile };