import React, { useEffect, useState } from "react";
import {
  WrapperContentProfile,
  WrapperHeader,
  WrapperInput,
  WrapperLabel,
  WrapperButton,
  WrapperUploadFile,
} from "./style";
import InputForm from "../../components/InputForm/InputForm";
import { message } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { getBase64 } from "../../utils";
import * as UserService from "../../services/UserService";

// 🔥 REDUX
import { useSelector, useDispatch } from "react-redux";
import { updateUser } from "../../redux/slides/userSlide";

const ProfilePage = () => {
  const dispatch = useDispatch();

  const userRedux = useSelector((state) => state.user);

  const [user, setUser] = useState({
    email: "",
    name: "",
    phone: "",
    address: "",
    avatar: "",
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (userRedux?.id) {
      setUser({
        email: userRedux.email || "",
        name: userRedux.name || "",
        phone: userRedux.phone || "",
        address: userRedux.address || "",
        avatar: userRedux.avatar || "",
      });
    }
  }, [userRedux]);

  const handleOnchange = (e) => {
    const { name, value } = e.target;
    setUser((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // 👉 upload avatar
  const handleUpload = async ({ fileList }) => {
    try {
      const file = fileList[0];
      if (!file) return;

      // 🔥 check đúng loại ảnh
      if (!file.type || !file.type.startsWith("image/")) {
        message.error("Chỉ được upload file ảnh!");
        return;
      }

      // 🔥 tăng limit lên 5MB (an toàn hơn)
      if (file.size > 5 * 1024 * 1024) {
        message.error("Ảnh phải nhỏ hơn 5MB!");
        return;
      }

      const base64 = await getBase64(file.originFileObj);

      setUser((prev) => ({
        ...prev,
        avatar: base64,
      }));
    } catch (error) {
      console.error(error);
      message.error("Upload ảnh thất bại!");
    }
  };

  // 👉 update profile
  const handleUpdate = async () => {
    try {
      setLoading(true);

      const id = userRedux.id;

      // 🔥 chỉ gửi field cần thiết
      const dataUpdate = {
        name: user.name?.trim(),
        phone:
          user.phone && !isNaN(user.phone) ? Number(user.phone) : undefined,
        address: user.address?.trim(),
        avatar: user.avatar,
      };

      // 🔥 loại bỏ undefined / null / ""
      Object.keys(dataUpdate).forEach((key) => {
        if (
          dataUpdate[key] === undefined ||
          dataUpdate[key] === null ||
          dataUpdate[key] === ""
        ) {
          delete dataUpdate[key];
        }
      });

      const res = await UserService.updateUser(id, dataUpdate);

      if (res?.status === "OK") {
        message.success("Cập nhật thành công!");

        const newUser = { ...userRedux, ...dataUpdate };

        // 🔥 update redux
        dispatch(updateUser(newUser));

        // 🔥 lưu localStorage
        localStorage.setItem("user", JSON.stringify(newUser));
      } else {
        message.error(res?.message || "Cập nhật thất bại!");
      }
    } catch (error) {
      console.error(error);
      message.error("Có lỗi xảy ra!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: "600px", margin: "0 auto" }}>
      <WrapperHeader>Thông tin người dùng</WrapperHeader>

      <WrapperContentProfile>
        <WrapperInput>
          <WrapperLabel>Email</WrapperLabel>
          <InputForm
            value={user.email}
            name="email"
            onChange={handleOnchange}
            disabled
          />
        </WrapperInput>

        <WrapperInput>
          <WrapperLabel>Tên</WrapperLabel>
          <InputForm value={user.name} name="name" onChange={handleOnchange} />
        </WrapperInput>

        <WrapperInput>
          <WrapperLabel>Số điện thoại</WrapperLabel>
          <InputForm
            value={user.phone}
            name="phone"
            onChange={handleOnchange}
          />
        </WrapperInput>

        <WrapperInput>
          <WrapperLabel>Địa chỉ</WrapperLabel>
          <InputForm
            value={user.address}
            name="address"
            onChange={handleOnchange}
          />
        </WrapperInput>

        <WrapperInput>
          <WrapperLabel>Avatar</WrapperLabel>

          <WrapperUploadFile
            beforeUpload={() => false}
            onChange={handleUpload}
            maxCount={1}
            showUploadList={false}
            accept="image/*" // 🔥 cho phép mọi loại ảnh
          >
            <WrapperButton>
              <UploadOutlined /> Upload Avatar
            </WrapperButton>
          </WrapperUploadFile>

          {user.avatar && (
            <img
              src={user.avatar}
              alt="avatar"
              style={{
                width: "100px",
                height: "100px",
                borderRadius: "50%",
                marginTop: "10px",
                objectFit: "cover",
              }}
            />
          )}
        </WrapperInput>

        <WrapperButton onClick={handleUpdate} disabled={loading}>
          {loading ? "Đang cập nhật..." : "Cập nhật"}
        </WrapperButton>
      </WrapperContentProfile>
    </div>
  );
};

export default ProfilePage;
