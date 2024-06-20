
FROM rust:latest

# Install wasm-pack for Rust -> WebAssembly compilation
RUN curl https://rustwasm.github.io/wasm-pack/installer/init.sh -sSf | sh

# Set working directory to /app
WORKDIR /app

# Copy the entire Rust project directory into the Docker container
COPY . /app

# Build the project with wasm-pack, targeting the 'web' environment
RUN wasm-pack build --target web -v || (echo "Failed to build Rust project" && exit 1)

# Check if the .wasm file exists
RUN if [ ! -f "./pkg/*_bg.wasm" ]; then echo "Generated .wasm file not found" && exit 1; fi

# Copy the generated .wasm file to the mounted volume
CMD cp ./pkg/*_bg.wasm /output/output.wasm || (echo "Failed to copy .wasm file" && exit 1)
  