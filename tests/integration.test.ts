import { executeWasmFile } from '../executeWasm';
import { createServer } from '../simpleApi';
import type { Server } from 'http';

describe('WebAssembly Module Integration Tests', () => {
  let server: Server;

  beforeAll(async () => {
    server = await createServer(3000);
  });

  afterAll((done) => {
    server.close(done);
  });

  const testCases = [
    {
      name: 'Rust',
      wasmPath: './testing-files/rust-sdk-test/output.wasm',
    },
    {
      name: 'AssemblyScript',
      wasmPath: './testing-files/as-sdk-test/output.wasm',
    },
    {
      name: 'Go',
      wasmPath: './testing-files/go-sdk-test/output.wasm',
    },
  ];

  testCases.forEach(({ name, wasmPath }) => {
    test(`${name} WebAssembly module integration`, async () => {
      const result = await executeWasmFile(wasmPath);
      expect(result.success).toBe(true);
      expect(result.result).toBeDefined();
      expect(result.result.creditQuery).toContain('SELECT ?balance');
      expect(result.result.creditResult).toContain('Current balance:');
      expect(result.result.creditResult).toContain('After credit of');
    }, 10000); // Increase timeout to 10 seconds for all tests
  });
});