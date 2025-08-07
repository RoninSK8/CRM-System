export async function addTodo(title: string) {
	const userData = {
		title,
		isDone: false,
	};
	const databaseUrl = import.meta.env.VITE_DATABASE_URL;
	const response = await fetch(`${databaseUrl}/todos`, {
		method: 'POST',
		body: JSON.stringify(userData),
	});

	if (response.ok) {
		return response.body;
	} else {
		throw new Error('Ошибка HTTP: ' + response.status);
	}
}
