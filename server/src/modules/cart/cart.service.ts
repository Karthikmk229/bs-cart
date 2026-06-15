// src/modules/cart/cart.service.ts
import { prisma } from '../../config/db';

export class CartService {
  static async getOrCreateCart(userId: string) {
    let cart = await prisma.cart.findUnique({
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
          orderBy: { addedAt: 'asc' },
        },
      },
    });

    if (!cart) {
      cart = await prisma.cart.create({
        data: { userId },
        include: {
          items: {
            include: {
              productVariant: {
                include: {
                  product: true,
                },
              },
            },
            orderBy: { addedAt: 'asc' },
          },
        },
      });
    }

    return cart;
  }

  static async addItemToCart(userId: string, productVariantId: string, quantity: number) {
    const cart = await this.getOrCreateCart(userId);

    // 1. Check if variant exists
    const variant = await prisma.productVariant.findUnique({
      where: { id: productVariantId },
      include: { product: true },
    });
    if (!variant) {
      throw new Error('Product variant not found');
    }
    if (!variant.product.isActive) {
      throw new Error('Product is currently not active');
    }

    // 2. Check aggregate inventory stock in database
    const totalStock = await prisma.inventory.aggregate({
      where: { productVariantId },
      _sum: { quantity: true },
    });
    const stockQuantity = totalStock._sum.quantity || 0;
    if (stockQuantity < quantity) {
      throw new Error(`Insufficient stock. Only ${stockQuantity} units available.`);
    }

    // 3. Add or update item in cart
    const existingItem = cart.items.find((item) => item.productVariantId === productVariantId);
    if (existingItem) {
      const newQuantity = existingItem.quantity + quantity;
      if (stockQuantity < newQuantity) {
        throw new Error(`Insufficient stock. Cannot add. Available stock: ${stockQuantity}`);
      }

      return prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: newQuantity },
      });
    } else {
      return prisma.cartItem.create({
        data: {
          cartId: cart.id,
          productVariantId,
          quantity,
        },
      });
    }
  }

  static async updateCartItem(userId: string, itemId: string, quantity: number) {
    const cartItem = await prisma.cartItem.findFirst({
      where: {
        id: itemId,
        cart: { userId },
      },
      include: {
        productVariant: true,
      },
    });

    if (!cartItem) {
      throw new Error('Cart item not found');
    }

    // Check aggregate stock limit
    const totalStock = await prisma.inventory.aggregate({
      where: { productVariantId: cartItem.productVariantId },
      _sum: { quantity: true },
    });
    const stockQuantity = totalStock._sum.quantity || 0;
    if (stockQuantity < quantity) {
      throw new Error(`Insufficient stock. Only ${stockQuantity} units available.`);
    }

    return prisma.cartItem.update({
      where: { id: itemId },
      data: { quantity },
    });
  }

  static async deleteCartItem(userId: string, itemId: string) {
    const cartItem = await prisma.cartItem.findFirst({
      where: {
        id: itemId,
        cart: { userId },
      },
    });

    if (!cartItem) {
      throw new Error('Cart item not found');
    }

    return prisma.cartItem.delete({
      where: { id: itemId },
    });
  }
}
