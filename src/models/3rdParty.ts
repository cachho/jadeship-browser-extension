export const thirdParties = ['yupoo.com'] as const;

export type ThirdParty = (typeof thirdParties)[number];
