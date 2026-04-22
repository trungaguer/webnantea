const transporter = require("../utils/sendMail");
const {
  orderSuccessTemplate,
  orderCancelTemplate,
} = require("./emailTemplates");

// ================= BASE SEND =================
const sendEmail = async ({ to, subject, html }) => {
  try {
    const info = await transporter.sendMail({
      from: `"NanTea" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    });

    console.log("📩 EMAIL SENT:", info.messageId);
    return info;
  } catch (error) {
    console.log("❌ EMAIL ERROR:", error.message);
    throw error;
  }
};

// ================= ORDER SUCCESS =================
const sendOrderSuccessEmail = async (userEmail, order) => {
  return sendEmail({
    to: userEmail,
    subject: `🎉 Đơn hàng #${order._id} đã được tạo thành công`,
    html: orderSuccessTemplate(order),
  });
};

// ================= ORDER CANCEL =================
const sendOrderCancelEmail = async (userEmail, order) => {
  return sendEmail({
    to: userEmail,
    subject: `❌ Đơn hàng #${order._id} đã bị hủy`,
    html: orderCancelTemplate(order),
  });
};

module.exports = {
  sendOrderSuccessEmail,
  sendOrderCancelEmail,
};
