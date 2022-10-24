import { useEffect, useState } from 'react';
import { ApiClient, ToDo } from './ApiClient';
import './App.css';
import AddTodo from './components/AddTodo';

import TodoItem from './components/TodoItem';

const apiClient = new ApiClient();

function App() {
  const [todos, setTodos] = useState<ToDo[]>([]);
  const [label, setLabel] = useState('');

  useEffect(() => {
    apiClient
      .getToDos()
      .then((fetchedTodos) => setTodos(fetchedTodos))
      .catch(console.error);
  }, []);

  const onAddItemClick = async () => {
    const newTodo = await apiClient.addTodo(label);
    setTodos([...todos, newTodo]);
  }

  const onMarkDoneClick = async (todoId: number) => {
    const updatedTodo = await apiClient.toggleDone(todoId);
    const newTodos = [...todos]

    // find index of updated todo item and replace
    const updatedTodoIdx = newTodos.findIndex(
      item => item.id === updatedTodo.id);

    newTodos.splice(updatedTodoIdx, 1, updatedTodo);

    setTodos(newTodos);
  }

  return (
    <>
      <h1>To Do List</h1>

      <AddTodo label={label}
        onLabelChange={setLabel}
        onAddItemClick={onAddItemClick}
      />

      {todos.map((todo) => (
        <TodoItem todo={todo} onMarkDoneClick={onMarkDoneClick} />
      ))}
    </>
  );
}

export default App;
