import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Row, Col, Empty, Spin, Select } from "antd";
import CardComponent from "../../components/CardComponent/CardComponent";

import {
  WrapperSearchPage,
  Container,
  WrapperHeader,
  Title,
  SubText,
  WrapperContent,
  WrapperCard,
  WrapperLoading,
  WrapperEmpty,
} from "./style";

const { Option } = Select;

const SearchPage = () => {
  const location = useLocation();
  const keyword = new URLSearchParams(location.search).get("keyword");

  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  const [sortType, setSortType] = useState("");

  // ================= FETCH =================
  useEffect(() => {
    const fetchAPI = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `${process.env.REACT_APP_API_URL}/product/get-all`,
        );
        const data = await res.json();

        if (data?.status === "OK") {
          const filtered = data.data.filter((item) =>
            item.name.toLowerCase().includes(keyword.toLowerCase()),
          );

          setProducts(filtered);
          setFilteredProducts(filtered);
        }
      } catch (err) {
        console.log(err);
      }
      setLoading(false);
    };

    if (keyword) fetchAPI();
  }, [keyword]);

  // ================= SORT =================
  useEffect(() => {
    let data = [...products];

    if (sortType === "price_asc") {
      data.sort((a, b) => a.price - b.price);
    }
    if (sortType === "price_desc") {
      data.sort((a, b) => b.price - a.price);
    }

    setFilteredProducts(data);
  }, [sortType, products]);

  return (
    <WrapperSearchPage>
      <Container>
        {/* HEADER */}
        <WrapperHeader>
          <Title>
            🔍 Kết quả cho: <span>{keyword}</span>
          </Title>
          <SubText>{filteredProducts.length} sản phẩm được tìm thấy</SubText>
        </WrapperHeader>

        {/* SORT */}
        <div style={{ marginBottom: 15 }}>
          <Select
            placeholder="Sắp xếp"
            style={{ width: 200 }}
            onChange={setSortType}
            allowClear
          >
            <Option value="price_asc">Giá tăng dần</Option>
            <Option value="price_desc">Giá giảm dần</Option>
          </Select>
        </div>

        {/* CONTENT */}
        <WrapperContent>
          {loading ? (
            <WrapperLoading>
              <Spin size="large" />
            </WrapperLoading>
          ) : filteredProducts.length > 0 ? (
            <Row gutter={[20, 20]}>
              {filteredProducts.map((item) => (
                <Col xs={24} sm={12} md={8} lg={6} key={item._id}>
                  <WrapperCard>
                    <CardComponent data={item} />
                  </WrapperCard>
                </Col>
              ))}
            </Row>
          ) : (
            <WrapperEmpty>
              <Empty
                description={
                  <span style={{ fontSize: 16 }}>
                    Không tìm thấy sản phẩm "<b>{keyword}</b>"
                  </span>
                }
              />
            </WrapperEmpty>
          )}
        </WrapperContent>
      </Container>
    </WrapperSearchPage>
  );
};

export default SearchPage;
