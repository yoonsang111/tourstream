const mongoose = require("mongoose");

// 상품 스키마 정의
const productSchema = new mongoose.Schema({
  name: { type: String, required: true }, // 상품 이름
  description: { type: String, required: true }, // 상품 설명
  price: { type: Number, required: true }, // 상품 가격
  image: { type: String }, // 이미지 URL (파일 업로드 처리 후 저장)
  urls: [{ type: String }], // 여러 URL 저장
  isDeleted: { type: Boolean, default: false }, // 삭제 여부
  createdAt: { type: Date, default: Date.now }, // 생성 일자
});

// 모델 생성
module.exports = mongoose.model("Product", productSchema);
