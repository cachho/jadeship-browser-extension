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
});
