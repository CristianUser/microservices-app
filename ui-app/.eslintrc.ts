// eslint-disable-next-line import/no-anonymous-default-export
export default {
  extends: [
    "airbnb-typescript",
    "prettier/@typescript-eslint", // Uses eslint-config-prettier to disable ESLint rules from @typescript-eslint/eslint-plugin that would conflict with prettier
    "plugin:prettier/recommended"
  ],
  plugins: ["@typescript-eslint"],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: ["./tsconfig.json"], //required for "type-aware linting"
  },
  rules: {
    "import/no-unresolved": 0,
    "react/jsx-filename-extension": [
      1,
      {
        extensions: [".jsx", ".tsx"],
      },
    ],
  },
  settings: {
    "import/resolver": {
      webpack: {
        config: "webpack.config.js",
      },
    },
  },
};
