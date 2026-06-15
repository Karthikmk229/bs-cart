// src/modules/categories/categories.service.ts
import { prisma } from '../../config/db';

export interface CategoryNode {
  id: string;
  name: string;
  slug: string;
  parentId: string | null;
  image: string | null;
  taxRate: number;
  productType: string;
  isActive: boolean;
  sortOrder: number;
  children: CategoryNode[];
}

export class CategoriesService {
  static async getCategoryTree(productType?: 'grocery' | 'medical') {
    const whereClause: any = { isActive: true };
    if (productType) {
      whereClause.productType = productType;
    }

    const categories = await prisma.category.findMany({
      where: whereClause,
      orderBy: { sortOrder: 'asc' },
    });

    // Build hierarchical tree
    const categoryMap = new Map<string, CategoryNode>();
    
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

    const rootNodes: CategoryNode[] = [];

    categoryMap.forEach((node) => {
      if (node.parentId) {
        const parent = categoryMap.get(node.parentId);
        if (parent) {
          parent.children.push(node);
        } else {
          // If parent is not active or filtered out, we treat it as root
          rootNodes.push(node);
        }
      } else {
        rootNodes.push(node);
      }
    });

    return rootNodes;
  }
}
