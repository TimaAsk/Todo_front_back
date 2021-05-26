const express = require('express');
const cors = require('cors');

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());



let idCounter = 1;

const FILTERS = {
    ALL: 'ALL',
    ACTIVE: 'ACTIVE',
    COMPLETED: 'COMPLETED'
};

class Todo {
    constructor(title, completed = false,  id = idCounter++ ){
        this.title = title;
        this.completed = completed;
        this.id = id;
    }

}

class TodoManager {
    constructor() {
        this.todos = [];
    }

        addTodo(title) {
            this.todos.push(new Todo(title))
    }

        deleteTodo(todoIdToDelete) {
            this.todos  =  this.todos.filter(it => it.id !== todoIdToDelete);
    }

        deleteByCompleted() {
            this.todos  = this.todos.filter(it => !it.completed);
    }
        findById(todoId) {
            return this.todos.find(it => it.id === todoId);
    }

}

const todoManger = new TodoManager();

app.get('/todo', (req, res) => {
    const findText = req.query.searchText;
    const filterTodos = req.query.filter;
    console.log(findText);
    console.log(filterTodos);
    const filtred  = findText ? todoManger.todos.filter(item => {
             return item.title.includes(findText);
         }) : todoManger.todos;

        if(filterTodos === FILTERS.ALL) {
            return filtred;
        } else if(filterTodos === FILTERS.ACTIVE) {
            return filtred.filter(item => {
                return !item.completed
            })
        } else if (filterTodos === FILTERS.COMPLETED){
            return filtred.filter(item => {
                return item.completed
            })
        }
    res.send(filtred);
});


app.delete('/todo/:id', (req, res, next) => {
    const todoIdToDelete = Number(req.params.id);
    if (isNaN(todoIdToDelete)) {
        next();
        return
    }
    todoManger.deleteTodo(todoIdToDelete);        //   todoList  = todoList.filter(it => it.id !== todoIdToDelete);
    res.send(todoManger.todos)
});


app.put('/todo/', ((req, res) => {
    const newTodoTitle = req.body.title ;
    if(newTodoTitle && !todoManger.todos.find(it => it.title === newTodoTitle)) {
        todoManger.addTodo(newTodoTitle)
    }
    res.send(todoManger.todos)
}));


app.delete('/todo/completed', (req, res) => {
    todoManger.deleteByCompleted();
    res.send(todoManger.todos)
});


app.post('/todo/:id', ((req, res) => {
    const todoId = Number(req.params.id);
    const todo = todoManger.findById(todoId);
    if (todo) {
        const todoFields = req.body;
        todo.title = todoFields.title || todo.title;
        todo.completed = todoFields.completed === undefined ? todo.completed : todoFields.completed;
    }
    res.send(todoManger.todos)
}));



app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
});