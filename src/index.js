class ToDoData {
  constructor() {
    this.list = [];
  }
  list() {
    return this.list;
  }
  addToDo(title) {
    this.list.push(title);
  }
  updateToDo(title, index) {
    this.list[index] = title;
  }
  removeToDo(title, index) {
    delete this.list[index];
  }
}

class Container {
  show(data) {
    const list = data.list;
    const container = document.getElementById("container");
    list.array.forEach((title) => {
      const div = document.createElement("div");
      div.textContent = title;
      container.appendChild(div);
    });
  }
}

const data = new ToDoData();
const container = new Container();

var input_submit = document.querySelector("input[type=submit]");
input_submit.addEventListener("click", function (e) {
  e.preventDefault();
  const input_name = document.querySelector("input[name=title]");
  const title = input_name.value;
  const container = document.getElementById("container");
  const div = document.createElement("div");
  div.textContent = title;
  container.appendChild(div);
});
