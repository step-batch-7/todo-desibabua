const htmlToElements = function(html) {
  const template = document.createElement('template');
  template.innerHTML = html;
  return template.content.firstChild;
};

const createCheckBox = function(status) {
  let checkbox = '<input type="checkbox" onclick="toggleStatus">';
  checkbox = htmlToElements(checkbox);
  checkbox.checked = status;
  return checkbox;
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

const createDustbin = function(deleteFunction) {
  const html =
    '<img src="images/dustbin.png" width="20px" height="20px" class="dustbin">';
  const img = htmlToElements(html);
  img.onclick = deleteFunction;
  return img;
};

const appendItemToPage = function(content) {
  const lists = document.querySelector('#lists');
  const container = htmlToElements(
    `<div class="container" id=${content.id}></div>`
  );
  const title = document.createElement('p');
  title.innerText = content.title;
  container.appendChild(createCheckBox(content.done));
  container.appendChild(title);
  container.appendChild(createDustbin(deleteTodo.bind(null, content.id)));
  lists.appendChild(container);
};

const getInputToAppend = function(id) {
  const input = document.querySelector(id);
  const inputText = input.value;
  input.value = '';
  return inputText;
};

const getHeading = function({ id, heading }) {
  let headline = `<div class='singleHead' id=${id}><h3 onclick="loadTodo(${id})">${heading}</h3></div>`;
  headline = htmlToElements(headline);
  headline.appendChild(createDustbin(deleteHeading.bind(null, id)));
  return headline;
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
  newReq('', 'GET', '/loadHeading', renderHeading);
};

const recordTodoHeading = function() {
  const appendHeading = function() {
    const item = JSON.parse(this.response);
    appendHeadingToPage(item);
  };
  const input = getInputToAppend('#inputBox');
  const form = document.querySelector('#form');
  form.style.display = 'none';
  newReq(JSON.stringify({ input }), 'POST', '/saveHeading', appendHeading);
};

const addTodoItem = function() {
  const appendItem = function() {
    const todoItem = JSON.parse(this.response);
    appendItemToPage(todoItem);
  };
  const heading = document.getElementsByTagName('h1')[0];
  const id = heading.id;
  const title = getInputToAppend('#input');
  newReq(JSON.stringify({ title, id }), 'POST', '/saveList', appendItem);
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
        <div class="taskInput">
        <input type="text" id="input" />
        <div id="button" onclick="addTodoItem()" autocomplete="off">+</div>
      </div>
    </div>`;
};

const loadTodo = function(taskId) {
  const callBack = function() {
    const form = document.querySelector('.todoList');
    form.style.display = 'block';
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
