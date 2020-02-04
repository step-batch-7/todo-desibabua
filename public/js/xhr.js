const createContainer = function() {
  const item = document.createElement('div');
  item.className = 'container';
  return item;
};

const createCheckBox = function() {
  const checkbox = document.createElement('input');
  checkbox.setAttribute('type', 'checkbox');
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
  // const item = document.createElement('div');
  // item.className = 'container';
  // const checkbox = document.createElement('input');
  // checkbox.setAttribute('type', 'checkbox');
  const container = createContainer();
  const title = document.createElement('p');
  title.innerText = content.title;
  container.appendChild(createCheckBox());
  container.appendChild(title);
  container.appendChild(createDustbin());
  lists.appendChild(container);
};

// eslint-disable-next-line no-lone-blocks
{
  /* <img
  src="https://www.flaticon.com/premium-icon/icons/svg/484/484662.svg"
  alt=""
  width="16px"
  height="16px"
/>; */
}

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
