const { readFileSync } = require('fs');
const getMimeType = require('./mimeTypes');
const queryString = require('querystring');
const { absUrl, isFilePresent, DataStore } = require('./dataStore');
const { TODO_STORE } = require('../config');

const servePage = function(req, res, next) {
  if (!isFilePresent(absUrl(req.url))) {
    return next();
  }
  const mimeType = getMimeType(req.url);
  const content = readFileSync(absUrl(req.url));
  res.setHeader('Content-Type', mimeType);
  res.end(content);
};

const serveTodoPage = function(req, res, next) {
  if (!isFilePresent(absUrl(req.url))) {
    return next();
  }
  const mimeType = getMimeType(req.url);
  const content = readFileSync(absUrl(req.url));
  res.setHeader('Content-Type', mimeType);
  res.end(content);
};

const serveHomePage = function(req, res, next) {
  if (req.url === '/') {
    req.url = '/index.html';
  }
  if (!isFilePresent(absUrl(req.url))) {
    return next();
  }
  const mimeType = getMimeType(req.url);
  const content = readFileSync(absUrl(req.url));
  res.setHeader('Content-Type', mimeType);
  res.end(content);
};

const dataStore = DataStore.initialize(TODO_STORE);

const saveList = function(req, res) {
  const { id, title } = req.body;
  dataStore.addNewTodo(id, title);
  res.statusCode = 201;
  res.end();
};

const saveHeading = function(req, res) {
  dataStore.saveHeading(req.body.input);
  res.statusCode = 201;
  res.end();
};

const removeHeading = function(req, res) {
  dataStore.removeTodo(req.body.id);
  res.statusCode = 201;
  res.end(JSON.stringify(req.body));
};

const loadPreviousHeadings = function(req, res) {
  res.setHeader('content-type', 'application/json');
  res.end(dataStore.toStringify());
};

const loadPreviousTodo = function(req, res) {
  res.setHeader('content-type', 'application/json');
  res.end(dataStore.getTodoById(req.body.taskId));
};

const filterTodo = function(req, res) {
  res.setHeader('content-type', 'application/json');
  res.end(dataStore.filterTodoBy(req.body.searchValue));
};

const editHeading = function(req, res) {
  dataStore.editTodoHeading(req.body);
  res.end();
};

const parseBody = function(content, type) {
  if (type === 'application/x-www-form-urlencoded') {
    return queryString.parse(content);
  }
  return JSON.parse(content);
};

const readBody = function(req, res, next) {
  let content = '';
  req.on('data', chunk => {
    content += chunk;
  });
  req.on('end', () => {
    const type = req.headers['content-type'];
    if (content) {
      req.body = parseBody(content, type);
    }
    next();
  });
};

const toggleStatus = function(req, res) {
  dataStore.toggleTodoItemStatus(req.body);
  res.statusCode = 201;
  res.end();
};

const deleteItem = function(req, res) {
  dataStore.deleteTodo(req.body);
  res.statusCode = 201;
  res.end(`${req.body.itemId}`);
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
  serveTodoPage,
  servePage,
  editHeading,
  loadPreviousHeadings,
  loadPreviousTodo,
  toggleStatus,
  deleteItem,
  filterTodo,
  serveHomePage,
  saveList,
  saveHeading,
  removeHeading,
  serverDefaultPage,
  methodNotFound
};
