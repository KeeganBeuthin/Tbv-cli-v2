// main.ts

// @ts-ignore
@external("env", "abort")
declare function abort(message: string | null, fileName: string | null, lineNumber: u32, columnNumber: u32): void;

// @ts-ignore
@external("env", "logMessage")
declare function logMessage(ptr: usize, len: i32): void;

class Book {
  title: string;
  authorName: string;

  constructor(title: string, authorName: string) {
    this.title = title;
    this.authorName = authorName;
  }
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
  
  const amountStr = readString(amountPtr, amountLen);
  const accountStr = readString(accountPtr, accountLen);
  
  const message = `Crediting ${String.UTF8.decode(changetype<ArrayBuffer>(amountStr))} to account ${String.UTF8.decode(changetype<ArrayBuffer>(accountStr))}`;
  consoleLog(`Created message: "${message}"`);
  
  const messageEncoded = String.UTF8.encode(message);
  const messagePtr = allocateString(messageEncoded.byteLength);
  writeString(messagePtr, changetype<usize>(messageEncoded), messageEncoded.byteLength);
  
  return messagePtr;
}

export function execute_debit_leg(amountPtr: usize, accountPtr: usize): usize {
  const amountLen = getStringLen(amountPtr);
  const accountLen = getStringLen(accountPtr);
  
  const amountStr = readString(amountPtr, amountLen);
  const accountStr = readString(accountPtr, accountLen);
  
  const message = `Debiting ${String.UTF8.decode(changetype<ArrayBuffer>(amountStr))} from account ${String.UTF8.decode(changetype<ArrayBuffer>(accountStr))}`;
  consoleLog(`Created message: "${message}"`);
  
  const messageEncoded = String.UTF8.encode(message);
  const messagePtr = allocateString(messageEncoded.byteLength);
  writeString(messagePtr, changetype<usize>(messageEncoded), messageEncoded.byteLength);
  
  return messagePtr;
}



export function add_to_list(itemPtr: usize): usize {
  const itemLen = getStringLen(itemPtr);
  const item = readString(itemPtr, itemLen);
  const message = `add:${String.UTF8.decode(changetype<ArrayBuffer>(item))}`;
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
  const index = readString(indexPtr, indexLen);
  const message = `${String.UTF8.decode(changetype<ArrayBuffer>(index))}`;
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