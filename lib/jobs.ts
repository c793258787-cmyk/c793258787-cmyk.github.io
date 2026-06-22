export type JobMatchWeight = {
  power: number;
  control: number;
  social: number;
  budget: number;
};

/** Q1–Q2、Q4、Q6–Q8、Q9–Q12 扩展维度，与答题 scores 做点积 */
export type JobExtendedWeight = Partial<{
  comfort: number;
  timeInvestment: number;
  grindTolerance: number;
  nostalgia: number;
  efficiencyMindset: number;
  aoeControl: number;
  burstKill: number;
  meleeCombat: number;
  rangedSnipe: number;
  teamSupport: number;
  teamControl: number;
  teamDps: number;
  teamTank: number;
  resourceSave: number;
  resourceSpend: number;
  skillRegen: number;
  visualMage: number;
  visualThiefPirate: number;
  visualWarrior: number;
  visualArcher: number;
  mage: number;
  warrior: number;
  archer: number;
  thief: number;
  pirate: number;
}>;

export const jobMatchWeights: Record<string, JobMatchWeight> = {
  英雄: { power: 3, control: 1, social: 1, budget: 2 },
  圣骑士: { power: 2, control: 2, social: 2, budget: 2 },
  龙骑士: { power: 3, control: 1, social: 2, budget: 2 },
  火毒魔导士: { power: 3, control: 1, social: 1, budget: 3 },
  冰雷魔导士: { power: 2, control: 3, social: 2, budget: 2 },
  主教: { power: 1, control: 2, social: 3, budget: 1 },
  神射手: { power: 2, control: 3, social: 1, budget: 2 },
  箭神: { power: 3, control: 2, social: 1, budget: 2 },
  隐士: { power: 3, control: 1, social: 1, budget: 3 },
  侠盗: { power: 2, control: 3, social: 1, budget: 2 },
  冲锋队长: { power: 3, control: 2, social: 1, budget: 2 },
  船长: { power: 2, control: 3, social: 1, budget: 3 }
};

export const jobExtendedWeights: Record<string, JobExtendedWeight> = {
  英雄: {
    comfort: 1,
    timeInvestment: 2,
    grindTolerance: 3,
    nostalgia: 3,
    efficiencyMindset: 2,
    warrior: 3,
    meleeCombat: 3,
    visualWarrior: 3,
    burstKill: 1,
    teamTank: 1
  },
  圣骑士: {
    comfort: 3,
    timeInvestment: 2,
    grindTolerance: 2,
    nostalgia: 2,
    efficiencyMindset: 1,
    warrior: 3,
    teamSupport: 2,
    teamTank: 3,
    skillRegen: 2,
    visualWarrior: 2
  },
  龙骑士: {
    comfort: 2,
    timeInvestment: 2,
    grindTolerance: 2,
    nostalgia: 2,
    efficiencyMindset: 1,
    warrior: 3,
    meleeCombat: 2,
    teamSupport: 2,
    skillRegen: 3,
    teamTank: 1
  },
  火毒魔导士: {
    comfort: 1,
    timeInvestment: 2,
    grindTolerance: 2,
    nostalgia: 3,
    efficiencyMindset: 1,
    mage: 3,
    burstKill: 3,
    aoeControl: 2,
    resourceSpend: 2,
    visualMage: 2
  },
  冰雷魔导士: {
    comfort: 2,
    timeInvestment: 3,
    grindTolerance: 3,
    nostalgia: 3,
    efficiencyMindset: 3,
    mage: 3,
    aoeControl: 3,
    teamControl: 3,
    visualMage: 3,
    resourceSave: 1
  },
  主教: {
    comfort: 3,
    timeInvestment: 1,
    grindTolerance: 1,
    nostalgia: 2,
    efficiencyMindset: 1,
    mage: 3,
    teamSupport: 3,
    resourceSave: 2,
    visualMage: 2,
    aoeControl: 1
  },
  神射手: {
    comfort: 2,
    timeInvestment: 2,
    grindTolerance: 2,
    nostalgia: 2,
    efficiencyMindset: 2,
    archer: 3,
    teamControl: 3,
    rangedSnipe: 2,
    visualArcher: 3,
    resourceSave: 1
  },
  箭神: {
    comfort: 1,
    timeInvestment: 3,
    grindTolerance: 2,
    nostalgia: 3,
    efficiencyMindset: 3,
    archer: 3,
    rangedSnipe: 3,
    burstKill: 2,
    visualArcher: 3,
    teamDps: 1
  },
  隐士: {
    comfort: 1,
    timeInvestment: 3,
    grindTolerance: 2,
    nostalgia: 3,
    efficiencyMindset: 3,
    thief: 3,
    burstKill: 3,
    teamDps: 2,
    resourceSpend: 2,
    visualThiefPirate: 2
  },
  侠盗: {
    comfort: 2,
    timeInvestment: 2,
    grindTolerance: 2,
    nostalgia: 2,
    efficiencyMindset: 2,
    thief: 3,
    teamControl: 2,
    burstKill: 2,
    resourceSpend: 1,
    visualThiefPirate: 3
  },
  冲锋队长: {
    comfort: 2,
    timeInvestment: 2,
    grindTolerance: 2,
    nostalgia: 2,
    efficiencyMindset: 2,
    pirate: 3,
    meleeCombat: 3,
    teamTank: 2,
    teamDps: 1,
    visualThiefPirate: 2
  },
  船长: {
    comfort: 2,
    timeInvestment: 2,
    grindTolerance: 1,
    nostalgia: 1,
    efficiencyMindset: 3,
    pirate: 3,
    rangedSnipe: 2,
    teamDps: 3,
    resourceSpend: 1,
    visualThiefPirate: 2
  }
};

