const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const Product = require("../models/Product"); // Product 모델 가져오기

const router = express.Router();

// 서버 시작 시 uploads 폴더 확인 및 생성
if (!fs.existsSync("uploads")) {
  fs.mkdirSync("uploads");
}

// Multer 설정
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const fileTypes = /jpeg|jpg|png|gif/;
    const isValidType =
      fileTypes.test(path.extname(file.originalname).toLowerCase()) &&
      fileTypes.test(file.mimetype);
    if (isValidType) cb(null, true);
    else cb(new Error("이미지 파일만 업로드 가능합니다."));
  },
  limits: { fileSize: 5 * 1024 * 1024 },
});

// 상품 등록
router.post("/", upload.single("image"), async (req, res) => {
  try {
    const { name, description, price, category, region, tags } = req.body;

    if (!name || !description || !price || !category || !region) {
      return res.status(400).json({ message: "모든 필드를 입력하세요." });
    }

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

    const product = new Product({
      name,
      description,
      price,
      category,
      region,
      tags: tags ? tags.split(",") : [], // 태그를 배열로 저장
      urls: urlsArray,
      image: imageUrl,
    });

    await product.save();
    res.status(201).json({ message: "상품 등록 성공", product });
  } catch (error) {
    console.error("상품 등록 실패:", error.message);
    res.status(500).json({ message: "상품 등록 실패", error: error.message });
  }
});

// 상품 목록 가져오기
router.get("/", async (req, res) => {
  try {
    const products = await Product.find({ isDeleted: false });
    res.status(200).json(products);
  } catch (error) {
    res
      .status(500)
      .json({ message: "상품 가져오기 실패", error: error.message });
  }
});

// 상품 상태 업데이트
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

    res.status(200).json({ message: "상품 삭제 완료", product });
  } catch (error) {
    res.status(500).json({ message: "상품 삭제 실패", error: error.message });
  }
});

// 상품 수정
router.put("/:id", upload.single("image"), async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price, category, region, tags } = req.body;

    if (!name || !description || !price || !category || !region) {
      return res.status(400).json({ message: "모든 필드를 입력하세요." });
    }

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
      price,
      category,
      region,
      tags: tags ? tags.split(",") : [],
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

module.exports = router;
