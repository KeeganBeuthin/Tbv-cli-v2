use std::ffi::{CString, CStr};
use std::os::raw::{c_char, c_int};
use TBV_Rust_SDK_2::{execute_credit_leg, process_credit_result, handle_http_request as sdk_handle_http_request};

#[no_mangle]
pub extern "C" fn run_test(amount_ptr: *const c_char, amount_len: c_int, account_ptr: *const c_char, account_len: c_int) -> *mut c_char {
    let query_ptr = execute_credit_leg(amount_ptr as *const u8, amount_len as usize, account_ptr as *const u8, account_len as usize);
    
    let query = unsafe { CStr::from_ptr(query_ptr as *const c_char).to_string_lossy().into_owned() };
    println!("Generated query: {}", query);

    CString::new(query).unwrap().into_raw()
}

#[no_mangle]
pub extern "C" fn set_query_result(result_ptr: *const c_char, result_len: c_int, amount_ptr: *const c_char, amount_len: c_int) -> *mut c_char {
    let result = unsafe { std::slice::from_raw_parts(result_ptr as *const u8, result_len as usize) };
    let amount = unsafe { std::slice::from_raw_parts(amount_ptr as *const u8, amount_len as usize) };

    let processed_result_ptr = process_credit_result(result.as_ptr(), result.len(), amount.as_ptr(), amount.len());

    let processed_result = unsafe { CStr::from_ptr(processed_result_ptr as *const c_char).to_string_lossy().into_owned() };
    println!("Processed result: {}", processed_result);

    CString::new(processed_result).unwrap().into_raw()
}

#[no_mangle]
pub extern "C" fn handle_http_request(request_ptr: *const c_char) -> *mut c_char {
    sdk_handle_http_request(request_ptr)
}

#[no_mangle]
pub extern "C" fn get_html_code() -> *mut c_char {
    let html_code = r#"
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>WebAssembly HTML</title>
    </head>
    <body>
        <h1>Hello from WebAssembly!</h1>
        <p>This HTML was generated in Rust and passed through WebAssembly.</p>
    </body>
    </html>
    "#;
    CString::new(html_code).unwrap().into_raw()
}

#[no_mangle]
pub extern "C" fn dealloc_str(ptr: *mut c_char) {
    unsafe {
        if !ptr.is_null() {
            let _ = CString::from_raw(ptr);
        }
    }
}

// Remove the init function as it's likely defined in the SDK
// #[no_mangle]
// pub extern "C" fn init() {
//     println!("Rust program started");
// }