import React, { useEffect, useState, useCallback } from "react";
import {
  Table,
  Button,
  Space,
  message,
  Popconfirm,
  Tag,
  Input,
  Select,
} from "antd";
import * as ProductService from "../../services/ProductService";
import ProductModal from "./ProductModal";
import { WrapperHeader, WrapperContainer } from "./style";

import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const { Option } = Select;

const AdminProduct = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  // search + filter + sort
  const [searchText, setSearchText] = useState("");
  const [sortType, setSortType] = useState("");
  const [filterType, setFilterType] = useState("");

  // ✅ thêm multi select
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  // pagination
  const [page, setPage] = useState(1);
  const [limit] = useState(5);
  const [total, setTotal] = useState(0);

  // modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const formatPrice = (price) => new Intl.NumberFormat("vi-VN").format(price);

  // ================= FETCH =================
  const fetchProduct = useCallback(async () => {
    try {
      setLoading(true);
      const res = await ProductService.getAllProduct(limit, page);

      if (res?.status === "OK") {
        setProducts(res.data || []);
        setFilteredProducts(res.data || []);
        setTotal(res?.total ?? res?.data?.length ?? 0);
      } else {
        message.error(res?.message || "Lấy sản phẩm thất bại");
      }
    } catch (error) {
      console.log(error);
      message.error("Lỗi load product");
    } finally {
      setLoading(false);
    }
  }, [page, limit]);

  useEffect(() => {
    fetchProduct();
  }, [fetchProduct]);

  // ================= SEARCH + FILTER + SORT =================
  useEffect(() => {
    let data = [...products];

    if (searchText) {
      data = data.filter((item) =>
        item.name.toLowerCase().includes(searchText.toLowerCase()),
      );
    }

    if (filterType === "discount") {
      data = data.filter((item) => item.discount > 0);
    }
    if (filterType === "instock") {
      data = data.filter((item) => item.countInStock > 0);
    }

    if (sortType === "price_asc") {
      data.sort((a, b) => a.price - b.price);
    }
    if (sortType === "price_desc") {
      data.sort((a, b) => b.price - a.price);
    }
    if (sortType === "stock_desc") {
      data.sort((a, b) => b.countInStock - a.countInStock);
    }

    setFilteredProducts(data);
  }, [searchText, sortType, filterType, products]);

  // ================= DELETE ONE =================
  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem("access_token");
      const res = await ProductService.deleteProduct(id, token);

      if (res?.status === "OK") {
        message.success("Xóa thành công");
        fetchProduct();
      } else {
        message.error(res?.message);
      }
    } catch (error) {
      console.log(error);
      message.error("Lỗi khi xóa");
    }
  };

  // ================= DELETE MANY =================
  const handleDeleteMany = async () => {
    try {
      const token = localStorage.getItem("access_token");

      const res = await Promise.all(
        selectedRowKeys.map((id) => ProductService.deleteProduct(id, token)),
      );

      const isSuccess = res.every((r) => r?.status === "OK");

      if (isSuccess) {
        message.success(`Đã xóa ${selectedRowKeys.length} sản phẩm`);
        setSelectedRowKeys([]);
        fetchProduct();
      } else {
        message.error("Có lỗi khi xóa một số sản phẩm");
      }
    } catch (error) {
      console.log(error);
      message.error("Lỗi khi xóa nhiều sản phẩm");
    }
  };

  // ================= EXPORT EXCEL =================
  const handleExportExcel = () => {
    try {
      const dataExport = filteredProducts.map((item) => ({
        "Tên sản phẩm": item.name,
        "Giá gốc": item.price,
        "Giảm (%)": item.discount || 0,
        "Giá sau giảm": item.price - (item.price * (item.discount || 0)) / 100,
        "Tồn kho": item.countInStock,
        "Đã bán": item.selled || 0,
      }));

      const worksheet = XLSX.utils.json_to_sheet(dataExport);
      const workbook = XLSX.utils.book_new();

      XLSX.utils.book_append_sheet(workbook, worksheet, "Products");

      const excelBuffer = XLSX.write(workbook, {
        bookType: "xlsx",
        type: "array",
      });

      const fileData = new Blob([excelBuffer], {
        type: "application/octet-stream",
      });

      saveAs(fileData, "products.xlsx");
    } catch (error) {
      console.log(error);
      message.error("Lỗi xuất Excel");
    }
  };

  // ================= CREATE / UPDATE =================
  const handleSubmit = async (values) => {
    try {
      const token = localStorage.getItem("access_token");

      const payload = {
        ...selectedProduct,
        ...values,
        image:
          values.image && values.image.trim() !== ""
            ? values.image
            : selectedProduct?.image,
        price: Number(values.price ?? selectedProduct?.price),
        countInStock: Number(
          values.countInStock ?? selectedProduct?.countInStock,
        ),
        rating: Number(values.rating ?? selectedProduct?.rating ?? 0),
        discount: Number(values.discount ?? selectedProduct?.discount ?? 0),
      };

      let res;

      if (selectedProduct) {
        res = await ProductService.updateProduct(
          selectedProduct._id,
          payload,
          token,
        );
      } else {
        res = await ProductService.createProduct(payload, token);
      }

      if (res?.status === "OK") {
        message.success(
          selectedProduct ? "Cập nhật thành công" : "Thêm thành công",
        );
        setIsModalOpen(false);
        setSelectedProduct(null);
        fetchProduct();
      } else {
        message.error(res?.message);
      }
    } catch (error) {
      console.log(error);
      message.error("Lỗi xử lý");
    }
  };

  // ================= ROW SELECTION =================
  const rowSelection = {
    selectedRowKeys,
    onChange: (keys) => {
      setSelectedRowKeys(keys);
    },
  };

  // ================= COLUMNS =================
  const columns = [
    {
      title: "Tên sản phẩm",
      dataIndex: "name",
    },
    {
      title: "Giá",
      sorter: (a, b) => a.price - b.price,
      render: (record) => {
        const discount = record.discount || 0;
        const finalPrice = record.price - (record.price * discount) / 100;

        return (
          <div>
            {discount > 0 && (
              <div style={{ textDecoration: "line-through", color: "#999" }}>
                {formatPrice(record.price)} đ
              </div>
            )}
            <div style={{ color: "red", fontWeight: "bold" }}>
              {formatPrice(finalPrice)} đ
            </div>
          </div>
        );
      },
    },
    {
      title: "Giảm",
      dataIndex: "discount",
      filters: [
        { text: "Có giảm giá", value: "yes" },
        { text: "Không giảm", value: "no" },
      ],
      onFilter: (value, record) =>
        value === "yes" ? record.discount > 0 : record.discount === 0,
      render: (value) =>
        value ? <Tag color="red">-{value}%</Tag> : <Tag>0%</Tag>,
    },
    {
      title: "Tồn kho",
      dataIndex: "countInStock",
      sorter: (a, b) => a.countInStock - b.countInStock,
    },
    {
      title: "Đã bán",
      dataIndex: "selled",
      sorter: (a, b) => (a.selled || 0) - (b.selled || 0),
      render: (value) => value || 0,
    },
    {
      title: "Action",
      render: (record) => (
        <Space>
          <Button
            type="primary"
            onClick={() => {
              setSelectedProduct(record);
              setIsModalOpen(true);
            }}
          >
            Edit
          </Button>

          <Popconfirm
            title="Bạn chắc chắn muốn xóa?"
            okText="Xóa"
            cancelText="Hủy"
            onConfirm={() => handleDelete(record._id)}
          >
            <Button danger>Delete</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <WrapperContainer>
      <WrapperHeader>Quản lý sản phẩm</WrapperHeader>

      {/* SEARCH + FILTER UI */}
      <Space style={{ marginBottom: 16 }}>
        <Input
          placeholder="Tìm sản phẩm..."
          onChange={(e) => setSearchText(e.target.value)}
          style={{ width: 200 }}
        />

        <Select
          placeholder="Sort"
          style={{ width: 150 }}
          onChange={setSortType}
          allowClear
        >
          <Option value="price_asc">Giá tăng</Option>
          <Option value="price_desc">Giá giảm</Option>
          <Option value="stock_desc">Tồn kho nhiều</Option>
        </Select>

        <Select
          placeholder="Filter"
          style={{ width: 150 }}
          onChange={setFilterType}
          allowClear
        >
          <Option value="discount">Có giảm giá</Option>
          <Option value="instock">Còn hàng</Option>
        </Select>

        {/* DELETE MANY BUTTON */}
        {selectedRowKeys.length > 0 && (
          <Popconfirm
            title={`Xóa ${selectedRowKeys.length} sản phẩm?`}
            onConfirm={handleDeleteMany}
          >
            <Button danger>Xóa đã chọn ({selectedRowKeys.length})</Button>
          </Popconfirm>
        )}
      </Space>

      {/* BUTTON CREATE */}
      <Button
        type="primary"
        style={{ marginBottom: 16 }}
        onClick={() => {
          setSelectedProduct(null);
          setIsModalOpen(true);
        }}
      >
        Thêm sản phẩm
      </Button>
      <Button onClick={handleExportExcel}>Xuất Excel</Button>

      {/* TABLE */}
      <Table
        rowSelection={rowSelection}
        columns={columns}
        dataSource={filteredProducts}
        loading={loading}
        rowKey="_id"
        pagination={{
          current: page,
          pageSize: limit,
          total: total,
          onChange: (p) => setPage(p),
        }}
      />

      {/* MODAL */}
      <ProductModal
        open={isModalOpen}
        onCancel={() => {
          setIsModalOpen(false);
          setSelectedProduct(null);
        }}
        onFinish={handleSubmit}
        initialValues={selectedProduct}
      />
    </WrapperContainer>
  );
};

export default AdminProduct;
