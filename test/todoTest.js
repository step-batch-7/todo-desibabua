const request = require('supertest');
const { TODO_STORE, SAMPLE_TODO } = require('../config');
const fs = require('fs');

const createSampleTODO = function() {
  const sampleContent = fs.readFileSync(SAMPLE_TODO, 'utf8');
  fs.writeFileSync(TODO_STORE, sampleContent);
};
createSampleTODO();

const app = require('../lib/handlers');

after(() => {
  fs.truncateSync(TODO_STORE);
});

describe('PUT', function() {
  it('should respond with 404 when method is not allowed', function(done) {
    request(app.serve.bind(app))
      .put('/badFile')
      .set('Accept', '*/*')
      .expect(404, done);
  });
});

describe('GET', function() {
  it('should respond with 404 when file is not present', function(done) {
    request(app.serve.bind(app))
      .get('/badFile')
      .set('Accept', '*/*')
      .expect(404, done);
  });

  it('should respond with index.html when / is requested', function(done) {
    request(app.serve.bind(app))
      .get('/')
      .set('Accept', '*/*')
      .expect(/<title>myTodo<\/title>/)
      .expect('content-length', '794')
      .expect('content-type', /html/)
      .expect(200, done);
  });

  it('should respond with style.css when css/style.css is requested', function(done) {
    request(app.serve.bind(app))
      .get('/css/style.css')
      .set('Accept', '*/*')
      .expect('content-length', '2037')
      .expect('content-type', /css/)
      .expect(200, done);
  });

  it('should respond with dustbin.png when image/dustbin.png is requested', function(done) {
    request(app.serve.bind(app))
      .get('/images/dustbin.png')
      .set('Accept', '*/*')
      .expect('content-type', /image/)
      .expect(200, done);
  });

  it('should respond with xhr.js when js/xhr.js is requested', function(done) {
    request(app.serve.bind(app))
      .get('/js/xhr.js')
      .set('Accept', '*/*')
      .expect('content-length', '4949')
      .expect('content-type', /javascript/)
      .expect(200, done);
  });
});

describe('GET by xhr request', function() {
  it('should load Previous todo when requested with /loadHeading', function(done) {
    request(app.serve.bind(app))
      .get('/loadHeading')
      .set('Accept', '*/*')
      .expect('content-length', '787')
      .expect('content-type', /json/)
      .expect(200, done);
  });
});

describe('POST by xhr request', function() {
  it('should load Previous todoItems when requested with /loadTodo', function(done) {
    request(app.serve.bind(app))
      .post('/loadTodo')
      .set('Accept', '*/*')
      .send('{"taskId":"1581074678976"}')
      .expect('content-length', '307')
      .expect('content-type', /json/)
      .expect(200, done);
  });

  it('should toggle the status of todoItem from false to true', function(done) {
    request(app.serve.bind(app))
      .post('/toggleStatus')
      .set('Accept', '*/*')
      .send('{"itemId":"1581074691762","todoId":"1581074678976"}')
      .expect('content-length', '0')
      .expect(201, done);
  });

  it('should toggle the status of todoItem from true to false', function(done) {
    request(app.serve.bind(app))
      .post('/toggleStatus')
      .set('Accept', '*/*')
      .send('{"itemId":"1581074697060","todoId":"1581074678976"}')
      .expect('content-length', '0')
      .expect(201, done);
  });

  it('should delete todoItem of todo', function(done) {
    request(app.serve.bind(app))
      .post('/deleteList')
      .set('Accept', '*/*')
      .send('{"itemId":"1581074691762","todoId":"1581074678976"}')
      .expect('content-length', '13')
      .expect(201, done);
  });

  it('should add todoItem of todo', function(done) {
    request(app.serve.bind(app))
      .post('/saveList')
      .set('Accept', '*/*')
      .send('{"title":"hello", "id":"1581074678976:c" }')
      .expect('content-length', '51')
      .expect(201, done);
  });

  it('should add todo List in app', function(done) {
    request(app.serve.bind(app))
      .post('/saveHeading')
      .set('Accept', '*/*')
      .send('{"input":"my name is khan"}')
      .expect('content-length', '80')
      .expect(201, done);
  });

  it('should remove todo List in app', function(done) {
    request(app.serve.bind(app))
      .post('/deleteHeading')
      .set('Accept', '*/*')
      .send('{"id":"1581074678976"}')
      .expect('content-length', '22')
      .expect(201, done);
  });
});
