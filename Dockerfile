
  # Use the latest Ubuntu image as the base
  FROM ubuntu:latest
  
  # Install Java and necessary tools
  RUN apt-get update && \
      apt-get install -y openjdk-11-jdk maven wget && \
      wget https://repo1.maven.org/maven2/de/inetsoftware/jwebassembly-compiler/0.4/jwebassembly-compiler-0.4.jar -O /usr/local/jwebassembly-compiler-0.4.jar && \
      wget https://repo1.maven.org/maven2/de/inetsoftware/jwebassembly-api/0.4/jwebassembly-api-0.4.jar -O /usr/local/jwebassembly-api-0.4.jar
  
  # Set the working directory
  WORKDIR /app
  
  # Copy the application code
  COPY . .
  
  # Set the command to compile Java with Maven and convert to WebAssembly
  ENTRYPOINT ["/bin/bash", "-c"]
  CMD ["cd /app && mvn clean package && java -cp /usr/local/jwebassembly-compiler-0.4.jar:/app/target/simple-maven-project-1.0-SNAPSHOT.jar de.inetsoftware.jwebassembly.JWebAssembly target/classes/${FILE} -o /app/output.wasm || tail -f /dev/null"]
  