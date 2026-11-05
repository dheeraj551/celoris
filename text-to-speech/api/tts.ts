import { GoogleGenAI, Modality } from '@google/genai';

function pcmToWav(pcmBuffer: Buffer, sampleRate = 24000, numChannels = 1, bitsPerSample = 16): Buffer {
  const byteRate = (sampleRate * numChannels * bitsPerSample) / 8;
  const blockAlign = (numChannels * bitsPerSample) / 8;
  const dataSize = pcmBuffer.length;
  const header = Buffer.alloc(44);

  header.write('RIFF', 0);
  header.writeUInt32LE(36 + dataSize, 4);
  header.write('WAVE', 8);

  header.write('fmt ', 12);
  header.writeUInt32LE(16, 16);
  header.writeUInt16LE(1, 20);
  header.writeUInt16LE(numChannels, 22);
  header.writeUInt32LE(sampleRate, 24);
  header.writeUInt32LE(byteRate, 28);
  header.writeUInt16LE(blockAlign, 32);
  header.writeUInt16LE(bitsPerSample, 34);

  header.write('data', 36);
  header.writeUInt32LE(dataSize, 40);

  return Buffer.concat([header, pcmBuffer]);
}

const CHARACTER_CONFIG: Record<string, { geminiVoice: string; promptPrefix: string }> = {
  Vince: {
    geminiVoice: 'Fenrir',
    promptPrefix:
      'Speak in the persona of Vince, lead broadcast radio host on Celoris FM 99.1 in Night City. Your voice is a charismatic, deep, dynamic radio DJ baritone with warm analog mic energy and punchy cadence: ',
  },
  Tera: {
    geminiVoice: 'Aoede',
    promptPrefix:
      'Speak in the persona of Tera, co-host on Celoris FM 99.1 in Night City. Your voice is lively, quick-witted, stylish, expressive, and conversational: ',
  },
  Alt: {
    geminiVoice: 'Leda',
    promptPrefix:
      'Speak in the persona of Alt Cunningham, a legendary female netrunner consciousness beyond the Blackwall in cyberspace. Your voice is cold, synthetic yet hauntingly resonant, sounding less like a person and more like pure data streaming through a compromised neural connection: ',
  },
  Judy: {
    geminiVoice: 'Kore',
    promptPrefix:
      "Speak in the persona of Judy Alvarez from Cyberpunk 2077, premier braindance technician at Lizzie's Bar. Your voice is street-smart, warm, slightly raspy, intimate, and authentic: ",
  },
};

const STYLE_PROMPTS: Record<string, string> = {
  natural: '',
  alt_netrunner:
    'Speak in the persona of Alt Cunningham, a transcendent netrunner consciousness beyond the Blackwall. Cold, electronic, haunting, data-stream cadence: ',
  judy_braindance:
    "Speak in the persona of Judy Alvarez editing a raw braindance in Lizzie's basement. Intimate, warm, slightly raspy, authentic: ",
  cheerful: 'Speak cheerfully and with a bright, smiling, optimistic tone: ',
  dramatic: 'Speak in an engaging, cinematic, dramatic storytelling voice: ',
  newscaster: 'Speak in a crisp, clear, authoritative broadcast news anchor style: ',
  calm: 'Speak in a calm, soothing, gentle, and relaxing tone: ',
  energetic: 'Speak with vibrant energy, high enthusiasm, and passion: ',
  whisper: 'Speak softly in a gentle, warm, close-mic whisper: ',
  formal: 'Speak in a dignified, professional, formal tone: ',
  empathetic: 'Speak with heartfelt empathy, warmth, and compassion: ',
};

export default async function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-admin-key, x-api-key, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const expectedAdminPassword = process.env.ADMIN_PASSWORD || process.env.ADMIN_KEY;
  if (expectedAdminPassword) {
    const headerKey = req.headers['x-admin-key'] || (req.headers['authorization'] ? req.headers['authorization'].replace(/^Bearer\s+/i, '') : null);
    if (!headerKey || headerKey !== expectedAdminPassword) {
      return res.status(401).json({
        error: '🔒 Access Denied: Admin authorization required.',
        requiresAdminAuth: true,
      });
    }
  }

  const apiKey =
    req.headers['x-api-key'] ||
    req.body.apiKey ||
    process.env.GEMINI_API_KEY ||
    process.env.GOOGLE_CLOUD_API_KEY ||
    process.env.GOOGLE_TTS_API_KEY;

  if (!apiKey) {
    return res.status(500).json({
      error: 'Gemini API key is not configured.',
    });
  }

  try {
    const { text, voice = 'Vince', style = 'natural' } = req.body;
    const trimmedText = text.trim();

    let selectedGeminiVoice = 'Fenrir';
    let promptPrefix = '';

    if (CHARACTER_CONFIG[voice]) {
      selectedGeminiVoice = CHARACTER_CONFIG[voice].geminiVoice;
      promptPrefix = CHARACTER_CONFIG[voice].promptPrefix;
    } else {
      selectedGeminiVoice = voice;
    }

    if (style && style !== 'natural' && STYLE_PROMPTS[style]) {
      promptPrefix = STYLE_PROMPTS[style];
    }

    const fullPrompt = promptPrefix ? `${promptPrefix}${trimmedText}` : trimmedText;

    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [{ parts: [{ text: fullPrompt }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: selectedGeminiVoice },
          },
        },
      },
    });

    const base64Audio = response?.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (!base64Audio) {
      return res.status(502).json({ error: 'No audio data received from Gemini.' });
    }

    const rawBuffer = Buffer.from(base64Audio, 'base64');
    let wavBuffer: Buffer;
    if (rawBuffer.length >= 4 && rawBuffer.toString('ascii', 0, 4) === 'RIFF') {
      wavBuffer = rawBuffer;
    } else {
      wavBuffer = pcmToWav(rawBuffer, 24000, 1, 16);
    }

    const pcmByteCount = Math.max(0, wavBuffer.length - 44);
    const durationSeconds = +(pcmByteCount / (24000 * 1 * 2)).toFixed(2);

    return res.json({
      success: true,
      audioBase64: wavBuffer.toString('base64'),
      mimeType: 'audio/wav',
      duration: durationSeconds,
      voice,
      geminiVoice: selectedGeminiVoice,
      style,
      charCount: trimmedText.length,
      timestamp: Date.now(),
    });
  } catch (error: any) {
    console.error('TTS error:', error);
    return res.status(500).json({
      error: error?.message || 'Error synthesizing speech.',
    });
  }
}
