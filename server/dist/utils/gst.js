"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateGstSplit = calculateGstSplit;
/**
 * Calculates the tax and base price from the selling price (which is tax-inclusive).
 * Formula:
 * basePrice = sellingPrice / (1 + gstPercent / 100)
 * totalTax = sellingPrice - basePrice
 * CGST = totalTax / 2
 * SGST = totalTax / 2
 */
function calculateGstSplit(sellingPrice, gstPercent, quantity = 1) {
    const totalPrice = sellingPrice * quantity;
    const basePrice = totalPrice / (1 + gstPercent / 100);
    const totalTaxAmount = totalPrice - basePrice;
    const cgstAmount = totalTaxAmount / 2;
    const sgstAmount = totalTaxAmount / 2;
    return {
        cgstAmount: Number(cgstAmount.toFixed(2)),
        sgstAmount: Number(sgstAmount.toFixed(2)),
        totalTaxAmount: Number(totalTaxAmount.toFixed(2)),
        basePrice: Number(basePrice.toFixed(2)),
    };
}
