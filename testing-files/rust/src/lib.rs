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

#[no_mangle]
pub extern "C" fn rust() {
    
}

#[no_mangle]
pub extern "C" fn greet(name_ptr: *const u8, name_len: usize) -> *const u8 {
    let name = unsafe { std::str::from_utf8_unchecked(std::slice::from_raw_parts(name_ptr, name_len)) };
    let result = format!("Hello, {}!", name);
    let bytes = result.into_bytes();
    let ptr = bytes.as_ptr();
    std::mem::forget(bytes);
    ptr
}

#[no_mangle]
pub extern "C" fn execute_credit_leg(amount_ptr: *const u8, amount_len: usize, account_ptr: *const u8, account_len: usize) -> *const u8 {
    let amount = unsafe { std::str::from_utf8_unchecked(std::slice::from_raw_parts(amount_ptr, amount_len)) };
    let account = unsafe { std::str::from_utf8_unchecked(std::slice::from_raw_parts(account_ptr, account_len)) };
    let result = format!("Crediting {} to account {}", amount, account);
    let bytes = result.into_bytes();
    let ptr = bytes.as_ptr();
    std::mem::forget(bytes);
    ptr
}

#[no_mangle]
pub extern "C" fn execute_debit_leg(amount_ptr: *const u8, amount_len: usize, account_ptr: *const u8, account_len: usize) -> *const u8 {
    let amount = unsafe { std::str::from_utf8_unchecked(std::slice::from_raw_parts(amount_ptr, amount_len)) };
    let account = unsafe { std::str::from_utf8_unchecked(std::slice::from_raw_parts(account_ptr, account_len)) };
    let result = format!("Debiting {} from account {}", amount, account);
    let bytes = result.into_bytes();
    let ptr = bytes.as_ptr();
    std::mem::forget(bytes);
    ptr
}

#[no_mangle]
pub extern "C" fn add_to_list(item_ptr: *const u8, item_len: usize) -> *const u8 {
    let item = unsafe { std::str::from_utf8_unchecked(std::slice::from_raw_parts(item_ptr, item_len)) };
    let result = format!("add:{}", item);
    let bytes = result.into_bytes();
    let ptr = bytes.as_ptr();
    std::mem::forget(bytes);
    ptr
}

#[no_mangle]
pub extern "C" fn delete_from_list(item_ptr: *const u8, item_len: usize) -> *const u8 {
    let item = unsafe { std::str::from_utf8_unchecked(std::slice::from_raw_parts(item_ptr, item_len)) };
    let result = format!("delete:{}", item);
    let bytes = result.into_bytes();
    let ptr = bytes.as_ptr();
    std::mem::forget(bytes);
    ptr
}

#[no_mangle]
pub extern "C" fn Rdf_Test(rdf_data_ptr: *const u8, rdf_data_len: usize) -> *const u8 {
    let rdf_data = unsafe { std::str::from_utf8_unchecked(std::slice::from_raw_parts(rdf_data_ptr, rdf_data_len)) };
    let result = format!("RDF_TEST:{}", rdf_data);
    let bytes = result.into_bytes();
    let ptr = bytes.as_ptr();
    std::mem::forget(bytes);
    ptr
}

#[no_mangle]
pub extern "C" fn get_from_list(index_ptr: *const u8, index_len: usize) -> *const u8 {
    let index = unsafe { std::str::from_utf8_unchecked(std::slice::from_raw_parts(index_ptr, index_len)) };
    let bytes = index.as_bytes().to_vec();
    let ptr = bytes.as_ptr();
    std::mem::forget(bytes);
    ptr
}
