import AddTodoForm from '../components/AddTodoForm/AddTodoForm';
import FilterTabList from '../components/FilterTabList/FilterTabList';
import TodoList from '../components/TodoList/TodoList';

export function TodosPage() {
  return (
    <>
      <AddTodoForm />
      <FilterTabList />
      <TodoList />
    </>
  );
}

export default TodosPage;
