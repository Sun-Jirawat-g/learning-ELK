# ELK Stack Learning Checklist — Beginner Level

## 1. ทำความเข้าใจ ELK Stack คืออะไร

- [ ] เข้าใจภาพรวมว่า ELK = **E**lasticsearch + **L**ogstash + **K**ibana
- [ ] เข้าใจ flow ของข้อมูล: Collect → Process → Store → Visualize
- [ ] รู้ว่าทำไมองค์กรถึงใช้ ELK (centralized logging, search, observability)

### Elasticsearch (E)

- [ ] เข้าใจว่าเป็น search & analytics engine ที่เก็บข้อมูลแบบ document (JSON)
- [ ] เข้าใจคำศัพท์: Index, Document, Shard, Replica, Mapping
- [ ] รู้ว่าเหมาะกับ: full-text search, log storage, aggregation
- [ ] เข้าใจความต่างจาก RDBMS (schema-less, inverted index)

### Logstash (L)

- [ ] เข้าใจว่าเป็น data processing pipeline (ingest → transform → output)
- [ ] เข้าใจ 3 ส่วนของ config: `input`, `filter`, `output`
- [ ] รู้ว่าเหมาะกับ: การ parse/แปลง log ที่ซับซ้อน (grok, mutate)
- [ ] เข้าใจว่ากิน resource มาก (JVM-based)

### Kibana (K)

- [ ] เข้าใจว่าเป็น UI สำหรับ visualize และ query ข้อมูลใน Elasticsearch
- [ ] สร้าง Index Pattern / Data View เป็น
- [ ] ใช้ Discover เพื่อ search log ได้
- [ ] สร้าง Dashboard และ Visualization พื้นฐานได้

### Beats / Filebeat

- [ ] เข้าใจว่า Beats เป็น lightweight data shipper
- [ ] เข้าใจว่า **Filebeat** ใช้ส่ง log files โดยเฉพาะ
- [ ] รู้จัก Beats ตัวอื่น: Metricbeat, Packetbeat, Heartbeat
- [ ] เข้าใจว่าทำไม Filebeat เบากว่า Logstash (Go-based, low footprint)

### Fluentd / Fluent Bit

- [ ] เข้าใจว่า Fluentd/Fluent Bit เป็น log collector (ทางเลือกแทน Logstash/Beats)
- [ ] เข้าใจว่า **Fluent Bit** เบากว่า เหมาะกับ container/Kubernetes
- [ ] เข้าใจว่า **Fluentd** มี plugin เยอะ เหมาะ aggregation layer
- [ ] เปรียบเทียบได้ว่าควรเลือกตัวไหนในแต่ละ use case

---

## 2. เลือกเครื่องมือให้เหมาะกับงาน (Purpose Matrix)

- [ ] เข้าใจว่า **Filebeat/Fluent Bit** = collect & ship (เบา, อยู่ที่ edge/host)
- [ ] เข้าใจว่า **Logstash/Fluentd** = heavy processing & routing (อยู่ตรงกลาง)
- [ ] เข้าใจว่า **Elasticsearch** = store & search
- [ ] เข้าใจว่า **Kibana** = visualize
- [ ] เลือก architecture ได้: `Filebeat → Elasticsearch` (เรียบง่าย) vs `Filebeat → Logstash → Elasticsearch` (ต้อง transform)

---

## 3. การติดตั้ง / Init แต่ละตัว (Hands-on)

- [ ] ติดตั้ง ELK ด้วย **Docker Compose** (วิธีที่แนะนำสำหรับเริ่มต้น)
- [ ] Init Elasticsearch: ตั้ง `cluster.name`, `discovery.type=single-node`, เปิด security
- [ ] ทดสอบ Elasticsearch: `curl http://localhost:9200`
- [ ] Init Kibana: เชื่อมต่อกับ Elasticsearch ผ่าน `ELASTICSEARCH_HOSTS`
- [ ] Init Filebeat: แก้ `filebeat.yml` (paths, output.elasticsearch)
- [ ] รันคำสั่ง `filebeat setup` เพื่อสร้าง index template + dashboards
- [ ] Init Logstash: สร้าง `pipeline.conf` (input/filter/output) แล้วทดสอบด้วย `--config.test_and_exit`
- [ ] ยืนยันว่า log ไหลเข้า Kibana Discover ได้ end-to-end

---

## 4. Best Practices ในการใช้งาน

- [ ] เปิดใช้ **security** (authentication, TLS) ตั้งแต่ต้น อย่ารัน production แบบ open
- [ ] ใช้ **Index Lifecycle Management (ILM)** เพื่อจัดการ rollover/delete log เก่า
- [ ] ตั้ง **mapping** ให้เหมาะสม (อย่าใช้ dynamic mapping มั่วๆ จนเกิด mapping explosion)
- [ ] ใช้ **Ingest Pipelines** ของ Elasticsearch เมื่องาน parse ไม่ซับซ้อน (ไม่ต้องตั้ง Logstash)
- [ ] ตั้ง **index naming convention** เช่น `logs-app-YYYY.MM.dd`
- [ ] กำหนด **shard/replica** ให้เหมาะ (shard ไม่เล็กไม่ใหญ่เกิน, replica ≥ 1 ใน production)
- [ ] อย่าเก็บ field ที่ไม่ค้นหาเป็น `keyword`/`text` โดยไม่จำเป็น (ประหยัด storage)
- [ ] Monitor cluster health (`green`/`yellow`/`red`) สม่ำเสมอ

---

## 5. All About Logging (พื้นฐาน Logging ที่ควรรู้)

- [ ] เข้าใจ log levels: `DEBUG`, `INFO`, `WARN`, `ERROR`, `FATAL`
- [ ] ใช้ **Structured Logging (JSON)** แทน plain text เพื่อให้ parse ง่าย
- [ ] ใส่ **correlation ID / trace ID** ในทุก log เพื่อตามรอย request ข้าม service
- [ ] เข้าใจ **ECS (Elastic Common Schema)** เพื่อให้ field names เป็นมาตรฐาน
- [ ] อย่า log ข้อมูลอ่อนไหว (password, token, PII)
- [ ] ใช้ timestamp แบบ UTC/ISO 8601 เสมอ

---

## 6. Next Level — ใช้ ELK เป็น Replica DB สำหรับ Search ใน Microservices

- [ ] เข้าใจ pattern: ใช้ Elasticsearch เป็น **read-optimized replica** ของ primary DB (เช่น PostgreSQL/MySQL)
- [ ] เข้าใจว่าทำไมไม่ query search ตรงจาก RDBMS (full-text search ช้า/จำกัด)
- [ ] เรียนรู้ **CQRS pattern** (แยก write ไปที่ DB, read ไปที่ Elasticsearch)
- [ ] เรียนรู้วิธี sync ข้อมูล:
  - [ ] **Change Data Capture (CDC)** ด้วย Debezium + Kafka
  - [ ] **Dual-write** (เขียนทั้ง DB และ ES — ระวัง consistency)
  - [ ] **Logstash JDBC input** (polling แบบง่าย เหมาะ data ไม่ real-time มาก)
- [ ] เข้าใจปัญหา **eventual consistency** และยอมรับ trade-off
- [ ] ออกแบบ **index ต่อ search domain** (เช่น `products`, `orders`) ตาม service ownership
- [ ] ทำ **reindex strategy** เมื่อ mapping เปลี่ยน (alias + zero-downtime reindex)
- [ ] เข้าใจการทำ relevance tuning (boosting, analyzers, synonyms) สำหรับ search จริง
- [ ] เพิ่ม monitoring ของ sync lag ระหว่าง DB กับ Elasticsearch

---
