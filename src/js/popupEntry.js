// 参照
import "../_scss/style.scss";
import "@babel/polyfill";

// FileModules
import popup from './module/popup';

window.onload = function() {
  popup();
}