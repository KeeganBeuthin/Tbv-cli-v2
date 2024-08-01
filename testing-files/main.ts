// main.ts

// @ts-ignore
@external("env", "abort")
declare function abort(message: string | null, fileName: string | null, lineNumber: u32, columnNumber: u32): void;

// @ts-ignore
@external("env", "logMessage")
declare function logMessage(ptr: usize, len: i32): void;

// @ts-ignore
@external("env", "query_rdf_tbv_cli")
declare function query_rdf_tbv_cli(queryPtr: usize, queryLen: i32, callbackPtr: usize): void;

// @ts-ignore
@external("env", "get_result_row")
declare function get_result_row(resultPtr: usize): usize;

// @ts-ignore
@external("env", "free_result")
declare function free_result(resultPtr: usize): void;

// @ts-ignore
@external("env", "set_query_result")
declare function set_query_result(resultPtr: usize): void;




class Book {
  title: string;
  authorName: string;

  constructor(title: string, authorName: string) {
    this.title = title;
    this.authorName = authorName;
  }
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

function cleanBalanceString(balanceStr: string): string {
  let result = "";
  for (let i = 0; i < balanceStr.length; i++) {
    const char = balanceStr.charAt(i);
    if (char >= '0' && char <= '9' || char === '.') {
      result += char;
    }
  }
  return result;
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


export function AssemblyScript(): void {}


export function writeString(ptr: usize, strPtr: usize, strLen: i32): void {
  consoleLog(`Entering writeString function with ptr: ${ptr}, strPtr: ${strPtr}, strLen: ${strLen}`);
  
  consoleLog(`Attempting to read string from memory`);
  const buffer = new ArrayBuffer(strLen);
  memory.copy(changetype<usize>(buffer), strPtr, strLen);
  const str = String.UTF8.decode(buffer);
  consoleLog(`Read string: "${str}"`);
  
  consoleLog(`Attempting to write string of length ${strLen} to address ${ptr}`);
  consoleLog(`Current memory size: ${memory.size() * 65536} bytes`);
  
  if (ptr + strLen > <usize>(memory.size() * 65536)) {
    consoleLog(`Error: Not enough memory to write string. Current memory: ${memory.size() * 65536}, Required: ${ptr + strLen}`);
    return;
  }
  
  memory.copy(ptr, strPtr, strLen);
  
  consoleLog(`Wrote string "${str}" to ${ptr} with length ${strLen}`);
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

export function readString(ptr: usize, len: i32): usize {
  consoleLog(`Attempting to read string of length ${len} from address ${ptr}`);
  const buffer = new ArrayBuffer(len);
  memory.copy(changetype<usize>(buffer), ptr, len);
  const str = String.UTF8.decode(buffer);
  consoleLog(`Read string "${str}" from ${ptr} with length ${len}`);
  

  const newPtr = __new(len, idof<ArrayBuffer>());
  memory.copy(newPtr, ptr, len);
  return newPtr;
}

export function Rdf_Test2(rdfDataPtr: usize): usize {
  const rdfDataLen = getStringLen(rdfDataPtr);
  const rdfData = readString(rdfDataPtr, rdfDataLen);
  const message = `RDF_TEST:${String.UTF8.decode(changetype<ArrayBuffer>(rdfData))}`;
  const messageEncoded = String.UTF8.encode(message);
  const messagePtr = allocateString(messageEncoded.byteLength);
  writeString(messagePtr, changetype<usize>(messageEncoded), messageEncoded.byteLength);
  return messagePtr;
}




export function execute_credit_leg(amountPtr: usize, accountPtr: usize): usize {
  const amountLen = getStringLen(amountPtr);
  const accountLen = getStringLen(accountPtr);
  
  const amount = String.UTF8.decode(changetype<ArrayBuffer>(readString(amountPtr, amountLen)));
  const account = String.UTF8.decode(changetype<ArrayBuffer>(readString(accountPtr, accountLen)));
  
  consoleLog(`Executing credit leg for amount: ${amount}, account: ${account}`);

  // Construct RDF query
  const query = `
    PREFIX ex: <http://example.org/>
    SELECT ?balance
    WHERE {
      ex:${account} ex:hasBalance ?balance .
    }
  `;

  // Call RDF SDK to execute query using tbv-cli
  const queryEncoded = String.UTF8.encode(query);
  const queryPtr = allocateString(queryEncoded.byteLength);
  writeString(queryPtr, changetype<usize>(queryEncoded), queryEncoded.byteLength);
  
  // Use a callback function to handle the query result
  query_rdf_tbv_cli(queryPtr, queryEncoded.byteLength, changetype<usize>(process_credit_result));

  // Return a placeholder value
  return allocateString(0);
}

export function process_credit_result(resultPtr: usize): void {
  if (resultPtr === 0) {
    consoleLog("Error executing RDF query");
    set_query_result(createErrorResult("Error executing RDF query"));
    return;
  }

  const resultLen = getStringLen(resultPtr);
  const resultStr = String.UTF8.decode(changetype<ArrayBuffer>(readString(resultPtr, resultLen)));
  consoleLog(`Query result: ${resultStr}`);

  // Parse the balance from the result string
  const balance = parseBalance(resultStr);
  if (isNaN(balance)) {
    consoleLog(`Error: Invalid balance value "${resultStr}"`);
    set_query_result(createErrorResult(`Invalid balance value "${resultStr}"`));
    return;
  }

  // Here you would typically update the balance and generate a result message
  // For this example, we'll just return the current balance
  const message = `Current balance: ${balance}`;
  set_query_result(createSuccessResult(message));
}

function createErrorResult(message: string): usize {
  const errorMessage = `Error: ${message}`;
  const messageEncoded = String.UTF8.encode(errorMessage);
  const messagePtr = allocateString(messageEncoded.byteLength);
  writeString(messagePtr, changetype<usize>(messageEncoded), messageEncoded.byteLength);
  return messagePtr;
}

function createSuccessResult(message: string): usize {
  const messageEncoded = String.UTF8.encode(message);
  const messagePtr = allocateString(messageEncoded.byteLength);
  writeString(messagePtr, changetype<usize>(messageEncoded), messageEncoded.byteLength);
  return messagePtr;
}


export function execute_debit_leg(amountPtr: usize, accountPtr: usize): usize {
  const amountLen = getStringLen(amountPtr);
  const accountLen = getStringLen(accountPtr);
  
  const amount = String.UTF8.decode(changetype<ArrayBuffer>(readString(amountPtr, amountLen)));
  const account = String.UTF8.decode(changetype<ArrayBuffer>(readString(accountPtr, accountLen)));
  
  const message = `Debiting ${amount} from account ${account}`;
  consoleLog(`Created message: "${message}"`);
  
  const messageEncoded = String.UTF8.encode(message);
  const messagePtr = allocateString(messageEncoded.byteLength);
  writeString(messagePtr, changetype<usize>(messageEncoded), messageEncoded.byteLength);
  
  return messagePtr;
}



export function add_to_list(itemPtr: usize): usize {
  const itemLen = getStringLen(itemPtr);
  const item = String.UTF8.decode(changetype<ArrayBuffer>(readString(itemPtr, itemLen)));
  const message = `add:${item}`;
  consoleLog(`Add to list: ${message}`);
  const messageEncoded = String.UTF8.encode(message);
  const messagePtr = allocateString(messageEncoded.byteLength);
  writeString(messagePtr, changetype<usize>(messageEncoded), messageEncoded.byteLength);
  return messagePtr;
}

export function delete_from_list(itemPtr: usize): usize {
  const itemLen = getStringLen(itemPtr);
  const item = readString(itemPtr, itemLen);
  const message = `delete:${String.UTF8.decode(changetype<ArrayBuffer>(item))}`;
  const messageEncoded = String.UTF8.encode(message);
  const messagePtr = allocateString(messageEncoded.byteLength);
  writeString(messagePtr, changetype<usize>(messageEncoded), messageEncoded.byteLength);
  return messagePtr;
}

export function get_from_list(indexPtr: usize): usize {
  const indexLen = getStringLen(indexPtr);
  const index = String.UTF8.decode(changetype<ArrayBuffer>(readString(indexPtr, indexLen)));
  const message = index;
  consoleLog(`Get from list: ${message}`);
  const messageEncoded = String.UTF8.encode(message);
  const messagePtr = allocateString(messageEncoded.byteLength);
  writeString(messagePtr, changetype<usize>(messageEncoded), messageEncoded.byteLength);
  return messagePtr;
}

function parseBooks(jsonStr: string): Book[] {
  const books: Book[] = [];
  const parts = jsonStr.split("},");
  for (let i = 0; i < parts.length; i++) {
    let part = parts[i].replace("{", "").replace("}", "").replace("[", "").replace("]", "");
    const fields = part.split(",");
    let title: string = "";
    let authorName: string = "";
    for (let j = 0; j < fields.length; j++) {
      const keyValue = fields[j].split(":");
      const key = keyValue[0].split('"').join('').trim();
      const value = keyValue[1].split('"').join('').trim();
      if (key === "title") {
        title = value;
      } else if (key === "authorName") {
        authorName = value;
      }
    }
    books.push(new Book(title, authorName));
  }
  return books;
}

export function Rdf_Test(rdfDataPtr: usize): usize {
  const rdfDataLen = getStringLen(rdfDataPtr);
  const rdfDataStr = String.UTF8.decode(changetype<ArrayBuffer>(readString(rdfDataPtr, rdfDataLen)));

  const books = parseBooks(rdfDataStr);
  let result = "RDF_TEST:";
  for (let i = 0; i < books.length; i++) {
    result += `Title: ${books[i].title}, Author: ${books[i].authorName}; `;
  }
  
  const resultEncoded = String.UTF8.encode(result);
  const resultPtr = allocateString(resultEncoded.byteLength);
  writeString(resultPtr, changetype<usize>(resultEncoded), resultEncoded.byteLength);
  return resultPtr;
}

export function add_book(bookDataPtr: usize): usize {
  const bookDataLen = getStringLen(bookDataPtr);
  const bookDataStr = String.UTF8.decode(changetype<ArrayBuffer>(readString(bookDataPtr, bookDataLen)));
  const books = parseBooks(`[${bookDataStr}]`);
  const book = books[0];
  const result = `Added book: ${book.title} by ${book.authorName}`;
  const resultEncoded = String.UTF8.encode(result);
  const resultPtr = allocateString(resultEncoded.byteLength);
  writeString(resultPtr, changetype<usize>(resultEncoded), resultEncoded.byteLength);
  return resultPtr;
}

export function delete_book(titlePtr: usize): usize {
  const titleLen = getStringLen(titlePtr);
  const title = String.UTF8.decode(changetype<ArrayBuffer>(readString(titlePtr, titleLen)));
  const result = `Deleted book: ${title}`;
  const resultEncoded = String.UTF8.encode(result);
  const resultPtr = allocateString(resultEncoded.byteLength);
  writeString(resultPtr, changetype<usize>(resultEncoded), resultEncoded.byteLength);
  return resultPtr;
}

export function get_book(titlePtr: usize): usize {
  const titleLen = getStringLen(titlePtr);
  const title = String.UTF8.decode(changetype<ArrayBuffer>(readString(titlePtr, titleLen)));
  const result = `Retrieved book: ${title}`;
  const resultEncoded = String.UTF8.encode(result);
  const resultPtr = allocateString(resultEncoded.byteLength);
  writeString(resultPtr, changetype<usize>(resultEncoded), resultEncoded.byteLength);
  return resultPtr;
}