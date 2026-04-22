import { Row } from "antd";
import styled from "styled-components";

export const WrapperHeader = styled(Row)`
  background-color: #285c26;
  padding: 10px 120px;
  align-items: center;
  gap: 16px;
  flex-wrap: nowrap;

  /* thêm cái này cho đẹp hơn */
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
`;

export const WrapperTextHeader = styled.span`
  font-size: 20px; /* tăng nhẹ cho nổi bật */
  font-weight: bold;
  color: white;
  text-align: left;
  cursor: pointer;

  &:hover {
    opacity: 0.8;
  }
`;

export const WrapperHeaderAccount = styled.div`
  display: flex;
  align-items: center;
  color: white;
  gap: 10px;
  cursor: pointer;

  &:hover {
    opacity: 0.8;
  }
`;

export const WrapperHeaderSmall = styled.span`
  font-size: 12px;
  color: white;
  white-space: nowrap;

  &:hover {
    text-decoration: underline;
  }
`;
