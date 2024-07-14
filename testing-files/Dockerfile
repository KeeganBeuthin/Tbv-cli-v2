
FROM tinygo/tinygo:latest

WORKDIR /app

COPY main.go /app/main.go

ENTRYPOINT ["/bin/bash", "-c"]
CMD ["tinygo build -o /app/output.wasm -target=wasm main.go || tail -f /dev/null"]
  