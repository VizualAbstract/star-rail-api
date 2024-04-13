module.exports = {
  printWidth: 100,
  singleQuote: true, // Use single quotes by default
  jsxSingleQuote: false, // JSX wll use double quotes
  trailingComma: 'all',
  bracketSpacing: true,
  tabWidth: 2,
  overrides: [
    {
      files: '*.json',
      options: { "singleQuote": false }
    },
    {
      files: '*.cjs',
      options: { "singleQuote": true }
    }
  ]
};
