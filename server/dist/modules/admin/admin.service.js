"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminService = void 0;
// src/modules/admin/admin.service.ts
const db_1 = require("../../config/db");
class AdminService {
    // --- Products Admin ---
    static async createProduct(adminId, data) {
        const { ...productData } = data;
        // Create product and a default variant automatically
        return db_1.prisma.$transaction(async (tx) => {
            const product = await tx.product.create({
                data: {
                    ...productData,
                    createdBy: adminId,
                },
            });
            // Automatically create a default variant for convenience
            await tx.productVariant.create({
                data: {
                    productId: product.id,
                    sku: `SKU-${product.slug.toUpperCase()}-${Date.now().toString().slice(-4)}`,
                    size: product.unit,
                    isDefault: true,
                },
            });
            return product;
        });
    }
    static async updateProduct(id, data) {
        return db_1.prisma.product.update({
            where: { id },
            data,
        });
    }
    static async deleteProduct(id) {
        return db_1.prisma.product.update({
            where: { id },
            data: { isActive: false },
        });
    }
    // --- Inventory Admin ---
    static async createInventory(data) {
        return db_1.prisma.inventory.create({
            data,
        });
    }
    static async updateInventory(id, quantity, expiryDate) {
        const updateData = { quantity };
        if (expiryDate) {
            updateData.expiryDate = expiryDate;
        }
        return db_1.prisma.inventory.update({
            where: { id },
            data: updateData,
        });
    }
    // --- Coupons Admin ---
    static async createCoupon(data) {
        return db_1.prisma.coupon.create({
            data,
        });
    }
    static async toggleCoupon(id, isActive) {
        return db_1.prisma.coupon.update({
            where: { id },
            data: { isActive },
        });
    }
    // --- Prescriptions Admin ---
    static async listAllPrescriptions() {
        return db_1.prisma.prescription.findMany({
            include: {
                user: {
                    select: {
                        name: true,
                        phone: true,
                    },
                },
            },
            orderBy: { uploadedAt: 'desc' },
        });
    }
    static async reviewPrescription(adminId, id, status, adminRemarks) {
        return db_1.prisma.prescription.update({
            where: { id },
            data: {
                status,
                adminRemarks,
                reviewedBy: adminId,
                reviewedAt: new Date(),
            },
        });
    }
    // --- Orders Admin ---
    static async listAllOrders() {
        return db_1.prisma.order.findMany({
            include: {
                user: { select: { name: true, phone: true } },
                address: true,
            },
            orderBy: { createdAt: 'desc' },
        });
    }
    static async updateOrderStatus(adminId, orderId, status, comment) {
        return db_1.prisma.$transaction(async (tx) => {
            const order = await tx.order.findUnique({
                where: { id: orderId },
            });
            if (!order) {
                throw new Error('Order not found');
            }
            const updatedOrder = await tx.order.update({
                where: { id: orderId },
                data: {
                    status,
                    // If order is delivered, update payment status for COD orders
                    paymentStatus: status === 'delivered' && order.paymentMethod === 'cod' ? 'success' : order.paymentStatus,
                },
            });
            // Write history
            await tx.orderStatusHistory.create({
                data: {
                    orderId,
                    fromStatus: order.status,
                    toStatus: status,
                    changedBy: adminId,
                    comment: comment || `Order status updated to ${status}`,
                },
            });
            return updatedOrder;
        });
    }
    static async getStats() {
        const [userCount, orderCount, productCount, pendingPrescriptions] = await Promise.all([
            db_1.prisma.user.count({ where: { role: 'customer' } }),
            db_1.prisma.order.count(),
            db_1.prisma.product.count(),
            db_1.prisma.prescription.count({ where: { status: 'pending' } }),
        ]);
        const revenueResult = await db_1.prisma.order.aggregate({
            where: { paymentStatus: 'success' },
            _sum: { total: true },
        });
        return {
            userCount,
            orderCount,
            productCount,
            pendingPrescriptions,
            totalRevenue: revenueResult._sum.total || 0,
        };
    }
}
exports.AdminService = AdminService;
