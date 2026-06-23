import type { ReactNode } from "react";
import { QUIZ_BGM_SRC } from "@/lib/quiz-bgm";

export default function QuizLayout({ children }: { children: ReactNode }) {
  return (
    <main className="quiz-h5-root">
      <link rel="preload" href={QUIZ_BGM_SRC} as="fetch" type="audio/mp4" crossOrigin="anonymous" />
      {children}
    </main>
  );
}
