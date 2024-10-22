import { execute_credit_leg, process_credit_result, execute_debit_leg, allocateString, writeString, readString, handle_http_request, allocateJson, readJson, consoleLog, dumpMemory } from 'tbv-asc-sdk/assembly';
import { JSON } from "assemblyscript-json/assembly";
export { allocateString };

declare function executeRdfQuery(queryPtr: usize, queryLen: i32): void;
declare function setFinalResult(resultPtr: usize, resultLen: i32): void;

export function runTest(): void {
  consoleLog("runTest function started"); // Using consoleLog instead of console.log

  const amount = "100.00";
  const account = "account123";

  const amountPtr = allocateString(amount.length);
  const accountPtr = allocateString(account.length);

  writeString(amountPtr, amount);
  writeString(accountPtr, account);

  const queryPtr = execute_credit_leg(amountPtr, accountPtr);
  const query = readString(queryPtr);
  
  consoleLog(`Generated query: ${query}`); // Log the generated query

  executeRdfQuery(queryPtr, query.length);
}

export function setQueryResult(bufferPtr: usize, length: i32): void {
  consoleLog(`setQueryResult called with bufferPtr: ${bufferPtr}, length: ${length}`);
  consoleLog(`Memory size: ${memory.size()}`);
  
  dumpMemory(bufferPtr, length);

  consoleLog(`Attempting to read string of length ${length} from address ${bufferPtr}`);
  const result = readString(bufferPtr);
  consoleLog(`Read result: "${result}"`);

  const jsonResult = JSON.parse(result) as JSON.Obj;

  const results = jsonResult.getArr("results");
  if (results && results.valueOf().length > 0) {
    const firstResult = results.valueOf()[0] as JSON.Obj;
    const balanceValue = firstResult.get("balance");
    if (balanceValue && balanceValue.isString) {
      const balance = (balanceValue as JSON.Str).valueOf();
      const parsedBalance = parseFloat(balance);
      
      if (!isNaN(parsedBalance)) {
        const finalResult = new JSON.Obj();
        finalResult.set("creditQuery", "PREFIX ex: <http://example.org/>\nSELECT ?balance\nWHERE {\n  ex:account123 ex:hasBalance ?balance .\n}");
        finalResult.set("creditResult", `Current balance: ${balance}. After credit of 100.00, new balance: ${(parsedBalance + 100).toString()}`);

        const finalResultString = finalResult.toString();
        consoleLog(`Final result: ${finalResultString}`); 

        const finalResultPtr = allocateJson(finalResult);
        setFinalResult(finalResultPtr, finalResultString.length);
        consoleLog("setFinalResult called");
      } else {
        consoleLog(`Error: Invalid balance value ${balance}`);
      }
    } else {
      consoleLog("Balance not found in result or is not a string");
    }
  } else {
    consoleLog("No results found in the JSON object");
  }
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
