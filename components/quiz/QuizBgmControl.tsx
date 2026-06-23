"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  QUIZ_BGM_SRC,
  readQuizBgmMutedPreference,
  writeQuizBgmMutedPreference
} from "@/lib/quiz-bgm";

function MusicIcon({ playing }: { playing: boolean }) {
  if (!playing) {
    return (
      <svg className="quiz-bgm-icon" viewBox="0 0 24 24" aria-hidden="true">
        <path
          d="M9 18.5a2.5 2.5 0 1 1-1.8-4.02V6.9l8.2-2.05v8.67a2.5 2.5 0 1 1-1.8-4.02V8.35L9 9.55v8.95Z"
          fill="currentColor"
          opacity="0.45"
        />
        <path d="M5.5 5.5l13 13" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
      </svg>
    );
  }

  return (
    <svg className="quiz-bgm-icon" viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M9 18.5a2.5 2.5 0 1 1-1.8-4.02V6.9l8.2-2.05v8.67a2.5 2.5 0 1 1-1.8-4.02V8.35L9 9.55v8.95Z"
        fill="currentColor"
      />
      <path d="M17.5 7v2.2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" className="quiz-bgm-wave quiz-bgm-wave-1" />
      <path d="M19.5 9v2.2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" className="quiz-bgm-wave quiz-bgm-wave-2" />
      <path d="M15.5 9v2.2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" className="quiz-bgm-wave quiz-bgm-wave-3" />
    </svg>
  );
}

export function QuizBgmControl() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(() => !readQuizBgmMutedPreference());
  const [ready, setReady] = useState(false);

  const playAudio = useCallback(async () => {
    const audio = audioRef.current;

    if (!audio) {
      return false;
    }

    try {
      await audio.play();
      setPlaying(true);
      writeQuizBgmMutedPreference(false);
      return true;
    } catch {
      return false;
    }
  }, []);

  const pauseAudio = useCallback(() => {
    const audio = audioRef.current;

    if (!audio) {
      return;
    }

    audio.pause();
    setPlaying(false);
    writeQuizBgmMutedPreference(true);
  }, []);

  const toggle = useCallback(async () => {
    if (playing) {
      pauseAudio();
      return;
    }

    await playAudio();
  }, [pauseAudio, playAudio, playing]);

  useEffect(() => {
    const audio = new Audio(QUIZ_BGM_SRC);
    audio.loop = true;
    audio.preload = "auto";
    audio.volume = 0.55;
    audioRef.current = audio;

    const onCanPlay = () => setReady(true);
    audio.addEventListener("canplaythrough", onCanPlay);

    let cancelled = false;

    const tryAutoplay = async () => {
      if (cancelled || readQuizBgmMutedPreference()) {
        setPlaying(false);
        return;
      }

      const ok = await playAudio();

      if (!ok && !cancelled) {
        setPlaying(false);
      }
    };

    void tryAutoplay();

    const unlock = () => {
      if (!readQuizBgmMutedPreference() && audioRef.current?.paused) {
        void playAudio();
      }
    };

    document.addEventListener("pointerdown", unlock, { once: true });
    document.addEventListener("touchstart", unlock, { once: true, passive: true });

    return () => {
      cancelled = true;
      audio.removeEventListener("canplaythrough", onCanPlay);
      document.removeEventListener("pointerdown", unlock);
      document.removeEventListener("touchstart", unlock);
      audio.pause();
      audio.src = "";
      audioRef.current = null;
    };
  }, [playAudio]);

  return (
    <button
      type="button"
      className={`quiz-bgm-toggle ${playing ? "quiz-bgm-toggle-playing" : "quiz-bgm-toggle-muted"}`}
      onClick={toggle}
      aria-pressed={playing}
      aria-label={playing ? "关闭背景音乐" : "开启背景音乐"}
      title={playing ? "关闭音乐" : "开启音乐"}
    >
      <MusicIcon playing={playing} />
      <span className="sr-only">{playing ? "音乐播放中" : "音乐已关闭"}</span>
      {!ready && playing ? <span className="quiz-bgm-loading" aria-hidden="true" /> : null}
    </button>
  );
}
