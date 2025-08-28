export default function validateTodoTitle(toDoTitle: string): string {
  if (!toDoTitle.trim()) {
    return "Это поле не может быть пустым";
  }
  if (toDoTitle.trim().length < 2) {
    return "Минимальная длина текста 2 символа";
  }
  if (toDoTitle.trim().length > 64) {
    return "Максимальная длина текста 64 символа";
  }
  return "";
}
