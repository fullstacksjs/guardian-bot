module.exports = {
  root: true,
  extends: ['@frontendmonster'],
  parserOptions: {
    project: './tsconfig.json',
  },
  rules: {
    'babel/camelcase': 0, // telegraf context is snake_case so we'll follow that convention
    '@typescript-eslint/strict-boolean-expressions': ['off', { allowNullable: true, allowSafe: true, ignoreRhs: true }],
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-unnecessary-condition': 'off',
    '@typescript-eslint/no-floating-promises': ['error', { ignoreVoid: true }],
    'no-void': 'off',
    '@typescript-eslint/restrict-template-expressions': 'off',

  },
};
