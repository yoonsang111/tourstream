const express = require("express");
const Region = require("../models/Region");

const router = express.Router();

// 지역 등록
router.post("/", async (req, res) => {
  try {
    const { country, cities } = req.body;

    if (!country || !Array.isArray(cities) || cities.length === 0) {
      return res.status(400).json({
        message: "국가와 하나 이상의 도시를 입력해야 합니다.",
      });
    }

    const region = new Region({ country, cities });
    await region.save();

    res.status(201).json({ message: "지역 등록 성공", region });
  } catch (error) {
    console.error("지역 등록 실패:", error.message);
    res.status(500).json({ message: "지역 등록 실패", error: error.message });
  }
});

// 지역 목록 가져오기
router.get("/", async (req, res) => {
  try {
    const regions = await Region.find(); // 모든 지역 데이터 가져오기
    if (!regions.length) {
      return res.status(404).json({ message: "등록된 지역이 없습니다." });
    }
    res.status(200).json(regions);
  } catch (error) {
    console.error("지역 목록 가져오기 실패:", error.message);
    res.status(500).json({
      message: "지역 목록 가져오기 실패",
      error: error.message,
    });
  }
});

// 지역 수정
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { country, cities } = req.body;

    if (!country || !Array.isArray(cities) || cities.length === 0) {
      return res.status(400).json({
        message: "국가와 하나 이상의 도시를 입력해야 합니다.",
      });
    }

    const region = await Region.findByIdAndUpdate(
      id,
      { country, cities },
      { new: true, runValidators: true }
    );

    if (!region) {
      return res.status(404).json({ message: "지역을 찾을 수 없습니다." });
    }

    res.status(200).json({ message: "지역 수정 성공", region });
  } catch (error) {
    console.error("지역 수정 실패:", error.message);
    res.status(500).json({ message: "지역 수정 실패", error: error.message });
  }
});

// 지역 삭제
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const region = await Region.findByIdAndDelete(id);

    if (!region) {
      return res.status(404).json({ message: "지역을 찾을 수 없습니다." });
    }

    res.status(200).json({ message: "지역이 삭제되었습니다.", region });
  } catch (error) {
    console.error("지역 삭제 실패:", error.message);
    res.status(500).json({ message: "지역 삭제 실패", error: error.message });
  }
});

module.exports = router;
