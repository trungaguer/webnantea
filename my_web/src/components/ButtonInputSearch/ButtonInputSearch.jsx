import React, { useState } from "react";
import { SearchOutlined } from "@ant-design/icons";
import InputComponent from "../InputComponent/InputComponent";
import ButtonComponent from "../ButtonComponent/ButtonComponent";

const ButtonInputSearch = (props) => {
  const {
    placeholder,
    size,
    textButton,
    variant = "outlined",
    backgroundColorInput = "white",
    backgroundColorButton = "#cde020",
    colorButton = "black",

    // ✅ thêm props
    onSearch,
    onChange,
    value: propValue = "",
  } = props;

  // ✅ state nội bộ
  const [value, setValue] = useState(propValue);

  // ================= HANDLE CHANGE =================
  const handleChange = (e) => {
    const val = e.target.value;
    setValue(val);

    if (onChange) {
      onChange(val);
    }
  };

  // ================= HANDLE SEARCH =================
  const handleSearch = () => {
    if (onSearch) {
      onSearch(value);
    }
  };

  // ================= ENTER KEY =================
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div style={{ display: "flex", backgroundColor: "white" }}>
      <InputComponent
        size={size}
        placeholder={placeholder}
        variant={variant}
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        style={{ backgroundColor: backgroundColorInput }}
      />

      <ButtonComponent
        size="large"
        styleButton={{ backgroundColor: backgroundColorButton }}
        icon={<SearchOutlined style={{ color: colorButton }} />}
        textButton={textButton}
        styleTextButton={{ color: colorButton }}
        onClick={handleSearch} // ✅ click search
      >
        {textButton}
      </ButtonComponent>
    </div>
  );
};

export default ButtonInputSearch;
