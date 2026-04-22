import styled from "styled-components";
import { Upload } from "antd"; // 🔥 thêm dòng này

export const WrapperProfile = styled.div`
  background: #fff;
  margin-top: 20px;
  padding: 30px;
  border-radius: 6px;
`;

export const WrapperHeader = styled.h2`
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 20px;
`;

export const WrapperContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

export const WrapperInput = styled.div`
  display: flex;
  flex-direction: column;
`;

export const WrapperLabel = styled.label`
  font-weight: 500;
  margin-bottom: 5px;
`;

export const WrapperButton = styled.button`
  margin-top: 20px;
  height: 40px;
  background: #75f8d7;
  border: none;
  color: #000;
  font-weight: 600;
  cursor: pointer;
  border-radius: 4px;

  &:hover {
    opacity: 0.8;
  }
`;

export const WrapperContentProfile = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

export const WrapperUploadFile = styled(Upload)`
  margin-top: 10px;
`;
