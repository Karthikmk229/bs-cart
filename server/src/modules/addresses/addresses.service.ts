// src/modules/addresses/addresses.service.ts
import { prisma } from '../../config/db';
import { isValidTamilNaduPincode } from '../../utils/pincode';

export class AddressesService {
  static async listUserAddresses(userId: string) {
    return prisma.address.findMany({
      where: { userId },
      orderBy: { isDefault: 'desc' },
    });
  }

  static async getAddressById(userId: string, id: string) {
    const address = await prisma.address.findFirst({
      where: { id, userId },
    });
    if (!address) {
      throw new Error('Address not found');
    }
    return address;
  }

  static async createAddress(userId: string, data: any) {
    // 1. Verify standard Tamil Nadu pincode structure
    if (!isValidTamilNaduPincode(data.pincode)) {
      throw new Error('Address pincode is not within Tamil Nadu state zones (600xxx - 649xxx)');
    }

    // 2. Validate pincode serviceability in DB
    const serviceability = await prisma.pincodeServiceability.findFirst({
      where: { pincode: data.pincode, isActive: true },
    });
    if (!serviceability) {
      throw new Error(`Pincode ${data.pincode} is currently not serviceable`);
    }

    // 3. Handle default address logic
    if (data.isDefault) {
      await prisma.address.updateMany({
        where: { userId, isDefault: true },
        data: { isDefault: false },
      });
    }

    return prisma.address.create({
      data: {
        ...data,
        userId,
      },
    });
  }

  static async updateAddress(userId: string, id: string, data: any) {
    const existingAddress = await prisma.address.findFirst({
      where: { id, userId },
    });
    if (!existingAddress) {
      throw new Error('Address not found');
    }

    // If pincode is changing, check serviceability
    if (data.pincode && data.pincode !== existingAddress.pincode) {
      if (!isValidTamilNaduPincode(data.pincode)) {
        throw new Error('Address pincode is not within Tamil Nadu state zones (600xxx - 649xxx)');
      }

      const serviceability = await prisma.pincodeServiceability.findFirst({
        where: { pincode: data.pincode, isActive: true },
      });
      if (!serviceability) {
        throw new Error(`Pincode ${data.pincode} is currently not serviceable`);
      }
    }

    // If setting to default
    if (data.isDefault) {
      await prisma.address.updateMany({
        where: { userId, isDefault: true },
        data: { isDefault: false },
      });
    }

    return prisma.address.update({
      where: { id },
      data,
    });
  }

  static async deleteAddress(userId: string, id: string) {
    const existingAddress = await prisma.address.findFirst({
      where: { id, userId },
    });
    if (!existingAddress) {
      throw new Error('Address not found');
    }

    return prisma.address.delete({
      where: { id },
    });
  }
}
