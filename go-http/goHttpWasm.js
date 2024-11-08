const fs = require("fs").promises;
const path = require("path");
const { executeRdfQuery } = require('../rdfHandler');

require("../execution-files/wasm_exec.js");
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

    go.run(result.instance);

    return {
      success: true,
      handleHttpRequest: (requestData) => {
        // Stringify the body if it's an object
        const modifiedRequest = {
          ...requestData,
          body: typeof requestData.body === 'object' ? 
                JSON.stringify(requestData.body) : 
                requestData.body
        };

        console.log("Calling handleHttpRequest with modified request:", 
          JSON.stringify(modifiedRequest, null, 2));

        const responseJSON = global.handleHttpRequest(JSON.stringify(modifiedRequest));
        console.log("Response from handleHttpRequest:", responseJSON);
        
        try {
          const parsedResponse = JSON.parse(responseJSON);
          // Parse the body if it's a JSON string
          if (typeof parsedResponse.body === 'string' && 
              parsedResponse.body.trim().startsWith('{')) {
            try {
              parsedResponse.body = JSON.parse(parsedResponse.body);
            } catch (e) {
              console.log("Body is not valid JSON, keeping as string");
            }
          }
          return parsedResponse;
        } catch (error) {
          console.error("Error parsing response:", error);
          return {
            statusCode: 500,
            headers: { "Content-Type": "application/json" },
            body: { error: "Internal Server Error", details: error.message }
          };
        }
      }
    };
  } catch (error) {
    console.error("Error initializing WASM for HTTP:", error);
    return { success: false, error: error.message };
  }
}

module.exports = { initWasmForHttp };