module.exports = {
  // https://eslint.org/docs/rules/no-undef#nodejs
  env: {
    browser: true,
    es2021: true,
    node: true
  },
  parser: 'vue-eslint-parser',
  // https://github.com/vuejs/vue-eslint-parser#parseroptionsparser
  parserOptions: {
    ecmaVersion: 2021
  },
  plugins: ['@typescript-eslint', 'jest'],
  extends: [
    'eslint:recommended',
    'plugin:vue/vue3-recommended',
    '@vue/typescript/recommended',
    'plugin:jest/recommended',
    '@vue/prettier',
    '@vue/prettier/@typescript-eslint'
  ],
  overrides: [
    {
      files: ['**/__tests__/*.{j,t}s?(x)', '**/tests/unit/**/*.spec.{j,t}s?(x)'],
      env: {
        jest: true
      }
    }
  ],
  rules: {
    '@typescript-eslint/ban-types': 'off',
    '@typescript-eslint/no-explicit-any': 'off'
  }
}
