// simpleApi.js
const express = require("express");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json());

let itemList = ["apple", "banana", "cherry"];

let rdfStore = `
@prefix ex: <http://example.org/> .
ex:subject ex:predicate ex:object .
`;

app.get("/list", (req, res) => {
  res.json(itemList);
});

app.post("/list", (req, res) => {
  const { item } = req.body;
  console.log("Received item:", item);
  console.log("Item length:", item.length);
  console.log("Item bytes:", Buffer.from(item).toString("hex"));
  if (item) {
    itemList.push(item);
    console.log("Updated list:", itemList);
    res
      .status(201)
      .json({ message: "Item added", item, currentList: itemList });
  } else {
    res.status(400).json({ error: "Item is required" });
  }
});

app.delete("/list/:item", (req, res) => {
  const { item } = req.params;
  const index = itemList.indexOf(item);
  if (index > -1) {
    itemList.splice(index, 1);
    res.json({ message: "Item deleted", item, currentList: itemList });
  } else {
    res.status(404).json({ error: "Item not found" });
  }
});

app.get("/list/:index", (req, res) => {
  const index = parseInt(req.params.index);
  if (index >= 0 && index < itemList.length) {
    res.json({ item: itemList[index], currentList: itemList });
  } else {
    res.status(404).json({ error: "Index out of bounds" });
  }
});

const server = app.listen(3000, () => {
  console.log("Mock API server is running on port 3000");
});

app.get("/rdf", (req, res) => {
  res.json({ data: rdfStore });
});

app.post("/rdf", (req, res) => {
  const { data } = req.body;
  if (data) {
    rdfStore += data;
    res.status(201).json({ message: "RDF data added", currentStore: rdfStore });
  } else {
    res.status(400).json({ error: "RDF data is required" });
  }
});

app.get("/rdf/query", (req, res) => {
  const { query } = req.query;
  if (query) {
    // This is a mock query - in a real scenario, you'd use an RDF library to process the query
    const mockResult = `Query result for: ${query}`;
    res.json({ result: mockResult });
  } else {
    res.status(400).json({ error: "Query parameter is required" });
  }
});

module.exports = server;
