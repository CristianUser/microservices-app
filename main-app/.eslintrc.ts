export default {
  extends: [
    "airbnb-typescript/base",
    "prettier/@typescript-eslint",
    "plugin:prettier/recommended"
  ],
  plugins: ["@typescript-eslint"],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: ["./tsconfig.json"], //required for "type-aware linting"
  },
  rules: {
    "import/no-unresolved": 0,
  }
};
