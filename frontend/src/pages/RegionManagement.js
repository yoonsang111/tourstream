import React, { useState, useEffect } from "react";
import {
  getRegions,
  createRegion,
  updateRegion,
  deleteRegion,
} from "../api/regionApi";

const RegionManagement = () => {
  const [regions, setRegions] = useState([]);
  const [newCountry, setNewCountry] = useState("");
  const [newCity, setNewCity] = useState("");
  const [editingRegion, setEditingRegion] = useState(null);
  const [editingCountry, setEditingCountry] = useState("");
  const [editingCity, setEditingCity] = useState("");

  // 지역 목록 가져오기
  useEffect(() => {
    const fetchRegions = async () => {
      try {
        const regionList = await getRegions();
        setRegions(regionList);
      } catch (error) {
        console.error("지역 목록 가져오기 실패:", error.message);
        alert("지역 목록 가져오기 실패: " + error.message);
      }
    };
    fetchRegions();
  }, []);

  // 지역 등록
  const handleCreateRegion = async () => {
    if (!newCountry || !newCity) {
      return alert("국가와 도시를 모두 입력하세요.");
    }
    try {
      const createdRegion = await createRegion({
        country: newCountry,
        city: newCity,
      });
      setRegions([...regions, createdRegion]); // 새 지역 추가
      setNewCountry(""); // 입력 필드 초기화
      setNewCity("");
    } catch (error) {
      console.error("지역 등록 실패:", error.message);
      alert("지역 등록 실패: " + error.message);
    }
  };

  // 지역 수정
  const handleUpdateRegion = async (id) => {
    if (!editingCountry || !editingCity) {
      return alert("수정할 국가와 도시를 모두 입력하세요.");
    }
    try {
      const updatedRegion = await updateRegion(id, {
        country: editingCountry,
        city: editingCity,
      });
      setRegions((prev) =>
        prev.map((region) => (region._id === id ? updatedRegion : region))
      );
      setEditingRegion(null); // 수정 모드 종료
      setEditingCountry("");
      setEditingCity("");
    } catch (error) {
      console.error("지역 수정 실패:", error.message);
      alert("지역 수정 실패: " + error.message);
    }
  };

  // 지역 삭제
  const handleDeleteRegion = async (id) => {
    if (window.confirm("정말로 이 지역을 삭제하시겠습니까?")) {
      try {
        await deleteRegion(id);
        setRegions((prev) => prev.filter((region) => region._id !== id)); // 삭제된 지역 제거
      } catch (error) {
        console.error("지역 삭제 실패:", error.message);
        alert("지역 삭제 실패: " + error.message);
      }
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>지역 관리</h2>
      <div style={{ marginBottom: "20px" }}>
        <h3>지역 등록</h3>
        <input
          type="text"
          placeholder="국가 이름"
          value={newCountry}
          onChange={(e) => setNewCountry(e.target.value)}
          style={{
            padding: "5px",
            marginRight: "10px",
            border: "1px solid #ccc",
            borderRadius: "5px",
          }}
        />
        <input
          type="text"
          placeholder="도시 이름"
          value={newCity}
          onChange={(e) => setNewCity(e.target.value)}
          style={{
            padding: "5px",
            marginRight: "10px",
            border: "1px solid #ccc",
            borderRadius: "5px",
          }}
        />
        <button
          onClick={handleCreateRegion}
          style={{
            padding: "5px 10px",
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

      <div>
        <h3>지역 목록</h3>
        {regions.length > 0 ? (
          regions.map((region, index) => (
            <div
              key={region._id || index} // 고유한 key 제공
              style={{
                display: "flex",
                alignItems: "center",
                marginBottom: "10px",
              }}
            >
              {editingRegion === region._id ? (
                <>
                  <input
                    type="text"
                    value={editingCountry}
                    onChange={(e) => setEditingCountry(e.target.value)}
                    style={{
                      padding: "5px",
                      marginRight: "10px",
                      border: "1px solid #ccc",
                      borderRadius: "5px",
                    }}
                  />
                  <input
                    type="text"
                    value={editingCity}
                    onChange={(e) => setEditingCity(e.target.value)}
                    style={{
                      padding: "5px",
                      marginRight: "10px",
                      border: "1px solid #ccc",
                      borderRadius: "5px",
                    }}
                  />
                  <button
                    onClick={() => handleUpdateRegion(region._id)}
                    style={{
                      padding: "5px 10px",
                      backgroundColor: "#4CAF50",
                      color: "white",
                      border: "none",
                      borderRadius: "5px",
                      cursor: "pointer",
                      marginRight: "10px",
                    }}
                  >
                    저장
                  </button>
                  <button
                    onClick={() => setEditingRegion(null)}
                    style={{
                      padding: "5px 10px",
                      backgroundColor: "#f44336",
                      color: "white",
                      border: "none",
                      borderRadius: "5px",
                      cursor: "pointer",
                    }}
                  >
                    취소
                  </button>
                </>
              ) : (
                <>
                  <span style={{ marginRight: "20px" }}>
                    {region.country} - {region.city}
                  </span>
                  <button
                    onClick={() => {
                      setEditingRegion(region._id);
                      setEditingCountry(region.country);
                      setEditingCity(region.city);
                    }}
                    style={{
                      padding: "5px 10px",
                      backgroundColor: "#ff9800",
                      color: "white",
                      border: "none",
                      borderRadius: "5px",
                      cursor: "pointer",
                      marginRight: "10px",
                    }}
                  >
                    수정
                  </button>
                  <button
                    onClick={() => handleDeleteRegion(region._id)}
                    style={{
                      padding: "5px 10px",
                      backgroundColor: "#f44336",
                      color: "white",
                      border: "none",
                      borderRadius: "5px",
                      cursor: "pointer",
                    }}
                  >
                    삭제
                  </button>
                </>
              )}
            </div>
          ))
        ) : (
          <p>등록된 지역이 없습니다.</p>
        )}
      </div>
    </div>
  );
};

export default RegionManagement;
