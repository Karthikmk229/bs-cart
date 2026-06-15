// src/utils/gst.ts
export interface GstSplit {
  cgstAmount: number;
  sgstAmount: number;
  totalTaxAmount: number;
  basePrice: number; // Price before tax
}

/**
 * Calculates the tax and base price from the selling price (which is tax-inclusive).
 * Formula:
 * basePrice = sellingPrice / (1 + gstPercent / 100)
 * totalTax = sellingPrice - basePrice
 * CGST = totalTax / 2
 * SGST = totalTax / 2
 */
export function calculateGstSplit(sellingPrice: number, gstPercent: number, quantity: number = 1): GstSplit {
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
