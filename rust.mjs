import { main } from './testing-files/rust/output.wasm'
const greeting = main('Grafbase')

console.log({ greeting })