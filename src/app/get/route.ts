// © Konectr 2026. All rights reserved.
// Proprietary and confidential.
//
// konectr.app/get sends a phone to its own store. The desktop QR code on the
// landing page points here, so one code works for iPhone and Android.

import { NextRequest, NextResponse } from 'next/server';
import { ANDROID_STORE_URL, IOS_STORE_URL } from '@/lib/smartLink';
import { parseCity, withCampaign } from '@/lib/landingCity';

export function GET(request: NextRequest) {
  const ua = request.headers.get('user-agent') ?? '';
  const source = request.nextUrl.searchParams.get('src') ?? 'get';
  const city = parseCity(request.nextUrl.search);

  if (/Android/i.test(ua)) {
    return NextResponse.redirect(withCampaign(ANDROID_STORE_URL, 'android', { source, city }), 302);
  }
  if (/iPhone|iPad|iPod/i.test(ua)) {
    return NextResponse.redirect(withCampaign(IOS_STORE_URL, 'ios', { source, city }), 302);
  }
  return NextResponse.redirect(new URL('/en', request.url), 302);
}
