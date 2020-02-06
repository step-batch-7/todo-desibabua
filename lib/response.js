const { readFileSync, writeFileSync } = require('fs');
const getMimeType = require('./mimeTypes');
const { absUrl, isFilePresent } = require('./utils');
const { TodoList, Headings } = require('./todo');

const servePage = function(req, res, next) {
  if (!isFilePresent(absUrl(req.url))) {
    return next();
  }
  const mimeType = getMimeType(req.url);
  const content = readFileSync(absUrl(req.url));
  res.setHeader('Content-Type', mimeType);
  res.end(content);
};

const serveHomePage = function(req, res, next) {
  req.url = '/index.html';
  if (!isFilePresent(absUrl(req.url))) {
    return next();
  }
  const mimeType = getMimeType(req.url);
  const content = readFileSync(absUrl(req.url));
  res.setHeader('Content-Type', mimeType);
  res.end(content);
};

const todoList = TodoList.load(
  readFileSync('./dataBase/todoHistory.json', 'utf8')
);

const saveTodoList = function() {
  writeFileSync('./dataBase/todoHistory.json', todoList.toStringify());
};

const saveInFile = function() {
  writeFileSync('./dataBase/todoHistory.json', headings.toStringify());
};

const headings = Headings.load(
  readFileSync('./dataBase/todoHistory.json', 'utf8')
);

const saveList = function(req, res) {
  const { id, data } = req.body;
  headings.addNewTodo(id, data);
  saveInFile();
  res.statusCode = 201;
  res.end(JSON.stringify(headings.currentlyAddedTodo(id)));
};

const saveHeading = function(req, res) {
  headings.save(req.body);
  saveInFile();
  res.end(JSON.stringify(headings.currentlyAdded));
};

const loadPreviousHeadings = function(req, res) {
  res.end(headings.toStringify());
};

const loadPreviousTodo = function(req, res) {
  res.end(headings.todo(`${req.body}`).toStringify());
};

const readBody = function(req, res, next) {
  let content = '';
  req.on('data', chunk => {
    content += chunk;
  });
  req.on('end', () => {
    if (content) {
      req.body = JSON.parse(content);
    }
    next();
  });
};

const toggleStatus = function(req, res) {
  todoList.toggleStatusOf(`${req.body}`);
  saveTodoList();
  res.end(todoList.toStringify());
};

const deleteItem = function(req, res) {
  todoList.delete(`${req.body}`);
  saveTodoList();
  res.end(`${req.body}`);
};

const serverDefaultPage = function(req, res) {
  res.writeHead(404, 'file Not found');
  res.end();
};

const methodNotFound = function(req, res) {
  res.writeHead(404, 'method is not legal');
  res.end();
};

module.exports = {
  readBody,
  servePage,
  loadPreviousHeadings,
  loadPreviousTodo,
  toggleStatus,
  deleteItem,
  serveHomePage,
  saveList,
  saveHeading,
  serverDefaultPage,
  methodNotFound
};
