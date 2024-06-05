
# Use the latest Ubuntu image as the base
FROM ubuntu:latest

# Install Java and necessary tools
RUN apt-get update && \
    apt-get install -y openjdk-11-jdk maven

# Set the working directory
WORKDIR /app

# Copy the application code
COPY . .

# Set the command to compile Java with Maven and convert to WebAssembly
ENTRYPOINT ["/bin/bash", "-c"]
CMD ["mvn clean package && echo 'Java to wasm conversion command here'"]
