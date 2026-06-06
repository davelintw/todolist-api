const { v4: uuidv4 } = require('uuid');
const todos = [];

function getTodos() {
    return todos;
}

function createTodo(title) {
    const newTodo = {
        id: uuidv4(),
        title: title,
    };
    todos.push(newTodo);
    return newTodo;
}

function deleteAllTodos() {
    todos.length = 0;
    return todos;
}

function deleteTodoById(id) {
    const index = todos.findIndex(todo => todo.id === id);
    if (index === -1) return null;
    todos.splice(index, 1);
    return todos;
}

function updateTodo(id, title) {
    const index = todos.findIndex(todo => todo.id === id);
    if (index === -1) return null;
    todos[index].title = title;
    return todos[index];
}

module.exports = { getTodos, createTodo, deleteAllTodos, deleteTodoById, updateTodo };