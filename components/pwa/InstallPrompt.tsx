"use client";

import React, { useEffect, useState } from "react";
import { Download, Share, X } from "lucide-react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
}

const DISMISS_KEY = "celoris_pwa_dismissed_at";
const DISMISS_COOLDOWN_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

export function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showIosBanner, setShowIosBanner] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // 1. Register lightweight service worker for PWA installability
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(() => {
        // Non-blocking
      });
    }

    // 2. Skip if already running as installed standalone app
    const isStandalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      (window.navigator as any).standalone === true;
    if (isStandalone) return;

    // 3. Respect recent user dismissal
    try {
      const dismissedAt = localStorage.getItem(DISMISS_KEY);
      if (dismissedAt && Date.now() - Number(dismissedAt) < DISMISS_COOLDOWN_MS) {
        return;
      }
    } catch {
      // Ignore storage errors
    }

    // 4. Listen for native Android / Chrome / Edge install prompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setIsVisible(true);
    };

    const handleAppInstalled = () => {
      setDeferredPrompt(null);
      setIsVisible(false);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleAppInstalled);

    // 5. Check for iOS Safari (which does not fire beforeinstallprompt)
    const ua = window.navigator.userAgent.toLowerCase();
    const isIos = /iphone|ipad|ipod/.test(ua);
    const isSafari = /safari/.test(ua) && !/crios|fxios|edgios/.test(ua);
    if (isIos && isSafari) {
      setShowIosBanner(true);
      setIsVisible(true);
    }

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    try {
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === "accepted") {
        setIsVisible(false);
        setDeferredPrompt(null);
      }
    } catch {
      setIsVisible(false);
    }
  };

  const handleDismiss = () => {
    setIsVisible(false);
    try {
      localStorage.setItem(DISMISS_KEY, String(Date.now()));
    } catch {
      // Ignore storage errors
    }
  };

  if (!isVisible || (!deferredPrompt && !showIosBanner)) {
    return null;
  }

  return (
    <div className="fixed bottom-[60px] right-4 sm:right-6 z-[60] w-[295px] sm:w-[305px] max-w-[calc(100vw-2rem)] animate-in fade-in slide-in-from-bottom-3 duration-300">
      <div className="bg-white/95 dark:bg-neutral-900/95 backdrop-blur-2xl text-slate-900 dark:text-white border border-slate-200/90 dark:border-emerald-500/30 rounded-2xl px-3 py-2.5 shadow-[0_15px_35px_rgba(0,0,0,0.18)] flex items-center gap-2.5">
        <img
          src="/icons/icon-192x192.png"
          alt="Celoris App"
          className="w-9 h-9 rounded-xl shrink-0 bg-white border border-slate-100 p-0.5 shadow-sm"
        />

        <div className="flex-1 min-w-0">
          <div className="font-bold text-xs leading-tight text-slate-900 dark:text-white truncate">
            Get the Celoris App
          </div>
          {deferredPrompt ? (
            <p className="text-[10px] text-slate-500 dark:text-neutral-300 mt-0.5 leading-snug truncate">
              Learn, Jobs &amp; Social on home screen
            </p>
          ) : (
            <p className="text-[10px] text-slate-500 dark:text-neutral-300 mt-0.5 leading-snug flex items-center flex-wrap gap-1">
              Tap <Share size={11} className="inline text-emerald-600" /> then{" "}
              <span className="font-semibold text-slate-800 dark:text-white">&quot;Add to Home Screen&quot;</span>
            </p>
          )}
        </div>

        <div className="flex items-center gap-1 shrink-0">
          {deferredPrompt && (
            <button
              onClick={handleInstallClick}
              className="px-2.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-bold flex items-center gap-1 transition-colors cursor-pointer shadow-sm"
            >
              <Download size={12} />
              Install
            </button>
          )}
          <button
            onClick={handleDismiss}
            aria-label="Dismiss install prompt"
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
