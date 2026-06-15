"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductsService = void 0;
// src/modules/products/products.service.ts
const db_1 = require("../../config/db");
class ProductsService {
    static async listProducts(filters) {
        const { category, pincode, prescription, perishable, search, priceMin, priceMax, sort, page, limit, } = filters;
        const skip = (page - 1) * limit;
        const where = { isActive: true };
        // 1. Pincode & Warehouse Inventory Filter
        let warehouseId = null;
        if (pincode) {
            const serviceability = await db_1.prisma.pincodeServiceability.findFirst({
                where: { pincode, isActive: true },
            });
            if (!serviceability) {
                // Pincode not serviceable -> return no products
                return { products: [], total: 0, page, limit, warehouseId: null };
            }
            warehouseId = serviceability.warehouseId;
            where.variants = {
                some: {
                    inventories: {
                        some: {
                            warehouseId: warehouseId,
                            quantity: { gt: 0 },
                        },
                    },
                },
            };
        }
        // 2. Category Filter
        if (category) {
            // Check if it's a UUID category ID or category slug
            const cat = await db_1.prisma.category.findFirst({
                where: {
                    OR: [{ id: category }, { slug: category }],
                },
            });
            if (cat) {
                where.categoryId = cat.id;
            }
        }
        // 3. Prescription Required Filter
        if (prescription !== undefined) {
            where.requiresPrescription = prescription;
        }
        // 4. Perishable Filter
        if (perishable !== undefined) {
            where.isPerishable = perishable;
        }
        // 5. Price Filters
        if (priceMin !== undefined || priceMax !== undefined) {
            where.sellingPrice = {};
            if (priceMin !== undefined) {
                where.sellingPrice.gte = priceMin;
            }
            if (priceMax !== undefined) {
                where.sellingPrice.lte = priceMax;
            }
        }
        // 6. Text Search Filter
        if (search) {
            where.OR = [
                { name: { contains: search, mode: 'insensitive' } },
                { brand: { contains: search, mode: 'insensitive' } },
                { description: { contains: search, mode: 'insensitive' } },
            ];
        }
        // 7. Sort Configuration
        let orderBy = {};
        if (sort === 'priceAsc') {
            orderBy = { sellingPrice: 'asc' };
        }
        else if (sort === 'priceDesc') {
            orderBy = { sellingPrice: 'desc' };
        }
        else if (sort === 'name') {
            orderBy = { name: 'asc' };
        }
        else {
            orderBy = { createdAt: 'desc' }; // default newest
        }
        // 8. Execute Queries
        const [products, total] = await Promise.all([
            db_1.prisma.product.findMany({
                where,
                include: {
                    category: true,
                    variants: {
                        include: {
                            // If warehouse is selected, optionally fetch inventory for that warehouse
                            inventories: warehouseId
                                ? { where: { warehouseId } }
                                : true,
                        },
                    },
                },
                orderBy,
                skip,
                take: limit,
            }),
            db_1.prisma.product.count({ where }),
        ]);
        return {
            products: products.map((p) => {
                let imageUrls = [];
                if (typeof p.imageUrls === 'string') {
                    try {
                        imageUrls = JSON.parse(p.imageUrls);
                    }
                    catch {
                        imageUrls = [];
                    }
                }
                return {
                    ...p,
                    imageUrls,
                };
            }),
            total,
            page,
            limit,
            warehouseId,
        };
    }
    static async getProductBySlug(slug, pincode) {
        let warehouseId = null;
        if (pincode) {
            const serviceability = await db_1.prisma.pincodeServiceability.findFirst({
                where: { pincode, isActive: true },
            });
            if (serviceability) {
                warehouseId = serviceability.warehouseId;
            }
        }
        const product = await db_1.prisma.product.findFirst({
            where: { slug, isActive: true },
            include: {
                category: true,
                variants: {
                    include: {
                        inventories: warehouseId ? { where: { warehouseId } } : true,
                    },
                },
                reviews: {
                    where: { isApproved: true },
                    include: {
                        user: {
                            select: {
                                id: true,
                                name: true,
                            },
                        },
                    },
                    orderBy: { createdAt: 'desc' },
                },
            },
        });
        if (!product) {
            throw new Error('Product not found');
        }
        let imageUrls = [];
        if (product && typeof product.imageUrls === 'string') {
            try {
                imageUrls = JSON.parse(product.imageUrls);
            }
            catch {
                imageUrls = [];
            }
        }
        return {
            product: {
                ...product,
                imageUrls,
            },
            warehouseId,
        };
    }
}
exports.ProductsService = ProductsService;
