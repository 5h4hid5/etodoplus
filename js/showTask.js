const electron = require('electron');
const database = require('./js/database');
const {ipcRenderer} = electron;

window.onload = function () {

  let ul = document.querySelector('#todoList');

  generateTodoList();
  ipcRenderer.on('todos:add', (e, newTask) => {
    if(newTask){
      database.addTask(newTask);
    }
    generateTodoList();
  });

  ipcRenderer.on('todos:clear', () => {
    database.clearTaskList();
    generateTodoList();
  });

  ul.addEventListener('dblclick', (e) => {
    let id = e.target.getAttribute('data-id');
    database.deleteTask(id);
    generateTodoList();
  });

};

function generateTodoList() {
  database.getTodos(createTaskList);
}

function createTaskList (todos) {
  let ul = document.querySelector('#todoList');
  ul.innerHTML = '';
  todos.forEach((todo) => {
    let li = document.createElement('li');
    let itemText = document.createTextNode(todo.task);
    li.appendChild(itemText);
    li.setAttribute('data-id', todo.id);
    ul.appendChild(li);
  });
}
