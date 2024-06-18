use wasm_bindgen::prelude::*; // ¹

#[wasm_bindgen] // ²
pub fn greeter(name: &str) -> Result<String, JsError /* ³ */> {
    Ok(format!("Hello {name}!"))
}

#[wasm_bindgen(start)] // ⁴
fn main() {
    console_error_panic_hook::set_once(); // ⁵
}
