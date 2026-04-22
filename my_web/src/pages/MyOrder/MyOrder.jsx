import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchOrdersAsync,
  cancelOrderAsync,
} from "../../redux/slides/orderSlide";

import {
  Card,
  Spin,
  Empty,
  Tag,
  Divider,
  Button,
  Popconfirm,
  Space,
  message,
} from "antd";

const MyOrder = () => {
  const dispatch = useDispatch();
  const { orders, isLoading, error } = useSelector((state) => state.order);
  const user = useSelector((state) => state.user);

  const [actionLoading, setActionLoading] = useState(null);

  // ================= FETCH =================
  useEffect(() => {
    if (user?.id) {
      dispatch(fetchOrdersAsync());
    }
  }, [dispatch, user?.id]);

  // ================= CANCEL =================
  const handleCancel = async (id) => {
    try {
      setActionLoading(id + "_cancel");
      await dispatch(cancelOrderAsync(id)).unwrap();

      // 🔥 thêm: reload lại list sau khi hủy
      await dispatch(fetchOrdersAsync());

      message.success("Đã hủy đơn hàng");
    } catch (err) {
      message.error(err || "Hủy đơn thất bại");
    } finally {
      setActionLoading(null);
    }
  };

  // ================= LOADING =================
  if (isLoading) {
    return <Spin style={{ display: "block", marginTop: 50 }} />;
  }

  // ================= ERROR =================
  if (error) {
    return <div style={{ color: "red" }}>Lỗi: {error}</div>;
  }

  // ================= EMPTY =================
  if (!orders || !orders.length) {
    return <Empty description="Chưa có đơn hàng nào" />;
  }

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Đơn hàng của tôi</h2>

      {orders.map((order) => {
        const createdAt = order?.createdAt
          ? new Date(order.createdAt).toLocaleString("vi-VN")
          : "Không xác định";

        const updatedAt = order?.updatedAt
          ? new Date(order.updatedAt).toLocaleString("vi-VN")
          : null;

        // 🔥 FIX: đúng theo backend
        const isCancelled = order?.status === "CANCELLED";
        const isDelivered = order?.status === "DELIVERED";

        return (
          <Card
            key={order._id}
            style={{
              marginBottom: 16,
              borderRadius: 10,
              opacity: isCancelled ? 0.7 : 1,
            }}
            title={
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span>Đơn hàng: {order._id}</span>

                <Space>
                  {/* PAYMENT STATUS */}
                  <Tag color={order.isPaid ? "green" : "orange"}>
                    {order.isPaid ? "Đã thanh toán" : "Chưa thanh toán"}
                  </Tag>

                  {/* ORDER STATUS */}
                  <Tag
                    color={
                      order.status === "DELIVERED"
                        ? "green"
                        : order.status === "CANCELLED"
                          ? "red"
                          : "blue"
                    }
                  >
                    {order.status === "DELIVERED"
                      ? "Đã giao"
                      : order.status === "CANCELLED"
                        ? "Đã hủy"
                        : "Đang xử lý"}
                  </Tag>
                </Space>
              </div>
            }
          >
            {/* ================= DATE ================= */}
            <p>
              🕒 Ngày đặt: <b>{createdAt}</b>
            </p>

            {updatedAt && (
              <p>
                🔄 Cập nhật: <b>{updatedAt}</b>
              </p>
            )}

            <Divider />

            {/* ================= ITEMS ================= */}
            <p style={{ fontWeight: 600 }}>Sản phẩm:</p>

            {order.orderItems?.map((item, index) => {
              const product = item?.product;

              return (
                <div
                  key={index}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    padding: "4px 0",
                  }}
                >
                  <span>
                    • {product?.name || "Sản phẩm"} x {item?.amount}
                  </span>

                  <span>
                    {product?.price
                      ? (product.price * item.amount).toLocaleString()
                      : 0}
                    đ
                  </span>
                </div>
              );
            })}

            <Divider />

            {/* ================= TOTAL ================= */}
            <p style={{ fontSize: 16, fontWeight: "bold" }}>
              💰 Tổng tiền: {order.totalPrice?.toLocaleString() || 0}đ
            </p>

            <Divider />

            {/* ================= ACTIONS ================= */}
            <Space>
              <Popconfirm
                title="Hủy đơn hàng?"
                onConfirm={() => handleCancel(order._id)}
                okText="Yes"
                cancelText="No"
                disabled={isCancelled || isDelivered}
              >
                <Button
                  danger
                  loading={actionLoading === order._id + "_cancel"}
                  disabled={isCancelled || isDelivered}
                >
                  Hủy đơn
                </Button>
              </Popconfirm>
            </Space>
          </Card>
        );
      })}
    </div>
  );
};

export default MyOrder;
