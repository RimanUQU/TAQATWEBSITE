"use client";
import { useEffect, useState } from "react";

const STORAGE_KEY = "taqat-intro-seen";

export function IntroSplash() {
  const [visible, setVisible] = useState(false);
  const [stage, setStage] = useState(0);
  const [showSkip, setShowSkip] = useState(false);
  const [dismissing, setDismissing] = useState(false);

  function dismiss() {
    setDismissing(true);
    try {
      sessionStorage.setItem(STORAGE_KEY, "1");
    } catch {
      // localStorage/sessionStorage blocked (private mode etc.) - safe to ignore
    }
    setTimeout(() => setVisible(false), 400);
  }

  useEffect(() => {
    let seen = false;
    try {
      seen = sessionStorage.getItem(STORAGE_KEY) === "1";
    } catch {
      seen = false;
    }
    if (seen) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      try {
        sessionStorage.setItem(STORAGE_KEY, "1");
      } catch {
        // ignore
      }
      return; // never show the overlay - respects reduced-motion, homepage renders as-is
    }
    // One-time check of sessionStorage/matchMedia right after mount to decide
    // whether to play the intro at all; only client APIs, unavailable during
    // SSR/render, and this effect runs exactly once (empty deps) so it can't cascade.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setVisible(true);
    const timers = [
      setTimeout(() => setStage(1), 700),
      setTimeout(() => setStage(2), 2100),
      setTimeout(() => setShowSkip(true), 900),
      setTimeout(() => dismiss(), 3400),
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  if (!visible) return null;

  return (
    <div className={`intro-splash ${dismissing ? "dismissing" : ""}`} role="presentation">
      <div className="intro-stage">
        <img src="/intro/stem.svg" alt="" className="intro-frame active" />
        <img src="/intro/stem-bloom.svg" alt="" className={`intro-frame ${stage >= 1 ? "active" : ""}`} />
        <img
          src="/intro/logo-mark.svg"
          alt="نادي طاقات للفتيات"
          className={`intro-frame ${stage >= 2 ? "active" : ""}`}
        />
      </div>
      {showSkip && (
        <button type="button" className="intro-skip" onClick={dismiss} aria-label="تخطي المقدمة">
          تخطي
        </button>
      )}
    </div>
  );
}
