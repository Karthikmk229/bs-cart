// src/utils/order.ts
import { prisma } from '../config/db';

export async function generateOrderNumber(): Promise<string> {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const dateString = `${year}${month}${day}`; // YYYYMMDD

  const startOfDay = new Date(year, now.getMonth(), now.getDate(), 0, 0, 0);
  const endOfDay = new Date(year, now.getMonth(), now.getDate(), 23, 59, 59, 999);

  // Count orders for today
  const orderCount = await prisma.order.count({
    where: {
      createdAt: {
        gte: startOfDay,
        lte: endOfDay,
      },
    },
  });

  const sequentialNum = String(orderCount + 1).padStart(4, '0');
  return `TN-${dateString}-${sequentialNum}`;
}
