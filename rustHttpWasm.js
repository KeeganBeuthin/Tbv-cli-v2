const fs = require("fs").promises;
const path = require("path");
const { executeRdfQuery } = require('./rdfHandler');




async function initWasmForHttp(filePath) {
  let instance;

  try {
    const wasmModule = await WebAssembly.compile(await fs.readFile(filePath));
    const importObject = {
      __wbindgen_placeholder__: {
        __wbindgen_string_new: (ptr, len) => {
          console.log("__wbindgen_string_new called with ptr:", ptr, "len:", len);
          return getStringFromMemory(ptr, len);
        },
        __wbindgen_throw: (ptr, len) => {
          console.log("__wbindgen_throw called with ptr:", ptr, "len:", len);
          const text = getStringFromMemory(ptr, len);
          console.error("Rust threw an error:", text);
          throw new Error(text);
        },
        __wbg_log_b103404cc5920657: (ptr, len) => {
          console.log("__wbg_log_b103404cc5920657 called with ptr:", ptr, "len:", len);
          if (ptr === 0 || len === undefined) {
            console.log("Rust log: (empty or invalid log)");
            return;
          }
          console.log("Rust log:", getStringFromMemory(ptr, len));
        },
        __wbg_new_abda76e883ba8a5f: () => {
          console.log("__wbg_new_abda76e883ba8a5f called");
          return {};
        },
        __wbg_stack_658279fe44541cf6: (arg0, arg1) => {
          console.log("__wbg_stack_658279fe44541cf6 called with:", arg0, arg1);
          return 0;
        },
        __wbg_error_f851667af71bcfc6: (arg0, arg1) => {
          console.error("__wbg_error_f851667af71bcfc6 called with:", arg0, arg1);
        },
        __wbindgen_object_drop_ref: (arg0) => {
          console.log("__wbindgen_object_drop_ref called with:", arg0);
        },
      },
      env: {
        log_message: (ptr, len) => {
          console.log("log_message called with ptr:", ptr, "len:", len);
          console.log("Rust log:", getStringFromMemory(ptr, len));
        },
      },
    };

    instance = await WebAssembly.instantiate(wasmModule, importObject);
    console.log("WebAssembly module instantiated successfully for HTTP API");
    console.log("Available exports:", Object.keys(instance.exports));

    function getStringFromMemory(ptr, len) {
      const memory = new Uint8Array(instance.exports.memory.buffer);
      const bytes = memory.subarray(ptr, ptr + len);
      return new TextDecoder().decode(bytes);
    }
    
    function allocateStringInMemory(str) {
      const bytes = new TextEncoder().encode(str + '\0');
      const ptr = instance.exports.alloc(bytes.length);
      const memory = new Uint8Array(instance.exports.memory.buffer);
      memory.set(bytes, ptr);
      return ptr;
    }

    return {
      success: true,
      handleHttpRequest: (requestData) => {
        console.log("JS: Entering handleHttpRequest");
        console.log("JS: Request data:", JSON.stringify(requestData, null, 2));
        
        try {
            console.log("JS: Allocating memory for request");
            const requestPtr = allocateStringInMemory(JSON.stringify(requestData));
            console.log("JS: Request allocated at ptr:", requestPtr);
            
            console.log("JS: Calling Wasm handle_http_request function");
            const responsePtr = instance.exports.handle_http_request(requestPtr);
            console.log("JS: Wasm function returned, response ptr:", responsePtr);
            
            if (responsePtr === 0 || responsePtr === null) {
                console.error("JS: Null or zero pointer returned from Wasm function");
                throw new Error("Invalid response from Wasm function");
            }
            
            console.log("JS: Reading response from memory");
            let response = getStringFromMemory(responsePtr, 2048); // Increased buffer size
            console.log("JS: Raw response from Wasm:", response);
            
            // Extract only the JSON part of the response
            const jsonMatch = response.match(/^\s*(\{.*\})/);
            if (jsonMatch) {
                response = jsonMatch[1];
            } else {
                throw new Error("Unable to extract valid JSON from response");
            }
            console.log("JS: Extracted JSON response:", response);
            
            console.log("JS: Deallocating response memory");
            instance.exports.dealloc_str(responsePtr);
            
            console.log("JS: Parsing response");
            const parsedResponse = JSON.parse(response);
            console.log("JS: Parsed response:", parsedResponse);
            
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
      memory: instance.exports.memory,
  };
    
} catch (error) {
  console.error("Error initializing WASM for HTTP:", error);
  return { success: false, error: error.message };
}
}


module.exports = { initWasmForHttp };