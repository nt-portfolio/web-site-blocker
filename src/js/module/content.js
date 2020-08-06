import Flash from "./Flash";

/**
 * Content Scripts
 */
const content = () => {
  // background.jsからメッセージを受け取る
  chrome.runtime.onMessage.addListener((message, sender, callback) => {
    switch (message.type.key) {
      case "google":
        google();
        break;
      case "youtube":
        youtube(message.type.commentHide, message.type.chatHide);
        break;
      case "youtubeTop":
        youtubeTop();
        break;
      case "sendResponsePageBlock":
        // ブロックの成否を受け取る
        if (message.result) {
          // snackbarを表示する（成功）
          showSnackbar("blockSuccess", true);
        } else {
          // snackbarを表示する（失敗）
          showSnackbar("blockFailed", false);
        }
        break;
      case "sendResponseDomainBlock":
        // ブロックの成否を受け取る
        if (message.result) {
          // snackbarを表示する（成功）
          showSnackbar("blockSuccess", true);
        } else {
          // snackbarを表示する（失敗）
          showSnackbar("blockFailed", false);
        }
        break;
      default:
        break;
    }
  });
};

/**
 * snackbarを表示する
 * @param {string} msg テキスト
 * @param {boolean} bool 処理が成功か失敗か
 */
const showSnackbar = (msg, bool) => {
  if (document.getElementById("common__flash")) {
    document.getElementById("common__flash").style.display = "block";
    setTimeout(() => {
      document.getElementById("common__flash").style.display = "none";
    }, 3000);
  } else {
    new Flash(chrome.i18n.getMessage(msg), bool);
  }
};

/**
 * google.comページを加工する
 */
const google = () => {
  // 親要素を取得する
  let container = document.getElementsByClassName("rc");
  let parent = document.getElementsByClassName("r");
  let href = [];
  let blockButton = [];
  let menu = [];
  let transparentMask = [];
  let list = [];
  let liPageBlock = [];
  let liDomainBlock = [];

  // 要素を作成する
  for (let i = 0; i < parent.length; i++) {
    // google.comの検索結果のhrefを配列に格納する
    href[i] = parent[i].children[0].getAttribute("href");

    blockButton[i] = document.createElement("span");
    blockButton[i].appendChild(
      document.createTextNode(chrome.i18n.getMessage("block"))
    );
    blockButton[i].setAttribute("class", "content__blockButton");
    menu[i] = document.createElement("div");
    menu[i].style.display = "none";
    menu[i].style.top = "10px";
    menu[i].style.left = "0px";
    transparentMask[i] = document.createElement("div");
    transparentMask[i].setAttribute(
      "class",
      "content__blockButton-transparent"
    );
    transparentMask[i].style.display = "none";
    list[i] = document.createElement("ul");
    liPageBlock[i] = document.createElement("li");
    liDomainBlock[i] = document.createElement("li");

    // 要素を組み立てる
    liPageBlock[i].appendChild(
      document.createTextNode(chrome.i18n.getMessage("pageBlock"))
    );
    liDomainBlock[i].appendChild(
      document.createTextNode(chrome.i18n.getMessage("domainBlock"))
    );
    list[i].appendChild(liPageBlock[i]);
    list[i].appendChild(liDomainBlock[i]);
    menu[i].appendChild(list[i]);
    menu[i].setAttribute("class", "content__blockButton-menu");
    parent[i].appendChild(menu[i]);
    document.body.appendChild(transparentMask[i]);

    // ブロックメニューを非表示にする
    transparentMask[i].addEventListener("click", () => {
      menu[i].style.display = "none";
      transparentMask[i].style.display = "none";
    });

    // ブロックメニューを表示する
    blockButton[i].addEventListener("click", () => {
      menu[i].style.display = "block";
      transparentMask[i].style.display = "block";
    });

    // ページをブロックする
    liPageBlock[i].addEventListener("click", () => {
      // 処理はbackground.jsで行う
      chrome.runtime.sendMessage({
        type: "pageBlock",
        text: href[i],
      });
      menu[i].style.display = "none";
    });

    // ドメインをブロックする
    liDomainBlock[i].addEventListener("click", () => {
      // 処理はbackground.jsで行う
      chrome.runtime.sendMessage({
        type: "domainBlock",
        text: href[i],
      });
      menu[i].style.display = "none";
    });

    // 検索ページにブロック用のボタンを設置する
    parent[i].appendChild(blockButton[i]);

    // ブロックしているドメインとURLはgoogle.comの検索ページに表示しない
    chrome.runtime.sendMessage(
      { type: "getItem", key: "blockSite" },
      (response) => {
        if (response.data) {
          for (let j = 1; j <= Object.keys(response.data).length; j++) {
            if (href[i].indexOf(response.data[`url${j}`]) !== -1)
              container[i].style.display = "none";
          }
        }
      }
    );
  }
};

// youtube.comページを加工する
const youtube = (commentHide, chatHide) => {
  // 「コメント欄」を非表示にする
  if (commentHide && document.getElementById("comments")) {
    const comments = document.getElementById("comments");
    comments.style.display = "none";
  }

  // setTimeout(() => {
  // 「チャット」を非表示にする

  if (chatHide && document.getElementById("chat-messages")) {
    const chat = document.getElementById("chat-messages");
    chat.style.display = "none";
  }
  // }, 20000);

  // const MAX_RETRY_COUNT = 10;
  // let retryCounter = 0;
  // let elem;
  // // 要素を取得するまリトライし続ける
  // let setIntervalId = setInterval(() => {
  //   console.log(retryCounter);
  //   retryCounter++;
  //   // MAXリトライを超えたら処理を停止する
  //   if (retryCounter > MAX_RETRY_COUNT) {
  //     clearInterval(setIntervalId);
  //     setIntervalId = null;
  //     alert("delete");
  //   }
  //   if (setIntervalId !== null) {
  //     if (document.getElementById("chat-messages")) {
  //       elem = document.getElementById("chat-messages");
  //       elem.style.display = "none";

  //       clearInterval(setIntervalId);
  //       setIntervalId = null;
  //     }
  //   }
  // }, 1000);

  // // 「次の動画」を非表示にする
  // if (document.getElementById("related")) {
  //   const related = document.getElementById("related");
  //   related.style.display = "none";
  // }

  // 動画を非表示にする（開発中）
};

/**
 * youtube.comのトップページを加工する
 */
const youtubeTop = () => {
  // 最初に表示される動画群を非表示にする
  // if (document.getElementById("primary")) {
  //   const topPageContent = document.getElementById("primary");
  //   topPageContent.style.display = "none";
  // }
};

export default content;
