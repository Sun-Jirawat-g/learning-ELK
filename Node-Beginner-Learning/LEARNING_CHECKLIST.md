🌉 Front-to-Back: Node.js (TS) API Learning Checklist
Phase 1: The Backend Sandbox (ทำความเข้าใจสภาพแวดล้อม)
เป้าหมาย: ตั้งค่าโปรเจกต์ Node.js ด้วย TypeScript และทำความเข้าใจ Request Lifecycle ว่าฝั่ง Backend รับสิ่งที่ Front-end ส่งมาอย่างไร

A. Project Setup & TypeScript Config
[ ] ตั้งค่าโปรเจกต์ด้วย npm init และติดตั้ง TypeScript (tsc --init)

[ ] ทำความเข้าใจความแตกต่างของ tsconfig.json ฝั่ง Node.js เทียบกับ React/Next.js (เช่น การตั้ง target, module, outDir)

[ ] ตั้งค่า Hot-reload ด้วย nodemon + ts-node หรือ tsx เพื่อให้รันโค้ดได้ทันที

B. Router & Request Parsing (รับของจาก Front-end)
[ ] สร้าง HTTP Server พื้นฐานด้วย Express.js หรือ Fastify

[ ] เรียนรู้วิธีการดึงข้อมูลจาก req.params (Path variables เช่น /users/:id)

[ ] เรียนรู้วิธีการดึงข้อมูลจาก req.query (Query string เช่น ?search=xx&page=1)

[ ] เรียนรู้วิธีการดึงข้อมูลจาก req.body (JSON Payload) และทำไมต้องใช้ Body Parser Middleware

C. Validation & Error Handling (การปฏิเสธ Front-end อย่างมีศิลปะ)
[ ] ใช้ Library อย่าง Zod ในการ Validate req.body ว่าตรงตาม Type ที่กำหนดหรือไม่

[ ] สร้าง Global Error Handler เพื่อพ่น Error กลับไปหา Front-end

[ ] Core Concept: ทำความเข้าใจ HTTP Status Codes อย่างถ่องแท้:

ทำไม Validation Error ต้องเป็น 400 Bad Request (พร้อมส่ง Field ที่ผิดกลับไปให้ Front-end โชว์สีแดง)

ความแตกต่างระหว่าง 401 Unauthorized (ไม่มี Token) และ 403 Forbidden (มี Token แต่สิทธิ์ไม่ถึง)

ทำไมแอปพังถึงเป็น 500 Internal Server Error

Phase 2: Database & Data Modeling (โลกของข้อมูลที่แท้จริง)
เป้าหมาย: ลบภาพจำที่ว่า "ข้อมูลเป็นแค่ JSON ก้อนเดียว" และเรียนรู้ว่าข้อมูลถูกเก็บจริงใน Relational Database อย่างไร (นี่คือส่วนสำคัญที่สุดที่จะช่วยปรับปรุง API Spec)

D. Relational Database Concepts (PostgreSQL)
[ ] ทำความเข้าใจคอนเซปต์ของ Table, Column, Row และ Data Types

[ ] เรียนรู้ความสำคัญของ Primary Key (PK) ว่าทำไมทุก Record ต้องมี ID

[ ] เรียนรู้การทำความสัมพันธ์ด้วย Foreign Key (FK):

One-to-Many (เช่น 1 User มีหลาย Posts)

Many-to-Many (เช่น Post มีหลาย Tags และ Tag อยู่ในหลาย Posts - ต้องเข้าใจว่าใน DB มันต้องมีตารางตรงกลาง (Join Table))

E. Prisma ORM (สะพานเชื่อม TS กับ Database)
[ ] เขียน schema.prisma เพื่อกำหนด โครงสร้างตาราง (Models)

[ ] ทดลองรันคำสั่ง Migration (prisma migrate dev) เพื่อสร้างตารางจริงใน Database

