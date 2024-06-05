# Use the latest Ubuntu image as the base
FROM ubuntu:latest

# Add deadsnakes PPA to sources list and update package lists
RUN apt-get update && \
    apt-get install -y software-properties-common && \
    add-apt-repository ppa:deadsnakes/ppa && \
    apt-get update

# Install Python 3.11, patchelf, and other required packages
RUN apt-get install -y python3.11 python3.11-venv patchelf binutils

# Install Java and necessary tools
RUN apt-get install -y openjdk-11-jdk maven

# Set the working directory
WORKDIR /app

# Create a Python virtual environment
RUN python3.11 -m venv /opt/venv
ENV PATH="/opt/venv/bin:$PATH"

# Install py2wasm
RUN pip install py2wasm

# Copy the application code (could be any .py or .java file)
COPY . .

# Set the command to run py2wasm on the Python file and save the output in /app/output.wasm
# Or compile and run Java to wasm conversion
ENTRYPOINT ["/bin/bash", "-c"]
CMD ["if [[ $LANGUAGE == 'python' ]]; then py2wasm $FILE -o /app/output.wasm; elif [[ $LANGUAGE == 'java' ]]; then javac $FILE && echo 'Java to wasm conversion command here'; fi"]