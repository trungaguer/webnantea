import React, { useEffect, useState, useMemo } from "react";
import { Spin, Empty } from "antd";
import { useNavigate } from "react-router-dom";

import SliderComponent from "../../components/SliderComponent/SliderComponent";
import CardComponent from "../../components/CardComponent/CardComponent";
import FooterComponent from "../../components/FooterComponent/FooterComponent";

import {
  WrapperContainer,
  WrapperCategory,
  WrapperProducts,
  WrapperTitle,
  WrapperButtonMore,
  WrapperMore,
} from "./style";

import slider1 from "../../assets/images/slider1.jpg";
import slider2 from "../../assets/images/download3.jpg";
import slider3 from "../../assets/images/download4.jpg";

const HomePage = () => {
  const navigate = useNavigate();

  // 🔥 FIX: label + value (đồng bộ với DB)
  const categories = useMemo(
    () => [
      { label: "Coffee", value: "coffee" },
      { label: "Milk Tea", value: "milk tea" },
      { label: "Tea", value: "tea" },
      { label: "Latte", value: "latte" },
      { label: "Smooth", value: "smooth" },
    ],
    [],
  );

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  const [activeCategory, setActiveCategory] = useState(null);

  // ================= NAVIGATION =================
  const handleNavigateProduct = (type) => {
    setActiveCategory(type);

    // 🔥 giữ đúng format với ProductsPage
    navigate(`/product?category=${type}`);
  };

  const handleNavigateAll = () => {
    setActiveCategory(null);
    navigate("/product");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // ================= FETCH =================
  useEffect(() => {
    let isMounted = true;

    const fetchAPI = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `${process.env.REACT_APP_API_URL}/product/get-all?limit=8&page=1`,
        );

        const data = await res.json();

        if (!isMounted) return;

        if (data?.status === "OK") {
          setProducts(data.data || []);
        } else {
          setProducts([]);
        }
      } catch (err) {
        console.log(err);
        if (isMounted) setProducts([]);
      }

      if (isMounted) setLoading(false);
    };

    fetchAPI();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <>
      <WrapperContainer>
        {/* CATEGORY */}
        <WrapperCategory>
          {categories.map((item) => (
            <div
              key={item.value}
              onClick={() => handleNavigateProduct(item.value)}
              className={`category-item ${
                activeCategory === item.value ? "active" : ""
              }`}
            >
              {item.label}
            </div>
          ))}
        </WrapperCategory>

        {/* SLIDER */}
        <SliderComponent arrImages={[slider1, slider2, slider3]} />

        {/* TITLE */}
        <WrapperTitle>
          <span>Sản phẩm nổi bật</span>
          <span className="view-all" onClick={handleNavigateAll}>
            Tất cả sản phẩm →
          </span>
        </WrapperTitle>

        {/* PRODUCTS */}
        <WrapperProducts>
          {loading ? (
            <div className="loading">
              <Spin size="large" />
            </div>
          ) : products.length > 0 ? (
            products.map((item) => (
              <CardComponent
                key={item._id}
                data={item}
                onClick={() => navigate(`/product-details/${item._id}`)}
              />
            ))
          ) : (
            <Empty description="Không có sản phẩm" />
          )}
        </WrapperProducts>

        {/* BUTTON MORE */}
        <WrapperMore>
          <WrapperButtonMore onClick={handleNavigateAll}>
            Xem thêm sản phẩm
          </WrapperButtonMore>
        </WrapperMore>
      </WrapperContainer>

      <FooterComponent />
    </>
  );
};

export default HomePage;
