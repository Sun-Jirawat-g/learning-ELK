import { prisma } from '../config/db';
import { CreateProductInput, UpdateProductInput } from '../types/product.type';

export const productService = {
  list: (skip = 0, take = 20) =>
    prisma.product.findMany({
      skip,
      take,
      orderBy: { createdAt: 'desc' },
    }),

  count: () => prisma.product.count(),

  getById: (id: string) => prisma.product.findUnique({ where: { id } }),

  create: (input: CreateProductInput) =>
    prisma.product.create({
      data: {
        name: input.name,
        description: input.description,
        price: input.price,
        stock: input.stock ?? 0,
      },
    }),

  update: (id: string, input: UpdateProductInput) =>
    prisma.product.update({
      where: { id },
      data: input,
    }),

  remove: (id: string) => prisma.product.delete({ where: { id } }),
};
