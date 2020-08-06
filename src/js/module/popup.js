import {
  pageBlock,
  domainBlock,
  showBlockList,
  getMaskingOption,
} from "./functions";

/**
 * Popup Scripts
 */
const popup = () => {
  const resetButton = document.getElementById("listEditContainer-resetButton");
  const editContainerShowButton = document.getElementById(
    "listEditContainer-showButton"
  );
  const handwritingExecButton = document.getElementById(
    "handwritingContainer-execButton"
  );
  const handwritingInput = document.getElementById(
    "handwritingContainer-input"
  );
  const pageBlockButton = document.getElementById(
    "blockButtonContainer-pageBlock-button"
  );
  const domainBlockButton = document.getElementById(
    "blockButtonContainer-domainBlock-button"
  );
  const showBlockListButton = document.getElementById(
    "blockButtonContainer-showBlockList-button"
  );
  const openOptionButton = document.getElementById(
    "blockButtonContainer-openOption-button"
  );

  pageBlockButton.innerHTML = `<i class="fas fa-ban"></i><span>&nbsp;</span>${chrome.i18n.getMessage(
    "pageBlock"
  )}`;
  domainBlockButton.innerHTML = `<i class="fas fa-ban"></i><span>&nbsp;</span>${chrome.i18n.getMessage(
    "domainBlock"
  )}`;
  showBlockListButton.innerHTML = `<i class="fas fa-chevron-circle-down"></i><span>&nbsp;</span>${chrome.i18n.getMessage(
    "showBlockedUrlList"
  )}`;
  editContainerShowButton.innerHTML = `<i class="fas fa-pencil-alt"></i><span>&nbsp;</span>${chrome.i18n.getMessage(
    "handwriting"
  )}`;
  resetButton.innerHTML = `<i class="fas fa-eraser"></i><span>&nbsp;</span>${chrome.i18n.getMessage(
    "allReset"
  )}`;
  openOptionButton.innerHTML = `<i class="fas fa-cog"></i><span>&nbsp;</span>${chrome.i18n.getMessage(
    "option"
  )}`;

  // ローカルストレージを全て消去する
  resetButton.addEventListener("click", () => {
    const result = window.confirm(
      chrome.i18n.getMessage("resetBlockListConfirm")
    );
    if (result) {
      localStorage.removeItem("blockSite");
      const listView = document.getElementById("blockListViewContainer-list");
      // 要素を初期化する
      while (listView.firstChild) {
        listView.removeChild(listView.firstChild);
      }
    }
  });

  // 手動でブロックurlを登録する際のフィールドを表示する
  editContainerShowButton.addEventListener("click", () => {
    // 要素を取得する
    const container = document.getElementById("handwritingContainer");

    if (container.style.display == "none" || !container.style.display) {
      container.style.display = "block";
    } else {
      container.style.display = "none";
    }
  });

  // 手動でブロックurlを登録する
  handwritingExecButton.addEventListener("click", () => {
    // 要素を取得する
    const input = document.getElementById("handwritingContainer-input");
    // ローカルストレージに登録する
    if (pageBlock(input.value)) {
      // フィールドを初期化する
      document.getElementById("handwritingContainer-form").reset();
      // フォーカスを外す
      input.blur();
      // ブロックリストオプションを取得する
      const maskFlag = getMaskingOption();
      // 表示を更新する
      showBlockList(true, maskFlag);
    }
  });

  // 手動でブロックurlを登録する（Enter key 押下）
  handwritingInput.addEventListener("keypress", (event) => {
    if (event.keyCode == 13) {
      // ローカルストレージに登録する
      if (pageBlock(event.target.value)) {
        // フィールドを初期化する
        document.getElementById("handwritingContainer-form").reset();
        // フォーカスを外す
        this.blur();
        // ブロックリストオプションを取得する
        const maskFlag = getMaskingOption();
        // 表示を更新する
        showBlockList(true, maskFlag);
      }
    }
  });

  // ブロックするurlを登録する (ページブロック)
  pageBlockButton.addEventListener("click", () => {
    // 現在のタブを取得する
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      // ローカルストレージに登録する
      let result = pageBlock(tabs[0].url);
      if (result) {
        chrome.tabs.sendMessage(
          tabs[0].id,
          { type: { key: "sendResponsePageBlock" }, result: result },
          null
        );
        // ブロックリストオプションを取得する
        const maskFlag = getMaskingOption();
        // 表示を更新する
        showBlockList(true, maskFlag);
      }
    });
  });

  // ブロックするurlを登録する (ドメインブロック)
  domainBlockButton.addEventListener("click", () => {
    // 現在のタブを取得する
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      // ローカルストレージに登録する
      let result = domainBlock(tabs[0].url);
      if (result) {
        chrome.tabs.sendMessage(
          tabs[0].id,
          { type: { key: "sendResponseDomainBlock" }, result: result },
          null
        );
        // ブロックリストオプションを取得する
        const maskFlag = getMaskingOption();
        // 表示を更新する
        showBlockList(true, maskFlag);
      }
    });
  });

  // オプション設定ページを開く
  openOptionButton.addEventListener("click", () => {
    if (chrome.runtime.openOptionsPage) {
      chrome.runtime.openOptionsPage();
    }
  });

  // ブロック済みのurlを表示する
  showBlockListButton.addEventListener("click", () => {
    // ブロックリストオプションを取得する
    const maskFlag = getMaskingOption();
    // 表示を更新する
    showBlockList(false, maskFlag);
  });
};

export default popup;
