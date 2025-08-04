// Bitcrunch integration wrapper
// This module is safe to import anywhere. It will only load Bitcrunch if ENABLE_BITCRUNCH is set.
// If Bitcrunch is not enabled, all methods are no-ops.

const enabled = process.env.ENABLE_BITCRUNCH === 'true';
let bitcrunch: any = null;

if (enabled) {
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    bitcrunch = require('bitcrunch');
  } catch (e) {
    // eslint-disable-next-line no-console
    console.warn('Bitcrunch package not installed. Bitcrunch integration disabled.');
    bitcrunch = null;
  }
}

// Example: create a bitmap (returns null if not enabled)
export function getBitmap(name: string) {
  if (!enabled || !bitcrunch) return null;
  return bitcrunch(name);
}

// Example: add a value to a bitmap (no-op if not enabled)
export function addToBitmap(bitmap: any, value: string) {
  if (!enabled || !bitmap) return;
  bitmap.add(value);
}

// Example: check membership (returns false if not enabled)
export function includesInBitmap(bitmap: any, value: string, cb: (err: any, result: boolean) => void) {
  if (!enabled || !bitmap) return cb(null, false);
  bitmap.includes(value, cb);
}

// Add more wrappers as needed for your use case.
