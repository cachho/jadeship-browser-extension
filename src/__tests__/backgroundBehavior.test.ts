import { readFileSync } from "node:fs";

describe("background behavior source checks", () => {
  const backgroundSource = readFileSync(
    new URL("../background.ts", import.meta.url),
    {
      encoding: "utf-8",
    },
  );

  test("opens new-installation page on extension install", () => {
    expect(backgroundSource).toContain("runtime.onInstalled.addListener");
    expect(backgroundSource).toContain('details.reason !== "install"');
    expect(backgroundSource).toContain("Config.social.newInstallation");
  });

  test("stores the delayed rate reminder state on extension install", () => {
    expect(backgroundSource).toContain("RATE_REMINDER_STORAGE_KEY");
    expect(backgroundSource).toContain("createRateReminderState()");
    expect(backgroundSource).toContain("storage.local.set");
  });
});
