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
  // Dockerfile specifically set up for Rust projects
  return `
FROM rust:latest

# Install wasm-pack for Rust -> WebAssembly compilation
RUN curl https://rustwasm.github.io/wasm-pack/installer/init.sh -sSf | sh

# Set working directory to /app
WORKDIR /app

# Copy the entire Rust project directory into the Docker container
COPY . /app

# Build the project with wasm-pack, targeting the 'web' environment
CMD wasm-pack build --target web && cp ./pkg/*_bg.wasm /app/output.wasm || bash
  `;
}

function generateGoDockerfile(filePath) {
  const fileName = path.basename(filePath);

  return `
FROM ubuntu:latest

RUN apt-get update && \\
    apt-get install -y wget tar && \\
    wget https://dl.google.com/go/go1.22.4.linux-amd64.tar.gz -O go.tar.gz && \\
    tar -xzf go.tar.gz -C /usr/local && \\
    rm go.tar.gz

ENV GOROOT=/usr/local/go
ENV GOPATH=/root/go
ENV PATH=\$PATH:\$GOROOT/bin:\$GOPATH/bin

WORKDIR /app

COPY ${fileName} /app/${fileName}

ENTRYPOINT ["/bin/bash", "-c"]
CMD ["GOOS=js GOARCH=wasm go build -o /app/output.wasm ${fileName} && cp /usr/local/go/misc/wasm/wasm_exec.js /app/ || tail -f /dev/null"]
  `;
}

// function generateJavaDockerfile() {
//     return `
//   # Use the latest Ubuntu image as the base
//   FROM ubuntu:latest

//   # Install Java and necessary tools
//   RUN apt-get update && \\
//       apt-get install -y openjdk-11-jdk maven wget && \\
//       wget https://repo1.maven.org/maven2/de/inetsoftware/jwebassembly-compiler/0.4/jwebassembly-compiler-0.4.jar -O /usr/local/jwebassembly-compiler-0.4.jar && \\
//       wget https://repo1.maven.org/maven2/de/inetsoftware/jwebassembly-api/0.4/jwebassembly-api-0.4.jar -O /usr/local/jwebassembly-api-0.4.jar

//   # Set the working directory
//   WORKDIR /app

//   # Copy the application code
//   COPY . .

//   # Set the command to compile Java with Maven and convert to WebAssembly
//   ENTRYPOINT ["/bin/bash", "-c"]
//   CMD ["cd /app && mvn clean package && java -cp /usr/local/jwebassembly-compiler-0.4.jar:/app/target/simple-maven-project-1.0-SNAPSHOT.jar de.inetsoftware.jwebassembly.JWebAssembly target/classes/\${FILE} -o /app/output.wasm || tail -f /dev/null"]
//   `;
//   }

function generateDockerfile(language, inputPath) {
  let dockerfileContent;
  const fileDirectory = path.dirname(inputPath); // Directory containing the file
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
      dockerfileContent = generateRustDockerfile(inputPath);  // Handle entire directory for Rust
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

  exec(
    `docker build -f ${dockerfilePath} -t ${dockerImage} ${fileDirectory}`,
    (err, stdout, stderr) => {
      if (err) {
        console.error(`Error building Docker image: ${stderr}`);
        process.exit(1);
      }
      console.log(stdout);

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
  );
}

module.exports = { generateDockerfile };
