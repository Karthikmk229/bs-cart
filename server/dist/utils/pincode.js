"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isValidTamilNaduPincode = isValidTamilNaduPincode;
// src/utils/pincode.ts
/**
 * Pincodes in Tamil Nadu start with 60, 61, 62, 63, or 64.
 * The standard structure is 6 digits.
 */
function isValidTamilNaduPincode(pincode) {
    const tnRegex = /^[6][0-4]\d{4}$/;
    return tnRegex.test(pincode);
}
