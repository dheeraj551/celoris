"use client";

import Clarity from "@microsoft/clarity";

export const CLARITY_PROJECT_ID = process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID || "";

let isInitialized = false;

/**
 * Initialize Microsoft Clarity client-side
 * @param projectId Project ID from Microsoft Clarity dashboard
 */
export function initClarity(projectId: string = CLARITY_PROJECT_ID) {
  if (typeof window === "undefined") return;
  if (!projectId || isInitialized) return;

  try {
    Clarity.init(projectId);
    isInitialized = true;
  } catch (err) {
    console.warn("Failed to initialize Microsoft Clarity:", err);
  }
}

/**
 * Set custom identifier for user session recordings in Clarity
 */
export function identifyUser(
  customId: string,
  customSessionId?: string,
  customPageId?: string,
  friendlyName?: string
) {
  if (typeof window === "undefined" || !isInitialized) return;
  try {
    Clarity.identify(customId, customSessionId, customPageId, friendlyName);
  } catch (err) {
    console.warn("Clarity identify failed:", err);
  }
}

/**
 * Set custom key-value tags in Clarity
 */
export function setClarityTag(key: string, value: string | string[]) {
  if (typeof window === "undefined" || !isInitialized) return;
  try {
    Clarity.setTag(key, value);
  } catch (err) {
    console.warn("Clarity setTag failed:", err);
  }
}

/**
 * Track custom events in Clarity
 */
export function trackClarityEvent(eventName: string) {
  if (typeof window === "undefined" || !isInitialized) return;
  try {
    Clarity.event(eventName);
  } catch (err) {
    console.warn("Clarity event failed:", err);
  }
}

/**
 * Provide user cookie consent to Clarity
 */
export function setClarityConsent(consent: boolean = true) {
  if (typeof window === "undefined" || !isInitialized) return;
  try {
    Clarity.consent(consent);
  } catch (err) {
    console.warn("Clarity consent failed:", err);
  }
}

export { Clarity };
export default Clarity;
