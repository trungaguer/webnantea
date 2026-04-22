import React from "react";
import { Modal, Table } from "antd";

const AdminRevenueModal = ({ open, onCancel, data }) => {
  // ================= FORMAT =================
  const formatMoney = (value) => {
    return (value || 0).toLocaleString("vi-VN") + " VND";
  };

  // ================= COLUMNS =================
  const columns = [
    {
      title: "Ngày",
      dataIndex: "_id",
      render: (d) => {
        if (!d) return "";
        return `${d.day}/${d.month}/${d.year}`;
      },
    },
    {
      title: "Doanh thu",
      dataIndex: "revenue",
      render: (v) => formatMoney(v),
    },
    {
      title: "Đơn",
      dataIndex: "orders",
    },
  ];

  return (
    <Modal
      title="Chi tiết doanh thu"
      open={open}
      onCancel={onCancel}
      footer={null}
      width={800} // 👈 rộng hơn cho đẹp
    >
      <Table
        columns={columns}
        dataSource={data || []}
        rowKey={(r) => `${r._id.day}-${r._id.month}-${r._id.year}`}
        pagination={{ pageSize: 5 }}
        scroll={{ y: 300 }}
      />
    </Modal>
  );
};

export default AdminRevenueModal;
