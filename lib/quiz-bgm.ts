export const QUIZ_BGM_SRC = "/quiz/bgm-mingzhu-gang.m4a";
export const QUIZ_BGM_MUTED_KEY = "quiz-h5-bgm-muted";

export function readQuizBgmMutedPreference() {
  if (typeof window === "undefined") {
    return false;
  }

  try {
    return window.sessionStorage.getItem(QUIZ_BGM_MUTED_KEY) === "1";
  } catch {
    return false;
  }
}

export function writeQuizBgmMutedPreference(muted: boolean) {
  try {
    window.sessionStorage.setItem(QUIZ_BGM_MUTED_KEY, muted ? "1" : "0");
  } catch {
    /* ignore */
  }
}
