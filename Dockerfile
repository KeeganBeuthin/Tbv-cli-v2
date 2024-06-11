
FROM ubuntu:latest

RUN apt-get update && \
    apt-get install -y wget tar && \
    wget https://dl.google.com/go/go1.22.4.linux-amd64.tar.gz -O go.tar.gz && \
    tar -xzf go.tar.gz -C /usr/local && \
    rm go.tar.gz

ENV GOROOT=/usr/local/go
ENV GOPATH=/root/go
ENV PATH=$PATH:$GOROOT/bin:$GOPATH/bin

WORKDIR /app

COPY main.go /app/main.go

ENTRYPOINT ["/bin/bash", "-c"]
CMD ["GOOS=js GOARCH=wasm go build -o /app/output.wasm main.go"]
  