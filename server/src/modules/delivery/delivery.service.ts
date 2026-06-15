// src/modules/delivery/delivery.service.ts
import { prisma } from '../../config/db';

export class DeliveryService {
  static async getDeliverySlotsForPincode(pincode: string) {
    // 1. Fetch warehouse servicing this pincode
    const serviceability = await prisma.pincodeServiceability.findFirst({
      where: { pincode, isActive: true },
    });

    if (!serviceability) {
      return []; // Pincode not serviceable
    }

    // 2. Fetch delivery slots for this warehouse
    const slots = await prisma.deliverySlot.findMany({
      where: {
        warehouseId: serviceability.warehouseId,
        isActive: true,
        deliveryDate: { gte: new Date(new Date().setHours(0, 0, 0, 0)) },
      },
      orderBy: [
        { deliveryDate: 'asc' },
        { startTime: 'asc' },
      ],
    });

    // 3. Filter by checking pincodes JSON array (e.g. ["600001", "600002"])
    return slots.filter((slot) => {
      let pins = slot.pincodes as any;
      if (typeof pins === 'string') {
        try {
          pins = JSON.parse(pins);
        } catch {
          pins = [];
        }
      }
      if (Array.isArray(pins)) {
        return pins.includes(pincode) && slot.currentOrders < slot.maxOrders;
      }
      return false;
    });
  }
}
