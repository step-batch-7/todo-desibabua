class TodoList {
  constructor() {
    this.list = [];
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
    this.list.push({ title: content.TodoList, items: [] });
  }
}

module.exports = { TodoList };