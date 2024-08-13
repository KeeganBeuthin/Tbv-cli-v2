use TBV-Rust-SDK::{execute_credit_leg, process_credit_result};

fn main() {
    let amount = "100.00";
    let account = "account123";
    
    let query = execute_credit_leg(amount.as_ptr(), amount.len() as i32, account.as_ptr(), account.len() as i32);
    println!("Generated query: {:?}", query);

    let result = r#"{"results": [{"balance": "500.00"}]}"#;
    let processed_result = process_credit_result(result.as_ptr(), result.len() as i32, amount.as_ptr(), amount.len() as i32);
    println!("Processed result: {:?}", processed_result);
}