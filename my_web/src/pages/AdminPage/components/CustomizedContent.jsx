import React from "react";
import AdminProduct from "../../../components/AdminProduct/AdminProduct";
import AdminUser from "../../../components/AdminUser/AdminUser";
import AdminOrder from "../../../components/AdminOrder/AdminOrder";
import AdminRevenue from "../../../components/AdminRevenue/AdminRevenue"; // 👈 thêm dòng này

import { Empty } from "antd";

const CustomizedContent = ({ type }) => {
  // ================= RENDER CONTENT =================
  const renderContent = () => {
    switch (type) {
      case "product":
        return <AdminProduct />;

      case "user":
        return <AdminUser />;

      case "order":
        return <AdminOrder />;

      case "revenue": // 👈 thêm case mới
        return <AdminRevenue />;

      default:
        return (
          <div style={{ padding: "40px 0" }}>
            <Empty description="Không có dữ liệu" />
          </div>
        );
    }
  };

  return <div>{renderContent()}</div>;
};

export default CustomizedContent;
