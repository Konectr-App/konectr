// © Konectr 2026. All rights reserved.
// Proprietary and confidential.

import Link from 'next/link';

export default function Footer() {
  return (
    <p className="mt-6 text-center text-[#999] text-xs">
      <Link href="/" className="hover:text-[#FF774D]">konectr.app</Link> · Your plan. New people. Nearby.
    </p>
  );
}
