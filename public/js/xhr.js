const appendItemToPage = function(content) {
  const lists = document.querySelector('#lists');
  const item = document.createElement('div');
  item.className = 'container';
  const checkbox = document.createElement('input');
  checkbox.setAttribute('type', 'checkbox');
  const title = document.createElement('p');
  title.innerText = content.title;
  item.appendChild(checkbox);
  item.appendChild(title);
  lists.appendChild(item);
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

const loadTodo = function() {
  const appendItems = function() {
    const items = JSON.parse(this.response);
    items.forEach(item => {
      appendItemToPage(item);
    });
  };
  newReq('', 'GET', '/loadTodo', appendItems);
};

const newReq = function(data, method, url, callBack) {
  const req = new XMLHttpRequest();
  req.open(method, url);
  req.onload = callBack;
  req.send(data);
};
