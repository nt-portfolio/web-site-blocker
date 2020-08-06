const webpack = require("webpack");
const path = require("path");

// webpack の出力オプションを指定する 'production' or 'development' を指定
const MODE = "production";

// ソースマップの利用有無(productionのときはソースマップを利用しない)
const enabledSourceMap = MODE === "production";

module.exports = {
  // watchを有効にする(npm scriptのオプションで叩くのでコメントアウト)
  //watch: true,

  // modeを production に設定すると最適化された状態で、
  // development に設定するとソースマップ有効でJSファイルが出力される
  mode: MODE,

  // エントリーポイントの設定
  entry: {
    popup: "./src/js/popupEntry.js",
    content: "./src/js/contentEntry.js",
    background: "./src/js/backgroundEntry.js",
    options: "./src/js/optionsEntry.js",
  },

  // バンドルされたjsファイルの名前とパス
  output: {
    path: `${__dirname}/app/`,
    filename: "[name].js",
  },
  plugins: [
    new webpack.DefinePlugin({
      ICON_COLOR: "#4688F1",
      REDIRECT_URL: "https://www.google.com/",
    }),
  ],
  // ローダーの設定
  module: {
    rules: [
      // Sassファイルの読み込みとコンパイル
      {
        test: /\.scss/, // 対象となるファイルの拡張子
        use: [
          // linkタグに出力する機能
          "style-loader",
          // CSSをバンドルするための機能
          {
            loader: "css-loader",
            options: {
              // オプションでCSS内のurl()メソッドの取り込みを禁止する
              url: false,
              // ソースマップの利用有無
              sourceMap: enabledSourceMap,
              // 0 => no loaders (default);
              // 1 => postcss-loader;
              // 2 => postcss-loader, sass-loader
              importLoaders: 2,
            },
          },
          // PostCSSのための設定
          {
            loader: "postcss-loader",
            options: {
              // PostCSS側でもソースマップを有効にする
              sourceMap: true,
              plugins: [
                // Autoprefixerを有効化 (ベンダープレフィックスを自動付与する)
                require("autoprefixer")({
                  grid: true,
                  // browsers:["last 2 versions", "ie >=11", "Android >= 4"]
                }),
              ],
            },
          },
          {
            loader: "sass-loader",
            options: {
              // ソースマップの利用有無
              sourceMap: enabledSourceMap,
            },
          },
        ],
      },
      {
        // 拡張子 .js の場合
        test: /\.js$/,
        // ローダーの処理対象から外すディレクトリ
        exclude: /node_modules/,
        use: [
          {
            // Babel を利用する
            loader: "babel-loader",
            // Babel のオプションを指定する
            options: {
              presets: [
                // プリセットを指定することで、ES2019 を ES5 に変換
                "@babel/preset-env",
              ],
            },
          },
        ],
      },
    ],
  },
};
