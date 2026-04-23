import React, { useEffect, useState, useCallback } from "react";
import {
  Card,
  Row,
  Col,
  Select,
  Spin,
  DatePicker,
  Button,
  Table,
  Space,
  Empty,
  message,
  Statistic,
} from "antd";
import axios from "axios";
import { Bar } from "react-chartjs-2";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import dayjs from "dayjs";
import * as S from "./style";

import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const { Option } = Select;
const { RangePicker } = DatePicker;

const AdminRevenue = () => {
  const [loading, setLoading] = useState(false);

  const [total, setTotal] = useState({
    totalRevenue: 0,
    totalOrders: 0,
  });

  const [dataMonth, setDataMonth] = useState([]);
  const [dataDay, setDataDay] = useState([]);
  const [productDay, setProductDay] = useState([]);

  const [year, setYear] = useState(dayjs().year());
  const [range, setRange] = useState(null);

  const API_URL = process.env.REACT_APP_API_URL;

  // ================= FIX BUG: TOKEN =================
  const getAuthHeader = () => {
    const token = localStorage.getItem("access_token");

    return {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  };

  const formatMoney = (value) => (value || 0).toLocaleString("vi-VN") + " VND";

  const formatDate = (d) => `${d.day}/${d.month}/${d.year}`;

  // ================= FIX FETCH =================
  const fetchRevenue = useCallback(async () => {
    setLoading(true);
    try {
      let query = `?year=${year}`;

      // FIX RANGE (không gửi object sai format)
      if (range && Array.isArray(range)) {
        query += `&from=${range[0]}&to=${range[1]}`;
      }

      const [resTotal, resMonth, resDay, resProduct] = await Promise.all([
        axios.get(`${API_URL}/order/revenue${query}`, getAuthHeader()),
        axios.get(`${API_URL}/order/revenue/month${query}`, getAuthHeader()),
        axios.get(`${API_URL}/order/revenue/day${query}`, getAuthHeader()),
        axios.get(`${API_URL}/order/product/day${query}`, getAuthHeader()),
      ]);

      setTotal(resTotal.data?.data || resTotal.data || {});
      setDataMonth(resMonth.data?.data || resMonth.data || []);
      setDataDay(resDay.data?.data || resDay.data || []);
      setProductDay(resProduct.data?.data || resProduct.data || []);
    } catch (err) {
      console.error(err);
      message.error("Lỗi tải dữ liệu");
    } finally {
      setLoading(false);
    }
  }, [year, range, API_URL]);

  useEffect(() => {
    fetchRevenue();
  }, [fetchRevenue]);

  const handleReset = () => {
    setYear(dayjs().year());
    setRange(null);
  };

  const exportExcel = () => {
    if (!dataDay.length) {
      return message.warning("Không có dữ liệu");
    }

    const revenueSheet = dataDay.map((item) => ({
      Ngày: formatDate(item._id),
      "Doanh thu (VND)": item.revenue,
      "Số đơn": item.orders,
    }));

    const productSheet = productDay.map((item) => ({
      "Sản phẩm": item._id?.name || item.name || "Không rõ",
      Ngày: item._id?.day
        ? `${item._id.day}/${item._id.month}/${item._id.year}`
        : "N/A",
      "Đã bán": item.totalSold || 0,
    }));

    const wb = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(
      wb,
      XLSX.utils.json_to_sheet(revenueSheet),
      "Revenue",
    );

    XLSX.utils.book_append_sheet(
      wb,
      XLSX.utils.json_to_sheet(productSheet),
      "Products",
    );

    const file = XLSX.write(wb, {
      bookType: "xlsx",
      type: "array",
    });

    saveAs(new Blob([file]), `revenue_${dayjs().format("YYYYMMDD_HHmm")}.xlsx`);
  };

  const columnsMonth = [
    { title: "Tháng", dataIndex: "_id" },
    {
      title: "Doanh thu",
      dataIndex: "revenue",
      render: formatMoney,
      sorter: (a, b) => a.revenue - b.revenue,
    },
    { title: "Số đơn", dataIndex: "orders" },
  ];

  const columnsDay = [
    {
      title: "Ngày",
      render: (_, r) => formatDate(r._id),
    },
    {
      title: "Doanh thu",
      dataIndex: "revenue",
      render: formatMoney,
    },
    { title: "Số đơn", dataIndex: "orders" },
  ];

  const columnsProduct = [
    {
      title: "Sản phẩm",
      render: (_, r) => r._id.name,
    },
    {
      title: "Ngày",
      render: (_, r) => formatDate(r._id),
    },
    {
      title: "Số lượng",
      dataIndex: "totalSold",
    },
  ];

  const chartData = {
    labels: dataMonth.map((item) => `T${item._id}`),
    datasets: [
      {
        label: "Doanh thu",
        data: dataMonth.map((item) => item.revenue),
      },
      {
        label: "Số đơn",
        data: dataMonth.map((item) => item.orders),
      },
    ],
  };

  return (
    <div>
      <h2>📊 Quản lý doanh thu</h2>

      <Card style={{ marginBottom: 16 }}>
        <Space wrap>
          <Select value={year} onChange={setYear} style={{ width: 120 }}>
            {[2023, 2024, 2025, 2026].map((y) => (
              <Option key={y} value={y}>
                {y}
              </Option>
            ))}
          </Select>

          <RangePicker
            value={range ? [dayjs(range[0]), dayjs(range[1])] : null}
            onChange={(dates) => {
              if (!dates) return setRange(null);

              setRange([
                dates[0].format("YYYY-MM-DD"),
                dates[1].format("YYYY-MM-DD"),
              ]);
            }}
          />

          <Button type="primary" onClick={fetchRevenue}>
            Lọc
          </Button>

          <Button onClick={handleReset}>Reset</Button>

          <Button onClick={exportExcel}>Xuất Excel</Button>
        </Space>
      </Card>

      <Row gutter={16}>
        <Col span={12}>
          <Card>
            <Statistic
              title="Tổng doanh thu"
              value={total.totalRevenue}
              formatter={(v) => formatMoney(v)}
            />
          </Card>
        </Col>

        <Col span={12}>
          <Card>
            <Statistic title="Tổng đơn hàng" value={total.totalOrders} />
          </Card>
        </Col>
      </Row>

      <S.ChartWrapper>
        {loading ? (
          <Spin />
        ) : dataMonth.length ? (
          <Bar data={chartData} />
        ) : (
          <Empty />
        )}
      </S.ChartWrapper>

      <Card title="Doanh thu theo tháng">
        <Table
          columns={columnsMonth}
          dataSource={dataMonth}
          rowKey="_id"
          pagination={{ pageSize: 6 }}
        />
      </Card>

      <Card title="Doanh thu theo ngày" style={{ marginTop: 20 }}>
        <Table
          columns={columnsDay}
          dataSource={dataDay}
          rowKey={(r) => `${r._id.day}-${r._id.month}-${r._id.year}`}
        />
      </Card>

      <Card title="Sản phẩm bán theo ngày" style={{ marginTop: 20 }}>
        <Table
          columns={columnsProduct}
          dataSource={productDay}
          rowKey={(r) =>
            `${r._id.name}-${r._id.day}-${r._id.month}-${r._id.year}`
          }
        />
      </Card>
    </div>
  );
};

export default AdminRevenue;
