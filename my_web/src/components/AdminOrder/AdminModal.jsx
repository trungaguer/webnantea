import React from "react";
import { Modal, Table, Button, Tag } from "antd";

const AdminModal = ({
  order,
  onClose,
  onConfirm,
  onShipping,
  onDelivered,
  onCancel,
}) => {
  if (!order) return null;

  // ================= FORMAT ADDRESS =================
  const formatAddress = (shippingAddress) => {
    if (!shippingAddress) return "Chưa có địa chỉ";

    const { address, city } = shippingAddress;

    // Nếu là địa chỉ GPS → không nối nữa (tránh trùng)
    if (address && address.includes(",")) return address;

    return [address, city].filter(Boolean).join(", ") || "Chưa có địa chỉ";
  };

  // ================= TABLE =================
  const columns = [
    {
      title: "Tên",
      dataIndex: "name",
      render: (_, item) => item?.name || "Sản phẩm",
    },
    {
      title: "SL",
      dataIndex: "amount",
    },
    {
      title: "Giá",
      render: (_, item) => {
        const price = Number(item?.price || 0);
        const discount = Number(item?.discount || 0);
        return (price * (1 - discount / 100)).toLocaleString() + "đ";
      },
    },
  ];

  // ================= FIX rowKey (KHÔNG DÙNG INDEX) =================
  const getRowKey = (item) => {
    return item?.product || item?._id;
  };

  // ================= FOOTER FIX KEY =================
  const footer = [];

  if (order.status === "PENDING") {
    footer.push(
      <Button key="confirm" type="primary" onClick={() => onConfirm(order._id)}>
        Xác nhận
      </Button>,
    );
  }

  if (order.status === "CONFIRMED") {
    footer.push(
      <Button key="shipping" onClick={() => onShipping(order._id)}>
        Giao hàng
      </Button>,
    );
  }

  if (order.status === "SHIPPING") {
    footer.push(
      <Button key="delivered" onClick={() => onDelivered(order._id)}>
        Hoàn thành
      </Button>,
    );
  }

  if (order.status !== "DELIVERED" && order.status !== "CANCELLED") {
    footer.push(
      <Button key="cancel" danger onClick={() => onCancel(order._id)}>
        Huỷ
      </Button>,
    );
  }

  footer.push(
    <Button key="close" onClick={onClose}>
      Đóng
    </Button>,
  );

  return (
    <Modal
      open={!!order}
      onCancel={onClose}
      footer={footer}
      title={`Đơn hàng #${order._id.slice(-6)}`}
    >
      {/* CUSTOMER */}
      <p>
        <b>Khách:</b> {order.shippingAddress?.fullName || "Ẩn danh"}
      </p>

      {/* ADDRESS */}
      <p style={{ lineHeight: "1.6", wordBreak: "break-word" }}>
        <b>Địa chỉ:</b> {formatAddress(order.shippingAddress)}
      </p>

      {/* PAYMENT */}
      <p>
        <b>Thanh toán:</b>{" "}
        {order.isPaid ? (
          <Tag color="green">Đã thanh toán</Tag>
        ) : (
          <Tag color="red">Chưa thanh toán</Tag>
        )}
      </p>

      {/* TABLE */}
      <Table
        dataSource={order.orderItems || []}
        columns={columns}
        pagination={false}
        rowKey={getRowKey} // ✅ FIX
      />

      {/* TOTAL */}
      <div style={{ textAlign: "right", marginTop: 10 }}>
        <b>Tổng:</b> {(order.totalPrice || 0).toLocaleString()}đ
      </div>
    </Modal>
  );
};

export default AdminModal;
