// © Konectr 2026. All rights reserved.
// Proprietary and confidential.
'use client';

import { useEffect, useRef } from 'react';

// State 3 — withdraw your own intent. Konectr has no host, so "cancelling" only
// ever means pulling your OWN spot; the group isn't cancelled. The seat is ALWAYS
// released; inside the 3h cutoff the withdrawal is "late" so the crew is notified
// immediately (server-authoritative). Phases mirror ActivityRsvpPage's `cancelPhase`.

export type WithdrawPhase = 'confirming' | 'working' | 'withdrawn' | 'error';

export interface WithdrawSheetProps {
  phase: WithdrawPhase;
  /** Inside the 3h cutoff — spot still freed, but the crew is notified right away. */
  isLate: boolean;
  venueShort: string;
  errorMessage?: string | null;
  onConfirm: () => void;
  onDismiss: () => void;
  /** After a successful withdraw, return to the claim screen. */
  onDone?: () => void;
  onRetry?: () => void;
}

export default function WithdrawSheet(p: WithdrawSheetProps) {
  const sheetRef = useRef<HTMLDivElement>(null);
  // Latest onDismiss without re-running the mount-once effect (parent re-renders
  // on teaser polls; we don't want to re-lock scroll or steal focus each time).
  const dismissRef = useRef(p.onDismiss);
  useEffect(() => { dismissRef.current = p.onDismiss; });

  // Lock body scroll, close on Escape, and trap focus within the sheet while open.
  useEffect(() => {
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const sheet = sheetRef.current;
    const focusables = () =>
      Array.from(
        sheet?.querySelectorAll<HTMLElement>(
          'button:not([disabled]), a[href], input, [tabindex]:not([tabindex="-1"])',
        ) ?? [],
      );
    focusables()[0]?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        dismissRef.current();
        return;
      }
      if (e.key !== 'Tab') return;
      const els = focusables();
      if (els.length === 0) return;
      const first = els[0];
      const last = els[els.length - 1];
      const active = document.activeElement as HTMLElement | null;
      if (e.shiftKey && active === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && active === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      document.removeEventListener('keydown', onKey);
    };
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center lg:items-center">
      {/* Scrim */}
      <button
        aria-label="Close"
        tabIndex={-1}
        onClick={p.onDismiss}
        className="absolute inset-0 bg-[rgba(12,10,8,0.55)] backdrop-blur-[2px]"
      />
      {/* Sheet */}
      <div
        ref={sheetRef}
        role="dialog"
        aria-modal="true"
        aria-label="Withdraw from this plan"
        className="relative w-full max-w-[480px] bg-[#FAFAFA] rounded-t-[26px] lg:rounded-[26px] px-[22px] pt-[14px] pb-8 shadow-[0_-20px_60px_-20px_rgba(0,0,0,0.4)] lg:shadow-[0_30px_80px_-20px_rgba(0,0,0,0.5)]"
      >
        <div className="mx-auto w-10 h-[5px] rounded-full bg-[#E0DCD8] lg:hidden" />

        {p.phase === 'confirming' && <Confirming {...p} />}
        {p.phase === 'working' && <Working />}
        {p.phase === 'withdrawn' && <Withdrawn isLate={p.isLate} onDone={p.onDone ?? p.onDismiss} />}
        {p.phase === 'error' && <ErrorState message={p.errorMessage} onRetry={p.onRetry ?? p.onConfirm} onDismiss={p.onDismiss} />}
      </div>
    </div>
  );
}

