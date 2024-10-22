const fs = require('fs');
const path = require('path');
const { TextDecoder, TextEncoder } = require("util");

// Load wasm_exec.js content
const wasmExecPath = path.join(__dirname, '.', 'wasm_exec.js');
const wasmExecContent = fs.readFileSync(wasmExecPath, 'utf8');

// Evaluate wasm_exec.js content in the current context
eval(wasmExecContent);

async function executeGoWasm(wasmBuffer, Go, global) {
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
      malloc: (size) => {
        console.log("malloc called with size:", size);
        return malloc(size);
      },
      free: (ptr) => {
        console.log("free called with ptr:", ptr);
      },
      query_rdf_tbv_cli: (queryPtr, queryLen) => {
        const query = go.mem.loadString(queryPtr, queryLen);
        console.log("Executing RDF query via TBV-CLI:", query);

        global.executeRdfQuery(query)
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
  const instance = result.instance;
  
  console.log("Go WebAssembly module instantiated successfully");
  console.log("Available exports:", Object.keys(result.instance.exports));

  console.log("Running Go program...");
  go.run(instance);

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
      new Promise((resolve) => {
        // Simulating the runPromise
        setTimeout(resolve, 5000);
      }),
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

  return { success: true, message: "Go module executed successfully" };
}

module.exports = { executeGoWasm };
