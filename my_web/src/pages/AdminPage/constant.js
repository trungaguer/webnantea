import {
  UserOutlined,
  AppstoreOutlined,
  ShoppingCartOutlined, // 🔥 thêm icon
  BarChartOutlined, // 👈 thêm icon revenue
} from "@ant-design/icons";

// ================= TYPE =================
export const ADMIN_TYPE = {
  PRODUCT: "product",
  USER: "user",
  ORDER: "order", // 🔥 thêm
  REVENUE: "revenue", // 👈 thêm
};

// ================= SIDEBAR MENU =================
export const ADMIN_MENU = [
  {
    key: ADMIN_TYPE.PRODUCT,
    label: "Quản lý sản phẩm",
    icon: <AppstoreOutlined />,
  },
  {
    key: ADMIN_TYPE.USER,
    label: "Quản lý người dùng",
    icon: <UserOutlined />,
  },
  {
    key: ADMIN_TYPE.ORDER, // 🔥 thêm
    label: "Quản lý đơn hàng",
    icon: <ShoppingCartOutlined />,
  },
  {
    key: ADMIN_TYPE.REVENUE, // 👈 thêm
    label: "Quản lý doanh thu",
    icon: <BarChartOutlined />,
  },
];
