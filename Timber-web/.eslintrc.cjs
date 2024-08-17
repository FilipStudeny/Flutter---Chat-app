const fs = require("fs");
const path = require("path");

const prettierOptions = JSON.parse(fs.readFileSync(path.resolve(__dirname, ".prettierrc.json"), "utf8"));

module.exports = {
	root: true,
	env: { browser: true, es2021: true, es6: true },
	overrides: [
		{
			files: ["**/*.ts?(x)"],
			rules: {
				"@typescript-eslint/explicit-function-return-type": "off",
				"max-lines": "off",
				"max-lines-per-function": "off",
				"no-magic-numbers": "off",
				"react/jsx-key": "off",
				"react/jsx-props-no-spreading": "off",
				"no-undef": "off",
			},
		},
	],
	extends: [
		"eslint:recommended",
		"plugin:@typescript-eslint/recommended",
		"plugin:react-hooks/recommended",
		"airbnb",
		"prettier",
	],
	ignorePatterns: ["dist", ".eslintrc.cjs"],
	parser: "@typescript-eslint/parser",
	parserOptions: {
		ecmaFeatures: {
			jsx: true,
		},
		ecmaVersion: "latest",
		sourceType: "module",
	},
	plugins: ["react-refresh", "prettier", "unused-imports", "jsx-a11y"],
	settings: {
		"import/resolver": {
			node: {
				extensions: [".js", ".jsx", ".ts", ".tsx"],
				moduleDirectory: ["src", "node_modules"],
			},
		},
	},
	rules: {
		"react-refresh/only-export-components": ["warn", { allowConstantExport: true }],
		"@typescript-eslint/no-non-null-assertion": "error",
		"react/react-in-jsx-scope": "off",
		"react/function-component-definition": [2, { namedComponents: "arrow-function" }],
		"prettier/prettier": ["warn", {prettierOptions}],
		"@typescript-eslint/no-explicit-any": "off",
		"react-hooks/exhaustive-deps": "off",
		"no-unused-vars": "off",
		"no-use-before-define": "off",
		"import/prefer-default-export": 1,
		"import/no-default-export": 0,
		"@typescript-eslint/no-use-before-define": ["error"],
		"import/no-unresolved": "off",
		"react/require-default-props": "off",
		"react/jsx-wrap-multilines": "off",
		"@typescript-eslint/no-empty-interface": "off",
		"no-shadow": "off",
		"react/prop-types": "off",
		"@typescript-eslint/no-shadow": "off",
		"react/jsx-filename-extension": [1, { extensions: [".tsx", ".ts"] }],
		"no-loop-func": "off",
		"unused-imports/no-unused-imports": "error",
		"jsx-a11y/control-has-associated-label": "off",
		"jsx-a11y/label-has-associated-control": "off",
		"jsx-a11y/click-events-have-key-events": "off",
		"no-param-reassign": "off",
		"no-nested-ternary": "off",
		"import/no-extraneous-dependencies": "off",
		"jsx-a11y/no-noninteractive-element-interactions": "off",
		"unused-imports/no-unused-vars": [
			"warn",
			{
				vars: "all",
				varsIgnorePattern: "^_",
				args: "after-used",
				argsIgnorePattern: "^_",
			},
		],
		'import/extensions': [
			'error',
			'ignorePackages',
			{
				js: 'never',
				jsx: 'never',
				ts: 'never',
				tsx: 'never', 
			},
		],
		"import/order": [
			"warn",
			{
				groups: [["builtin", "external"], "internal", ["parent", "sibling", "index"], "object", "type"],
				"newlines-between": "always",
				alphabetize: {
					order: "asc",
				},
				pathGroups: [
					{
						pattern: "./**/*.less",
						group: "object",
					},
					{
						pattern: "**/*.less",
						group: "object",
					},
					{
						pattern: "./**/*.{jpg,jpeg,png,gif,svg,ico}",
						group: "type",
					},
					{
						pattern: "**/*.{jpg,jpeg,png,gif,svg,ico}",
						group: "type",
					},
				],
			},
		],
	},
};
