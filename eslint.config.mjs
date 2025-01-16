import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";
import eslintJs from "@eslint/js";
const { recommended } = eslintJs;

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: recommended,
});

const eslintConfig = [
  ...compat.config({
    extends: ["next", "next/typescript", "next/core-web-vitals"],
  }),
];

export default eslintConfig;
