export type TestEffect = Partial<{
  power: number;
  comfort: number;
  control: number;
  social: number;
  timeInvestment: number;
  budget: number;
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

export type TestOption = {
  text: string;
  effect: TestEffect;
};

export type TestQuestion = {
  id: string;
  dimension?: string;
  title: string;
  options: TestOption[];
};

export const questions: TestQuestion[] = [
  {
    id: "q1",
    title: "你更喜欢哪种玩法？",
    options: [
      { text: "一刀秒怪，爽快刷图", effect: { power: 2 } },
      { text: "慢慢刷，轻松不累", effect: { comfort: 2 } }
    ]
  },
  {
    id: "q2",
    title: "你的战斗风格？",
    options: [
      { text: "操作拉满，极限输出", effect: { control: 2, power: 1 } },
      { text: "简单稳定就好", effect: { comfort: 2 } }
    ]
  },
  {
    id: "q3",
    title: "你更喜欢？",
    options: [
      { text: "单刷效率最大化", effect: { power: 1, control: 1 } },
      { text: "和朋友一起打Boss", effect: { social: 2 } }
    ]
  },
  {
    id: "q4",
    title: "你每天能玩多久？",
    options: [
      { text: "每天1-2小时", effect: { timeInvestment: 1 } },
      { text: "每天3-4小时", effect: { timeInvestment: 2 } },
      { text: "每天6小时+", effect: { timeInvestment: 3 } }
    ]
  },
  {
    id: "q5",
    title: "你的月预算？",
    options: [
      { text: "小氪（0-399）", effect: { budget: 1 } },
      { text: "中氪（500-1000）", effect: { budget: 2 } },
      { text: "大氪（3000+）", effect: { budget: 3 } }
    ]
  },
  {
    id: "q6",
    title: "你能接受重复刷怪吗？",
    options: [
      { text: "玩一会就会腻", effect: { grindTolerance: 0 } },
      { text: "可以接受日常刷怪", effect: { grindTolerance: 2 } },
      { text: "可以刷一天不无聊", effect: { grindTolerance: 3 } }
    ]
  },
  {
    id: "q7",
    title: "你的情怀程度？",
    options: [
      { text: "随便玩玩", effect: { nostalgia: 0 } },
      { text: "老玩家回归", effect: { nostalgia: 2 } },
      { text: "情怀满格，细节都记得", effect: { nostalgia: 3 } }
    ]
  },
  {
    id: "q8",
    title: "你更偏向哪种玩法？",
    options: [
      { text: "娱乐为主", effect: { efficiencyMindset: 0 } },
      { text: "偶尔刷效率", effect: { efficiencyMindset: 2 } },
      { text: "极致搬砖赚钱", effect: { efficiencyMindset: 3 } }
    ]
  },
  {
    id: "q9",
    dimension: "战斗机制偏好",
    title: "你最喜欢的攻击方式是？",
    options: [
      { text: "持续群攻，大范围清场", effect: { aoeControl: 2, mage: 2 } },
      { text: "爆发点杀，一击定胜负", effect: { burstKill: 2, thief: 1, mage: 1 } },
      { text: "近身肉搏，贴脸输出", effect: { meleeCombat: 2, warrior: 2 } },
      { text: "远程狙击，稳准狠", effect: { rangedSnipe: 2, archer: 1, pirate: 1 } }
    ]
  },
  {
    id: "q10",
    dimension: "团队贡献方式",
    title: "组队时，你倾向于？",
    options: [
      { text: "极限辅助队友，让全队更强", effect: { teamSupport: 2, mage: 1, warrior: 1 } },
      { text: "提供稳定控制，掌控节奏", effect: { teamControl: 2, mage: 1, archer: 1 } },
      { text: "专注压制输出，快速减员", effect: { teamDps: 2, thief: 1, pirate: 1 } },
      { text: "承担抗伤职责，站撸不倒", effect: { teamTank: 2, warrior: 2 } }
    ]
  },
  {
    id: "q11",
    dimension: "资源管理习惯",
    title: "你对蓝药/消耗品的态度？",
    options: [
      { text: "尽量省钱，注重续航", effect: { resourceSave: 2, comfort: 1, mage: 1, archer: 1 } },
      { text: "只要刷怪快，药钱无所谓", effect: { resourceSpend: 2, power: 1, mage: 1, thief: 1 } },
      { text: "喜欢能回血回蓝的技能", effect: { skillRegen: 2, warrior: 2, comfort: 1 } }
    ]
  },
  {
    id: "q12",
    dimension: "视觉特效审美",
    title: "你觉得最酷的技能特效是？",
    options: [
      { text: "大范围冰火属性攻击", effect: { visualMage: 2, mage: 2 } },
      { text: "极速连击与残影", effect: { visualThiefPirate: 2, thief: 1, pirate: 1 } },
      { text: "强力武器与护盾", effect: { visualWarrior: 2, warrior: 2 } },
      { text: "华丽的箭雨与弹幕", effect: { visualArcher: 2, archer: 2 } }
    ]
  }
];

export const effectLabels: Record<keyof Required<TestEffect>, string> = {
  power: "输出偏好",
  comfort: "轻松偏好",
  control: "操作偏好",
  social: "社交偏好",
  timeInvestment: "投入时间",
  budget: "氪金预算",
  grindTolerance: "刷怪耐受",
  nostalgia: "情怀程度",
  efficiencyMindset: "效率导向",
  aoeControl: "群攻控场",
  burstKill: "爆发点杀",
  meleeCombat: "近身肉搏",
  rangedSnipe: "远程狙击",
  teamSupport: "团队辅助",
  teamControl: "团队控制",
  teamDps: "团队输出",
  teamTank: "团队抗伤",
  resourceSave: "省钱续航",
  resourceSpend: "效率优先",
  skillRegen: "技能续航",
  visualMage: "法师特效",
  visualThiefPirate: "盗海特效",
  visualWarrior: "战士特效",
  visualArcher: "弓手特效",
  mage: "法师系",
  warrior: "战士系",
  archer: "弓手系",
  thief: "盗贼系",
  pirate: "海盗系"
};

export const jobFamilyKeys = ["mage", "warrior", "archer", "thief", "pirate"] as const;

export type JobFamilyKey = (typeof jobFamilyKeys)[number];

export const jobFamilyLabels: Record<JobFamilyKey, string> = {
  mage: "法师系",
  warrior: "战士系",
  archer: "弓手系",
  thief: "盗贼系",
  pirate: "海盗系"
};

export function createEmptyScores(): Record<keyof Required<TestEffect>, number> {
  return {
    power: 0,
    comfort: 0,
    control: 0,
    social: 0,
    timeInvestment: 0,
    budget: 0,
    grindTolerance: 0,
    nostalgia: 0,
    efficiencyMindset: 0,
    aoeControl: 0,
    burstKill: 0,
    meleeCombat: 0,
    rangedSnipe: 0,
    teamSupport: 0,
    teamControl: 0,
    teamDps: 0,
    teamTank: 0,
    resourceSave: 0,
    resourceSpend: 0,
    skillRegen: 0,
    visualMage: 0,
    visualThiefPirate: 0,
    visualWarrior: 0,
    visualArcher: 0,
    mage: 0,
    warrior: 0,
    archer: 0,
    thief: 0,
    pirate: 0
  };
}

export function applyEffect(
  scores: Record<keyof Required<TestEffect>, number>,
  effect: TestEffect
) {
  for (const [key, value] of Object.entries(effect) as [keyof Required<TestEffect>, number][]) {
    scores[key] += value;
  }
}

export function getTopJobFamilies(scores: Record<keyof Required<TestEffect>, number>) {
  return jobFamilyKeys
    .map((key) => ({ key, label: jobFamilyLabels[key], value: scores[key] }))
    .filter((item) => item.value > 0)
    .sort((left, right) => right.value - left.value);
}
