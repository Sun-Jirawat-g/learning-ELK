import { Request, Response, NextFunction } from 'express';
import { productService } from '../services/product.service';
import { ok, created, noContent } from '../utils/response';
import { HttpError } from '../middlewares/error.middleware';

export const productController = {
  async list(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const page = Math.max(1, Number(req.query.page) || 1);
      const limit = Math.min(100, Number(req.query.limit) || 20);
      const skip = (page - 1) * limit;

      const [items, total] = await Promise.all([
        productService.list(skip, limit),
        productService.count(),
      ]);

      ok(res, {
        items,
        pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
      });
    } catch (err) {
      next(err);
    }
  },

  async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const product = await productService.getById(req.params.id);
      if (!product) throw new HttpError(404, 'product not found');
      ok(res, product);
    } catch (err) {
      next(err);
    }
  },

  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const product = await productService.create(req.body);
      created(res, product);
    } catch (err) {
      next(err);
    }
  },

  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const product = await productService.update(req.params.id, req.body);
      ok(res, product, 'updated');
    } catch (err) {
      next(err);
    }
  },

  async remove(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await productService.remove(req.params.id);
      noContent(res);
    } catch (err) {
      next(err);
    }
  },
};
