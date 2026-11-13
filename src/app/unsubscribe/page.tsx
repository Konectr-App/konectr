// © Konectr 2026. All rights reserved.
// One-click unsubscribe handler. Reads ?token= UUID, calls unsubscribe_by_token RPC.
// Flips email_notifications_enabled = FALSE on match. Token is opaque + per-user (UUID v4).

import { supabase } from '@/lib/supabase';
import Link from 'next/link';

export const metadata = {
  title: 'Unsubscribe · Konectr',
  description: 'Manage your Konectr email preferences.',
  robots: { index: false, follow: false },
};

interface UnsubscribeResult {
  success: boolean;
  email?: string;
  error?: string;
}

async function unsubscribe(token: string): Promise<UnsubscribeResult> {
  const { data, error } = await supabase.rpc('unsubscribe_by_token', {
    p_token: token,
  });

  if (error) {
    return { success: false, error: 'rpc_error' };
  }
  return data as UnsubscribeResult;
}

export default async function UnsubscribePage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const params = await searchParams;
  const token = params.token;

  let result: UnsubscribeResult = { success: false, error: 'missing_token' };
  if (token && /^[0-9a-f-]{36}$/i.test(token)) {
    result = await unsubscribe(token);
  }

  return (
    <main className="min-h-screen bg-background flex items-start justify-center px-6 pt-20 pb-10">
      <div className="w-full max-w-[480px] bg-card rounded-2xl p-10 text-center shadow-[0_2px_12px_rgba(0,0,0,0.06)] border border-border/50">
        {result.success ? (
          <>
            <div className="text-5xl mb-4">✓</div>
            <h1 className="text-2xl font-bold text-primary mb-3">You&apos;re unsubscribed</h1>
            <p className="text-base leading-relaxed text-foreground/80">
              {result.email
                ? <>We won&apos;t send marketing emails to <strong>{result.email}</strong> anymore.</>
                : <>We won&apos;t send you marketing emails anymore.</>}
            </p>
            <p className="text-sm text-muted-foreground mt-6">
              You&apos;ll still get critical account emails (security, account changes).
            </p>
            <p className="text-sm text-foreground/80 mt-6">
              Changed your mind? Re-enable email in the Konectr app under <strong>You → Settings → Notifications</strong> (Profile → Settings on versions before 2.1).
            </p>
          </>
        ) : (
          <>
            <div className="text-5xl mb-4">ⓘ</div>
            <h1 className="text-2xl font-bold text-primary mb-3">Link expired or invalid</h1>
            <p className="text-base leading-relaxed text-foreground/80">
              This unsubscribe link isn&apos;t valid. It may have been used already or copied incorrectly.
            </p>
            <p className="text-sm text-foreground/80 mt-6">
              You can manage email preferences in the Konectr app under <strong>You → Settings → Notifications</strong> (Profile → Settings on versions before 2.1), or email{' '}
              <a href="mailto:hello@konectr.app" className="text-primary hover:underline">hello@konectr.app</a> for help.
            </p>
          </>
        )}
        <div className="mt-8">
          <Link href="/" className="text-sm text-muted-foreground underline hover:text-foreground transition-colors">
            Back to konectr.app
          </Link>
        </div>
      </div>
    </main>
  );
}
