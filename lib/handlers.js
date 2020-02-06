const App = require('./app');

const {
  readBody,
  servePage,
  loadPreviousHeadings,
  loadPreviousTodo,
  serveHomePage,
  toggleStatus,
  deleteItem,
  saveList,
  saveHeading,
  serverDefaultPage,
  methodNotFound
} = require('./response');

const app = new App();

app.use(readBody);
app.get('', servePage);
app.get('/saveAllHeading', loadPreviousHeadings);
app.get('/', serveHomePage);

app.post('/loadTodo', loadPreviousTodo);
app.post('/toggleCheckBox', toggleStatus);
app.post('/deleteList', deleteItem);
app.post('/saveList', saveList);
app.post('/saveHeading', saveHeading);

app.get('', serverDefaultPage);
app.use(methodNotFound);

module.exports = app;
