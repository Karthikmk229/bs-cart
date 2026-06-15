"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrdersService = void 0;
// src/modules/orders/orders.service.ts
const db_1 = require("../../config/db");
const order_1 = require("../../utils/order");
const gst_1 = require("../../utils/gst");
const coupons_service_1 = require("../coupons/coupons.service");
class OrdersService {
    static async listUserOrders(userId) {
        return db_1.prisma.order.findMany({
            where: { userId },
            include: {
                items: true,
                address: true,
                deliverySlot: true,
            },
            orderBy: { createdAt: 'desc' },
        });
    }
    static async getOrderById(userId, id) {
        const order = await db_1.prisma.order.findFirst({
            where: { id, userId },
            include: {
                items: true,
                address: true,
                deliverySlot: true,
                payments: true,
                statusHistory: {
                    orderBy: { createdAt: 'asc' },
                },
            },
        });
        if (!order) {
            throw new Error('Order not found');
        }
        return order;
    }
    static async checkout(userId, data) {
        const { addressId, deliverySlotId, paymentMethod, couponCode, prescriptionId, notes } = data;
        // Use Prisma transaction
        return db_1.prisma.$transaction(async (tx) => {
            // 1. Fetch & Validate Address
            const address = await tx.address.findFirst({
                where: { id: addressId, userId },
            });
            if (!address) {
                throw new Error('Delivery address not found or invalid');
            }
            // Fetch serviceability to check if pincode is serviced
            const serviceability = await tx.pincodeServiceability.findFirst({
                where: { pincode: address.pincode, isActive: true },
            });
            if (!serviceability) {
                throw new Error(`Address pincode ${address.pincode} is not serviceable`);
            }
            const warehouseId = serviceability.warehouseId;
            const deliveryCharge = serviceability.deliveryCharge;
            // 2. Fetch User Cart and Items
            const cart = await tx.cart.findUnique({
                where: { userId },
                include: {
                    items: {
                        include: {
                            productVariant: {
                                include: {
                                    product: true,
                                },
                            },
                        },
                    },
                },
            });
            if (!cart || cart.items.length === 0) {
                throw new Error('Your shopping cart is empty');
            }
            // 3. Validate Inventory stock per item for this warehouse
            const inventoryDeductions = [];
            const itemDetails = [];
            let totalInclusiveProductValue = 0;
            let totalTaxAmount = 0;
            let requiresPrescription = false;
            for (const item of cart.items) {
                const variant = item.productVariant;
                const product = variant.product;
                const requestedQty = item.quantity;
                const price = variant.priceOverride !== null ? variant.priceOverride : product.sellingPrice;
                if (product.requiresPrescription) {
                    requiresPrescription = true;
                }
                // Fetch inventories for this variant in the target warehouse, sorted by expiry (FEFO)
                const inventories = await tx.inventory.findMany({
                    where: {
                        productVariantId: variant.id,
                        warehouseId: warehouseId,
                        quantity: { gt: 0 },
                        expiryDate: { gt: new Date() }, // Not expired
                    },
                    orderBy: { expiryDate: 'asc' },
                });
                const totalAvailable = inventories.reduce((sum, inv) => sum + inv.quantity, 0);
                if (totalAvailable < requestedQty) {
                    throw new Error(`Insufficient stock for item "${product.name} (${variant.size})". Required: ${requestedQty}, Available at warehouse: ${totalAvailable}`);
                }
                // Calculate inventory batch deductions
                let remainingToDeduct = requestedQty;
                for (const inv of inventories) {
                    if (remainingToDeduct <= 0)
                        break;
                    const deduct = Math.min(inv.quantity, remainingToDeduct);
                    inventoryDeductions.push({
                        inventoryId: inv.id,
                        quantityToDeduct: deduct,
                    });
                    remainingToDeduct -= deduct;
                }
                // GST splits (inclusive price)
                const gstResult = (0, gst_1.calculateGstSplit)(price, product.gstPercent, requestedQty);
                totalInclusiveProductValue += price * requestedQty;
                totalTaxAmount += gstResult.totalTaxAmount;
                itemDetails.push({
                    productVariantId: variant.id,
                    productName: product.name,
                    brand: product.brand,
                    size: variant.size,
                    hsnCode: product.hsnCode,
                    gstPercent: product.gstPercent,
                    quantity: requestedQty,
                    unitPrice: price,
                    totalPrice: price * requestedQty,
                });
            }
            // 4. Prescription Check
            if (requiresPrescription) {
                if (!prescriptionId) {
                    throw new Error('Prescription upload is required for prescription-only medical items');
                }
                const prescription = await tx.prescription.findFirst({
                    where: { id: prescriptionId, userId },
                });
                if (!prescription) {
                    throw new Error('Invalid prescription ID');
                }
                if (prescription.status !== 'approved') {
                    throw new Error(`Your uploaded prescription is currently in "${prescription.status}" status. It must be approved before order placement.`);
                }
            }
            // 5. Coupon Application
            let discountAmount = 0;
            let couponId = null;
            if (couponCode) {
                // Run coupon validation
                const couponResult = await coupons_service_1.CouponsService.validateCoupon(userId, couponCode, totalInclusiveProductValue);
                discountAmount = couponResult.discountAmount;
                couponId = couponResult.couponId;
            }
            // 6. Subtotal (tax exclusive)
            const subTotal = totalInclusiveProductValue - totalTaxAmount;
            // Final cost math
            const total = Number((totalInclusiveProductValue - discountAmount + deliveryCharge).toFixed(2));
            // 7. Verify and reserve delivery slot
            const deliverySlot = await tx.deliverySlot.findUnique({
                where: { id: deliverySlotId },
            });
            if (!deliverySlot || !deliverySlot.isActive) {
                throw new Error('Selected delivery slot is inactive or not found');
            }
            if (deliverySlot.currentOrders >= deliverySlot.maxOrders) {
                throw new Error('Selected delivery slot is fully booked');
            }
            // 8. Generate Order Number
            const orderNumber = await (0, order_1.generateOrderNumber)();
            // Determine initial order status
            const initialStatus = paymentMethod === 'cod' ? 'confirmed' : 'pending';
            const initialPaymentStatus = 'pending';
            // 9. Create Order record
            const order = await tx.order.create({
                data: {
                    userId,
                    addressId,
                    orderNumber,
                    status: initialStatus,
                    subTotal: Number(subTotal.toFixed(2)),
                    discountAmount: Number(discountAmount.toFixed(2)),
                    taxAmount: Number(totalTaxAmount.toFixed(2)),
                    deliveryCharge,
                    total,
                    paymentMethod,
                    paymentStatus: initialPaymentStatus,
                    prescriptionId: requiresPrescription ? prescriptionId : null,
                    couponId,
                    deliverySlotId,
                    notes,
                },
            });
            // 10. Save Order Items
            for (const item of itemDetails) {
                await tx.orderItem.create({
                    data: {
                        orderId: order.id,
                        ...item,
                    },
                });
            }
            // 11. Create Status History entry
            await tx.orderStatusHistory.create({
                data: {
                    orderId: order.id,
                    fromStatus: 'pending',
                    toStatus: initialStatus,
                    changedBy: userId,
                    comment: `Order placed via ${paymentMethod.toUpperCase()}`,
                },
            });
            // 12. Create Payment log
            const payment = await tx.payment.create({
                data: {
                    orderId: order.id,
                    amount: total,
                    method: paymentMethod,
                    status: 'pending',
                },
            });
            // 13. Deduct inventory quantities
            for (const ded of inventoryDeductions) {
                await tx.inventory.update({
                    where: { id: ded.inventoryId },
                    data: {
                        quantity: { decrement: ded.quantityToDeduct },
                    },
                });
            }
            // 14. Increment delivery slot booking counts
            await tx.deliverySlot.update({
                where: { id: deliverySlotId },
                data: {
                    currentOrders: { increment: 1 },
                },
            });
            // 15. If coupon used, record usage
            if (couponId) {
                await tx.couponUsage.create({
                    data: {
                        couponId,
                        userId,
                        orderId: order.id,
                    },
                });
            }
            // 16. Empty the shopping cart
            await tx.cartItem.deleteMany({
                where: { cartId: cart.id },
            });
            // 17. Handle Mock Online Payment Gateway Integration
            let paymentDetails = null;
            if (paymentMethod !== 'cod') {
                const razorpayOrderId = `order_rzp_${Math.random().toString(36).substring(2, 12)}`;
                // Save the stub details to the payment
                await tx.payment.update({
                    where: { id: payment.id },
                    data: {
                        transactionId: razorpayOrderId,
                        gatewayResponse: JSON.stringify({ razorpayOrderId }),
                    },
                });
                paymentDetails = {
                    gateway: 'razorpay',
                    razorpayOrderId,
                    amount: total * 100, // Razorpay works in paise
                    currency: 'INR',
                    keyId: process.env.RAZORPAY_KEY_ID || 'rzp_test_stub',
                };
            }
            return {
                orderId: order.id,
                orderNumber: order.orderNumber,
                total,
                paymentDetails,
            };
        });
    }
}
exports.OrdersService = OrdersService;
