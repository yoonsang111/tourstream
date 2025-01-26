const mongoose = require("mongoose");

// 카테고리 스키마 정의
const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true, // 필수 값
  },
  description: {
    type: String, // 선택 사항
    default: null,
  },
  createdAt: {
    type: Date,
    default: Date.now, // 기본 값: 현재 시간
  },
});

module.exports = mongoose.model("Category", categorySchema);
