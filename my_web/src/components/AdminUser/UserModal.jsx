import React, { useEffect } from "react";
import { Modal, Form, Input, Select } from "antd";

const UserModal = ({ open, onCancel, onFinish, initialValues }) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (open) {
      if (initialValues) {
        form.setFieldsValue(initialValues);
      } else {
        form.resetFields();
      }
    }
  }, [initialValues, open, form]);

  return (
    <Modal
      title="Cập nhật user"
      open={open}
      onCancel={onCancel}
      onOk={() => form.submit()}
      destroyOnHidden
    >
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Form.Item name="name" label="Tên">
          <Input />
        </Form.Item>

        <Form.Item name="email" label="Email">
          <Input disabled /> {/* ❗ không cho sửa email */}
        </Form.Item>

        <Form.Item name="isAdmin" label="Quyền">
          <Select>
            <Select.Option value={true}>Admin</Select.Option>
            <Select.Option value={false}>User</Select.Option>
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default UserModal;
