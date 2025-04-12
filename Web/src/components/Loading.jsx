import React from 'react';
import styled from 'styled-components';

const LoadingOverlay = styled.div`
  position: absolute; /* Thay từ fixed thành absolute */
  top: 0;
  left: 0;
  width: 100%; /* Chiếm toàn bộ chiều rộng của container mẹ */
  height: 100%; /* Chiếm toàn bộ chiều cao của container mẹ */
  background: rgba(128, 128, 128, 0.5); /* Màu xám nhẹ, trong suốt */
  display: flex;
  flex-direction: column; /* Xếp spinner và text theo cột */
  justify-content: center;
  align-items: center;
  z-index: 9999;
  pointer-events: all; /* Chặn mọi tương tác chuột */
`;

const LoadingSpinner = styled.div`
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #3498db;
  border-radius: 50%;
  animation: spin 1s linear infinite;

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

const LoadingText = styled.div`
  margin-top: 10px;
  font-size: 18px;
  color: #333; /* Màu chữ tối để dễ đọc */
  font-weight: bold;
`;

const Loading = ({ isLoading }) => {
  if (!isLoading) return null;

  return (
    <LoadingOverlay>
      <LoadingSpinner />
      <LoadingText>Loading</LoadingText>
    </LoadingOverlay>
  );
};

export default Loading;