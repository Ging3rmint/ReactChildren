import React, { createRef, FC } from 'react';
import styled from 'styled-components';

import { COLORS } from '@/variables';
import useTodoStore, { TodoStatusType, TodoFilterType } from 'store/todo';
import { AnimatedList, TabSelector } from '@/components';
import TodoCard from '../TodoCard/TodoCard';

const FILTER_SELECTIONS = [
  {
    text: 'ALL',
    value: 'all'
  },
  {
    text: 'Active',
    value: 'active'
  },
  {
    text: 'Completed',
    value: 'completed'
  }
];

const TodoListing: FC = () => {
  const currentFilter = useTodoStore((state) => state.currentFilter);
  const todoList = useTodoStore((state) => state.todoList);
  const filteredTodoList = useTodoStore((state) => state.filteredTodoList);
  const animateTodoList = useTodoStore((state) => state.animateTodoList);
  const todoListSummary = useTodoStore((state) => state.todoListSummary);
  const filterTodoListByStatus = useTodoStore((state) => state.filterTodoListByStatus);
  const setTodoList = useTodoStore((state) => state.setTodoList);
  const setAnimateTodoList = useTodoStore((state) => state.setAnimateTodoList);
  const setCurrentFilter = useTodoStore((state) => state.setCurrentFilter);

  const displayList = currentFilter === 'all' ? todoList : filteredTodoList;

  const onTodoListFilter = (value: string) => {
    setAnimateTodoList(false);
    setCurrentFilter(value as TodoFilterType);
    filterTodoListByStatus(value as TodoStatusType);
  };

  const onTodoCardClick = (index: number) => {
    const newTodoList = [...todoList];
    const { status } = todoList[index];

    if (status === 'completed') {
      return;
    }

    newTodoList[index] = {
      ...todoList[index],
      status: 'completed'
    };

    setAnimateTodoList(true);
    setTodoList(newTodoList);
    filterTodoListByStatus(currentFilter as TodoStatusType);
  };

  return (
    <TodoListingContainer>
      <TodoListingTabSelector
        selections={FILTER_SELECTIONS}
        currentActiveValue={currentFilter}
        numberIndicators={todoListSummary}
        onClick={onTodoListFilter}
      />
      {!!displayList.length && (
        <TodoListingAnimatedList pauseAnimate={!animateTodoList}>
          {displayList.map(({ id, ...item }, index) => (
            <TodoCard key={id} {...item} ref={createRef()} onClick={() => onTodoCardClick(index)} />
          ))}
        </TodoListingAnimatedList>
      )}
      {!displayList.length && <TodoListingMessage>EMPTY</TodoListingMessage>}
    </TodoListingContainer>
  );
};

export default TodoListing;

const TodoListingContainer = styled.div`
  height: calc(100% - 125px);
`;

const TodoListingTabSelector = styled(TabSelector)`
  margin-bottom: 20px;
`;

const TodoListingAnimatedList = styled(AnimatedList)`
  max-height: calc(100% - 57px);
  overflow-y: auto;
  padding: 0 10px;
`;

const TodoListingMessage = styled.p`
  text-align: center;
  padding: 50px 0;
  color: ${COLORS.darkGray};
  opacity: 0.6;
`;
