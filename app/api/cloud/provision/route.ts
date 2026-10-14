import { NextRequest, NextResponse } from 'next/server';

const VPS_API_URL = process.env.CELORIS_CLOUD_VPS_URL || 'http://169.58.229.99:4000';
const VPS_SECRET = process.env.CELORIS_CLOUD_SECRET || 'celoris_cloud_secret_786a9f24e';

// Reserved subdomains that cannot be provisioned by users
const RESERVED_SUBDOMAINS = new Set([
  'www', 'api', 'admin', 'mail', 'smtp', 'pop', 'imap', 'ftp',
  'ns1', 'ns2', 'dns', 'cloud', 'app', 'status', 'dashboard',
  'billing', 'support', 'help', 'docs', 'dev', 'staging', 'test', 'demo'
]);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const rawSubdomain = (body.subdomain || '').toString().trim().toLowerCase();
    const title = (body.title || `${rawSubdomain} Site`).toString().trim();
    const email = (body.email || `${rawSubdomain}@celoris.in`).toString().trim();
    const adminUser = (body.adminUser || rawSubdomain).toString().trim().toLowerCase().replace(/[^a-z0-9_-]/g, '') || rawSubdomain;
    const adminPass = (body.adminPass || `celoris_${rawSubdomain}_2026`).toString().trim();

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
    return NextResponse.json(
      { 
        error: error.message || 'Failed to connect to Celoris Cloud provisioning engine. Please try again.' 
      },
      { status: 500 }
    );
  }
}
