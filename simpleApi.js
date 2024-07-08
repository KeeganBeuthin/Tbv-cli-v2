const express = require('express');
const app = express();
const port = 3000;

app.get('/test', (req, res) => {
  const testData = [
    { amount: "100", account: "1234567" },
    { amount: "200", account: "2345678" },
    { amount: "300", account: "3456789" }
  ];
  res.json(testData);
});

function startServer() {
  return new Promise((resolve) => {
    const server = app.listen(port, () => {
      console.log(`Simple API server listening at http://localhost:${port}`);
      resolve(server);
    });
  });
}

module.exports = { startServer };