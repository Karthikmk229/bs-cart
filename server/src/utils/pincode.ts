// src/utils/pincode.ts
/**
 * Pincodes in Tamil Nadu start with 60, 61, 62, 63, or 64.
 * The standard structure is 6 digits.
 */
export function isValidTamilNaduPincode(pincode: string): boolean {
  const tnRegex = /^[6][0-4]\d{4}$/;
  return tnRegex.test(pincode);
}
