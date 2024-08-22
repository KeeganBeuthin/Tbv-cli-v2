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
  console.log("Processing credit result");

  const processedResultPtr = process_credit_result(resultPtr);
  console.log(`Processed result pointer: ${processedResultPtr}`);

  const processedResult = readString(processedResultPtr);
  console.log(`Processed result: ${processedResult}`);
  console.log(`Processed result length: ${processedResult.length}`);

  // Add diagnostic logging here
  console.log("About to call setFinalResult");
  setFinalResult(processedResultPtr, processedResult.length);
  console.log("setFinalResult called");


  setFinalResult(processedResultPtr, processedResult.length);
}

export function main(): void {
  console.log("AssemblyScript program started");
}