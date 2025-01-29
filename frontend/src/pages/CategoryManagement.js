import React, { useState, useEffect } from "react";
import {
  getCategories,
  createParentCategory,
  createSubCategory,
  deleteCategory,
} from "../api/categoryApi";

const CategoryManagement = () => {
  const [categories, setCategories] = useState([]);
  const [newParentCategory, setNewParentCategory] = useState("");
  const [selectedParentId, setSelectedParentId] = useState("");
  const [newSubCategory, setNewSubCategory] = useState("");

  // 카테고리 목록 가져오기
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categoryList = await getCategories();
        setCategories(categoryList);
      } catch (error) {
        alert("카테고리 목록 가져오기 실패: " + error.message);
      }
    };
    fetchCategories();
  }, []);

  // 상위 카테고리 등록
  const handleCreateParentCategory = async () => {
    if (!newParentCategory) return alert("상위 카테고리 이름을 입력하세요.");
    try {
      const createdCategory = await createParentCategory({
        name: newParentCategory,
      });
      setCategories([...categories, createdCategory]);
      setNewParentCategory("");
    } catch (error) {
      alert("상위 카테고리 등록 실패: " + error.message);
    }
  };

  // 하위 카테고리 등록
  const handleCreateSubCategory = async () => {
    if (!selectedParentId) return alert("상위 카테고리를 선택하세요.");
    if (!newSubCategory) return alert("하위 카테고리 이름을 입력하세요.");
    try {
      const createdCategory = await createSubCategory({
        name: newSubCategory,
        parent: selectedParentId,
      });
      // 상위 카테고리 업데이트
      setCategories((prevCategories) =>
        prevCategories.map((category) =>
          category._id === selectedParentId
            ? {
                ...category,
                children: [...(category.children || []), createdCategory],
              }
            : category
        )
      );
      setNewSubCategory("");
      setSelectedParentId("");
    } catch (error) {
      alert("하위 카테고리 등록 실패: " + error.message);
    }
  };

  // 카테고리 삭제
  const handleDeleteCategory = async (id) => {
    if (window.confirm("정말로 이 카테고리를 삭제하시겠습니까?")) {
      try {
        await deleteCategory(id);
        setCategories((prevCategories) =>
          prevCategories.filter((category) => category._id !== id)
        );
      } catch (error) {
        alert("카테고리 삭제 실패: " + error.message);
      }
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
      <h2 style={{ textAlign: "center", marginBottom: "20px" }}>
        카테고리 관리
      </h2>

      {/* 상위 카테고리 등록 */}
      <div style={{ marginBottom: "20px" }}>
        <h3>상위 카테고리 등록</h3>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <input
            type="text"
            placeholder="상위 카테고리 이름"
            value={newParentCategory}
            onChange={(e) => setNewParentCategory(e.target.value)}
            style={{
              flex: 1,
              padding: "10px",
              border: "1px solid #ccc",
              borderRadius: "5px",
            }}
          />
          <button
            onClick={handleCreateParentCategory}
            style={{
              padding: "10px 20px",
              backgroundColor: "#4CAF50",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            등록
          </button>
        </div>
      </div>

      {/* 하위 카테고리 등록 */}
      <div style={{ marginBottom: "20px" }}>
        <h3>하위 카테고리 등록</h3>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <select
            value={selectedParentId}
            onChange={(e) => setSelectedParentId(e.target.value)}
            style={{
              flex: 1,
              padding: "10px",
              border: "1px solid #ccc",
              borderRadius: "5px",
            }}
          >
            <option value="" disabled>
              상위 카테고리 선택
            </option>
            {categories.map((category) => (
              <option key={category._id} value={category._id}>
                {category.name}
              </option>
            ))}
          </select>
          <input
            type="text"
            placeholder="하위 카테고리 이름"
            value={newSubCategory}
            onChange={(e) => setNewSubCategory(e.target.value)}
            style={{
              flex: 1,
              padding: "10px",
              border: "1px solid #ccc",
              borderRadius: "5px",
            }}
          />
          <button
            onClick={handleCreateSubCategory}
            style={{
              padding: "10px 20px",
              backgroundColor: "#4CAF50",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            등록
          </button>
        </div>
      </div>

      {/* 카테고리 목록 */}
      <div>
        <h3>카테고리 목록</h3>
        {categories.map((category) => (
          <div
            key={category._id}
            style={{
              marginBottom: "10px",
              padding: "10px",
              border: "1px solid #ccc",
              borderRadius: "5px",
            }}
          >
            <strong>{category.name}</strong>
            <button
              onClick={() => handleDeleteCategory(category._id)}
              style={{
                marginLeft: "10px",
                color: "red",
                border: "none",
                background: "transparent",
                cursor: "pointer",
              }}
            >
              삭제
            </button>
            <div style={{ marginLeft: "20px", marginTop: "10px" }}>
              {category.children && category.children.length > 0 ? (
                category.children.map((child) => (
                  <div key={child._id}>
                    - {child.name}
                    <button
                      onClick={() => handleDeleteCategory(child._id)}
                      style={{
                        marginLeft: "10px",
                        color: "red",
                        border: "none",
                        background: "transparent",
                        cursor: "pointer",
                      }}
                    >
                      삭제
                    </button>
                  </div>
                ))
              ) : (
                <p>하위 카테고리가 없습니다.</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoryManagement;
