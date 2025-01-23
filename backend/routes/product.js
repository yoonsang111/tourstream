import React, { useEffect, useState } from "react";
import {
  getProducts,
  deleteProduct,
  toggleProductVisibility,
} from "../api/productApi";

function ProductList() {
  const [products, setProducts] = useState([]);

  // 상품 목록 가져오기
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const productList = await getProducts();
        setProducts(productList);
      } catch (error) {
        alert("상품 목록 가져오기 실패: " + error.message);
      }
    };
    fetchProducts();
  }, []);

  // 상품 삭제
  const handleDelete = async (id) => {
    if (window.confirm("정말로 이 상품을 삭제하시겠습니까?")) {
      try {
        await deleteProduct(id);
        setProducts((prev) => prev.filter((product) => product._id !== id));
      } catch (error) {
        alert("상품 삭제 실패: " + error.message);
      }
    }
  };

  // 판매 상태 변경
  const handleToggleVisibility = async (id, isVisible) => {
    const action = isVisible ? "판매중지" : "판매재개";
    if (window.confirm(`정말로 이 상품을 ${action}하시겠습니까?`)) {
      try {
        const updatedProduct = await toggleProductVisibility(id, !isVisible);
        setProducts((prev) =>
          prev.map((product) => (product._id === id ? updatedProduct : product))
        );
      } catch (error) {
        alert(`상품 ${action} 실패: ` + error.message);
      }
    }
  };

  return (
    <div>
      <h2>상품 목록</h2>
      <table border="1" style={{ width: "100%", textAlign: "left" }}>
        <thead>
          <tr>
            <th>상품명</th>
            <th>설명</th>
            <th>가격</th>
            <th>상태</th>
            <th>작업</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product._id}>
              <td>{product.name}</td>
              <td>{product.description}</td>
              <td>{product.price || "없음"}</td>
              <td>{product.isVisible ? "판매중" : "판매중지"}</td>
              <td>
                <button onClick={() => handleDelete(product._id)}>삭제</button>
                <button
                  onClick={() =>
                    handleToggleVisibility(product._id, product.isVisible)
                  }
                >
                  {product.isVisible ? "판매중지" : "판매재개"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ProductList;
