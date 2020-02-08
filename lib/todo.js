class Item {
  constructor(title, id, done = false) {
    this.id = id;
    this.title = title;
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
    this.id = '';
    this.heading = '';
    this.list = [];
  }

  static load(heading, id, list = []) {
    const todoList = new TodoList();
    todoList.id = id;
    todoList.heading = heading;
    list.forEach(list => {
      todoList.list.push(new Item(list.title, list.id, list.done));
    });
    return todoList;
  }

  toStringify() {
    return JSON.stringify({ list: this.list, heading: this.heading }, null, 2);
  }

  add(title) {
    const newItem = new Item(title, `${new Date().getTime()}`);
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

class Headings {
  constructor() {
    this.todoList = [];
  }

  static load(content) {
    const previousHeadingList = JSON.parse(content || '[]');
    const headings = new Headings();
    previousHeadingList.forEach(list => {
      headings.todoList.push(
        TodoList.load(list.heading, list.id, list.list)
      );
    });
    return headings;
  }

  toStringify() {
    return JSON.stringify(this.todoList, null, 2);
  }

  save(title) {
    const newList = TodoList.load(title, `${new Date().getTime()}`);
    this.todoList.push(newList);
    this.currentlyAdded = newList;
  }

  todo(id) {
    return this.todoList.find(item => item.id === id.split(':')[0]);
  }

  addNewTodo(id, content) {
    this.todo(id).add(content);
  }

  delete(id) {
    const indexToRemove = this.todoList.indexOf(this.todo(id));
    this.todoList.splice(indexToRemove, 1);
  }

  deleteTodo({ itemId, todoId }) {
    return this.todo(todoId).delete(itemId);
  }

  toggleItemStatus({ itemId, todoId }) {
    this.todo(todoId).toggleStatusOf(itemId);
  }
}

module.exports = { Headings, TodoList };
