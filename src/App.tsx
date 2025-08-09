import AddTodoForm from './components/AddTodoForm/AddTodoForm';
import FilterTabList from './components/FilterTabList/FilterTabList';
import TodoList from './components/TodoList/TodoList';
import useTodos from './hooks/useTodos';

function App() {
	const {
		error,
		isLoading,
		todos,
		addTodo,
		deleteTodo,
		editTodo,
		filter,
		setFilter,
		todoInfo,
	} = useTodos();
	return (
		<main>
			<div className="todo">
				<AddTodoForm isLoading={isLoading} handleAddTodo={addTodo} />
				<FilterTabList
					filter={filter}
					setFilter={setFilter}
					todoInfo={todoInfo}
				/>
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
