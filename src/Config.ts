export const Config = {
  defaultToolbarAgentsCount: 5,
  name: "JadeShip.com",
  endpoint: {
    agents: "https://www.jadeship.com/api/agents",
    legacyAgents: "https://www.jadeship.com/api/agents/legacy",
    affiliateLinks: "https://www.jadeship.com/api/agents/affiliate-links",
    convertDecrypt:
      "https://www.jadeship.com/api/quota-limited/extension/v2/convert-decrypt/multi",
    qc: "https://www.jadeship.com/api/quota-limited/extension/v2/qc",
    details: "https://www.jadeship.com/api/quota-limited/extension/v2/details",
    defaults: {
      agent:
        "https://www.jadeship.com/api/quota-limited/extension/v2/default/agents",
    },
  },
  social: {
    homepage: "https://www.jadeship.com/?r=extension",
    bestAgent: "https://www.jadeship.com/shipping-calculator?r=extension",
    newInstallation:
      "https://www.jadeship.com/tools/extension/new-installation",
    uninstall: "https://www.jadeship.com/tools/extension/uninstall",
    rate: "https://www.jadeship.com/tools/extension/rate",
  },
  legal: {
    main: {
      tos: "https://www.jadeship.com/tos",
      privacy: "https://www.jadeship.com/privacy-policy",
    },
  },
};
