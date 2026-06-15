"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeliveryService = void 0;
// src/modules/delivery/delivery.service.ts
const db_1 = require("../../config/db");
class DeliveryService {
    static async getDeliverySlotsForPincode(pincode) {
        // 1. Fetch warehouse servicing this pincode
        const serviceability = await db_1.prisma.pincodeServiceability.findFirst({
            where: { pincode, isActive: true },
        });
        if (!serviceability) {
            return []; // Pincode not serviceable
        }
        // 2. Fetch delivery slots for this warehouse
        const slots = await db_1.prisma.deliverySlot.findMany({
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
            let pins = slot.pincodes;
            if (typeof pins === 'string') {
                try {
                    pins = JSON.parse(pins);
                }
                catch {
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
exports.DeliveryService = DeliveryService;
