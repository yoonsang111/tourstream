import React from "react";
import { Link } from "react-router-dom";

const Sidebar = () => {
  return (
    <div
      style={{ padding: "20px", backgroundColor: "#f7f7f7", height: "100vh" }}
    >
      <h3 style={{ marginBottom: "20px" }}>메뉴</h3>
      <ul style={{ listStyle: "none", padding: "0" }}>
        <li style={{ marginBottom: "10px" }}>
          <Link to="/products">상품 목록</Link>
        </li>
        <li style={{ marginBottom: "10px" }}>
          <Link to="/product-form">상품 등록</Link>
        </li>
        <li style={{ marginBottom: "10px" }}>
          <Link to="/categories">카테고리 관리</Link>{" "}
          {/* 카테고리 관리 메뉴 추가 */}
        </li>
        <li>
          <Link to="/regions">지역 관리</Link> {/* 지역 관리 메뉴 추가 */}
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
