import styled from "styled-components";

export const WrapperSearchPage = styled.div`
  background: #f5f5f5;
  min-height: 100vh;
  display: flex;
  justify-content: center;
`;

export const Container = styled.div`
  width: 1200px;
  padding: 30px 0;
`;

export const WrapperHeader = styled.div`
  margin-bottom: 24px;
  padding-bottom: 12px;
  border-bottom: 1px solid #f0f0f0;
`;

export const Title = styled.h2`
  font-size: 28px;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 6px;

  letter-spacing: -0.3px;

  span {
    color: #1677ff;
    font-weight: 700;
  }
`;
export const SubText = styled.div`
  color: #666;
  font-size: 14px;
`;

export const WrapperContent = styled.div`
  background: #fff;
  padding: 20px;
  border-radius: 12px;
`;

export const WrapperCard = styled.div`
  background: #fff;
  padding: 12px;
  border-radius: 12px;
  border: 1px solid #f0f0f0;
  transition: all 0.25s ease;
  cursor: pointer;

  &:hover {
    transform: translateY(-6px);
    box-shadow: 0 12px 24px rgba(0, 0, 0, 0.12);
    border-color: transparent;
  }
`;

export const WrapperLoading = styled.div`
  text-align: center;
  padding: 50px 0;
`;

export const WrapperEmpty = styled.div`
  padding: 60px 0;
  text-align: center;
`;
