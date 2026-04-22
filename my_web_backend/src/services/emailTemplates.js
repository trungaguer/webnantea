const formatPrice = (price) =>
  new Intl.NumberFormat("vi-VN").format(price || 0);

// ================= HEADER STYLE =================
const baseStyle = `
  font-family: Arial, sans-serif;
  background: #f6f8fb;
  padding: 20px;
`;

const container = `
  max-width: 600px;
  margin: auto;
  background: #fff;
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
`;

// ================= SUCCESS EMAIL =================
const orderSuccessTemplate = (order) => {
  return `
  <div style="${baseStyle}">
    <div style="${container}">
      
      <h2 style="color: #2ecc71;">🎉 Đặt hàng thành công</h2>

      <p>Mã đơn hàng: <b>${order._id}</b></p>

      <hr/>

      <h3>🛒 Sản phẩm</h3>

      ${order.orderItems
        .map(
          (item) => `
          <div style="display:flex; justify-content:space-between; margin-bottom:8px;">
            <span>${item.name} x ${item.amount}</span>
            <b>${formatPrice(item.price * item.amount)}đ</b>
          </div>
        `,
        )
        .join("")}

      <hr/>

      <h3>💰 Tổng tiền: ${formatPrice(order.totalPrice)}đ</h3>

      <p style="color:#888; font-size:12px;">
        Cảm ơn bạn đã mua hàng tại Shop ❤️
        Hotline: 0944574229
      </p>

    </div>
  </div>
  `;
};

// ================= CANCEL EMAIL =================
const orderCancelTemplate = (order) => {
  return `
  <div style="${baseStyle}">
    <div style="${container}">
      
      <h2 style="color: #e74c3c;">❌ Đơn hàng đã bị hủy</h2>

      <p>Mã đơn hàng: <b>${order._id}</b></p>

      <p style="color:#555;">
        Đơn hàng của bạn đã được hủy theo yêu cầu hoặc hệ thống.
      </p>

      <hr/>

      <h3>🛒 Danh sách sản phẩm đã hủy</h3>

      ${order.orderItems
        .map(
          (item) => `
          <div style="display:flex; justify-content:space-between;">
            <span>${item.name} x ${item.amount}</span>
            <b>${formatPrice(item.price * item.amount)}đ</b>
          </div>
        `,
        )
        .join("")}

      <hr/>

      <h3>💰 Hoàn tiền (nếu có): ${formatPrice(order.totalPrice)}đ</h3>

      <p style="font-size:12px; color:#999;">
        Nếu có thắc mắc vui lòng liên hệ support.
        Hotline: 0944574229
      </p>

    </div>
  </div>
  `;
};

module.exports = {
  orderSuccessTemplate,
  orderCancelTemplate,
};
