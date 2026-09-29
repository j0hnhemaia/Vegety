"use client";

import { useEffect, useRef } from "react";

/**
 * Wraps a decoration layer and publishes a bounded progress value --p
 * (~ -0.5 … 0.5 = how far this group's centre is from the viewport centre)
 * onto itself. Children with the `.parallax` class read --p and translate by
 * `--p * --spd px`, so movement stays LOCAL to the group instead of growing
 * with total page scroll.
 *
 * Mobile notes (desktop behaviour is unchanged):
 *  - --p is CLAMPED. A group that is much taller than the viewport (the Hero
 *    stacks instead of sitting side-by-side on phones) would otherwise push
 *    --p well past its intended range and fling the leaves around.
 *  - The viewport height is CACHED. Mobile browsers collapse/expand the URL
 *    bar mid-scroll, changing innerHeight by ~60-100px; reading it live made
 *    every element visibly jump without the page having scrolled.
 */

// Desktop groups peak near ±0.9, so this caps phone overshoot without
// altering how the effect already looks on a wide screen.
const P_LIMIT = 0.9;

// Ignore innerHeight changes smaller than this — they're browser chrome
// showing/hiding, not a real resize.
const VH_EPSILON = 120;

export default function Parallax({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let vh = window.innerHeight || 1;
    let raf = 0;

    const update = () => {
      const r = el.getBoundingClientRect();
      const raw = (r.top + r.height / 2 - vh / 2) / vh;
      const p = Math.min(P_LIMIT, Math.max(-P_LIMIT, raw));
      el.style.setProperty("--p", p.toFixed(4));
      raf = 0;
    };

    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };

    // Compared against the cached value (not the previous event), so a gradual
    // desktop window resize still syncs once it adds up past the threshold.
    const onResize = () => {
      const next = window.innerHeight || 1;
      if (Math.abs(next - vh) > VH_EPSILON) vh = next;
      onScroll();
    };

    const onOrientation = () => {
      vh = window.innerHeight || 1;
      onScroll();
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    window.addEventListener("orientationchange", onOrientation);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("orientationchange", onOrientation);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div ref={ref} className={className} aria-hidden>
      {children}
    </div>
  );
}
