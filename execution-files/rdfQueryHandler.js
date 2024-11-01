const { exec } = require("child_process");
const util = require("util");
const execPromise = util.promisify(exec);

/**
 * Configuration object for RDF query execution
 * @type {Object}
 */
const RDF_CONFIG = {
  CLI_COMMAND: 'tbv-cli',
  QUERY_SUBCOMMAND: 'rdf-query',
  TIMEOUT: 30000, // 30 seconds
  MAX_RETRIES: 3,
  RETRY_DELAY: 1000, // 1 second
};

/**
 * Error class for RDF query execution failures
 */
class RDFQueryError extends Error {
  constructor(message, query, stderr = null, stdout = null) {
    super(message);
    this.name = 'RDFQueryError';
    this.query = query;
    this.stderr = stderr;
    this.stdout = stdout;
    this.timestamp = new Date();
  }
}

/**
 * Executes an RDF query via CLI
 * @param {string} query - The RDF query to execute
 * @param {Object} options - Optional configuration overrides
 * @returns {Promise<Object>} Query result
 * @throws {RDFQueryError} If query execution fails
 */
async function executeRdfQuery(query, options = {}) {
  const config = { ...RDF_CONFIG, ...options };
  let lastError = null;

  for (let attempt = 1; attempt <= config.MAX_RETRIES; attempt++) {
    try {
      console.log(`Executing RDF query (attempt ${attempt}/${config.MAX_RETRIES}):`, query);
      
      const { stdout, stderr } = await execPromise(
        `${config.CLI_COMMAND} ${config.QUERY_SUBCOMMAND} "${query}"`,
        { timeout: config.TIMEOUT }
      );

      if (stderr) {
        console.warn("CLI Warning:", stderr);
      }

      console.log("CLI Output:", stdout);
      
      const result = parseQueryResult(stdout);
      return result;

    } catch (error) {
      lastError = error;
      console.error(`Error executing RDF query (attempt ${attempt}):`, error);

      if (attempt < config.MAX_RETRIES) {
        console.log(`Retrying in ${config.RETRY_DELAY}ms...`);
        await delay(config.RETRY_DELAY);
      }
    }
  }

  throw new RDFQueryError(
    `Failed to execute RDF query after ${config.MAX_RETRIES} attempts`,
    query,
    lastError?.stderr,
    lastError?.stdout
  );
}

/**
 * Parses the query result from CLI output
 * @param {string} stdout - CLI output
 * @returns {Object} Parsed query result
 * @throws {RDFQueryError} If parsing fails
 */
function parseQueryResult(stdout) {
  try {
    const resultStart = stdout.indexOf("RDF Query Result:");
    if (resultStart === -1) {
      throw new Error("Failed to find RDF Query Result in CLI output");
    }

    const resultJson = stdout
      .slice(resultStart + "RDF Query Result:".length)
      .trim();

    return JSON.parse(resultJson);
  } catch (error) {
    throw new RDFQueryError(
      "Failed to parse RDF query result",
      null,
      null,
      stdout
    );
  }
}

/**
 * Validates an RDF query before execution
 * @param {string} query - The query to validate
 * @throws {RDFQueryError} If query is invalid
 */
function validateQuery(query) {
  if (!query || typeof query !== 'string') {
    throw new RDFQueryError('Invalid query: Query must be a non-empty string', query);
  }

  if (query.length > 10000) {
    throw new RDFQueryError('Invalid query: Query exceeds maximum length', query);
  }

  // Add additional validation as needed
}

/**
 * Executes multiple RDF queries in sequence
 * @param {string[]} queries - Array of queries to execute
 * @returns {Promise<Object[]>} Array of query results
 */
async function executeRdfQueries(queries) {
  const results = [];
  for (const query of queries) {
    try {
      const result = await executeRdfQuery(query);
      results.push({ success: true, query, result });
    } catch (error) {
      results.push({ success: false, query, error: error.message });
    }
  }
  return results;
}

/**
 * Executes an RDF query with a timeout
 * @param {string} query - The query to execute
 * @param {number} timeout - Timeout in milliseconds
 * @returns {Promise<Object>} Query result
 */
async function executeRdfQueryWithTimeout(query, timeout = RDF_CONFIG.TIMEOUT) {
  try {
    const result = await Promise.race([
      executeRdfQuery(query),
      new Promise((_, reject) => 
        setTimeout(() => reject(new RDFQueryError('Query execution timed out', query)), timeout)
      )
    ]);
    return result;
  } catch (error) {
    if (error.name === 'RDFQueryError') {
      throw error;
    }
    throw new RDFQueryError('Query execution failed', query, null, error.message);
  }
}

/**
 * Creates a delay promise
 * @param {number} ms - Milliseconds to delay
 * @returns {Promise<void>}
 */
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Event emitter for RDF query events
 */
const EventEmitter = require('events');
class RDFQueryEmitter extends EventEmitter {}
const queryEmitter = new RDFQueryEmitter();

// Add event listeners for logging and monitoring
queryEmitter.on('query:start', (query) => {
  console.log('Starting RDF query execution:', query);
});

queryEmitter.on('query:success', (result) => {
  console.log('RDF query completed successfully:', result);
});

queryEmitter.on('query:error', (error) => {
  console.error('RDF query failed:', error);
});

/**
 * Executes an RDF query with event emission
 * @param {string} query - The query to execute
 * @returns {Promise<Object>} Query result
 */
async function executeRdfQueryWithEvents(query) {
  queryEmitter.emit('query:start', query);
  try {
    const result = await executeRdfQuery(query);
    queryEmitter.emit('query:success', result);
    return result;
  } catch (error) {
    queryEmitter.emit('query:error', error);
    throw error;
  }
}

module.exports = {
  executeRdfQuery,
  executeRdfQueries,
  executeRdfQueryWithTimeout,
  executeRdfQueryWithEvents,
  validateQuery,
  RDFQueryError,
  queryEmitter,
  RDF_CONFIG
};