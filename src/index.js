class Container {
  show(data) {
    const list = data.list;
    let container = document.getElementById("container");

    // 子要素を削除（div id="container"を再作成）
    this.resetContainer(container);

    // containerを再取得
    container = document.getElementById("container");

    // 子要素を追加
    list.forEach((item, index) => {
      const div = this.createToDoDiv(item.title, data, index);
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

    // 完了ボタンを作成
    const completeButton = document.createElement("input");
    completeButton.type = "button";
    completeButton.name = "complete";
    const isComplete = data.isCompleteToDO(index);
    completeButton.value = isComplete ? "未完了" : "完了";
    if (isComplete) {
      completeButton.addEventListener("click", (event) => {
        data.uncompleteToDo(index);
      });
    } else {
      completeButton.addEventListener("click", (event) => {
        data.completeToDo(index);
      });
    }

    // 更新ボタンを作成
    const updateButton = document.createElement("input");
    updateButton.type = "button";
    updateButton.name = "update";
    updateButton.value = "更新";
    updateButton.addEventListener("click", (event) => {
      let newTitle = window.prompt("ToDo名を入力してください");
      if (data.isCompleteToDO(index)) {
        newTitle = "* " + newTitle;
      }
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

    div.appendChild(completeButton);
    div.appendChild(updateButton);
    div.appendChild(deleteButton);
    return div;
  }
}

class ToDoItem {
  constructor(title, isComplete = false) {
    this.title = title;
    this.isComplete = isComplete;
  }
  setTitle(title) {
    this.title = title;
  }
  getTitle() {
    return this.title;
  }
  isComplete() {
    return this.isComplete;
  }
  complete() {
    this.isComplete = true;
    this.title = "* " + this.title;
  }
  uncomplete() {
    this.isComplete = false;
    this.title = this.title.replace("* ", "");
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
    this.list.push(new ToDoItem(title));
    LSController.save(this);
    this.container.show(this);
  }
  updateToDo(title, index) {
    this.list[index].setTitle(title);
    LSController.save(this);
    this.container.show(this);
  }
  removeToDo(index) {
    this.list.splice(index, 1);
    LSController.save(this);
    this.container.show(this);
  }
  completeToDo(index) {
    this.list[index].complete();
    LSController.save(this);
    this.container.show(this);
  }
  uncompleteToDo(index) {
    this.list[index].uncomplete();
    LSController.save(this);
    this.container.show(this);
  }
  isCompleteToDO(index) {
    return this.list[index].isComplete;
  }
}

class LSController {
  static save(data) {
    const json = JSON.stringify(data.list);
    localStorage.setItem("todoList", json);
  }
  static load() {
    let getjson;
    try {
      getjson = localStorage.getItem("todoList");
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
