import TodoItem from '../TodoItem/TodoItem';
import type { Todo } from '../../types/todo';
import { Alert } from 'antd';
import { memo } from 'react';

interface TodoListProps {
  todos: Todo[];
  error: string;
  fetchTodos: () => void;
}

const TodoList = memo(({ error, todos, fetchTodos }: TodoListProps) => {
  return (
    <>
      {error && (
        <Alert message={'Ошибка загрузки данных...'} type='error' showIcon />
      )}

      {todos.length ? (
        todos.map((todo) => {
          return <TodoItem todo={todo} fetchTodos={fetchTodos} />;
        })
      ) : (
        <p>Список задач пуст...</p>
      )}
    </>
  );
});

export default TodoList;
