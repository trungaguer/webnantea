import React from "react";
import { Breadcrumb } from "antd";
import { useNavigate } from "react-router-dom";
import ProductDetailsComponent from "../../components/ProductDetailsComponent/ProductDetailsComponent";

const ProductDetailsPage = () => {
  const navigate = useNavigate();

  const items = [
    {
      title: (
        <span onClick={() => navigate("/")} style={{ cursor: "pointer" }}>
          Trang chủ
        </span>
      ),
    },
    {
      title: (
        <span
          onClick={() => navigate("/product")}
          style={{ cursor: "pointer" }}
        >
          Sản phẩm
        </span>
      ),
    },
    {
      title: "Chi tiết sản phẩm",
    },
  ];

  return (
    <div
      style={{
        padding: "0 120px",
        background: "#c5dbd6",
        minHeight: "100vh",
      }}
    >
      <Breadcrumb items={items} />

      <ProductDetailsComponent />
    </div>
  );
};

export default ProductDetailsPage;
