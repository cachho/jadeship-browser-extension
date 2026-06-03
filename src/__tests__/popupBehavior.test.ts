import { readFileSync } from "node:fs";

describe("popup behavior source checks", () => {
  const popupSource = readFileSync(
    new URL("../components/Popup.tsx", import.meta.url),
    {
      encoding: "utf-8",
    },
  );
  const rateReminderCardSource = readFileSync(
    new URL("../components/RateReminderCard.tsx", import.meta.url),
    {
      encoding: "utf-8",
    },
  );
  const storedRateReminderSource = readFileSync(
    new URL("../lib/useStoredRateReminder.ts", import.meta.url),
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

  test("shows a delayed rate reminder with defer and disable actions", () => {
    expect(popupSource).toContain("useStoredRateReminder(storage)");
    expect(popupSource).toContain("<RateReminderCard");
    expect(storedRateReminderSource).toContain(
      "showRateReminder: shouldShowRateReminder(rateReminder)",
    );
    expect(rateReminderCardSource).toContain("Enjoying JadeShip?");
    expect(rateReminderCardSource).toContain("Rate now");
    expect(rateReminderCardSource).toContain("Maybe later");
    expect(rateReminderCardSource).toContain("Not interested");
    expect(rateReminderCardSource).toContain(
      "Config.social.rateExtensionFirefox",
    );
    expect(rateReminderCardSource).toContain(
      "Config.social.rateExtensionChrome",
    );
    expect(popupSource).toContain("saveRateReminder(deferRateReminder())");
    expect(popupSource).toContain(
      "saveRateReminder(disableRateReminder(rateReminder))",
    );
  });
});
