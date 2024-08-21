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
    const hasTest = exports.some((exp) => exp.name === "test");

    console.log("Has memory export:", hasMemory);
    console.log("Has test export:", hasTest);

    return hasMemory && hasTest;
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
      console.log("Detected AssemblyScript WebAssembly module");

      const memory = new WebAssembly.Memory({ initial: 2, maximum: 8 });

      function readString(ptr) {
        const view = new Uint8Array(memory.buffer);
        let str = '';
        let i = ptr;
        while (view[i] !== 0) {
          str += String.fromCharCode(view[i]);
          i++;
        }
        return str;
      }

      function writeString(str) {
        const view = new Uint8Array(memory.buffer);
        const bytes = new TextEncoder().encode(str + '\0');
        const ptr = instance.exports.__new(bytes.length, 1);
        view.set(bytes, ptr);
        return ptr;
      }

      const importObject = {
        env: {
          abort: (msg, file, line, column) => {
            console.error(`Abort called at ${file}:${line}:${column}: ${msg}`);
          },
          logMessage: (msgPtr, msgLen) => {
            const bytes = new Uint8Array(memory.buffer, msgPtr, msgLen);
            const message = new TextDecoder().decode(bytes);
            console.log("WASM log:", message);
          },
          memory: memory
        },
        index: {
          query_rdf_tbv_cli: (queryPtr, queryLen) => {
            const query = readString(queryPtr);
            console.log("Executing RDF query via TBV-CLI:", query);

            return new Promise((resolve) => {
              executeRdfQuery(query)
                .then((result) => {
                  console.log("RDF query result:", result);
                  const resultJson = JSON.stringify(result);
                  const resultPtr = writeString(resultJson);
                  resolve(resultPtr);
                })
                .catch((error) => {
                  console.error("Error executing RDF query:", error);
                  const errorJson = JSON.stringify({ error: error.message });
                  const errorPtr = writeString(errorJson);
                  resolve(errorPtr);
                });
            });
          }
        }
      };

      const result = await WebAssembly.instantiate(wasmBuffer, importObject);
      instance = result.instance;

      console.log("Available exports:", Object.keys(instance.exports));

      global.setQueryResult = (result) => {
        console.log("Processing credit result");
        try {
          const resultPtr = writeString(result);
          const processedResultPtr = instance.exports.process_credit_result(resultPtr);
          const processedResult = readString(processedResultPtr);
          console.log("Processed result:", processedResult);
          
          const finalResult = { result: processedResult };
          console.log("Final result:", finalResult);
          global.setFinalResult(finalResult);
          global.resolveRdfQuery();
        } catch (error) {
          console.error("Error processing query result:", error);
          global.resolveRdfQuery();
        }
      };

      if (typeof instance.exports.test !== "function") {
        throw new Error("Test function not found in AssemblyScript module");
      }

      console.log("Executing AssemblyScript test function");
      instance.exports.test();

      // Wait for the RDF query to complete
      await Promise.race([
        rdfQueryPromise,
        delay(10000), // 10 second timeout
      ]);

      if (!rdfQueryComplete) {
        console.log("RDF query timed out");
      } else {
        console.log("RDF query completed successfully");
      }
    } else {
      throw new Error("Unsupported WebAssembly module type");
    }

    console.log(`Testing WASM file: ${filePath}`);
    console.log("WebAssembly execution completed");

    return { success: true, result: "WebAssembly execution completed" };

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