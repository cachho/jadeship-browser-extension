import { describe, expect, test } from "bun:test";

import {
  createRateReminderState,
  deferRateReminder,
  disableRateReminder,
  getRateReminderState,
  RATE_REMINDER_DELAY_MS,
  shouldShowRateReminder,
} from "../lib/rateReminder";

describe("rate reminder helpers", () => {
  test("creates and defers reminder state by 24 hours", () => {
    const now = 1_700_000_000_000;

    expect(createRateReminderState(now)).toEqual({
      disabled: false,
      nextPromptAt: now + RATE_REMINDER_DELAY_MS,
    });
    expect(deferRateReminder(now)).toEqual({
      disabled: false,
      nextPromptAt: now + RATE_REMINDER_DELAY_MS,
    });
  });

  test("shows reminder only when enabled and due", () => {
    const now = 1_700_000_000_000;

    expect(
      shouldShowRateReminder(
        {
          disabled: false,
          nextPromptAt: now - 1,
        },
        now,
      ),
    ).toBe(true);
    expect(
      shouldShowRateReminder(
        {
          disabled: false,
          nextPromptAt: now + 1,
        },
        now,
      ),
    ).toBe(false);
    expect(
      shouldShowRateReminder(
        {
          disabled: true,
          nextPromptAt: now - 1,
        },
        now,
      ),
    ).toBe(false);
  });

  test("parses valid storage data and rejects invalid values", () => {
    expect(
      getRateReminderState({
        disabled: false,
        nextPromptAt: 123,
      }),
    ).toEqual({
      disabled: false,
      nextPromptAt: 123,
    });
    expect(getRateReminderState(null)).toBeNull();
    expect(getRateReminderState({ disabled: "nope", nextPromptAt: 123 })).toBe(
      null,
    );
    expect(getRateReminderState({ disabled: false, nextPromptAt: "123" })).toBe(
      null,
    );
  });

  test("can disable reminder permanently", () => {
    expect(
      disableRateReminder({
        disabled: false,
        nextPromptAt: 456,
      }),
    ).toEqual({
      disabled: true,
      nextPromptAt: 456,
    });
  });
});
