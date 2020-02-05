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
  constructor(heading, id, list = [], currentlyAdded = {}) {
    this.id = id;
    this.heading = heading;
    this.list = list;
    this.currentlyAdded = currentlyAdded;
  }

  static load(content) {
    const titlesList = JSON.parse(content || '[]');
    const todoList = new TodoList();
    titlesList.forEach(list => {
      todoList.list.push(new Item(list.title, list.id, list.done));
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
        new TodoList(list.heading, list.id, list.list, list.currentlyAdded)
      );
    });
    return headings;
  }

  toStringify() {
    return JSON.stringify(this.todoList, null, 2);
  }

  save(heading) {
    const newList = new TodoList(heading.title, `${new Date().getTime()}`);
    this.todoList.push(newList);
    this.currentlyAdded = newList;
  }
}

module.exports = { Headings, TodoList };
