const fs = require("fs");
const { promisify } = require("util");
const path = require("path");

const { setupCryptoPolyfill } = require('./polyfillUtil.js');


// Set up crypto polyfill first
setupCryptoPolyfill();

// Import our modular components
const { 
    isGoWasm, 
    isRustWasm, 
    isAssemblyScriptWasm,
    getWasmModuleInfo 
} = require('./wasmDetectors.js');

const {
    executeGoWasm,
    executeRustWasm,
    executeAssemblyScriptWasm
} = require('./executors/compiledExecution.js');

const {
    executeRdfQuery,
    executeRdfQueryWithEvents,
    RDFQueryError,
    queryEmitter
} = require('./rdfQueryHandler.js');

const {
    HeapManager,
    createWasmMemory
} = require('./memoryUtils.js');

// Promisified fs.readFile
const readFile = promisify(fs.readFile);

// Load Go runtime
require("./wasm_exec.js");
const Go = globalThis.Go;

if (typeof Go !== "function") {
    console.error(
        "Go class is not defined. Make sure wasm_exec.js is loaded correctly."
    );
}

/**
 * Main function to execute a WebAssembly file
 * @param {string} filePath - Path to the WASM file
 * @returns {Promise<Object>} Execution result
 */
async function executeWasmFile(filePath) {
    let creditResult;
    let testResult;

    // Set up global handlers
    global.setFinalResult = (result) => {
        console.log("Final result:", result);
        creditResult = result.creditResult;
    };

    // Set up RDF query handling
    let rdfQueryComplete = false;
    const rdfQueryPromise = new Promise((resolve) => {
        global.resolveRdfQuery = () => {
            rdfQueryComplete = true;
            resolve();
        };
    });

    // Set up global RDF query executor
    global.executeRdfQuery = async (query) => {
        try {
            const result = await executeRdfQueryWithEvents(query);
            global.setQueryResult(JSON.stringify(result));
        } catch (error) {
            console.error("Error executing RDF query:", error);
            global.setQueryResult(JSON.stringify({ error: error.message }));
        }
    };

    try {
        // Read and validate WASM file
        console.log(`Loading WASM file from: ${filePath}`);
        const wasmBuffer = await readFile(filePath);
        
        // Get comprehensive module info
        const moduleInfo = await getWasmModuleInfo(wasmBuffer);
        if (!moduleInfo.success) {
            throw new Error(`Failed to analyze WASM module: ${moduleInfo.error}`);
        }

        console.log("Module analysis:", moduleInfo);

        // Determine module type and execute accordingly
        let executionResult;
        
        if (moduleInfo.isGo) {
            console.log("Executing Go WASM module");
            executionResult = await executeGoWasm(wasmBuffer);
        } else if (moduleInfo.isRust) {
            console.log("Executing Rust WASM module");
            executionResult = await executeRustWasm(wasmBuffer);
        } else if (moduleInfo.isAssemblyScript) {
            console.log("Executing AssemblyScript WASM module");
            executionResult = await executeAssemblyScriptWasm(wasmBuffer);
        } else {
            throw new Error("Unsupported WASM module type");
        }

        // Wait for RDF query completion or timeout
        const timeoutDuration = 3000; // 10 seconds
        const rdfQueryResult = await Promise.race([
            rdfQueryPromise,
            new Promise((_, reject) => 
                setTimeout(() => reject(new Error("RDF query timed out")), timeoutDuration)
            )
        ]).catch(error => {
            console.log("RDF query status:", error.message);
            return null;
        });

        // Compile final result
        const result = {
            success: executionResult.success,
            moduleType: moduleInfo.isGo ? 'Go' : 
                       moduleInfo.isRust ? 'Rust' : 
                       moduleInfo.isAssemblyScript ? 'AssemblyScript' : 'Unknown',
            executionResult: executionResult,
            rdfQueryComplete: executionResult.rdfQueryComplete
        };

        // Clean up event listeners
        queryEmitter.removeAllListeners();

        // Log execution completion
        console.log("WASM execution completed:", result);
        
        return result;

    } catch (error) {
        console.error("Error executing WASM file:", error);
        
        // Clean up event listeners
        queryEmitter.removeAllListeners();
        
        return {
            success: false,
            error: error.message,
            details: error instanceof RDFQueryError ? {
                query: error.query,
                stderr: error.stderr,
                stdout: error.stdout
            } : undefined
        };
    }
}

// Export the main function and supporting utilities
module.exports = {
    executeWasmFile,
    // Export additional utilities that might be useful for consumers
    getWasmModuleInfo,
    executeRdfQuery,
    executeRdfQueryWithEvents,
    queryEmitter
};