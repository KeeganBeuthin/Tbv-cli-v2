
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
  