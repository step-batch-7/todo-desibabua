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

const getInputToAppend = function() {
  const input = document.querySelector('#input');
  const inputText = input.value;
  input.value = '';
  return JSON.stringify({ title: inputText });
};

const addTodoItem = function() {
  const appendItem = function() {
    const todoItem = JSON.parse(this.response);
    appendItemToPage(todoItem);
  };
  const data = getInputToAppend();
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

const newReq = function(data, method, url, callBack) {
  const req = new XMLHttpRequest();
  req.open(method, url);
  req.onload = callBack;
  req.send(data);
};
