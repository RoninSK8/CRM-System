import AddTodoForm from './components/AddTodoForm/AddTodoForm';
import TodoList from './components/TodoList/TodoList';
import useTodos from './hooks/useTodos';

function App() {
	const { error, isLoading, todos, addTodo, deleteTodo, editTodo } = useTodos();
	return (
		<main>
			<div className="todo">
				<AddTodoForm isLoading={isLoading} handleAddTodo={addTodo} />
				<TodoList
					todos={todos}
					isLoading={isLoading}
					error={error}
					handleDelete={deleteTodo}
					handleEdit={editTodo}
				/>
			</div>
		</main>
	);
}

export default App;
