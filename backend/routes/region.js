// 지역 등록
router.post("/", async (req, res) => {
  try {
    const { country, cities } = req.body;

    // cities가 배열인지 확인
    if (!Array.isArray(cities)) {
      return res
        .status(400)
        .json({ message: "도시 정보는 배열 형식이어야 합니다." });
    }

    const region = new Region({
      country,
      cities: cities || [],
    });

    await region.save();
    res
      .status(201)
      .json({ message: "지역이 성공적으로 등록되었습니다.", region });
  } catch (error) {
    console.error("지역 등록 실패:", error.message);
    res.status(500).json({ message: "지역 등록 실패", error: error.message });
  }
});

// 지역 수정
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { country, cities } = req.body;

    // cities가 배열인지 확인
    if (!Array.isArray(cities)) {
      return res
        .status(400)
        .json({ message: "도시 정보는 배열 형식이어야 합니다." });
    }

    const region = await Region.findByIdAndUpdate(
      id,
      { country, cities },
      { new: true, runValidators: true }
    );

    if (!region) {
      return res.status(404).json({ message: "지역을 찾을 수 없습니다." });
    }

    res
      .status(200)
      .json({ message: "지역이 성공적으로 수정되었습니다.", region });
  } catch (error) {
    console.error("지역 수정 실패:", error.message);
    res.status(500).json({ message: "지역 수정 실패", error: error.message });
  }
});
