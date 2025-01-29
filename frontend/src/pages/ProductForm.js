import React, { useState, useEffect } from "react";
import axios from "../api/axiosInstance"; // axios 인스턴스 사용
import Select from "react-select"; // react-select 사용

const ProductForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    categories: [], // 다중 선택 가능
    region: "",
    tags: "",
    urls: [""],
    image: null, // 이미지 파일 추가
  });

  const [message, setMessage] = useState(""); // 성공 메시지
  const [error, setError] = useState(""); // 에러 메시지
  const [previewImage, setPreviewImage] = useState(null); // 이미지 미리보기

  const [categoriesOptions, setCategoriesOptions] = useState([]); // 카테고리 옵션
  const [regionOptions, setRegionOptions] = useState([]); // 지역 옵션

  // 카테고리 및 지역 목록 가져오기
  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const categoriesResponse = await axios.get("/categories");
        const regionsResponse = await axios.get("/regions");

        setCategoriesOptions(
          categoriesResponse.data.map((category) => ({
            value: category._id,
            label: category.name,
          }))
        );

        setRegionOptions(
          regionsResponse.data.map((region) => ({
            value: region._id,
            label: `${region.country} - ${region.city}`,
          }))
        );
      } catch (error) {
        console.error("옵션 데이터 로드 실패:", error.message);
      }
    };
    fetchOptions();
  }, []);

  // 입력 필드 변경 핸들러
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // 카테고리 선택 핸들러
  const handleCategoryChange = (selectedOptions) => {
    setFormData((prevData) => ({
      ...prevData,
      categories: selectedOptions.map((option) => option.value),
    }));
  };

  // 지역 선택 핸들러
  const handleRegionChange = (selectedOption) => {
    setFormData((prevData) => ({
      ...prevData,
      region: selectedOption ? selectedOption.value : "",
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

    try {
      const productData = new FormData(); // FormData 객체 생성
      Object.entries(formData).forEach(([key, value]) => {
        if (key === "urls") {
          value.forEach((url, index) => {
            productData.append(`urls[${index}]`, url);
          });
        } else if (key === "categories") {
          value.forEach((category) => {
            productData.append("categories[]", category);
          });
        } else if (key === "image" && value) {
          productData.append(key, value); // 이미지 파일 추가
        } else {
          productData.append(key, value);
        }
      });

      const response = await axios.post("/products", productData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      console.log("서버 응답:", response.data); // 서버 응답 확인
      setMessage("상품이 성공적으로 등록되었습니다!");
      setFormData({
        name: "",
        description: "",
        price: "",
        categories: [],
        region: "",
        tags: "",
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

        {/* 카테고리 선택 */}
        <div style={{ marginBottom: "15px" }}>
          <label>카테고리:</label>
          <Select
            isMulti
            options={categoriesOptions}
            onChange={handleCategoryChange}
            placeholder="카테고리를 선택하세요"
            styles={{
              control: (base) => ({
                ...base,
                borderRadius: "5px",
                padding: "5px",
              }),
            }}
          />
        </div>

        {/* 지역 선택 */}
        <div style={{ marginBottom: "15px" }}>
          <label>지역:</label>
          <Select
            options={regionOptions}
            onChange={handleRegionChange}
            placeholder="지역을 선택하세요"
            styles={{
              control: (base) => ({
                ...base,
                borderRadius: "5px",
                padding: "5px",
              }),
            }}
          />
        </div>

        {/* 상품 태그 */}
        <div style={{ marginBottom: "15px" }}>
          <label>
            태그 (쉼표로 구분):
            <input
              type="text"
              name="tags"
              value={formData.tags}
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

        {/* URL 추가 */}
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
