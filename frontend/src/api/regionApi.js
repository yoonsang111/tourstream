import axiosInstance from "./axiosInstance";

// 지역 목록 가져오기
export const getRegions = async () => {
  try {
    const response = await axiosInstance.get("/regions");
    const data = response.data;

    // 응답 데이터가 배열인지 확인
    if (!Array.isArray(data)) {
      console.error("API 응답이 배열이 아닙니다:", data);
      return [];
    }

    return data; // 올바른 데이터 반환
  } catch (error) {
    console.error("지역 목록 가져오기 실패:", error);
    throw error;
  }
};

// 지역 등록
export const createRegion = async (regionData) => {
  try {
    const response = await axiosInstance.post("/regions", regionData);
    console.log("등록된 지역 데이터:", response.data);
    return response.data; // 생성된 지역 반환
  } catch (error) {
    console.error("지역 등록 실패:", error);
    throw error;
  }
};

// 지역 수정
export const updateRegion = async (id, updatedData) => {
  try {
    const response = await axiosInstance.put(`/regions/${id}`, updatedData);
    return response.data;
  } catch (error) {
    console.error("지역 수정 실패:", error);
    throw error;
  }
};

// 지역 삭제
export const deleteRegion = async (id) => {
  try {
    const response = await axiosInstance.delete(`/regions/${id}`);
    return response.data;
  } catch (error) {
    console.error("지역 삭제 실패:", error);
    throw error;
  }
};
