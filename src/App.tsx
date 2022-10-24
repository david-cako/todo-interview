import { useEffect, useState } from 'react';
import { ApiClient, ToDo } from './ApiClient';
import './App.css';
import AddTodo from './components/AddTodo';

import TodoItem from './components/TodoItem';

const apiClient = new ApiClient();

function App() {
  const [todos, setTodos] = useState<ToDo[]>([]);
  const [label, setLabel] = useState('');
  const [isDragging, setIsDragging] = useState(false);

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

  const onMove = (todo: ToDo, { y }: { y: number }) => {
    let newIdx;

    const items = document.querySelectorAll(".todo-item");

    // find new item index
    for (let i = 0; i < items.length; i++) {
      const item = items[i];

      const itemId = item.getAttribute("data-item-id");

      // exclude currently dragged item
      if (itemId !== null && todo.id === parseInt(itemId)) {
        continue;
      }

      const rect = item.getBoundingClientRect();
      if (y <= rect.bottom) {
        newIdx = i;
        break;
      }
    }

    if (newIdx !== undefined) {
      const newTodos = todos.filter(item => item.id !== todo.id);

      newTodos.splice(newIdx, 0, todo);

      setTodos(newTodos);
    }
  }

  return (
    <div style={isDragging
      ? { userSelect: "none", WebkitUserSelect: "none" }
      : undefined
    }>
      <h1>To Do List</h1>

      <AddTodo label={label}
        onLabelChange={setLabel}
        onAddItemClick={onAddItemClick}
      />

      {todos.map((todo) => (
        <TodoItem todo={todo}
          key={todo.id}
          onMarkDoneClick={onMarkDoneClick}
          onDragStart={() => setIsDragging(true)}
          onDragEnd={() => setIsDragging(false)}
          onMove={onMove}
        />
      ))}
    </div>
  );
}

export default App;
