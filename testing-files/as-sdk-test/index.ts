import {
  execute_credit_leg,
  process_credit_result,
  execute_debit_leg,
  allocateString,
  writeString,
  readString
} from "tbv-asc-sdk/assembly";

// Declare the external function for making CLI calls
declare function query_rdf_tbv_cli(queryPtr: usize, queryLen: i32): usize;

export function test(): string {
  const amount = "100.00";
  const account = "account123";

  // Create string pointers
  const amountPtr = allocateString(amount.length);
  writeString(amountPtr, amount);
  const accountPtr = allocateString(account.length);
  writeString(accountPtr, account);

  // Execute credit leg
  const queryPtr = execute_credit_leg(amountPtr, accountPtr);
  const query = readString(queryPtr);

  // Execute RDF query using CLI tool
  const resultPtr = query_rdf_tbv_cli(queryPtr, query.length);
  const result = readString(resultPtr);

  // Process credit result
  const processedResultPtr = process_credit_result(resultPtr);
  const processedResult = readString(processedResultPtr);

  // Execute debit leg
  const debitResultPtr = execute_debit_leg(amountPtr, accountPtr);
  const debitResult = readString(debitResultPtr);

  // Combine results
  return `{"creditResult": "${processedResult}", "debitResult": "${debitResult}"}`;
}