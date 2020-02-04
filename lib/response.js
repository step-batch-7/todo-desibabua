const { readFileSync, writeFileSync } = require('fs');
const getMimeType = require('./mimeTypes');
const { absUrl, tempFolderUrl, isFilePresent } = require('./utils');
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
  if (!isFilePresent(tempFolderUrl(req.url))) {
    return next();
  }
  const mimeType = getMimeType(req.url);
  const content = readFileSync(tempFolderUrl(req.url));
  res.setHeader('Content-Type', mimeType);
  res.end(content);
};

const todoList = TodoList.load(
  readFileSync('./dataBase/todoHistory.json', 'utf8')
);

const saveTodoList = function(content) {
  todoList.add(content);
  writeFileSync('./dataBase/todoHistory.json', todoList.toStringify());
};

const saveList = function(req, res) {
  if (req.body) {
    saveTodoList(req.body);
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
  serveHomePage,
  saveList,
  serverDefaultPage,
  methodNotFound
};
