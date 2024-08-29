const fs = require("fs");
const { promisify } = require("util");
const { TextDecoder, TextEncoder } = require("util");
const axios = require("axios");
const util = require("util");
const path = require("path");
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
    const imports = WebAssembly.Module.imports(module);

    console.log("Available exports:", exports.map((exp) => exp.name));
    console.log("Required imports:", imports.map((imp) => `${imp.module}.${imp.name}`));


    const requiredExports = ["run", "resume", "getsp"];
    const hasRequiredExports = requiredExports.every((exp) =>
      exports.some((e) => e.name === exp)
    );
    

    const hasGoImports = imports.some((imp) => 
      imp.module === "go" || imp.name.startsWith("syscall/js.")
    );

    console.log("Has required Go exports:", hasRequiredExports);
    console.log("Has Go imports:", hasGoImports);

    return hasRequiredExports && hasGoImports;
  } catch (error) {
    console.error("Error during Go WASM detection:", error);
    return false;
  }
}

async function isRustWasm(wasmBuffer) {
  try {
    const module = await WebAssembly.compile(wasmBuffer);
    const exports = WebAssembly.Module.exports(module);
    const imports = WebAssembly.Module.imports(module);

    console.log("Available exports:", exports.map((exp) => exp.name));
    console.log("Required imports:", imports.map((imp) => `${imp.module}.${imp.name}`));


    const requiredExports = [
      "memory",
      "execute_credit_leg",
      "process_credit_result",
      "execute_debit_leg",
      "alloc",
      "dealloc",
    ];
    const hasRequiredExports = requiredExports.every((exp) =>
      exports.some((e) => e.name === exp)
    );


    const hasWbindgenImports = imports.some((imp) => imp.module === "__wbindgen_placeholder__");

    console.log("Has required Rust exports:", hasRequiredExports);
    console.log("Has wbindgen imports:", hasWbindgenImports);

    return hasRequiredExports && hasWbindgenImports;
  } catch (error) {
    console.error("Error during Rust WASM detection:", error);
    return false;
  }
}


