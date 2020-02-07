const request = require('supertest');
const { TODO_STORE, SAMPLE_TODO } = require('../config');
const fs = require('fs');

const createSampleTODO = function() {
  const sampleContent = fs.readFileSync(SAMPLE_TODO, 'utf8');
  fs.writeFileSync(TODO_STORE, sampleContent);
};
createSampleTODO();

const app = require('../lib/handlers');

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
      .expect('content-length', '4954')
      .expect('content-type', /javascript/)
      .expect(200, done);
  });
});

describe('GET by xhr request', function() {
  it('should load Previous todo when requested with /loadHeading', function(done) {
    request(app.serve.bind(app))
      .get('/loadHeading')
      .set('Accept', '*/*')
      .expect('content-length', '788')
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
      .expect('content-length', '308')
      .expect('content-type', /json/)
      .expect(200, done);
  });
});
