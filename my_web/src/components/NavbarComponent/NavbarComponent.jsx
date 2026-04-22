import React, { useState } from "react";
import {
  WrapperContent,
  WrapperLableText,
  WrapperTextValue,
  WrapperTextPrice,
  WrapperReset,
} from "./style";
import { Checkbox, Rate } from "antd";
import { ReloadOutlined } from "@ant-design/icons";

const NavbarComponent = ({ onFilter }) => {
  const [activeCategory, setActiveCategory] = useState(null);
  const [activePrice, setActivePrice] = useState(null);
  const [activeRating, setActiveRating] = useState(null);
  const [checkedValues, setCheckedValues] = useState([]);

  const categories = [
    { label: "Coffee", value: "coffee" },
    { label: "Milk Tea", value: "milk tea" },
    { label: "Tea", value: "tea" },
    { label: "Latte", value: "latte" },
    { label: "Smooth", value: "smooth" },
  ];

  // ================= RESET =================
  const handleReset = () => {
    setActiveCategory(null);
    setActivePrice(null);
    setActiveRating(null);
    setCheckedValues([]);

    onFilter({
      type: "reset",
      value: null,
    });
  };

  // ================= CATEGORY =================
  const handleCategory = (value) => {
    const newValue = activeCategory === value ? null : value;
    setActiveCategory(newValue);

    onFilter({
      type: "category",
      value: newValue,
    });
  };

  // ================= PRICE =================
  const handlePrice = (label) => {
    const newValue = activePrice === label ? null : label;
    setActivePrice(newValue);

    let priceRange = null;

    if (newValue === "Dưới 50.000đ") {
      priceRange = { min: 0, max: 50000 };
    } else if (newValue === "50.000đ - 100.000đ") {
      priceRange = { min: 50000, max: 100000 };
    } else if (newValue === "Trên 100.000đ") {
      priceRange = { min: 100000, max: Infinity };
    }

    onFilter({
      type: "price",
      value: priceRange,
    });
  };

  // ================= RATING =================
  const handleRating = (value) => {
    const newValue = activeRating === value ? null : value;
    setActiveRating(newValue);

    onFilter({
      type: "rating",
      value: newValue,
    });
  };

  // ================= CHECKBOX =================
  const handleCheckbox = (values) => {
    setCheckedValues(values);

    onFilter({
      type: "checkbox",
      value: values,
    });
  };

  // ================= RENDER =================
  const renderContent = (type, options) => {
    switch (type) {
      case "text":
        return options.map((option) => (
          <WrapperTextValue
            key={option.value}
            $active={activeCategory === option.value}
            onClick={() => handleCategory(option.value)}
          >
            {option.label}
          </WrapperTextValue>
        ));

      case "checkbox":
        return (
          <Checkbox.Group
            value={checkedValues}
            style={{ display: "flex", flexDirection: "column", gap: 10 }}
            onChange={handleCheckbox}
          >
            {options.map((option) => (
              <Checkbox key={option.value} value={option.value}>
                {option.label}
              </Checkbox>
            ))}
          </Checkbox.Group>
        );

      case "star":
        return options.map((option) => (
          <div
            key={option}
            onClick={() => handleRating(option)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              cursor: "pointer",
              padding: "6px 8px",
              borderRadius: 8,
              background: activeRating === option ? "#eaf3ff" : "transparent",
            }}
          >
            <Rate disabled value={option} style={{ fontSize: 12 }} />
            <span style={{ fontSize: 13 }}>từ {option} sao</span>
          </div>
        ));

      case "price":
        return options.map((option) => (
          <WrapperTextPrice
            key={option}
            $active={activePrice === option}
            onClick={() => handlePrice(option)}
          >
            {option}
          </WrapperTextPrice>
        ));

      default:
        return null;
    }
  };

  return (
    <div>
      {/* HEADER */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <WrapperLableText>Bộ lọc</WrapperLableText>

        <WrapperReset onClick={handleReset}>
          <ReloadOutlined />
          Xóa tất cả
        </WrapperReset>
      </div>

      {/* CATEGORY */}
      <WrapperLableText>Danh mục</WrapperLableText>
      <WrapperContent>{renderContent("text", categories)}</WrapperContent>

      {/* PRICE */}
      <WrapperLableText>Giá</WrapperLableText>
      <WrapperContent>
        {renderContent("price", [
          "Dưới 50.000đ",
          "50.000đ - 100.000đ",
          "Trên 100.000đ",
        ])}
      </WrapperContent>

      {/* RATING */}
      <WrapperLableText>Đánh giá</WrapperLableText>
      <WrapperContent>{renderContent("star", [5, 4, 3])}</WrapperContent>
    </div>
  );
};

export default NavbarComponent;
