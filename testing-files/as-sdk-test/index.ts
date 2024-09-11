import { execute_credit_leg, process_credit_result, execute_debit_leg, allocateString, writeString, readString, handle_http_request } from 'tbv-asc-sdk/assembly';
import { JSON } from 'assemblyscript-json/assembly';
export { allocateString };


declare function executeRdfQuery(queryPtr: usize, queryLen: i32): void;
declare function setFinalResult(resultPtr: usize, resultLen: i32): void;

export function runTest(): void {
  const amount = "100.00";
  const account = "account123";

  console.log("Executing credit leg");
  const amountPtr = allocateString(amount.length);
  const accountPtr = allocateString(account.length);

  writeString(amountPtr, amount);
  writeString(accountPtr, account);

  const queryPtr = execute_credit_leg(amountPtr, accountPtr);
  const query = readString(queryPtr);

  console.log(`Generated query: ${query}`);
  
  executeRdfQuery(queryPtr, query.length);
}

export function setQueryResult(resultPtr: usize, resultLen: i32): void {
  console.log(`setQueryResult called with resultPtr: ${resultPtr}, resultLen: ${resultLen}`);
  const result = readString(resultPtr);
  console.log(`RDF query result: ${result}`);
  console.log("Processing credit result");

  const processedResultPtr = process_credit_result(resultPtr);
  console.log(`Processed result pointer: ${processedResultPtr}`);

  const processedResult = readString(processedResultPtr);
  console.log(`Processed result: ${processedResult}`);
  console.log(`Processed result length: ${processedResult.length}`);

  console.log("About to call setFinalResult");
  setFinalResult(processedResultPtr, processedResult.length);
  console.log("setFinalResult called");
}

export function handleHttpRequest(requestPtr: usize): usize {
  console.log("AssemblyScript: Entering handleHttpRequest");
  const requestStr = readString(requestPtr);
  console.log(`AssemblyScript: Received request: ${requestStr}`);

  const responsePtr = handle_http_request(requestPtr);
  const responseStr = readString(responsePtr);
  console.log(`AssemblyScript: Sending response: ${responseStr}`);

  return responsePtr;
}

export function getHtmlCode(): usize {
  const htmlCode = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>WebAssembly HTML</title>
    </head>
    <body>
        <h1>Hello from WebAssembly!</h1>
        <p>This HTML was generated in AssemblyScript and passed through WebAssembly.</p>
    </body>
    </html>
  `;
  const htmlPtr = allocateString(htmlCode.length);
  writeString(htmlPtr, htmlCode);
  return htmlPtr;
}

export function main(): void {
  console.log("AssemblyScript program started");
  // Here you could initialize any global state or perform any startup tasks
}