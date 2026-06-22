import type { ReactNode } from "react";

export default function QuizLayout({ children }: { children: ReactNode }) {
  return <main className="quiz-h5-root">{children}</main>;
}
