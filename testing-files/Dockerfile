
FROM node:latest

# Install AssemblyScript compiler
RUN npm install -g assemblyscript

# Set working directory
WORKDIR /app

# Copy the TypeScript file into the Docker container
COPY main.ts /app/main.ts

# Change CMD to run AssemblyScript compiler manually and keep the container running
CMD npx asc main.ts -o output.wasm --runtime minimal && ls -l /app || bash
  