const { TextDecoder, TextEncoder } = require("util");

/**
 * Reads a null-terminated string from WebAssembly memory
 * @param {WebAssembly.Instance} instance - The WebAssembly instance
 * @param {number} ptr - Pointer to the string in memory
 * @param {number} maxLen - Maximum length to read
 * @returns {string} Decoded string
 */
function readStringFromMemory(instance, ptr, maxLen) {
  console.log(`JS: Reading string from memory at ${ptr} with max length ${maxLen}`);
  if (ptr === 0) {
    console.log("JS: Received null pointer");
    return "";
  }
  const memory = new Uint8Array(instance.exports.memory.buffer);
  let end = ptr;
  while (end < ptr + maxLen && memory[end] !== 0) {
    end++;
  }
  const str = new TextDecoder().decode(memory.subarray(ptr, end));
  console.log(`JS: Read string: "${str}"`);
  return str;
}

/**
 * Writes a string to WebAssembly memory using TinyGo conventions
 * @param {WebAssembly.Instance} instance - The WebAssembly instance
 * @param {string} str - String to write
 * @returns {Object} Object containing pointer and length of the written string
 */
function writeStringToMemoryTinyGo(instance, str) {
  console.log(`JS: Writing string "${str}" to memory (TinyGo)`);
  const encoder = new TextEncoder();
  const encodedStr = encoder.encode(str + "\0");
  const ptr = instance.exports.malloc(encodedStr.length);
  const memory = new Uint8Array(instance.exports.memory.buffer);
  memory.set(encodedStr, ptr);
  console.log(`JS: Allocated string at ${ptr} with length ${encodedStr.length}`);
  return { 
    ptr, 
    length: encodedStr.length - 1 // Subtract 1 to exclude null terminator
  };
}

/**
 * Writes a string to WebAssembly memory for standard WASM modules
 * @param {WebAssembly.Instance} instance - The WebAssembly instance
 * @param {string} str - String to write
 * @returns {number} Pointer to the written string
 */
function writeStringToMemory(instance, str) {
  console.log(`JS: Writing string "${str}" to memory`);
  const encoder = new TextEncoder();
  const encodedStr = encoder.encode(str);
  const ptr = instance.exports.allocateString(encodedStr.length);
  new Uint8Array(instance.exports.memory.buffer).set(encodedStr, ptr);
  console.log(`JS: Allocated string at ${ptr}`);
  return ptr;
}

/**
 * Reads a null-terminated string from Rust WASM memory
 * @param {WebAssembly.Instance} instance - The WebAssembly instance
 * @param {number} ptr - Pointer to the string in memory
 * @returns {string} Decoded string
 */
function readStringFromMemoryRust(instance, ptr) {
  const memory = new Uint8Array(instance.exports.memory.buffer);
  let len = 0;
  while (memory[ptr + len] !== 0) len++;
  return new TextDecoder().decode(memory.subarray(ptr, ptr + len));
}

/**
 * Writes a string to Rust WASM memory
 * @param {WebAssembly.Instance} instance - The WebAssembly instance
 * @param {string} str - String to write
 * @returns {Object} Object containing pointer and length of the written string
 */
function writeStringToMemoryRust(instance, str) {
  const encoder = new TextEncoder();
  const encodedStr = encoder.encode(str + "\0");
  const ptr = instance.exports.alloc(encodedStr.length);
  const memory = new Uint8Array(instance.exports.memory.buffer);
  memory.set(encodedStr, ptr);
  return { 
    ptr, 
    len: encodedStr.length - 1 // Subtract 1 to exclude null terminator
  };
}

/**
 * Creates a new WebAssembly memory instance with specified parameters
 * @param {number} initialPages - Initial number of memory pages
 * @param {number} maximumPages - Maximum number of memory pages
 * @returns {WebAssembly.Memory} New memory instance
 */
function createWasmMemory(initialPages = 256, maximumPages = 512) {
  return new WebAssembly.Memory({ 
    initial: initialPages, 
    maximum: maximumPages 
  });
}

/**
 * Grows WebAssembly memory if needed
 * @param {WebAssembly.Memory} memory - The WebAssembly memory instance
 * @param {number} requiredBytes - Required number of bytes
 * @returns {boolean} True if memory was grown, false otherwise
 */
function growMemoryIfNeeded(memory, requiredBytes) {
  const currentPages = memory.buffer.byteLength / 65536;
  const requiredPages = Math.ceil(requiredBytes / 65536);
  
  if (currentPages < requiredPages) {
    const additionalPages = requiredPages - currentPages;
    memory.grow(additionalPages);
    return true;
  }
  return false;
}

/**
 * Utility class for managing heap allocations
 */
class HeapManager {
  constructor(memory, initialHeapStart = 1) {
    this.memory = memory;
    this.heap = new Uint8Array(memory.buffer);
    this.heapNext = initialHeapStart;
  }

  /**
   * Allocates memory from the heap
   * @param {number} size - Size in bytes to allocate
   * @returns {number} Pointer to allocated memory
   */
  malloc(size) {
    const addr = this.heapNext;
    this.heapNext += size;
    
    if (this.heapNext > this.heap.length) {
      const grown = growMemoryIfNeeded(this.memory, this.heapNext);
      if (!grown) {
        console.error("Out of memory");
        return 0;
      }
      // Update heap view after growing memory
      this.heap = new Uint8Array(this.memory.buffer);
    }
    
    return addr;
  }

  /**
   * Frees allocated memory (placeholder for actual implementation)
   * @param {number} ptr - Pointer to memory to free
   */
  free(ptr) {
    // In this simple implementation, we don't actually free memory
    // This would need to be implemented properly for production use
    console.log("free called with ptr:", ptr);
  }
}

module.exports = {
  readStringFromMemory,
  writeStringToMemoryTinyGo,
  writeStringToMemory,
  readStringFromMemoryRust,
  writeStringToMemoryRust,
  createWasmMemory,
  growMemoryIfNeeded,
  HeapManager
};