import React, { useEffect, useState, useCallback } from "react";
import { Table, Button, Space, message, Popconfirm, Input, Select } from "antd";
import * as UserService from "../../services/UserService";
import UserModal from "./UserModal";
import { WrapperHeader, WrapperContainer } from "./style";

const { Option } = Select;

const AdminUser = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  // search + filter + sort
  const [searchText, setSearchText] = useState("");
  const [sortType, setSortType] = useState("");
  const [filterType, setFilterType] = useState("");

  // ✅ thêm multi select
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  // modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  // ================= FETCH =================
  const fetchUser = useCallback(async () => {
    try {
      setLoading(true);

      const res = await UserService.getAllUser();

      if (res?.status === "OK") {
        setUsers(res.data || []);
        setFilteredUsers(res.data || []);
      } else {
        message.error(res?.message);
      }
    } catch (error) {
      console.log(error);
      message.error("Lỗi load user");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  // ================= SEARCH + FILTER + SORT =================
  useEffect(() => {
    let data = [...users];

    // 🔍 SEARCH
    if (searchText) {
      data = data.filter(
        (user) =>
          user.name?.toLowerCase().includes(searchText.toLowerCase()) ||
          user.email?.toLowerCase().includes(searchText.toLowerCase()),
      );
    }

    // 🎯 FILTER
    if (filterType === "admin") {
      data = data.filter((user) => user.isAdmin);
    }
    if (filterType === "user") {
      data = data.filter((user) => !user.isAdmin);
    }

    // 🔽 SORT
    if (sortType === "name_asc") {
      data.sort((a, b) => a.name.localeCompare(b.name));
    }
    if (sortType === "name_desc") {
      data.sort((a, b) => b.name.localeCompare(a.name));
    }

    setFilteredUsers(data);
  }, [searchText, sortType, filterType, users]);

  // ================= DELETE ONE =================
  const handleDelete = async (id) => {
    try {
      const res = await UserService.deleteUser(id);

      if (res?.status === "OK") {
        message.success("Xóa user thành công");
        fetchUser();
      } else {
        message.error(res?.message);
      }
    } catch (error) {
      console.log(error);
      message.error("Lỗi khi xóa user");
    }
  };

  // ================= DELETE MANY (THÊM) =================
  const handleDeleteMany = async () => {
    try {
      const res = await Promise.all(
        selectedRowKeys.map((id) => UserService.deleteUser(id)),
      );

      const isSuccess = res.every((r) => r?.status === "OK");

      if (isSuccess) {
        message.success(`Đã xóa ${selectedRowKeys.length} user`);
        setSelectedRowKeys([]);
        fetchUser();
      } else {
        message.error("Có lỗi khi xóa một số user");
      }
    } catch (error) {
      console.log(error);
      message.error("Lỗi khi xóa nhiều user");
    }
  };

  // ================= UPDATE =================
  const handleSubmit = async (values) => {
    try {
      const res = await UserService.updateUser(selectedUser._id, values);

      if (res?.status === "OK") {
        message.success("Cập nhật thành công");
        setIsModalOpen(false);
        setSelectedUser(null);
        fetchUser();
      } else {
        message.error(res?.message);
      }
    } catch (error) {
      console.log(error);
      message.error("Lỗi cập nhật user");
    }
  };

  // ================= ROW SELECTION (THÊM) =================
  const rowSelection = {
    selectedRowKeys,
    onChange: (keys) => {
      setSelectedRowKeys(keys);
    },
  };

  // ================= COLUMNS =================
  const columns = [
    {
      title: "Tên",
      dataIndex: "name",
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: "Email",
      dataIndex: "email",
      sorter: (a, b) => a.email.localeCompare(b.email),
    },
    {
      title: "Admin",
      dataIndex: "isAdmin",
      filters: [
        { text: "Admin", value: true },
        { text: "User", value: false },
      ],
      onFilter: (value, record) => record.isAdmin === value,
      render: (isAdmin) => (isAdmin ? "✔️" : "❌"),
    },
    {
      title: "Action",
      render: (record) => (
        <Space>
          <Button
            type="primary"
            onClick={() => {
              setSelectedUser(record);
              setIsModalOpen(true);
            }}
          >
            Edit
          </Button>

          <Popconfirm
            title="Xóa user này?"
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
      <WrapperHeader>Quản lý người dùng</WrapperHeader>

      {/* SEARCH + FILTER UI */}
      <Space style={{ marginBottom: 16 }}>
        <Input
          placeholder="Tìm name hoặc email..."
          onChange={(e) => setSearchText(e.target.value)}
          style={{ width: 250 }}
        />

        <Select
          placeholder="Sort"
          style={{ width: 150 }}
          onChange={setSortType}
          allowClear
        >
          <Option value="name_asc">Tên A-Z</Option>
          <Option value="name_desc">Tên Z-A</Option>
        </Select>

        <Select
          placeholder="Filter"
          style={{ width: 150 }}
          onChange={setFilterType}
          allowClear
        >
          <Option value="admin">Admin</Option>
          <Option value="user">User</Option>
        </Select>

        {/* ✅ BUTTON DELETE MANY */}
        {selectedRowKeys.length > 0 && (
          <Popconfirm
            title={`Xóa ${selectedRowKeys.length} user?`}
            onConfirm={handleDeleteMany}
          >
            <Button danger>Xóa đã chọn ({selectedRowKeys.length})</Button>
          </Popconfirm>
        )}
      </Space>

      {/* TABLE */}
      <Table
        rowSelection={rowSelection}
        columns={columns}
        dataSource={filteredUsers}
        loading={loading}
        rowKey="_id"
      />

      {/* MODAL */}
      <UserModal
        open={isModalOpen}
        onCancel={() => {
          setIsModalOpen(false);
          setSelectedUser(null);
        }}
        onFinish={handleSubmit}
        initialValues={selectedUser}
      />
    </WrapperContainer>
  );
};

export default AdminUser;
