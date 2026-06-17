import { Router } from 'express';
import productRoutes from './product.route';

const router: Router = Router();

router.get('/health', (_req, res) => {
  res.json({ success: true, message: 'ok', timestamp: new Date().toISOString() });
});

// group routing: /api/v1/products
router.use('/products', productRoutes);

export default router;
