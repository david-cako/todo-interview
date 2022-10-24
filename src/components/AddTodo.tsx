interface AddTodoProps {
    label: string;
    onLabelChange: (label: string) => any;
    onAddItemClick: () => any;
}

export default function AddTodo({
    label,
    onLabelChange,
    onAddItemClick
}: AddTodoProps) {
    return (
        <div className="add-todo-container">
            <input
                value={label}
                onChange={(e) => onLabelChange(e.target.value)}
                placeholder="Buy groceries"
            />
            <button onClick={onAddItemClick}>Add ToDo</button>
        </div>
    )
}