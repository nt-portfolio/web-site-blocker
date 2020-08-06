/**
 * ローカルストレージの値をセットする
 * @param {string} parentKey ローカルストレージのキー
 * @param {object} object ローカルストレージに保存するデータ
 */
export const setLocalstorage = (parentKey, object) => {
  localStorage.setItem(parentKey, JSON.stringify(object));
};

/**
 * ローカルストレージの値を取得する
 * @param {string} parentKey ローカルストレージのキー
 * @return {object}
 */
export const getLocalstorage = (parentKey) => {
  const data = localStorage.getItem(parentKey);
  return data ? JSON.parse(data) : {};
};

/**
 * ローカルストレージのデータと対象を比較し、重複チェックを行う
 * @param {string} url 対象となるURL文字列
 * @param {string} parentKey ローカルストレージのキー
 * @return {boolean}
 */
export const checkLocalStorage = (url, parentKey) => {
  const data = getLocalstorage(parentKey);
  if (Object.keys(data).length > 0) {
    for (const k in data) {
      if (data[k].trim() == url.trim()) {
        return false;
      }
    }
  }
  return true;
};

/**
 * URL文字列からドメイン部分を抽出する
 * @param  {string} url URL文字列
 * @return {string | void}
 */
export const extractDomain = (url) => {
  if (!url) return;
  try {
    return url.match(/^https?:\/{2,}(.*?)(?:\/|\?|#|$)/)[1];
  } catch (error) {
    console.log(error);
  }
};

/**
 * 文字列のバイト数をカウントする
 * 半角⇒1、全角⇒2
 * @param  {string} str 入力文字列
 * @return {number}
 */
export const getLen = (str) => {
  // 数値型だったら文字列型にキャストする
  if (Number.isFinite(str)) str += "";

  let result = 0;
  for (let i = 0; i < str.length; i++) {
    const chr = str.charCodeAt(i);
    if (
      (chr >= 0x00 && chr < 0x81) ||
      chr === 0xf8f0 ||
      (chr >= 0xff61 && chr < 0xffa0) ||
      (chr >= 0xf8f1 && chr < 0xf8f4)
    ) {
      //半角文字の場合は1を加算する
      result += 1;
    } else {
      //それ以外の文字の場合は2を加算する
      result += 2;
    }
  }
  return result;
};

/**
 * 一定の文字数(第二引数)を超えたら・・・の表記で省略する
 * @param {string} str 入力文字列
 * @param {number} maxStrlength 省略するまでの最大文字数
 * @return {string}
 */
export const strOmit = (str, maxStrlength) => {
  // 文字列型だったら数値型にキャストする
  if (Number.isFinite(maxStrlength)) maxStrlength = Number(maxStrlength);

  // フラグの初期化
  let isSlice = false;
  // 第二引数の数分指定した文字を抽出し、・・・を足すフラグを立てる
  while (getLen(str) > maxStrlength) {
    str = str.slice(0, str.length - 1);
    isSlice = true;
  }
  // 文字列を結合する
  if (isSlice) str += " ...";
  return str;
};

/**
 * 引数textを引数symbolに置換する
 * @param {string} text
 * @param {string} symbol
 * @return {string}
 */
export const maskText = (text, symbol) => {
  let retStr = "";
  for (let i = 0; i < text.length; i++) {
    retStr += symbol;
  }
  return retStr;
};

/**
 * ドメインを基に正規表現パターンを作成し、文字列で返す
 * @param {string} domain ドメイン
 * @return {string}
 */
export const toRegExpFormat = (domain) => `*://${domain}/*`;

/**
 * ブロックリストに登録する
 * @param {string} value
 * @return {boolean}
 */
export const registerBlockList = (value) => {
  // 重複チェック
  if (!checkLocalStorage(value, "blockSite")) return false;

  // データオブジェクトを作成する
  let datalist = {};
  let index = Object.keys(getLocalstorage("blockSite")).length;
  if (index > 0) {
    index += 1;
    datalist = getLocalstorage("blockSite");
    datalist[`url${index}`] = value;
  } else {
    datalist = { url1: value };
  }
  // 作成したオブジェクトをローカルストレージに追加する
  setLocalstorage("blockSite", datalist);
  return true;
};

/**
 * ブロックリストのマスキングオプションを取得する
 * @return {boolean}
 */
export const getMaskingOption = () => {
  if (getLocalstorage("options").blocklistMask) {
    return getLocalstorage("options").blocklistMask;
  } else {
    return false;
  }
};

/**
 * ブロックリストを表示する
 * @param {boolean} refreshFlag
 * @param {boolean} maskFlag
 * @return {void}
 */
export const showBlockList = (refreshFlag, maskFlag) => {
  const container = document.getElementById("blockListViewContainer");
  const listView = document.getElementById("blockListViewContainer-list");

  if (container.style.display === "block") {
    // 非表示にする
    container.style.display = "none";
    // 要素を初期化する
    while (listView.firstChild) {
      listView.removeChild(listView.firstChild);
    }
    if (!refreshFlag) return;
  }

  const list = getLocalstorage("blockSite");

  // 降順で表示する
  for (let i = Object.keys(getLocalstorage("blockSite")).length; i >= 1; i--) {
    const div = document.createElement("div");
    div.setAttribute("id", `blockListViewContainer-list-item-div-${i}`);
    div.setAttribute("class", "popup__blockListViewContainer-list-item-div");

    const li = document.createElement("li");
    li.setAttribute("class", "popup__blockListViewContainer-list-item-div-li");
    let textNode = list[`url${i}`];
    // マスキングONだったらマスキングする
    if (maskFlag) textNode = maskText(textNode, "●");
    li.appendChild(document.createTextNode(strOmit(textNode, 30)));

    const span = document.createElement("span");
    span.setAttribute("id", `blockListViewContainer-list-item-div-li-${i}`);
    span.setAttribute(
      "class",
      "popup__blockListViewContainer-list-item-div-li-delete"
    );
    span.innerHTML = '<i class="far fa-times-circle"></i>';

    div.appendChild(li);
    li.appendChild(span);
    listView.appendChild(div);
  }

  container.style.display = "block";

  // 個別にブロック解除する
  for (let i = Object.keys(getLocalstorage("blockSite")).length; i >= 1; i--) {
    document
      .getElementById(`blockListViewContainer-list-item-div-li-${i}`)
      .addEventListener("click", () => {
        // ローカルストレージから削除する
        // 新しいデータを作成する
        const newData = {};
        let minus = 0;

        for (let j = 1; j <= length; j++) {
          if (i != j) {
            newData[`url${j - minus}`] = list[`url${j - minus}`];
          } else {
            minus++;
          }
        }
        // 新しいデータをローカルストレージにセットする
        setLocalstorage("blockSite", newData);

        // 子要素<div>を削除する
        const parent = document.getElementById("blockListViewContainer-list");
        const child = document.getElementById(
          `blockListViewContainer-list-item-div-${i}`
        );
        parent.removeChild(child);
      });
  }
};

/**
 * 指定したページをブロックする
 * @param {string} url
 * @return {boolean}
 */
export const pageBlock = (url) => {
  // 現在のURLを取得する
  if (url) {
    // ローカルストレージに登録する
    return registerBlockList(url);
  } else {
    return false;
  }
};

/**
 * 指定したドメインをブロックする
 * @param {string} url
 * @return {boolean}
 */
export const domainBlock = (url) => {
  // 現在のURLを取得する
  if (url) {
    // 現在のURLからドメインを抽出する
    const domain = extractDomain(url);
    // ローカルストレージに登録する
    return registerBlockList(domain);
  } else {
    return false;
  }
};
