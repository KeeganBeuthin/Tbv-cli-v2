const { executeGoWasm } = require('./executeGoWasm.js');
const { executeRustWasm } = require('./executeRustWasm.js');
const { executeAssemblyScriptWasm } = require('./executeAssemblyScriptWasm');

module.exports = {
  executeGoWasm,
  executeRustWasm,
  executeAssemblyScriptWasm
};