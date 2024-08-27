use wasm_bindgen::prelude::*;
use TBV_Rust_SDK::{execute_credit_leg, process_credit_result};
use std::sync::Once;

static INIT: Once = Once::new();

#[wasm_bindgen]
pub fn run_test(amount: &str, account: &str) -> Result<String, JsValue> {
    INIT.call_once(|| {
        console_error_panic_hook::set_once();
    });

    let query_ptr = execute_credit_leg(
        amount.as_ptr(),
        amount.len(),
        account.as_ptr(),
        account.len(),
    );

    let query = unsafe { std::ffi::CStr::from_ptr(query_ptr as *const i8).to_string_lossy().into_owned() };
    web_sys::console::log_1(&format!("Generated query: {}", query).into());

    Ok(query)
}

#[wasm_bindgen]
pub fn set_query_result(result: &str, amount: &str) -> Result<String, JsValue> {
    let processed_result_ptr = process_credit_result(
        result.as_ptr(),
        result.len(),
        amount.as_ptr(),
        amount.len(),
    );

    let processed_result = unsafe { std::ffi::CStr::from_ptr(processed_result_ptr as *const i8).to_string_lossy().into_owned() };
    web_sys::console::log_1(&format!("Processed result: {}", processed_result).into());

    Ok(processed_result)
}

#[wasm_bindgen(start)]
pub fn main() -> Result<(), JsValue> {
    web_sys::console::log_1(&"Rust program started".into());
    Ok(())
}