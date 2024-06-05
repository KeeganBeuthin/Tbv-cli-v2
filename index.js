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
.command('build <file> <language>')
  .description('Convert a Python or Java file to WebAssembly')
  .action((file, language) => {
    const filePath = path.resolve(file);

    // Check if the file exists
    if (!fs.existsSync(filePath)) {
      console.error(`File ${filePath} does not exist.`);
      process.exit(1);
    }

    // Copy the file to the Docker context
    const fileName = language === 'python' ? 'hello.py' : 'Hello.java';
    fs.copyFileSync(filePath, path.join(__dirname, fileName));

    // Build the Docker image
    const dockerImage = language === 'python' ? 'py2wasm-image' : 'java2wasm-image';
exec(`docker build -t ${dockerImage} .`, (err, stdout, stderr) => {
  if (err) {
    console.error(`Error building Docker image: ${stderr}`);
    process.exit(1);
  }
  console.log(stdout);

  // Run the Docker container
  exec(`docker run --rm -v ${__dirname}:/app -e FILE=${file} -e LANGUAGE=${language} ${dockerImage}`, (err, stdout, stderr) => {
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
