import { ToDo } from '../ApiClient';

interface TodoItemProps {
    todo: ToDo;
    onMarkDoneClick: (id: number) => any;
}

export default function TodoItem({ todo, onMarkDoneClick }: TodoItemProps) {
    return (
        <div className="todo-item">
            <label
                style={{ textDecoration: todo.done ? 'line-through' : 'none' }}
            >
                {todo.label}
            </label>
            <button onClick={() => onMarkDoneClick(todo.id)}>
                Mark {todo.done ? 'Undone' : 'Done'}
            </button>
        </div>
    )
}