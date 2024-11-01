/**
 * Module for detecting different types of WebAssembly modules
 * @module wasmDetectors
 */

/**
 * Logs detailed information about WASM module exports and imports
 * @param {WebAssembly.Module} module - The compiled WASM module
 * @param {string} context - Context string for logging
 */
function logModuleInfo(module, context = '') {
    const exports = WebAssembly.Module.exports(module);
    const imports = WebAssembly.Module.imports(module);
  
    console.log(`${context} - Available exports:`, exports.map(exp => exp.name));
    console.log(`${context} - Required imports:`, imports.map(imp => `${imp.module}.${imp.name}`));
    
    return { exports, imports };
  }
  
  /**
   * Checks if a WebAssembly module is compiled from Go
   * @param {ArrayBuffer} wasmBuffer - The WebAssembly binary buffer
   * @returns {Promise<boolean>} True if the module is a Go module
   */
  async function isGoWasm(wasmBuffer) {
    try {
      const module = await WebAssembly.compile(wasmBuffer);
      const { exports, imports } = logModuleInfo(module, 'Go detection');
  
      // Check for required Go exports
      const requiredExports = ['run', 'resume', 'getsp'];
      const hasRequiredExports = requiredExports.every(exp => 
        exports.some(e => e.name === exp)
      );
  
      // Check for Go-specific imports
      const hasGoImports = imports.some(imp => 
        imp.module === 'go' || imp.name.startsWith('syscall/js.')
      );
  
      console.log('Go detection - Has required Go exports:', hasRequiredExports);
      console.log('Go detection - Has Go imports:', hasGoImports);
  
      return hasRequiredExports && hasGoImports;
    } catch (error) {
      console.error('Error during Go WASM detection:', error);
      return false;
    }
  }
  
  /**
   * Checks if a WebAssembly module is compiled from Rust
   * @param {ArrayBuffer} wasmBuffer - The WebAssembly binary buffer
   * @returns {Promise<boolean>} True if the module is a Rust module
   */
  async function isRustWasm(wasmBuffer) {
    try {
      const module = await WebAssembly.compile(wasmBuffer);
      const { exports, imports } = logModuleInfo(module, 'Rust detection');
  
      // Check for required Rust exports
      const requiredExports = [
        'memory',
        'run_test',
        'execute_credit_leg',
        'set_query_result',
        'process_credit_result',
        'custom_handle_http_request',
      ];
      const hasRequiredExports = requiredExports.every(exp => 
        exports.some(e => e.name === exp)
      );
  
      // Check for Rust-specific imports
      const hasRustImports = imports.some(imp => 
        imp.module === 'env' && imp.name === 'log_message'
      );
  
      console.log('Rust detection - Has required Rust exports:', hasRequiredExports);
      console.log('Rust detection - Has Rust imports:', hasRustImports);
  
      return hasRequiredExports && hasRustImports;
    } catch (error) {
      console.error('Error during Rust WASM detection:', error);
      return false;
    }
  }
  
  /**
   * Checks if a WebAssembly module is compiled from AssemblyScript
   * @param {ArrayBuffer} wasmBuffer - The WebAssembly binary buffer
   * @returns {Promise<boolean>} True if the module is an AssemblyScript module
   */
  async function isAssemblyScriptWasm(wasmBuffer) {
    try {
      const module = await WebAssembly.compile(wasmBuffer);
      const { exports, imports } = logModuleInfo(module, 'AssemblyScript detection');
  
      // Check for memory export
      const hasMemory = exports.some(exp => exp.name === 'memory');
  
      // Check for required AssemblyScript functions
      const requiredFunctions = ['runTest', 'setQueryResult', 'main'];
      const hasRequiredFunctions = requiredFunctions.every(func => 
        exports.some(exp => exp.name === func)
      );
  
      // Check for AssemblyScript-specific imports
      const assemblyScriptImports = ['abort', 'trace', 'seed', 'console.log'];
      const hasAssemblyScriptImports = imports.some(imp => 
        imp.module === 'env' && assemblyScriptImports.includes(imp.name)
      );
  
      console.log('AssemblyScript detection - Has memory export:', hasMemory);
      console.log('AssemblyScript detection - Has required functions:', hasRequiredFunctions);
      console.log('AssemblyScript detection - Has AssemblyScript imports:', hasAssemblyScriptImports);
  
      return hasMemory && hasRequiredFunctions && hasAssemblyScriptImports;
    } catch (error) {
      console.error('Error during AssemblyScript WASM detection:', error);
      return false;
    }
  }
  
  /**
   * Gets detailed information about a WebAssembly module
   * @param {ArrayBuffer} wasmBuffer - The WebAssembly binary buffer
   * @returns {Promise<Object>} Object containing module information
   */
  async function getWasmModuleInfo(wasmBuffer) {
    try {
      const module = await WebAssembly.compile(wasmBuffer);
      const { exports, imports } = logModuleInfo(module, 'Module info');
  
      return {
        success: true,
        exports: exports.map(exp => ({
          name: exp.name,
          kind: exp.kind
        })),
        imports: imports.map(imp => ({
          module: imp.module,
          name: imp.name,
          kind: imp.kind
        })),
        isGo: await isGoWasm(wasmBuffer),
        isRust: await isRustWasm(wasmBuffer),
        isAssemblyScript: await isAssemblyScriptWasm(wasmBuffer)
      };
    } catch (error) {
      console.error('Error getting WASM module info:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }
  
  /**
   * Validates that a WebAssembly module has required exports
   * @param {WebAssembly.Module} module - The compiled WASM module
   * @param {string[]} requiredExports - Array of required export names
   * @returns {boolean} True if all required exports are present
   */
  function validateRequiredExports(module, requiredExports) {
    const exports = WebAssembly.Module.exports(module);
    return requiredExports.every(required => 
      exports.some(exp => exp.name === required)
    );
  }
  
  /**
   * Checks if a WebAssembly module has specific imports
   * @param {WebAssembly.Module} module - The compiled WASM module
   * @param {Object} importCriteria - Criteria for matching imports
   * @returns {boolean} True if matching imports are found
   */
  function hasMatchingImports(module, importCriteria) {
    const imports = WebAssembly.Module.imports(module);
    return imports.some(imp => 
      (!importCriteria.module || imp.module === importCriteria.module) &&
      (!importCriteria.name || (
        importCriteria.name instanceof RegExp 
          ? importCriteria.name.test(imp.name)
          : imp.name === importCriteria.name
      ))
    );
  }
  
  module.exports = {
    isGoWasm,
    isRustWasm,
    isAssemblyScriptWasm,
    getWasmModuleInfo,
    validateRequiredExports,
    hasMatchingImports,
    logModuleInfo
  };