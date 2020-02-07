const { readFileSync, writeFileSync } = require('fs');
const getMimeType = require('./mimeTypes');
const { absUrl, isFilePresent } = require('./utils');
const { Headings } = require('./todo');
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

const saveInFile = function() {
  writeFileSync(TODO_STORE, headings.toStringify());
};

const headings = Headings.load(
  readFileSync(TODO_STORE, 'utf8')
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

const removeHeading = function(req, res) {
  headings.delete(req.body.id);
  saveInFile();
  res.end(JSON.stringify(req.body));
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
  headings.toggleItemStatus(req.body);
  saveInFile();
  res.end();
};

const deleteItem = function(req, res) {
  headings.deleteTodo(req.body);
  saveInFile();
  res.end(`${req.body.idOfChild}`);
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
  removeHeading,
  serverDefaultPage,
  methodNotFound
};
