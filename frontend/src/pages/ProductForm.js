import React, { useState } from "react";
import axios from "../api/axiosInstance"; // axios 인스턴스 사용

const ProductForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    urls: [""],
    image: null, // 이미지 파일 추가
  });

  const [message, setMessage] = useState(""); // 성공 메시지
  const [error, setError] = useState(""); // 에러 메시지
  const [previewImage, setPreviewImage] = useState(null); // 이미지 미리보기

  // 입력 필드 변경 핸들러
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // 이미지 파일 변경 핸들러
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setFormData((prevData) => ({
      ...prevData,
      image: file, // 선택된 파일 저장
    }));
    setPreviewImage(file ? URL.createObjectURL(file) : null); // 미리보기 URL 생성
  };

  // URL 필드 변경 핸들러
  const handleUrlChange = (index, value) => {
    const updatedUrls = [...formData.urls];
    updatedUrls[index] = value;
    setFormData((prevData) => ({
      ...prevData,
      urls: updatedUrls,
    }));
  };

  // URL 필드 추가
  const addUrlField = () => {
    setFormData((prevData) => ({
      ...prevData,
      urls: [...prevData.urls, ""],
    }));
  };

  // URL 필드 삭제
  const removeUrlField = (index) => {
    const updatedUrls = formData.urls.filter((_, i) => i !== index);
    setFormData((prevData) => ({
      ...prevData,
      urls: updatedUrls,
    }));
  };

  // 폼 제출 핸들러
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(""); // 이전 메시지 초기화
    setError(""); // 이전 에러 초기화

    const productData = new FormData(); // FormData 객체 생성
    productData.append("name", formData.name);
    productData.append("description", formData.description);
    if (formData.price) productData.append("price", formData.price); // 비어 있는 가격은 추가하지 않음
    if (formData.image) productData.append("image", formData.image); // 이미지 파일 추가
    formData.urls.forEach((url, index) => {
      productData.append(`urls[${index}]`, url); // URL 배열 추가
    });

    try {
      const response = await axios.post("/products", productData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      console.log("서버 응답:", response.data); // 서버 응답 확인
      setMessage("상품이 성공적으로 등록되었습니다!");
      setFormData({
        name: "",
        description: "",
        price: "",
        urls: [""],
        image: null,
      }); // 폼 초기화
      setPreviewImage(null); // 미리보기 초기화
    } catch (err) {
      console.error("등록 실패:", err.response?.data || err.message);
      setError("상품 등록에 실패했습니다. 다시 시도해주세요.");
    }
  };

  return (
    <div style={{ maxWidth: "600px", margin: "0 auto", padding: "20px" }}>
      <h2 style={{ textAlign: "center", marginBottom: "20px" }}>상품 등록</h2>
      {message && (
        <p style={{ color: "green", textAlign: "center" }}>{message}</p>
      )}
      {error && <p style={{ color: "red", textAlign: "center" }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        {/* 상품 이름 */}
        <div style={{ marginBottom: "15px" }}>
          <label>
            상품 이름:
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              style={{
                display: "block",
                width: "100%",
                padding: "10px",
                marginTop: "5px",
                border: "1px solid #ccc",
                borderRadius: "5px",
              }}
            />
          </label>
        </div>

        {/* 상품 설명 */}
        <div style={{ marginBottom: "15px" }}>
          <label>
            상품 설명:
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              style={{
                display: "block",
                width: "100%",
                padding: "10px",
                marginTop: "5px",
                border: "1px solid #ccc",
                borderRadius: "5px",
                height: "80px",
              }}
            />
          </label>
        </div>

        {/* 상품 가격 */}
        <div style={{ marginBottom: "15px" }}>
          <label>
            상품 가격:
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              style={{
                display: "block",
                width: "100%",
                padding: "10px",
                marginTop: "5px",
                border: "1px solid #ccc",
                borderRadius: "5px",
              }}
            />
          </label>
        </div>

        {/* 상품 이미지 */}
        <div style={{ marginBottom: "15px" }}>
          <label>
            상품 이미지:
            <input
              type="file"
              name="image"
              accept="image/*"
              onChange={handleImageChange}
              style={{
                display: "block",
                marginTop: "5px",
              }}
            />
          </label>
          {/* 이미지 미리보기 */}
          {previewImage && (
            <div style={{ marginTop: "10px", textAlign: "center" }}>
              <img
                src={previewImage}
                alt="미리보기"
                style={{
                  maxWidth: "100%",
                  height: "auto",
                  border: "1px solid #ccc",
                  borderRadius: "5px",
                }}
              />
            </div>
          )}
        </div>

        {/* 상품 URL */}
        <div style={{ marginBottom: "15px" }}>
          <label>상품 URL:</label>
          {formData.urls.map((url, index) => (
            <div
              key={index}
              style={{
                display: "flex",
                alignItems: "center",
                marginTop: "5px",
              }}
            >
              <input
                type="url"
                value={url}
                onChange={(e) => handleUrlChange(index, e.target.value)}
                style={{
                  flex: 1,
                  padding: "10px",
                  border: "1px solid #ccc",
                  borderRadius: "5px",
                }}
              />
              <button
                type="button"
                onClick={() => removeUrlField(index)}
                style={{
                  marginLeft: "10px",
                  padding: "5px 10px",
                  backgroundColor: "#f44336",
                  color: "#fff",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer",
                }}
              >
                삭제
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addUrlField}
            style={{
              marginTop: "10px",
              padding: "10px 20px",
              backgroundColor: "#4CAF50",
              color: "#fff",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            URL 추가
          </button>
        </div>

        {/* 제출 버튼 */}
        <button
          type="submit"
          style={{
            display: "block",
            width: "100%",
            padding: "10px",
            backgroundColor: "#2196F3",
            color: "#fff",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          상품 등록
        </button>
      </form>
    </div>
  );
};

export default ProductForm;
