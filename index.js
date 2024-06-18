#!/usr/bin/env node
// index.js
const { Command } = require("commander");
const path = require("path");
const fs = require("fs");
const { generateDockerfile } = require("./conversion_dockerfile");
const { spawn } = require("child_process");
const { executeWasmFile } = require("./executeWasm");


const program = new Command();

program
  .name("tbv-cli")
  .version("1.0.0")
  .description("CLI tool for converting files to WebAssembly and testing them");

program
  .command("build <file> <language>")
  .description("Convert a file to WebAssembly")
  .action((file, language) => {
    const filePath = path.resolve(file);
    if (!fs.existsSync(filePath)) {
      console.error(`File ${filePath} does not exist.`);
      process.exit(1);
    }
    generateDockerfile(language, filePath);
  });

  program
  .command("execute <wasmFile>")
  .description("Execute and test a specific wasm file")
  .action(async (wasmFile) => {
    const filePath = path.resolve(wasmFile);
    if (!fs.existsSync(filePath)) {
      console.error(`WASM file ${filePath} does not exist.`);
      process.exit(1);
    }

    console.log(`Executing WASM file: ${filePath}`);
    const executionResult = await executeWasmFile(filePath);
    if (executionResult.success) {
      console.log(`Testing WASM file: ${filePath}`);
      process.env.WASM_FILE = filePath; // Set the WASM file path for testing
      runTests(); // Function to run Jest tests
    } else {
      console.error('Failed to execute WASM file.');
    }
  });

program.parse(process.argv);

module.exports = { generateDockerfile, executeWasmFile};
