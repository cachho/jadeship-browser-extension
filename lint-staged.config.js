module.exports = {
  "*.{js,ts}": ["biome lint --write --staged", "biome lint --staged"],
  "**/*.ts?(x)": () => "npm run check-types",
  "*.json": ["prettier --write"],
};
