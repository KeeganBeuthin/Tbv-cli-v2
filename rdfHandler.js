const axios = require('axios');

async function executeRdfQuery(query) {
  try {
    const response = await axios.post('http://localhost:3000/rdf/query', { query });
    return response.data;
  } catch (error) {
    console.error("Error executing RDF query:", error);
    throw error;
  }
}

module.exports = { executeRdfQuery };