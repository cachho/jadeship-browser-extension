export const RATE_REMINDER_STORAGE_KEY = "rateReminder";
export const RATE_REMINDER_DELAY_MS = 24 * 60 * 60 * 1000;

export type RateReminderState = {
  disabled: boolean;
  nextPromptAt: number;
};

export function createRateReminderState(now = Date.now()): RateReminderState {
  return {
    disabled: false,
    nextPromptAt: now + RATE_REMINDER_DELAY_MS,
  };
}

export function getRateReminderState(value: unknown): RateReminderState | null {
  const reminder = value as Partial<RateReminderState> | undefined;
  if (
    typeof reminder?.disabled !== "boolean" ||
    typeof reminder.nextPromptAt !== "number" ||
    !Number.isFinite(reminder.nextPromptAt)
  ) {
    return null;
  }

  return {
    disabled: reminder.disabled,
    nextPromptAt: reminder.nextPromptAt,
  };
}

export function shouldShowRateReminder(
  reminder: RateReminderState | null,
  now = Date.now(),
): boolean {
  if (!reminder || reminder.disabled) {
    return false;
  }

  return reminder.nextPromptAt <= now;
}

export function deferRateReminder(now = Date.now()): RateReminderState {
  return createRateReminderState(now);
}

export function disableRateReminder(
  reminder: RateReminderState | null,
): RateReminderState {
  return {
    disabled: true,
    nextPromptAt: reminder?.nextPromptAt ?? Date.now(),
  };
}
