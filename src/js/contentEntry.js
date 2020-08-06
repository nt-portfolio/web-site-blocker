// 参照
import "../_scss/style.scss";
import "@babel/polyfill";

// FileModules
import content from './module/content';

window.onload = function() {
  content();
}