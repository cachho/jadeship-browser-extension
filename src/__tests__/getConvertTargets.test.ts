import { getConvertTargets } from "../lib/getConvertTargets";

describe("getConvertTargets", () => {
  test("adds the selected page agent when it is missing from the toolbar list", () => {
    expect(getConvertTargets("cnfans", ["superbuy", "allchinabuy"])).toEqual([
      "superbuy",
      "allchinabuy",
      "cnfans",
    ]);
  });

  test("does not duplicate an agent already present in the toolbar list", () => {
    expect(getConvertTargets("cnfans", ["superbuy", "cnfans"])).toEqual([
      "superbuy",
      "cnfans",
    ]);
  });

  test("keeps raw mode limited to the toolbar agent targets", () => {
    expect(getConvertTargets("raw", ["superbuy", "allchinabuy"])).toEqual([
      "superbuy",
      "allchinabuy",
    ]);
  });
});
