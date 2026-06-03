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

  test("sets uninstall page url from config", () => {
    expect(backgroundSource).toContain("runtime.setUninstallURL");
    expect(backgroundSource).toContain("Config.social.uninstall");
  });

  test("includes browser user-agent in uninstall URL", () => {
    expect(backgroundSource).toContain("navigator.userAgent");
    expect(backgroundSource).toContain('"ua"');
  });

  test("includes extension version in uninstall URL", () => {
    expect(backgroundSource).toContain("getManifest().version");
    expect(backgroundSource).toContain('"v"');
  });

  test("includes install time in uninstall URL", () => {
    expect(backgroundSource).toContain("INSTALL_TIME_STORAGE_KEY");
    expect(backgroundSource).toContain('"installTime"');
  });

  test("sets uninstall URL after initializeExtension to ensure installTime is persisted", () => {
    // addUninstallListener must be called inside the .finally() block
    const finallyBlock = backgroundSource.slice(
      backgroundSource.indexOf(".finally("),
    );
    expect(finallyBlock).toContain("addUninstallListener");
  });
});
