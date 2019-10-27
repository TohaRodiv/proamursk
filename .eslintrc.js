module.exports = {
    "env": {
        "browser": true,
        "es6": true,
        "node": true
    },
    "extends": [
        "eslint:recommended",
        "plugin:vue/base",
        "plugin:vue/essential",
        "plugin:vue/strongly-recommended",
        "plugin:vue/recommended"
    ],
    "globals": {
        "Atomics": "readonly",
        "SharedArrayBuffer": "readonly"
    },
    "parser": "vue-eslint-parser",
    "parserOptions": {
        "ecmaVersion": 2018,
        "sourceType": "module",
    },
    "plugins": [
        "vue",
        "import",
        "html",
        "json"
    ],
    "rules": {
        "no-console": "off",
        "vue/html-indent": ["error", 4, {
            "attribute": 1,
            "baseIndent": 1,
            "closeBracket": 0,
            "alignAttributesVertically": true,
            "ignores": []
        }],
        "semi": ["error", "always"],
        "comma-dangle": ["error", "always"],
        "max-len": ["warn", 120],
        "indent": ["error", 4],
    },
};