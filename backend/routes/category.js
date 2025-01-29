const express = require("express");
const Category = require("../models/Category");
const mongoose = require("mongoose");
const router = express.Router();

// 재귀적으로 모든 하위 카테고리를 가져오는 함수 (최적화)
async function getNestedCategories(parentId = null) {
  const categories = await Category.find({ parent: parentId }).lean();
  return Promise.all(
    categories.map(async (category) => ({
      ...category,
      children: await getNestedCategories(category._id),
    }))
  );
}

// 하위 카테고리 재귀적으로 삭제
async function deleteNestedCategories(parentId) {
  const children = await Category.find({ parent: parentId });
  for (const child of children) {
    await deleteNestedCategories(child._id);
    await Category.findByIdAndDelete(child._id);
  }
}

// 카테고리 등록
router.post("/", async (req, res) => {
  try {
    const { name, description, parent } = req.body;

    if (!name) {
      return res.status(400).json({ message: "카테고리 이름이 필요합니다." });
    }

    const category = new Category({
      name,
      description: description || null,
      parent: parent || null,
    });

    await category.save();
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
    const categories = await getNestedCategories();
    res.status(200).json(categories);
  } catch (error) {
    console.error("카테고리 가져오기 실패:", error.message);
    res
      .status(500)
      .json({ message: "카테고리 가져오기 실패", error: error.message });
  }
});

// 카테고리 삭제
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "유효하지 않은 ID입니다." });
    }

    await deleteNestedCategories(id);
    const category = await Category.findByIdAndDelete(id);

    if (!category) {
      return res.status(404).json({ message: "카테고리를 찾을 수 없습니다." });
    }

    res.status(200).json({ message: "카테고리가 삭제되었습니다.", category });
  } catch (error) {
    console.error("카테고리 삭제 실패:", error.message);
    res
      .status(500)
      .json({ message: "카테고리 삭제 실패", error: error.message });
  }
});

module.exports = router;
