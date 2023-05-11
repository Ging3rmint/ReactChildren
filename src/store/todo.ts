import create from 'zustand';
import { Moment } from 'moment';

export type TodoStatusType = 'completed' | 'active';

export type TodoFilterType = TodoStatusType | 'all';

interface ITodoListItem {
  id: string;
  text: string;
  status: TodoStatusType;
  created: Moment;
}

interface ITodoListState {
  todoList: ITodoListItem[];
  todoListSummary: Record<TodoFilterType, number>;
  currentFilter: TodoFilterType;
  filteredTodoList: ITodoListItem[];
  animateTodoList: boolean;
  setCurrentFilter: (filter: TodoFilterType) => void;
  setAnimateTodoList: (isAnimate: boolean) => void;
  addTodoItem: (item: ITodoListItem) => void;
  filterTodoListByStatus: (filterStatus: TodoStatusType) => void;
  setTodoList: (list: ITodoListItem[]) => void;
}

const SORT_ORDER = ['active', 'completed'];

const getSortedTodoLists = (list: ITodoListItem[]) =>
  list.sort(({ status: statusA, created: createdA }, { status: statusB, created: createdB }) => {
    const sortOrderA = SORT_ORDER.indexOf(statusA);
    const sortOrderB = SORT_ORDER.indexOf(statusB);

    if (sortOrderA === sortOrderB) {
      return createdB.unix() - createdA.unix();
    }

    return SORT_ORDER.indexOf(statusA) - SORT_ORDER.indexOf(statusB);
  });

const getTodolistSummary = (list: ITodoListItem[]) =>
  list.reduce(
    (acc: Record<TodoFilterType, number>, { status }) => {
      const { all, active, completed } = acc;

      return {
        all: all + 1,
        active: status === 'active' ? active + 1 : active,
        completed: status === 'completed' ? completed + 1 : completed
      };
    },
    { all: 0, active: 0, completed: 0 }
  );

const useTodoStore = create<ITodoListState>((set) => ({
  todoList: [],
  filteredTodoList: [],
  todoListSummary: { all: 0, active: 0, completed: 0 },
  animateTodoList: true,
  currentFilter: 'all',
  setCurrentFilter: (filter: TodoFilterType) =>
    set((currentState) => ({
      ...currentState,
      currentFilter: filter
    })),
  setAnimateTodoList: (isAnimate: boolean) =>
    set((currentState) => ({
      ...currentState,
      animateTodoList: isAnimate
    })),
  addTodoItem: (item: ITodoListItem) =>
    set((currentState) => {
      const { todoList, todoListSummary } = currentState;
      const { all, active } = todoListSummary;

      return {
        ...currentState,
        todoListSummary: {
          ...todoListSummary,
          all: all + 1,
          active: active + 1
        },
        todoList: [item, ...todoList]
      };
    }),
  filterTodoListByStatus: (filterStatus: TodoStatusType) =>
    set((currentState) => {
      const { todoList } = currentState;

      if (!todoList.length) {
        return currentState;
      }

      const filteredTodoList = todoList.filter(({ status }) => status === filterStatus);

      return {
        ...currentState,
        filteredTodoList
      };
    }),
  setTodoList: (todoList: ITodoListItem[]) =>
    set((currentState) => {
      const newTodoList = getSortedTodoLists(todoList);
      const newtodoListSummary = getTodolistSummary(todoList);

      return {
        ...currentState,
        todoListSummary: newtodoListSummary,
        todoList: newTodoList
      };
    })
}));

export default useTodoStore;
