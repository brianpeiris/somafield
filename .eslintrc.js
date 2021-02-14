module.exports = {
	plugins: ['prettier'],
	extends: ['prettier', 'eslint:recommended'],
	parserOptions: {
		sourceType: 'module',
	},
	env: {
		browser: true,
		es2020: true,
	},
	rules: {
		'prettier/prettier': 'error',
		'no-use-before-define': 'error',
		'no-var': 'error',
		'prefer-const': 'error',
	},
};
