import React, { FC, useState, KeyboardEvent, MouseEvent } from 'react';
import styled from 'styled-components';
import moment from 'moment';

import useTodoStore from 'store/todo';
import { COLORS } from '@/variables';
import { Input } from '@/components';

type ChangeEventType = KeyboardEvent | MouseEvent;

const TodoHeader: FC = () => {
  const [todoText, setTodoText] = useState('');
  const todoList = useTodoStore((state) => state.todoList);
  const addTodoItem = useTodoStore((state) => state.addTodoItem);
  const setAnimateTodoList = useTodoStore((state) => state.setAnimateTodoList);
  const setCurrentFilter = useTodoStore((state) => state.setCurrentFilter);

  const onAddTodo = (event: ChangeEventType) => {
    if ((event.type !== 'click' && (event as KeyboardEvent).key !== 'Enter') || !todoText.length) {
      return;
    }

    setCurrentFilter('all');
    setAnimateTodoList(false);
    setTodoText('');
    addTodoItem({
      id: `${todoList.length}`,
      created: moment(),
      status: 'active',
      text: todoText
    });
  };

  return (
    <TodoHeaderContainer>
      <h1>Todo App</h1>
      <Input onKeyDown={onAddTodo} value={todoText} onChange={({ target: { value } }) => setTodoText(value)}>
        <TodoAddButton onClick={onAddTodo}>+</TodoAddButton>
      </Input>
    </TodoHeaderContainer>
  );
};

export default TodoHeader;

const TodoHeaderContainer = styled.div`
  margin-bottom: 50px;

  h1 {
    text-align: center;
    margin-bottom: 20px;
    color: ${COLORS.darkGray};
  }
`;

const TodoAddButton = styled.button`
  cursor: pointer;
  padding: 0 10px;

  display: flex;
  align-items: center;

  border: none;
  color: ${COLORS.darkGray};
`;
