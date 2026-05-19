import { describe, expect, it } from "bun:test";

import { getToolbarDisplayState } from "../lib/toolbar/getToolbarDisplayState";

describe("getToolbarDisplayState", () => {
  it("keeps toolbar body visible when collapsed but convert-decrypt failed", () => {
    expect(getToolbarDisplayState(true, "Failed to fetch convert-decrypt.")).toEqual({
      isErrorState: true,
      isBodyHidden: false,
    });
  });

  it("hides toolbar body when collapsed with no convert-decrypt error", () => {
    expect(getToolbarDisplayState(true, null)).toEqual({
      isErrorState: false,
      isBodyHidden: true,
    });
  });
});
