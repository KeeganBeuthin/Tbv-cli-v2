import { execute_credit_leg, process_credit_result, execute_debit_leg, allocateString, writeString, readString } from 'tbv-asc-sdk/assembly';

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
  console.log(`RDF query result length: ${result.length}`);
  console.log("Processing credit result");

  // Log the exact string being passed to process_credit_result
  console.log(`String passed to process_credit_result: "${result}"`);

  const processedResultPtr = process_credit_result(resultPtr);
  console.log(`Processed result pointer: ${processedResultPtr}`);

  const processedResult = readString(processedResultPtr);
  console.log(`Processed result: ${processedResult}`);
  console.log(`Processed result length: ${processedResult.length}`);

  // Log each character of the processed result
  for (let i = 0; i < processedResult.length; i++) {
    console.log(`Character at index ${i}: "${processedResult.charAt(i)}" (ASCII: ${processedResult.charCodeAt(i)})`);
  }

  setFinalResult(processedResultPtr, processedResult.length);
}

export function main(): void {
  console.log("AssemblyScript program started");
}