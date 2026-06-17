import express from "express";
import { z } from "zod";
import { prisma } from "./prisma";
import { tracingMiddleware } from "./middleware";
import { logger } from "./logger";

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(tracingMiddleware);

const ProductSchema = z.object({
  name: z.string().min(1, "name ห้ามว่าง"),
  price: z.number().positive("price ต้องมากกว่า 0"),
});

app.post("/products", (req, res) => {
  const result = ProductSchema.safeParse(req.body);

  if (!result.success) {
    res.status(400).json({
      error: "Validation failed",
      fields: result.error.flatten().fieldErrors,
    });
    return;
  }

  res.status(201).json({ received: result.data });
});

app.get("/products", async (req, res) => {
  const products = await prisma.product.findMany();
  res.json(products);
});

app.get("/products/full", async (req, res) => {
  const products = await prisma.product.findMany({
    include: {
      category: true,
      tags: { include: { tag: true } },
    },
  });
  res.json(products);
});

app.listen(PORT, () => {
  logger.info({
    type: "startup",
    message: `Server running at http://localhost:${PORT}`,
  });
});
