// src/modules/products/products.routes.ts
import { Router } from 'express';
import { ProductsController } from './products.controller';
import { validate } from '../../middleware/validate';
import { listProductsSchema, productSlugSchema } from './products.validation';

const router = Router();

router.get('/', validate(listProductsSchema), ProductsController.listProducts);
router.get('/:slug', validate(productSlugSchema), ProductsController.getProductBySlug);

export default router;
