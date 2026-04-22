import React, { useEffect, useState } from "react";
import { Row, Col, Pagination, Spin, Empty } from "antd";
import { useLocation } from "react-router-dom"; // 🔥 ADD
import NavbarComponent from "../../components/NavbarComponent/NavbarComponent";
import CardComponent from "../../components/CardComponent/CardComponent";
import * as ProductService from "../../services/ProductService";
import FooterComponent from "../../components/FooterComponent/FooterComponent";

const ProductsPage = () => {
  const location = useLocation(); // 🔥 ADD

  const [rawProducts, setRawProducts] = useState([]);
  const [products, setProducts] = useState([]);

  const [loading, setLoading] = useState(false);

  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  const [filters, setFilters] = useState({
    category: null,
    price: null,
    rating: null,
    checkbox: [],
  });

  const limit = 8;

  // ================= FETCH =================
  const fetchProduct = async (pageNumber) => {
    setLoading(true);

    const res = await ProductService.getAllProduct(limit, pageNumber);

    if (res?.status === "OK") {
      setRawProducts(res.data);
      setTotal(res.total);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchProduct(page);
  }, [page]);

  // 🔥 FIX: SYNC CATEGORY FROM URL
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const category = params.get("category");

    setFilters((prev) => ({
      ...prev,
      category: category || null,
    }));

    setPage(1); // 🔥 reset page khi đổi category
  }, [location.search]);

  // ================= APPLY FILTER =================
  const applyFilters = (data, currentFilters) => {
    let result = [...data];

    // CATEGORY
    if (currentFilters.category) {
      result = result.filter(
        (item) =>
          item.type?.toLowerCase() === currentFilters.category.toLowerCase(),
      );
    }

    // PRICE
    if (currentFilters.price) {
      const { min = 0, max = Infinity } = currentFilters.price;

      result = result.filter((item) => {
        const price = Number(item.price) * (1 - (item.discount || 0) / 100); // 🔥 FIX discount

        return price >= min && price <= max;
      });
    }

    // RATING
    if (currentFilters.rating) {
      result = result.filter(
        (item) => Number(item.rating ?? 0) >= Number(currentFilters.rating),
      );
    }

    // CHECKBOX
    if (currentFilters.checkbox?.length > 0) {
      result = result.filter((item) =>
        currentFilters.checkbox.includes(item.type),
      );
    }

    return result;
  };

  // ================= HANDLE FILTER =================
  const handleFilter = ({ type, value }) => {
    let newFilters = { ...filters };

    if (type === "reset") {
      newFilters = {
        category: null,
        price: null,
        rating: null,
        checkbox: [],
      };
    }

    if (type === "category") newFilters.category = value;
    if (type === "price") newFilters.price = value;
    if (type === "rating") newFilters.rating = value;
    if (type === "checkbox") newFilters.checkbox = value;

    setFilters(newFilters);

    // 🔥 FIX: luôn về page 1 khi filter
    setPage(1);
  };

  // ================= RE-CALCULATE =================
  useEffect(() => {
    const filtered = applyFilters(rawProducts, filters);
    setProducts(filtered);
  }, [rawProducts, filters]);

  // ================= PAGE CHANGE =================
  const handlePageChange = (p) => {
    setPage(p);
  };

  return (
    <>
      <Row gutter={[20, 20]}>
        {/* FILTER */}
        <Col span={5}>
          <div
            style={{
              background: "#fff",
              padding: 16,
              borderRadius: 12,
              boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
              position: "sticky",
              top: 20,
            }}
          >
            <NavbarComponent onFilter={handleFilter} />
          </div>
        </Col>

        {/* PRODUCTS */}
        <Col span={19}>
          {loading ? (
            <div style={{ textAlign: "center", padding: 50 }}>
              <Spin />
            </div>
          ) : (
            <>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(4, 1fr)",
                  gap: 20,
                  minHeight: 300,
                }}
              >
                {products.length > 0 ? (
                  products.map((item) => (
                    <CardComponent key={item._id} data={item} />
                  ))
                ) : (
                  <div style={{ gridColumn: "span 4" }}>
                    <Empty description="Không có sản phẩm" />
                  </div>
                )}
              </div>

              {/* PAGINATION */}
              <div style={{ marginTop: 20, textAlign: "center" }}>
                <Pagination
                  current={page}
                  total={total}
                  pageSize={limit}
                  onChange={handlePageChange}
                />
              </div>
            </>
          )}
        </Col>
      </Row>

      {/* 🔥 FIX: render footer đúng chỗ */}
      <FooterComponent />
    </>
  );
};

export default ProductsPage;
