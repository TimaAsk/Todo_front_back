import React from 'react'


const Todo = (props) => {
    return (
        <div>
            <div>
                <input type="checkbox"  defaultChecked={props.item.completed} onChange={() => props.toggleCompletedTodo(props.item.id, !props.item.completed)}/>
                <h3>{props.item.title}</h3>
                <button onClick={() => {props.onRemove(props.item.id)}}>Delete</button>
            </div>

        </div>
    )
};

export default Todo;