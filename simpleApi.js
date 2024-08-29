const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs").promises;
const path = require("path");

const app = express();

app.use(bodyParser.json());

app.use(express.static(path.join(__dirname))); 

let simulatedRdfStore = {
  "1234567": { balance: 1000 }
};

let wasmInstance = null;

// Function to load and instantiate the WebAssembly module
async function loadWasmModule() {
  const wasmBuffer = await fs.readFile(path.join(__dirname, 'main.wasm'));
  const go = new Go();
  const result = await WebAssembly.instantiate(wasmBuffer, go.importObject);
  wasmInstance = result.instance;
  go.run(wasmInstance);
  console.log("WebAssembly module loaded successfully");
}

// Load the WebAssembly module when the server starts
loadWasmModule().catch(console.error);

app.get("/rdf", (req, res) => {
  res.json({ data: JSON.stringify(simulatedRdfStore) });
});

app.post("/rdf/query", (req, res) => {
  const { query } = req.body;
  console.log("Received RDF query:", query);

  const match = query.match(/ex:(\w+)\s+ex:hasBalance\s+\?balance/);
  if (match) {
    const account = match[1];
    const balance = simulatedRdfStore[account] ? simulatedRdfStore[account].balance : 1000;
    res.json({ results: [{ balance: balance.toString() }] });
  } else {
    res.status(400).json({ error: "Invalid query" });
  }
});

// New endpoint to handle HTML file reading
app.get("/readHtml", async (req, res) => {
  console.log("Received request to /readHtml");
  if (typeof global.readHtmlFile !== "function") {
    console.error("readHtmlFile function not available in global scope");
    return res.status(500).json({ error: "readHtmlFile function not available" });
  }

  try {
    const htmlFilePath = path.join(__dirname, 'hello-world.html');
    console.log("Attempting to read HTML file:", htmlFilePath);
    const fileContent = await fs.readFile(htmlFilePath, 'utf8');
    const htmlContent = global.readHtmlFile(fileContent);
    console.log("HTML content read successfully");
    res.json({ htmlContent });
  } catch (error) {
    console.error("Error reading HTML file:", error);
    res.status(500).json({ error: "Failed to read HTML file: " + error.message });
  }
});

app.get("/health", (req, res) => {
  res.status(200).send("OK");
});

const server = app.listen(3000, '127.0.0.1', () => {
  console.log("Mock API server is running on http://127.0.0.1:3000");
});

server.on('error', (error) => {
  console.error("Error in mock API server:", error);
});

server.on('close', () => {
  console.log("Mock API server is shutting down");
});

function closeServer() {
  console.log("closeServer function called");
  server.close(() => {
    console.log("Server closed through closeServer function");
  });
}

module.exports = { server, closeServer };