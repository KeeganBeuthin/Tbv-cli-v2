const fs = require('fs');
const path = require('path');

async function loadAndRunWasm() {
  // Load the WebAssembly binary file
  const wasmPath = path.join(__dirname, './testing-files/rust/output.wasm');
  const wasmBuffer = fs.readFileSync(wasmPath);

  const imports = {}
  // Compile and instantiate the module
  const wasmModule = await WebAssembly.compile(wasmBuffer);
  const instance = await WebAssembly.instantiate(wasmModule, imports);

  // Access exported WebAssembly functions
  const result = instance.exports.main('Grafbase');
  console.log('Result:', result);
}

loadAndRunWasm();
