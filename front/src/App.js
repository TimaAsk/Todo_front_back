import './App.css';
import * as React from "react";
import {useState, useEffect} from "react";
import TodoList from "./components/TodoList";


class Requester {
    constructor(basePath) {
        this.basePath = basePath;
    }

    get(path){
        return fetch(`${this.basePath}/${path}`)
            .then(it => it.json())
    }

    delete(path) {
        return fetch(`${this.basePath}/${path}`, {
            method: `delete`
        })
            .then(it => it.json())
    }

    put(path, body) {
        return  fetch(`${this.basePath}/${path}`, {
            method: 'put',
            body: JSON.stringify(body),
            headers: {
                'content-type': 'application/json'
            }
        }).then(it => it.json())
    }

    post(path, completed) {
        return  fetch(`${this.basePath}/${path}`, {
            method: 'post',
            body: JSON.stringify(completed),
            headers: {
                'content-type': 'application/json'
            }
        }).then(it => it.json())
    }
}

const backendRequester = new Requester('http://localhost:3001');

const FILTERS = {
    ALL: 'ALL',
    ACTIVE: 'ACTIVE',
    COMPLETED: 'COMPLETED'
};

const CONFIG = {
    PATH: {
        TODO: (searchText, filter) =>`todo?searchText=${searchText}&filter=${filter}`,
        ADD_TODO: 'todo',
        TODO_ID: id => `todo/${id}`,
        TODO_COMPLETED: 'todo/completed'
    }

};


function App() {
    const [todoList, setTodoList] = useState([]);
    const [newTodoTitle, setNewTodoTitle] = useState('');
    const [searchText, setSearchText] = useState('');
    const [filter, setFilter] = useState('All');


    const changeTodoTitle = (e) => {
        setSearchText(e.target.value);
    };


    useEffect(async () => {
        const todoListFromServer = await backendRequester.get(CONFIG.PATH.TODO(searchText, filter));
            setTodoList(todoListFromServer)
    }, [searchText, filter]);


    const deleteTodo = async (id) => {
            const todoListFromServer = await backendRequester.delete(CONFIG.PATH.TODO_ID(id));
            setTodoList(todoListFromServer)
    };

    const addNewTodo = async () => {
        setNewTodoTitle('');
            const todoListFromServer = await backendRequester.put(CONFIG.PATH.ADD_TODO, {title: newTodoTitle});
            setTodoList(todoListFromServer)
    };

    const toggleCompletedTodo = async (id, completed) => {
        const todoListFromServer = await backendRequester.post(CONFIG.PATH.TODO_ID(id), {completed});
        setTodoList(todoListFromServer)
    };


    const deleteCompleted = async () => {
        const todoListFromServer = await  backendRequester.delete(CONFIG.PATH.TODO_COMPLETED);
            setTodoList(todoListFromServer)
    };


    const showAll = () => {
        setFilter(FILTERS.ALL)
    };
    const showActive = () => {
        setFilter(FILTERS.ACTIVE)
    };
    const showCompleted = () => {
        setFilter(FILTERS.COMPLETED)
    };



 return (
    <div className="App">
      <header className="App-header">
          <input type="text" value={newTodoTitle}
            onChange={e => setNewTodoTitle(e.target.value)}/>
          <button onClick={addNewTodo}>AddNewTodo</button>
          <button onClick={deleteCompleted}>DeleteCompleted</button>
          <button onClick={showAll}>showAll</button>
          <button onClick={showActive}>showActive</button>
          <button onClick={showCompleted}>showcompleted</button>
          <input type="text"
                 value={searchText}
                 onChange={changeTodoTitle}
          />
          <TodoList  items={todoList || []} removeItem={deleteTodo} toggleCompletedTodo={toggleCompletedTodo}
          />
          <div>
              active todos: {todoList.filter(todo => !todo.completed).length}
          </div>
      </header>
    </div>
  );
}

export default App;
