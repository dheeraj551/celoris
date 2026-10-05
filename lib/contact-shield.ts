/**
 * Celoris Contact Shield & Anti-Disintermediation Guard
 * 
 * Protects students and trainers by preventing platform leakage, off-platform contact sharing,
 * external self-promotion, and abuse. Ensures all communications stay within Celoris live rooms
 * and in-app messaging to preserve 0% commission benefits and trust.
 */

export interface ContactShieldResult {
    isClean: boolean;
    violations: string[];
    sanitizedText: string;
    riskScore: number; // 0 to 100
}

// 1. Phone number detection (Handles standard, spaced, dotted, dashed, and Indian formats)
const PHONE_REGEXES = [
    // Standard 10-digit Indian numbers starting with 6-9
    /\b[6-9]\d{9}\b/g,
    // +91 format with various spaces or dashes
    /(?:\+91|0091|91)?[-.\s]?[6-9]\d{2}[-.\s]?\d{3}[-.\s]?\d{4}\b/g,
    // Numbers formatted like 9876-543-210 or (987) 654-3210
    /\b(?:\+?\d{1,3}[-.\s]?)?\(?\d{2,4}\)?[-.\s]?\d{3,4}[-.\s]?\d{3,4}\b/g,
    // Numbers with spaces between every single digit: "9 8 7 6 5 4 3 2 1 0"
    /\b[6-9](?:[\s._-]*\d){9}\b/g,
];

// Spelled-out digit words in English and Hindi
const SPELLED_DIGITS_MAP: Record<string, string> = {
    'zero': '0', 'shunya': '0',
    'one': '1', 'ek': '1',
    'two': '2', 'do': '2',
    'three': '3', 'teen': '3',
    'four': '4', 'chaar': '4', 'char': '4',
    'five': '5', 'paanch': '5', 'panch': '5',
    'six': '6', 'chhe': '6', 'che': '6',
    'seven': '7', 'saat': '7',
    'eight': '8', 'aath': '8',
    'nine': '9', 'nau': '9',
};

// 2. Email detection (standard & obfuscated like "name [at] gmail [dot] com")
const EMAIL_REGEX = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/g;
const OBFUSCATED_EMAIL_REGEX = /\b[A-Za-z0-9._%+-]+\s*(?:\[at\]|\(at\)|\bat\b)\s*[A-Za-z0-9.-]+\s*(?:\[dot\]|\(dot\)|\bdot\b)\s*[A-Za-z]{2,}\b/gi;

// 3. Social Media, Instant Messaging & Off-Platform Leaks
const SOCIAL_AND_MESSENGER_PATTERNS = [
    // WhatsApp
    /\b(?:wa\.me|api\.whatsapp\.com|whatsapp|watsapp|wapp|w\/a)\b/gi,
    // Telegram
    /\b(?:t\.me|telegram|tele:)\b/gi,
    // Instagram / Facebook / Twitter / LinkedIn / Discord
    /\b(?:instagram\.com|insta:|ig:|facebook\.com|fb\.com|fb\.me|twitter\.com|x\.com|linkedin\.com|discord\.gg)\b/gi,
    // External Video Calling Tools (Must use Celoris Live Rooms)
    /\b(?:zoom\.us|meet\.google\.com|teams\.microsoft\.com|skype:)\b/gi,
    // Generic URL link shorteners
    /\b(?:bit\.ly|tinyurl\.com|cutt\.ly|rb\.gy|goo\.gl|t\.co)\b/gi,
];

// 4. Direct UPI payment handles (Off-platform bypass)
const UPI_REGEX = /\b[a-zA-Z0-9.\-_]{2,256}@(okhdfcbank|okaxis|okicici|oksbi|paytm|ybl|axl|ibl|upi)\b/gi;

// 5. Off-platform intent phrases
const OFF_PLATFORM_INTENT_PATTERNS = [
    /\b(?:contact\s*me\s*on|reach\s*me\s*at|call\s*me\s*directly|ping\s*me\s*on|message\s*me\s*on|dm\s*me\s*on|whatsapp\s*me|call\s*directly)\b/gi,
    /\b(?:my\s*personal\s*number|my\s*phone|my\s*contact|my\s*whatsapp)\b/gi,
];

/**
 * Normalizes text to uncover disguised digits (e.g., "9 eight 7 6...")
 */
function normalizeObfuscatedText(input: string): string {
    let normalized = input.toLowerCase();
    for (const [word, digit] of Object.entries(SPELLED_DIGITS_MAP)) {
        const regex = new RegExp(`\\b${word}\\b`, 'gi');
        normalized = normalized.replace(regex, digit);
    }
    return normalized;
}

