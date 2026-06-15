"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CouponsService = void 0;
// src/modules/coupons/coupons.service.ts
const db_1 = require("../../config/db");
class CouponsService {
    static async listCoupons() {
        const now = new Date();
        return db_1.prisma.coupon.findMany({
            where: {
                isActive: true,
                validFrom: { lte: now },
                validTo: { gte: now },
            },
        });
    }
    static async validateCoupon(userId, code, subTotal) {
        const now = new Date();
        const coupon = await db_1.prisma.coupon.findUnique({
            where: { code },
        });
        if (!coupon || !coupon.isActive) {
            throw new Error('Invalid coupon code');
        }
        if (now < coupon.validFrom || now > coupon.validTo) {
            throw new Error('Coupon code has expired');
        }
        if (subTotal < coupon.minOrderValue) {
            throw new Error(`Minimum order value to apply this coupon is ₹${coupon.minOrderValue}`);
        }
        // Check usage limits
        if (coupon.usageLimit !== null) {
            const usageCount = await db_1.prisma.couponUsage.count({
                where: { couponId: coupon.id },
            });
            if (usageCount >= coupon.usageLimit) {
                throw new Error('Coupon usage limit reached');
            }
        }
        // Check per user limits
        const userUsageCount = await db_1.prisma.couponUsage.count({
            where: { couponId: coupon.id, userId },
        });
        if (userUsageCount >= coupon.perUserLimit) {
            throw new Error('You have reached the maximum usage limit for this coupon');
        }
        // Calculate discount
        let discount = 0;
        if (coupon.discountType === 'flat') {
            discount = coupon.discountValue;
        }
        else if (coupon.discountType === 'percent') {
            discount = subTotal * (coupon.discountValue / 100);
        }
        // Cap maximum discount
        if (coupon.maxDiscount !== null && discount > coupon.maxDiscount) {
            discount = coupon.maxDiscount;
        }
        // Prevent discount exceeding subtotal
        if (discount > subTotal) {
            discount = subTotal;
        }
        return {
            couponId: coupon.id,
            code: coupon.code,
            discountAmount: Number(discount.toFixed(2)),
        };
    }
}
exports.CouponsService = CouponsService;
