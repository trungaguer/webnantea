import { Badge, Col, Popover } from "antd";
import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  WrapperHeader,
  WrapperHeaderAccount,
  WrapperHeaderSmall,
  WrapperTextHeader,
} from "./style";
import {
  CaretDownOutlined,
  ShoppingCartOutlined,
  UserOutlined,
} from "@ant-design/icons";
import ButtonInputSearch from "../ButtonInputSearch/ButtonInputSearch";

// redux
import { useSelector, useDispatch } from "react-redux";
import { resetUser } from "../../redux/slides/userSlide";

const HeaderComponent = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const user = useSelector((state) => state.user);

  // 🔥 FIX: lấy đúng cartItems
  const cartItems = useSelector((state) => state.cart?.cartItems ?? []);

  const [isOpen, setIsOpen] = useState(false);

  // 🔥 tối ưu: lấy tên hiển thị
  const displayName = useMemo(() => {
    return user?.name || user?.email || "User";
  }, [user]);

  // 🔥 check admin
  const isAdmin = useMemo(() => {
    return user?.isAdmin || user?.role === "admin";
  }, [user]);

  // 🔥 FIX: tính đúng số lượng sản phẩm trong giỏ
  const cartCount = useMemo(() => {
    return cartItems.reduce((total, item) => total + (item?.amount || 0), 0);
  }, [cartItems]);

  // 👉 logout
  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user");

    dispatch(resetUser());
    setIsOpen(false);

    navigate("/");
  };

  // 👉 content dropdown
  const content = (
    <div>
      {isAdmin && (
        <div
          style={{ padding: "5px 0", cursor: "pointer", fontWeight: "bold" }}
          onClick={() => {
            setIsOpen(false);
            navigate("/system/admin");
          }}
        >
          ⚙️ Quản lý hệ thống
        </div>
      )}

      <div
        style={{ padding: "5px 0", cursor: "pointer" }}
        onClick={() => {
          setIsOpen(false);
          navigate("/profile-user");
        }}
      >
        Thông tin người dùng
      </div>

      <div
        style={{ padding: "5px 0", cursor: "pointer" }}
        onClick={() => {
          setIsOpen(false);
          navigate("/my-order");
        }}
      >
        Đơn hàng của tôi
      </div>

      <div
        style={{ padding: "5px 0", cursor: "pointer", color: "red" }}
        onClick={handleLogout}
      >
        Đăng xuất
      </div>
    </div>
  );

  return (
    <WrapperHeader>
      {/* LOGO */}
      <Col span={6}>
        <WrapperTextHeader
          style={{ cursor: "pointer" }}
          onClick={() => navigate("/")}
        >
          NAN TEA
        </WrapperTextHeader>
      </Col>

      {/* SEARCH */}
      <Col span={12}>
        <ButtonInputSearch
          placeholder="Tìm thứ bạn cần tại đây!"
          textButton="Tìm kiếm"
          size="large"
          onSearch={(value) => {
            if (!value?.trim()) return;
            navigate(`/search?keyword=${encodeURIComponent(value)}`);
          }}
        />
      </Col>

      {/* RIGHT */}
      <Col
        span={6}
        style={{
          display: "flex",
          gap: "20px",
          alignItems: "center",
          justifyContent: "flex-end",
        }}
      >
        {/* ACCOUNT */}
        <WrapperHeaderAccount>
          {user?.avatar ? (
            <img
              src={user.avatar}
              alt="avatar"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "/default-avatar.png";
              }}
              style={{
                width: "30px",
                height: "30px",
                borderRadius: "50%",
                objectFit: "cover",
              }}
            />
          ) : (
            <UserOutlined style={{ fontSize: "26px" }} />
          )}

          <div>
            {user?.access_token ? (
              <Popover
                content={content}
                trigger="click"
                open={isOpen}
                onOpenChange={(open) => setIsOpen(open)}
              >
                <div style={{ cursor: "pointer", maxWidth: 140 }}>
                  <WrapperHeaderSmall>{displayName}</WrapperHeaderSmall>
                </div>
              </Popover>
            ) : (
              <WrapperHeaderSmall
                style={{ cursor: "pointer" }}
                onClick={() => navigate("/sign-in")}
              >
                Đăng nhập/Đăng ký
              </WrapperHeaderSmall>
            )}

            <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
              <WrapperHeaderSmall>Tài khoản</WrapperHeaderSmall>
              <CaretDownOutlined />
            </div>
          </div>
        </WrapperHeaderAccount>

        {/* CART */}
        <div
          onClick={() => navigate("/cart")}
          style={{ textAlign: "center", cursor: "pointer" }}
        >
          <Badge count={cartCount} size="small" overflowCount={99}>
            <ShoppingCartOutlined style={{ fontSize: "26px", color: "#fff" }} />
          </Badge>

          <WrapperHeaderSmall>Giỏ hàng</WrapperHeaderSmall>
        </div>
      </Col>
    </WrapperHeader>
  );
};

export default HeaderComponent;
