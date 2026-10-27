// © Konectr 2026. All rights reserved.
// API route: POST /api/android-waitlist
// Captures Android waitlist signups from the web share-link RSVP page.
// Anon Supabase client → register_android_waitlist RPC (SECURITY DEFINER).

import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { clientIp, createRateLimiter } from '@/lib/rateLimit';

// 10 per IP per hour, the same cap create_web_rsvp applies (#257).
const allow = createRateLimiter(10, 60 * 60 * 1000);


// 500s never echo Postgres/Notion error text to the browser; the detail is logged server-side.
const GENERIC_500 = "Something went wrong. Please try again.";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

// utm values come from the client's sessionStorage capture — untrusted input,
// so type-check and truncate (the RPC truncates again server-side).
function sanitizeUtm(v: unknown): string | null {
  return typeof v === 'string' && v.trim() ? v.trim().slice(0, 200) : null;
}

export async function POST(request: NextRequest) {
  if (!allow(clientIp(request))) {
    return NextResponse.json(
      { error: 'Too many requests. Please try again later.' },
      { status: 429 }
    );
  }

  try {
    const body = await request.json();
    const { email, share_code, activity_id } = body;

    if (!email || typeof email !== 'string') {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    const normalized = email.trim().toLowerCase();
    if (normalized.length === 0 || normalized.length > 254 || !EMAIL_REGEX.test(normalized)) {
      return NextResponse.json(
        { error: 'Please enter a valid email' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase.rpc('register_android_waitlist', {
      p_email: normalized,
      p_share_code: typeof share_code === 'string' ? share_code : null,
      p_activity_id: typeof activity_id === 'string' ? activity_id : null,
      p_utm_source: sanitizeUtm(body.utm_source),
      p_utm_medium: sanitizeUtm(body.utm_medium),
      p_utm_campaign: sanitizeUtm(body.utm_campaign),
    });

    if (error) {
      console.error('Android waitlist RPC error:', error.message);
      return NextResponse.json(
        { error: GENERIC_500 },
        { status: 500 }
      );
    }

    return NextResponse.json(data ?? { ok: true });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to register';
    console.error('Android waitlist error:', message);
    return NextResponse.json({ error: GENERIC_500 }, { status: 500 });
  }
}
