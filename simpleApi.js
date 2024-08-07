// simpleApi.js
const express = require("express");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json());



let rdfStore = `
@prefix ex: <http://example.org/> .
ex:subject ex:predicate ex:object .
`;

let simulatedRdfStore = {
  "1234567": { balance: 1000 }
};


app.get("/rdf", (req, res) => {
  res.json({ data: JSON.stringify(books) });
});

app.post("/rdf/query", (req, res) => {
  const { query } = req.body;
  console.log("Received RDF query:", query);
  

  const match = query.match(/ex:(\w+)\s+ex:hasBalance\s+\?balance/);
  if (match) {
    const account = match[1];
    const balance = simulatedRdfStore[account] ? simulatedRdfStore[account].balance : null;
    res.json({ results: [{ balance: balance }] });
  } else {
    res.status(400).json({ error: "Invalid query" });
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
