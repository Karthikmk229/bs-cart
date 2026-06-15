// src/modules/admin/admin.service.ts
import { prisma } from '../../config/db';

export class AdminService {
  // --- Products Admin ---
  static async createProduct(adminId: string, data: any) {
    const { ...productData } = data;
    
    // Create product and a default variant automatically
    return prisma.$transaction(async (tx) => {
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

  static async updateProduct(id: string, data: any) {
    return prisma.product.update({
      where: { id },
      data,
    });
  }

  static async deleteProduct(id: string) {
    return prisma.product.update({
      where: { id },
      data: { isActive: false },
    });
  }

  // --- Inventory Admin ---
  static async createInventory(data: any) {
    return prisma.inventory.create({
      data,
    });
  }

  static async updateInventory(id: string, quantity: number, expiryDate?: Date) {
    const updateData: any = { quantity };
    if (expiryDate) {
      updateData.expiryDate = expiryDate;
    }
    return prisma.inventory.update({
      where: { id },
      data: updateData,
    });
  }

  // --- Coupons Admin ---
  static async createCoupon(data: any) {
    return prisma.coupon.create({
      data,
    });
  }

  static async toggleCoupon(id: string, isActive: boolean) {
    return prisma.coupon.update({
      where: { id },
      data: { isActive },
    });
  }

  // --- Prescriptions Admin ---
  static async listAllPrescriptions() {
    return prisma.prescription.findMany({
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

  static async reviewPrescription(adminId: string, id: string, status: 'approved' | 'rejected', adminRemarks?: string) {
    return prisma.prescription.update({
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
    return prisma.order.findMany({
      include: {
        user: { select: { name: true, phone: true } },
        address: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  static async updateOrderStatus(adminId: string, orderId: string, status: any, comment?: string) {
    return prisma.$transaction(async (tx) => {
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
      prisma.user.count({ where: { role: 'customer' } }),
      prisma.order.count(),
      prisma.product.count(),
      prisma.prescription.count({ where: { status: 'pending' } }),
    ]);

    const revenueResult = await prisma.order.aggregate({
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
