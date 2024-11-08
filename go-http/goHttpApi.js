const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const { initWasmForHttp } = require("./goHttpWasm");

const app = express();
let wasmHandler = null;

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname)));

async function initializeWasm(wasmPath) {
  if (!wasmHandler) {
    const result = await initWasmForHttp(wasmPath);
    if (result.success) {
      wasmHandler = result.handleHttpRequest;
      console.log("WebAssembly module initialized successfully for HTTP API");
    } else {
      console.error("Failed to initialize WebAssembly module:", result.error);
      throw new Error(result.error);
    }
  }
}

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../index.html"));
});

app.all("/api/*", async (req, res) => {
  console.log(`Received ${req.method} request to ${req.path}`);
  
  if (!wasmHandler) {
    res.status(500).json({ error: "WebAssembly module not initialized" });
    return;
  }

  const requestData = {
    method: req.method,
    path: req.path,
    headers: req.headers,
    body: req.body
  };

  try {
    const response = wasmHandler(requestData);
    
    const responseBody = typeof response.body === 'object' ? 
                        JSON.stringify(response.body) : 
                        response.body;
    
    res.status(response.statusCode)
       .set(response.headers)
       .send(responseBody);
  } catch (error) {
    console.error("Error handling request:", error);
    res.status(500).json({ 
      error: "Internal Server Error", 
      details: error.message 
    });
  }
});

app.get("/health", (req, res) => {
  res.status(200).send("OK");
});

function startGoServer(wasmPath, port = 3000) {
  return new Promise(async (resolve, reject) => {
    let server = null;
    try {
      await initializeWasm(wasmPath);
      server = app.listen(port, "127.0.0.1", () => {
        console.log(`Go API server is running on http://127.0.0.1:${port}`);
        
        // Add SIGINT handler
        process.on('SIGINT', async () => {
          console.log('\nReceived SIGINT. Shutting down Go server...');
          if (server) {
            server.close(() => {
              console.log('Go server closed successfully');
              process.exit(0);
            });
            
            // Force close after 3 seconds if graceful shutdown fails
            setTimeout(() => {
              console.log('Force closing Go server...');
              process.exit(1);
            }, 2000);
          }
        });

        resolve(server);
      });

      server.on("error", (error) => {
        console.error("Error in Go API server:", error);
        reject(error);
      });

      server.on("close", () => {
        console.log("Go API server is shutting down");
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

module.exports = { startGoServer };