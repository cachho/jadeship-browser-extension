import { readFileSync } from "node:fs";

describe("content script behavior source checks", () => {
  const contentScriptSource = readFileSync(
    new URL("../content_script.ts", import.meta.url),
    {
      encoding: "utf-8",
    },
  );

  test("counts successful reddit and yupoo conversions", () => {
    expect(contentScriptSource).toContain(
      'currentUrl.hostname === "www.reddit.com"',
    );
    expect(contentScriptSource).toContain(
      'currentUrl.hostname === "yupoo.com"',
    );
    expect(contentScriptSource).toContain(
      'currentUrl.hostname.endsWith(".yupoo.com")',
    );
    expect(contentScriptSource).toContain('incrementConversionStat("onPage")');
  });
});
