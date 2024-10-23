const fs = require("fs").promises;
const path = require("path");
const { executeRdfQuery } = require('../rdfHandler');

require("./wasm_exec.js");
const Go = globalThis.Go;

function createImportObject(go) {
  let memory = new WebAssembly.Memory({ initial: 256, maximum: 256 });
  let heap = new Uint8Array(memory.buffer);
  let heapNext = 1;

  function malloc(size) {
    const addr = heapNext;
    heapNext += size;
    if (heapNext > heap.length) {
      console.error("Out of memory");
      return 0;
    }
    return addr;
  }

  return {
    ...go.importObject,
    env: {
      ...go.importObject.env,
      malloc: (size) => {
        console.log("malloc called with size:", size);
        return malloc(size);
      },
      free: (ptr) => {
        console.log("free called with ptr:", ptr);
        // In this simple implementation, we don't actually free memory
      },
      query_rdf_tbv_cli: (queryPtr, queryLen) => {
        const query = go.mem.loadString(queryPtr, queryLen);
        console.log("Executing RDF query via TBV-CLI:", query);

        executeRdfQuery(query)
          .then((result) => {
            console.log("RDF query result:", result);
            const resultJson = JSON.stringify(result);
            const resultPtr = go.mem.stringToPtr(resultJson);
            go._resolveCallbackPromise(resultPtr);
          })
          .catch((error) => {
            console.error("Error executing RDF query:", error);
            const errorJson = JSON.stringify({ error: error.message });
            const errorPtr = go.mem.stringToPtr(errorJson);
            go._resolveCallbackPromise(errorPtr);
          });

        return 0;
      },
      "syscall/js.valueGet": () => {},
      "syscall/js.valueSet": () => {},
      "syscall/js.valueIndex": () => {},
      "syscall/js.valueSetIndex": () => {},
      "syscall/js.valueCall": () => {},
      "syscall/js.valueNew": () => {},
      "syscall/js.valueLength": () => {},
      "syscall/js.valuePrepareString": () => {},
      "syscall/js.valueLoadString": () => {},
      "syscall/js.stringVal": () => {},
      "syscall/js.valueInstanceOf": () => {},
      "syscall/js.copyBytesToGo": () => {},
      "syscall/js.copyBytesToJS": () => {},
    },
  };
}

async function initWasmForHttp(filePath) {
  try {
    const wasmBuffer = await fs.readFile(filePath);
    const go = new Go();
    const importObject = createImportObject(go);

    const result = await WebAssembly.instantiate(wasmBuffer, importObject);
    console.log("WebAssembly module instantiated successfully for HTTP API");
    console.log("Available exports:", Object.keys(result.instance.exports));

    go.run(result.instance);

    if (typeof global.handleHttpRequest !== "function") {
      throw new Error("handleHttpRequest function not found in WebAssembly module");
    }

    return {
      success: true,
      handleHttpRequest: (requestData) => {
        console.log("Calling handleHttpRequest with:", JSON.stringify(requestData, null, 2));
        const responseJSON = global.handleHttpRequest(JSON.stringify(requestData));
        console.log("Response from handleHttpRequest:", responseJSON);
        return JSON.parse(responseJSON);
      }
    };
  } catch (error) {
    console.error("Error initializing WASM for HTTP:", error);
    return { success: false, error: error.message };
  }
}

module.exports = { initWasmForHttp };