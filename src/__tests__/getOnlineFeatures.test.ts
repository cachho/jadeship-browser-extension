import { readFileSync } from "node:fs";

describe("getOnlineFeatures source checks", () => {
  const source = readFileSync(
    new URL("../lib/api/getOnlineFeatures.ts", import.meta.url),
    "utf-8",
  );

  test("details fetch depends only on onlineFeatures", () => {
    expect(source).toMatch(
      /settings\.onlineFeatures\s+\? getDetails\(cnLink\)/,
    );
  });

  test("qc fetch still depends on qc photo setting", () => {
    expect(source).toContain(
      "settings.onlineFeatures && settings.onlineFeaturesQcPhotos",
    );
  });
});
