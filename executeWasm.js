const fs = require('fs');
const { Response } = require('node-fetch');
const { WASI } = require('@wasmer/wasi');
const { WasmFs } = require('@wasmer/wasmfs');

const executeWasmFile = async (filePath) => {
  try {
    // Create a stream from the local WASM file
    const wasmStream = fs.createReadStream(filePath);

    // Convert the stream to a Response-like object (needed for instantiateStreaming)
    const response = new Response(wasmStream);

    // Initialize the WASI instance
    const wasmFs = new WasmFs();
    const wasi = new WASI({
      args: [],
      env: {},
      preopens: {
        '/sandbox': '/'
      },
      bindings: {
        ...WASI.defaultBindings,
        fs: wasmFs.fs
      }
    });

    // Use instantiateStreaming with the response object
    const { instance } = await WebAssembly.instantiateStreaming(response, {
      ...wasi.getImports(),
    });

    // Start the WASI instance with the module
    wasi.start(instance);

    console.log("WASM file executed successfully.");
    return { success: true };
  } catch (err) {
    console.error("Error during WASM file execution:", err);
    return { success: false, error: err };
  }
};


  module.exports = { executeWasmFile};