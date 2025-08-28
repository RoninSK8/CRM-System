import { memo, useState } from "react";
import { addTodoApi } from "../../api/apiTodos";
import { Alert, Button, Form, Input } from "antd";

interface AddTodoFormProps {
  fetchTodos: () => void;
}

const AddTodoForm = memo(({ fetchTodos }: AddTodoFormProps) => {
  const [errorText, setErrorText] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [form] = Form.useForm();

  const onSubmit = async () => {
    const todoTitle = form.getFieldsValue().title;
    const trimmedTodoTitle = todoTitle.trim();

    setErrorText("");
    setIsLoading(true);
    try {
      await addTodoApi(trimmedTodoTitle);
      fetchTodos();
      form.setFieldValue("title", "");
    } catch (error) {
      console.error("Error:", error);
      setErrorText("Ошибка при добавлении задачи.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Form
        form={form}
        style={{ width: "100%", padding: 8 }}
        layout="inline"
        autoComplete="off"
        onFinish={onSubmit}
      >
        <Form.Item
          name="title"
          style={{ flex: 1 }}
          rules={[
            () => ({
              validator(_, value) {
                if (!value.trim()) {
                  return Promise.reject(
                    new Error("Это поле не может быть пустым"),
                  );
                }
                if (value.trim().length < 2) {
                  return Promise.reject(
                    new Error("Минимальная длина текста 2 символа"),
                  );
                }
                if (value.trim().length > 64) {
                  return Promise.reject(
                    new Error("Максимальная длина текста 64 символа"),
                  );
                }
                return Promise.resolve();
              },
            }),
          ]}
        >
          <Input placeholder="Введите текст задачи..." />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" disabled={isLoading}>
            Создать
          </Button>
        </Form.Item>
      </Form>
      {errorText && <Alert message={errorText} type="error" showIcon />}
    </>
  );
});

export default AddTodoForm;
