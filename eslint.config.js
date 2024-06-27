export default [
  {
    languageOptions: {
      globals: {
        console: "readonly",
        setTimeout: "readonly",
        process: "readonly",
        __filename: "readonly",
        __dirname: "readonly",
      }
    },
    rules: {
      'no-unused-vars': 'error',
      'no-undef': 'error',
      'no-unsafe-optional-chaining': "error",
      'func-style': ["error", "expression"],
      semi: ["error", "always"],
      camelcase: ["error", {"properties": "always", "ignoreDestructuring": true}]
    }
  }
];