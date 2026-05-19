import {
  replaceTextContent,
  shouldReplaceLinkText,
} from "../lib/html/replaceTextContent";
import { defaultSettings } from "../models/Settings";

describe("shouldReplaceLinkText", () => {
  test("matches protocol-less Reddit url text", () => {
    expect(
      shouldReplaceLinkText("item.taobao.com/item.htm?id=123", "taobao"),
    ).toBe(true);
  });

  test("does not replace descriptive link labels", () => {
    expect(shouldReplaceLinkText("seller album", "taobao")).toBe(false);
  });
});

describe("replaceTextContent", () => {
  test("replaces protocol-less Reddit url text with the selected agent label", () => {
    const link = {
      textContent: "item.taobao.com/item.htm?id=123",
    } as HTMLAnchorElement;

    expect(
      replaceTextContent(defaultSettings, link, null, "cnfans", "taobao"),
    ).toBe("cnfans link");
  });
});
