module.exports = {
    // 
    "env": {
        // ブラウザで実行されるコードを静的検証する
        "browser": true,
        // ECMAScript 2015 (ES6) で書かれたコードを静的検証する
        "es6": true,
        // Node.js で実行されるコードを静的検証する
        "node": true,
        // jQuery で実行されるコードを静的検証する
        "jquery": true
    },
    // 公式のおすすめ設定を適用する
    "extends": [
        "eslint:recommended",
        // reactのおすすめ設定を適用する
        // "plugin:react/recommended"
    ],
    // 
    "globals": {
        "Atomics": "readonly",
        "SharedArrayBuffer": "readonly"
    },
    // ES Modules 機能を有効にするには、"parserOptions" プロパティも設定する必要がある
    "parserOptions": {
        "ecmaFeatures": {
            // JSX記法にも対応
            "jsx": true
        },
        // 5, 2015, 2016, 2017, 2018, 2019 のいずれかを指定できる
        "ecmaVersion": 2019,
        "sourceType": "module"
    },
    "plugins": [
    // React ライブラリに特化した追加ルールを提供するプラグイン
    //     "react"
    ],
    "rules": {
        // インデントはスペースで2文字分
        "indent": [2,2],
        "linebreak-style": [
            2,
            "unix"
        ],
        // セミコロンを忘れていたらエラー
        "semi": "error",
        // ヨーダ記法があったらエラー
        "yoda": "error",
        // // switch文でのdefaultブロックを常に要求する
        // "default-case"： "error",
        // 厳密比較演算子を使用する
        "eqeqeq" : "error",
        // アンダーキャメルケース
        "camelcase" : "warn",
        // 文字列にはシングルクォートを使用する
        "quotes" : ["warn", "single"],
        // return、throw、continue、breakのあとに、到達不可能なコードがあるか確認する
        "no-unreachable": "error",
        // ECMAScript 2015 で追加された言語機能に関するルールの諸々
        "arrow-body-style": "error",
        "arrow-parens": "error",
        "arrow-spacing": "error",
        "generator-star-spacing": "error",
        "no-duplicate-imports": "error",
        "no-useless-computed-key": "error",
        "no-useless-constructor": "error",
        "no-useless-rename": "error",
        // varではなくlet か constを要求する
        "no-var": "error",
        "object-shorthand": "error",
        "prefer-arrow-callback": "error",
        "prefer-const": "error",
        "prefer-rest-params": "error",
        "prefer-spread": "error",
        "prefer-template": "error",
        "rest-spread-spacing": "error",
        "template-curly-spacing": "error",
        "yield-star-spacing": "error"
    }
};