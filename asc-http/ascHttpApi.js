const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const { initWasmForHttp } = require('./ascHttpWasm');

const app = express();
let wasmHandler = null;

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname)));

async function initializeWasm(wasmPath) {
  if (!wasmHandler) {
    const result = await initWasmForHttp(wasmPath);
    if (result.success) {
      wasmHandler = result.handleHttpRequest;
      console.log("AssemblyScript WebAssembly module initialized successfully for HTTP API");
    } else {
      console.error("Failed to initialize AssemblyScript WebAssembly module:", result.error);
      throw new Error(result.error);
    }
  }
}

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../index.html"));
});

app.all("/api/*", async (req, res) => {
  console.log(`Express: Received ${req.method} request to ${req.path}`);
  
  if (!wasmHandler) {
    res.status(500).json({ error: "WebAssembly module not initialized" });
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
    res.status(response.statusCode).set(response.headers).send(response.body);
  } catch (error) {
    console.error("Express: Error handling request:", error);
    res.status(500).json({ error: "Internal Server Error", details: error.message });
  }
});

app.get("/health", (req, res) => {
  res.status(200).send("OK");
});

function startAssemblyScriptServer(wasmPath, port = 3000) {
  return new Promise(async (resolve, reject) => {
    let server = null;
    try {
      await initializeWasm(wasmPath);
      server = app.listen(port, () => {
        console.log(`AssemblyScript API server is running on http://localhost:${port}`);
        
        // Add SIGINT handler
        process.on('SIGINT', async () => {
          console.log('\nReceived SIGINT. Shutting down AssemblyScript server...');
          if (server) {
            server.close(() => {
              console.log('AssemblyScript server closed successfully');
              process.exit(0);
            });
            
            // Force close after 3 seconds if graceful shutdown fails
            setTimeout(() => {
              console.log('Force closing AssemblyScript server...');
              process.exit(1);
            }, 2000);
          }
        });

        resolve(server);
      });

      server.on("error", (error) => {
        console.error("Error in AssemblyScript API server:", error);
        reject(error);
      });

      server.on("close", () => {
        console.log("AssemblyScript API server is shutting down");
        // Clean up any remaining WASM resources
        if (wasmHandler) {
          wasmHandler = null;
        }
      });
    } catch (error) {
      if (server) {
        server.close();
      }
      reject(error);
    }
  });
}

module.exports = { startAssemblyScriptServer };