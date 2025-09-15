import express from "express";
import bodyParser from "body-parser";
import cors from "cors";

const app = express();
app.use(cors());
app.use(bodyParser.json());

let attendance = []; // ทดลองเก็บใน memory

// API เช็คชื่อ
app.post("/checkin", (req, res) => {
  const { name, status } = req.body;
  attendance.push({
    time: new Date(),
    name,
    status
  });
  res.json({ message: "บันทึกสำเร็จ ✅" });
});

// API รายงาน
app.get("/report", (req, res) => {
  res.json(attendance);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Server running on ${PORT}`));
