//testWasm.test.js
const fs = require('fs');
const path = require('path');
const { init, WASI } = require('@wasmer/wasi');
const { WasmFs } = require('@wasmer/wasmfs');

describe('WebAssembly Module Tests', () => {
  const wasmFile = process.env.WASM_FILE;
  const language = process.env.LANGUAGE;

  beforeAll(async () => {
    await init(); // Initialize the SDK
  });

  test(`${language} WASM module functionality`, async () => {
    if (!wasmFile || !language) {
      throw new Error('WASM file or language not specified.');
    }

    const filePath = path.resolve(__dirname, wasmFile);
    const wasmBytes = fs.readFileSync(filePath);

    // Setup the WASI instance
    const wasmFs = new WasmFs();
    const wasi = new WASI({
      args: [],
      env: {},
      mapDir: {
        '/sandbox': wasmFs.fs // Use the in-memory filesystem
      },
      bindings: {
        ...WASI.defaultBindings,
        fs: wasmFs.fs
      }
    });

    try {
      const wasmModule = await WebAssembly.compile(wasmBytes);
      const instance = await WebAssembly.instantiate(wasmModule, {
        ...wasi.getImports(wasmModule)
      });

      wasi.start(instance);

      if (instance.exports._start) {
        instance.exports._start();
      }

      console.log("WASM functionality tests completed successfully.");
    } catch (err) {
      console.error("Error during WASM module test:", err);
      throw err;
    }
  });
});