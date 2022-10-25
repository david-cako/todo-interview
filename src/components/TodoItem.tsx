import React, { useState } from 'react';
import { ToDo } from '../ApiClient';

interface TodoItemProps {
    todo: ToDo;
    onMarkDoneClick: (id: number) => any;
    onDragStart: () => any;
    onMove: (todo: ToDo, coords: { y: number }) => Promise<any>;
}

export default function TodoItem({
    todo,
    onMarkDoneClick,
    onDragStart,
    onMove
}: TodoItemProps) {
    const [isDragging, setIsDragging] = useState(false);
    const [yCoord, setYCoord] = useState(0);
    const [elemHeight, setElemHeight] = useState(0);

    const measuredRef = React.useCallback((ref: HTMLElement | null) => {
        if (ref !== null) {
            setElemHeight(ref.getBoundingClientRect().height)
        }
    }, [])

    const onMouseMove = (e: MouseEvent) => {
        setYCoord(e.pageY);
    }

    const onMouseDown = (e: React.MouseEvent) => {
        if (e.target instanceof Element && e.target.tagName !== "BUTTON") {
            setIsDragging(true);

            setYCoord(e.pageY);

            onDragStart();
            document.addEventListener("mousemove", onMouseMove);
        }
    }

    const onMouseUp = async (e: React.MouseEvent) => {
        if (isDragging) {
            document.removeEventListener("mousemove", onMouseMove);

            // await move request to prevent double render
            await onMove(todo, { y: e.pageY });

            setIsDragging(false);
        }
    }

    console.log(elemHeight);

    return (
        <div className="todo-item"
            data-item-id={todo.id}
            onMouseDown={onMouseDown}
            onMouseUp={onMouseUp}
            style={isDragging ?
                {
                    position: "absolute",
                    top: yCoord - (elemHeight / 2),
                    width: 700,
                    maxWidth: "calc(100vw - 2em)",
                    boxSizing: "border-box"
                }
                : undefined
            }
            ref={measuredRef}
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