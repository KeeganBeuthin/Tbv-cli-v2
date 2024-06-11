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

function generateDockerfile(language, filePath) {
  const fileName = path.basename(filePath);
  let dockerfileContent;

  if (language === "python") {
    dockerfileContent = generatePythonDockerfile(filePath);
  } else if (language === "java") {
    // dockerfileContent = generateJavaDockerfile(filePath);
  } else if (language === "go") {
    dockerfileContent = generateGoDockerfile(filePath);
  } else if (language === "assemblyscript") {
    dockerfileContent = generateAssemblyScriptDockerfile(filePath);
  } else {
    console.error(
      'Unsupported language. Please use "python" , "assemblyscript" , "java", or "go".'
    );
    process.exit(1);
  }

  const dockerfilePath = path.join(__dirname, "Dockerfile");
  fs.writeFileSync(dockerfilePath, dockerfileContent);

  const dockerImage = `${language.toLowerCase()}2wasm-image`;
  const fileDirectory = path.dirname(filePath);

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

          const wasmFilePath = path.join(__dirname, "output.wasm");
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
