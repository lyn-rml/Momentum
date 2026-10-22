export default {
  'src/**/*.{ts,html}': ['eslint --fix --max-warnings=0', 'prettier --write'],
  '*.{js,cjs,mjs,json,jsonc,css,scss,md,yml,yaml}': 'prettier --write',
};
