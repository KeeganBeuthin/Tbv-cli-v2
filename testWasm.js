// testWasm.js
const fs = require('fs');
const path = require('path');
const { instantiate } = WebAssembly;
const { WASI } = require('@wasmer/wasi');
const { WasmFs } = require('@wasmer/wasmfs');


function testWasmFunctions(filePath) {
    const fileExtension = path.extname(filePath); // This will return ".wasm"
    const baseName = path.basename(filePath, fileExtension); // This will strip ".wasm" from the filename
    const language = baseName.split('.').pop(); // Get the last segment after a '.' which should be the language identifier

    switch (language) {
        case 'go':
            testGoWasm(filePath); // Placeholder for the Go-specific testing function
            break;
        case 'py':
            testPythonWasm(filePath);
            break;
        case 'ts':
            testTypeScriptWasm(filePath); // Placeholder for the TypeScript-specific testing function
            break;
        default:
            console.error(`Unsupported language or file format: ${language}`);
            process.exit(1);
    }
}

async function testPythonWasm(filePath) {
    const wasmFs = new WasmFs();
    let wasi = new WASI({
        args: [],
        env: {},
        bindings: {
            ...WASI.defaultBindings,
            fs: wasmFs.fs
        }
    });

    const wasmBuffer = fs.readFileSync(filePath);
    const imports = {
        ...wasi.getImports(),
        env: {
            memory: new WebAssembly.Memory({ initial: 10 }),
            // You might need to define additional custom imports if required by your module
        },
    };

    try {
        const { instance } = await WebAssembly.instantiate(wasmBuffer, imports);
        wasi.start(instance);

        // Test the functions
        instance.exports.execute_credit_leg(100, "account1");
        instance.exports.execute_debit_leg(50, "account2");
        const result = instance.exports.httpRequest(10, 20);

        console.log(`Result from httpRequest: ${result}`);
        console.log("All Python WASM functions executed successfully.");
    } catch (err) {
        console.error("Failed to load or execute Python WASM:", err);
    }
}
module.exports = { testWasmFunctions };
