export function execute_credit_leg(amount: string, account: string): void {
  const message = `Crediting ${amount} to account ${account}`;
  console.log(message);
}

export function execute_debit_leg(amount: string, account: string): void {
  const message = `Debiting ${amount} from account ${account}`;
  console.log(message);
}

  export function http_request(a: number, b: number): number {
    return a + b;
  }
  
