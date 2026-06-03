import { readFileSync } from "node:fs";

describe("popup behavior source checks", () => {
  const popupSource = readFileSync(
    new URL("../components/Popup.tsx", import.meta.url),
    {
      encoding: "utf-8",
    },
  );

  test("toolbar agent options include raw for toggling", () => {
    expect(popupSource).toContain(
      'const toolbarAgentOptions = [...sortedAgents, "raw"]',
    );
    expect(popupSource).toContain("toolbarAgentOptions.map((agent) =>");
  });

  test("uses static agent logos in my agent and toolbar sections", () => {
    expect(popupSource).toContain("public/agent_logos/");
    expect(popupSource).toContain("_logo.png`");
    expect(popupSource).toContain("const myAgentLogoSrc =");
    expect(popupSource).toContain("custom-select-options");
    expect(popupSource).toContain("custom-select-option-logo");
    expect(popupSource).toContain("optionLogoSrc && (");
    expect(popupSource).toContain('agent !== "raw" && (');
  });
});
