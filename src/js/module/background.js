import {
  pageBlock,
  domainBlock,
  checkLocalStorage,
  extractDomain,
  setLocalstorage,
  getLocalstorage,
} from "./functions";
import backgroundContext from "./backgroundContext";
// Chrome拡張のホットリロード
import hotreload from "crx-hotreload";

/**
 * Background Scripts
 */
const background = () => {
  // Initialize
  // 機能オンの時にアイコンに被せて「ON」のバッジを表示する
  chrome.browserAction.setBadgeText({ text: "ON" });
  chrome.browserAction.setBadgeBackgroundColor({ color: "#4688F1" });

  // 右クリックメニューを作成する
  backgroundContext();

  // オプションを初期化する
  if (
    !getLocalstorage("options").blocklistMask &&
    !getLocalstorage("options").commentHide &&
    !getLocalstorage("options").chatHide
  ) {
    setLocalstorage("options", {
      blocklistMask: false,
      commentHide: true,
      chatHide: true,
    });
  }

  // ブロック済みのurlへのリクエストヘッダーを上書きする
  chrome.webRequest.onBeforeRequest.addListener(
    (details) => {
      // 書き換えたヘッダーを返す
      if (details.url) return rewriteHeader(details.url);
    },
    { urls: ["<all_urls>"] },
    ["blocking"]
  );

  // リクエストヘッダーオブジェクトを作成する
  function rewriteHeader(url) {
    // let redirectUrl = `${REDIRECT_URL}`;
    let redirectUrl = "https://www.google.com/";
    if (!checkLocalStorage(url, "blockSite")) {
      return {
        redirectUrl: url.replace(url, redirectUrl),
      };
    }
  }

  // 要素の非表示などcontentを加工する
  chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    tab.autoDiscardable = true;
    tab.pinned = false;

    let commentHide;
    let chatHide;

    // onUpdatedでは1ページのロードでloadingとcompleteの2回発生するので、changeInfo.statusを見ておかないと重複して実行される
    if (changeInfo.status == "loading") {
    } else if (changeInfo.status == "complete" && tab.url) {
      // google.com
      if (extractDomain(tab.url) == "www.google.com") {
        chrome.tabs.sendMessage(tabId, { type: { key: "google" } }, null);
      }

      // youtube.com
      if (extractDomain(tab.url) == "www.youtube.com") {
        if (tab.url == "https://www.youtube.com/") {
          chrome.tabs.sendMessage(tabId, { type: { key: "youtubeTop" } }, null);
        } else {
          // オプション設定を取得する
          if (getLocalstorage("options").commentHide)
            commentHide = getLocalstorage("options");
          if (getLocalstorage("options").chatHide)
            chatHide = getLocalstorage("options");
          chrome.tabs.sendMessage(
            tabId,
            {
              type: {
                key: "youtube",
                commentHide: commentHide["commentHide"],
                chatHide: chatHide["chatHide"],
              },
            },
            null
          );
        }
      }
    }
  });

  // content_scriptからデータを受け取る
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    let result;
    switch (request.type) {
      case "pageBlock":
        result = pageBlock(request.text);
        chrome.tabs.sendMessage(
          sender.tab.id,
          { type: { key: "sendResponsePageBlock" }, result: result },
          null
        );
        break;
      case "domainBlock":
        result = domainBlock(request.text);
        chrome.tabs.sendMessage(
          sender.tab.id,
          { type: { key: "sendResponseDomainBlock" }, result: result },
          null
        );
        break;
      case "getItem":
        // 指定されたkeyの値を取得
        sendResponse({ data: getLocalstorage(request.key) });
        break;
      default:
        console.log("Error: Unkown request.");
        console.log(request);
        break;
    }
  });
};

export default background;
