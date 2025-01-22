import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import ProductForm from "./pages/ProductForm"; // 상품 등록 페이지
import ProductList from "./pages/ProductList"; // 상품 목록 페이지

function App() {
  return (
    <Router>
      <div style={{ display: "flex", height: "100vh" }}>
        {/* 좌측 메뉴바 */}
        <Sidebar />
        <div style={{ flex: 1 }}>
          {/* 상단 헤더 */}
          <Header />
          {/* 페이지 컨텐츠 */}
          <div style={{ padding: "20px" }}>
            <Routes>
              <Route path="/product-form" element={<ProductForm />} />
              <Route path="/product-list" element={<ProductList />} />
              {/* 기본 페이지 */}
              <Route path="/" element={<h2>메인 페이지</h2>} />
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App;
