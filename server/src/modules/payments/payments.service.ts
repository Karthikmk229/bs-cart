// src/modules/payments/payments.service.ts
import { prisma } from '../../config/db';

export class PaymentsService {
  static async verifyPayment(body: any) {
    const { razorpayOrderId, razorpayPaymentId, status } = body;

    return prisma.$transaction(async (tx) => {
      // Find the payment
      const payment = await tx.payment.findFirst({
        where: { transactionId: razorpayOrderId },
      });
      if (!payment) {
        throw new Error('Payment transaction matching order ID not found');
      }

      const paymentStatus = status === 'success' ? 'success' : 'failed';
      
      // Update payment record
      const updatedPayment = await tx.payment.update({
        where: { id: payment.id },
        data: {
          status: paymentStatus,
          transactionId: razorpayPaymentId, // update with actual payment ID
          gatewayResponse: JSON.stringify({ razorpayOrderId, razorpayPaymentId, status }),
        },
      });

      // Update Order payment status
      const order = await tx.order.findUnique({
        where: { id: payment.orderId },
      });
      if (!order) {
        throw new Error('Associated order not found');
      }

      const orderStatus = status === 'success' ? 'confirmed' : 'pending';
      const orderPaymentStatus = status === 'success' ? 'success' : 'failed';

      await tx.order.update({
        where: { id: order.id },
        data: {
          paymentStatus: orderPaymentStatus,
          status: orderStatus,
        },
      });

      // Add status history entry
      await tx.orderStatusHistory.create({
        data: {
          orderId: order.id,
          fromStatus: order.status,
          toStatus: orderStatus,
          changedBy: order.userId,
          comment: `Razorpay payment verification: ${status.toUpperCase()} (ID: ${razorpayPaymentId})`,
        },
      });

      return {
        paymentId: updatedPayment.id,
        orderId: order.id,
        status: paymentStatus,
      };
    });
  }
}
