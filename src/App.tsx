import { useEffect, useState } from 'react';
import { ApiClient, ToDo } from './ApiClient';
import './App.css';

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

  const onMarkDoneClick = async (todoId: string) => {
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

      <div className="add-todo-container">
        <input
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          placeholder="Buy groceries"
        />
        <button onClick={onAddItemClick}>Add ToDo</button>
      </div>

      {todos.map((todo) => (
        <div key={todo.id} className="todo-item">
          <label
            style={{ textDecoration: todo.done ? 'line-through' : 'none' }}
          >
            {todo.label}
          </label>
          <button onClick={() => onMarkDoneClick(todo.id)}>
            Mark {todo.done ? 'Undone' : 'Done'}
          </button>
        </div>
      ))}
    </>
  );
}

export default App;
