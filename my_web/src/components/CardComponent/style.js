import styled from "styled-components";
import { Card } from "antd";
export const WrapperCardStyle = styled(Card)`
  width: 200px;
  & img {
    height: 200px;
    width: 200px;
  }
`;
export const StyleNameProduct = styled.div`
  font-weight: 400;
  font-size: 12px;
  line-height: 16px;
  color: #000000;
`;
export const WrapperReportText = styled.div`
  font-size: 11px;
  color: #000000;
  display: flex;
  align-items: center;
  margin: 6px 0 0;
`;
export const WrapperPriceText = styled.div`
  color: #f70b0b;
  font-size: 16px;
  font-weight: 500;
`;

export const WrapperPriceDiscountText = styled.span`
  color: #f70b0b;
  font-size: 12px;
  font-weight: 500;
`;
export const WrapperStyleTextSell = styled.span`
  font-size: 15px;
  line-height: 24px;
  color: rgb(120, 120, 120);
`;
