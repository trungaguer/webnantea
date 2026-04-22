import React, { useEffect, useState } from "react";
import NavbarComponent from "../../components/NavbarComponent/NavbarComponent";
import CardComponent from "../../components/CardComponent/CardComponent";
import { Row, Pagination, Col, Spin, Empty } from "antd";
import { WrapperProducts, WrapperNavbar } from "./style";
import { useLocation, useNavigate } from "react-router-dom";

const TypeProductsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  const [page, setPage] = useState(1);
  const [limit] = useState(8);
  const [total, setTotal] = useState(0);

  // ================= PAGINATION =================
  const onChange = (pageNumber) => {
    const params = new URLSearchParams(location.search);
    params.set("page", pageNumber);

    navigate(`${location.pathname}?${params.toString()}`);

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // ================= FILTER =================
  const handleFilter = ({ type, value }) => {
    const params = new URLSearchParams(location.search);

    if (type === "category") params.set("type", value.toLowerCase());
    if (type === "rating") params.set("rating", value);
    if (type === "price") params.set("price", value);

    params.set("page", 1);

    navigate(`${location.pathname}?${params.toString()}`);
  };

  // ================= FETCH =================
  useEffect(() => {
    let isMounted = true;

    const fetchAPI = async () => {
      setLoading(true);

      try {
        const params = new URLSearchParams(location.search);

        const type = params.get("type");
        const rating = params.get("rating");
        const price = params.get("price");
        const currentPage = params.get("page") || 1;

        let url = `${process.env.REACT_APP_API_URL}/product/get-all?page=${currentPage}&limit=${limit}`;

        if (type) url += `&type=${type}`;
        if (rating) url += `&rating=${rating}`;
        if (price) url += `&price=${encodeURIComponent(price)}`;

        const res = await fetch(url);
        const data = await res.json();

        if (!isMounted) return;

        if (data?.status === "OK") {
          let result = data.data || [];

          // 🔥 fallback FE (siêu quan trọng)
          if (type) {
            result = result.filter(
              (item) => item.type?.toLowerCase() === type.toLowerCase(),
            );
          }

          if (rating) {
            result = result.filter(
              (item) => Math.floor(item.rating || 0) >= Number(rating),
            );
          }

          if (price) {
            if (price.includes("Dưới")) {
              result = result.filter((item) => item.price < 50000);
            } else if (price.includes("50.000")) {
              result = result.filter(
                (item) => item.price >= 50000 && item.price <= 100000,
              );
            } else {
              result = result.filter((item) => item.price > 100000);
            }
          }

          setProducts(result);
          setTotal(data.total || result.length);
          setPage(Number(currentPage));
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
  }, [location.search, limit]);

  // ================= UI =================
  return (
    <div
      style={{
        padding: "0 80px",
        background: "#c5dbd6",
        minHeight: "100vh",
      }}
    >
      <Row gutter={[20, 20]} style={{ paddingTop: "20px" }}>
        {/* NAVBAR */}
        <WrapperNavbar span={4}>
          <NavbarComponent onFilter={handleFilter} />
        </WrapperNavbar>

        {/* PRODUCTS */}
        <Col span={20}>
          <h2 style={{ marginBottom: "10px" }}>Kết quả sản phẩm</h2>

          {loading ? (
            <div style={{ textAlign: "center", marginTop: "100px" }}>
              <Spin size="large" />
            </div>
          ) : (
            <>
              <WrapperProducts>
                {products.length > 0 ? (
                  products.map((item) => (
                    <CardComponent key={item._id} data={item} />
                  ))
                ) : (
                  <div style={{ width: "100%" }}>
                    <Empty description="Không có sản phẩm phù hợp" />
                  </div>
                )}
              </WrapperProducts>

              <Pagination
                current={page}
                pageSize={limit}
                total={total}
                onChange={onChange}
                style={{
                  textAlign: "center",
                  marginTop: "30px",
                }}
              />
            </>
          )}
        </Col>
      </Row>
    </div>
  );
};

export default TypeProductsPage;
