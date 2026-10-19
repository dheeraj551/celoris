import { NextRequest, NextResponse } from 'next/server';
import { createRouteClient } from '@/lib/supabase-server';
import crypto from 'crypto';

const VPS_API_URL = process.env.CELORIS_CLOUD_VPS_URL || 'http://169.58.229.99:4000';
const VPS_SECRET = process.env.CELORIS_CLOUD_SECRET || 'celoris_cloud_secret_786a9f24e';

// Reserved subdomains that cannot be provisioned by users
const RESERVED_SUBDOMAINS = new Set([
  'www', 'api', 'admin', 'mail', 'smtp', 'pop', 'imap', 'ftp',
  'ns1', 'ns2', 'dns', 'cloud', 'app', 'status', 'dashboard',
  'billing', 'support', 'help', 'docs', 'dev', 'staging', 'test', 'demo'
]);

function generateSecurePassword(length = 16): string {
  const uppercase = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
  const lowercase = 'abcdefghijkmnpqrstuvwxyz';
  const numbers = '23456789';
  const symbols = '!@#$%&*';
  const all = uppercase + lowercase + numbers + symbols;

  const result = [
    uppercase[crypto.randomInt(0, uppercase.length)],
    lowercase[crypto.randomInt(0, lowercase.length)],
    numbers[crypto.randomInt(0, numbers.length)],
    symbols[crypto.randomInt(0, symbols.length)],
  ];

  for (let i = 4; i < length; i++) {
    result.push(all[crypto.randomInt(0, all.length)]);
  }

  // Shuffle array using Fisher-Yates
  for (let i = result.length - 1; i > 0; i--) {
    const j = crypto.randomInt(0, i + 1);
    [result[i], result[j]] = [result[j], result[i]];
  }

  return result.join('');
}

export async function POST(req: NextRequest) {
  try {
    // Enforce mandatory user registration to prevent bot and spam abuse
    const supabase = await createRouteClient();
    let authUser = null;
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) authUser = user;
    } catch (_) {}

    if (!authUser) {
      const authHeader = req.headers.get('authorization') || '';
      if (authHeader.startsWith('Bearer ')) {
        const token = authHeader.substring(7);
        try {
          const { data: tokenData } = await supabase.auth.getUser(token);
          if (tokenData?.user) authUser = tokenData.user;
        } catch (_) {}
      }
    }

    if (!authUser) {
      return NextResponse.json(
        { error: 'User registration is mandatory before deploying a site. Please register or log in to launch your instance.' },
        { status: 401 }
      );
    }

    const body = await req.json();
    const rawSubdomain = (body.subdomain || '').toString().trim().toLowerCase();
    const title = (body.title || `${rawSubdomain} Site`).toString().trim();
    const email = (body.email || `${rawSubdomain}@celoris.in`).toString().trim();
    const adminUser = (body.adminUser || rawSubdomain).toString().trim().toLowerCase().replace(/[^a-z0-9_-]/g, '') || rawSubdomain;
    
    // Ensure password is not predictable
    let adminPass = (body.adminPass || '').toString().trim();
    if (!adminPass || adminPass.length < 8 || /^celoris_.*_2026$/i.test(adminPass)) {
      adminPass = generateSecurePassword(16);
    }

    // Clean subdomain: lowercase alphanumeric and hyphens only
    const slug = rawSubdomain.replace(/[^a-z0-9-]/g, '').replace(/^-+|-+$/g, '');

    if (!slug || slug.length < 3) {
      return NextResponse.json(
        { error: 'Subdomain must be at least 3 characters long and contain only letters, numbers, or hyphens.' },
        { status: 400 }
      );
    }

    if (slug.length > 30) {
      return NextResponse.json(
        { error: 'Subdomain must be 30 characters or fewer.' },
        { status: 400 }
      );
    }

    if (RESERVED_SUBDOMAINS.has(slug)) {
      return NextResponse.json(
        { error: `The subdomain "${slug}" is reserved. Please choose another name.` },
        { status: 400 }
      );
    }

    // Prohibit phishing, banking, KYC, and financial brand impersonation
    const PHISHING_KEYWORDS = [
      'login', 'signin', 'verify', 'verification', 'kyc', 'paytm', 'sbi', 'upi',
      'bank', 'hdfc', 'icici', 'axis', 'pnb', 'kotak', 'phonepe', 'gpay',
      'googlepay', 'bhim', 'aadhaar', 'uidai', 'incometax', 'pan', 'otp',
      'secure', 'account', 'auth', 'update', 'wallet', 'amazon',
      'flipkart', 'netflix', 'paypal', 'apple', 'microsoft', 'freecharge', 'cred',
      'password', 'security', 'invoice', 'telegram', 'whatsapp'
    ];

    for (const keyword of PHISHING_KEYWORDS) {
      if (slug.includes(keyword)) {
        return NextResponse.json(
          { 
            error: `Subdomain "${slug}" contains a restricted security keyword ("${keyword}"). To prevent phishing and preserve server reputation, banking and auth terms are blocked. Please choose your personal name, studio, or brand.` 
          },
          { status: 400 }
        );
      }
    }

    // Call the VPS Provisioner microservice
    const vpsResponse = await fetch(`${VPS_API_URL}/provision`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${VPS_SECRET}`,
      },
      body: JSON.stringify({
        subdomain: slug,
        title,
        email: `${slug}@celoris.in`,
        adminUser,
        adminPass,
      }),
      // Set reasonable timeout
      signal: AbortSignal.timeout(30000),
    });

    const data = await vpsResponse.json();

    if (!vpsResponse.ok) {
      return NextResponse.json(
        { 
          error: data.error || 'VPS provisioning failed',
          details: data.details || undefined 
        },
        { status: vpsResponse.status }
      );
    }

    return NextResponse.json({
      success: true,
      subdomain: slug,
      fullDomain: data.fullDomain || (data.subdomain?.includes('.') ? data.subdomain : `${slug}.celoris.in`),
      siteUrl: data.siteUrl || `https://${slug}.celoris.in`,
      adminUrl: data.adminUrl || `https://${slug}.celoris.in/wp-admin`,
      adminUser: data.adminUser || adminUser || slug,
      adminPass: data.adminPassword || data.adminPass || adminPass,
      deployedAt: new Date().toISOString(),
    });

  } catch (error: any) {
    console.error('Celoris Cloud Provisioning Error:', error);
    const isFetchFailure = error?.message?.toLowerCase().includes('fetch failed') || error?.code === 'ECONNREFUSED';
    const friendlyMessage = isFetchFailure
      ? 'The cloud provisioning engine is currently starting up or momentarily busy. Please try again in 1 minute, or reach out to our WhatsApp support for instant activation.'
      : (error?.message || 'Failed to connect to Celoris Cloud provisioning engine. Please try again.');

    return NextResponse.json(
      { error: friendlyMessage },
      { status: 500 }
    );
  }
}
