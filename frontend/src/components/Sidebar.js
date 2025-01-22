import React, { useState } from "react";
import { Link } from "react-router-dom";

function Sidebar() {
  const [isProductOpen, setIsProductOpen] = useState(false);

  return (
    <div
      style={{
        width: "250px",
        background: "#f8f9fa",
        height: "100vh",
        padding: "20px",
      }}
    >
      <h2>메뉴</h2>
      <div>
        {/* 상위 메뉴 */}
        <div
          onClick={() => setIsProductOpen(!isProductOpen)}
          style={{ cursor: "pointer", marginBottom: "10px" }}
        >
          상품
        </div>
        {isProductOpen && (
          <div style={{ paddingLeft: "20px" }}>
            {/* 하위 메뉴 */}
            <div style={{ marginBottom: "5px" }}>
              <Link to="/product-form">상품등록</Link>
            </div>
            <div>
              <Link to="/product-list">상품목록</Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Sidebar;
