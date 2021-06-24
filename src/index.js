class Container {
  show(data) {
    const list = data.list;
    let container = document.getElementById("container");

    // 子要素を削除（div id="container"を再作成）
    this.resetContainer(container);

    // containerを再取得
    container = document.getElementById("container");

    // 子要素を追加
    list.forEach((title, index) => {
      const div = this.createToDoDiv(title, data, index);
      container.appendChild(div);
    });
  }
  resetContainer(container) {
    const clone = container.cloneNode(false);
    container.parentNode.replaceChild(clone, container);
  }
  createToDoDiv(title, data, index) {
    const div = document.createElement("div");
    div.textContent = title;

    // 更新ボタンを作成
    const updateButton = document.createElement("input");
    updateButton.type = "button";
    updateButton.name = "update";
    updateButton.value = "更新";
    updateButton.addEventListener("click", (event) => {
      const newTitle = window.prompt("ToDo名を入力してください");
      data.updateToDo(newTitle, index);
    });

    // 削除ボタンを作成
    const deleteButton = document.createElement("input");
    deleteButton.type = "button";
    deleteButton.name = "delete";
    deleteButton.value = "削除";
    deleteButton.addEventListener("click", (event) => {
      data.removeToDo(index);
    });

    div.appendChild(updateButton);
    div.appendChild(deleteButton);
    return div;
  }
}

class ToDoData {
  constructor() {
    this.container = new Container();
    const list = LSController.load();
    // Null合体演算子を利用するとコードの色表記がおかしくなるので、if~elseを利用
    if (list) {
      this.list = list;
    } else {
      this.list = [];
    }
    this.container.show(this);
  }
  list() {
    return this.list;
  }
  addToDo(title) {
    this.list.push(title);
    LSController.save(this);
    this.container.show(this);
  }
  updateToDo(title, index) {
    this.list[index] = title;
    LSController.save(this);
    this.container.show(this);
  }
  removeToDo(index) {
    this.list.splice(index, 1);
    LSController.save(this);
    this.container.show(this);
  }
}

class LSController {
  static save(data) {
    // TODO localStorageにlistの値を保存
    console.log("save");
    const json = JSON.stringify(data.list);
    localStorage.setItem("todoList", json);
  }
  static load() {
    // TODO localStorageからlistの値を読み込み
    console.log("load");
    let getjson;
    try {
      getjson = localStorage.getItem("todoList");
      console.log("list: " + getjson);
      return JSON.parse(getjson);
    } catch (e) {
      console.log(e.message);
      return [];
    }
  }
}

const data = new ToDoData();

var input_submit = document.querySelector("input[type=submit]");
input_submit.addEventListener("click", function (e) {
  e.preventDefault();
  const input_name = document.querySelector("input[name=title]");
  const title = input_name.value;
  data.addToDo(title);

  input_name.value = "";
});
