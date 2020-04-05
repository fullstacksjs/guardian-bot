module.exports = {
  root: true,
  extends: ['@frontendmonster'],
  parserOptions: {
    project: './tsconfig.eslint.json',
  },
  rules: {
    'babel/camelcase': 0, // telegraf context is snake_case so we'll follow that convention
  },
};
