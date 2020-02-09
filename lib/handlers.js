const App = require('./app');

const {
  readBody,
  servePage,
  filterTodo,
  loadPreviousHeadings,
  loadPreviousTodo,
  serveHomePage,
  toggleStatus,
  deleteItem,
  saveList,
  saveHeading,
  removeHeading,
  serverDefaultPage,
  methodNotFound
} = require('./response');

const app = new App();

app.use(readBody);
app.get('', servePage);
app.get('/loadHeading', loadPreviousHeadings);
app.get('/', serveHomePage);

app.post('/loadTodo', loadPreviousTodo);
app.post('/filterTodo', filterTodo);
app.post('/toggleStatus', toggleStatus);
app.post('/deleteList', deleteItem);
app.post('/saveList', saveList);
app.post('/saveHeading', saveHeading);
app.post('/deleteHeading', removeHeading);

app.get('', serverDefaultPage);
app.use(methodNotFound);

module.exports = app;
