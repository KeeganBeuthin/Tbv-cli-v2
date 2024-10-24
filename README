# TBV CLI Tool

A command-line interface tool for building, testing, and serving WebAssembly modules across multiple languages.

## Installation

```bash
npm install npm link
```

## Commands

### Test
Test WebAssembly modules:
```bash
tbv-cli test [file path]
```

### Build
Build WebAssembly modules from source:
```bash
tbv-cli build [folder path] [language]
```

### Serve
Start a local server for WebAssembly modules:

```bash
tbv-cli serve-asc [file path]    # AssemblyScript server
tbv-cli serve-rust [file path]   # Rust server
tbv-cli serve [file path]        # Go server (Note: naming to be updated)
```

## Pre-built Modules

Default WebAssembly modules are available in the `testing-files` directory:
- `as-sdk-test`: AssemblyScript SDK test module
- `go-sdk-test`: Go SDK test module
- `rust-sdk-test`: Rust SDK test module

These modules can be rebuilt or modified as needed. Future updates will include improved organization of these default modules.

## Project Structure

```
testing-files/
├── as-sdk-test/      # AssemblyScript test module
├── go-sdk-test/      # Go test module
└── rust-sdk-test/    # Rust test module
```

## Known Issues and Future Updates

1. The Go server command (`tbv-cli serve`) needs to be renamed for consistency with other serve commands
2. Default WebAssembly output files need cleanup and better organization
3. Server commands may be consolidated in future updates

## Contributing

If you'd like to contribute to this project, please [insert contribution guidelines]

## License

[Insert License Information]