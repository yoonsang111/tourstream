const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const multer = require("multer"); // 이미지 업로드를 위한 Multer 추가
const path = require("path");
const productRoutes = require("./routes/product");

const app = express();
const PORT = 5000;

// Middleware 설정
app.use(cors()); // Cross-Origin Resource Sharing 허용
app.use(express.json()); // JSON 요청 파싱

// MongoDB Atlas 연결
const MONGO_URI =
  "mongodb+srv://tourstream:dldbstkd@cluster0.eobwo.mongodb.net/tourstreamDB?retryWrites=true&w=majority";

// MongoDB 연결
mongoose
  .connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB 연결 성공!"))
  .catch((err) => {
    console.error("❌ MongoDB 연결 실패:", err.message);
    process.exit(1); // 연결 실패 시 서버 종료
  });

// MongoDB 연결 이벤트 추가 (디버깅용)
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
    cb(null, "uploads/"); // 업로드 파일 저장 디렉토리
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname)); // 고유 파일 이름 생성
  },
});
const upload = multer({ storage }); // Multer 미들웨어 초기화

// 정적 파일 제공 (업로드된 파일을 클라이언트에서 접근 가능하게 함)
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// 이미지 업로드 라우트
app.post("/api/upload", upload.single("image"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "이미지 업로드 실패" });
  }
  res.status(200).json({ imageUrl: `/uploads/${req.file.filename}` }); // 업로드된 이미지 경로 반환
});

// 기본 라우트 설정
app.use("/api/products", productRoutes);

// 404 에러 처리 (라우트가 없는 경우)
app.use((req, res, next) => {
  res.status(404).json({ message: "요청하신 API를 찾을 수 없습니다." });
});

// 서버 실행
app.listen(PORT, () => {
  console.log(`🚀 서버가 http://localhost:${PORT} 에서 실행 중입니다.`);
});
