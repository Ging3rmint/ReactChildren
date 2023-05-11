import React, { forwardRef } from 'react';
import styled from 'styled-components';

import { COLORS } from '@/variables';
import { TodoStatusType } from 'store/todo';

interface ITodoCardProps {
  text: string;
  status: TodoStatusType;
  onClick: () => void;
}

const TodoCard = forwardRef<HTMLButtonElement, ITodoCardProps>(({ text, status, onClick }, ref) => {
  return (
    <TodoCardContainer ref={ref} $isCompleted={status === 'completed'} onClick={onClick}>
      {text}
    </TodoCardContainer>
  );
});

export default TodoCard;

const TodoCardContainer = styled.button<{ $isCompleted: boolean }>`
  cursor: pointer;
  position: relative;

  display: block;
  width: 100%;
  text-align: left;

  padding: 10px 15px;
  margin: 15px 0;

  border-radius: 50px;
  border: 1px solid ${COLORS.lightGray};
  background-color: ${COLORS.white};

  ${({ $isCompleted }) => ({
    color: $isCompleted ? COLORS.lightGray : COLORS.darkGray,
    textDecoration: $isCompleted ? 'line-through' : 'none'
  })}

  &:before {
    content: '';
    position: absolute;
    right: 15px;
    top: 50%;
    transform: translate(0, -50%);

    height: 15px;
    width: 15px;
    border: 1px solid ${({ $isCompleted }) => ($isCompleted ? COLORS.green : COLORS.lightGray)};
    border-radius: 100%;

    background-color: ${({ $isCompleted }) => ($isCompleted ? COLORS.green : COLORS.white)};
  }
`;
