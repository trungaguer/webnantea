import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  WrapperContainerLeft,
  WrapperContainerRight,
  WrapperTextLight,
} from "./style";
import InputForm from "../../components/InputForm/InputForm";
import ButtonComponent from "../../components/ButtonComponent/ButtonComponent";
import { Image } from "antd";
import { EyeInvisibleOutlined, EyeOutlined } from "@ant-design/icons";
import imageLogo from "../../assets/images/logologin.gif";

// ✅ thêm
import { useMutation } from "@tanstack/react-query";
import * as UserService from "../../services/UserService";

const SignUpPage = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [isShowPassword, setIsShowPassword] = useState(false);
  const [isShowConfirmPassword, setIsShowConfirmPassword] = useState(false);

  const handleOnChange = (value, name) => {
    setForm({
      ...form,
      [name]: value,
    });
  };

  // ✅ mutation signup
  const mutation = useMutation({
    mutationFn: (data) => UserService.signupUser(data),

    onSuccess: (data) => {
      console.log("SIGN UP SUCCESS:", data);

      if (data?.status === "OK") {
        alert("Đăng ký thành công!");

        // reset form
        setForm({
          name: "",
          email: "",
          password: "",
          confirmPassword: "",
        });

        // chuyển sang login
        navigate("/sign-in");
      } else {
        alert(data?.message || "Đăng ký thất bại!");
      }
    },

    onError: (error) => {
      console.log("SIGN UP ERROR:", error);

      const message = error?.response?.data?.message || error?.message;

      alert(message);
    },
  });

  // ✅ handle signup
  const handleSignUp = () => {
    const { name, email, password, confirmPassword } = form;

    // validate
    if (!name || !email || !password || !confirmPassword) {
      alert("Vui lòng nhập đầy đủ thông tin!");
      return;
    }

    if (password !== confirmPassword) {
      alert("Mật khẩu không khớp!");
      return;
    }

    // call API
    mutation.mutate({
      name: name.trim(),
      email: email.trim(),
      password: password.trim(),
      confirmPassword: confirmPassword.trim(),
    });
  };

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#ccc",
        height: "100vh",
      }}
    >
      <div
        style={{
          width: "900px",
          height: "400px",
          borderRadius: "10px",
          background: "#fff",
          display: "flex",
          overflow: "hidden",
        }}
      >
        <WrapperContainerLeft>
          <h1>Xin chào</h1>
          <p>Đăng ký tài khoản mới</p>

          {/* ROW 1 */}
          <div
            style={{
              display: "flex",
              gap: "10px",
              marginTop: "20px",
            }}
          >
            <div style={{ flex: 1 }}>
              <InputForm
                placeholder="Tên của bạn"
                value={form.name}
                onChange={(e) => handleOnChange(e.target.value, "name")}
              />
            </div>

            <div style={{ flex: 1 }}>
              <InputForm
                placeholder="Email"
                value={form.email}
                onChange={(e) => handleOnChange(e.target.value, "email")}
              />
            </div>
          </div>

          {/* ROW 2 */}
          <div
            style={{
              display: "flex",
              gap: "10px",
              marginTop: "10px",
              alignItems: "center",
            }}
          >
            {/* PASSWORD */}
            <div style={{ flex: 1, position: "relative" }}>
              <InputForm
                placeholder="Mật khẩu"
                type={isShowPassword ? "text" : "password"}
                value={form.password}
                onChange={(e) => handleOnChange(e.target.value, "password")}
              />
              <span
                onClick={() => setIsShowPassword(!isShowPassword)}
                style={{
                  position: "absolute",
                  right: "10px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  cursor: "pointer",
                }}
              >
                {isShowPassword ? <EyeOutlined /> : <EyeInvisibleOutlined />}
              </span>
            </div>

            {/* CONFIRM PASSWORD */}
            <div style={{ flex: 1, position: "relative" }}>
              <InputForm
                placeholder="Nhập lại mật khẩu"
                type={isShowConfirmPassword ? "text" : "password"}
                value={form.confirmPassword}
                onChange={(e) =>
                  handleOnChange(e.target.value, "confirmPassword")
                }
              />
              <span
                onClick={() => setIsShowConfirmPassword(!isShowConfirmPassword)}
                style={{
                  position: "absolute",
                  right: "10px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  cursor: "pointer",
                }}
              >
                {isShowConfirmPassword ? (
                  <EyeOutlined />
                ) : (
                  <EyeInvisibleOutlined />
                )}
              </span>
            </div>

            <ButtonComponent
              size={40}
              bordered={false}
              onClick={handleSignUp}
              disabled={mutation.isPending}
              styleButton={{
                backgroundColor: "#bb9b43",
                height: "40px",
                borderRadius: "4px",
                border: "none",
                padding: "0 20px",
                whiteSpace: "nowrap",
              }}
              textButton={mutation.isPending ? "Đang đăng ký..." : "Đăng ký"}
              styleTextButton={{
                color: "#fff",
                fontSize: "14px",
                fontWeight: "600",
              }}
            />
          </div>

          <p style={{ marginTop: "10px" }}>
            Đã có tài khoản?{" "}
            <WrapperTextLight
              style={{ cursor: "pointer", color: "#bb9b43" }}
              onClick={() => navigate("/sign-in")}
            >
              Đăng nhập
            </WrapperTextLight>
          </p>
        </WrapperContainerLeft>

        <WrapperContainerRight>
          <Image
            src={imageLogo}
            alt="image-logo"
            preview={false}
            height="250px"
            width="250px"
          />
          <h4
            style={{ color: "#bb9b43", cursor: "pointer" }}
            onClick={() => navigate("/")}
          >
            Nan Tea Xin chào!!!
          </h4>
          <p style={{ color: "rgba(54, 54, 25, 0.73)" }}>
            Tạo tài khoản để bắt đầu mua sắm!
          </p>
        </WrapperContainerRight>
      </div>
    </div>
  );
};

export default SignUpPage;
