#!/usr/bin/env node
const { Command } = require("commander");
const path = require("path");
const fs = require("fs");
const { generateDockerfile } = require("./conversion_dockerfile");
const { executeWasmFile } = require("./execution-files/executeWasm");
const { executeRdfQuery } = require('./rdfHandler');
const { startGoServer } = require('./go-http/goHttpApi');
const { startRustServer } = require('./rust-http/rustHttpApi');
const { startAssemblyScriptServer } = require('./asc-http/ascHttpApi');
const { createServer } = require('./simpleApi');

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
    await stopCurrentServer();
    currentServer = await createServer();
    const executionResult = await executeWasmFile(filePath);
    if (executionResult.success) {
      console.log(`Testing WASM file: ${filePath}`);
      process.env.WASM_FILE = filePath;
    } else {
      console.error("Failed to execute WASM file.");
    }
    await stopCurrentServer();
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

let currentServer = null;

async function stopCurrentServer() {
  if (currentServer) {
    console.log('Stopping current server...');
    await new Promise((resolve) => currentServer.close(resolve));
    currentServer = null;
    console.log('Current server stopped');
  }
}

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

    await stopCurrentServer();

    try {
      currentServer = await startGoServer(filePath, options.port);
      console.log(`Server started on port ${options.port}`);
      process.on('SIGINT', async () => {
        console.log('Shutting down server...');
        await stopCurrentServer();
        console.log('Server shut down successfully');
        process.exit(0);
      });
    } catch (error) {
      console.error("Failed to start server:", error);
      process.exit(1);
    }
  });

program
  .command("serve-rust <wasmFile>")
  .description("Start an HTTP server using the specified Rust WebAssembly file")
  .option("-p, --port <number>", "Port to run the server on", 3000)
  .action(async (wasmFile, options) => {
    const filePath = path.resolve(wasmFile);
    if (!fs.existsSync(filePath)) {
      console.error(`WASM file ${filePath} does not exist.`);
      process.exit(1);
    }

    await stopCurrentServer();

    try {
      currentServer = await startRustServer(filePath, options.port);
      console.log(`Rust server started on port ${options.port}`);
      process.on('SIGINT', async () => {
        console.log('Shutting down Rust server...');
        await stopCurrentServer();
        console.log('Rust server shut down successfully');
        process.exit(0);
      });
    } catch (error) {
      console.error("Failed to start Rust server:", error);
      process.exit(1);
    }
  });

program
  .command("serve-asc <wasmFile>")
  .description("Start an HTTP server using the specified AssemblyScript WebAssembly file")
  .option("-p, --port <number>", "Port to run the server on", 3000)
  .action(async (wasmFile, options) => {
    const filePath = path.resolve(wasmFile);
    if (!fs.existsSync(filePath)) {
      console.error(`WASM file ${filePath} does not exist.`);
      process.exit(1);
    }

    await stopCurrentServer();

    try {
      currentServer = await startAssemblyScriptServer(filePath, options.port);
      console.log(`AssemblyScript server started on port ${options.port}`);
      process.on('SIGINT', async () => {
        console.log('Shutting down AssemblyScript server...');
        await stopCurrentServer();
        console.log('AssemblyScript server shut down successfully');
        process.exit(0);
      });
    } catch (error) {
      console.error("Failed to start AssemblyScript server:", error);
      process.exit(1);
    }
  });

program.parse(process.argv);

module.exports = { generateDockerfile, executeWasmFile };