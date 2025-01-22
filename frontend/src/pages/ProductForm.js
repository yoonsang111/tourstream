import React, { useState } from "react";
import axios from "axios";

const ProductForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    urls: [""],
  });

  const [message, setMessage] = useState(""); // 사용자에게 성공 메시지 표시
  const [error, setError] = useState(""); // 에러 메시지 표시

  // 입력 필드 변경 핸들러
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
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

    // productData 객체 정의
    const productData = {
      name: formData.name,
      description: formData.description,
      price: formData.price || null, // 가격 필드가 비어있으면 null로 처리
      urls: formData.urls,
    };

    try {
      // 서버로 데이터 전송
      const response = await axios.post(
        "http://localhost:5000/api/products",
        productData
      );
      console.log("서버 응답:", response.data); // 서버 응답 콘솔에 출력
      setMessage("상품이 성공적으로 등록되었습니다!"); // 성공 메시지 표시
      setFormData({
        name: "",
        description: "",
        price: "",
        urls: [""],
      }); // 폼 초기화
    } catch (err) {
      console.error("등록 실패:", err.response?.data || err.message); // 에러를 콘솔에 출력
      setError("상품 등록에 실패했습니다. 다시 시도해주세요."); // 에러 메시지 표시
    }
  };

  return (
    <div>
      <h2>상품 등록</h2>
      {message && <p style={{ color: "green" }}>{message}</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form
        onSubmit={handleSubmit}
        style={{
          border: "1px solid #ccc",
          padding: "20px",
          borderRadius: "5px",
        }}
      >
        <div style={{ marginBottom: "10px" }}>
          <label>
            상품 이름:
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              style={{ marginLeft: "10px", padding: "5px" }}
            />
          </label>
        </div>
        <div style={{ marginBottom: "10px" }}>
          <label>
            상품 설명:
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              style={{
                marginLeft: "10px",
                padding: "5px",
                width: "100%",
                height: "80px",
              }}
            />
          </label>
        </div>
        <div style={{ marginBottom: "10px" }}>
          <label>
            상품 가격:
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              style={{ marginLeft: "10px", padding: "5px" }}
            />
          </label>
        </div>
        <div style={{ marginBottom: "10px" }}>
          <label>상품 URL:</label>
          {formData.urls.map((url, index) => (
            <div
              key={index}
              style={{
                display: "flex",
                alignItems: "center",
                marginBottom: "5px",
              }}
            >
              <input
                type="url"
                value={url}
                onChange={(e) => handleUrlChange(index, e.target.value)}
                style={{ flex: 1, padding: "5px" }}
              />
              <button
                type="button"
                onClick={() => removeUrlField(index)}
                style={{
                  marginLeft: "5px",
                  padding: "5px",
                  backgroundColor: "#f44336",
                  color: "white",
                  border: "none",
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
              padding: "5px 10px",
              backgroundColor: "#4CAF50",
              color: "white",
              border: "none",
              cursor: "pointer",
            }}
          >
            URL 추가
          </button>
        </div>
        <button
          type="submit"
          style={{
            padding: "10px 20px",
            backgroundColor: "#2196F3",
            color: "white",
            border: "none",
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
