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
        "no-console": "off",
        "vue/html-indent": ["error", 4, {
            "attribute": 1,
            "baseIndent": 1,
            "closeBracket": 0,
            "alignAttributesVertically": true,
            "ignores": []
        }],
        "vue/script-indent": [
            "warn",
            4,
            {
                baseIndent: 0
            }
        ],
        "vue/style-indent": [
            "warn",
            4,
            {
                baseIndent: 0
            }
        ],
        "vue/prop-name-casing": 0,
        "vue/html-self-closing": ["error", {
            "html": {
                "void": "never",
                "normal": "always",
                "component": "always"
            },
            "svg": "always",
            "math": "always"
        }],
        "vue/max-attributes-per-line": ["error", {
            "singleline": 1,
            "multiline": {
                "max": 1,
                "allowFirstLine": false
            }
        }],
        "semi": ["error", "always"],
        "block-spacing": ["error", "always"],
        "comma-dangle": ["error", "always"],
        "max-len": ["warn", 120],
        // "indent": ["error", 4],
        "multiline-ternary": ["error", "always"],
        "object-curly-spacing": ["error", "always"]
    },
};