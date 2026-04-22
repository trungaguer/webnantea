import React, { useEffect, useState, useCallback, useMemo } from "react";
import { Table, Tag, Button, message, Spin, Input, DatePicker } from "antd";
import * as OrderService from "../../services/OrderService";
import AdminModal from "./AdminModal";
import { Wrapper } from "./style";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import dayjs from "dayjs"; // ✅ thêm

const { RangePicker } = DatePicker;

const AdminOrder = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  // ===== FILTER STATE =====
  const [searchText, setSearchText] = useState("");
  const [dateRange, setDateRange] = useState([]);

  const access_token = localStorage.getItem("access_token");

  // ================= FETCH =================
  const fetchOrders = useCallback(async () => {
    if (!access_token) return;

    setLoading(true);
    try {
      const res = await OrderService.getAllOrders(access_token);
      setOrders(Array.isArray(res?.data) ? res.data : []);
    } catch (e) {
      message.error("Lỗi tải đơn hàng");
    } finally {
      setLoading(false);
    }
  }, [access_token]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  // ================= STATUS =================
  const getStatusColor = (status) => {
    switch (status) {
      case "CONFIRMED":
        return "blue";
      case "SHIPPING":
        return "purple";
      case "DELIVERED":
        return "green";
      case "CANCELLED":
        return "red";
      default:
        return "orange";
    }
  };

  // ================= FILTER DATA =================
  const filteredOrders = useMemo(() => {
    const search = searchText.trim().toLowerCase();

    return orders.filter((order) => {
      const name = order?.shippingAddress?.fullName?.toLowerCase() || "";
      const id = order?._id?.toLowerCase() || "";

      const matchSearch = name.includes(search) || id.includes(search);

      let matchDate = true;
      if (dateRange && dateRange.length === 2) {
        const orderDate = new Date(order.createdAt).getTime();

        const start = dateRange[0].startOf("day").valueOf();
        const end = dateRange[1].endOf("day").valueOf();

        matchDate = orderDate >= start && orderDate <= end;
      }

      return matchSearch && matchDate;
    });
  }, [orders, searchText, dateRange]);

  // ================= EXPORT EXCEL =================
  const exportExcel = () => {
    const data = filteredOrders.map((o) => ({
      "Mã đơn": o._id,
      "Khách hàng": o.shippingAddress?.fullName,
      SĐT: o.shippingAddress?.phone,
      "Tổng tiền": o.totalPrice,
      "Trạng thái": o.status,
      "Ngày tạo": o.createdAt,
    }));

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Orders");

    const excelBuffer = XLSX.write(wb, {
      bookType: "xlsx",
      type: "array",
    });

    const file = new Blob([excelBuffer], {
      type: "application/octet-stream",
    });

    saveAs(file, `orders_${Date.now()}.xlsx`);
  };

  // ================= COLUMNS =================
  const columns = [
    {
      title: "Mã đơn",
      dataIndex: "_id",
      render: (id) => id?.slice(-6) || "---",
      sorter: (a, b) => a._id.localeCompare(b._id),
    },
    {
      title: "Khách hàng",
      dataIndex: ["shippingAddress", "fullName"],
    },
    {
      title: "Tổng tiền",
      dataIndex: "totalPrice",
      sorter: (a, b) => a.totalPrice - b.totalPrice,
      render: (v) => (v ? v.toLocaleString() + "đ" : "---"),
    },

    // ✅ THÊM CỘT NGÀY (không thay đổi format cũ)
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
      render: (date) => (date ? dayjs(date).format("DD/MM/YYYY HH:mm") : "---"),
    },

    {
      title: "Trạng thái",
      dataIndex: "status",
      filters: [
        { text: "PENDING", value: "PENDING" },
        { text: "CONFIRMED", value: "CONFIRMED" },
        { text: "SHIPPING", value: "SHIPPING" },
        { text: "DELIVERED", value: "DELIVERED" },
        { text: "CANCELLED", value: "CANCELLED" },
      ],
      onFilter: (value, record) => record.status === value,
      render: (status) => (
        <Tag color={getStatusColor(status)}>{status || "PENDING"}</Tag>
      ),
    },
    {
      title: "Hành động",
      render: (_, record) => (
        <Button onClick={() => setSelectedOrder(record)}>Xem</Button>
      ),
    },
  ];

  if (loading) {
    return (
      <div style={{ textAlign: "center", marginTop: 50 }}>
        <Spin size="large" />
      </div>
    );
  }

  // ================= UPDATE STATUS =================
  const updateStatus = async (id, data, msg) => {
    if (!id) return;

    try {
      await OrderService.updateOrder(id, data, access_token);

      message.success(msg);

      setOrders((prev) =>
        prev.map((order) => (order._id === id ? { ...order, ...data } : order)),
      );

      setSelectedOrder(null);
    } catch (e) {
      console.error("UPDATE ORDER ERROR:", e);
      message.error(e?.response?.data?.message || "Lỗi cập nhật");
    }
  };

  return (
    <Wrapper>
      {/* ===== FILTER BAR ===== */}
      <div style={{ display: "flex", gap: 10, marginBottom: 15 }}>
        <Input
          placeholder="Tìm theo mã đơn / tên khách..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          style={{ width: 300 }}
        />

        <RangePicker
          value={dateRange}
          onChange={(values) => setDateRange(values || [])}
        />

        <Button type="primary" onClick={exportExcel}>
          Xuất Excel
        </Button>

        <Button
          onClick={() => {
            setSearchText("");
            setDateRange([]);
          }}
        >
          Reset
        </Button>
      </div>

      {/* ===== TABLE ===== */}
      <Table
        dataSource={filteredOrders}
        columns={columns}
        rowKey={(record) => record._id}
        pagination={{ pageSize: 10 }}
      />

      <AdminModal
        order={selectedOrder}
        onClose={() => setSelectedOrder(null)}
        onConfirm={(id) =>
          updateStatus(id, { status: "CONFIRMED" }, "Đã xác nhận")
        }
        onShipping={(id) =>
          updateStatus(id, { status: "SHIPPING" }, "Đang giao")
        }
        onDelivered={(id) =>
          updateStatus(
            id,
            { status: "DELIVERED", isDelivered: true },
            "Đã giao",
          )
        }
        onCancel={(id) => updateStatus(id, { status: "CANCELLED" }, "Đã huỷ")}
      />
    </Wrapper>
  );
};

export default AdminOrder;
