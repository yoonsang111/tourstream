// src/App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import ProductList from "./pages/ProductList";
import ProductForm from "./pages/ProductForm";
import RegionManagement from "./pages/RegionManagement"; // 지역 관리 페이지 추가
import CategoryManagement from "./pages/CategoryManagement"; // 카테고리 관리 페이지 추가

function App() {
  return (
    <Router>
      <div style={{ display: "flex", height: "100vh" }}>
        {/* 좌측 사이드바 */}
        <Sidebar />
        <div style={{ flex: 1 }}>
          {/* 상단 헤더 */}
          <Header />
          {/* 페이지 콘텐츠 */}
          <div style={{ padding: "20px" }}>
            <Routes>
              {/* 상품 관련 라우트 */}
              <Route path="/product-list" element={<ProductList />} />
              <Route path="/product-form" element={<ProductForm />} />

              {/* 지역 관리 라우트 */}
              <Route path="/regions" element={<RegionManagement />} />

              {/* 카테고리 관리 라우트 */}
              <Route path="/categories" element={<CategoryManagement />} />

              {/* 기본 페이지 */}
              <Route
                path="/"
                element={<h2>환영합니다! 관리자 페이지입니다.</h2>}
              />
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App;
