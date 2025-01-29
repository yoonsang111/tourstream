import axiosInstance from "./axiosInstance";

// 모든 카테고리 가져오기
export const getCategories = async () => {
  try {
    const response = await axiosInstance.get("/api/categoryApi");
    return response.data;
  } catch (error) {
    console.error("카테고리 목록 가져오기 실패:", error);
    throw error;
  }
};

// 상위 카테고리 등록
export const createParentCategory = async (categoryData) => {
  try {
    const response = await axiosInstance.post("/api/categoryApi", categoryData);
    return response.data;
  } catch (error) {
    console.error("상위 카테고리 등록 실패:", error);
    throw error;
  }
};

// 하위 카테고리 등록
export const createSubCategory = async (subCategoryData) => {
  try {
    const response = await axiosInstance.post(
      "/api/categoryApi",
      subCategoryData
    );
    return response.data;
  } catch (error) {
    console.error("하위 카테고리 등록 실패:", error);
    throw error;
  }
};

// 카테고리 수정
export const updateCategory = async (id, updatedData) => {
  try {
    const response = await axiosInstance.put(
      `/api/categoryApi/${id}`,
      updatedData
    );
    return response.data;
  } catch (error) {
    console.error("카테고리 수정 실패:", error);
    throw error;
  }
};

// 카테고리 삭제
export const deleteCategory = async (id) => {
  try {
    const response = await axiosInstance.delete(`/api/categoryApi/${id}`);
    return response.data;
  } catch (error) {
    console.error("카테고리 삭제 실패:", error);
    throw error;
  }
};
