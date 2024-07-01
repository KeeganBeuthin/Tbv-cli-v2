const go = new Go(); // Defined in wasm_exec.js
const WASM_URL = 'output.wasm';

let wasm;

const runWasm = async () => {
  try {
    if ('instantiateStreaming' in WebAssembly) {
      const obj = await WebAssembly.instantiateStreaming(fetch(WASM_URL), go.importObject);
      wasm = obj.instance;
    } else {
      const resp = await fetch(WASM_URL);
      const bytes = await resp.arrayBuffer();
      const obj = await WebAssembly.instantiate(bytes, go.importObject);
      wasm = obj.instance;
    }

    go.run(wasm);

    // Test executeCreditLeg function
    const executeCreditLeg = wasm.exports.execute_credit_leg;
    if (typeof executeCreditLeg === "function") {
      const amount = 100;
      const account = 123.45; // Provide a valid account value as a float64

      console.log("Calling executeCreditLeg...");
      executeCreditLeg(amount, account);
    } else {
      console.log("executeCreditLeg function not found.");
    }

    // Test executeDebitLeg function
    const executeDebitLeg = wasm.exports.execute_debit_leg;
    if (typeof executeDebitLeg === "function") {
      const amount = 50;
      const account = 987.65; // Provide a valid account value as a float64

      console.log("Calling executeDebitLeg...");
      executeDebitLeg(amount, account);
    } else {
      console.log("executeDebitLeg function not found.");
    }

    // Test httpRequest function
    const httpRequest = wasm.exports.http_request;
    if (typeof httpRequest === "function") {
      const a = 9;
      const b = 4;
      const result = httpRequest(a, b);
      console.log(`httpRequest result: ${result}`);
    } else {
      console.log("httpRequest function not found.");
    }
  } catch (err) {
    console.error("Error running WASM:", err);
  }
};

runWasm();