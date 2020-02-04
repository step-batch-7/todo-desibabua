class TodoList {
  constructor() {
    this.list = [];
    this.currentlyAdded = {};
  }

  static load(content) {
    const titlesList = JSON.parse(content || '[]');
    const todoList = new TodoList();
    titlesList.forEach(list => {
      todoList.list.push(list);
    });
    return todoList;
  }

  toStringify() {
    return JSON.stringify(this.list, null, 2);
  }

  add(content) {
    const newItem = { title: content.title, items: [] };
    this.list.push(newItem);
    this.currentlyAdded = newItem;
  }
}

module.exports = { TodoList };
