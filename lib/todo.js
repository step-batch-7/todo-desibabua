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
    this.currentlyAdded = {};
  }

  static load(heading, id, list = [], currentlyAdded = {}) {
    const todoList = new TodoList();
    todoList.id = id;
    todoList.heading = heading;
    todoList.currentlyAdded = currentlyAdded;
    list.forEach(list => {
      todoList.list.push(new Item(list.title, list.id, list.done));
    });
    return todoList;
  }

  toStringify() {
    return JSON.stringify({ list: this.list, heading: this.heading }, null, 2);
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

class Headings {
  constructor() {
    this.todoList = [];
    this.currentlyAdded = {};
  }

  static load(content) {
    const previousHeadingList = JSON.parse(content || '[]');
    const headings = new Headings();
    previousHeadingList.forEach(list => {
      headings.todoList.push(
        TodoList.load(list.heading, list.id, list.list, list.currentlyAdded)
      );
    });
    return headings;
  }

  toStringify() {
    return JSON.stringify(this.todoList, null, 2);
  }

  save(heading) {
    const newList = TodoList.load(heading.title, `${new Date().getTime()}`);
    this.todoList.push(newList);
    this.currentlyAdded = newList;
  }

  todo(id) {
    return this.todoList.find(item => item.id === id.split(':')[0]);
  }

  addNewTodo(id, content) {
    this.todo(id).add(JSON.parse(content));
  }

  currentlyAddedTodo(id) {
    return this.todo(id).currentlyAdded;
  }

  deleteTodo({ idOfChild, idOfParent }) {
    return this.todo(idOfParent).delete(idOfChild);
  }

  toggleItemStatus({ idOfChild, idOfParent }) {
    this.todo(idOfParent).toggleStatusOf(idOfChild);
  }
}

module.exports = { Headings, TodoList };
