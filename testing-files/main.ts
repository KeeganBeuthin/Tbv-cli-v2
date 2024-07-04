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
  const ptr = __new(len, idof<ArrayBuffer>()) + 4; // Add 4 to skip the header
  consoleLog(`Allocated buffer for string at ${ptr} with length ${len}`);
  return ptr;
}

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
  
  // Allocate new memory for the string and return its pointer
  const newPtr = __new(len, idof<ArrayBuffer>());
  memory.copy(newPtr, ptr, len);
  return newPtr;
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