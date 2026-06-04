import { getStorage } from "./storage";

export const CONVERSION_STATS_STORAGE_KEY = "conversionStats";

export type ConversionStats = {
  onPage: number;
  toolbar: number;
  updatedAt: number;
};

const defaultConversionStats: ConversionStats = {
  onPage: 0,
  toolbar: 0,
  updatedAt: 0,
};

function parseNonNegativeInteger(value: unknown): number {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    return 0;
  }
  return Math.max(0, Math.floor(value));
}

export function getConversionStatsFromStorageValue(
  value: unknown,
): ConversionStats {
  const stored = value as Partial<ConversionStats> | undefined;
  return {
    onPage: parseNonNegativeInteger(stored?.onPage),
    toolbar: parseNonNegativeInteger(stored?.toolbar),
    updatedAt: parseNonNegativeInteger(stored?.updatedAt),
  };
}

export async function incrementConversionStat(
  key: keyof Pick<ConversionStats, "onPage" | "toolbar">,
  amount = 1,
): Promise<void> {
  if (!Number.isFinite(amount) || amount <= 0) {
    return;
  }
  const storage = getStorage();
  if (!storage) {
    return;
  }
  const result = await storage.local.get(CONVERSION_STATS_STORAGE_KEY);
  const current = getConversionStatsFromStorageValue(
    result[CONVERSION_STATS_STORAGE_KEY],
  );
  const next = {
    ...defaultConversionStats,
    ...current,
    [key]: current[key] + Math.floor(amount),
    updatedAt: Date.now(),
  };
  await storage.local.set({ [CONVERSION_STATS_STORAGE_KEY]: next });
}
