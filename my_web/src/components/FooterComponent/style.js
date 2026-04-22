import styled from "styled-components";

/* WRAPPER */
export const WrapperFooter = styled.div`
  background: #1f2937;
  color: #fff;
  margin-top: 40px;
`;

/* TOP */
export const FooterTop = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 40px;

  padding: 40px 80px;

  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 480px) {
    grid-template-columns: repeat(1, 1fr);
  }
`;

/* COLUMN */
export const FooterColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

/* TITLE */
export const FooterTitle = styled.h4`
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 10px;
`;

/* TEXT */
export const FooterText = styled.span`
  font-size: 14px;
  color: #d1d5db;
  cursor: pointer;

  &:hover {
    color: #fff;
  }
`;

/* BOTTOM */
export const FooterBottom = styled.div`
  text-align: center;
  padding: 15px;
  border-top: 1px solid #374151;
  font-size: 13px;
  color: #9ca3af;
`;
