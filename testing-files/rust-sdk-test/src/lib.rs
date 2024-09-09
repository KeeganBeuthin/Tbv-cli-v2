use std::ffi::{CString, CStr};
use std::os::raw::{c_char, c_int};
use TBV_Rust_SDK_2::{execute_credit_leg, process_credit_result, handle_http_request as sdk_handle_http_request};
use std::cell::Cell;


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

thread_local! {
    static RECURSION_DEPTH: Cell<u32> = Cell::new(0);
}

#[no_mangle]
pub extern "C" fn handle_http_request(request_ptr: *const c_char) -> *mut c_char {
    let current_depth = RECURSION_DEPTH.with(|depth| {
        let current = depth.get();
        depth.set(current + 1);
        current
    });

    eprintln!("Rust: Entering handle_http_request, depth: {}", current_depth);

    let result = if current_depth > 10 {
        eprintln!("Rust: Max recursion depth exceeded");
        "{\"error\":\"Max recursion depth exceeded\"}".to_string()
    } else {
        unsafe {
            let request_str = CStr::from_ptr(request_ptr).to_str().unwrap_or("Invalid UTF-8");
            eprintln!("Rust: Received request: {}", request_str);
            
            let response_ptr = sdk_handle_http_request(request_ptr);
            let response_str = CStr::from_ptr(response_ptr).to_str().unwrap_or("Invalid UTF-8");
            eprintln!("Rust: SDK response: {}", response_str);
            
            response_str.to_string()
        }
    };

    RECURSION_DEPTH.with(|depth| depth.set(depth.get() - 1));
    eprintln!("Rust: Exiting handle_http_request, depth: {}", current_depth);
    eprintln!("Rust: Final result (len: {}): {:?}", result.len(), result);

    // Ensure we're creating a clean CString without any unexpected characters
    let clean_result = result.trim().to_string();
    match CString::new(clean_result) {
        Ok(c_str) => {
            eprintln!("Rust: CString created successfully");
            c_str.into_raw()
        },
        Err(e) => {
            eprintln!("Rust: Error creating CString: {:?}", e);
            CString::new("{\"error\":\"Internal error\"}").unwrap().into_raw()
        }
    }
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