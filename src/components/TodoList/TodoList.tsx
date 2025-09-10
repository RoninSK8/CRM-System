import TodoItem from '../TodoItem/TodoItem';
import { Alert, Spin } from 'antd';
import { todosApi } from '../../store/Todos/api';
import { useAppSelector } from '../../store/redux';
import { selectFilter } from '../../store/Todos/filter.slice';

const TodoList = () => {
  const filterState = useAppSelector((state) => selectFilter(state).filter);
  const { data, error, isLoading } = todosApi.useGetTodosQuery(filterState, {
    pollingInterval: 5000,
    skipPollingIfUnfocused: true,
  });
  const todos = data?.data;

  return (
    <>
      {error && (
        <Alert message={'Ошибка загрузки данных...'} type='error' showIcon />
      )}

      {todos && todos.length ? (
        todos.map((todo) => {
          return <TodoItem key={todo.id} todo={todo} />;
        })
      ) : (
        <p>Список задач пуст...</p>
      )}
      {isLoading && <Spin />}
    </>
  );
};

export default TodoList;
