import { NextRequest, NextResponse } from 'next/server';
import { createRouteClient } from '@/lib/supabase-server';

const VPS_API_URL = process.env.CELORIS_CLOUD_VPS_URL || 'http://169.58.229.99:4000';
const VPS_SECRET = process.env.CELORIS_CLOUD_SECRET || 'celoris_cloud_secret_786a9f24e';

export async function POST(req: NextRequest) {
  try {
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
        { error: 'Authentication required to delete a site.' },
        { status: 401 }
      );
    }

    const body = await req.json();
    const rawSubdomain = (body.subdomain || '').toString().trim().toLowerCase();
    const slug = rawSubdomain.replace(/[^a-z0-9-]/g, '').replace(/^-+|-+$/g, '');

    if (!slug || slug.length < 3) {
      return NextResponse.json({ error: 'Valid subdomain is required.' }, { status: 400 });
    }

    const vpsResponse = await fetch(`${VPS_API_URL}/delete`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${VPS_SECRET}`,
      },
      body: JSON.stringify({ subdomain: slug }),
      signal: AbortSignal.timeout(15000),
    });

    const data = await vpsResponse.json();

    if (!vpsResponse.ok) {
      return NextResponse.json({ error: data.error || 'Failed to delete site' }, { status: vpsResponse.status });
    }

    return NextResponse.json({
      success: true,
      subdomain: slug,
      message: data.message || `Site ${slug}.celoris.in was successfully deleted and freed.`,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to connect to provisioner daemon.' },
      { status: 500 }
    );
  }
}