export type JobGroupKey = "warrior" | "mage" | "archer" | "thief" | "pirate";

export type JobDefinition = {
  id: string;
  name: string;
  family: string;
  groupKey: JobGroupKey;
  groupLabel: string;
  path: string;
};

export const jobGroups: { key: JobGroupKey; label: string; family: string }[] = [
  { key: "warrior", label: "战士组", family: "战士系" },
  { key: "mage", label: "法师组", family: "法师系" },
  { key: "archer", label: "弓手组", family: "弓手系" },
  { key: "thief", label: "盗贼组", family: "盗贼系" },
  { key: "pirate", label: "海盗组", family: "海盗系" }
];

export const jobs: JobDefinition[] = [
  { id: "hero", name: "英雄", family: "战士系", groupKey: "warrior", groupLabel: "战士组", path: "/level-guide/job/hero" },
  { id: "paladin", name: "圣骑士", family: "战士系", groupKey: "warrior", groupLabel: "战士组", path: "/level-guide/job/paladin" },
  { id: "dark-knight", name: "龙骑士", family: "战士系", groupKey: "warrior", groupLabel: "战士组", path: "/level-guide/job/dark-knight" },
  { id: "fire-poison", name: "火毒魔导士", family: "法师系", groupKey: "mage", groupLabel: "法师组", path: "/level-guide/job/fire-poison" },
  { id: "ice-lightning", name: "冰雷魔导士", family: "法师系", groupKey: "mage", groupLabel: "法师组", path: "/level-guide/job/ice-lightning" },
  { id: "bishop", name: "主教", family: "法师系", groupKey: "mage", groupLabel: "法师组", path: "/level-guide/job/bishop" },
  { id: "bowmaster", name: "神射手", family: "弓手系", groupKey: "archer", groupLabel: "弓手组", path: "/level-guide/job/bowmaster" },
  { id: "marksman", name: "箭神", family: "弓手系", groupKey: "archer", groupLabel: "弓手组", path: "/level-guide/job/marksman" },
  { id: "night-lord", name: "隐士", family: "盗贼系", groupKey: "thief", groupLabel: "盗贼组", path: "/level-guide/job/night-lord" },
  { id: "shadower", name: "侠盗", family: "盗贼系", groupKey: "thief", groupLabel: "盗贼组", path: "/level-guide/job/shadower" },
  { id: "buccaneer", name: "冲锋队长", family: "海盗系", groupKey: "pirate", groupLabel: "海盗组", path: "/level-guide/job/buccaneer" },
  { id: "corsair", name: "船长", family: "海盗系", groupKey: "pirate", groupLabel: "海盗组", path: "/level-guide/job/corsair" }
];

export const jobsByName = Object.fromEntries(jobs.map((job) => [job.name, job])) as Record<string, JobDefinition>;
export const jobsById = Object.fromEntries(jobs.map((job) => [job.id, job])) as Record<string, JobDefinition>;

export type JobLevelGuide = {
  summary: string;
  earlyTips: string[];
  midTips: string[];
  lateTips: string[];
};

