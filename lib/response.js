const { readFileSync, writeFileSync } = require('fs');
const getMimeType = require('./mimeTypes');
const { absUrl, isFilePresent } = require('./utils');
const { TodoList } = require('./todo');

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

const saveList = function(req, res) {
  if (req.body) {
    todoList.add(req.body);
    saveTodoList();
  }
  res.statusCode = 201;
  res.end(JSON.stringify(todoList.currentlyAdded));
};

const loadPreviousTodo = function(req, res) {
  res.end(todoList.toStringify());
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
  todoList.toggleStatusOf(req.body);
  saveTodoList();
  res.end(todoList.toStringify());
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
  loadPreviousTodo,
  toggleStatus,
  serveHomePage,
  saveList,
  serverDefaultPage,
  methodNotFound
};
