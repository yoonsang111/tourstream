import axiosInstance from "./axiosInstance";

// 지역 목록 가져오기
export const getRegions = async () => {
  try {
    const response = await axiosInstance.get("/api/regionApi");
    return response.data;
  } catch (error) {
    console.error(
      "지역 목록 가져오기 실패:",
      error.response?.data || error.message
    );
    throw error;
  }
};

// 지역 등록
export const createRegion = async (regionData) => {
  try {
    const response = await axiosInstance.post("/api/regionApi", regionData);
    return response.data;
  } catch (error) {
    console.error("지역 등록 실패:", error.response?.data || error.message);
    throw error;
  }
};

// 지역 수정
export const updateRegion = async (id, updatedData) => {
  try {
    const response = await axiosInstance.put(
      `/api/regionApi/${id}`,
      updatedData
    );
    return response.data;
  } catch (error) {
    console.error("지역 수정 실패:", error.response?.data || error.message);
    throw error;
  }
};

// 지역 삭제
export const deleteRegion = async (id) => {
  try {
    const response = await axiosInstance.delete(`/api/regionApi/${id}`);
    return response.data;
  } catch (error) {
    console.error("지역 삭제 실패:", error.response?.data || error.message);
    throw error;
  }
};
