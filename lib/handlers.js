const App = require('./app');

const {
  readBody,
  servePage,
  serveHomePage,
  serverDefaultPage,
  methodNotFound
} = require('./response');

const app = new App();

app.use(readBody);
app.get('', servePage);
app.get('/', serveHomePage);

app.get('', serverDefaultPage);
app.use(methodNotFound);

module.exports = app;
