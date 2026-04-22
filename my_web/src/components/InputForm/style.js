import { Input } from "antd";
import styled from "styled-components";

export const WrapperInputStyle = styled(Input)`
  border: none;
  border-bottom: 1px solid #ccc;
  border-radius: 0;
  transition: all 0.2s ease;

  /* hover */
  &:hover {
    border-bottom: 1px solid #4096ff;
  }

  /* focus đúng chuẩn AntD */
  &.ant-input:focus,
  &.ant-input-focused {
    border-bottom: 1px solid #4096ff;
    box-shadow: none;
  }

  /* bỏ padding thừa */
  .ant-input {
    padding-left: 0;
  }

  /* placeholder đẹp hơn */
  &::placeholder {
    color: #999;
  }
`;
