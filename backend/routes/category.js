const express = require("express");
const Category = require("../models/Category"); // 카테고리 모델 가져오기
const router = express.Router();

// 카테고리 등록
router.post("/", async (req, res) => {
  try {
    const { name, description } = req.body;

    // 입력 값 검증
    if (!name) {
      return res.status(400).json({ message: "카테고리 이름이 필요합니다." });
    }

    const category = new Category({
      name,
      description: description || null, // 설명은 선택 사항
    });

    await category.save(); // MongoDB에 저장
    res.status(201).json({ message: "카테고리 등록 성공", category });
  } catch (error) {
    console.error("카테고리 등록 실패:", error.message);
    res
      .status(500)
      .json({ message: "카테고리 등록 실패", error: error.message });
  }
});

// 모든 카테고리 가져오기
router.get("/", async (req, res) => {
  try {
    const categories = await Category.find();
    res.status(200).json(categories);
  } catch (error) {
    console.error("카테고리 가져오기 실패:", error.message);
    res
      .status(500)
      .json({ message: "카테고리 가져오기 실패", error: error.message });
  }
});

module.exports = router;
