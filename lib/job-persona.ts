import type { TestScores } from "@/lib/job-recommendation";

export type PersonaTier = "awakening" | "endurance" | "agency";

export type PersonaTierMeta = {
  tier: PersonaTier;
  label: string;
  subtitle: string;
  lifeStage: string;
};

export type JobPersonaProfile = {
  archetype: string;
  tagline: string;
  report: string;
  mirror: string;
};

export const personaTierMeta: Record<PersonaTier, PersonaTierMeta> = {
  awakening: {
    tier: "awakening",
    label: "初醒层",
    subtitle: "回魂冒险者",
    lifeStage: "20–28 岁心境"
  },
  endurance: {
    tier: "endurance",
    label: "守恒层",
    subtitle: "负重冒险者",
    lifeStage: "29–35 岁心境"
  },
  agency: {
    tier: "agency",
    label: "突围层",
    subtitle: "理性冒险者",
    lifeStage: "36–40 岁心境"
  }
};

/** 依据答题倾向推断 20–40 岁用户的心理层级（非真实年龄） */
export function resolvePersonaTier(scores: TestScores): PersonaTier {
  const awakening =
    scores.nostalgia * 2.5 + scores.comfort * 1.2 + scores.social * 1 - scores.efficiencyMindset * 1.5;
  const endurance =
    scores.social * 2 +
    scores.teamSupport * 1.5 +
    scores.teamTank * 1.5 +
    scores.skillRegen * 1.2 +
    scores.grindTolerance * 0.8 +
    scores.timeInvestment * 0.5;
  const agency =
    scores.efficiencyMindset * 2.5 +
    scores.power * 1.2 +
    scores.control * 1 +
    scores.budget * 1 +
    scores.timeInvestment * 1.2 +
    scores.burstKill * 0.5;

  const ranked = (
    [
      ["awakening", awakening],
      ["endurance", endurance],
      ["agency", agency]
    ] as [PersonaTier, number][]
  ).sort((a, b) => b[1] - a[1]);

  return ranked[0][0];
}

export function getJobPersona(jobId: string, tier: PersonaTier): JobPersonaProfile | null {
  return jobPersonaProfiles[jobId]?.[tier] ?? null;
}

