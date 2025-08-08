export interface TodoRequest {
	title?: string;
	isDone?: boolean; // изменение статуса задачи происходит через этот флаг
}

export type toDoStatus = 'all' | 'completed' | 'inWork';
export interface Todo {
	id: number;
	title: string;
	created: string; // ISO date string
	isDone: boolean;
}
