import { Input } from "antd";
import React from "react";

const { Password } = Input;

const InputComponent = ({
  placeholder,
  size = "middle",
  variant = "outlined",
  style,
  type = "text",
  allowClear = true,
  ...rests
}) => {
  const Component = type === "password" ? Password : Input;

  return (
    <Component
      size={size}
      placeholder={placeholder}
      variant={variant}
      style={style}
      allowClear={allowClear}
      {...rests}
    />
  );
};

export default InputComponent;
