//conversion_dockerfile.js
const { Command } = require("commander");
const path = require("path");
const fs = require("fs");
const { exec } = require("child_process");

function generatePythonDockerfile(filePath) {
  const fileName = path.basename(filePath);

  return `
FROM ubuntu:latest

RUN apt-get update && \\
    apt-get install -y software-properties-common && \\
    add-apt-repository ppa:deadsnakes/ppa && \\
    apt-get update && \\
    apt-get install -y python3.11 python3.11-venv patchelf binutils wget

WORKDIR /app

RUN python3.11 -m venv /opt/venv
ENV PATH="/opt/venv/bin:$PATH"

RUN pip install py2wasm

COPY ${fileName} /app/${fileName}

CMD ["py2wasm", "${fileName}", "-o", "/app/output.wasm"]
  `;
}

function generateAssemblyScriptDockerfile(filePath) {
  const fileName = path.basename(filePath);

  return `
FROM node:latest

# Install AssemblyScript compiler
RUN npm install -g assemblyscript

# Set working directory
WORKDIR /app

# Copy the TypeScript file into the Docker container
COPY ${fileName} /app/${fileName}

# Change CMD to run AssemblyScript compiler manually and keep the container running
CMD npx asc ${fileName} -o output.wasm && ls -l /app || bash
  `;
}

function generateRustDockerfile(directoryPath) {
  return `
FROM rust:latest

# Install wasm-pack for Rust -> WebAssembly compilation
RUN curl https://rustwasm.github.io/wasm-pack/installer/init.sh -sSf | sh

# Set working directory to /app
WORKDIR /app

# Copy the entire Rust project directory into the Docker container
COPY . /app

# Build the project with wasm-pack, targeting the 'web' environment
RUN wasm-pack build --target web || (echo "Failed to build Rust project" && exit 1)


# Copy the generated .wasm file to the mounted volume
CMD cp ./pkg/*_bg.wasm /output/output.wasm || (echo "Failed to copy .wasm file" && exit 1)
  `;
}

function generateGoDockerfile(filePath) {
  const fileName = path.basename(filePath);

  return `
FROM tinygo/tinygo:latest

WORKDIR /app

COPY ${fileName} /app/${fileName}

ENTRYPOINT ["/bin/bash", "-c"]
CMD ["tinygo build -o /app/output.wasm -target=wasm ${fileName} || tail -f /dev/null"]
  `;
}

function generateDockerfile(language, inputPath) {
  let dockerfileContent;
  const fileDirectory = language === 'rust' ? inputPath : path.dirname(inputPath); // Directory containing the file or project
  const fileName = path.basename(inputPath); // File name

  switch(language) {
    case "python":
      dockerfileContent = generatePythonDockerfile(fileName);
      break;
    case "java":
      // dockerfileContent = generateJavaDockerfile(inputPath);
      break;
    case "go":
      dockerfileContent = generateGoDockerfile(fileName);
      break;
    case "assemblyscript":
      dockerfileContent = generateAssemblyScriptDockerfile(fileName);
      break;
    case "rust":
      dockerfileContent = generateRustDockerfile(fileDirectory);  // Pass the entire directory path for Rust
      break;
    default:
      console.error(
        'Unsupported language. Please use "python", "assemblyscript", "java", "go", or "rust".'
      );
      process.exit(1);
  }

  const dockerfilePath = path.join(fileDirectory, "Dockerfile");
  fs.writeFileSync(dockerfilePath, dockerfileContent);

  const dockerImage = `${language.toLowerCase()}2wasm-image`;
  const buildContext = language === 'rust' ? inputPath : fileDirectory;

  exec(
    `docker build -f ${dockerfilePath} -t ${dockerImage} ${buildContext}`,
    (err, stdout, stderr) => {
      if (err) {
        console.error(`Error building Docker image: ${stderr}`);
        process.exit(1);
      }
      console.log(stdout);

      if (language === 'rust') {
        exec(
          `docker run --rm -v ${fileDirectory}:/output ${dockerImage}`,
          (err, stdout, stderr) => {
            if (err) {
              console.error(`Error running Docker container: ${stderr}`);
              process.exit(1);
            }
            console.log(stdout);

            const wasmFilePath = path.join(fileDirectory, "output.wasm");
            if (fs.existsSync(wasmFilePath)) {
              console.log(
                `Conversion successful! The output.wasm file is located at ${wasmFilePath}`
              );
            } else {
              console.error("Failed to generate the output.wasm file.");
            }
          }
        );
      } else {
        exec(
          `docker run --rm -v ${fileDirectory}:/app ${dockerImage}`,
          (err, stdout, stderr) => {
            if (err) {
              console.error(`Error running Docker container: ${stderr}`);
              process.exit(1);
            }
            console.log(stdout);

            const wasmFilePath = path.join(fileDirectory, "output.wasm");
            if (fs.existsSync(wasmFilePath)) {
              console.log(
                `Conversion successful! The output.wasm file is located at ${wasmFilePath}`
              );
            } else {
              console.error("Failed to generate the output.wasm file.");
            }
          }
        );
      }
    }
  );
}

module.exports = { generateDockerfile };
