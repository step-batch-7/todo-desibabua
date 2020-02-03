const { readFileSync, writeFileSync } = require('fs');
const querystring = require('querystring');
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
  let content = readFileSync(tempFolderUrl(req.url), 'utf8');
  content = content.replace('__TodoLists__', todoList.toHTML());
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

const saveList = function(req, res, next) {
  saveTodoList(req.body);
  res.statusCode = 303;
  res.setHeader('location', '/');
  res.end();
};

const readBody = function(req, res, next) {
  let comment = '';
  req.on('data', chunk => {
    comment += chunk;
  });
  req.on('end', () => {
    req.body = comment;
    if (req.headers['content-type'] === 'application/x-www-form-urlencoded') {
      req.body = querystring.parse(req.body);
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
  serveHomePage,
  saveList,
  serverDefaultPage,
  methodNotFound
};
