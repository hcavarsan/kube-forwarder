module.exports = {
	root: true,
	parserOptions: {
		parser: "@babel/eslint-parser",
	  sourceType: 'module'
	},
	env: {
	  browser: true,
	  node: true,
	  "cypress/globals": true
	},
	extends: [
	  'standard',
	  'plugin:vue/recommended'
	],
	globals: {
	  __static: true
	},
	plugins: [
	  'vue',
	  "cypress"
	],
	'rules': {
	  // allow paren-less arrow functions
	  'arrow-parens': 0,
	  // allow async-await
	  'generator-star-spacing': 0,
	  // allow debugger during development
	  'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0,
	  'max-len': [2, 120],

	  'space-before-function-paren': [2, {
		"anonymous": "never",
		"named": "never",
		"asyncArrow": "always"
	  }], // was always
	  'node/no-path-concat': 'off',
	  'vue/no-reserved-component-names': 'off',
	  'vue/multi-word-component-names': 'off',
	  'vue/require-default-prop': 2, // was 1
	  'vue/order-in-components': 2, // was 1
	  'vue/max-attributes-per-line': 0, // was 1
	  'vue/singleline-html-element-content-newline': 0 // was 1
	}
  }
