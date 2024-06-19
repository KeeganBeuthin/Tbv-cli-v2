use wasm_bindgen::prelude::*;

// Function to simulate crediting an amount to an account
#[wasm_bindgen]
pub fn execute_credit_leg(amount: f64, account: &str) -> String {
    format!("Crediting {} to account {}", amount, account)
}

// Function to simulate debiting an amount from an account
#[wasm_bindgen]
pub fn execute_debit_leg(amount: f64, account: &str) -> String {
    format!("Debiting {} from account {}", amount, account)
}

// Simple function to add two numbers, simulating an HTTP request
#[wasm_bindgen]
pub fn http_request(a: i32, b: i32) -> i32 {
    a + b
}

// The start function is automatically called when the WASM module is instantiated
#[wasm_bindgen(start)]
pub fn main() {
    // Set up a panic hook to provide better error messages if something goes wrong
    // This is especially useful during development
    console_error_panic_hook::set_once();
}