const fs = require("fs").promises;
const path = require("path");

let memory;

function readStringFromMemory(ptr, len, isNullTerminated = false) {
  const view = new Uint8Array(memory.buffer, ptr, isNullTerminated ? 1024 : len);
  let actualLen = isNullTerminated ? view.indexOf(0) : len;
  if (actualLen === -1) actualLen = 1024; // fallback if null terminator not found
  return new TextDecoder().decode(view.subarray(0, actualLen));
}

function writeStringToMemory(str, ptr) {
  const view = new Uint8Array(memory.buffer, ptr, str.length);
  view.set(new TextEncoder().encode(str));
}

async function initWasmForHttp(filePath) {
  try {
    const wasmModule = await WebAssembly.compile(await fs.readFile(filePath));
    memory = new WebAssembly.Memory({ initial: 256, maximum: 512 });

    const importObject = {
      env: {
        abort: (message, fileName, lineNumber, columnNumber) => {
          console.error(
            `Abort called at ${fileName}:${lineNumber}:${columnNumber}: ${message}`
          );
        },
        logMessage: (ptr, len) => {
          const message = readStringFromMemory(ptr, len, true);
          console.log("WASM:", message);
        },
        "console.log": (ptr) => {
          const str = readStringFromMemory(ptr, 1024, true);
          console.log("WASM console.log:", str);
        },
        memory: memory,
      },
      index: {
        executeRdfQuery: (queryPtr, queryLen) => {
          const query = readStringFromMemory(queryPtr, queryLen);
          console.log("Executing RDF query:", query);
          global.executeRdfQuery(query);
        },
        setFinalResult: (resultPtr, resultLen) => {
          const result = readStringFromMemory(resultPtr, resultLen);
          console.log("Final result:", result);
          global.setFinalResult(result);
        },
      },
    };

    const instance = await WebAssembly.instantiate(wasmModule, importObject);
    console.log("AssemblyScript WebAssembly module instantiated successfully for HTTP API");
    console.log("Available exports:", Object.keys(instance.exports));

    return {
      success: true,
      handleHttpRequest: (requestData) => {
        console.log("JS: Entering handleHttpRequest");
        console.log("JS: Request data:", JSON.stringify(requestData, null, 2));
        
        try {
          console.log("JS: Allocating memory for request");
          const requestJson = JSON.stringify(requestData);
          const requestPtr = instance.exports.allocateString(requestJson.length);
          writeStringToMemory(requestJson, requestPtr);
  
          console.log("JS: Calling Wasm handleHttpRequest function");
          const responsePtr = instance.exports.handleHttpRequest(requestPtr);
  
          if (responsePtr === 0) {
            throw new Error("Null pointer returned from Wasm function");
          }
  
          console.log("JS: Reading response from memory");
          // Use our own readStringFromMemory function instead of instance.exports.readString
          const responseJson = readStringFromMemory(responsePtr, 1024, true);
  
          console.log("JS: Raw response from Wasm:", responseJson);
  
          console.log("JS: Parsing response");
          const parsedResponse = JSON.parse(responseJson);
  
          console.log("JS: Exiting handleHttpRequest");
          return parsedResponse;
        } catch (error) {
          console.error("JS: Error in handleHttpRequest:", error);
          console.error("JS: Error stack:", error.stack);
          return { 
            statusCode: 500, 
            headers: {}, 
            body: JSON.stringify({ error: "Internal Server Error", details: error.message }) 
          };
        }
      },
      memory: memory,
    };
  }catch (error) {
    console.error("Error initializing AssemblyScript WASM for HTTP:", error);
    return { success: false, error: error.message };
  }
}

module.exports = { initWasmForHttp };