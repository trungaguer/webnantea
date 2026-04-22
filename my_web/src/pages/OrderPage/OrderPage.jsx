import React, { useEffect, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Card, List, Image, Badge, Spin, Alert, Empty } from "antd";
import { fetchOrdersAsync } from "../../redux/slides/orderSlide";

const OrderPage = () => {
  const dispatch = useDispatch();

  // ================= SAFE SELECTOR =================
  const orderState = useSelector((state) => state.order);

  const orders = orderState?.orders ?? [];
  const isLoading = orderState?.isLoading ?? false;
  const error = orderState?.error ?? null;

  // ================= USER ID =================
  const userId = useMemo(() => {
    return localStorage.getItem("user_id");
  }, []);

  // ================= FETCH ORDERS =================
  useEffect(() => {
    if (userId) {
      dispatch(fetchOrdersAsync(userId)); // 🔥 FIX: nên truyền userId
    }
  }, [dispatch, userId]);

  // ================= LOADING =================
  if (isLoading) {
    return (
      <div style={{ textAlign: "center", padding: "2rem" }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Đơn Hàng Của Tôi</h2>

      {/* ================= ERROR ================= */}
      {error && (
        <Alert
          message="Lỗi"
          description={error}
          type="error"
          showIcon
          style={{ marginBottom: "1rem" }}
        />
      )}

      {/* ================= EMPTY ================= */}
      {orders.length === 0 ? (
        <Empty description="Bạn chưa có đơn hàng nào" />
      ) : (
        orders.map((order) => (
          <Card
            key={order._id}
            title={`Mã đơn: ${order._id}`}
            extra={
              <Badge
                status={
                  order.status === "pending"
                    ? "warning"
                    : order.status === "completed"
                      ? "success"
                      : "error"
                }
                text={(order.status || "unknown").toUpperCase()}
              />
            }
            style={{ marginBottom: "1rem" }}
          >
            {/* ================= ITEMS ================= */}
            {order.orderItems?.length > 0 ? (
              <List
                itemLayout="horizontal"
                dataSource={order.orderItems}
                renderItem={(item) => (
                  <List.Item>
                    <List.Item.Meta
                      avatar={
                        <Image
                          width={60}
                          src={item.image}
                          fallback="https://via.placeholder.com/60"
                        />
                      }
                      title={item.name}
                      description={`Số lượng: ${
                        item.amount ?? 0
                      } x ${(item.price ?? 0).toLocaleString()} đ`}
                    />
                    <div style={{ fontWeight: 500 }}>
                      {(
                        (item.amount ?? 0) * (item.price ?? 0)
                      ).toLocaleString()}{" "}
                      đ
                    </div>
                  </List.Item>
                )}
              />
            ) : (
              <Empty description="Không có sản phẩm" />
            )}

            {/* ================= TOTAL ================= */}
            <div style={{ marginTop: "1rem", fontWeight: "bold" }}>
              Tổng tiền: {(order.totalPrice ?? 0).toLocaleString()} đ
            </div>

            {/* ================= ADDRESS ================= */}
            {order.shippingAddress && (
              <div style={{ marginTop: "0.5rem" }}>
                Địa chỉ giao hàng:{" "}
                {typeof order.shippingAddress === "object"
                  ? `${order.shippingAddress.address ?? ""}, ${
                      order.shippingAddress.city ?? ""
                    }`
                  : order.shippingAddress}
              </div>
            )}
          </Card>
        ))
      )}
    </div>
  );
};

export default OrderPage;
