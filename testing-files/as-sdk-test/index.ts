import { Transaction } from "tbv-asc-sdk";

const transaction = new Transaction();

const feeAccount = transaction.getFeeAccount();
console.log("Fee Account:", feeAccount);

const childTransaction = transaction.createChildTransaction();
childTransaction.setSourceAccount("sourceAccount123");
childTransaction.setTargetAccount("targetAccount456");
childTransaction.setTransactionValue(100000); // Assuming value in smallest units

const action = childTransaction.createAction();
action.setContractName("TestContract");
action.setModelStringValue("subject1", "predicate1", "value1");

childTransaction.submit();

console.log("Transaction submitted");