import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import _import from "eslint-plugin-import";
import jest from "eslint-plugin-jest";
import unicorn from "eslint-plugin-unicorn";
import globals from "globals";

export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  {
    ignores: [
      "**/dist/",
      "**/node_modules/",
      ".hass_dev/*",
      "**/package-lock.json",
      "**/package.json",
      "rollup.config.mjs",
      "rollup-plugins/*.js"
    ],
  },
  {
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  {
    plugins: {
      import: _import,
      unicorn,
    },
    rules: {
      "unicorn/filename-case": [
        "error",
        {
          "cases": {
            "camelCase": true,
            "kebabCase": true
          }
        }
      ],
      "@typescript-eslint/naming-convention": ["error", {
        selector: ["variableLike", "memberLike"],
        format: ["strictCamelCase", "StrictPascalCase", "snake_case", "UPPER_CASE"],
        filter: {
          regex: "^__html$",
          match: false,
        },
      }, {
        selector: ["typeLike"],
        format: ["StrictPascalCase"],
      }, {
        selector: ["typeParameter"],
        format: ["StrictPascalCase"],
        prefix: ["T"],
      }],

      "@typescript-eslint/explicit-function-return-type": ["off"],

      "import/no-duplicates": ["error", {
        "prefer-inline": false,
      }],

      "no-duplicate-imports": "off",
      "sort-imports": "off",
      "import/group-exports": "error",
      "import/exports-last": "error",
      "import/consistent-type-specifier-style": ["error", "prefer-top-level"],

      "import/order": ["error", {
        "newlines-between": "always",
        alphabetize: {
          order: "ignore",
          orderImportKind: "desc",
        },
        groups: [
          ["index", "sibling", "parent", "internal", "external", "builtin", "object"],
          "type",
        ],
      }],

      "@typescript-eslint/no-empty-object-type": "off",
      "@typescript-eslint/no-explicit-any": "off",
      "no-useless-assignment": "off",
    },
    linterOptions: {
      reportUnusedDisableDirectives: false
    }
  },
  {
    files: [
      "./src/*.test.ts",
      "./src/*.*.test.ts",
    ],
    plugins: {
      jest,
    },
    languageOptions: {
      globals: {
        ...globals.node,
        ...jest.environments.globals.globals,
      },
    },
    rules: {
      ...jest.configs['flat/recommended'].rules,
    }
  }
);