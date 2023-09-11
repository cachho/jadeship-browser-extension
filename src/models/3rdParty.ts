export const thirdParty = ['yupoo.com'] as const;

export type ThirdParty = (typeof thirdParty)[number];
