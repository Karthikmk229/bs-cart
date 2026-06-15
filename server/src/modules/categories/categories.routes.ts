// src/modules/categories/categories.routes.ts
import { Router } from 'express';
import { CategoriesController } from './categories.controller';
import { validate } from '../../middleware/validate';
import { getCategoriesSchema } from './categories.validation';

const router = Router();

router.get('/', validate(getCategoriesSchema), CategoriesController.getCategoryTree);

export default router;
