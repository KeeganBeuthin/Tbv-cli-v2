
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
RUN npx asc -o output.wasm --runtime minimal --importMemory 


# Copy the generated .wasm file to the mounted volume
CMD cp output.wasm /output/|| (echo "Failed to copy .wasm file" && exit 1)
  