/**
 * Scans content for contact leaks, phone numbers, emails, social handles, and external links.
 */
export function scanContactShield(rawText: string): ContactShieldResult {
    if (!rawText || typeof rawText !== 'string') {
        return { isClean: true, violations: [], sanitizedText: '', riskScore: 0 };
    }

    const violations: string[] = [];
    let sanitizedText = rawText;
    let riskScore = 0;

    // 1. Check Emails
    if (EMAIL_REGEX.test(rawText)) {
        violations.push('Direct Email Address Detected');
        riskScore += 40;
        sanitizedText = sanitizedText.replace(EMAIL_REGEX, '[Email Shielded — Use In-App Message]');
    }
    if (OBFUSCATED_EMAIL_REGEX.test(rawText)) {
        violations.push('Obfuscated Email Address Detected');
        riskScore += 40;
        sanitizedText = sanitizedText.replace(OBFUSCATED_EMAIL_REGEX, '[Email Shielded — Use In-App Message]');
    }

    // 2. Check Social & Instant Messengers
    for (const pattern of SOCIAL_AND_MESSENGER_PATTERNS) {
        if (pattern.test(rawText)) {
            violations.push('External Messenger / Social Media Link Detected');
            riskScore += 35;
            sanitizedText = sanitizedText.replace(pattern, '[External Link Removed]');
        }
    }

    // 3. Check UPI ID Leaks
    if (UPI_REGEX.test(rawText)) {
        violations.push('Direct UPI Handle Detected');
        riskScore += 35;
        sanitizedText = sanitizedText.replace(UPI_REGEX, '[Payment Handle Shielded]');
    }

    // 4. Check Phone Numbers
    for (const phoneRegex of PHONE_REGEXES) {
        if (phoneRegex.test(rawText)) {
            violations.push('Phone Number Detected');
            riskScore += 50;
            sanitizedText = sanitizedText.replace(phoneRegex, '[Phone Number Shielded]');
        }
    }

    // 5. Deep Scan on Normalized/Obfuscated Digits
    const normalized = normalizeObfuscatedText(rawText);
    const compactDigits = normalized.replace(/\D/g, '');
    // Check if there is an uninterrupted or lightly spaced 10+ digit sequence
    if (compactDigits.length >= 10 && /\b[6-9]\d{9}\b/.test(compactDigits)) {
        if (!violations.includes('Phone Number Detected')) {
            violations.push('Obfuscated Phone Number Detected');
            riskScore += 50;
            sanitizedText = '[Contact Info Shielded — Platform Protected]';
        }
    }

    // 6. Check off-platform intent keywords
    for (const intentPattern of OFF_PLATFORM_INTENT_PATTERNS) {
        if (intentPattern.test(rawText)) {
            riskScore += 20;
            if (!violations.includes('Off-Platform Solicitation Detected')) {
                violations.push('Off-Platform Solicitation Detected');
            }
        }
    }

    // 7. General external websites and links (excluding celoris domains)
    const GENERAL_URL_REGEX = /\bhttps?:\/\/(?!(?:www\.)?celoris(?:designs)?\.com)[^\s/$.?#].[^\s]*/gi;
    if (GENERAL_URL_REGEX.test(rawText)) {
        violations.push('External Website Link Detected');
        riskScore += 30;
        sanitizedText = sanitizedText.replace(GENERAL_URL_REGEX, '[External Link Removed]');
    }

    const isClean = violations.length === 0;

    return {
        isClean,
        violations,
        sanitizedText,
        riskScore: Math.min(riskScore, 100),
    };
}

/**
 * Returns a sanitized version of text with all contacts, phone numbers, and external links masked.
 */
export function maskContactInfo(text: string): string {
    if (!text || typeof text !== 'string') return '';
    return scanContactShield(text).sanitizedText;
}

/**
 * Returns a user-friendly error message detailing what was detected.
 */
export function getShieldViolationMessage(result: ContactShieldResult): string {
    if (result.isClean) return '';
    return `⚠️ Celoris Shield Protection: ${result.violations.join(', ')}. To preserve 0% commission and platform safety, all communication, classes, and contact exchange must remain within Celoris.`;
}

/**
 * Validates whether a text is safe to send. Throws a user-friendly error message if blocked.
 */
export function assertNoContactViolation(text: string): void {
    const result = scanContactShield(text);
    if (!result.isClean) {
        throw new Error(getShieldViolationMessage(result));
    }
}

