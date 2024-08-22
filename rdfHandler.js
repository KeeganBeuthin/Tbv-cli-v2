const axios = require('axios');
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

async function isServerRunning() {
  try {
    await axios.get('http://127.0.0.1:3000/health');
    return true;
  } catch (error) {
    return false;
  }
}

async function executeRdfQuery(query, maxRetries = 2, retryDelay = 1000) {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`Attempt ${attempt}: Sending RDF query to http://127.0.0.1:3000/rdf/query`);
      const response = await axios.post('http://127.0.0.1:3000/rdf/query', { query });
      console.log(`Attempt ${attempt}: Received response:`, response.data);
      return response.data;
    } catch (error) {
      console.error(`Attempt ${attempt} failed:`, error.message);
      if (error.response) {
        console.error("Response data:", error.response.data);
        console.error("Response status:", error.response.status);
        console.error("Response headers:", error.response.headers);
      }
      if (error.code === 'ECONNREFUSED') {
        console.log("Checking if API server is running...");
        try {
          await axios.get('http://127.0.0.1:3000/health');
          console.log("API server is running.");
        } catch (healthCheckError) {
          console.error("API server health check failed:", healthCheckError.message);
        }
      }
      if (attempt === maxRetries) throw error;
      console.log(`Waiting ${retryDelay}ms before next attempt...`);
      await delay(retryDelay);
    }
  }
}

module.exports = { executeRdfQuery };