module.exports = {
    "env": {
        "browser": true,
        "es6": true,
        "node": true
    },
    "extends": [
        "eslint:recommended",
        "plugin:vue/essential"
    ],
    "globals": {
        "Atomics": "readonly",
        "SharedArrayBuffer": "readonly"
    },
    "parser": "vue-eslint-parser",
    "parserOptions": {
        "ecmaVersion": 2018,
        "sourceType": "module"
    },
    "plugins": [
        "vue",
        "import",
        "html",
        "json"
    ],
    "rules": {
        "vue/html-indent": ["error", 4, {
            "attribute": 1,
            "baseIndent": 1,
            "closeBracket": 0,
            "alignAttributesVertically": true,
            "ignores": []
          }],
        "vue/prop-name-casing": 0,
        "vue/multiline-html-element-content-newline": ["error", {
            "ignoreWhenEmpty": false,
            "ignores": ["pre", "textarea"]
        }],
        "vue/singleline-html-element-content-newline": ["error", {
            "ignoreWhenNoAttributes": false,
            "ignoreWhenEmpty": false,
            "ignores": ["pre", "textarea"]
        }],
        "vue/html-self-closing": ["error", {
            "html": {
                "void": "never",
                "normal": "always",
                "component": "always"
            },
            "svg": "always",
            "math": "always"
        }],
        "semi": ["error", "always"],
        "block-spacing": ["error", "always"],
        "comma-dangle": ["error", "always"],
        "max-len": ["error", 120],
        "indent": ["error", 4],
        "multiline-ternary": ["error", "always"],
        "object-curly-spacing": ["error", "always"]
    }
};