// ToDoコンテナ（<div id="container">）の中身を作成するクラス
class Container {
  // ToDoコンテナを表示する
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

  // ToDoコンテナの内容をリセットする
  resetContainer(container) {
    const clone = container.cloneNode(false);
    container.parentNode.replaceChild(clone, container);
  }
  // ToDo項目を作成する
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

// ToDoの状態管理クラス
class ToDoItem {
  constructor(title, isComplete = false) {
    this.title = title;
    this.isComplete = isComplete;
  }
  isComplete() {
    return this.isComplete;
  }
  complete() {
    this.isComplete = true;
    // 完了状態の場合、"* 文字列" のようにする
    this.title = "* " + this.title;
  }
  uncomplete() {
    this.isComplete = false;
    // "* 文字列"の"*"を除外する
    this.title = this.title.replace("* ", "");
  }
}

// ToDoのデータ管理クラス
class ToDoData {
  constructor() {
    this.todoListTag = "todoList";
    this.container = new Container();
    const list = LocalStorageController.load(this.todoListTag);
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
  // ToDO項目を追加
  addToDo(title) {
    this.list.push(new ToDoItem(title));
    LocalStorageController.save(this.todoListTag, this);
    this.container.show(this);
  }
  // ToDO項目を更新
  updateToDo(title, index) {
    this.list[index].title = title;
    LocalStorageController.save(this.todoListTag, this);
    this.container.show(this);
  }
  // ToDO項目を削除
  removeToDo(index) {
    this.list.splice(index, 1);
    LocalStorageController.save(this.todoListTag, this);
    this.container.show(this);
  }
  // ToDO項目を完了状態に更新
  completeToDo(index) {
    this.list[index].complete();
    LocalStorageController.save(this.todoListTag, this);
    this.container.show(this);
  }
  // ToDO項目を未完了状態に更新
  uncompleteToDo(index) {
    this.list[index].uncomplete();
    LocalStorageController.save(this.todoListTag, this);
    this.container.show(this);
  }
  // ToDO項目の完了状態をチェック
  isCompleteToDO(index) {
    return this.list[index].isComplete;
  }
}

// ローカルストレージの管理を行うクラス
class LocalStorageController {
  // ローカルストレージにデータを保存
  static save(key, data) {
    const json = JSON.stringify(data.list);
    localStorage.setItem(key, json);
  }
  // ローカルストレージからデータを読込
  static load(key) {
    let getjson;
    try {
      getjson = localStorage.getItem(key);
      return JSON.parse(getjson);
    } catch (e) {
      console.log(e.message);
      return [];
    }
  }
}

const data = new ToDoData();

// 登録フォームにおける登録ボタンのクリックイベント
var inputSubmit = document.querySelector("input[type=submit]");
inputSubmit.addEventListener("click", function (e) {
  e.preventDefault();
  const inputName = document.querySelector("input[name=title]");
  const title = inputName.value;
  data.addToDo(title);

  inputName.value = "";
});
