/**
 * Building upgrade costs — extracted from guardian-outfitter.com/Last_War_Data_Public.xlsx
 * NOTE: Data is sparse — only milestone levels are confirmed. Nulls = not captured in source.
 * Source author noted some values may not be exact.
 *
 * Columns: level, foodIron (upgrade cost), gold (upgrade cost)
 * Build times included where available (days/hours/mins).
 */

export interface BuildingLevelCost {
  level: number;
  foodIron: number | null;
  gold: number | null;
  buildDays?: number | null;
  buildHours?: number | null;
  buildMins?: number | null;
}

export interface BuildingCostTable {
  name: string;
  costs: BuildingLevelCost[];
}

export const BUILDING_COSTS: Record<string, BuildingLevelCost[]> = {

  barracks: [
    { level: 1,  foodIron: 0,           gold: 0,           buildDays: 0, buildHours: 0,  buildMins: 0  },
    { level: 2,  foodIron: 30,          gold: 0,           buildDays: 0, buildHours: 0,  buildMins: 0  },
    { level: 8,  foodIron: 185250,      gold: 0,           buildDays: 0, buildHours: 2,  buildMins: 20 },
    { level: 12, foodIron: 1500000,     gold: 611101,      buildDays: 0, buildHours: 7,  buildMins: 11 },
    { level: 15, foodIron: 3100000,     gold: 1200000,     buildDays: null, buildHours: null, buildMins: null },
    { level: 16, foodIron: 5600000,     gold: 2200000,     buildDays: null, buildHours: null, buildMins: null },
    { level: 18, foodIron: 12900000,    gold: 5000000,     buildDays: null, buildHours: null, buildMins: null },
    { level: 20, foodIron: 27700000,    gold: 11100000,    buildDays: null, buildHours: null, buildMins: null },
    { level: 21, foodIron: 38800000,    gold: 15700000,    buildDays: null, buildHours: null, buildMins: null },
    { level: 25, foodIron: 129500000,   gold: 53600000,    buildDays: null, buildHours: null, buildMins: null },
    { level: 26, foodIron: 185000000,   gold: 74900000,    buildDays: null, buildHours: null, buildMins: null },
    { level: 27, foodIron: 241000000,   gold: 102000000,   buildDays: null, buildHours: null, buildMins: null },
    { level: 28, foodIron: 342200000,   gold: 138700000,   buildDays: null, buildHours: null, buildMins: null },
  ],

  wall: [
    { level: 15, foodIron: 6500000,     gold: 2200000,     buildDays: null, buildHours: null, buildMins: null },
    { level: 21, foodIron: 79800000,    gold: 26600000,    buildDays: null, buildHours: null, buildMins: null },
    { level: 23, foodIron: 131600000,   gold: 42300000,    buildDays: null, buildHours: null, buildMins: null },
    { level: 26, foodIron: 370000000,   gold: 120200000,   buildDays: null, buildHours: null, buildMins: null },
    { level: 27, foodIron: 490200000,   gold: 166500000,   buildDays: null, buildHours: null, buildMins: null },
  ],

  smelter: [
    { level: 1,  foodIron: 0,           gold: 0            },
    { level: 2,  foodIron: 146,         gold: 146          },
    { level: 3,  foodIron: 663,         gold: 663          },
    { level: 4,  foodIron: 1658,        gold: 1658         },
    { level: 5,  foodIron: 6630,        gold: 6630         },
    { level: 6,  foodIron: 19500,       gold: 19500        },
    { level: 7,  foodIron: 58500,       gold: 58500        },
    { level: 8,  foodIron: 175500,      gold: 175500       },
    { level: 9,  foodIron: 526500,      gold: 526500       },
    { level: 10, foodIron: 1579500,     gold: 1579500      },
    { level: 11, foodIron: 4738500,     gold: 4738500      },
    { level: 12, foodIron: 14215500,    gold: 14215500     },
    { level: 13, foodIron: 42646500,    gold: 42646500     },
    { level: 14, foodIron: 127939500,   gold: 127939500    },
    { level: 15, foodIron: 383818500,   gold: 383818500    },
    { level: 16, foodIron: 1151455500,  gold: 1151455500   },
    { level: 17, foodIron: null,        gold: null         },
    { level: 18, foodIron: null,        gold: null         },
    { level: 19, foodIron: null,        gold: null         },
    { level: 20, foodIron: null,        gold: null         },
  ],

  hospital: [
    { level: 1,  foodIron: 0,           gold: 0            },
    { level: 2,  foodIron: 30,          gold: 0            },
    { level: 8,  foodIron: 185250,      gold: 0            },
    { level: 12, foodIron: 1500000,     gold: 611101       },
    { level: 15, foodIron: 3100000,     gold: 1200000      },
    { level: 16, foodIron: 5600000,     gold: 2200000      },
    { level: 18, foodIron: 12900000,    gold: 5000000      },
    { level: 20, foodIron: 27700000,    gold: 11100000     },
    { level: 21, foodIron: 38800000,    gold: 15700000     },
    { level: 25, foodIron: 129500000,   gold: 53600000     },
    { level: 26, foodIron: 185000000,   gold: 74900000     },
    { level: 27, foodIron: 241000000,   gold: 102000000    },
    { level: 28, foodIron: 342200000,   gold: 138700000    },
  ],

  techCenter: [
    { level: 1,  foodIron: 0,           gold: 0            },
    { level: 2,  foodIron: 30,          gold: 0            },
    { level: 8,  foodIron: 185250,      gold: 0            },
    { level: 12, foodIron: 1500000,     gold: 611101       },
    { level: 15, foodIron: 3100000,     gold: 1200000      },
    { level: 16, foodIron: 5600000,     gold: 2200000      },
    { level: 18, foodIron: 12900000,    gold: 5000000      },
    { level: 20, foodIron: 27700000,    gold: 11100000     },
    { level: 21, foodIron: 38800000,    gold: 15700000     },
    { level: 25, foodIron: 129500000,   gold: 53600000     },
    { level: 26, foodIron: 185000000,   gold: 74900000     },
    { level: 27, foodIron: 241000000,   gold: 102000000    },
    { level: 28, foodIron: 342200000,   gold: 138700000    },
  ],

  drillGrounds: [
    { level: 1,  foodIron: 0,           gold: 0            },
    { level: 2,  foodIron: 30,          gold: 0            },
    { level: 8,  foodIron: 185250,      gold: 0            },
    { level: 12, foodIron: 1500000,     gold: 611101       },
    { level: 15, foodIron: 3100000,     gold: 1200000      },
    { level: 16, foodIron: 5600000,     gold: 2200000      },
    { level: 18, foodIron: 12900000,    gold: 5000000      },
    { level: 20, foodIron: 27700000,    gold: 11100000     },
    { level: 21, foodIron: 38800000,    gold: 15700000     },
    { level: 25, foodIron: 129500000,   gold: 53600000     },
    { level: 26, foodIron: 185000000,   gold: 74900000     },
    { level: 27, foodIron: 241000000,   gold: 102000000    },
    { level: 28, foodIron: 342200000,   gold: 138700000    },
  ],

  ironFoodMine: [
    { level: 1,  foodIron: 0,           gold: 0            },
    { level: 2,  foodIron: 30,          gold: 0            },
    { level: 8,  foodIron: 185250,      gold: 0            },
    { level: 12, foodIron: 1500000,     gold: 611101       },
    { level: 15, foodIron: 3100000,     gold: 1200000      },
    { level: 20, foodIron: 27700000,    gold: 11100000     },
    { level: 25, foodIron: 129500000,   gold: 53600000     },
    { level: 28, foodIron: 342200000,   gold: 138700000    },
  ],

  allianceCenter: [
    { level: 1,  foodIron: 0,           gold: 0            },
    { level: 2,  foodIron: 30,          gold: 0            },
    { level: 8,  foodIron: 185250,      gold: 0            },
    { level: 12, foodIron: 1500000,     gold: 611101       },
    { level: 15, foodIron: 3100000,     gold: 1200000      },
    { level: 20, foodIron: 27700000,    gold: 11100000     },
    { level: 25, foodIron: 129500000,   gold: 53600000     },
    { level: 28, foodIron: 342200000,   gold: 138700000    },
  ],

  vehicleCenter: [
    { level: 1,  foodIron: 0,           gold: 0            },
    { level: 2,  foodIron: 30,          gold: 0            },
    { level: 8,  foodIron: 185250,      gold: 0            },
    { level: 12, foodIron: 1500000,     gold: 611101       },
    { level: 15, foodIron: 3100000,     gold: 1200000      },
    { level: 20, foodIron: 27700000,    gold: 11100000     },
    { level: 25, foodIron: 129500000,   gold: 53600000     },
    { level: 28, foodIron: 342200000,   gold: 138700000    },
  ],
};

export function getBuildingCostSummary(): string {
  return `## Building Upgrade Costs (milestone levels — source: guardian-outfitter public data)
Data is partial — only milestone levels confirmed. Full per-level costs pending.
Key reference points for Buddy context:

Barracks: L12 = 1.5M food/iron + 611K gold | L20 = 27.7M food/iron + 11.1M gold | L25 = 129.5M food/iron + 53.6M gold | L28 = 342.2M food/iron + 138.7M gold
Wall: L15 = 6.5M food/iron + 2.2M gold | L21 = 79.8M food/iron + 26.6M gold | L26 = 370M food/iron + 120.2M gold | L27 = 490.2M food/iron + 166.5M gold
Smelter (complete L1-16): L10 = 1.58M each | L12 = 14.2M each | L14 = 127.9M each | L15 = 383.8M each | L16 = 1.15B each
Hospital, Tech Center, Drill Grounds, Alliance Center, Vehicle Center: Same cost curve as Barracks at matching levels.
Note: Building costs scale sharply after L20. L25+ buildings cost 100M+ food/iron per upgrade.`;
}