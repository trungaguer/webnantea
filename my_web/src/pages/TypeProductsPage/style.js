import { Col } from "antd";
import styled from "styled-components";

/* PRODUCTS GRID */
export const WrapperProducts = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24px;
  margin-top: 24px;

  @media (max-width: 1024px) {
    grid-template-columns: repeat(3, 1fr);
  }

  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 480px) {
    grid-template-columns: repeat(1, 1fr);
  }
`;

/* NAVBAR */
export const WrapperNavbar = styled(Col)`
  background: #ffffff;
  padding: 20px;
  border-radius: 10px;
  height: fit-content;
  margin-top: 24px;
  width: 100%;

  /* minimal shadow */
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);

  position: sticky;
  top: 20px;

  /* typography */
  h3 {
    font-size: 15px;
    font-weight: 500;
    color: #333;
    margin-bottom: 12px;
  }
`;