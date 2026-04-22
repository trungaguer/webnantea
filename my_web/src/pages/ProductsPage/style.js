import styled from "styled-components";
import { Col } from "antd";

/* ================= PAGE WRAPPER ================= */
export const WrapperContainer = styled.div`
  padding: 20px 60px;
  background: #f6f7fb;
  min-height: 100vh;

  @media (max-width: 1200px) {
    padding: 20px 30px;
  }

  @media (max-width: 768px) {
    padding: 15px;
  }
`;

/* ================= LAYOUT COLUMN ================= */
export const WrapperNavbar = styled(Col)`
  position: sticky;
  top: 20px;

  height: fit-content;

  background: #fff;
  border-radius: 14px;
  padding: 16px;

  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);

  transition: all 0.25s ease;

  &:hover {
    box-shadow: 0 6px 18px rgba(0, 0, 0, 0.08);
  }
`;

export const WrapperMain = styled(Col)`
  min-height: 500px;
`;

/* ================= PRODUCT GRID ================= */
export const WrapperProducts = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;

  margin-top: 20px; /* ✅ THÊM DÒNG NÀY */

  @media (max-width: 1200px) {
    grid-template-columns: repeat(3, 1fr);
  }

  @media (max-width: 992px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 576px) {
    grid-template-columns: repeat(1, 1fr);
  }
`;

/* ================= PAGE TITLE ================= */
export const WrapperTitle = styled.h2`
  font-size: 20px;
  font-weight: 600;
  color: #222;

  margin-bottom: 15px;
`;

/* ================= EMPTY STATE ================= */
export const WrapperEmpty = styled.div`
  grid-column: span 4;
  display: flex;
  justify-content: center;
  align-items: center;

  padding: 40px 0;
  color: #999;
`;

/* ================= LOADING WRAPPER ================= */
export const WrapperLoading = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;

  height: 300px;
`;

/* ================= PAGINATION WRAPPER ================= */
export const WrapperPagination = styled.div`
  margin-top: 25px;
  display: flex;
  justify-content: center;
`;
