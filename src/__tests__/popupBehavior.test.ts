import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

describe("popup behavior source checks", () => {
  const popupSource = readFileSync(
    new URL("../components/Popup.tsx", import.meta.url),
    {
      encoding: "utf-8",
    },
  );
  const popupSectionsDirectory = new URL(
    "../components/popup",
    import.meta.url,
  );
  const popupSectionsSource = readdirSync(popupSectionsDirectory)
    .filter((fileName) => fileName.endsWith(".tsx"))
    .map((fileName) =>
      readFileSync(join(popupSectionsDirectory.pathname, fileName), {
        encoding: "utf-8",
      }),
    )
    .join("\n");

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
