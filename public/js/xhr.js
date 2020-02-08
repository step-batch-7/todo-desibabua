const htmlToElements = function(html) {
  const template = document.createElement('div');
  template.innerHTML = html.trim();
  return template.firstChild;
};

const deleteHeading = function(id) {
  const removeTodo = function() {
    const id = JSON.parse(this.response).id;
    const headingInSideBar = document.getElementById(id);
    const headingInTodoList = document.getElementById(`${id}:c`);
    headingInSideBar.remove();
    if (headingInTodoList) {
      headingInTodoList.parentElement.parentElement.innerHTML = '';
    }
  };
  newReq(JSON.stringify({ id }), 'POST', '/deleteHeading', removeTodo);
};

const appendItemToPage = function({ id, title, done }) {
  const lists = document.querySelector('#lists');
  const status = done ? 'checked' : '';
  const html = `
    <div class="container" id=${id}>
      <input type="checkbox" onclick="toggleStatus()" ${status}>
      <p>${title}</p>
      <img src="images/dustbin.png" width="20px" height="20px" class="dustbin" onclick="deleteTodo(${id})">
    </div>`;
  const container = htmlToElements(html);
  lists.appendChild(container);
};

const getInputToAppend = function(id) {
  const input = document.querySelector(id);
  const inputText = input.value;
  input.value = '';
  return inputText;
};

const getHeading = function({ id, heading }) {
  let html = `
  <div class='singleHead' id=${id}>
    <h3 onclick="loadTodo(${id})">${heading}</h3>
    <img src="images/dustbin.png" width="20px" height="20px" class="dustbin" onclick="deleteHeading('${id}')">
  </div>`;
  return htmlToElements(html);
};

const renderHeading = function() {
  const items = JSON.parse(this.response);
  const head = document.querySelector('.head');
  head.innerHTML = '';
  items.forEach(item => {
    head.appendChild(getHeading(item));
  });
};

const loadHeading = function() {
  renderHeading.bind(this.response);
  newReq('', 'GET', '/loadHeading', renderHeading);
};

const recordTodoHeading = function() {
  const input = getInputToAppend('#inputBox');
  const form = document.querySelector('#form');
  form.style.display = 'none';
  newReq(JSON.stringify({ input }), 'POST', '/saveHeading', () => {});
  loadHeading();
};

const addTodoItem = function() {
  const heading = document.getElementsByTagName('h1')[0];
  const id = heading.id;
  const title = getInputToAppend('#input');
  newReq(JSON.stringify({ title, id }), 'POST', '/saveList', () => {});
  loadTodo(id.split(':')[0]);
};

const renderTodo = function(lists) {
  lists.forEach(item => {
    appendItemToPage(item);
  });
};

const createTodoPage = function(id, title) {
  return `
    <div class="todoCard">
      <div class="header">
        <h1 id=${id}:c >${title}</h1>
      </div>
      <div id="listContainer">
          <div id="lists"></div>
          <div class="taskInput">
          <input type="text" id="input" onkeydown="attachEnter('#button')" />
          <div id="button" onclick="addTodoItem()" autocomplete="off">+</div>
        </div>
      </div>
    </div>`;
};

const loadTodo = function(taskId) {
  const callBack = function() {
    const form = document.querySelector('.todoList');
    const lists = JSON.parse(this.response);
    form.innerHTML = createTodoPage(taskId, lists.heading);
    renderTodo(lists.list);
  };
  newReq(JSON.stringify({ taskId }), 'POST', '/loadTodo', callBack);
};

const toggleStatus = function() {
  const itemId = event.target.parentElement.id;
  const todoId = document.getElementsByTagName('h1')[0].id;
  newReq(JSON.stringify({ itemId, todoId }), 'POST', '/toggleStatus', () => {});
};

const deleteTodo = function(itemId) {
  const todoId = document.getElementsByTagName('h1')[0].id;
  const removeChild = function() {
    const lists = document.getElementById('lists');
    const child = document.getElementById(this.response);
    lists.removeChild(child);
  };
  newReq(
    JSON.stringify({ itemId, todoId }),
    'POST',
    '/deleteList',
    removeChild
  );
};

const newReq = function(data, method, url, callBack) {
  const req = new XMLHttpRequest();
  req.open(method, url);
  req.onload = callBack;
  req.send(data);
};

const showForm = function(id) {
  const form = document.querySelector(id);
  form.style.display = 'block';
};

const hideForm = function() {
  const form = document.querySelector('#form');
  form.style.display = 'none';
};