async function isAssemblyScriptWasm(wasmBuffer) {
  try {
    const module = await WebAssembly.compile(wasmBuffer);
    const exports = WebAssembly.Module.exports(module);
    const imports = WebAssembly.Module.imports(module);

    console.log("Available exports:", exports.map((exp) => exp.name));
    console.log("Required imports:", imports.map((imp) => `${imp.module}.${imp.name}`));


    const hasMemory = exports.some((exp) => exp.name === "memory");
    const hasRequiredFunctions = ["runTest", "setQueryResult", "main"].every(
      (func) => exports.some((exp) => exp.name === func)
    );


    const hasAssemblyScriptImports = imports.some(
      (imp) => imp.module === "env" && ["abort", "trace", "seed", "console.log"].includes(imp.name)
    );

    console.log("Has memory export:", hasMemory);
    console.log("Has required functions:", hasRequiredFunctions);
    console.log("Has AssemblyScript imports:", hasAssemblyScriptImports);

    return hasMemory && hasRequiredFunctions && hasAssemblyScriptImports;
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

    const isRustModule = await isRustWasm(wasmBuffer);
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
    
      console.log("Running Go program...");
      const runPromise = go.run(result.instance);
    
      await new Promise((resolve) => setTimeout(resolve, 100));
    
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
    
      // Add readHtmlFile functionality
      if (typeof result.instance.exports.readHtmlFile === "function") {
        global.readHtmlFile = (htmlFilePath) => {
          console.log("readHtmlFile called with path:", htmlFilePath);
          try {
            const fileContent = fs.readFileSync(htmlFilePath, 'utf8');
            const fileContentPtr = go.mem.stringToPtr(fileContent);
            const resultPtr = result.instance.exports.readHtmlFile(fileContentPtr);
            const htmlContent = go.mem.loadString(resultPtr);
            console.log("HTML content read successfully");
            return htmlContent;
          } catch (error) {
            console.error("Error in readHtmlFile:", error);
            throw error;
          }
        };
        console.log("readHtmlFile function is now available globally");
      } else {
        console.log("readHtmlFile function not found in WebAssembly exports");
      }
    
      // Start the API server after setting up readHtmlFile
      const apiServer = await startApiServer();
      console.log("API Server started on port:", apiServer.port);
    
      // Test readHtmlFile function
      try {
        const testHtmlPath = path.join(__dirname, 'hello-world.html');
        const fileContent = await fs.promises.readFile(testHtmlPath, 'utf8');
        const testContent = global.readHtmlFile(fileContent);
        console.log("Test readHtmlFile successful. Content:", testContent.substring(0, 50) + "...");
      } catch (error) {
        console.error("Error testing readHtmlFile:", error);
      }
      
      return {
        success: true,
        result: "Go program execution completed",
        apiServer: apiServer
      };
    }else if (isAssemblyScriptModule) {
      console.log("Detected AssemblyScript-compiled WebAssembly module");
    
      let instance;
      let memoryBase = 0;
      const memory = new WebAssembly.Memory({ initial: 256, maximum: 512 });
    
      function readStringFromMemory(ptr, len, quiet = false) {
        const view = new Uint8Array(memory.buffer, ptr, len);
        const str = new TextDecoder().decode(view);
        if (!quiet) {
          console.log(`Read string from memory: "${str}" (length: ${len})`);
        }
        return str;
      }
    
      function writeStringToMemory(str) {
        console.log(`Writing string to memory: "${str}" (length: ${str.length})`);
        const encoder = new TextEncoder();
        const encodedStr = encoder.encode(str);
        const ptr = memoryBase;
        memoryBase += encodedStr.length + 1;
        
        if (memoryBase > memory.buffer.byteLength) {
          const pages = Math.ceil((memoryBase - memory.buffer.byteLength) / 65536);
          memory.grow(pages);
        }
        
        new Uint8Array(memory.buffer).set(encodedStr, ptr);
        new Uint8Array(memory.buffer)[ptr + encodedStr.length] = 0;
        console.log(`String written to memory at address: ${ptr}`);
        return { ptr, len: encodedStr.length };
      }
    
      const importObject = {
        env: {
          abort: (message, fileName, lineNumber, columnNumber) => {
            console.error(`Abort called at ${fileName}:${lineNumber}:${columnNumber}: ${message}`);
          },
          logMessage: (ptr, len) => {
            const message = readStringFromMemory(ptr, len, true);
            console.log("WASM:", message);
          },
          'console.log': (ptr) => {
            let len = 0;
            const view = new Uint8Array(memory.buffer, ptr);
            while (view[len] !== 0) len++;
            const str = readStringFromMemory(ptr, len, true);
            console.log("WASM console.log:", str);
          },
      
          memory: memory
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
          }
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
    
        global.runTest = () => {
          if (typeof instance.exports.runTest !== 'function') {
            throw new Error("runTest function not found in exports");
          }
          instance.exports.runTest();
        };
    
        global.setQueryResult = (result) => {
          console.log("JavaScript: setQueryResult called");
          if (typeof instance.exports.setQueryResult !== 'function') {
            throw new Error("setQueryResult function not found in exports");
          }
          const { ptr, len } = writeStringToMemory(result);
          console.log(`JavaScript: Calling WASM setQueryResult with ptr: ${ptr}, len: ${len}`);
          instance.exports.setQueryResult(ptr, len);
          console.log("JavaScript: WASM setQueryResult finished");
        };
    
        global.setFinalResult = (result) => {
          console.log(`JavaScript: setFinalResult called with result: ${result}`);
        };

        
        console.log("Executing main function");
        instance.exports.main();
    
        console.log("Executing runTest function");
        global.runTest();
    
        return { success: true, message: "AssemblyScript module executed successfully" };
      } 
      catch (error) {
        console.error("Error instantiating or executing AssemblyScript module:", error);
        return { success: false, error: error.message };
      }
    }
    else if (isRustModule) {
      console.log("Detected Rust-compiled WebAssembly module");
    
      const importObject = {
        __wbindgen_placeholder__: {
          __wbindgen_string_new: (ptr, len) => {
            console.log("__wbindgen_string_new called with ptr:", ptr, "len:", len);
            const memory = new Uint8Array(instance.exports.memory.buffer);
            const slice = memory.subarray(ptr, ptr + len);
            const text = new TextDecoder().decode(slice);
            console.log("Decoded text:", text);
            return text;
          },
          __wbindgen_throw: (ptr, len) => {
            console.log("__wbindgen_throw called with ptr:", ptr, "len:", len);
            const memory = new Uint8Array(instance.exports.memory.buffer);
            const slice = memory.subarray(ptr, ptr + len);
            const text = new TextDecoder().decode(slice);
            console.error("Rust threw an error:", text);
            throw new Error(text);
          },
          __wbg_log_b103404cc5920657: (ptr, len) => {
            console.log("__wbg_log_b103404cc5920657 called with ptr:", ptr, "len:", len);
            if (ptr === 0 || len === undefined) {
              console.log("Rust log: (empty or invalid log)");
              return;
            }
            const memory = new Uint8Array(instance.exports.memory.buffer);
            const slice = memory.subarray(ptr, ptr + len);
            console.log("Rust log:", new TextDecoder().decode(slice));
          },
          __wbg_new_abda76e883ba8a5f: () => {
            console.log("__wbg_new_abda76e883ba8a5f called");
            return {};
          },
          __wbg_stack_658279fe44541cf6: (arg0, arg1) => {
            console.log('__wbg_stack_658279fe44541cf6 called with:', arg0, arg1);
            return 0;
          },
          __wbg_error_f851667af71bcfc6: (arg0, arg1) => {
            console.error('__wbg_error_f851667af71bcfc6 called with:', arg0, arg1);
          },
          __wbindgen_object_drop_ref: (arg0) => {
            console.log('__wbindgen_object_drop_ref called with:', arg0);
          },
        },
        env: {
          log_message: (ptr, len) => {
            console.log("log_message called with ptr:", ptr, "len:", len);
            const memory = new Uint8Array(instance.exports.memory.buffer);
            const slice = memory.subarray(ptr, ptr + len);
            console.log("Rust log:", new TextDecoder().decode(slice));
          },
        },
      };
      console.log("Instantiating Rust WebAssembly module...");
      try {
        const result = await WebAssembly.instantiate(wasmBuffer, importObject);
        instance = result.instance;
        console.log('Available Rust exports:', Object.keys(instance.exports));
    

    
        global.runTest = async () => {
          console.log("Running Rust SDK test");
    

          const amount = "100.00";
          const account = "account123";
          const { ptr: amountPtr, len: amountLen } = writeStringToMemoryRust(amount);
          const { ptr: accountPtr, len: accountLen } = writeStringToMemoryRust(account);
    
          const queryPtr = instance.exports.execute_credit_leg(amountPtr, amountLen, accountPtr, accountLen);
          const query = readStringFromMemoryRust(queryPtr);
          console.log("Credit leg query:", query);
    

          let rdfQueryResult;
          try {
            rdfQueryResult = await executeRdfQuery(query);
            console.log("RDF query result:", rdfQueryResult);
          } catch (error) {
            console.error("Error executing RDF query:", error);
            rdfQueryResult = { error: error.message };
          }
    

          const { ptr: resultPtr, len: resultLen } = writeStringToMemoryRust(JSON.stringify(rdfQueryResult));
          const processedResultPtr = instance.exports.process_credit_result(resultPtr, resultLen, amountPtr, amountLen);
          const processedResult = readStringFromMemoryRust(processedResultPtr);
          console.log("Processed credit result:", processedResult);


          const debitAmount = "50.00";
          const { ptr: debitAmountPtr, len: debitAmountLen } = writeStringToMemoryRust(debitAmount);
          const debitResultPtr = instance.exports.execute_debit_leg(debitAmountPtr, debitAmountLen, accountPtr, accountLen);
          const debitResult = readStringFromMemoryRust(debitResultPtr);
          console.log("Debit leg result:", debitResult);
    

          instance.exports.dealloc(amountPtr, amountLen + 1);
          instance.exports.dealloc(accountPtr, accountLen + 1);
          instance.exports.dealloc(resultPtr, resultLen + 1);
          instance.exports.dealloc(debitAmountPtr, debitAmountLen + 1);
    
          return { creditQuery: query, creditResult: processedResult, debitResult: debitResult };
        };
    
        console.log("Executing Rust runTest function");
        try {
          const testResult = await global.runTest();
          console.log("Rust test results:", testResult);
          return { success: true, message: "Rust module executed successfully", result: testResult };
        } catch (error) {
          console.error("Error executing Rust runTest function:", error);
          return { success: false, error: error.message };
        }
      } catch (error) {
        console.error("Error instantiating or executing Rust module:", error);
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
      const memory = new Uint8Array(instance.exports.memory.buffer);
      let len = 0;
      while (memory[ptr + len] !== 0) len++;
      return new TextDecoder().decode(memory.subarray(ptr, ptr + len));
    }
    

    function writeStringToMemoryRust(str) {
      const encoder = new TextEncoder();
      const encodedStr = encoder.encode(str + '\0');
      const ptr = instance.exports.alloc(encodedStr.length);
      const memory = new Uint8Array(instance.exports.memory.buffer);
      memory.set(encodedStr, ptr);
      return { ptr, len: encodedStr.length - 1 };
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
