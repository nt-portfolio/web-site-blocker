import { setLocalstorage, getLocalstorage } from "./functions";

/**
 * Options Scripts
 */
const options = () => {
  // 要素を取得する;
  const blocklistMask = document.getElementById(
    "options__browser-blocklistMask"
  );
  const commentHide = document.getElementById("options__youtube-commentHide");
  const chatHide = document.getElementById("options__youtube-chatHide");
  const resetButton = document.getElementById("options__resetButton");

  // ローカルストレージのオプションをロードする
  if (getLocalstorage("options").blocklistMask) {
    blocklistMask.checked = getLocalstorage("options").blocklistMask;
  }
  if (getLocalstorage("options").commentHide) {
    commentHide.checked = getLocalstorage("options").commentHide;
  }
  if (getLocalstorage("options").chatHide) {
    chatHide.checked = getLocalstorage("options").chatHide;
  }

  // ブロックリストをマスクするオプション
  blocklistMask.addEventListener("click", (event) => {
    setLocalstorage("options", {
      blocklistMask: event.target.checked,
      commentHide: document.getElementById("options__youtube-commentHide")
        .checked,
      chatHide: document.getElementById("options__youtube-chatHide").checked,
    });
  });

  // コメントを非表示にするオプション
  commentHide.addEventListener("click", (event) => {
    setLocalstorage("options", {
      blocklistMask: document.getElementById("options__browser-blocklistMask")
        .checked,
      commentHide: event.target.checked,
      chatHide: document.getElementById("options__youtube-chatHide").checked,
    });
  });

  // チャットを非表示にするオプション
  chatHide.addEventListener("click", (event) => {
    setLocalstorage("options", {
      blocklistMask: document.getElementById("options__browser-blocklistMask")
        .checked,
      commentHide: document.getElementById("options__youtube-commentHide")
        .checked,
      chatHide: event.target.checked,
    });
  });

  // オプション設定を初期化する
  resetButton.addEventListener("click", () => {
    const result = window.confirm(chrome.i18n.getMessage("resetOptionConfirm"));
    if (result) optionReset();
  });
};

/**
 * オプション設定を初期化する
 */
const optionReset = () => {
  localStorage.removeItem("options");
  setLocalstorage("options", {
    blocklistMask: false,
    commentHide: true,
    chatHide: true,
  });

  // 画面表示を初期化する;
  if (getLocalstorage("options").blocklistMask) {
    document.getElementById("options__browser-blocklistMask").checked = false;
  }
  if (getLocalstorage("options").commentHide) {
    document.getElementById("options__youtube-commentHide").checked = true;
  }
  if (getLocalstorage("options").chatHide) {
    document.getElementById("options__youtube-chatHide").checked = true;
  }
};

export default options;
