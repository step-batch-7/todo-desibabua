class Item {
  constructor(title, id, item = []) {
    this.id = id;
    this.title = title;
    this.item = item;
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
      todoList.list.push(new Item(list.title, list.id, list.item));
    });
    return todoList;
  }

  toStringify() {
    return JSON.stringify(this.list, null, 2);
  }

  add(content) {
    const newItem = new Item(content.title, new Date().getTime());
    this.list.push(newItem);
    this.currentlyAdded = newItem;
  }
}

module.exports = { TodoList };
