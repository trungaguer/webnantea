import styled from "styled-components";

export const WrapperContainerLeft = styled.div`
  flex: 1;
  padding: 40px 45px 24px;
  display: flex;
  flex-direction: column;
  justify-content: center;

  h1 {
    font-size: 28px;
    margin-bottom: 8px;
    font-weight: 600;
    color: #222;
  }

  p {
    color: #666;
    margin-bottom: 16px;
    font-size: 14px;
  }
`;

export const WrapperContainerRight = styled.div`
  width: 350px;
  background: linear-gradient(135deg, #e6f7ff, #ffffff); /* đẹp hơn màu đơn */
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;

  img {
    margin-bottom: 12px;
  }
`;

export const WrapperTextLight = styled.span`
  color: rgb(13, 92, 182);
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    text-decoration: underline;
    color: #ff4d4f; /* hover đổi màu cho nổi */
  }
`;
