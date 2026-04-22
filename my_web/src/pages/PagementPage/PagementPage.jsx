import { useEffect, useState } from "react";
import { Spin, Result } from "antd";
import * as PaymentService from "../../services/PayMentService";

const PaymentPage = () => {
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    const handlePayment = async () => {
      try {
        const params = new URLSearchParams(window.location.search);
        const orderId = params.get("orderId");

        if (!orderId) {
          setStatus("error");
          return;
        }

        // 🔥 gọi BE để update payment
        await PaymentService.paymentSuccess(orderId);

        setStatus("success");

        // redirect sau 2s
        setTimeout(() => {
          window.location.href = "/my-order";
        }, 2000);
      } catch (e) {
        setStatus("error");
      }
    };

    handlePayment();
  }, []);

  if (status === "loading") {
    return (
      <div style={{ textAlign: "center", marginTop: 100 }}>
        <Spin size="large" />
        <p>Đang xử lý thanh toán...</p>
      </div>
    );
  }

  if (status === "success") {
    return (
      <Result
        status="success"
        title="Thanh toán thành công 🎉"
        subTitle="Đang chuyển về đơn hàng của bạn..."
      />
    );
  }

  return (
    <Result
      status="error"
      title="Thanh toán thất bại"
      subTitle="Vui lòng thử lại"
    />
  );
};

export default PaymentPage;
