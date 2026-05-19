import { resolveHttpStatusText } from "../lib/api/getConvertDecrypt";

describe("resolveHttpStatusText", () => {
  test("returns non-empty response status text unchanged", () => {
    expect(resolveHttpStatusText(429, "Custom Limit Message")).toBe(
      "Custom Limit Message",
    );
  });

  test("falls back to standard status text for known HTTP codes", () => {
    expect(resolveHttpStatusText(429, "")).toBe("Too Many Requests");
  });

  test("falls back to Unknown Error for unknown HTTP codes", () => {
    expect(resolveHttpStatusText(599, "")).toBe("Unknown Error");
  });
});
