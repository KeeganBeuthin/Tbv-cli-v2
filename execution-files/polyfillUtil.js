const crypto = require('crypto');

/**
 * Sets up the crypto polyfill for environments that need it
 */
function setupCryptoPolyfill() {
    if (typeof globalThis.crypto !== 'object') {
        globalThis.crypto = {
            getRandomValues(buffer) {
                return crypto.randomFillSync(buffer);
            }
        };
    }
}

module.exports = { setupCryptoPolyfill };