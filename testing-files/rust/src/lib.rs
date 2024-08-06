use serde::{Deserialize, Serialize};
use serde_json::Result;

#[derive(Serialize, Deserialize, Debug)]
struct Book {
    title: String,
    authorName: String,
}

#[no_mangle]
pub extern "C" fn alloc(len: usize) -> *mut u8 {
    let mut buf = Vec::with_capacity(len);
    let ptr = buf.as_mut_ptr();
    std::mem::forget(buf);
    ptr
}

#[no_mangle]
pub extern "C" fn dealloc(ptr: *mut u8, len: usize) {
    unsafe {
        let _ = Vec::from_raw_parts(ptr, 0, len);
    }
}

fn string_to_ptr(s: &str) -> *const u8 {
    let mut bytes = s.as_bytes().to_vec();
    bytes.push(0); // Null terminator
    let ptr = alloc(bytes.len());
    unsafe {
        std::ptr::copy_nonoverlapping(bytes.as_ptr(), ptr, bytes.len());
    }
    ptr as *const u8
}

fn log(message: &str) {
    let bytes = message.as_bytes();
    let ptr = alloc(bytes.len());
    unsafe {
        std::ptr::copy_nonoverlapping(bytes.as_ptr(), ptr, bytes.len());
    }
    unsafe {
        log_message(ptr as *const u8, bytes.len() as i32);
    }
}

extern "C" {
    fn log_message(ptr: *const u8, len: i32);
}

#[no_mangle]
pub extern "C" fn execute_credit_leg(amount_ptr: *const u8, amount_len: usize, account_ptr: *const u8, account_len: usize) -> *const u8 {
    let amount = unsafe { std::str::from_utf8_unchecked(std::slice::from_raw_parts(amount_ptr, amount_len)) };
    let account = unsafe { std::str::from_utf8_unchecked(std::slice::from_raw_parts(account_ptr, account_len)) };
    
    let query = format!(
        "PREFIX ex: <http://example.org/>
        SELECT ?balance
        WHERE {{
          ex:{} ex:hasBalance ?balance .
        }}",
        account
    );
    
    let query_ptr = alloc(query.len());
    unsafe {
        std::ptr::copy_nonoverlapping(query.as_ptr(), query_ptr, query.len());
    }
    query_ptr as *const u8
}

#[no_mangle]
pub extern "C" fn process_credit_result(result_ptr: *const u8, result_len: usize, amount_ptr: *const u8, amount_len: usize) -> *const u8 {
    let result = unsafe { std::str::from_utf8_unchecked(std::slice::from_raw_parts(result_ptr, result_len)) };
    let amount = unsafe { std::str::from_utf8_unchecked(std::slice::from_raw_parts(amount_ptr, amount_len)) };
    
    log(&format!("Processing result: {}, amount: {}", result, amount));

    let parsed_result: serde_json::Value = match serde_json::from_str(result) {
        Ok(v) => v,
        Err(e) => {
            let error_msg = format!("Failed to parse result JSON: {}", e);
            log(&error_msg);
            return string_to_ptr(&error_msg);
        }
    };

    log(&format!("Parsed result: {:?}", parsed_result));

    let balance = match parsed_result["results"].as_array()
        .and_then(|results| results.get(0))
        .and_then(|first_result| first_result["balance"].as_number())
        .and_then(|balance| balance.as_f64()) {
        Some(b) => b,
        None => {
            let error_msg = "Failed to extract balance from result";
            log(error_msg);
            return string_to_ptr(error_msg);
        }
    };

    log(&format!("Extracted balance: {}", balance));

    let amount_float: f64 = match amount.parse() {
        Ok(a) => a,
        Err(e) => {
            let error_msg = format!("Failed to parse amount as float: {}", e);
            log(&error_msg);
            return string_to_ptr(&error_msg);
        }
    };

    let new_balance = balance + amount_float;
    
    let response = format!("Current balance: {}. After credit of {}, new balance: {}", balance, amount_float, new_balance);
    log(&response);
    
    string_to_ptr(&response)
}

#[no_mangle]
pub extern "C" fn execute_debit_leg(amount_ptr: *const u8, amount_len: usize, account_ptr: *const u8, account_len: usize) -> *const u8 {
    let amount = unsafe { std::str::from_utf8_unchecked(std::slice::from_raw_parts(amount_ptr, amount_len)) };
    let account = unsafe { std::str::from_utf8_unchecked(std::slice::from_raw_parts(account_ptr, account_len)) };
    
    log(&format!("Executing debit leg: amount = {}, account = {}", amount, account));

    let result = format!("Debiting {} from account {}", amount, account);
    log(&result);

    string_to_ptr(&result)
}