export const jobPersonaProfiles: Record<string, Record<PersonaTier, JobPersonaProfile>> = {
  hero: {
    awakening: {
      archetype: "拔剑未晚的迟到少年",
      tagline: "你不是想变强，你只是想证明那个少年还在。",
      report:
        "报告摘要：怀旧分值偏高，你对「一刀清图」的渴望，本质上是对掌控感的补课。现实里太多事情来不及开始，于是你把英雄当作迟到的入场券——不是要成为谁，只是不想承认青春已经散场。",
      mirror: "如果生活也能像轻功一样跳过那些废话，你还会犹豫吗？"
    },
    endurance: {
      archetype: "沉默扛伤的前排父亲",
      tagline: "你习惯了先上，习惯了不退，习惯了不说累。",
      report:
        "报告摘要：团队与承压维度突出。你选英雄，不是因为莽，是因为你早已习惯做那个顶在最前面的人——公司里、家里、群里都一样。游戏里的剑，是你唯一还能主动选择的责任。",
      mirror: "这一次，能不能允许自己只为爽而挥剑，而不是为了谁？"
    },
    agency: {
      archetype: "用效率换体面的刀客",
      tagline: "时间很贵，你只想要最直的路径。",
      report:
        "报告摘要：效率与输出倾向主导。你把冒险岛当作有限时间内的 ROI 项目——路线、装备、爆发都要最优。英雄对你不是情怀玩具，而是「投入 1 小时必须看见回报」的理性选择。",
      mirror: "当一刀真的清图，你会不会反而空一下？"
    }
  },
  paladin: {
    awakening: {
      archetype: "想被需要的温柔骑士",
      tagline: "你怀念的不是圣光，是有人对你说「谢了」。",
      report:
        "报告摘要：社交与辅助共鸣明显。圣骑士是你对「被认可」的温柔投射——不一定要输出第一，但要站在队友身边。这很像二十出头时你在网吧里当那个靠谱搭子的样子。",
      mirror: "如果现在也有人等你加血，你会准时上线吗？"
    },
    endurance: {
      archetype: "把安全感给全家的守护者",
      tagline: "盾牌的另一面，是你不敢倒下的理由。",
      report:
        "报告摘要：守恒层典型画像。你越来越像圣骑士：不 flashy，但稳；不抱怨，但扛。游戏是你少数还能「保护点什么」的地方——公会、固定队，或者只是保护自己不被生活淹没。",
      mirror: "你有没有问过自己：谁来给你加血？"
    },
    agency: {
      archetype: "低风险稳态运营官",
      tagline: "你不赌命，你要的是长期可预期的回报。",
      report:
        "报告摘要：预算与续航维度偏高。圣骑士符合你的风控人格：不极端氪，不极端肝，但要稳定、要能持续。你把重生服当作一项可维护的长期资产，而不是冲动消费。",
      mirror: "稳定久了，会不会也想试一次全输出？"
    }
  },
  "dark-knight": {
    awakening: {
      archetype: "用狂气掩盖不安的龙骑",
      tagline: "火龙咆哮背后，是你还没和解的叛逆。",
      report:
        "报告摘要：近战与情怀交织。龙骑士是你对「我还很野」的声明——生活越规整，越想在游戏里保留一点不管不顾的冲劲。那不是幼稚，是你在确认血还是热的。",
      mirror: "最后一次不管后果地冲，是什么时候？"
    },
    endurance: {
      archetype: "以伤换位的硬撑者",
      tagline: "你习惯用消耗换空间，就像在现实里硬顶。",
      report:
        "报告摘要：承压与续航信号强。龙骑士的「卖血打」像极了你的日常策略：先顶住，再回血，再顶住。你不常喊苦，但指标显示你的耐受度已经被练得很高。",
      mirror: "如果可以不掉血也赢，你想试试吗？"
    },
    agency: {
      archetype: "懂止损的暴力执行官",
      tagline: "你要的不是帅，是可控的爆发窗口。",
      report:
        "报告摘要：输出与效率双高。你把龙骑士当作高回报技能组：知道什么时候开 buff、什么时候收手。游戏时间被精确切割，每一次咆哮都要算过账。",
      mirror: "效率拉满之后，还会记得当年通宵的理由吗？"
    }
  },
  "fire-poison": {
    awakening: {
      archetype: "烧尽无聊的纵火者",
      tagline: "火毒是你对「一成不变」的抗议。",
      report:
        "报告摘要：爆发与视觉偏好明显。你选火毒，是要看屏幕燃起来——像当年第一次看见满屏伤害时的瞳孔放大。现实越淡，越需要一场虚拟的大火。",
      mirror: "如果火焰能烧掉一项现实里的烦，你先烧哪一项？"
    },
    endurance: {
      archetype: "在坐牢里找乐子的硬扛者",
      tagline: "你知道火毒累，但你更怕停下来。",
      report:
        "报告摘要：刷怪耐受与投入并存。火毒像你的中年隐喻：路径不轻松，但你已经学会在重复里找节奏。不是不知道坐牢，是停下来更难受。",
      mirror: "你是真的喜欢火毒，还是只是习惯了硬刷？"
    },
    agency: {
      archetype: "为速度买单的激进投资者",
      tagline: "药钱不是问题，问题是慢。",
      report:
        "报告摘要：资源消耗与效率导向。你愿意为速度付费——时间比金币贵。火毒在你的决策树里不是最稳，但一定是最敢烧的那一支。",
      mirror: "当收益边际递减，你会换冰雷吗？"
    }
  },
  "ice-lightning": {
    awakening: {
      archetype: "把夏天冻住的怀旧法师",
      tagline: "冰雷是你对时间流逝的无声反抗。",
      report:
        "报告摘要：群控与怀旧共振。你想把刷怪节奏冻在一个可控的、像当年一样的频率里。冰雷的华丽不是炫耀，是在说：我还记得那个夏天。",
      mirror: "如果有一秒能永远暂停，你想停在哪张地图？"
    },
    endurance: {
      archetype: "用控场换喘息的中场法师",
      tagline: "你不需要最快，你需要别那么乱。",
      report:
        "报告摘要：控制与续航需求高。生活已经够乱了，游戏里你想要可预期的清图节奏。冰雷是你给自己安排的「可控区域」——怪不要乱冲，时间也不要乱走。",
      mirror: "控场久了，会不会也想放任一次？"
    },
    agency: {
      archetype: "硬核搬砖的理性法师",
      tagline: "你要的是长期稳定产出，不是一时爽。",
      report:
        "报告摘要：效率与群攻维度领先。冰雷是你验证过的最优解：省药、稳态、可持续。你把重生服当作业余资产负债表里的稳健项，火毒太赌，冰雷刚好。",
      mirror: "当效率达标，你会给自己放一天假吗？"
    }
  },
  bishop: {
    awakening: {
      archetype: "渴望被喊「奶妈」的人",
      tagline: "主教是你对「被需要」的温柔申请。",
      report:
        "报告摘要：社交与辅助倾向突出。你并不只想加血，你想被看见——在队伍里、在关系里、在生活里。主教是你最诚实的职业投射：我想有用，我想被留下。",
      mirror: "上一次你真正被需要，是什么时候？"
    },
    endurance: {
      archetype: "照顾所有人却忘了自己的人",
      tagline: "你把圣光给队友，把疲惫留给自己。",
      report:
        "报告摘要：团队支持与守恒层高度吻合。你像主教一样存在：不抢镜头，但一退就塌。游戏是你少数还能「明确被依赖」的场景，这让你既温暖又心酸。",
      mirror: "如果今天只允许你为自己加一次血，你会加吗？"
    },
    agency: {
      archetype: "低消耗高价值的后勤官",
      tagline: "你算过账：辅助才是最省时间的解法。",
      report:
        "报告摘要：省钱续航与社交并重。主教符合你的成本意识——低药耗、组队友好、长期可持续。你把辅助玩成一种精明，而不是软弱。",
      mirror: "当队伍散了，你还会上线吗？"
    }
  },
  bowmaster: {
    awakening: {
      archetype: "在准星里找方向的弓手",
      tagline: "神射手是你对「精准」的青春期执念。",
      report:
        "报告摘要：控制与弓系审美共振。你喜欢箭落点准确、节奏清楚——像当年对着攻略一步步练级。神射手是你对「把事情做对」的早期训练。",
      mirror: "如果现在有一箭必须命中，你瞄准什么？"
    },
    endurance: {
      archetype: "远距离观察生活的狙击手",
      tagline: "你习惯站远一点，看得更清，也更安全。",
      report:
        "报告摘要：远程与控制双高。你不爱硬碰硬，更习惯稳定输出与可控距离。神射手像你的处世策略：不冲进混乱中心，但从不缺席。",
      mirror: "站远了，会不会也少了点温度？"
    },
    agency: {
      archetype: "把输出曲线算到秒的技师",
      tagline: "弩箭是你对时间的精确切割。",
      report:
        "报告摘要：效率与控制主导。神射手的价值在于可复现——同样地图、同样 DPS、同样收益。你要的是可验证的结果，不是偶然的高光。",
      mirror: "当曲线完美，你会不会觉得少了点意外？"
    }
  },
  marksman: {
    awakening: {
      archetype: "把遗憾射向天空的人",
      tagline: "箭神是你对「没抓住」的东西的最后一击。",
      report:
        "报告摘要：怀旧与远程狙击并存。箭神对你不是职业，是隐喻——那些没选的路、没说完的话、没回去的服务器。你想用一箭把遗憾钉在某个可见的靶心上。",
      mirror: "如果只能射出一箭给十年前的自己，你说什么？"
    },
    endurance: {
      archetype: "在责任缝隙里瞄准的人",
      tagline: "你只有碎片时间，但每一片都要有用。",
      report:
        "报告摘要：时间投入与远程偏好。箭神适合你的生活节奏：站位、输出、收工。你不追求最长在线，但追求每次上线都不白费。",
      mirror: "碎片时间攒多了，算不算另一种完整？"
    },
    agency: {
      archetype: "单点爆破的效率主义者",
      tagline: "你要一箭带走，而不是磨磨蹭蹭。",
      report:
        "报告摘要：爆发与效率双高。箭神是你对「高倍率回报」的偏好——路径清晰、伤害可见、时间可算。这是成熟玩家对时间的尊重。",
      mirror: "当一箭不够，你会换职业还是换目标？"
    }
  },
  "night-lord": {
    awakening: {
      archetype: "在阴影里找自由的镖飞",
      tagline: "隐身是你对「被定义」的短暂逃离。",
      report:
        "报告摘要：盗贼系与爆发偏好。标飞是你对速度和解缚的渴望——现实里角色太多，游戏里你想做那个来无影去无踪的人。不是坏，只是太想喘口气。",
      mirror: "如果可以隐身一小时，你最想离开哪个场景？"
    },
    endurance: {
      archetype: "用高输出换存在感的夜行者",
      tagline: "你不常说话，但关键时候你在。",
      report:
        "报告摘要：团队 DPS 与承压并存。你像标飞一样：不站 C 位话术，但 BOSS 战从不缺席。游戏是你维持「我仍有锋芒」的证据。",
      mirror: "除了输出，你还想被看见什么？"
    },
    agency: {
      archetype: "把爆发当杠杆的投机者",
      tagline: "你追求最短路径的最大伤害。",
      report:
        "报告摘要：效率与爆发主导。标飞是你工具箱里的高杠杆选项——短时间、高回报、可重复。你把游戏当副业项目，而不是纯娱乐。",
      mirror: "杠杆拉满时，你准备好承受波动了吗？"
    }
  },
  shadower: {
    awakening: {
      archetype: "在游戏里当坏孩子的刀飞",
      tagline: "侠盗是你对规则的温柔挑衅。",
      report:
        "报告摘要：盗贼审美与怀旧交织。你选刀飞，是要一点「不太乖」的快感——现实里已经够合规了，游戏里你想偷偷爽一下。这不是道德问题，是补偿机制。",
      mirror: "最近一次「不太乖」，你快乐吗？"
    },
    endurance: {
      archetype: "用灵活对抗僵化的生存者",
      tagline: "你不硬刚生活，你绕过去。",
      report:
        "报告摘要：控制与资源管理信号。侠盗像你应对中年复杂性的策略：不正面消耗，用机动和判断换空间。游戏里的刀，是灵活性的象征。",
      mirror: "绕过去之后，你会不会也想正面赢一次？"
    },
    agency: {
      archetype: "把收益藏进细节的老手",
      tagline: "你看的是长期曲线，不是一时刺激。",
      report:
        "报告摘要：效率与控制并重。侠盗在你这里是稳健型输出——路径成熟、风险可控、收益可预期。你是那种会把攻略看到脚注的人。",
      mirror: "当所有人都知道你的路线，你还会领先吗？"
    }
  },
  buccaneer: {
    awakening: {
      archetype: "拳头还硬的旧日拳手",
      tagline: "冲锋队长是你对「还能打」的确认。",
      report:
        "报告摘要：近战与海盗情怀。你想用最直接的方式证明热血没凉——连击、硬刚、不退。那是你身体记忆里的青春语言。",
      mirror: "最后一记让你热血沸腾的连击，是什么时候？"
    },
    endurance: {
      archetype: "用拳头替全家出气的人",
      tagline: "现实里不能发的火，你在游戏里发。",
      report:
        "报告摘要：承压与近战双高。冲锋队长是你安全的宣泄口——不能摔杯子，但可以摔怪物。这很健康，只要你记得下线。",
      mirror: "发完火之后，你会更好说话吗？"
    },
    agency: {
      archetype: "把连击当流水线的工头",
      tagline: "你要的是稳定循环，不是随机乱打。",
      report:
        "报告摘要：效率与近战输出。你把拳手玩成 SOP：起手、循环、收尾。时间有限，连击必须可复现。这是成年人对暴力的理性使用。",
      mirror: "当循环完美，你还会怀念乱打的那晚吗？"
    }
  },
  corsair: {
    awakening: {
      archetype: "想当船长的少年梦",
      tagline: "船长是你对「自由航行」的延迟实现。",
      report:
        "报告摘要：海盗系与视觉偏好。你迷恋的不是枪，是那种「我说了算」的辽阔感。现实里航线被固定，游戏里你想自己定方向。",
      mirror: "如果现在能换一条人生航线，你往哪开？"
    },
    endurance: {
      archetype: "在职场里练出来的炮手",
      tagline: "精准与算计，是你这些年的生存技能。",
      report:
        "报告摘要：远程与效率信号。船长像你职场人格的延伸——目标明确、资源可控、输出稳定。游戏不是逃避，是迁移：把能力带到另一个世界。",
      mirror: "当炮口对准 BOSS，你想的是 KPI 还是回忆？"
    },
    agency: {
      archetype: "把冒险岛当资产配置的船长",
      tagline: "你不是来玩的，你是来运营的。",
      report:
        "报告摘要：预算与效率主导。船长符合你的经营者心态：投入可追踪、产出可衡量、路径可优化。重生服是你生活系统里的一个模块。",
      mirror: "当收益达标，你会把船靠岸休息吗？"
    }
  }
};
