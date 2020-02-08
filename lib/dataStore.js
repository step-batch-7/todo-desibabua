const { existsSync, statSync, readFileSync, writeFileSync } = require('fs');
const SERVING_DIR = `${__dirname}/../public`;
const { Headings } = require('./todo');

const absUrl = url => `${SERVING_DIR}/${url}`;

const isFilePresent = function(path) {
  const stat = existsSync(path) && statSync(path).isFile();
  return stat;
};

class DataStore {
  constructor() {
    this.url = '';
    this.data = [];
  }

  static initialize(url) {
    const dataStore = new DataStore();
    dataStore.url = url;
    dataStore.data = Headings.load(readFileSync(url, 'utf8'));
    return dataStore;
  }

  save() {
    writeFileSync(this.url, this.data.toStringify());
  }

  addNewTodo(id, title) {
    this.data.addNewTodo(id, title);
    this.save();
  }

  currentlyAddedList(id) {
    return JSON.stringify(this.data.currentlyAddedTodo(id));
  }

  saveHeading(input) {
    this.data.save(input);
    this.save();
  }

  get currentlyAddedTodo() {
    return JSON.stringify(this.data.currentlyAdded);
  }

  removeTodo(id) {
    this.data.delete(id);
    this.save();
  }

  toStringify() {
    return this.data.toStringify();
  }

  getTodo(id) {
    return this.data.todo(`${id}`).toStringify();
  }

  toggleTodoItemStatus(id) {
    this.data.toggleItemStatus(id);
    this.save();
  }

  deleteTodo(id) {
    this.data.deleteTodo(id);
    this.save();
  }
}

module.exports = { absUrl, isFilePresent, DataStore };
