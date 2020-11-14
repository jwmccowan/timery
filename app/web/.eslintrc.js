// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require('path');

module.exports = {
  extends: ['airbnb-typescript-prettier'],
  parserOptions: {
    tsconfigRootDir: __dirname,
    project: [path.join(__dirname, 'tsconfig.eslint.json')],
  },
  root: true,
};
