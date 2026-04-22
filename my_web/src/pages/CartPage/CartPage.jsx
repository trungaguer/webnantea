import React from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  Row,
  Col,
  Image,
  Button,
  Divider,
  InputNumber,
  Card,
  message,
} from "antd";
import { useNavigate } from "react-router-dom";
import {
  removeFromCart,
  increaseAmount,
  decreaseAmount,
  updateAmount,
  clearCart,
} from "../../redux/slides/cartSlide";

const CartPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const cartItems = useSelector((state) => state.cart?.cartItems || []);

  // ================= TOTAL =================
  const totalPrice = cartItems.reduce((sum, item) => {
    const product = item?.product || item;
    const price = Number(product?.price || 0);
    const discount = Number(product?.discount || 0);
    const amount = Number(item?.amount || 1);

    return sum + price * (1 - discount / 100) * amount;
  }, 0);

  // ================= EMPTY =================
  if (!cartItems.length) {
    return <div style={{ padding: "2rem" }}>Giỏ hàng đang trống!</div>;
  }

  return (
    <div style={{ padding: "2rem", maxWidth: 1000, margin: "0 auto" }}>
      <h2 style={{ marginBottom: "1.5rem" }}>Giỏ Hàng</h2>

      {cartItems.map((item, index) => {
        const product = item?.product || item;

        const productId = product?._id || product?.id;
        if (!productId) {
          console.warn("INVALID CART ITEM:", item);
          return null;
        }

        const price = Number(product?.price || 0);
        const discount = Number(product?.discount || 0);
        const amount = Number(item?.amount || 1);
        const stock = Number(product?.countInStock || 0);

        const finalPrice = price * (1 - discount / 100);

        return (
          <Card
            key={productId}
            style={{ marginBottom: 16 }}
            styles={{ body: { padding: "12px 16px" } }} // ✅ FIX ANTD
          >
            <Row align="middle" gutter={16}>
              {/* IMAGE */}
              <Col span={4}>
                <Image
                  src={product?.image}
                  width={80}
                  preview={false}
                  fallback="/default-image.png"
                />
              </Col>

              {/* NAME */}
              <Col span={6}>
                <div>{product?.name}</div>
                <div style={{ fontSize: 12, color: "#888" }}>Còn: {stock}</div>
              </Col>

              {/* PRICE */}
              <Col span={4} style={{ fontWeight: "bold", color: "red" }}>
                {finalPrice.toLocaleString()}đ
              </Col>

              {/* QUANTITY */}
              <Col span={6} style={{ display: "flex", alignItems: "center" }}>
                <Button
                  disabled={amount <= 1}
                  onClick={() => dispatch(decreaseAmount(productId))}
                >
                  -
                </Button>

                <InputNumber
                  min={1}
                  max={stock || 1}
                  value={amount}
                  onChange={(value) => {
                    const safeValue = Math.max(
                      1,
                      Math.min(value || 1, stock || 1),
                    );

                    dispatch(
                      updateAmount({
                        id: productId,
                        amount: safeValue,
                      }),
                    );
                  }}
                  style={{ margin: "0 8px", width: 70 }}
                />

                <Button
                  disabled={amount >= stock}
                  onClick={() => {
                    if (amount >= stock) {
                      message.warning("Đã đạt số lượng tối đa");
                      return;
                    }
                    dispatch(increaseAmount(productId));
                  }}
                >
                  +
                </Button>
              </Col>

              {/* REMOVE */}
              <Col span={4}>
                <Button
                  danger
                  type="primary"
                  onClick={() => dispatch(removeFromCart(productId))}
                >
                  Xóa
                </Button>
              </Col>
            </Row>
          </Card>
        );
      })}

      <Divider />

      {/* TOTAL */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          fontWeight: "bold",
          fontSize: 18,
        }}
      >
        <span>Tổng tiền: {totalPrice.toLocaleString()}đ</span>

        <div style={{ display: "flex", gap: 12 }}>
          <Button
            danger
            onClick={() => {
              dispatch(clearCart());
              message.success("Đã xóa toàn bộ giỏ hàng");
            }}
          >
            Xóa tất cả
          </Button>

          <Button type="primary" onClick={() => navigate("/checkout")}>
            Thanh toán
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
