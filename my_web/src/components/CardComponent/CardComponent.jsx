import React from "react";
import { useNavigate } from "react-router-dom";
import {
  StyleNameProduct,
  WrapperCardStyle,
  WrapperPriceDiscountText,
  WrapperPriceText,
  WrapperReportText,
  WrapperStyleTextSell,
} from "./style";
import { StarFilled } from "@ant-design/icons";

import defaultImage from "../../assets/images/picture1.jpg";

const CardComponent = ({ data }) => {
  const navigate = useNavigate();

  // ================= FIX LOGIC =================
  const price = Number(data?.price || 0);
  const discount = Number(data?.discount || 0);

  const finalPrice = price * (1 - discount / 100);

  // 🔥 CHỈ DÙNG ẢNH TỪ DB
  const getImage = () => {
    if (data?.image && data.image.trim() !== "") {
      return data.image;
    }
    return defaultImage;
  };

  // ================= CLICK =================
  const handleClick = () => {
    navigate(`/product-details/${data?._id}`);
  };

  return (
    <WrapperCardStyle
      hoverable
      style={{ width: 200, cursor: "pointer" }}
      styles={{ body: { padding: "10px" } }}
      onClick={handleClick}
      cover={
        <img
          draggable={false}
          alt="product"
          src={getImage()}
          style={{ width: "100%", height: "200px", objectFit: "cover" }}
        />
      }
    >
      <StyleNameProduct>{data?.name}</StyleNameProduct>

      <WrapperReportText>
        <span style={{ marginRight: "4px" }}>
          <span>{data?.rating || 0}</span>
          <StarFilled style={{ fontSize: "12px", color: "#fadb14" }} />
        </span>

        <WrapperStyleTextSell>
          | Đã bán {data?.selled || 0}
        </WrapperStyleTextSell>
      </WrapperReportText>

      <WrapperPriceText>
        {Math.round(finalPrice).toLocaleString()}đ
        {discount > 0 && (
          <WrapperPriceDiscountText>-{discount}%</WrapperPriceDiscountText>
        )}
      </WrapperPriceText>

      {discount > 0 && (
        <div
          style={{
            fontSize: "12px",
            color: "#999",
            textDecoration: "line-through",
          }}
        >
          {price.toLocaleString()}đ
        </div>
      )}
    </WrapperCardStyle>
  );
};

export default CardComponent;
