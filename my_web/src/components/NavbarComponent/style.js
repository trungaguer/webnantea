import styled from "styled-components";

export const WrapperLableText = styled.div`
  font-size: 13px;
  font-weight: 600;
  color: #111;
  margin: 16px 0 8px;
`;

export const WrapperContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding-left: 4px;
`;

export const WrapperTextValue = styled.div`
  font-size: 13px;
  cursor: pointer;
  color: ${({ $active }) => ($active ? "#1677ff" : "#555")};
  font-weight: ${({ $active }) => ($active ? 600 : 400)};
  padding: 6px 8px;
  border-radius: 8px;
  transition: all 0.2s;

  &:hover {
    background: #f5f5f5;
    color: #1677ff;
  }
`;

export const WrapperTextPrice = styled.div`
  font-size: 13px;
  cursor: pointer;
  color: ${({ $active }) => ($active ? "#1677ff" : "#555")};
  font-weight: ${({ $active }) => ($active ? 600 : 400)};
  padding: 6px 8px;
  border-radius: 8px;
  transition: all 0.2s;

  &:hover {
    background: #f5f5f5;
    color: #1677ff;
  }
`;

export const WrapperReset = styled.div`
  font-size: 12px;
  color: #999;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: 0.2s;

  &:hover {
    color: #1677ff;
    transform: translateY(-1px);
  }
`;
