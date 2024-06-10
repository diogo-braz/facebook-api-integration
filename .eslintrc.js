/* eslint-env node */
module.exports = {
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended-type-checked",
    "plugin:@typescript-eslint/stylistic-type-checked"
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: ["./tsconfig.json", "./tsconfig-lint.json"]
  },
  plugins: ["@typescript-eslint"],
  root: true,
  rules: {
    "no-undef": "off",
    "@typescript-eslint/no-namespace": "off",
    "@typescript-eslint/no-unused-vars": "off",
    "@typescript-eslint/no-explicit-any": "off",
    "@typescript-eslint/quotes": ["error", "double"],
    "@typescript-eslint/semi": "error",
    "@typescript-eslint/space-before-function-paren": "error",
    "@typescript-eslint/no-extra-semi": "error",
    "@typescript-eslint/object-curly-spacing": ["error", "always"],
    "@typescript-eslint/comma-dangle": ["error", "never"],
    "@typescript-eslint/consistent-type-definitions": "off"
  }
};
