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

let wasmInstance = null;

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

const { executeGoWasm } = require("./executeGoWasm");
const { executeRustWasm } = require("./executeRustWasm");
const { executeAssemblyScriptWasm } = require("./executeAssemblyScriptWasm");

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

    const hasGoImports = imports.some(
      (imp) => imp.module === "go" || imp.name.startsWith("syscall/js.")
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

    console.log("Rust detection - Available exports:", exports.map((exp) => exp.name));
    console.log("Rust detection - Required imports:", imports.map((imp) => `${imp.module}.${imp.name}`));

    const requiredExports = [
      "memory",
      "run_test",
      "execute_credit_leg",
      "set_query_result",
      "process_credit_result",
      "custom_handle_http_request",
    ];
    const hasRequiredExports = requiredExports.every((exp) =>
      exports.some((e) => e.name === exp)
    );

    const hasRustImports = imports.some(
      (imp) => imp.module === "env" && imp.name === "log_message"
    );

    console.log("Rust detection - Has required Rust exports:", hasRequiredExports);
    console.log("Rust detection - Has Rust imports:", hasRustImports);

    return hasRequiredExports && hasRustImports;
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

    console.log(
      "Available exports:",
      exports.map((exp) => exp.name)
    );
    console.log(
      "Required imports:",
      imports.map((imp) => `${imp.module}.${imp.name}`)
    );

    const hasMemory = exports.some((exp) => exp.name === "memory");
    const hasRequiredFunctions = ["runTest", "setQueryResult", "main"].every(
      (func) => exports.some((exp) => exp.name === func)
    );

    const hasAssemblyScriptImports = imports.some(
      (imp) =>
        imp.module === "env" &&
        ["abort", "trace", "seed", "console.log"].includes(imp.name)
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

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Global function definitions
global.setFinalResult = (result) => {
  console.log("Final result:", result);
  // You can do something with the final result here
};


global.executeRdfQuery = async (query) => {
  try {
    const result = await executeRdfQuery(query);
    const resultString = JSON.stringify(result);
    const { ptr, len } = writeStringToMemory(resultString);
    instance.exports.setQueryResult(ptr, len);
  } catch (error) {
    console.error("Error executing RDF query:", error);
    const errorString = JSON.stringify({ error: error.message });
    const { ptr, len } = writeStringToMemory(errorString);
    instance.exports.setQueryResult(ptr, len);
  }
};

async function executeWasmFile(filePath) {
  let creditResult;
  let instance;
  
  global.setFinalResult = (result) => {
    console.log("Final result:", result);
    creditResult = result.creditResult;
  };

  let rdfQueryComplete = false;
  const rdfQueryPromise = new Promise((resolve) => {
    global.resolveRdfQuery = () => {
      rdfQueryComplete = true;
      resolve();
    };
  });

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

    let result;

    if (isGoModule) {
      console.log("Detected Go-compiled WebAssembly module");
      result = await executeGoWasm(wasmBuffer, Go, global);
    } else if (isAssemblyScriptModule) {
      console.log("Detected AssemblyScript-compiled WebAssembly module");
      result = await executeAssemblyScriptWasm(wasmBuffer, global);
    } else if (isRustModule) {
      console.log("Detected Rust-compiled WebAssembly module");
      result = await executeRustWasm(wasmBuffer, global);
    } else {
      throw new Error("Unknown WebAssembly module type");
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

    if (creditResult) {
      return { success: true, creditResult, result };
    } else {
      return { success: false, error: "Credit result not set" };
    }
  } catch (error) {
    console.error("Error executing WASM file:", error);
    return { success: false, error: error.message };
  }
}

module.exports = { executeWasmFile };
