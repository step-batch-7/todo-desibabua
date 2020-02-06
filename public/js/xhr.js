const createContainer = function() {
  const item = document.createElement('div');
  item.className = 'container';
  return item;
};

const createCheckBox = function(status) {
  const checkbox = document.createElement('input');
  checkbox.setAttribute('type', 'checkbox');
  checkbox.onclick = toggleStatus;
  checkbox.checked = status;
  return checkbox;
};

const createDustbin = function() {
  const img = document.createElement('img');
  img.setAttribute('src', 'images/dustbin.png');
  img.setAttribute('width', '20px');
  img.setAttribute('height', '20px');
  img.className = 'dustbin';
  img.onclick = deleteTodo;
  return img;
};

const appendItemToPage = function(content) {
  const lists = document.querySelector('#lists');
  const container = createContainer();
  container.id = content.id;
  const title = document.createElement('p');
  title.innerText = content.title;
  container.appendChild(createCheckBox(content.done));
  container.appendChild(title);
  container.appendChild(createDustbin());
  lists.appendChild(container);
};

const getInputToAppend = function(id) {
  const input = document.querySelector(id);
  const inputText = input.value;
  input.value = '';
  return JSON.stringify({ title: inputText });
};

const getHeading = function(content) {
  const div = document.createElement('div');
  div.className = 'singleHead';
  div.id = content.id;
  const headline = document.createElement('h3');
  headline.innerText = content.heading;
  div.appendChild(headline);
  div.onclick = loadTodo;
  return div;
};

const renderHeading = function() {
  const items = JSON.parse(this.response);
  items.forEach(item => {
    appendHeadingToPage(item);
  });
};

const appendHeadingToPage = function(item) {
  const heading = getHeading(item);
  const head = document.querySelector('.head');
  head.appendChild(heading);
};

const loadHeading = function() {
  renderHeading.bind(this.response);
  newReq('', 'GET', '/saveAllHeading', renderHeading);
};

const recordTodoHeading = function() {
  const appendHeading = function() {
    const item = JSON.parse(this.response);
    appendHeadingToPage(item);
  };
  const input = getInputToAppend('#inputBox');
  const form = document.querySelector('#form');
  form.style.display = 'none';
  newReq(input, 'POST', '/saveHeading', appendHeading);
};

const addTodoItem = function() {
  const appendItem = function() {
    const todoItem = JSON.parse(this.response);
    appendItemToPage(todoItem);
  };
  const heading = document.getElementsByTagName('h1')[0];
  const id = heading.id;
  const data = getInputToAppend('#input');
  newReq(JSON.stringify({ data, id }), 'POST', '/saveList', appendItem);
};

const renderTodo = function(lists) {
  lists.forEach(item => {
    appendItemToPage(item);
  });
};

const createTodoPage = function(id, title) {
  return `
    <div class="header">
      <h1 id=${id}:c >${title}</h1>
    </div>
      <div id="listContainer">
        <div id="lists"></div>
        <div class="container">
        <input type="text" id="input" />
        <div id="button" onclick="addTodoItem()">+</div>
      </div>
    </div> `;
};

const loadTodo = function() {
  const taskId = event.target.parentElement.id;
  const callBack = function() {
    const form = document.querySelector('.todoList');
    form.style.display = 'block';
    const lists = JSON.parse(this.response);
    form.innerHTML = createTodoPage(taskId, lists.heading);
    renderTodo(lists.list);
  };
  newReq(taskId, 'POST', '/loadTodo', callBack);
};

const toggleStatus = function() {
  const idOfChild = event.target.parentElement.id;
  const idOfParent = document.getElementsByTagName('h1')[0].id;
  newReq(
    JSON.stringify({ idOfChild, idOfParent }),
    'POST',
    '/toggleCheckBox',
    () => {}
  );
};

const deleteTodo = function() {
  const idOfChild = event.target.parentElement.id;
  const idOfParent = document.getElementsByTagName('h1')[0].id;
  const removeChild = function() {
    const lists = document.getElementById('lists');
    const child = document.getElementById(this.response);
    lists.removeChild(child);
  };
  newReq(
    JSON.stringify({ idOfChild, idOfParent }),
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
