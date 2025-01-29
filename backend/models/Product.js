const mongoose = require("mongoose");

// 상품 스키마 정의
const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true, // 상품 이름은 필수 입력 값
  },
  description: {
    type: String,
    required: true, // 상품 설명은 필수 입력 값
  },
  price: {
    type: Number,
    default: null, // 가격이 없을 경우 기본값 null
  },
  urls: {
    type: [String],
    default: [], // 상품 관련 URL 배열
  },
  image: {
    type: String,
    default: null, // 상품 이미지 경로 (이미지가 없을 경우 null)
  },
  category: {
    type: String,
    required: true, // 카테고리 필수 입력 값
  },
  region: {
    type: String,
    required: true, // 지역 필수 입력 값
  },
  tags: {
    type: [String],
    default: [], // 태그 배열
  },
  isVisible: {
    type: Boolean,
    default: true, // 판매 상태 필드 추가 (기본값: true)
  },
  isDeleted: {
    type: Boolean,
    default: false, // 상품 삭제 여부 (true: 삭제됨)
  },
  createdAt: {
    type: Date,
    default: Date.now, // 상품 생성 시 시간 자동 기록
  },
});

// 스키마를 모델로 변환하여 내보내기
module.exports = mongoose.model("Product", productSchema);
