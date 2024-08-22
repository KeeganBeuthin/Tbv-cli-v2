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

function generateAssemblyScriptDockerfile(projectPath) {
  return `
FROM node:latest

RUN npm install -g assemblyscript

WORKDIR /app

# Copy package.json and package-lock.json (if it exists)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application
COPY . .

# Compile the project
RUN npx asc -o output.wasm --runtime minimal --importMemory --maximumMemory 512


# Copy the generated .wasm file to the mounted volume
CMD cp output.wasm /output/|| (echo "Failed to copy .wasm file" && exit 1)
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
RUN wasm-pack build --target nodejs || (echo "Failed to build Rust project" && exit 1)


# Copy the generated .wasm file to the mounted volume
CMD cp ./pkg/*_bg.wasm /output/output.wasm || (echo "Failed to copy .wasm file" && exit 1)
  `;
}

function generateGoDockerfile(projectPath) {
  return `
FROM golang:latest

WORKDIR /app

# Copy the entire Go project
COPY . .

# Set environment variables for WebAssembly compilation
ENV GOOS=js
ENV GOARCH=wasm

# Initialize Go module if go.mod doesn't exist
RUN if [ ! -f go.mod ]; then go mod init myproject; fi

# Download dependencies
RUN go mod tidy

# Compile the project
RUN go build -o main.wasm .

# Copy the WebAssembly support file
RUN cp "$(go env GOROOT)/misc/wasm/wasm_exec.js" .

# Copy the generated .wasm file to the mounted volume
CMD cp main.wasm /output/output.wasm && cp wasm_exec.js /output/wasm_exec.js
  `;
}

function generateDockerfile(language, inputPath) {
  let dockerfileContent;
  const fileDirectory = inputPath;
  const fileName = path.basename(inputPath);

  switch (language) {
    case "python":
      dockerfileContent = generatePythonDockerfile(fileName);
      break;
    case "java":
      // dockerfileContent = generateJavaDockerfile(inputPath);
      break;
    case "go":
      dockerfileContent = generateGoDockerfile(fileDirectory);
      break;
    case "assemblyscript":
      dockerfileContent = generateAssemblyScriptDockerfile(fileDirectory);
      break;
    case "rust":
      dockerfileContent = generateRustDockerfile(fileDirectory);
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
  const buildContext = fileDirectory;

  exec(
    `docker build -f ${dockerfilePath} -t ${dockerImage} ${buildContext}`,
    (err, stdout, stderr) => {
      if (err) {
        console.error(`Error building Docker image: ${stderr}`);
        process.exit(1);
      }
      console.log(stdout);

      if (language === "rust" || language === "go" || language === "assemblyscript") {
        exec(
          `docker run --rm -v ${fileDirectory}:/output ${dockerImage}`,
          (err, stdout, stderr) => {
            if (err) {
              console.error(`Error running Docker container: ${stderr}`);
              process.exit(1);
            }
            console.log(stdout);

            const wasmFilePath = path.join(fileDirectory, "output.wasm");
            const wasmExecJsPath = language === "go" ? path.join(fileDirectory, "wasm_exec.js") : null;

            if (fs.existsSync(wasmFilePath)) {
              console.log(
                `Conversion successful! The output.wasm file is located at ${wasmFilePath}`
              );
              if (language === "go" && fs.existsSync(wasmExecJsPath)) {
                console.log(
                  `The wasm_exec.js file is located at ${wasmExecJsPath}`
                );
              }
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
