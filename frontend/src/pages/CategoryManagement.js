import React, { useState, useEffect } from "react";
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../api/categoryApi";

const CategoryManagement = () => {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState("");
  const [newSubcategories, setNewSubcategories] = useState([]);
  const [editingCategory, setEditingCategory] = useState(null);

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

  // 카테고리 등록
  const handleCreateCategory = async () => {
    if (!newCategory) return alert("카테고리 이름을 입력하세요.");
    try {
      const createdCategory = await createCategory({
        name: newCategory,
        subcategories: newSubcategories,
      });
      setCategories([...categories, createdCategory]);
      setNewCategory("");
      setNewSubcategories([]);
    } catch (error) {
      alert("카테고리 등록 실패: " + error.message);
    }
  };

  // 카테고리 수정
  const handleUpdateCategory = async (id, updatedData) => {
    try {
      const updatedCategory = await updateCategory(id, updatedData);
      setCategories((prevCategories) =>
        prevCategories.map((category) =>
          category._id === id ? updatedCategory : category
        )
      );
      setEditingCategory(null);
    } catch (error) {
      alert("카테고리 수정 실패: " + error.message);
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
    <div>
      <h2>카테고리 관리</h2>
      <div>
        <h3>카테고리 등록</h3>
        <input
          type="text"
          placeholder="카테고리 이름"
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
        />
        <input
          type="text"
          placeholder="서브카테고리 (쉼표로 구분)"
          value={newSubcategories.join(",")}
          onChange={(e) => setNewSubcategories(e.target.value.split(","))}
        />
        <button onClick={handleCreateCategory}>등록</button>
      </div>

      <div>
        <h3>카테고리 목록</h3>
        {categories.map((category) => (
          <div key={category._id}>
            {editingCategory === category._id ? (
              <div>
                <input
                  type="text"
                  value={category.name}
                  onChange={(e) =>
                    handleUpdateCategory(category._id, {
                      ...category,
                      name: e.target.value,
                    })
                  }
                />
                <input
                  type="text"
                  value={(category.subcategories || []).join(",")}
                  onChange={(e) =>
                    handleUpdateCategory(category._id, {
                      ...category,
                      subcategories: e.target.value.split(","),
                    })
                  }
                />
                <button onClick={() => setEditingCategory(null)}>취소</button>
              </div>
            ) : (
              <div>
                <strong>{category.name}</strong> -{" "}
                {(category.subcategories || []).join(", ")}
                <button onClick={() => setEditingCategory(category._id)}>
                  수정
                </button>
                <button onClick={() => handleDeleteCategory(category._id)}>
                  삭제
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoryManagement;