[ ] ลองใช้ Prisma Studio เพื่อดูหน้าตาข้อมูลดิบๆ ในตาราง

F. Data Fetching & The "N+1 Problem" (ทำไม API ถึงช้า)
[ ] เขียนโค้ดดึงข้อมูล (SELECT) แบบปกติ

[ ] เขียนโค้ดดึงข้อมูลแบบ Join (ใน Prisma คือการใช้ include)

[ ] Core Concept: ทำความเข้าใจว่า การให้ Backend ส่ง JSON ซ้อนกันลึกๆ (เช่น User -> Posts -> Comments -> Author) ทำให้ฝั่ง DB ต้องทำงานหนักแค่ไหน และทำไมบางครั้งการแยก API (Lazy Load) ถึงดีกว่าการขอยัดมาใน Endpoint เดียว

Phase 3: Advanced API Design (สร้าง API Spec ที่ดี)
เป้าหมาย: เข้าใจข้อจำกัดของการส่งข้อมูล และออกแบบ API ที่ทำงานได้จริงในสเกลใหญ่

G. Pagination & Filtering (การหั่นข้อมูล)
[ ] ทำความเข้าใจว่าทำไม SELECT \* รวดเดียว 10,000 แถวถึงทำให้ทั้ง Backend และ Front-end ค้าง

[ ] ทดลองเขียน API แบบ Offset Pagination (รับ page และ limit จาก Front-end ไปแปลงเป็น SKIP และ TAKE ใน DB)

[ ] ลองเขียนตัวกรองข้อมูล (Filter) โดยรับค่าจาก Query String แล้วนำไปสร้างเงื่อนไข WHERE ใน DB

H. Data Transfer Objects (DTO) (แปลงร่างก่อนส่ง)
[ ] Core Concept: เรียนรู้ว่า ข้อมูลใน Database ไม่จำเป็นต้องหน้าตาเหมือน JSON ที่ส่งให้ Front-end

[ ] ทดลองเขียน Mapper Function เพื่อตัดข้อมูลที่ไม่จำเป็นออกก่อนส่ง res.json() (เช่น ลบ Password Hash ออกจาก User Object หรือแปลงชื่อ Field จาก created_at เป็น createdAt แบบ CamelCase ให้ Front-end ใช้ง่ายๆ)

🎯 The "Empathy" Challenge (โจทย์จบหลักสูตร)
ให้น้องๆ Front-end สร้างโปรเจกต์ "E-Commerce Product Catalog API" ด้วย Node.js + Prisma โดยมีข้อกำหนดที่บังคับให้ต้องคิดแบบ Backend ดังนี้:

Database Design: ต้องมีตาราง Product, Category (1 Product มี 1 Category) และ Tag (Many-to-Many กับ Product)

List API (GET /products):

ต้องรับ Query parameters: ?page=1&limit=10&search=iphone&categoryId=2

ต้อง Response กลับมาเป็นโครงสร้างที่มี Metadata เสมอ เพื่อให้ Front-end เอาไปทำ Paging ต่อได้ง่ายๆ เช่น:

```
JSON
{
  "data": [...],
  "meta": { "totalItems": 45, "currentPage": 1, "totalPages": 5 }
}
```

Create API (POST /products):

ต้อง Validate Request Body ถ้าส่ง Type ผิด หรือข้อมูลไม่ครบ (เช่น ราคาติดลบ) ต้องพ่น 400 Bad Request พร้อมบอกชื่อ Field ที่ผิดกลับไป

Transaction (Optional แต่แนะนำ):

ทดลอง Insert ข้อมูลลง 2 ตารางพร้อมกัน (เช่น สร้าง Product ใหม่พร้อมแนบ Tags ใหม่) ถ้าตารางใดตารางหนึ่ง Insert พัง ต้อง Rollback ข้อมูลกลับทั้งหมด ไม่ให้เกิดข้อมูลขยะค้างในระบบ
