"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddressesService = void 0;
// src/modules/addresses/addresses.service.ts
const db_1 = require("../../config/db");
const pincode_1 = require("../../utils/pincode");
class AddressesService {
    static async listUserAddresses(userId) {
        return db_1.prisma.address.findMany({
            where: { userId },
            orderBy: { isDefault: 'desc' },
        });
    }
    static async getAddressById(userId, id) {
        const address = await db_1.prisma.address.findFirst({
            where: { id, userId },
        });
        if (!address) {
            throw new Error('Address not found');
        }
        return address;
    }
    static async createAddress(userId, data) {
        // 1. Verify standard Tamil Nadu pincode structure
        if (!(0, pincode_1.isValidTamilNaduPincode)(data.pincode)) {
            throw new Error('Address pincode is not within Tamil Nadu state zones (600xxx - 649xxx)');
        }
        // 2. Validate pincode serviceability in DB
        const serviceability = await db_1.prisma.pincodeServiceability.findFirst({
            where: { pincode: data.pincode, isActive: true },
        });
        if (!serviceability) {
            throw new Error(`Pincode ${data.pincode} is currently not serviceable`);
        }
        // 3. Handle default address logic
        if (data.isDefault) {
            await db_1.prisma.address.updateMany({
                where: { userId, isDefault: true },
                data: { isDefault: false },
            });
        }
        return db_1.prisma.address.create({
            data: {
                ...data,
                userId,
            },
        });
    }
    static async updateAddress(userId, id, data) {
        const existingAddress = await db_1.prisma.address.findFirst({
            where: { id, userId },
        });
        if (!existingAddress) {
            throw new Error('Address not found');
        }
        // If pincode is changing, check serviceability
        if (data.pincode && data.pincode !== existingAddress.pincode) {
            if (!(0, pincode_1.isValidTamilNaduPincode)(data.pincode)) {
                throw new Error('Address pincode is not within Tamil Nadu state zones (600xxx - 649xxx)');
            }
            const serviceability = await db_1.prisma.pincodeServiceability.findFirst({
                where: { pincode: data.pincode, isActive: true },
            });
            if (!serviceability) {
                throw new Error(`Pincode ${data.pincode} is currently not serviceable`);
            }
        }
        // If setting to default
        if (data.isDefault) {
            await db_1.prisma.address.updateMany({
                where: { userId, isDefault: true },
                data: { isDefault: false },
            });
        }
        return db_1.prisma.address.update({
            where: { id },
            data,
        });
    }
    static async deleteAddress(userId, id) {
        const existingAddress = await db_1.prisma.address.findFirst({
            where: { id, userId },
        });
        if (!existingAddress) {
            throw new Error('Address not found');
        }
        return db_1.prisma.address.delete({
            where: { id },
        });
    }
}
exports.AddressesService = AddressesService;
