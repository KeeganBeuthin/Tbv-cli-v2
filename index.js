#!/usr/bin/env node

const { Command } = require('commander');
const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');

const program = new Command();

program
  .name('tbv-cli')
  .version('1.0.0')
  .description('CLI tool for converting Python files to WebAssembly using Docker and py2wasm');

program
  .command('build <file>')
  .description('Convert a Python file to WebAssembly')
  .action((file) => {
    const filePath = path.resolve(file);

    // Check if the file exists
    if (!fs.existsSync(filePath)) {
      console.error(`File ${filePath} does not exist.`);
      process.exit(1);
    }

    // Copy the file to the Docker context
    fs.copyFileSync(filePath, path.join(__dirname, 'hello.py'));

    // Build the Docker image
    exec('docker build -t py2wasm-image .', (err, stdout, stderr) => {
      if (err) {
        console.error(`Error building Docker image: ${stderr}`);
        process.exit(1);
      }
      console.log(stdout);

      // Run the Docker container
      exec(`docker run --rm -v ${__dirname}:/app py2wasm-image`, (err, stdout, stderr) => {
        if (err) {
          console.error(`Error running Docker container: ${stderr}`);
          process.exit(1);
        }
        console.log(stdout);

        // Copy the output.wasm file back to the original directory
        const wasmFilePath = path.join(__dirname, 'output.wasm');
        if (fs.existsSync(wasmFilePath)) {
          console.log(`Conversion successful! The output.wasm file is located at ${wasmFilePath}`);
        } else {
          console.error('Failed to generate the output.wasm file.');
        }
      });
    });
  });

program.parse(process.argv);
