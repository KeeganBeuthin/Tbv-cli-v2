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

let simulatedRdfStore = {
  "1234567": { balance: 1000 }
};

let books = [
  {"title": "The Catcher in the Rye", "authorName": "J.D. Salinger"},
  {"title": "To Kill a Mockingbird", "authorName": "Harper Lee"},
  {"title": "1984", "authorName": "George Orwell"}
];



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


app.get("/books", (req, res) => {
  res.json(books);
});

app.post("/books", (req, res) => {
  const { title, authorName } = req.body;
  if (title && authorName) {
    const newBook = { title, authorName };
    books.push(newBook);
    res.status(201).json({ message: "Book added", book: newBook, currentBooks: books });
  } else {
    res.status(400).json({ error: "Title and authorName are required" });
  }
});

app.delete("/books/:title", (req, res) => {
  const { title } = req.params;
  const index = books.findIndex(book => book.title === title);
  if (index > -1) {
    const deletedBook = books.splice(index, 1)[0];
    res.json({ message: "Book deleted", book: deletedBook, currentBooks: books });
  } else {
    res.status(404).json({ error: "Book not found" });
  }
});

app.get("/books/:title", (req, res) => {
  const { title } = req.params;
  const book = books.find(book => book.title === title);
  if (book) {
    res.json({ book, currentBooks: books });
  } else {
    res.status(404).json({ error: "Book not found" });
  }
});

// Modify the existing /rdf endpoint to return books data
app.get("/rdf", (req, res) => {
  res.json({ data: JSON.stringify(books) });
});

app.post("/rdf/query", (req, res) => {
  const { query } = req.body;
  console.log("Received RDF query:", query);
  
  // This is a very simplified RDF query parser
  const match = query.match(/ex:(\w+)\s+ex:hasBalance\s+\?balance/);
  if (match) {
    const account = match[1];
    const balance = simulatedRdfStore[account] ? simulatedRdfStore[account].balance : null;
    res.json({ results: [{ balance: balance }] });
  } else {
    res.status(400).json({ error: "Invalid query" });
  }
});

const server = app.listen(3000, '127.0.0.1', () => {
  console.log("Mock API server is running on http://127.0.0.1:3000");
});

module.exports = server;
