// Vercel Serverless Function: Health Check & Environment Status

export default async function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-admin-key, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const expectedAdminPassword = process.env.ADMIN_PASSWORD || process.env.ADMIN_KEY;
  const hasKey = Boolean(
    process.env.GOOGLE_CLOUD_API_KEY ||
    process.env.GOOGLE_TTS_API_KEY ||
    process.env.GEMINI_API_KEY
  );

  const headerKey = req.headers['x-admin-key'] || (req.headers['authorization'] ? req.headers['authorization'].replace(/^Bearer\s+/i, '') : null);
  const isAdminAuthenticated = expectedAdminPassword ? headerKey === expectedAdminPassword : true;

  res.json({
    status: 'ok',
    hasApiKey: hasKey,
    requiresAdminAuth: Boolean(expectedAdminPassword),
    isAdminAuthenticated,
    voices: ['Vince', 'Tera', 'Alt', 'Judy', 'Leda', 'Kore', 'Puck', 'Fenrir', 'Zephyr', 'Charon'],
  });
}
