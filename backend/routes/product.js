const express = require("express");
const router = express.Router();
const Product = require("../models/Product"); // Product 모델 불러오기

// 상품 등록 (POST 요청)
router.post("/", async (req, res) => {
  try {
    const product = new Product(req.body); // 클라이언트에서 보낸 데이터로 새로운 상품 생성
    await product.save(); // MongoDB에 상품 저장
    res.status(201).json(product); // 저장된 상품 데이터를 클라이언트로 반환
  } catch (error) {
    res.status(500).json({ message: "상품 등록 실패", error: error.message });
  }
});

// 상품 목록 가져오기 (삭제되지 않은 상품만)
router.get("/", async (req, res) => {
  try {
    const products = await Product.find({ isDeleted: false }); // 삭제되지 않은 상품 가져오기
    if (products.length === 0) {
      return res.status(404).json({ message: "상품이 없습니다." }); // 상품이 없을 경우
    }
    res.status(200).json(products); // 가져온 데이터를 클라이언트로 반환
  } catch (error) {
    res
      .status(500)
      .json({ message: "상품 가져오기 실패", error: error.message });
  }
});

// 상품 수정 (PUT 요청)
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params; // URL에서 상품 ID 가져오기
    const updatedData = req.body; // 클라이언트에서 보낸 수정 데이터

    // MongoDB에서 해당 상품 데이터 수정 (유효성 검사 추가)
    const product = await Product.findByIdAndUpdate(id, updatedData, {
      new: true,
      runValidators: true,
    });

    if (!product) {
      return res.status(404).json({ message: "상품을 찾을 수 없습니다." });
    }

    res.status(200).json(product); // 수정된 상품 데이터 반환
  } catch (error) {
    res.status(500).json({ message: "상품 수정 실패", error: error.message });
  }
});

// 상품 삭제 (isDeleted 설정)
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params; // URL에서 상품 ID 가져오기

    // MongoDB에서 해당 상품의 isDeleted를 true로 설정
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

// 라우터를 모듈로 내보내기
module.exports = router;
