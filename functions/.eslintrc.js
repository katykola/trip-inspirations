import js from "@eslint/js";
import ts from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";

export default [
  js.configs.recommended, 
  // ts.configs.recommended, 
  {
    languageOptions: {
      parser: tsParser,
      sourceType: "module",
    },
    plugins: {
      import: importPlugin,
      "@typescript-eslint": ts,
    },
    rules: {
      "quotes": ["error", "double"],
      "import/no-unresolved": "off",
      "indent": ["error", 2],
    },
  },
];

