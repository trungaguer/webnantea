import React from "react";
import { WrapperInputStyle } from "./style"; // sửa path cho đúng

const InputForm = (props) => {
  const { placeholder = "Nhập text", style, ...rests } = props;
  const [valueInput, setValueInput] = React.useState("");

  return (
    <WrapperInputStyle
      placeholder={placeholder}
      value={valueInput}
      onChange={(e) => setValueInput(e.target.value)}
      style={{
        width: "100%",
        height: "40px",
        ...style,
      }}
      {...rests}
    />
  );
};

export default InputForm;
