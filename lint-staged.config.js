module.exports = {
  "*.{js,ts}": ["biome lint --write", "biome lint"],
  "**/*.ts?(x)": () => "npm run check-types",
  "*.json": ["prettier --write"],
};
