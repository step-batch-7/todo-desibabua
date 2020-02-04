class Item {
  constructor(title, id, item = [], done = false) {
    this.id = id;
    this.title = title;
    this.item = item;
    this.done = done;
  }
  toggle() {
    if (this.done) {
      this.done = false;
      return;
    }
    this.done = true;
  }
}

class TodoList {
  constructor() {
    this.list = [];
    this.currentlyAdded = {};
  }

  static load(content) {
    const titlesList = JSON.parse(content || '[]');
    const todoList = new TodoList();
    titlesList.forEach(list => {
      todoList.list.push(new Item(list.title, list.id, list.item, list.done));
    });
    return todoList;
  }

  toStringify() {
    return JSON.stringify(this.list, null, 2);
  }

  add(content) {
    const newItem = new Item(content.title, `${new Date().getTime()}`);
    this.list.push(newItem);
    this.currentlyAdded = newItem;
  }

  toggleStatusOf(id) {
    const list = this.list.find(item => item.id === id);
    list.toggle();
  }

  delete(id) {
    const list = this.list.find(item => item.id === id);
    const indexToRemove = this.list.indexOf(list);
    this.list.splice(indexToRemove, 1);
  }
}

module.exports = { TodoList };
