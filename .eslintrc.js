module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    'airbnb-base',
  ],
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'module',
  },
  rules: {
    indent: [0, 'tab'],
    'no-tabs': 0,
    'no-shadow': 0,
    'no-plusplus': 0,
    'no-else-return': 0,
    'no-param-reassign': 0,
    'func-names': 0,
    'max-len': [2, { code: 300, tabWidth: 4, ignoreUrls: true }],
    'no-console': 0,
    'new-cap': 0,
    'no-underscore-dangle': 0,
  },
};
