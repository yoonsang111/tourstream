const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// 라우트 파일 추가
const productRoutes = require("./routes/product");
const regionRoutes = require("./routes/region");
const categoryRoutes = require("./routes/category");

const app = express();
const PORT = 5000;

// uploads 폴더 확인 및 생성
if (!fs.existsSync("uploads")) {
  fs.mkdirSync("uploads");
}

// Middleware 설정
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // URL 인코딩된 데이터 파싱

// MongoDB Atlas 연결
mongoose
  .connect(
    "mongodb+srv://tourstream:dldbstkd@cluster0.eobwo.mongodb.net/tourstreamDB?retryWrites=true&w=majority",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => console.log("✅ MongoDB 연결 성공!"))
  .catch((err) => {
    console.error("❌ MongoDB 연결 실패:", err.message);
    process.exit(1);
  });

mongoose.connection.on("connected", () => {
  console.log("🔗 Mongoose가 MongoDB에 연결되었습니다.");
});

mongoose.connection.on("error", (err) => {
  console.error("🚨 Mongoose 연결 에러:", err.message);
});

mongoose.connection.on("disconnected", () => {
  console.log("❗️ Mongoose 연결이 종료되었습니다.");
});

// Multer 설정
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

// Static 파일 제공
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// 이미지 업로드 라우트
app.post("/api/upload", upload.single("image"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "이미지 업로드 실패" });
  }
  res.status(200).json({ imageUrl: `/uploads/${req.file.filename}` });
});

// API 라우트 설정
app.use("/api/productApi", productRoutes);
app.use("/api/regionApi", regionRoutes);
app.use("/api/categoryApi", categoryRoutes);

// 404 에러 핸들링
app.use((req, res, next) => {
  res.status(404).json({ message: "요청하신 API를 찾을 수 없습니다." });
});

// 전역 에러 핸들러
app.use((err, req, res, next) => {
  console.error("🚨 에러 발생:", err.stack);
  res.status(500).json({ message: "서버 내부 오류", error: err.message });
});

// 서버 시작
app.listen(PORT, () => {
  console.log(`🚀 서버가 http://localhost:${PORT} 에서 실행 중입니다.`);
});
