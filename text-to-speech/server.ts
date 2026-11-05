import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { GoogleGenAI, Modality } from '@google/genai';

dotenv.config();

const app = express();

function resolvePort(): number {
  const portArgIndex = process.argv.indexOf('--port');
  if (portArgIndex !== -1 && process.argv[portArgIndex + 1]) {
    const val = parseInt(process.argv[portArgIndex + 1], 10);
    if (!isNaN(val) && val > 0) return val;
  }
  return 3000;
}

const PORT = resolvePort();

app.use(express.json({ limit: '10mb' }));

// Helper function to prepend a standard 44-byte WAV header to raw 16-bit PCM audio
function pcmToWav(pcmBuffer: Buffer, sampleRate = 24000, numChannels = 1, bitsPerSample = 16): Buffer {
  const byteRate = (sampleRate * numChannels * bitsPerSample) / 8;
  const blockAlign = (numChannels * bitsPerSample) / 8;
  const dataSize = pcmBuffer.length;
  const header = Buffer.alloc(44);

  // RIFF chunk descriptor
  header.write('RIFF', 0);
  header.writeUInt32LE(36 + dataSize, 4);
  header.write('WAVE', 8);

  // "fmt " sub-chunk
  header.write('fmt ', 12);
  header.writeUInt32LE(16, 16);
  header.writeUInt16LE(1, 20); // PCM
  header.writeUInt16LE(numChannels, 22);
  header.writeUInt32LE(sampleRate, 24);
  header.writeUInt32LE(byteRate, 28);
  header.writeUInt16LE(blockAlign, 32);
  header.writeUInt16LE(bitsPerSample, 34);

  // "data" sub-chunk
  header.write('data', 36);
  header.writeUInt32LE(dataSize, 40);

  return Buffer.concat([header, pcmBuffer]);
}

// Character Personas and Gemini Prebuilt Voice Mapping
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

const GEMINI_ALLOWED_VOICES = [
  'Puck',
  'Charon',
  'Kore',
  'Fenrir',
  'Aoede',
  'Leda',
  'Zephyr',
  'Orus',
  'Enceladus',
  'Callirrhoe',
  'Autonoe',
  'Despina',
  'Erinome',
  'Laomedeia',
  'Achernar',
  'Vindemiatrix',
  'Sulafat',
  'Iapetus',
  'Umbriel',
  'Algieba',
  'Algenib',
  'Rasalgethi',
  'Alnilam',
  'Schedar',
  'Gacrux',
  'Pulcherrima',
  'Achird',
  'Zubenelgenubi',
  'Sadachbia',
  'Sadaltager',
];

// Health check and environment status
app.get('/api/health', (req, res) => {
  const hasKey = Boolean(
    process.env.GEMINI_API_KEY ||
    process.env.GOOGLE_CLOUD_API_KEY ||
    process.env.GOOGLE_TTS_API_KEY
  );

  res.json({
    status: 'ok',
    hasApiKey: hasKey,
    engine: 'Gemini Multimodal Native Audio (AI Studio)',
    voices: ['Vince', 'Tera', 'Alt', 'Judy', ...GEMINI_ALLOWED_VOICES],
  });
});

