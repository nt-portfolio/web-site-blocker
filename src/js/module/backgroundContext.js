import { pageBlock, domainBlock } from "./functions";

/**
 * backgroundContext.js
 */
const backgroundContext = () => {
  // ContextMenus
  const contextMenusPageBlock = chrome.contextMenus.create({
    title: "page block",
    type: "normal",
    contexts: [
      "page",
      "frame",
      "selection",
      "link",
      "editable",
      "image",
      "video",
      "audio",
      "browser_action",
    ],
    onclick: (info, tab) => {
      let result = pageBlock(tab.url);
      console.log(info);
      chrome.tabs.sendMessage(
        tab.id,
        { type: "sendResponsePageBlock", result: result },
        null
      );
    },
  });

  const contextMenusDomainBlock = chrome.contextMenus.create({
    title: "domain block",
    type: "normal",
    contexts: [
      "page",
      "frame",
      "selection",
      "link",
      "editable",
      "image",
      "video",
      "audio",
      "browser_action",
    ],
    onclick: (info, tab) => {
      let result = domainBlock(tab.url);
      console.log(info);
      chrome.tabs.sendMessage(
        tab.id,
        { type: "sendResponseDomainBlock", result: result },
        null
      );
    },
  });
};

export default backgroundContext;
