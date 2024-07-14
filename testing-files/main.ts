// main.ts

// @ts-ignore
@external("env", "abort")
declare function abort(message: string | null, fileName: string | null, lineNumber: u32, columnNumber: u32): void;

// @ts-ignore
@external("env", "logMessage")
declare function logMessage(ptr: usize, len: i32): void;

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

export function Rdf_Test(rdfDataPtr: usize): usize {
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

export function getMemorySize(): i32 {
  return memory.size() * 65536;
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
