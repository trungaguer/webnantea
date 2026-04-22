import styled from "styled-components";

export const WrapperContainer = styled.div`
  padding: 0 80px 60px;
  background: #f5f5f5;
  min-height: 100vh;

  @media (max-width: 1024px) {
    padding: 0 40px 40px;
  }

  @media (max-width: 768px) {
    padding: 0 16px 30px;
  }
`;

export const WrapperCategory = styled.div`
  display: flex;
  gap: 12px;
  padding: 20px 0;
  overflow-x: auto;
  scrollbar-width: none;

  &::-webkit-scrollbar {
    display: none;
  }

  .category-item {
    padding: 8px 18px;
    background: #fff;
    border-radius: 999px;
    border: 1px solid #e5e5e5;
    cursor: pointer;
    transition: all 0.25s ease;
    font-size: 14px;
    font-weight: 500;
    color: #333;
    flex-shrink: 0;
  }

  /* hover */
  .category-item:hover {
    background: #3dff16;
    color: #fff;
    border-color: #45ff16;
    transform: translateY(-2px);
  }

  /* active (🔥 quan trọng) */
  .category-item.active {
    background: #31ff16;
    color: #fff;
    border-color: #1eff16;
  }
`;

export const WrapperTitle = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 30px 0 10px;

  span:first-child {
    font-size: 22px;
    font-weight: 600;
  }

  .view-all {
    font-size: 14px;
    color: #1677ff;
    cursor: pointer;
    transition: 0.2s;
  }

  .view-all:hover {
    text-decoration: underline;
  }
`;

export const WrapperProducts = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  min-height: 200px;

  @media (max-width: 1024px) {
    grid-template-columns: repeat(3, 1fr);
  }

  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }

  .loading {
    grid-column: 1 / -1;
    text-align: center;
    margin-top: 50px;
  }
`;

export const WrapperMore = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 40px;
`;

export const WrapperButtonMore = styled.button`
  border: 1px solid #1677ff;
  background: #fff;
  color: #1677ff;
  padding: 12px 28px;
  border-radius: 999px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.25s ease;

  &:hover {
    background: #1677ff;
    color: #fff;
    transform: translateY(-2px);
  }
`;
