const electron = require('electron');
const { ipcRenderer } = electron;

let form = document.querySelector('#addTask');
form.addEventListener('submit', submitForm);

function submitForm(e) {
  e.preventDefault();
  let task = document.querySelector('#task').value;
  ipcRenderer.send('task:add', task);
}
