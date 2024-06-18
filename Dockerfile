
FROM rust:latest

# Install wasm-pack for Rust -> WebAssembly compilation
RUN curl https://rustwasm.github.io/wasm-pack/installer/init.sh -sSf | sh

# Set working directory to /app
WORKDIR /app

# Copy the entire Rust project directory into the Docker container
COPY . /app

# Build the project with wasm-pack, targeting the 'web' environment
CMD wasm-pack build --target web && cp ./pkg/*_bg.wasm /app/output.wasm || bash
  