const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const { initWasmForHttp } = require("./rustHttpWasm");

const app = express();
let wasmHandler = null;

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname)));

async function initializeWasm(wasmPath) {
  if (!wasmHandler) {
    const result = await initWasmForHttp(wasmPath);
    if (result.success) {
      wasmHandler = result.handleHttpRequest;
      console.log("Rust WebAssembly module initialized successfully for HTTP API");
    } else {
      console.error("Failed to initialize Rust WebAssembly module:", result.error);
      throw new Error(result.error);
    }
  }
}

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.all("/api/*", async (req, res) => {
    console.log(`Express: Received ${req.method} request to ${req.path}`);
    
    if (!wasmHandler) {
      console.error("Express: Rust WebAssembly module not initialized");
      res.status(500).json({ error: "Rust WebAssembly module not initialized" });
      return;
    }
  
    const requestData = {
      method: req.method,
      path: req.path,
      headers: req.headers,
      body: req.body,
    };
  
    try {
      console.log("Express: Calling wasmHandler");
      const response = wasmHandler(requestData);
      console.log("Express: Response from wasmHandler:", response);
      
      if (!response || typeof response !== 'object') {
        console.error("Express: Invalid response from Wasm module", response);
        throw new Error("Invalid response from Wasm module");
      }
      
      console.log("Express: Sending response to client");
      res.status(response.statusCode || 200).set(response.headers || {}).send(response.body || "");
    } catch (error) {
      console.error("Express: Error handling request:", error);
      console.error("Express: Error stack:", error.stack);
      res.status(500).json({ error: "Internal Server Error", details: error.message });
    }
  });

app.get("/health", (req, res) => {
  res.status(200).send("OK");
});

function startRustServer(wasmPath, port = 3000) {
  return new Promise(async (resolve, reject) => {
    try {
      await initializeWasm(wasmPath);
      const server = app.listen(port, "127.0.0.1", () => {
        console.log(`Rust API server is running on http://127.0.0.1:${port}`);
        resolve(server);
      });

      server.on("error", (error) => {
        console.error("Error in Rust API server:", error);
        reject(error);
      });

      server.on("close", () => {
        console.log("Rust API server is shutting down");
      });
    } catch (error) {
      reject(error);
    }
  });
}

module.exports = { startRustServer };