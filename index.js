#!/usr/bin/env node

const { Command } = require("commander");
const path = require("path");
const fs = require("fs");
const { exec } = require("child_process");
const { generateDockerfile } = require("./conversion_dockerfile");

const program = new Command();

program
  .name("tbv-cli")
  .version("1.0.0")
  .description(
    "CLI tool for converting Python, Java, or Go files to WebAssembly using Docker"
  );

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

program.parse(process.argv);

module.exports = { generateDockerfile };
