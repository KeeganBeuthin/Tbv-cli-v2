const fs = require('fs');
const path = require('path');

async function loadAndRunWasm() {

  const wasmPath = path.join(__dirname, './testing-files/rust/output.wasm');
  const wasmBuffer = fs.readFileSync(wasmPath);

  const imports = {}

  const wasmModule = await WebAssembly.compile(wasmBuffer);
  const instance = await WebAssembly.instantiate(wasmModule, imports);


  const result = instance.exports.main('Grafbase');
  console.log('Result:', result);
}

loadAndRunWasm();
