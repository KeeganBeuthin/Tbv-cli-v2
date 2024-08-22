const fs = require("fs");
const { promisify } = require("util");
const { TextDecoder, TextEncoder } = require("util");
const axios = require("axios");
const util = require("util");
const { spawn } = require("child_process");
const { exec } = require("child_process");
const readFile = util.promisify(fs.readFile);
const crypto = require("crypto");
if (typeof globalThis.crypto !== "object") {
  globalThis.crypto = {
    getRandomValues(buffer) {
      return crypto.randomFillSync(buffer);
    },
  };
}
const execPromise = util.promisify(exec);

let apiServer = null;

require("./wasm_exec.js");
/** @type {typeof import('./wasm_exec').Go} */
const Go = globalThis.Go;

console.log("wasm_exec.js loaded successfully");
console.log(Go);
if (typeof Go !== "function") {
  console.error(
    "Go class is not defined. Make sure wasm_exec.js is loaded correctly."
  );
}

async function isGoWasm(wasmBuffer) {
  try {
    const module = await WebAssembly.compile(wasmBuffer);
    const exports = WebAssembly.Module.exports(module);

    console.log(
      "Available exports:",
      exports.map((exp) => exp.name)
    );

    // Check for Go-specific exports
    const requiredExports = ["run", "resume", "getsp", "mem"];
    const hasAllExports = requiredExports.every((exp) =>
      exports.some((e) => e.name === exp)
    );
    console.log("Has all required exports:", hasAllExports);

    return hasAllExports;
  } catch (error) {
    console.error("Error during Go WASM detection:", error);
    return false;
  }
}

async function isAssemblyScriptWasm(wasmBuffer) {
  try {
    const module = await WebAssembly.compile(wasmBuffer);
    const exports = WebAssembly.Module.exports(module);

    console.log(
      "Available exports:",
      exports.map((exp) => exp.name)
    );

    // Check for AssemblyScript-specific exports
    const hasMemory = exports.some((exp) => exp.name === "memory");

    console.log("Has memory export:", hasMemory);

    return hasMemory;
  } catch (error) {
    console.error("Error during AssemblyScript WASM detection:", error);
    return false;
  }
}

async function executeRdfQuery(query) {
  try {
    console.log(`Executing RDF query via CLI: ${query}`);
    const { stdout, stderr } = await execPromise(
      `tbv-cli rdf-query "${query}"`
    );
    if (stderr) {
      console.error("CLI Error:", stderr);
    }
    console.log("CLI Output:", stdout);
    const resultStart = stdout.indexOf("RDF Query Result:");
    if (resultStart !== -1) {
      const resultJson = stdout
        .slice(resultStart + "RDF Query Result:".length)
        .trim();
      return JSON.parse(resultJson);
    } else {
      throw new Error("Failed to find RDF Query Result in CLI output");
    }
  } catch (error) {
    console.error("Error executing RDF query via CLI:", error);
    throw error;
  }
}

