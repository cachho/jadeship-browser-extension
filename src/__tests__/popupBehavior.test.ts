import { readFileSync } from "node:fs";

describe("popup behavior source checks", () => {
  const popupSource = readFileSync(
    new URL("../components/Popup.tsx", import.meta.url),
    {
      encoding: "utf-8",
    },
  );
  const popupSectionsSource = readFileSync(
    new URL("../components/popup/PopupSections.tsx", import.meta.url),
    {
      encoding: "utf-8",
    },
  );

  test("toolbar agent options include raw for toggling", () => {
    expect(popupSource).toContain(
      'const toolbarAgentOptions = [...sortedAgents, "raw"]',
    );
    expect(popupSectionsSource).toContain(
      "visibleToolbarAgentOptions.map((agent) =>",
    );
  });

  test("can hide legacy agents from interface while keeping support", () => {
    expect(popupSectionsSource).toContain(
      "Hide agents that are no longer operational",
    );
    expect(popupSectionsSource).toContain(
      "Legacy agents remain fully supported and can still process links; this only hides them from the interface.",
    );
    expect(popupSource).toContain("settings.hideLegacyAgents");
    expect(popupSource).toContain("LEGACY_AGENTS_STORAGE_KEY");
  });

  test("uses static agent logos in my agent and toolbar sections", () => {
    expect(popupSource).toContain("public/agent_logos/");
    expect(popupSource).toContain("_logo.png`");
    expect(popupSource).toContain("const myAgentLogoSrc =");
    expect(popupSectionsSource).toContain("custom-select-options");
    expect(popupSectionsSource).toContain("custom-select-option-logo");
    expect(popupSectionsSource).toContain("optionLogoSrc && (");
    expect(popupSectionsSource).toContain('agent !== "raw" && (');
  });
});
