const mongoose = require("mongoose");

const regionSchema = new mongoose.Schema({
  country: { type: String, required: true }, // 국가 이름
  cities: [{ type: String }], // 도시 목록
  isDeleted: { type: Boolean, default: false }, // 삭제 여부
  createdAt: { type: Date, default: Date.now }, // 생성 날짜
});

module.exports = mongoose.model("Region", regionSchema);