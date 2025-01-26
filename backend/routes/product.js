const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const Product = require("../models/Product"); // Product 모델 불러오기

const router = express.Router();

// 서버 시작 시 uploads 폴더 확인 및 생성
if (!fs.existsSync("uploads")) {
  fs.mkdirSync("uploads"); // 폴더가 없으면 생성
}

// Multer 설정 - 이미지 업로드 처리
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // 업로드된 파일 저장 경로
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`); // 고유 파일 이름 생성
  },
});

// Multer 미들웨어 설정
const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const fileTypes = /jpeg|jpg|png|gif/; // 허용된 파일 형식
    const extName = fileTypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    const mimeType = fileTypes.test(file.mimetype);

    if (extName && mimeType) {
      cb(null, true);
    } else {
      cb(new Error("이미지 파일만 업로드 가능합니다.")); // 파일 형식 오류 처리
    }
  },
  limits: { fileSize: 5 * 1024 * 1024 }, // 파일 크기 제한: 5MB
});

// 상품 등록
router.post("/", upload.single("image"), async (req, res) => {
  try {
    const { name, description, price } = req.body;

    const urlsArray = Array.isArray(req.body.urls)
      ? req.body.urls
      : (() => {
          try {
            return JSON.parse(req.body.urls || "[]"); // 문자열로 받은 경우 JSON으로 변환
          } catch {
            return [];
          }
        })();

    const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;

    const product = new Product({
      name,
      description,
      price: price || null,
      urls: urlsArray,
      image: imageUrl,
    });

    await product.save();
    res.status(201).json({ message: "상품 등록 성공", product, imageUrl });
  } catch (error) {
    res.status(500).json({ message: "상품 등록 실패", error: error.message });
  }
});

// 상품 목록 가져오기
router.get("/", async (req, res) => {
  try {
    const products = await Product.find({ isDeleted: false });
    if (products.length === 0) {
      return res.status(404).json({ message: "상품이 없습니다." });
    }
    res.status(200).json(products);
  } catch (error) {
    res
      .status(500)
      .json({ message: "상품 가져오기 실패", error: error.message });
  }
});

// 상품 상태 업데이트 (판매중지/판매재개)
router.put("/status/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { isVisible } = req.body;

    const product = await Product.findByIdAndUpdate(
      id,
      { isVisible },
      { new: true, runValidators: true }
    );

    if (!product) {
      return res.status(404).json({ message: "상품을 찾을 수 없습니다." });
    }

    const statusMessage = isVisible
      ? "판매를 재개했습니다."
      : "판매를 중지했습니다.";
    res.status(200).json({ message: statusMessage, product });
  } catch (error) {
    res
      .status(500)
      .json({ message: "상품 상태 변경 실패", error: error.message });
  }
});

// 상품 삭제
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findByIdAndUpdate(
      id,
      { isDeleted: true },
      { new: true, runValidators: true }
    );

    if (!product) {
      return res.status(404).json({ message: "상품을 찾을 수 없습니다." });
    }

    res.status(200).json({ message: "상품이 삭제되었습니다.", product });
  } catch (error) {
    res.status(500).json({ message: "상품 삭제 실패", error: error.message });
  }
});

// 상품 수정
router.put("/:id", upload.single("image"), async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price } = req.body;

    const urlsArray = Array.isArray(req.body.urls)
      ? req.body.urls
      : (() => {
          try {
            return JSON.parse(req.body.urls || "[]");
          } catch {
            return [];
          }
        })();

    const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;

    const updatedData = {
      name,
      description,
      price: price || null,
      urls: urlsArray,
    };

    if (imageUrl) {
      updatedData.image = imageUrl;
    }

    const product = await Product.findByIdAndUpdate(id, updatedData, {
      new: true,
      runValidators: true,
    });

    if (!product) {
      return res.status(404).json({ message: "상품을 찾을 수 없습니다." });
    }

    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: "상품 수정 실패", error: error.message });
  }
});

// Multer 에러 핸들러
const multerErrorHandler = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    return res
      .status(400)
      .json({ message: "파일 업로드 오류", error: err.message });
  } else if (err) {
    return res.status(500).json({ message: "서버 오류", error: err.message });
  }
  next();
};

router.use(multerErrorHandler); // Multer 에러 핸들러 추가

module.exports = router;
