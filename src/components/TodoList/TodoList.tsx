import TodoItem from "../TodoItem/TodoItem";
import type { Todo } from "../../types/todo";
import { Alert } from "antd";
import { memo, useMemo } from "react";

interface TodoListProps {
  todos: Todo[];
  error: string;
  fetchTodos: () => void;
}

const TodoList = memo(({ error, todos, fetchTodos }: TodoListProps) => {
  const props = useMemo<TodoListProps>(
    () => ({
      error,
      todos,
      fetchTodos,
    }),
    [error, todos, fetchTodos],
  );

  return (
    <>
      {error && (
        <Alert message={"Ошибка загрузки данных..."} type="error" showIcon />
      )}
      <div>
        {props.todos.length > 0 ? (
          props.todos.map((todo) => {
            return (
              <TodoItem
                key={todo.id}
                todo={todo}
                fetchTodos={props.fetchTodos}
              />
            );
          })
        ) : (
          <p>Список задач пуст...</p>
        )}
      </div>
    </>
  );
});

export default TodoList;
