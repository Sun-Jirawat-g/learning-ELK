import "dotenv/config"; // สำคัญมาก: ช่วยโหลดไฟล์ .env ให้ Prisma CLI มองเห็นใน v7
import { defineConfig, env } from "prisma/config";

export default defineConfig({
  schema: "./prisma/schema.prisma",
  datasource: {
    // ใช้ฟังก์ชัน env() ของ prisma/config ในการดึงค่าแทน process.env
    url: env("DATABASE_URL"), 
  },
});