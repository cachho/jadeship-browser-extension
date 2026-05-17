module.exports = {
  "*.{js,ts}": ["biome lint --fix", "biome lint"],
  "**/*.ts?(x)": () => "npm run check-types",
  "*.json": ["prettier --write"],
};
