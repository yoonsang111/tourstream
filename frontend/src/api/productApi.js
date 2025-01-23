import axiosInstance from "./axiosInstance";

// 상품 목록 가져오기
export const getProducts = async () => {
  try {
    const response = await axiosInstance.get("/products");
    return response.data;
  } catch (error) {
    throw error;
  }
};

// 상품 삭제
export const deleteProduct = async (id) => {
  try {
    const response = await axiosInstance.delete(`/products/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// 판매 상태 변경
export const toggleProductVisibility = async (id, isVisible) => {
  try {
    const response = await axiosInstance.put(`/products/status/${id}`, {
      isVisible,
    });
    return response.data.product;
  } catch (error) {
    throw error;
  }
};
