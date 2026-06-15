"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoriesService = void 0;
// src/modules/categories/categories.service.ts
const db_1 = require("../../config/db");
class CategoriesService {
    static async getCategoryTree(productType) {
        const whereClause = { isActive: true };
        if (productType) {
            whereClause.productType = productType;
        }
        const categories = await db_1.prisma.category.findMany({
            where: whereClause,
            orderBy: { sortOrder: 'asc' },
        });
        // Build hierarchical tree
        const categoryMap = new Map();
        // Initialize map
        categories.forEach((cat) => {
            categoryMap.set(cat.id, {
                id: cat.id,
                name: cat.name,
                slug: cat.slug,
                parentId: cat.parentId,
                image: cat.image,
                taxRate: cat.taxRate,
                productType: cat.productType,
                isActive: cat.isActive,
                sortOrder: cat.sortOrder,
                children: [],
            });
        });
        const rootNodes = [];
        categoryMap.forEach((node) => {
            if (node.parentId) {
                const parent = categoryMap.get(node.parentId);
                if (parent) {
                    parent.children.push(node);
                }
                else {
                    // If parent is not active or filtered out, we treat it as root
                    rootNodes.push(node);
                }
            }
            else {
                rootNodes.push(node);
            }
        });
        return rootNodes;
    }
}
exports.CategoriesService = CategoriesService;
