/* eslint-disable @typescript-eslint/no-require-imports */
const autoprefixer = require('autoprefixer');
const postcssPresetEnv = require('postcss-preset-env');

const config = {
	plugins: [postcssPresetEnv(), autoprefixer()],
};

module.exports = config;
