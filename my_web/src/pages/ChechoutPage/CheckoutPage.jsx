import React, { useState, useMemo, useEffect, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Row, Col, Input, Button, Radio, Divider, message, Card } from "antd";
import { useNavigate } from "react-router-dom";
import { clearCart } from "../../redux/slides/cartSlide";
import { axiosJWT } from "../../services/UserService";

const CheckoutPage = () => {
  const cartItems = useSelector((state) => state.cart?.cartItems ?? []);
  const user = useSelector((state) => state.user);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [loadingAddress, setLoadingAddress] = useState(false);
  const [loading, setLoading] = useState(false);

  // ================= STATE =================
  const [shippingAddress, setShippingAddress] = useState({
    fullName: user?.name ?? "",
    address: user?.address ?? "",
    city: user?.city ?? "",
    phone: user?.phone ?? "",
    email: user?.email ?? "",
  });

  const [paymentMethod, setPaymentMethod] = useState("cash");

  // ================= SYNC USER =================
  const syncFromDB = useCallback(async () => {
    try {
      const userId = user?.id || user?._id || localStorage.getItem("userId");
      if (!userId) return;

      const res = await axiosJWT.get(`/user/get-details/${userId}`);

      if (res.data?.status === "OK") {
        const data = res.data.data;

        setShippingAddress({
          fullName: data?.name || "",
          address: data?.address || "",
          city: data?.city || "",
          phone: data?.phone || "",
          email: data?.email || "",
        });
      }
    } catch (err) {
      console.log("SYNC ERROR:", err);
    }
  }, [user]);

  useEffect(() => {
    syncFromDB();
  }, [syncFromDB]);

  // ================= GPS =================
  const getCurrentAddress = () => {
    if (!navigator.geolocation) {
      return message.error("Trình duyệt không hỗ trợ GPS");
    }

    setLoadingAddress(true);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${position.coords.latitude}&lon=${position.coords.longitude}`,
          );

          const data = await res.json();

          const fullAddress = data.display_name || "";

          // 🔥 LẤY CITY + TỈNH CHUẨN
          const addr = data.address || {};

          const city =
            addr.city || addr.town || addr.village || addr.county || "";

          const state = addr.state || "";

          // 👉 format lại city hiển thị
          const finalCity = [city, state].filter(Boolean).join(", ");

          setShippingAddress((prev) => ({
            ...prev,
            address: fullAddress,
            city: finalCity,
          }));

          // 🔥 update DB đúng API
          const userId = user?.id || user?._id;
          if (userId) {
            await axiosJWT.put(`/user/update-user/${userId}`, {
              address: fullAddress,
              city: finalCity,
            });
          }

          message.success("Đã lấy địa chỉ + thành phố tự động");
        } catch (err) {
          console.log(err);
          message.error("Không lấy được địa chỉ");
        } finally {
          setLoadingAddress(false);
        }
      },
      () => {
        message.error("Bạn chưa cho phép truy cập vị trí");
        setLoadingAddress(false);
      },
    );
  };

  // ================= PRICE =================
  const { itemsPrice, shippingPrice, totalPrice } = useMemo(() => {
    const itemsPrice = cartItems.reduce((sum, item) => {
      const product = item?.product || item;

      if (!product) return sum;

      const price = Number(product?.price || 0);
      const discount = Number(product?.discount || 0);
      const amount = Number(item?.amount || 1);

      return sum + price * (1 - discount / 100) * amount;
    }, 0);

    const shippingPrice = itemsPrice > 100000 ? 0 : 30000;

    return {
      itemsPrice,
      shippingPrice,
      totalPrice: itemsPrice + shippingPrice,
    };
  }, [cartItems]);

  // ================= INPUT =================
  const handleChange = (e) => {
    setShippingAddress((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // ================= VALIDATE =================
  const validate = () => {
    if (!shippingAddress.fullName) return "Thiếu tên";
    if (!shippingAddress.address) return "Thiếu địa chỉ";
    if (!shippingAddress.phone) return "Thiếu số điện thoại";

    if (!/^[0-9]{9,11}$/.test(shippingAddress.phone)) return "SĐT không hợp lệ";

    if (
      shippingAddress.email &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(shippingAddress.email)
    )
      return "Email không hợp lệ";

    return null;
  };

  // ================= ORDER =================
  const handlePlaceOrder = async () => {
    try {
      if (!cartItems.length) return message.error("Giỏ hàng trống");

      const error = validate();
      if (error) return message.error(error);

      const userId = user?.id || user?._id;
      const token = localStorage.getItem("access_token");

      if (!userId || !token) return message.error("Bạn chưa đăng nhập");

      setLoading(true);

      const orderItems = cartItems.map((item) => {
        const product = item?.product || item;

        if (!product?._id && !product?.id)
          throw new Error("Missing product ID");

        return {
          product: product._id || product.id,
          amount: Number(item?.amount || 1),
        };
      });

      const payload = {
        orderItems,
        shippingAddress,
        paymentMethod,
        shippingPrice,
        user: userId,
        totalPrice,
      };

      const res = await axiosJWT.post("/order/create", payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data?.status === "OK") {
        message.success("Đặt hàng thành công!");
        dispatch(clearCart());
        navigate("/my-order");
      } else {
        message.error("Đặt hàng thất bại");
      }
    } catch (err) {
      console.log(err);
      message.error(err?.response?.data?.message || "Lỗi server");
    } finally {
      setLoading(false);
    }
  };

  if (!cartItems.length)
    return <div style={{ padding: 32 }}>Không có sản phẩm</div>;

  return (
    <div style={{ padding: 32, maxWidth: 1100, margin: "0 auto" }}>
      <h2 style={{ marginBottom: 24 }}>Thanh toán</h2>

      <Row gutter={24}>
        {/* LEFT */}
        <Col xs={24} md={16}>
          <Card
            title="Thông tin giao hàng"
            styles={{ body: { padding: 20 } }} // ✅ FIX antd warning
            style={{ marginBottom: 20, borderRadius: 12 }}
          >
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <Input
                name="fullName"
                value={shippingAddress.fullName}
                onChange={handleChange}
                placeholder="Họ và tên"
                size="large"
              />

              <Input
                name="address"
                value={shippingAddress.address}
                onChange={handleChange}
                placeholder="Địa chỉ chi tiết"
                size="large"
              />

              {/* BUTTON GROUP */}
              <div style={{ display: "flex", gap: 10 }}>
                <Button
                  loading={loadingAddress}
                  onClick={getCurrentAddress}
                  style={{ flex: 1 }}
                >
                  📍 Vị trí hiện tại
                </Button>

                <Button onClick={syncFromDB} style={{ flex: 1 }}>
                  🔄 Tài khoản
                </Button>
              </div>

              <Input
                name="city"
                value={shippingAddress.city}
                onChange={handleChange}
                placeholder="Thành phố / Tỉnh"
                size="large"
              />

              <Input
                name="phone"
                value={shippingAddress.phone}
                onChange={handleChange}
                placeholder="Số điện thoại"
                size="large"
              />

              <Input
                name="email"
                value={shippingAddress.email}
                onChange={handleChange}
                placeholder="Email"
                size="large"
              />
            </div>
          </Card>

          <Card
            title="Thanh toán"
            styles={{ body: { padding: 20 } }}
            style={{ borderRadius: 12 }}
          >
            <Radio.Group
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
            >
              <Radio value="cash">Thanh toán khi nhận hàng (COD)</Radio>
              <Radio value="banking">Chuyển khoản ngân hàng</Radio>
            </Radio.Group>
          </Card>
        </Col>

        {/* RIGHT */}
        <Col xs={24} md={8}>
          <Card
            title="Đơn hàng"
            styles={{ body: { padding: 20 } }}
            style={{
              borderRadius: 12,
              position: "sticky",
              top: 20,
            }}
          >
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {cartItems.map((item, i) => {
                const product = item?.product || item;
                if (!product) return null;

                const price = product.price || 0;
                const discount = product.discount || 0;
                const amount = item.amount || 1;

                return (
                  <div
                    key={product._id || product.id || i}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      fontSize: 14,
                    }}
                  >
                    <span>
                      {product.name} x {amount}
                    </span>
                    <span>
                      {(price * (1 - discount / 100) * amount).toLocaleString()}
                      đ
                    </span>
                  </div>
                );
              })}
            </div>

            <Divider />

            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span>Tạm tính:</span>
              <span>{itemsPrice.toLocaleString()}đ</span>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span>Phí ship:</span>
              <span>{shippingPrice.toLocaleString()}đ</span>
            </div>

            <Divider />

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontWeight: "bold",
                fontSize: 18,
              }}
            >
              <span>Tổng:</span>
              <span style={{ color: "#1677ff" }}>
                {totalPrice.toLocaleString()}đ
              </span>
            </div>

            <Button
              type="primary"
              block
              size="large"
              loading={loading}
              onClick={handlePlaceOrder}
              style={{
                marginTop: 20,
                height: 48,
                borderRadius: 8,
                fontWeight: "bold",
              }}
            >
              Đặt hàng
            </Button>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default CheckoutPage;
