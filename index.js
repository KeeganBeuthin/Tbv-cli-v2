#!/usr/bin/env node
// index.js
const { Command } = require("commander");
const path = require("path");
const fs = require("fs");
const { generateDockerfile } = require("./conversion_dockerfile");
const { testWasmFunctions } = require("./testWasm");

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
  .command("test <wasmFile>")
  .description("Test a wasm file for required exported functions")
  .action((wasmFile) => {
    const filePath = path.resolve(wasmFile);
    if (!fs.existsSync(filePath)) {
      console.error(`WASM file ${filePath} does not exist.`);
      process.exit(1);
    }
    testWasmFunctions(filePath);
  });

program.parse(process.argv);

module.exports = { generateDockerfile, testWasmFunctions };
