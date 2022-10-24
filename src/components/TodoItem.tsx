import React, { useState } from 'react';
import { ToDo } from '../ApiClient';

interface TodoItemProps {
    todo: ToDo;
    onMarkDoneClick: (id: number) => any;
    onDragStart: () => any;
    onDragEnd: () => any;
    onMove: (todo: ToDo, coords: { y: number }) => any;
}

export default function TodoItem({
    todo,
    onMarkDoneClick,
    onDragStart,
    onDragEnd,
    onMove
}: TodoItemProps) {
    const [isDragging, setIsDragging] = useState(false);
    const [yCoord, setYCoord] = useState(0);

    const onMouseMove = (e: MouseEvent) => {
        setYCoord(e.clientY);
    }

    const onMouseDown = (e: React.MouseEvent) => {
        setIsDragging(true);

        onDragStart();
        document.addEventListener("mousemove", onMouseMove);
    }

    const onMouseUp = (e: React.MouseEvent) => {
        setIsDragging(false);

        onDragEnd();
        onMove(todo, { y: e.clientY });

        document.removeEventListener("mousemove", onMouseMove);
    }

    return (
        <div className="todo-item"
            data-item-id={todo.id}
            onMouseDown={onMouseDown}
            onMouseUp={onMouseUp}
            style={isDragging ?
                {
                    position: "absolute",
                    top: yCoord,
                    width: 500
                }
                : undefined
            }
        >
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