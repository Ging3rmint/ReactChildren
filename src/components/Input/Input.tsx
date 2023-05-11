import React, { FC, InputHTMLAttributes, ReactNode } from 'react';
import styled from 'styled-components';

import { COLORS } from '@/variables';

interface IInputProps extends InputHTMLAttributes<HTMLInputElement> {
  children?: ReactNode;
}

const Input: FC<IInputProps> = ({ children, ...restProps }) => {
  return (
    <InputContainer>
      <input {...restProps} />
      {children}
    </InputContainer>
  );
};

export default Input;

const InputContainer = styled.div`
  display: flex;
  overflow: hidden;

  border: 1px solid ${COLORS.lightGray};
  border-radius: 8px;

  input {
    width: 100%;
    padding: 12px;

    border: none;
    color: ${COLORS.darkGray};
  }
`;
