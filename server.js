import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import pkg from "pg";

const { Pool } = pkg;

const app = express();
app.use(cors());
app.use(bodyParser.json());

// ✅ ใช้ Environment Variable จาก Render
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

// สร้างตารางถ้ายังไม่มี
const createTable = async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS attendance (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      status TEXT NOT NULL,
      time TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);
};
createTable();

// 📌 API เช็คชื่อ
app.post("/checkin", async (req, res) => {
  const { name, status } = req.body;
  try {
    await pool.query("INSERT INTO attendance (name, status) VALUES ($1, $2)", [name, status]);
    res.json({ message: "บันทึกสำเร็จ ✅" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "❌ เกิดข้อผิดพลาด" });
  }
});

// 📌 API รายงาน
app.get("/report", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM attendance ORDER BY time DESC");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "❌ โหลดรายงานไม่ได้" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Server running on ${PORT}`));
