import React from 'react'
import Todo from "./Todos";


const TodoList = (props) => {
    return (
        <div>
            {props.items.map((item) => (
                <Todo
                    key={item.id}
                    item={item}
                    onRemove={props.removeItem}
                    toggleCompletedTodo={props.toggleCompletedTodo}
                />
            ))}

        </div>
    )
};

export default TodoList;