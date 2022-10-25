interface AddTodoProps {
    label: string;
    onLabelChange: (label: string) => any;
    onAddItem: () => any;
}

export default function AddTodo({
    label,
    onLabelChange,
    onAddItem
}: AddTodoProps) {
    return (
        <form className="add-todo-container"
            onSubmit={(e) => {
                e.preventDefault();
                onAddItem();
            }}
        >
            <input
                value={label}
                onChange={(e) => onLabelChange(e.target.value)}
                placeholder="Buy groceries"
            />
            <button type="submit">Add ToDo</button>
        </form>
    )
}