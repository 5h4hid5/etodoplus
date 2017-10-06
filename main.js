const electron = require('electron');
const path = require('path');
const url = require('url');
const uuid = require('uuid');
const {app, BrowserWindow, Menu, ipcMain} = electron;


let mainWindow, addTaskWindow,aboutWindow;
let todos = [];

function createWindow() {
  mainWindow = new BrowserWindow({});

  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true
  }));

  let menu = Menu.buildFromTemplate(menuTemplate);
  mainWindow.setMenu(menu);

  mainWindow.on('close', () => {
    app.quit();
  });
}

function createAboutWindow() {
  aboutWindow = new BrowserWindow({
    parent: mainWindow,
    modal: true,
    show: false,
    width: 300,
    height: 200
  });

  aboutWindow.loadURL(url.format({
    pathname: path.join(__dirname, './src/about.html'),
    protocol: 'file:',
    slashes: true
  }));

  aboutWindow.setMenu(null);

  aboutWindow.once('ready-to-show', () => {
    aboutWindow.show();
  });

  aboutWindow.on('closed', () => {
    aboutWindow = null;
  });
}

function createAddTaskWindow() {
  addTaskWindow = new BrowserWindow({
    parent: mainWindow,
    modal: true,
    show: false,
    width: 400,
    height: 125,
    center: true
  });

  addTaskWindow.loadURL(url.format({
    pathname: path.join(__dirname, './src/addTask.html'),
    protocol: 'file:',
    slashes: true
  }));

  addTaskWindow.setMenu(null);

  addTaskWindow.once('ready-to-show', () => {
    addTaskWindow.show();
  });

  addTaskWindow.on('closed', () => {
    addTaskWindow = null;
  });
}

ipcMain.on('task:add', (e, task) => {
  let newTask = {
    id: uuid.v4(),
    task: task,
    completed: false
  };
  mainWindow.webContents.send('todos:add', newTask);
  addTaskWindow.close();
});

app.on('ready', () => {
  createWindow();
});

const menuTemplate = [
  {
    label: 'Menu',
    submenu: [
      {
        label: 'Add Task',
        accelerator: 'Insert',
        click(){
          createAddTaskWindow();
        }
      },
      {
        label: 'Delete List',
        accelerator: 'Delete',
        click(){
          todos = [];
          mainWindow.webContents.send('todos:clear');
        }
      },
      {
        label: 'Exit',
        accelerator: 'CommandOrControl+Q',
        click(){
          app.quit();
        }
      }
    ]
  },
  {
    label: 'Help',
    submenu: [
      {
        label: 'About',
        click(){
          createAboutWindow();
        }
      },
      {
        label: 'Toggle DevTools',
        accelerator:'CommandOrControl+I',
        click(item, focusedWindow){
          focusedWindow.toggleDevTools();
        }
      }
    ]
  }
];
