import { readFileSync } from "node:fs";

describe("toolbar behavior source checks", () => {
  const toolbarSource = readFileSync(
    new URL("../toolbar.ts", import.meta.url),
    {
      encoding: "utf-8",
    },
  );

  test("agent logos use each specific converted link", () => {
    expect(toolbarSource).toContain("const hrefValue = convertedLinks[agent];");
  });

  test("failed convert-decrypt shows explicit error message and faster auto-hide", () => {
    expect(toolbarSource).toMatch(
      /Failed to get converted links \(Error \$\{error\.status\}: \$\{error\.statusText\}\)\./,
    );
    expect(toolbarSource).toMatch(/convertErrorMessage \? 900 : 1500/);
  });

  test("raw toolbar entry renders marketplace icon", () => {
    expect(toolbarSource).toContain('agent === "raw" && cnLink?.marketplace');
    expect(toolbarSource).toContain("getPlatformImage(cnLink.marketplace)");
  });
});
