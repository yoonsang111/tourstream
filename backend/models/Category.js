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
  parent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category", // 다른 카테고리 참조
    default: null, // 상위 카테고리가 없으면 null
  },
  createdAt: {
    type: Date,
    default: Date.now, // 기본 값: 현재 시간
  },
});

// 하위 카테고리 가상 필드 정의
categorySchema.virtual("children", {
  ref: "Category",
  localField: "_id",
  foreignField: "parent",
});

module.exports = mongoose.model("Category", categorySchema);
