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

const sendRequest = function() {
  const req = new XMLHttpRequest();
  req.open('POST', '/saveList');
  req.setRequestHeader('Content-Type', 'application/json');
  req.onload = function() {
    if (req.status === 201) {
      JSON.parse(req.response).forEach(item => {
        appendItemToPage(item);
      });
    }
  };
  const input = document.querySelector('#input');
  const inputText = input.value;
  input.value = '';
  req.send(JSON.stringify({ title: inputText }));
};
