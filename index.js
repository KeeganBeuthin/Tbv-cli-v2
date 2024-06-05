#!/usr/bin/env node

const { Command } = require('commander');
const path = require('path');
const fs = require('fs');
const { generateDockerfile } = require('./conversion_dockerfile');

const program = new Command();

program
  .name('tbv-cli')
  .version('1.0.0')
  .description('CLI tool for converting Python or Java files to WebAssembly using Docker');

program
  .command('build <file> <language>')
  .description('Convert a Python or Java file to WebAssembly')
  .action((file, language) => {
    const filePath = path.resolve(file);

    if (!fs.existsSync(filePath)) {
      console.error(`File ${filePath} does not exist.`);
      process.exit(1);
    }

    const fileName = path.basename(filePath);
    fs.copyFileSync(filePath, path.join(__dirname, fileName));

    generateDockerfile(language, filePath);
  });

program.parse(process.argv);
