import { executeWasmFile } from '../executeWasm';
import { createServer } from '../simpleApi';
import { Server } from 'http';

describe('WebAssembly Module Integration Tests', () => {
  let server: Server;

  beforeAll(async () => {
    server = await createServer(3000);
  });

  afterAll((done) => {
    server.close(done);
  });

  test('Rust WebAssembly module integration', async () => {
    const result = await executeWasmFile('./testing-files/rust-sdk-test/output.wasm');
    expect(result.success).toBe(true);
    expect(result.result).toBeDefined();
    expect(result.result.creditQuery).toContain('SELECT ?balance');
    expect(result.result.creditResult).toContain('Current balance:');
    expect(result.result.creditResult).toContain('After credit of');
  });

  test('AssemblyScript WebAssembly module integration', async () => {
    const result = await executeWasmFile('./testing-files/as-sdk-test/output.wasm');
    expect(result.success).toBe(true);
    expect(result.message).toBe('AssemblyScript module executed successfully');
  });

  // Add more tests for other WebAssembly modules (e.g., Go) if needed
});