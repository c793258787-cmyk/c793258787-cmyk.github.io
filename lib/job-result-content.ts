export type JobResultContent = {
  slogan: string;
  resonance: string;
  image: string | null;
};

export const jobResultContent: Record<string, JobResultContent> = {
  hero: {
    slogan: "像当年一样，把勇士部落的尘土刻进骨头。",
    resonance:
      "那个为了凑够 50 级龙背刃攒钱的午后，你一定记得。如今生活磨平了棱角，但这把剑，依然想为你劈开那该死的平庸。",
    image: "/quiz/jobs/hero.png"
  },
  paladin: {
    slogan: "盾牌后的世界，依然是那年网吧包夜的初心。",
    resonance:
      "那时你总站在前排，哪怕药水喝光也不退后一步。现在你守护的不再是队友，而是那个深夜里，依然想为家庭抗下一切的自己。",
    image: "/quiz/jobs/paladin.png"
  },
  "dark-knight": {
    slogan: "哪怕血量只剩 1%，也要跳出那道火龙咆哮。",
    resonance:
      "你忘不了废弃都市那些通宵的日子。生活给你多少压力，你就想在枪尖上还回去多少，这就是你身为男人最后的一点倔强。",
    image: "/quiz/jobs/dark-knight.png"
  },
  "fire-poison": {
    slogan: "用最烫的火焰，烧掉这一地名为生活的荆棘。",
    resonance:
      "魔法密林的树影太长，就像这些年没走完的弯路。你选火毒是因为你骨子里就不安分，哪怕烧钱，也要烧出一个属于自己的节奏。",
    image: "/quiz/jobs/fire-poison.png"
  },
  "ice-lightning": {
    slogan: "冰封住时间，好让你回到那个还有人陪你刷怪的夏天。",
    resonance:
      "冰雷的华丽特效下，藏着的是不想面对的琐碎日常。只要那一瞬的冰封，就能让你回到当年那个不需要考虑房租与职场的单纯下午。",
    image: "/quiz/jobs/ice-lightning.png"
  },
  bishop: {
    slogan: "那句“谢了，奶妈”，是这辈子听过最动人的赞美。",
    resonance:
      "当年你是众星捧月的存在，现在你只是社会机器里的一颗齿轮。练主教吧，找回那种“我真的被需要”的、久违的温暖。",
    image: "/quiz/jobs/bishop.png"
  },
  bowmaster: {
    slogan: "射出的不是箭，是那年没能抓紧的远方。",
    resonance:
      "你总是精准地瞄准目标，就像当年对着屏幕计算伤害一样。生活有很多箭要射，但只有这一箭，是为了你自己而发的。",
    image: "/quiz/jobs/bowmaster.png"
  },
  marksman: {
    slogan: "万箭齐发，只为留住那段回不去的时光。",
    resonance:
      "那些在天空之城守候的日落，你还记得吗？练箭神，是为了在繁杂的生活里，找到那份曾经触手可及的从容。",
    image: "/quiz/jobs/marksman.png"
  },
  "night-lord": {
    slogan: "隐身于黑夜，去追寻那个被岁月夺走的少年。",
    resonance:
      "只有在穿梭的瞬间，你才觉得摆脱了名为身份的束缚。隐士的影子，就是那个当年发誓要闯出点名堂、至今却未认输的你。",
    image: "/quiz/jobs/night-lord.png"
  },
  shadower: {
    slogan: "在现实里妥协，在游戏里做个坏孩子。",
    resonance:
      "你不是真的贪钱，你只是怀念当年那种“抢”到宝贝后的心跳。这是一种对日复一日、一眼望到头的生活的无声反抗。",
    image: "/quiz/jobs/shadower.png"
  },
  buccaneer: {
    slogan: "拳头砸在怪物身上，听到的却是青春碎裂的声音。",
    resonance:
      "你选海盗是因为你一直没变，哪怕生活已经让你学会了弯腰，你依然想在游戏里重现那段热血激荡的连击。",
    image: "/quiz/jobs/buccaneer.png"
  },
  corsair: {
    slogan: "每一发炮弹，都是向当年的自己致敬。",
    resonance:
      "船长的精准、算计、以及那点对效率的偏执，是你这十年在职场里磨练出的全部本领。这不仅仅是游戏，这是你的生存哲学。",
    image: "/quiz/jobs/corsair.png"
  }
};
