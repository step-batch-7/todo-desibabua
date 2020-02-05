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
  img.setAttribute(
    'src',
    'https://www.flaticon.com/premium-icon/icons/svg/484/484662.svg'
  );
  img.setAttribute('width', '16px');
  img.setAttribute('height', '16px');
  img.className = 'dustbin';
  img.onclick = deleteElement;
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
  newReq(input, 'POST', '/saveHeading', appendHeading);
};

const addTodoItem = function() {
  const appendItem = function() {
    const todoItem = JSON.parse(this.response);
    appendItemToPage(todoItem);
  };
  const data = getInputToAppend('#input');
  newReq(data, 'POST', '/saveList', appendItem);
};

const renderTodo = function() {
  const items = JSON.parse(this.response);
  items.forEach(item => {
    appendItemToPage(item);
  });
};

const loadTodo = function() {
  renderTodo.bind(this);
  newReq('', 'GET', '/loadTodo', renderTodo);
};

const toggleStatus = function() {
  const id = event.target.parentElement.id;
  newReq(id, 'POST', '/toggleCheckBox', () => {});
};

const deleteElement = function() {
  const id = event.target.parentElement.id;
  const removeChild = function() {
    const lists = document.getElementById('lists');
    const child = document.getElementById(this.response);
    lists.removeChild(child);
  };
  newReq(id, 'POST', '/deleteList', removeChild);
};

const newReq = function(data, method, url, callBack) {
  const req = new XMLHttpRequest();
  req.open(method, url);
  req.onload = callBack;
  req.send(data);
};

const showForm = function() {
  const form = document.querySelector('#form');
  form.style.display = 'block';
};

const hideForm = function() {
  const form = document.querySelector('#form');
  form.style.display = 'none';
};