function Confirming({ isLate, venueShort, onConfirm, onDismiss }: WithdrawSheetProps) {
  return (
    <div className="mt-3">
      <div className="w-12 h-12 rounded-[15px] bg-[#FFF4F1] grid place-items-center text-[24px]">👋</div>
      <h2 className="font-[family-name:var(--font-heading)] font-black text-[23px] -tracking-[0.03em] mt-4">
        Give up your spot?
      </h2>
      <p className="text-[14.5px] leading-[1.5] text-[#616161] mt-2">
        No worries — your seat at <b className="text-[#1F1F1F]">{venueShort}</b> frees up for someone else
        right away. The plan carries on without you.
      </p>

      {isLate && (
        <div className="mt-4 flex items-start gap-[10px] bg-[#FFF9E9] border border-[#F6E4AE] rounded-[14px] p-[13px]">
          <span className="text-[16px] leading-none mt-[1px]">⏱️</span>
          <span className="text-[12.5px] leading-[1.45] text-[#8A6D1F]">
            It&apos;s less than <b className="text-[#8A6D1F]">3 hours</b> to start — the group will be notified
            right away.
          </span>
        </div>
      )}

      <button
        onClick={onConfirm}
        className="w-full mt-5 rounded-[15px] py-[16px] font-[family-name:var(--font-heading)] font-black text-[16px] text-white bg-[#1F1F1F] hover:bg-[#000] active:scale-[0.98] transition-all"
      >
        {isLate ? 'Withdraw & let them know' : 'Yes, free up my spot'}
      </button>
      <button
        onClick={onDismiss}
        className="w-full mt-[10px] rounded-[15px] py-[14px] font-bold text-[15px] text-[#616161]"
      >
        Never mind, I&apos;m still in
      </button>
    </div>
  );
}

function Working() {
  return (
    <div className="py-10 text-center">
      <div className="mx-auto w-8 h-8 rounded-full border-[3px] border-[#F0EEEC] border-t-[#FF774D] animate-spin" />
      <p className="text-[14px] text-[#616161] mt-4 font-semibold">Updating your spot…</p>
    </div>
  );
}

function Withdrawn({ isLate, onDone }: { isLate: boolean; onDone: () => void }) {
  return (
    <div className="mt-3">
      <div className="w-12 h-12 rounded-[15px] bg-[#E9F7EF] grid place-items-center">
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="#1FA463" strokeWidth={2.8} strokeLinecap="round" strokeLinejoin="round">
          <polyline points="4 12 10 18 20 6" />
        </svg>
      </div>
      <h2 className="font-[family-name:var(--font-heading)] font-black text-[23px] -tracking-[0.03em] mt-4">
        Done — you&apos;re out.
      </h2>
      <p className="text-[14.5px] leading-[1.5] text-[#616161] mt-2">
        {isLate ? (
          <>
            Your spot&apos;s been released. Since it was close to start time, we&apos;ve let the group know
            right away.
          </>
        ) : (
          <>Your spot&apos;s been released. Changed your mind? You can grab it again while there&apos;s room.</>
        )}
      </p>
      <button
        onClick={onDone}
        className="w-full mt-5 rounded-[15px] py-[16px] font-[family-name:var(--font-heading)] font-black text-[16px] text-[#1F1F1F] bg-[#FF774D] hover:bg-[#E6693F] active:scale-[0.98] transition-all"
      >
        Back to the plan
      </button>
    </div>
  );
}

function ErrorState({ message, onRetry, onDismiss }: { message?: string | null; onRetry: () => void; onDismiss: () => void }) {
  return (
    <div className="mt-3">
      <div className="w-12 h-12 rounded-[15px] bg-[#FDECEC] grid place-items-center text-[24px]">⚠️</div>
      <h2 className="font-[family-name:var(--font-heading)] font-black text-[23px] -tracking-[0.03em] mt-4">
        That didn&apos;t go through.
      </h2>
      <p className="text-[14.5px] leading-[1.5] text-[#616161] mt-2">
        {message || 'Something went wrong on our end. Give it another try.'}
      </p>
      <button
        onClick={onRetry}
        className="w-full mt-5 rounded-[15px] py-[16px] font-[family-name:var(--font-heading)] font-black text-[16px] text-[#1F1F1F] bg-[#FF774D] hover:bg-[#E6693F] active:scale-[0.98] transition-all"
      >
        Try again
      </button>
      <button onClick={onDismiss} className="w-full mt-[10px] rounded-[15px] py-[14px] font-bold text-[15px] text-[#616161]">
        Close
      </button>
    </div>
  );
}
