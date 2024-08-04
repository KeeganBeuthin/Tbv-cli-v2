const axios = require('axios');
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

async function executeRdfQuery(query, maxRetries = 2, retryDelay = 1000) {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const response = await axios.post('http://127.0.0.1:3000/rdf/query', { query });
      return response.data;
    } catch (error) {
      console.error(`Attempt ${attempt} failed: ${error.message}`);
      if (attempt === maxRetries) throw error;
      await delay(retryDelay);
    }
  }
}

module.exports = { executeRdfQuery };