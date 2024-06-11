
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

# Install py2wasm
RUN pip install py2wasm

# Copy only the specified file
COPY conversion.py /app/conversion.py

# Set the command to run py2wasm on the Python file and save the output in /app/output.wasm
ENTRYPOINT ["/bin/bash", "-c"]
CMD ["py2wasm conversion.py -o /app/output.wasm || tail -f /dev/null"]