export const jobLevelGuides: Record<string, JobLevelGuide> = {
  hero: {
    summary: "英雄以高爆发近战输出见长，适合追求一刀清图的玩家，前期需要一定装备支撑。",
    earlyTips: ["优先提升单手剑攻击力，1-30 级跟随主线熟悉技能", "30 级后优先刷经验稳定的低级地图练级"],
    midTips: ["利用轻功快速清图，选择怪物密度高的地图", "关注武器强化与命中，避免高等级地图效率下降"],
    lateTips: ["后期以高等级怪物和 Boss 为主，配合 buff 技能提升爆发", "可参考全站升级路线补充通用地图选择"]
  },
  paladin: {
    summary: "圣骑士生存与团队辅助能力突出，适合喜欢稳定刷图和组队的玩家。",
    earlyTips: ["前期以剑盾流为主，保证血量与防御", "利用圣系技能提升续航，减少药水消耗"],
    midTips: ["中期可参与组队任务，发挥辅助与抗伤优势", "选择刷新稳定、风险较低的地图持续练级"],
    lateTips: ["后期在 Boss 战中承担前排与辅助职责", "配合团队 buff 提升整体效率"]
  },
  "dark-knight": {
    summary: "龙骑士兼具输出与续航，操作相对友好，是老玩家回归的热门选择。",
    earlyTips: ["早期优先点满群攻技能，提高清怪效率", "利用吸血技能降低药水开销"],
    midTips: ["中期选择中等密度地图，保持经验与金币双收益", "关注武器与防具均衡提升"],
    lateTips: ["后期可单刷高经验地图，也可组队打 Boss", "参考通用升级路线调整目标怪物"]
  },
  "fire-poison": {
    summary: "火毒魔导士擅长持续伤害与范围清怪，适合追求刷图效率的法师玩家。",
    earlyTips: ["前期优先提升魔法攻击与蓝量", "利用范围魔法快速清理低级怪物"],
    midTips: ["中期选择怪物聚集地图，发挥持续伤害优势", "注意蓝药补给与魔法盾使用时机"],
    lateTips: ["后期以高密度地图和 Boss 战为主", "可搭配全站升级路线选择合适等级段"]
  },
  "ice-lightning": {
    summary: "冰雷魔导士控场与群攻能力优秀，操作上限高，适合喜欢控怪刷图的玩家。",
    earlyTips: ["早期学习群攻与冰冻技能，提升安全性", "选择地形紧凑的地图提高技能命中率"],
    midTips: ["中期利用连锁闪电提升清怪效率", "控制魔法消耗，平衡输出与续航"],
    lateTips: ["后期在高级地图中利用控场减少受伤", "参考通用路线选择稳定经验来源"]
  },
  bishop: {
    summary: "主教是团队核心辅助，单刷偏慢但组队价值极高，适合社交型玩家。",
    earlyTips: ["前期以魔法攻击技能过渡练级", "尽早学习治疗与祝福类技能"],
    midTips: ["中期可组队升级，提供治疗与增益", "单刷时选择低风险、低消耗地图"],
    lateTips: ["后期重点参与 Boss 与团队活动", "辅助装备与蓝量管理是关键"]
  },
  bowmaster: {
    summary: "神射手拥有稳定远程输出与优秀清图能力，适合追求操作与效率的弓手玩家。",
    earlyTips: ["前期优先提升弓系攻击力与箭矢储备", "利用远程优势选择安全地图练级"],
    midTips: ["中期学习范围箭术技能，提高清怪速度", "关注命中与暴击属性"],
    lateTips: ["后期可单刷高收益地图", "结合全站升级路线选择合适目标怪物"]
  },
  marksman: {
    summary: "箭神以高单段伤害著称，爆发强但清怪节奏偏慢，适合点杀型玩家。",
    earlyTips: ["早期注重单体伤害技能升级", "选择怪物血量适中的地图保证效率"],
    midTips: ["中期利用穿透与狙击技能提升输出", "保持安全距离，减少被怪围攻"],
    lateTips: ["后期适合 Boss 与高经验单体目标", "参考通用路线补充地图选择"]
  },
  "night-lord": {
    summary: "隐士爆发与机动性极强，适合追求极限输出和操作感的盗贼玩家。",
    earlyTips: ["前期学习隐身与快速移动，提高生存", "利用高爆发技能快速清怪"],
    midTips: ["中期选择掉落与经验兼顾的地图", "注意药品与装备投入平衡"],
    lateTips: ["后期以高等级地图和 Boss 为主", "可搭配全站升级路线优化练级路径"]
  },
  shadower: {
    summary: "侠盗操作灵活，兼具爆发与控场，适合喜欢技巧型玩法的玩家。",
    earlyTips: ["早期熟悉隐身与暗杀技能循环", "选择怪物路线清晰的地图练级"],
    midTips: ["中期提升暴击与攻击力，加快清怪节奏", "利用技能连招减少受伤"],
    lateTips: ["后期可参与高收益单刷或组队", "参考通用升级路线调整等级段目标"]
  },
  buccaneer: {
    summary: "冲锋队长近战爆发强、手感直接，适合喜欢拳拳到肉玩法的海盗玩家。",
    earlyTips: ["前期学习连击技能，保持刷怪节奏", "注重血量与攻击力平衡"],
    midTips: ["中期选择密度较高地图发挥群攻优势", "利用位移技能提高机动性"],
    lateTips: ["后期可承担前排输出职责", "结合全站路线选择稳定练级地图"]
  },
  corsair: {
    summary: "船长兼具远程与召唤能力，清图效率优秀，适合追求多样化战斗的玩家。",
    earlyTips: ["早期学习Gun与召唤技能组合", "选择开阔地图发挥远程优势"],
    midTips: ["中期利用召唤物分担伤害，提高续航", "关注武器与敏捷属性提升"],
    lateTips: ["后期以高等级地图持续刷怪为主", "参考通用升级路线补充等级段规划"]
  }
};
