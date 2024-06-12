(module
  (type (;0;) (func (param i32 i32) (result i32)))
  (func (;0;) (type 0) (param i32 i32) (result i32)
    local.get 0
    local.get 1
    i32.add
    return)
  (table (;0;) 1 1 funcref)
  (memory (;0;) 0)
  (global (;0;) i32 (i32.const 8))
  (global (;1;) (mut i32) (i32.const 32776))
  (global (;2;) i32 (i32.const 32776))
  (export "add" (func 0))
  (export "memory" (memory 0))
  (elem (;0;) (i32.const 1) func))
