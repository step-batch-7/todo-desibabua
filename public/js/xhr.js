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

const getInputToAppend = function(inputHtml) {
  const inputText = inputHtml.value;
  inputHtml.value = '';
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
  const inputHtml = document.querySelector('#inputBox');
  const input = getInputToAppend(inputHtml);
  const form = document.querySelector('#form');
  form.style.display = 'none';
  newReq(JSON.stringify({ input }), 'POST', '/saveHeading', () => {});
  loadHeading();
};

const addTodoItem = function(id) {
  const inputHtml = event.target.previousElementSibling;
  const title = getInputToAppend(inputHtml);
  newReq(JSON.stringify({ title, id }), 'POST', '/saveList', () => {});
  loadTodo(id);
};

const getTodoItem = function({ id, title, done }) {
  const status = done ? 'checked' : '';
  return `
    <div class="container" id=${id}>
      <input type="checkbox" onclick="toggleStatus()" ${status}>
      <p>${title}</p>
      <img src="images/dustbin.png" width="20px" height="20px" class="dustbin" onclick="deleteTodo('${id}')">
    </div>`;
};

const renderTodo = function(lists) {
  return lists.map(item => getTodoItem(item)).join('');
};

const createTodoPage = function(id, title, list) {
  return `
    <div class="todoCard">
      <div class="header">
        <h1 >${title}</h1>
      </div>
      <div class="listContainer">
        <div class="lists" id=${id}:c >
        ${renderTodo(list)}
        </div>
        <div class="taskInput">
          <input type="text" class="input" onkeydown="attachEnter('.button')" />
          <div class="button" onclick="addTodoItem('${id}')" autocomplete="off">+</div>
        </div>
      </div>
    </div>`;
};

const loadTodo = function(taskId) {
  const callBack = function() {
    const form = document.querySelector('.todoList');
    const { id, heading, list } = JSON.parse(this.response);
    form.innerHTML = createTodoPage(id, heading, list);
  };
  newReq(JSON.stringify({ taskId }), 'POST', '/loadTodo', callBack);
};

const toggleStatus = function() {
  const itemId = event.target.parentElement.id;
  const todoId = document.getElementById(itemId).parentElement.id;
  newReq(JSON.stringify({ itemId, todoId }), 'POST', '/toggleStatus', () => {});
};

const deleteTodo = function(itemId) {
  const todoId = document.getElementById(itemId).parentElement.id;
  const removeChild = function() {
    const lists = document.querySelector('.lists');
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
