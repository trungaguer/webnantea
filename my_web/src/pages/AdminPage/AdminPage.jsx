import React, { useState } from "react";
import { Layout, Menu } from "antd";
import { useNavigate } from "react-router-dom"; // ✅ thêm
import { ArrowLeftOutlined } from "@ant-design/icons"; // ✅ thêm

import CustomizedContent from "./components/CustomizedContent";
import { ADMIN_MENU, ADMIN_TYPE } from "./constant";

const { Sider, Content } = Layout;

const AdminPage = () => {
  const [type, setType] = useState(ADMIN_TYPE.PRODUCT); // giữ nguyên
  const navigate = useNavigate(); // ✅ thêm

  // ================= MENU ITEMS =================
  const items = ADMIN_MENU.map((item) => ({
    key: item.key,
    icon: item.icon,
    label: item.label,
  }));

  return (
    <Layout style={{ minHeight: "100vh" }}>
      {/* SIDEBAR */}
      <Sider
        width={240}
        style={{
          background: "#001529",
        }}
      >
        {/* LOGO */}
        <div
          style={{
            height: 64,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#fff",
            fontSize: 18,
            fontWeight: "bold",
            borderBottom: "1px solid rgba(255,255,255,0.1)",
            gap: "8px",
          }}
        >
          {/* 🔥 ICON BACK */}
          <ArrowLeftOutlined
            onClick={() => navigate("/")}
            style={{
              cursor: "pointer",
              fontSize: 16,
            }}
          />
          ADMIN PANEL
        </div>

        {/* MENU */}
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[type]}
          items={items}
          onClick={({ key }) => setType(key)} // 👈 đã hỗ trợ luôn revenue
        />
      </Sider>

      {/* CONTENT */}
      <Layout style={{ padding: "16px" }}>
        <Content
          style={{
            background: "#fff",
            padding: 20,
            borderRadius: 10,
            minHeight: "calc(100vh - 32px)",
            boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
          }}
        >
          {/* 👇 tự động render theo type (đã có revenue) */}
          <CustomizedContent type={type} />
        </Content>
      </Layout>
    </Layout>
  );
};

export default AdminPage;
