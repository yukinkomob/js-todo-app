class Container {
  show(data) {
    const list = data.list;
    // console.log(list);
    let container = document.getElementById("container");

    // 子要素を削除（div id="container"を再作成）
    const clone = container.cloneNode(false);
    container.parentNode.replaceChild(clone, container);

    // containerを再取得
    container = document.getElementById("container");

    // 子要素を追加
    list.forEach((title) => {
      // console.log(title);
      const div = document.createElement("div");
      div.textContent = title;
      container.appendChild(div);
      console.log(container);
    });
  }
}

class ToDoData {
  constructor() {
    this.container = new Container();
    this.list = [];
  }
  list() {
    return this.list;
  }
  addToDo(title) {
    this.list.push(title);
    // console.log(this);
    this.container.show(this);
  }
  updateToDo(title, index) {
    this.list[index] = title;
  }
  removeToDo(title, index) {
    delete this.list[index];
  }
}

const data = new ToDoData();

var input_submit = document.querySelector("input[type=submit]");
input_submit.addEventListener("click", function (e) {
  e.preventDefault();
  const input_name = document.querySelector("input[name=title]");
  const title = input_name.value;
  data.addToDo(title);

  // const container = document.getElementById("container");
  // const div = document.createElement("div");
  // div.textContent = title;
  // container.appendChild(div);
});