async function startApiServer() {
  if (apiServer) {
    console.log("API server already running");
    return apiServer;
  }
  const { server, closeServer } = require("./simpleApi");
  apiServer = { server, closeServer };
  return new Promise((resolve) => {
    server.on("listening", () => {
      console.log("Mock API server is now running on http://127.0.0.1:3000");
      resolve(apiServer);
    });
  });
}

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function executeWasmFile(filePath) {
  let apiServerInstance;
  let rdfQueryComplete = false;
  const rdfQueryPromise = new Promise((resolve) => {
    global.resolveRdfQuery = () => {
      rdfQueryComplete = true;
      resolve();
    };
  });

  global.executeRdfQuery = async (query) => {
    try {
      const result = await executeRdfQuery(query);
      global.setQueryResult(JSON.stringify(result));
    } catch (error) {
      console.error("Error executing RDF query:", error);
      global.setQueryResult(JSON.stringify({ error: error.message }));
    }
  };

  global.setFinalResult = (result) => {
    console.log("Final result:", result);
    // You can do something with the final result here
  };

  try {
    const wasmBuffer = await promisify(fs.readFile)(filePath);

    // Log the imports that the module is expecting
    const module = await WebAssembly.compile(wasmBuffer);
    const imports = WebAssembly.Module.imports(module);
    console.log("Module imports:", JSON.stringify(imports, null, 2));

    const exports = WebAssembly.Module.exports(module);
    console.log("Module exports:", JSON.stringify(exports, null, 2));

    const isAssemblyScriptModule = await isAssemblyScriptWasm(wasmBuffer);
    const isGoModule = await isGoWasm(wasmBuffer);

    let instance;
    if (isGoModule) {
      console.log("Detected Go-compiled WebAssembly module");
      const go = new Go();

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

      const importObject = {
        ...go.importObject,
        env: {
          ...go.importObject.env,
          // Add missing functions
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

      console.log("Instantiating Go WebAssembly module...");
      console.log("Import object keys:", Object.keys(importObject));
      console.log("Env keys:", Object.keys(importObject.env));

      const result = await WebAssembly.instantiate(wasmBuffer, importObject);

      console.log("Go WebAssembly module instantiated successfully");
      console.log("Available exports:", Object.keys(result.instance.exports));

      // Run the Go program
      console.log("Running Go program...");
      const runPromise = go.run(result.instance);

      // Wait a short time for the Go program to set up
      await new Promise((resolve) => setTimeout(resolve, 100));

      // After running, the global scope should have the 'runTest' function
      if (typeof global.runTest === "function") {
        console.log("Executing runTest function...");
        try {
          const testResult = global.runTest();
          console.log("runTest raw result:", testResult);
          if (testResult) {
            try {
              const parsedResult = JSON.parse(testResult);
              console.log("runTest parsed result:", parsedResult);
            } catch (parseError) {
              console.error("Error parsing runTest result:", parseError);
              console.log("Unparsed result:", testResult);
            }
          } else {
            console.log("runTest returned null or undefined");
          }
        } catch (error) {
          console.error("Error executing runTest function:", error);
        }
      } else {
        console.log("runTest function not found in global scope");
      }

      // Wait for the Go program to complete (or timeout after 10 seconds)
      try {
        await Promise.race([
          runPromise,
          new Promise((_, reject) =>
            setTimeout(
              () => reject(new Error("Go program execution timed out")),
              10000
            )
          ),
        ]);
      } catch (error) {
        console.error("Error or timeout while running Go program:", error);
      }

      console.log("Go program execution completed or timed out");

      return {
        success: true,
        result: "Go program execution attempt completed",
      };
    } else if (isAssemblyScriptModule) {
      console.log("Detected AssemblyScript-compiled WebAssembly module");
    
      let instance;
    
      let memoryBase = 0; // Start of our allocation area
      
      const memory = new WebAssembly.Memory({ initial: 256, maximum: 512 });

      function readStringFromMemory(ptr, len) {
        const view = new Uint8Array(memory.buffer, ptr, len);
        return new TextDecoder().decode(view);
      }
    
    
      function writeStringToMemory(str) {
        const encoder = new TextEncoder();
        const encodedStr = encoder.encode(str);
        const ptr = memoryBase;
        memoryBase += encodedStr.length + 1; // +1 for null terminator
        
        // Ensure we have enough memory
        if (memoryBase > memory.buffer.byteLength) {
          const pages = Math.ceil((memoryBase - memory.buffer.byteLength) / 65536);
          memory.grow(pages);
        }
        
        new Uint8Array(memory.buffer).set(encodedStr, ptr);
        new Uint8Array(memory.buffer)[ptr + encodedStr.length] = 0; // Null terminator
        return { ptr, len: encodedStr.length };
      }
    
      const importObject = {
        env: {
          abort: (message, fileName, lineNumber, columnNumber) => {
            console.error(`Abort called at ${fileName}:${lineNumber}:${columnNumber}: ${message}`);
          },
          seed: () => {
            return Date.now();
          },
          'console.log': (ptr) => {
            let len = 0;
            const view = new Uint8Array(memory.buffer, ptr);
            while (view[len] !== 0) len++;
            const str = readStringFromMemory(ptr, len);
            console.log("WASM console.log:", str);
    
          },
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
          logMessage: (ptr, len) => {
            const memory = new Uint8Array(instance.exports.memory.buffer);
            const message = new TextDecoder().decode(
              memory.subarray(ptr, ptr + len)
            );
            console.log("WASM:", message);
          },
          memory:memory
        },
        index: {
          logMessage: (ptr, len) => {
            const memory = new Uint8Array(instance.exports.memory.buffer);
            const message = new TextDecoder().decode(
              memory.subarray(ptr, ptr + len)
            );
            console.log("WASM:", message);
          },
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
        }
      };
    
      console.log("Instantiating AssemblyScript WebAssembly module...");
      try {
        const result = await WebAssembly.instantiate(wasmBuffer, importObject);
        instance = result.instance;
        console.log('Available exports:', Object.keys(instance.exports));
    
        if (typeof instance.exports.main !== 'function') {
          throw new Error("main function not found in exports");
        }
    
        // Set up global functions
        global.runTest = () => {
          if (typeof instance.exports.runTest !== 'function') {
            throw new Error("runTest function not found in exports");
          }
          instance.exports.runTest();
        };
    
        global.setQueryResult = (result) => {
          if (typeof instance.exports.setQueryResult !== 'function') {
            throw new Error("setQueryResult function not found in exports");
          }
          const { ptr, len } = writeStringToMemory(result);
          instance.exports.setQueryResult(ptr, len);
        };
    
        console.log("Executing main function");
        instance.exports.main();
    
        console.log("Executing runTest function");
        global.runTest();
    
        return { success: true, message: "AssemblyScript module executed successfully" };
      } catch (error) {
        console.error("Error instantiating or executing AssemblyScript module:", error);
        return { success: false, error: error.message };
      }
    }

    function readStringFromMemory(instance, ptr, maxLen) {
      console.log(
        `JS: Reading string from memory at ${ptr} with max length ${maxLen}`
      );
      if (ptr === 0) {
        console.log("JS: Received null pointer");
        return "";
      }
      const memory = new Uint8Array(instance.exports.memory.buffer);
      let end = ptr;
      while (end < ptr + maxLen && memory[end] !== 0) {
        end++;
      }
      const str = new TextDecoder().decode(memory.subarray(ptr, end));
      console.log(`JS: Read string: "${str}"`);
      return str;
    }

    function writeStringToMemoryTinyGo(str) {
      console.log(`JS: Writing string "${str}" to memory (TinyGo)`);
      const encoder = new TextEncoder();
      const encodedStr = encoder.encode(str + "\0");
      const ptr = instance.exports.malloc(encodedStr.length);
      const memory = new Uint8Array(instance.exports.memory.buffer);
      memory.set(encodedStr, ptr);
      console.log(
        `JS: Allocated string at ${ptr} with length ${encodedStr.length}`
      );
      return { ptr, length: encodedStr.length - 1 }; // Subtract 1 to exclude null terminator
    }

    function writeStringToMemory(instance, str) {
      console.log(`JS: Writing string "${str}" to memory`);
      const encoder = new TextEncoder();
      const encodedStr = encoder.encode(str);
      const ptr = instance.exports.allocateString(encodedStr.length);
      new Uint8Array(instance.exports.memory.buffer).set(encodedStr, ptr);
      console.log(`JS: Allocated string at ${ptr}`);
      return ptr;
    }

    function readStringFromMemoryRust(ptr) {
      console.log(`JS: Reading string from memory at ${ptr} (Rust)`);
      let len = 0;
      while (new Uint8Array(memory.buffer)[ptr + len] !== 0) len++;
      const buffer = new Uint8Array(memory.buffer, ptr, len);
      const str = new TextDecoder().decode(buffer);
      console.log(`JS: Read string: "${str}"`);
      return str;
    }

    function writeStringToMemoryRust(instance, str) {
      console.log("Writing to Rust memory:", str);
      console.log("Instance:", instance);
      console.log("Instance exports:", instance.exports);
      console.log("Alloc function:", instance.exports.alloc);
      if (!instance || !instance.exports) {
        console.error("Error: WebAssembly instance not available");
        return null;
      }
      if (typeof instance.exports.alloc !== "function") {
        console.error("Error: alloc function not available in exports");
        console.log("Available exports:", Object.keys(instance.exports));
        return null;
      }

      const encoder = new TextEncoder();
      const encodedStr = encoder.encode(str + "\0"); // Null-terminated string
      const len = encodedStr.length;

      // Allocate memory in the Rust-compiled WebAssembly module
      const ptr = instance.exports.alloc(len);

      // Write the string to the allocated memory
      const memory = new Uint8Array(instance.exports.memory.buffer);
      for (let i = 0; i < len; i++) {
        memory[ptr + i] = encodedStr[i];
      }

      console.log(
        `JS: Wrote string "${str}" to Rust memory at address ${ptr} with length ${len}`
      );

      // Return both the pointer and the length, which is useful for Rust FFI
      return { ptr, len: len - 1 }; // Subtract 1 to not count null terminator in length
    }

    await Promise.race([
      rdfQueryPromise,
      delay(10000), // 10 second timeout
    ]);

    if (!rdfQueryComplete) {
      console.log("RDF query timed out");
    } else {
      console.log("RDF query completed successfully");
    }

    return { success: true, creditResult };
  } catch (error) {
    console.error("Error executing WASM file:", error);
    return { success: false, error: error.message };
  } finally {
    if (apiServerInstance) {
      console.log("Closing API server");
      apiServerInstance.closeServer();
    }
  }
}

module.exports = { executeWasmFile, startApiServer };
