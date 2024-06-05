const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');

function generatePythonDockerfile(fileName) {
  return `
# Use the latest Ubuntu image as the base
FROM ubuntu:latest

# Add deadsnakes PPA to sources list and update package lists
RUN apt-get update && \\
    apt-get install -y software-properties-common && \\
    add-apt-repository ppa:deadsnakes/ppa && \\
    apt-get update

# Install Python 3.11, patchelf, and other required packages
RUN apt-get install -y python3.11 python3.11-venv patchelf binutils

# Set the working directory
WORKDIR /app

# Create a Python virtual environment
RUN python3.11 -m venv /opt/venv
ENV PATH="/opt/venv/bin:$PATH"

# Install py2wasm
RUN pip install py2wasm

# Copy the application code
COPY . .

# Set the command to run py2wasm on the Python file and save the output in /app/output.wasm
ENTRYPOINT ["/bin/bash", "-c"]
CMD ["py2wasm ${fileName} -o /app/output.wasm"]
`;
}

function generateJavaDockerfile(fileName) {
  return `
# Use the latest Ubuntu image as the base
FROM ubuntu:latest

# Install Java and necessary tools
RUN apt-get update && \\
    apt-get install -y openjdk-11-jdk maven

# Set the working directory
WORKDIR /app

# Copy the application code
COPY . .

# Set the command to compile Java with Maven and convert to WebAssembly
ENTRYPOINT ["/bin/bash", "-c"]
CMD ["mvn clean package && echo 'Java to wasm conversion command here'"]
`;
}

function generateDockerfile(language, filePath) {
  const fileName = path.basename(filePath);
  let dockerfileContent;

  if (language === 'python') {
    dockerfileContent = generatePythonDockerfile(fileName);
  } else if (language === 'java') {
    dockerfileContent = generateJavaDockerfile(fileName);
  } else {
    console.error('Unsupported language. Please use "python" or "java".');
    process.exit(1);
  }

  const dockerfilePath = path.join(__dirname, 'Dockerfile');
  fs.writeFileSync(dockerfilePath, dockerfileContent);

  const dockerImage = `${language}2wasm-image`;
  exec(`docker build -f ${dockerfilePath} -t ${dockerImage} .`, (err, stdout, stderr) => {
    if (err) {
      console.error(`Error building Docker image: ${stderr}`);
      process.exit(1);
    }
    console.log(stdout);

    exec(`docker run --rm -v ${__dirname}:/app -e FILE=${fileName} -e LANGUAGE=${language} ${dockerImage}`, (err, stdout, stderr) => {
      if (err) {
        console.error(`Error running Docker container: ${stderr}`);
        process.exit(1);
      }
      console.log(stdout);

      const wasmFilePath = path.join(__dirname, 'output.wasm');
      if (fs.existsSync(wasmFilePath)) {
        console.log(`Conversion successful! The output.wasm file is located at ${wasmFilePath}`);
      } else {
        console.error('Failed to generate the output.wasm file.');
      }
    });
  });
}

module.exports = { generateDockerfile };
