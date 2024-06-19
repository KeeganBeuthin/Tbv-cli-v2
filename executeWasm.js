// executeWasm.js
const fs = require("fs");
const { promisify } = require("util");

async function executeWasmFile(filePath) {
  try {
    const wasmBuffer = await promisify(fs.readFile)(filePath);

    const importObject = {
      gojs: {
        "runtime.scheduleTimeoutEvent": () => {},
        "runtime.clearTimeoutEvent": () => {},
        "runtime.resetMemoryDataView": () => {},
        "runtime.wasmWrite": () => {},
        "runtime.getRandomData": () => {},
        "runtime.nanotime1": () => {},
        "runtime.wasmExit": () => {},
        "runtime.walltime": () => {},
        "syscall/js.finalizeRef": () => {},
        "syscall/js.stringVal": () => {},
        "syscall/js.valueGet": () => {},
        "syscall/js.valueSet": () => {},
        "syscall/js.valueIndex": () => {},
        "syscall/js.valueSetIndex": () => {},
        "syscall/js.valueLength": () => {},
        "syscall/js.valueCall": () => {},
        "syscall/js.valueNew": () => {},
        "syscall/js.valuePrepareString": () => {},
        "syscall/js.valueLoadString": () => {},
        "syscall/js.copyBytesToGo": () => {},
        "syscall/js.copyBytesToJS": () => {},
      },
    };

    const { instance } = await WebAssembly.instantiate(wasmBuffer, importObject);

    console.log(instance.exports)
    // Test executeCreditLeg function
    const executeCreditLeg = instance.exports.executeCreditLeg;
    if (typeof executeCreditLeg === "function") {
      const creditLegResult = executeCreditLeg();
      console.log("executeCreditLeg result:", creditLegResult);
    } else {
      console.log("executeCreditLeg function not found.");
    }

    // Test executeDebitLeg function
    const executeDebitLeg = instance.exports.executeDebitLeg;
    if (typeof executeDebitLeg === "function") {
      const debitLegResult = executeDebitLeg();
      console.log("executeDebitLeg result:", debitLegResult);
    } else {
      console.log("executeDebitLeg function not found.");
    }

    // Test httpRequest function
    const httpRequest = instance.exports.httpRequest;
    if (typeof httpRequest === "function") {
      const httpRequestResult = httpRequest();
      console.log("httpRequest result:", httpRequestResult);
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