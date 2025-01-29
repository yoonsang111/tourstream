import axiosInstance from "./axiosInstance";

// 상품 목록 가져오기
export const getProducts = async () => {
  try {
    const response = await axiosInstance.get("/products");
    return response.data;
  } catch (error) {
    console.error("상품 목록 가져오기 실패:", error);
    throw new Error("상품 목록을 가져오는 데 실패했습니다.");
  }
};

// 상품 등록
export const createProduct = async (productData) => {
  try {
    const response = await axiosInstance.post("/products", productData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  } catch (error) {
    console.error("상품 등록 실패:", error);
    throw new Error("상품 등록에 실패했습니다.");
  }
};

// 상품 삭제
export const deleteProduct = async (id) => {
  try {
    const response = await axiosInstance.delete(`/products/${id}`);
    return response.data;
  } catch (error) {
    console.error("상품 삭제 실패:", error);
    throw new Error("상품 삭제에 실패했습니다.");
  }
};

// 판매 상태 변경 (판매중지/판매재개)
export const toggleProductVisibility = async (id, isVisible) => {
  try {
    const response = await axiosInstance.put(`/products/status/${id}`, {
      isVisible,
    });
    return response.data.product;
  } catch (error) {
    console.error("판매 상태 변경 실패:", error);
    throw new Error("판매 상태 변경에 실패했습니다.");
  }
};

// 상품 수정
export const updateProduct = async (id, updatedData) => {
  try {
    const response = await axiosInstance.put(`/products/${id}`, updatedData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  } catch (error) {
    console.error("상품 수정 실패:", error);
    throw new Error("상품 수정에 실패했습니다.");
  }
};
