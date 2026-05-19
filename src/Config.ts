export const Config = {
  defaultToolbarAgentsCount: 5,
  name: "JadeShip.com",
  endpoint: {
    affiliateLinks: "https://www.jadeship.com/api/agents/affiliate-links",
    convertDecrypt:
      "https://www.jadeship.com/api/quota-limited/extension/v2/convert-decrypt/multi",
    qc: "https://www.jadeship.com/api/quota-limited/extension/v2/qc",
    details: "https://www.jadeship.com/api/quota-limited/extension/v2/details",
    defaults: {
      agent:
        "https://www.jadeship.com/api/quota-limited/extension/v2/default/agent",
    },
  },
  social: {
    homepage: "https://www.jadeship.com/?r=extension",
    bestAgent: "https://www.jadeship.com/shipping-calculator?r=extension",
  },
  legal: {
    main: {
      tos: "https://www.jadeship.com/tos",
      privacy: "https://www.jadeship.com/privacy-policy",
    },
    qc: {
      tos: "https://qc.photos/tos",
      privacy: "https://qc.photos/privacy",
    },
  },
};
