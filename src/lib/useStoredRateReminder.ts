import { useCallback, useState } from "react";

import {
  deferRateReminder,
  getRateReminderState,
  RATE_REMINDER_STORAGE_KEY,
  type RateReminderState,
  shouldShowRateReminder,
} from "./rateReminder";
import { isChromeStorage } from "./storage";

export function useStoredRateReminder(
  storage: typeof browser.storage | typeof chrome.storage | null,
) {
  const [rateReminder, setRateReminder] = useState<RateReminderState | null>(
    null,
  );

  const saveRateReminder = useCallback(
    (nextRateReminder: RateReminderState) => {
      setRateReminder(nextRateReminder);
      if (isChromeStorage(storage)) {
        storage.local.set({ [RATE_REMINDER_STORAGE_KEY]: nextRateReminder });
      } else {
        storage?.local.set({ [RATE_REMINDER_STORAGE_KEY]: nextRateReminder });
      }
    },
    [storage],
  );

  const setRateReminderFromStorageValue = useCallback(
    (rateReminderData: unknown) => {
      const storedRateReminder = getRateReminderState(rateReminderData);
      if (storedRateReminder) {
        setRateReminder(storedRateReminder);
        return;
      }

      const initialRateReminder = deferRateReminder();
      setRateReminder(initialRateReminder);
      saveRateReminder(initialRateReminder);
    },
    [saveRateReminder],
  );

  return {
    rateReminder,
    saveRateReminder,
    setRateReminderFromStorageValue,
    showRateReminder: shouldShowRateReminder(rateReminder),
  };
}
