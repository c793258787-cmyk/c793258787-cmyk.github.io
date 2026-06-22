import type { Metadata } from "next";
import { PlayerTestQuiz } from "@/components/PlayerTestQuiz";

export const metadata: Metadata = {
  title: "职业本命测试",
  description: "沉浸式职业测试，在冒险岛的重生里找到属于你的本命职业。"
};

export default function QuizPage() {
  return <PlayerTestQuiz />;
}
