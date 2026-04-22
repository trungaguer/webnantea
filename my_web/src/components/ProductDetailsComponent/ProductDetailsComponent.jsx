import { Col, Row, Image } from "antd";
import React, { useEffect, useState } from "react";
import ButtonComponent from "../ButtonComponent/ButtonComponent";
import { MinusOutlined, PlusOutlined, StarFilled } from "@ant-design/icons";
import {
  WrapperAddressProduct,
  WrapperInputNumber,
  WrapperPriceProduct,
  WrapperPriceTextProduct,
  WrapperQualityProduct,
  WrapperStyleColImage,
  WrapperStyleImageSmall,
  WrapperStyleNameProduct,
  WrapperStyleTextSell,
} from "./style";
import { useParams, useNavigate } from "react-router-dom";
import { getDetailsUser, axiosJWT } from "../../services/UserService";
import { useDispatch } from "react-redux";
import { addToCart } from "../../redux/slides/cartSlide";

const ProductDetailsComponent = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [userAddress, setUserAddress] = useState("Chưa có địa chỉ");
  const [loadingAddress, setLoadingAddress] = useState(false);
  const [quantity, setQuantity] = useState(1);

  // ================= FETCH PRODUCT =================
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(
          `${process.env.REACT_APP_API_URL}/product/get-details/${id}`,
        );
        const data = await res.json();
        if (data?.status === "OK") setProduct(data.data);
      } catch (err) {
        console.log("ERROR PRODUCT:", err);
      }
    };
    if (id) fetchProduct();
  }, [id]);

  // ================= FETCH USER =================
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userId = localStorage.getItem("userId");
        if (!userId) return;

        const res = await axiosJWT.get(`/user/get-details/${userId}`);
        if (res.data?.status === "OK") {
          setUserAddress(res.data.data?.address || "Chưa có địa chỉ");
          return;
        }

        const fallback = await getDetailsUser(userId);
        if (fallback?.status === "OK") {
          setUserAddress(fallback.data?.address || "Chưa có địa chỉ");
        }
      } catch (err) {
        console.log("ERROR FETCH USER:", err);
      }
    };
    fetchUser();
  }, []);

  // ================= GET CURRENT ADDRESS =================
  const getCurrentAddress = () => {
    if (!navigator.geolocation) {
      alert("Trình duyệt không hỗ trợ định vị");
      return;
    }
    setLoadingAddress(true);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${position.coords.latitude}&lon=${position.coords.longitude}`,
          );
          const data = await res.json();
          const address = data.display_name;

          setUserAddress(address);
          setLoadingAddress(false);

          await axiosJWT.put("/user/update-address", { address });
        } catch (err) {
          console.log("ERROR GET ADDRESS:", err);
          setLoadingAddress(false);
        }
      },
      () => {
        alert("Bạn chưa cho phép truy cập vị trí");
        setLoadingAddress(false);
      },
    );
  };

  if (!product) return <div>Loading...</div>;

  const price = Number(product.price || 0);
  const discount = Number(product.discount || 0);
  const finalPrice = price * (1 - discount / 100);

  // ================= HANDLE QUANTITY =================
  const handleQuantityChange = (value) => {
    if (!value || value < 1) value = 1;
    if (value > product.countInStock) value = product.countInStock;
    setQuantity(value);
  };

  const increment = () => handleQuantityChange(quantity + 1);
  const decrement = () => handleQuantityChange(quantity - 1);

  // ================= FORMAT CART ITEM =================
  const buildCartItem = () => ({
    id: product._id,
    name: product.name,
    image: product.image,
    price: product.price,
    discount: product.discount,
    countInStock: product.countInStock,
    amount: quantity,
  });

  // ================= CART HANDLERS =================
  const handleAddToCart = () => {
    dispatch(addToCart(buildCartItem()));
    alert("Đã thêm vào giỏ hàng!");
  };

  const handleBuyNow = () => {
    dispatch(addToCart(buildCartItem()));
    navigate("/cart");
  };

  return (
    <Row style={{ padding: "16px", background: "#fff", borderRadius: "4px" }}>
      {/* IMAGE */}
      <Col
        span={10}
        style={{ borderRight: "1px solid #c5dbd6", paddingRight: "16px" }}
      >
        <Image src={product.image} alt="image product" preview={false} />
        <Row style={{ paddingTop: "16px", justifyContent: "space-between" }}>
          {[1, 2, 3, 4, 5].map((item) => (
            <WrapperStyleColImage span={4} key={item}>
              <WrapperStyleImageSmall
                src={product.image}
                alt="image small"
                preview={false}
              />
            </WrapperStyleColImage>
          ))}
        </Row>
      </Col>

      {/* INFO */}
      <Col span={14} style={{ paddingLeft: "10px" }}>
        <WrapperStyleNameProduct>{product.name}</WrapperStyleNameProduct>

        {/* RATING */}
        <div>
          {[...Array(Math.round(product.rating || 0))].map((_, index) => (
            <StarFilled key={index} style={{ fontSize: 12, color: "yellow" }} />
          ))}
          <WrapperStyleTextSell>
            {" "}
            | Đã bán {product.selled || 0}
          </WrapperStyleTextSell>
        </div>

        {/* PRICE */}
        <WrapperPriceProduct>
          <WrapperPriceTextProduct>
            {(finalPrice * quantity).toLocaleString()}đ
          </WrapperPriceTextProduct>
        </WrapperPriceProduct>

        {/* DESCRIPTION */}
        <div style={{ margin: "10px 0", lineHeight: "1.6" }}>
          <b>Mô tả sản phẩm:</b>
          <div style={{ whiteSpace: "pre-line" }}>
            {product.description || "Chưa có mô tả"}
          </div>
        </div>

        {/* ADDRESS */}
        <WrapperAddressProduct>
          <span style={{ fontWeight: "bold" }}>Giao đến:</span>
          <span className="address" style={{ marginLeft: 5 }}>
            {loadingAddress
              ? "Đang lấy vị trí..."
              : userAddress || "Bạn chưa cập nhật địa chỉ"}
          </span>

          <span
            className="change-address"
            onClick={getCurrentAddress}
            style={{
              color: "blue",
              cursor: "pointer",
              marginLeft: 10,
              textDecoration: "underline",
            }}
          >
            Thay đổi
          </span>
        </WrapperAddressProduct>

        {/* QUANTITY */}
        <div
          style={{
            margin: "10px 0 20px",
            borderTop: "1px solid #c5dbd6",
            borderBottom: "1px solid #c5dbd6",
            padding: "10px 0",
          }}
        >
          <div>Số lượng:</div>
          <WrapperQualityProduct>
            <button onClick={decrement}>
              <MinusOutlined />
            </button>

            <WrapperInputNumber
              min={1}
              max={product.countInStock}
              value={quantity}
              onChange={handleQuantityChange}
            />

            <button onClick={increment}>
              <PlusOutlined />
            </button>
          </WrapperQualityProduct>
        </div>

        {/* BUTTON */}
        <div style={{ display: "flex", gap: "12px" }}>
          <ButtonComponent
            size={40}
            styleButton={{ backgroundColor: "red", width: 220 }}
            textButton={"Mua ngay"}
            styleTextButton={{ color: "#fff", fontWeight: "700" }}
            onClick={handleBuyNow}
          />
          <ButtonComponent
            size={40}
            styleButton={{ backgroundColor: "#cde020", width: 220 }}
            textButton={"Thêm vào giỏ"}
            onClick={handleAddToCart}
          />
        </div>
      </Col>
    </Row>
  );
};

export default ProductDetailsComponent;
