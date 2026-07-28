import type { AnalysisData } from "@/components/result/analysis-result";

export interface SampleItem {
  id: string;
  species: "cat" | "dog";
  title: string;
  titleZh: string;
  context: string;
  contextZh: string;
  audio: string;
  emoji: string;
  result: AnalysisData;
}

// Results verified by running each audio through our own API (2026-07-28)
export const samples: SampleItem[] = [
  {
    id: "cat-greeting",
    species: "cat",
    title: "A greeting meow",
    titleZh: "清亮的招呼喵叫",
    context: "Cat sees owner coming home — tail up, walking toward the door with a bright meow",
    contextZh: "猫咪看到主人回家——尾巴竖起，朝门口走过去，发出一声清亮的喵叫",
    audio: "/sounds/cat-meow.mp3",
    emoji: "🐱",
    result: {
      emotion: "happy",
      confidence: 0.85,
      text: "You're home! I heard the door and came right over — this meow is just for you.",
      text_zh: "你回来啦！我一听到门声就过来了——这声喵是专门叫给你的。",
      tts_url: null,
    },
  },
  {
    id: "cat-content",
    species: "cat",
    title: "A cozy purr",
    titleZh: "舒服满足的呼噜",
    context: "Cat is curled up on the couch next to owner, eyes half-closed, purring steadily",
    contextZh: "猫咪蜷在沙发上主人旁边，半眯着眼，发出持续的呼噜声",
    audio: "/sounds/purr.mp3",
    emoji: "🐱",
    result: {
      emotion: "happy",
      confidence: 0.95,
      text: "This spot is perfect. I'm warm, I'm safe, and you're right here — that's all I need.",
      text_zh: "这儿刚刚好。暖和、安心，你就在旁边——别的都不需要了。",
      tts_url: null,
    },
  },
  {
    id: "dog-alert",
    species: "dog",
    title: "Alert barking at the door",
    titleZh: "门口警戒吠叫",
    context: "Doorbell rang — dog is standing near the front door, ears forward, barking firmly",
    contextZh: "门铃响了——狗狗站在前门附近，耳朵前倾，发出有力的吠叫",
    audio: "/samples/dog-bark.mp3",
    emoji: "🐶",
    result: {
      emotion: "angry",
      confidence: 0.85,
      text: "Someone's at the door and I need you to know! I'm on watch — but I'll settle down once you check.",
      text_zh: "门口有人，我得让你知道！我在守着——但你去看一眼我就放心了。",
      tts_url: null,
    },
  },
  {
    id: "dog-playful",
    species: "dog",
    title: "An excited, playful bark",
    titleZh: "兴奋想玩的汪汪叫",
    context: "Owner just picked up the leash — dog is bouncing near the door, tail wagging, barking eagerly",
    contextZh: "主人刚拿起牵引绳——狗狗在门口蹦跳，尾巴狂摇，兴奋地汪汪叫",
    audio: "/samples/dog-playful.mp3",
    emoji: "🐶",
    result: {
      emotion: "excited",
      confidence: 0.82,
      text: "You grabbed the leash! That means outside — walk, walk, walk! Let's go right now!",
      text_zh: "你拿绳子了！那代表要出门了对不对——走走走！现在就去！",
      tts_url: null,
    },
  },
];
