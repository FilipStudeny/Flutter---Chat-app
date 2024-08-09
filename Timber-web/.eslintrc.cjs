const fs = require("fs");
const path = require("path");

const prettierOptions = JSON.parse(fs.readFileSync(path.resolve(__dirname, ".prettierrc.json"), "utf8"));

module.exports = {
	root: true,
	env: { browser: true, es2020: true },
	extends: ["eslint:recommended", "plugin:@typescript-eslint/recommended", "plugin:react-hooks/recommended"],
	ignorePatterns: ["dist", ".eslintrc.cjs"],
	parser: "@typescript-eslint/parser",
	plugins: ["react-refresh"],
	rules: {
		"react-refresh/only-export-components": ["warn", { allowConstantExport: true }],
	},
};
