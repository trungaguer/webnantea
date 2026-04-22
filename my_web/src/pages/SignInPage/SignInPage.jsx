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

// react-query
import { useMutation } from "@tanstack/react-query";
import * as UserService from "../../services/UserService";

// jwt-decode
import { jwtDecode } from "jwt-decode";

// redux
import { useDispatch } from "react-redux";
import { updateUser } from "../../redux/slides/userSlide";

const SignInPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // state
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [isShowPassword, setIsShowPassword] = useState(false);

  // mutation
  const mutation = useMutation({
    mutationFn: (data) => UserService.loginUser(data),

    onSuccess: async (data) => {
      console.log("🔥 RESPONSE LOGIN:", data);

      if (data?.status === "OK") {
        // ✅ FIX CHUẨN
        const accessToken = data?.access_token;
        const refreshToken = data?.refresh_token; // ✅ ĐÚNG theo backend

        if (!accessToken || !refreshToken) {
          alert("Thiếu token từ server!");
          return;
        }

        let decoded = {};

        try {
          decoded = jwtDecode(accessToken);
          console.log("✅ DECODED:", decoded);
        } catch (error) {
          console.error("❌ Decode token error:", error);
          alert("Token không hợp lệ!");
          return;
        }

        // ❗ check id
        if (!decoded?.id) {
          alert("Token không hợp lệ!");
          return;
        }

        // ✅ lưu localStorage
        localStorage.setItem("access_token", accessToken);
        localStorage.setItem("refresh_token", refreshToken);
        localStorage.setItem("user", JSON.stringify(decoded));
        localStorage.setItem("user_id", decoded.id);
        // 🔥 GỌI API LẤY USER DETAILS
        try {
          const userDetails = await UserService.getDetailsUser(decoded.id);

          if (userDetails?.status === "OK") {
            dispatch(
              updateUser({
                ...userDetails?.data,
                id: decoded?.id,
                isAdmin: decoded?.isAdmin,
                access_token: accessToken,
                refreshToken: refreshToken,
              }),
            );
          } else {
            alert("Không lấy được thông tin người dùng!");
          }
        } catch (err) {
          console.error("❌ GET USER ERROR:", err);
          alert("Lỗi khi lấy thông tin user!");
        }

        // reset input
        setUserName("");
        setPassword("");

        navigate("/");
      } else {
        alert(data?.message || "Đăng nhập thất bại!");
      }
    },

    onError: (error) => {
      const message =
        error?.response?.data?.message || error?.message || "Lỗi server!";
      alert(message);
    },
  });

  // handle login
  const handleSignIn = () => {
    const email = userName.trim();
    const pass = password.trim();

    if (!email || !pass) {
      alert("Vui lòng nhập đầy đủ thông tin!");
      return;
    }

    const emailRegex = /\S+@\S+\.\S+/;
    if (!emailRegex.test(email)) {
      alert("Email không hợp lệ!");
      return;
    }

    mutation.mutate({
      email,
      password: pass,
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
          <p>Đăng nhập để tiếp tục mua sắm</p>

          <div
            style={{
              display: "flex",
              gap: "10px",
              marginTop: "20px",
              alignItems: "center",
            }}
          >
            {/* EMAIL */}
            <div style={{ flex: 1 }}>
              <InputForm
                placeholder="Email"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
              />
            </div>

            {/* PASSWORD */}
            <div style={{ flex: 1, position: "relative" }}>
              <InputForm
                placeholder="Mật khẩu"
                type={isShowPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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

            {/* BUTTON */}
            <ButtonComponent
              size={40}
              bordered={false}
              onClick={handleSignIn}
              disabled={mutation.isPending}
              styleButton={{
                backgroundColor: "#bb9b43",
                height: "40px",
                borderRadius: "4px",
                border: "none",
                padding: "0 20px",
                whiteSpace: "nowrap",
              }}
              textButton={
                mutation.isPending ? "Đang đăng nhập..." : "Đăng nhập"
              }
              styleTextButton={{
                color: "#fff",
                fontSize: "14px",
                fontWeight: "600",
              }}
            />
          </div>

          <p>
            <WrapperTextLight>Quên mật khẩu?</WrapperTextLight>
          </p>

          <p>
            Chưa có tài khoản?{" "}
            <WrapperTextLight
              style={{ cursor: "pointer", color: "#bb9b43" }}
              onClick={() => navigate("/sign-up")}
            >
              Đăng ký
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

export default SignInPage;
