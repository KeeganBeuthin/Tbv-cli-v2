# Use the latest Ubuntu image as the base
FROM ubuntu:latest

# Add deadsnakes PPA to sources list and update package lists
RUN apt-get update && \
    apt-get install -y software-properties-common && \
    add-apt-repository ppa:deadsnakes/ppa && \
    apt-get update

# Install Python 3.11, patchelf, and other required packages
RUN apt-get install -y python3.11 python3.11-venv patchelf binutils

# Set the working directory
WORKDIR /app

# Create a Python virtual environment
RUN python3.11 -m venv /opt/venv
ENV PATH="/opt/venv/bin:$PATH"

# Copy the application code (hello.py)
COPY hello.py .

# Install py2wasm
RUN pip install py2wasm

# Set the command to run py2wasm on hello.py and save the output in /app/output.wasm
CMD ["sh", "-c", "py2wasm hello.py -o /app/output.wasm"]
