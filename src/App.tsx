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
      .then((fetchedTodos) => { setTodos(fetchedTodos) })
      .catch(console.error);
  }, []);

  const onAddItem = async () => {
    const newTodo = await apiClient.addTodo(label);
    setTodos([...todos, newTodo]);
    setLabel("");
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

  const onMove = async (todo: ToDo, { y }: { y: number }) => {
    setIsDragging(false);

    let newIdx;

    const items = document.querySelectorAll(`.todo-item:not([data-item-id="${todo.id}"])`);

    // find new item index
    for (let i = 0; i < items.length; i++) {
      const item = items[i];

      // find hovered item by page position
      const rect = item.getBoundingClientRect();
      const itemAbsBottom = rect.bottom + window.scrollY;

      if (y <= itemAbsBottom) {
        newIdx = i;
        break;
      } else if (i === items.length - 1 && y > itemAbsBottom) {
        // item is dragged past bottom of list
        newIdx = i + 1;
      }
    }

    if (newIdx !== undefined) {
      await apiClient.updateIndex(todo.id, newIdx + 1);

      const updatedTodos = await apiClient.getToDos();

      setTodos(updatedTodos);
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
        onAddItem={onAddItem}
      />

      {todos.map((todo) => (
        <TodoItem todo={todo}
          key={todo.id}
          onMarkDoneClick={onMarkDoneClick}
          onDragStart={() => setIsDragging(true)}
          onMove={onMove}
        />
      ))}
    </div>
  );
}

export default App;
