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
  const [editData, setEditData] = useState({ country: "", city: "" });

  // 지역 목록 가져오기
  useEffect(() => {
    const fetchRegions = async () => {
      try {
        const regionList = await getRegions();
        // 데이터가 배열인지 확인하고 설정
        setRegions(Array.isArray(regionList) ? regionList : []);
      } catch (error) {
        alert("지역 목록 가져오기 실패: " + error.message);
      }
    };
    fetchRegions();
  }, []);

  // 지역 등록
  const handleCreateRegion = async () => {
    if (!newCountry.trim() || !newCity.trim()) {
      return alert("국가와 도시를 모두 입력해야 합니다.");
    }
    try {
      const createdRegion = await createRegion({
        country: newCountry.trim(),
        city: newCity.trim(),
      });
      setRegions((prev) => [...prev, createdRegion]);
      setNewCountry("");
      setNewCity("");
    } catch (error) {
      alert("지역 등록 실패: " + error.message);
    }
  };

  // 지역 수정
  const handleUpdateRegion = async () => {
    if (!editData.country.trim() || !editData.city.trim()) {
      return alert("수정할 국가와 도시를 모두 입력해야 합니다.");
    }
    try {
      const updatedRegion = await updateRegion(editingRegion, editData);
      setRegions((prevRegions) =>
        prevRegions.map((region) =>
          region._id === editingRegion ? updatedRegion : region
        )
      );
      setEditingRegion(null);
      setEditData({ country: "", city: "" });
    } catch (error) {
      alert("지역 수정 실패: " + error.message);
    }
  };

  // 지역 삭제
  const handleDeleteRegion = async (id) => {
    if (window.confirm("정말로 이 지역을 삭제하시겠습니까?")) {
      try {
        await deleteRegion(id);
        setRegions((prevRegions) =>
          prevRegions.filter((region) => region._id !== id)
        );
      } catch (error) {
        alert("지역 삭제 실패: " + error.message);
      }
    }
  };

  return (
    <div>
      <h2>지역 관리</h2>
      <div>
        <h3>지역 등록</h3>
        <input
          type="text"
          placeholder="국가 이름"
          value={newCountry}
          onChange={(e) => setNewCountry(e.target.value)}
          style={{ marginRight: "10px" }}
        />
        <input
          type="text"
          placeholder="도시 이름"
          value={newCity}
          onChange={(e) => setNewCity(e.target.value)}
        />
        <button onClick={handleCreateRegion} style={{ marginLeft: "10px" }}>
          등록
        </button>
      </div>

      <div>
        <h3>지역 목록</h3>
        {regions.length > 0 ? (
          regions.map(
            (region) =>
              region && (
                <div key={region._id} style={{ marginBottom: "10px" }}>
                  {editingRegion === region._id ? (
                    <div>
                      <input
                        type="text"
                        value={editData.country}
                        onChange={(e) =>
                          setEditData((prev) => ({
                            ...prev,
                            country: e.target.value,
                          }))
                        }
                        style={{ marginRight: "10px" }}
                        placeholder="국가 이름"
                      />
                      <input
                        type="text"
                        value={editData.city}
                        onChange={(e) =>
                          setEditData((prev) => ({
                            ...prev,
                            city: e.target.value,
                          }))
                        }
                        placeholder="도시 이름"
                      />
                      <button
                        onClick={handleUpdateRegion}
                        style={{
                          marginLeft: "10px",
                          backgroundColor: "green",
                          color: "white",
                        }}
                      >
                        저장
                      </button>
                      <button
                        onClick={() => {
                          setEditingRegion(null);
                          setEditData({ country: "", city: "" });
                        }}
                        style={{
                          marginLeft: "10px",
                          backgroundColor: "gray",
                          color: "white",
                        }}
                      >
                        취소
                      </button>
                    </div>
                  ) : (
                    <div>
                      <strong>
                        {region.country} - {region.city}
                      </strong>
                      <button
                        onClick={() => {
                          setEditingRegion(region._id);
                          setEditData({
                            country: region.country || "",
                            city: region.city || "",
                          });
                        }}
                        style={{ marginLeft: "10px" }}
                      >
                        수정
                      </button>
                      <button
                        onClick={() => handleDeleteRegion(region._id)}
                        style={{
                          marginLeft: "10px",
                          backgroundColor: "red",
                          color: "white",
                        }}
                      >
                        삭제
                      </button>
                    </div>
                  )}
                </div>
              )
          )
        ) : (
          <p>등록된 지역이 없습니다.</p>
        )}
      </div>
    </div>
  );
};

export default RegionManagement;
