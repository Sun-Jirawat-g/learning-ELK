import { Router } from 'express';
import { productController } from '../controllers/product.controller';
import { validate } from '../middlewares/validate.middleware';
import { createProductSchema, updateProductSchema } from '../types/product.type';

const router: Router = Router();

router.get('/', productController.list);
router.get('/:id', productController.getById);
router.post('/', validate(createProductSchema), productController.create);
router.put('/:id', validate(updateProductSchema), productController.update);
router.delete('/:id', productController.remove);

export default router;
