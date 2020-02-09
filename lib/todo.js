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
    return JSON.stringify(this, null, 2);
  }

  add(title) {
    const newItem = new Item(title, `${new Date().getTime()}`);
    this.list.push(newItem);
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

const isValueInTitle = function(todo, value) {
  return todo.heading.includes(value);
};

const isValueInTodoItem = function(todo, value) {
  return todo.list.some(item => item.title.includes(value));
};

class Headings {
  constructor() {
    this.todoList = [];
  }

  static load(content) {
    const previousHeadingList = JSON.parse(content || '[]');
    const headings = new Headings();
    previousHeadingList.forEach(list => {
      headings.todoList.push(TodoList.load(list.heading, list.id, list.list));
    });
    return headings;
  }

  toStringify() {
    return JSON.stringify(this.todoList, null, 2);
  }

  save(title) {
    const newList = TodoList.load(title, `${new Date().getTime()}`);
    this.todoList.push(newList);
  }

  todoById(id) {
    return this.todoList.find(item => item.id === id.split(':')[0]);
  }

  filter(value) {
    return this.todoList.filter(todo => {
      if (value) {
        return isValueInTitle(todo, value) || isValueInTodoItem(todo, value);
      }
      return false;
    });
  }

  addNewTodo(id, content) {
    this.todoById(id).add(content);
  }

  delete(id) {
    const indexToRemove = this.todoList.indexOf(this.todoById(id));
    this.todoList.splice(indexToRemove, 1);
  }

  deleteTodo({ itemId, todoId }) {
    return this.todoById(todoId).delete(itemId);
  }

  toggleItemStatus({ itemId, todoId }) {
    this.todoById(todoId).toggleStatusOf(itemId);
  }
}

module.exports = { Headings };
