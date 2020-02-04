const App = require('./app');

const {
  readBody,
  servePage,
  loadPreviousTodo,
  serveHomePage,
  saveList,
  serverDefaultPage,
  methodNotFound
} = require('./response');

const app = new App();

app.use(readBody);
app.get('', servePage);
app.get('/loadTodo', loadPreviousTodo);
app.get('/', serveHomePage);

app.post('/saveList', saveList);

app.get('', serverDefaultPage);
app.use(methodNotFound);

module.exports = app;
