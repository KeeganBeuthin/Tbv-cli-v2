// main.ts

// @ts-ignore
@external("env", "abort")
declare function abort(message: string | null, fileName: string | null, lineNumber: u32, columnNumber: u32): void;

// @ts-ignore
@external("env", "logMessage")
declare function logMessage(ptr: usize, len: i32): void;

// @ts-ignore
@external("env", "query_rdf_tbv_cli")
declare function query_rdf_tbv_cli(queryPtr: usize, queryLen: i32): usize;

// @ts-ignore
@external("env", "get_result_row")
declare function get_result_row(resultPtr: usize): usize;

// @ts-ignore
@external("env", "free_result")
declare function free_result(resultPtr: usize): void;

// @ts-ignore
@external("env", "set_query_result")
declare function set_query_result(resultPtr: usize): void;

function parseFloat(str: string): f64 {
  return F64.parseFloat(str);
}

function isNaN(value: f64): bool {
  return value != value;
}

function consoleLog(message: string): void {
  const encoded = String.UTF8.encode(message);
  logMessage(changetype<usize>(encoded), encoded.byteLength);
}

export function allocateString(len: i32): usize {
  consoleLog(`Attempting to allocate string of length ${len}`);
  const ptr = __new(len, idof<ArrayBuffer>()) + 4; 
  consoleLog(`Allocated buffer for string at ${ptr} with length ${len}`);
  return ptr;
}

export function writeString(ptr: usize, str: string): void {
  const buffer = String.UTF8.encode(str);
  memory.copy(ptr, changetype<usize>(buffer), buffer.byteLength);
}

export function getStringLen(ptr: usize): i32 {
  consoleLog(`Getting string length at address ${ptr}`);
  let len = 0;
  while (load<u8>(ptr + len) !== 0) {
    len++;
  }
  consoleLog(`String at ${ptr} has length ${len}`);
  return len;
}

export function readString(ptr: usize): string {
  const len = getStringLen(ptr);
  const buffer = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    buffer[i] = load<u8>(ptr + i);
  }
  return String.UTF8.decode(buffer.buffer);
}

let globalAmount: f64 = 0;

export function execute_credit_leg(amountPtr: usize, accountPtr: usize): usize {
  const amount = readString(amountPtr);
  const account = readString(accountPtr);
  
  consoleLog(`Executing credit leg for amount: ${amount}, account: ${account}`);

  globalAmount = parseFloat(amount)
  
  // Construct RDF query
  const query = `
    PREFIX ex: <http://example.org/>
    SELECT ?balance
    WHERE {
      ex:${account} ex:hasBalance ?balance .
    }
  `;

  // Allocate memory for the query string and write it
  const queryPtr = allocateString(query.length);
  writeString(queryPtr, query);

  // Return the pointer to the query string
  return queryPtr;
}


export function process_credit_result(resultPtr: usize): usize {
  const result = readString(resultPtr);
  consoleLog(`Processing credit result: ${result}`);

  // Parse the balance from the result string
  const balanceStart = result.indexOf('"balance":') + 10;
  const balanceEnd = result.indexOf('}', balanceStart);
  if (balanceStart === 9 || balanceEnd === -1) {
    const errorMessage = "Invalid result format or no balance found";
    consoleLog(errorMessage);
    
    // Allocate memory for the error message and write it
    const errorPtr = allocateString(errorMessage.length);
    writeString(errorPtr, errorMessage);
    
    return errorPtr;
  }

  const balanceStr = result.substring(balanceStart, balanceEnd);
  const balance = parseFloat(balanceStr);

  if (isNaN(balance)) {
    const errorMessage = `Invalid balance value: ${balanceStr}`;
    consoleLog(errorMessage);
    
    // Allocate memory for the error message and write it
    const errorPtr = allocateString(errorMessage.length);
    writeString(errorPtr, errorMessage);
    
    return errorPtr;
  }

  const newBalance = balance + globalAmount;  // Assuming globalAmount is set in execute_credit_leg
  
  const responseMessage = `Current balance: ${balance}. After credit of ${globalAmount}, new balance: ${newBalance}`;
  consoleLog(responseMessage);
  
  // Allocate memory for the response and write it
  const responsePtr = allocateString(responseMessage.length);
  writeString(responsePtr, responseMessage);
  
  return responsePtr;
}

function createErrorResult(message: string): usize {
  const errorMessage = `Error: ${message}`;
  const ptr = allocateString(errorMessage.length);
  writeString(ptr, errorMessage);
  return ptr;
}

function createSuccessResult(message: string): usize {
  const ptr = allocateString(message.length);
  writeString(ptr, message);
  return ptr;
}

export function execute_debit_leg(amountPtr: usize, accountPtr: usize): usize {
  const amount = readString(amountPtr);
  const account = readString(accountPtr);
  
  const message = `Debiting ${amount} from account ${account}`;
  consoleLog(`Created message: "${message}"`);
  
  const ptr = allocateString(message.length);
  writeString(ptr, message);
  
  return ptr;
}

function parseBalance(jsonStr: string): f64 {
  const balanceStart = jsonStr.indexOf('"balance":') + 10;
  const balanceEnd = jsonStr.indexOf('}', balanceStart);
  if (balanceStart === 9 || balanceEnd === -1) {
    consoleLog("Error parsing balance: invalid JSON format");
    return NaN;
  }
  const balanceStr = jsonStr.substring(balanceStart, balanceEnd);
  return parseFloat(balanceStr);
}


export function AssemblyScript(): void {}
