import TodoItem from '../TodoItem/TodoItem';
import { Alert, Spin } from 'antd';
import { todosApi } from '../../store/Todos/api';
import { selectFilter } from '../../store/Todos/filter.slice';
import { useSelector } from 'react-redux';

const TodoList = () => {
  const selectedFilter = useSelector(selectFilter);
  const { data, error, isLoading } = todosApi.useGetTodosQuery(selectedFilter, {
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
