#!/usr/bin/env node
const { Command } = require("commander");
const path = require("path");
const fs = require("fs");
const { generateDockerfile } = require("./conversion_dockerfile");
const { executeWasmFile } = require("./executeWasm");
const { executeRdfQuery } = require('./rdfHandler');
const { startServer } = require('./httpApi');

const program = new Command();

program
  .name("tbv-cli")
  .version("1.0.0")
  .description("CLI tool for converting files to WebAssembly, testing them, and running an HTTP server");

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
      process.env.WASM_FILE = filePath;
    } else {
      console.error("Failed to execute WASM file.");
    }
  });

program
  .command("rdf-query <query>")
  .description("Execute an RDF query")
  .action(async (query) => {
    try {
      const result = await executeRdfQuery(query);
      console.log("RDF Query Result:", JSON.stringify(result));
    } catch (error) {
      console.error("Error executing RDF query:", error);
    }
  });

program
  .command("serve <wasmFile>")
  .description("Start an HTTP server using the specified WebAssembly file")
  .option("-p, --port <number>", "Port to run the server on", 3000)
  .action(async (wasmFile, options) => {
    const filePath = path.resolve(wasmFile);
    if (!fs.existsSync(filePath)) {
      console.error(`WASM file ${filePath} does not exist.`);
      process.exit(1);
    }

    try {
      const server = await startServer(filePath, options.port);
      process.on('SIGINT', () => {
        console.log('Shutting down server...');
        server.close(() => {
          console.log('Server shut down successfully');
          process.exit(0);
        });
      });
    } catch (error) {
      console.error("Failed to start server:", error);
      process.exit(1);
    }
  });

program.parse(process.argv);

module.exports = { generateDockerfile, executeWasmFile };