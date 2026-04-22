import React, { useEffect, useState } from "react";
import { Modal, Form, Input, InputNumber, Upload, Button, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";

const ProductModal = ({ open, onCancel, onFinish, initialValues }) => {
  const [form] = Form.useForm();
  const [imageBase64, setImageBase64] = useState("");
  const [fileList, setFileList] = useState([]);

  // ================= CONVERT FILE =================
  const getBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
    });
  };

  // ================= HANDLE UPLOAD =================
  const handleChange = async ({ fileList }) => {
    setFileList(fileList);

    const fileObj = fileList[0]?.originFileObj;

    if (fileObj) {
      const base64 = await getBase64(fileObj);

      setImageBase64(base64);

      form.setFieldsValue({
        image: base64,
      });
    } else {
      // 🔥 FIX: khi xoá ảnh
      setImageBase64("");
      form.setFieldsValue({
        image: "",
      });
    }
  };

  // ================= INIT DATA =================
  useEffect(() => {
    if (!open) return;

    if (initialValues) {
      form.setFieldsValue(initialValues);

      setImageBase64("");

      if (initialValues?.image) {
        setFileList([
          {
            uid: "-1",
            name: "image.png",
            status: "done",
            url: initialValues.image,
          },
        ]);
      }
    } else {
      form.resetFields();
      setImageBase64("");
      setFileList([]);
    }
  }, [initialValues, open, form]);

  // ================= CANCEL =================
  const handleCancel = () => {
    form.resetFields();
    setImageBase64("");
    setFileList([]);
    onCancel();
  };

  // ================= SUBMIT =================
  const handleSubmit = (values) => {
    const finalImage = imageBase64 || initialValues?.image || "";

    // ❌ chặn nếu không có ảnh
    if (!finalImage) {
      return message.error("Vui lòng chọn ảnh");
    }

    const payload = {
      ...values,
      image: finalImage,

      price: Number(values.price),
      countInStock: Number(values.countInStock),
      discount: Number(values.discount || 0),
      rating: Number(values.rating || 0),
    };

    console.log("FINAL PAYLOAD:", payload);

    onFinish(payload);
  };

  return (
    <Modal
      title={initialValues ? "Cập nhật sản phẩm" : "Thêm sản phẩm"}
      open={open}
      onCancel={handleCancel} // 🔥 FIX reset
      onOk={() => form.submit()}
      destroyOnHidden
    >
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        {/* NAME */}
        <Form.Item
          name="name"
          label="Tên sản phẩm"
          rules={[{ required: true, message: "Nhập tên sản phẩm" }]}
        >
          <Input />
        </Form.Item>

        {/* IMAGE */}
        <Form.Item name="image" label="Ảnh sản phẩm">
          <Upload
            listType="picture"
            maxCount={1}
            beforeUpload={() => false}
            onChange={handleChange}
            fileList={fileList}
          >
            <Button icon={<UploadOutlined />}>Chọn ảnh</Button>
          </Upload>
        </Form.Item>

        {/* PREVIEW */}
        {(imageBase64 || initialValues?.image) && (
          <img
            src={imageBase64 || initialValues?.image}
            alt="preview"
            style={{
              width: "100%",
              height: 150,
              objectFit: "cover",
              marginBottom: 10,
              borderRadius: 8,
            }}
          />
        )}

        {/* TYPE */}
        <Form.Item
          name="type"
          label="Loại sản phẩm"
          rules={[{ required: true, message: "Nhập loại" }]}
        >
          <Input />
        </Form.Item>

        {/* PRICE */}
        <Form.Item
          name="price"
          label="Giá"
          rules={[{ required: true, message: "Nhập giá" }]}
        >
          <InputNumber min={0} style={{ width: "100%" }} />
        </Form.Item>

        {/* STOCK */}
        <Form.Item
          name="countInStock"
          label="Tồn kho"
          rules={[{ required: true, message: "Nhập số lượng" }]}
        >
          <InputNumber min={0} style={{ width: "100%" }} />
        </Form.Item>

        {/* RATING */}
        <Form.Item name="rating" label="Rating">
          <InputNumber min={0} max={5} step={0.1} style={{ width: "100%" }} />
        </Form.Item>

        {/* DISCOUNT */}
        <Form.Item name="discount" label="Giảm giá (%)">
          <InputNumber min={0} max={100} style={{ width: "100%" }} />
        </Form.Item>

        {/* DESCRIPTION */}
        <Form.Item name="description" label="Mô tả">
          <Input.TextArea rows={4} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ProductModal;