// Primary Text-to-Speech Endpoint using Gemini AI Studio Multimodal Engine
app.post('/api/tts', async (req, res) => {
  try {
    const { text, voice = 'Vince', style = 'natural' } = req.body;

    if (!text || typeof text !== 'string' || !text.trim()) {
      return res.status(400).json({ error: 'Please provide valid text to synthesize.' });
    }

    const trimmedText = text.trim();
    if (trimmedText.length > 5000) {
      return res.status(400).json({ error: 'Text exceeds maximum limit of 5,000 characters.' });
    }

    const apiKey =
      (req.headers['x-api-key'] as string) ||
      req.body.apiKey ||
      process.env.GEMINI_API_KEY ||
      process.env.GOOGLE_CLOUD_API_KEY ||
      process.env.GOOGLE_TTS_API_KEY;

    if (!apiKey) {
      return res.status(500).json({
        error: 'Gemini API key is not configured. Please paste your key in Settings or add to .env.',
      });
    }

    // Determine voice and prompt prefix
    let selectedGeminiVoice = 'Fenrir';
    let promptPrefix = '';

    if (CHARACTER_CONFIG[voice]) {
      selectedGeminiVoice = CHARACTER_CONFIG[voice].geminiVoice;
      promptPrefix = CHARACTER_CONFIG[voice].promptPrefix;
    } else if (GEMINI_ALLOWED_VOICES.includes(voice)) {
      selectedGeminiVoice = voice;
    }

    // Override or add style prefix if selected and not default natural
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

    // Try Gemini Multimodal TTS models (AI Studio engine)
    const modelsToTry = [
      'gemini-2.5-flash',
      'gemini-2.0-flash',
      'gemini-3.8-flash-lite-tts',
      'gemini-3.8-flash-tts',
    ];

    let response: any = null;
    let lastError: any = null;

    for (const model of modelsToTry) {
      try {
        response = await ai.models.generateContent({
          model,
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

        if (response?.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data) {
          break; // Success!
        }
      } catch (err: any) {
        lastError = err;
        console.warn(`Model ${model} failed, trying next model:`, err?.message || err);
        // If quota exceeded on this specific key, break and report
        if (
          err?.status === 429 ||
          err?.message?.includes('429') ||
          err?.message?.includes('RESOURCE_EXHAUSTED')
        ) {
          break;
        }
      }
    }

    const base64Audio = response?.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;

    if (!base64Audio) {
      const errMsg = lastError?.message || 'No audio received from Gemini AI Studio engine.';
      console.error('Gemini TTS generation error:', errMsg);
      const isQuota =
        lastError?.status === 429 ||
        errMsg.includes('429') ||
        errMsg.includes('RESOURCE_EXHAUSTED') ||
        errMsg.includes('Quota exceeded');

      return res.status(isQuota ? 429 : 502).json({
        error: isQuota
          ? 'Gemini API Free Tier quota reached. Please link your Celoris n8n billing project in AI Studio to get unlimited generations.'
          : errMsg,
        isQuotaExhausted: isQuota,
      });
    }

    const rawBuffer = Buffer.from(base64Audio, 'base64');
    let wavBuffer: Buffer;

    // Check if output is already RIFF WAV
    if (rawBuffer.length >= 4 && rawBuffer.toString('ascii', 0, 4) === 'RIFF') {
      wavBuffer = rawBuffer;
    } else {
      // Gemini returns raw 24kHz 16-bit mono PCM
      wavBuffer = pcmToWav(rawBuffer, 24000, 1, 16);
    }

    const pcmByteCount = Math.max(0, wavBuffer.length - 44);
    const durationSeconds = +(pcmByteCount / (24000 * 1 * 2)).toFixed(2);

    res.json({
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
    console.error('Server TTS error:', error);
    res.status(500).json({
      error: error?.message || 'Internal error synthesizing speech with Gemini.',
    });
  }
});

// Vite middleware & Static serving
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  const server = app.listen(PORT, '0.0.0.0', () => {
    console.log(`Celoris FM AI Studio Voice Server running on http://0.0.0.0:${PORT}`);
  });

  server.on('error', (err: any) => {
    if (err.code === 'EADDRINUSE') {
      console.warn(`Port ${PORT} in use, retrying in 1s...`);
      setTimeout(() => {
        server.close();
        server.listen(PORT, '0.0.0.0');
      }, 1000);
    } else {
      console.error('Server listen error:', err);
    }
  });

  const shutdown = () => {
    server.close(() => {
      process.exit(0);
    });
  };

  process.on('SIGTERM', shutdown);
  process.on('SIGINT', shutdown);
}

startServer().catch((err) => {
  console.error('Fatal error starting server:', err);
  process.exit(1);
});
