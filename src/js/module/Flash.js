const SUCCESS_COLOR = "#00AD54";
const FAILED_COLOR = "#E0245E";

// 処理したイベントをメッセージで表示する
export default class Flash {
  /**
   * constructor
   */
  constructor(msg, result) {
    this.msgbox;
    this.msg = msg;
    this.create();
    this.build();
    this.styles(result);
  }

  // 要素を作成する
  create() {
    this.msgbox = document.createElement("div");
    this.msgbox.appendChild(document.createTextNode(this.msg));
    this.msgbox.setAttribute("id", "common__flash");
    this.msgbox.setAttribute("class", "common__fadeout");
  }

  // 要素を組み立てる
  build() {
    document.body.appendChild(this.msgbox);
  }

  styles(result) {
    // スタイル
    this.msgbox.style.position = "fixed";
    this.msgbox.style.top = "80px";
    this.msgbox.style.backgroundColor = result ? SUCCESS_COLOR : FAILED_COLOR;
    this.msgbox.style.color = "#FFFFFF";
    this.msgbox.style.padding = "5px 15px";
    this.msgbox.style.borderRadius = "20px";
    this.msgbox.style.cursor = "pointer";
    this.msgbox.style.display = "block";
    this.msgbox.style.zIndex = 10000;
    const w =
      Math.round((this.msgbox.clientWidth + window.innerWidth) / 2) -
      this.msgbox.clientWidth;
    this.msgbox.style.left = `${w}px`;
    setTimeout(() => {
      this.msgbox.style.display = "none";
    }, 3000);
  }
}
