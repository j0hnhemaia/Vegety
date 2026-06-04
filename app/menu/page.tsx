import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MenuExplorer from "@/components/MenuExplorer";
import { LeafFill } from "@/components/icons";
import { fetchMenu } from "@/lib/fetch-menu";

export const metadata: Metadata = {
  title: "Menu — Vegety",
  description: "Browse our full menu of fresh salads, bowls, breakfasts and drinks. Search and filter by category.",
};

// Short ISR: served from cache (instant), regenerated in the background every
// 10s so menu edits appear quickly without ever blocking on the slow webhook.
export const revalidate = 10;

export default async function MenuPage() {
  const menu = await fetchMenu();

  return (
    <>
      <Navbar />
      <main className="relative overflow-hidden bg-gradient-to-b from-brand-50 via-brand-50/40 to-white">
        {/* leaves drifting across the page — scattered heights/sizes/speeds */}
        <div className="pointer-events-none absolute inset-0" aria-hidden>
          {[
            { top: "33%", size: "h-11 w-11", tone: "text-brand-400/80", dur: "27s", delay: "-3s", rot: "rotate-12" },
            { top: "41%", size: "h-10 w-10", tone: "text-brand-300/90", dur: "36s", delay: "-20s", rot: "-rotate-6" },
            { top: "49%", size: "h-12 w-12", tone: "text-brand-400/80", dur: "31s", delay: "-10s", rot: "rotate-45" },
            { top: "57%", size: "h-10 w-10", tone: "text-brand-300/85", dur: "40s", delay: "-33s", rot: "-rotate-12" },
            { top: "65%", size: "h-11 w-11", tone: "text-brand-400/80", dur: "29s", delay: "-16s", rot: "rotate-6" },
            { top: "73%", size: "h-10 w-10", tone: "text-brand-300/90", dur: "44s", delay: "-40s", rot: "rotate-90" },
            { top: "82%", size: "h-11 w-11", tone: "text-brand-400/80", dur: "33s", delay: "-25s", rot: "-rotate-45" },
            { top: "91%", size: "h-10 w-10", tone: "text-brand-300/85", dur: "37s", delay: "-7s", rot: "rotate-12" },
          ].map((l, i) => (
            <span
              key={i}
              className={`animate-cross absolute ${l.size} ${l.tone}`}
              style={{ top: l.top, ["--cd" as string]: l.dur, animationDelay: l.delay } as React.CSSProperties}
            >
              <LeafFill className={`h-full w-full ${l.rot}`} />
            </span>
          ))}
          {/* extra leaves on phones only — the page is much taller and shows one
              card at a time, so denser drift keeps leaves behind the cards. */}
          {[
            { top: "37%", size: "h-10 w-10", tone: "text-brand-400/80", dur: "30s", delay: "-12s", rot: "rotate-45" },
            { top: "45%", size: "h-12 w-12", tone: "text-brand-300/90", dur: "34s", delay: "-28s", rot: "-rotate-12" },
            { top: "53%", size: "h-9 w-9", tone: "text-brand-400/85", dur: "28s", delay: "-5s", rot: "rotate-90" },
            { top: "61%", size: "h-11 w-11", tone: "text-brand-300/90", dur: "38s", delay: "-22s", rot: "-rotate-45" },
            { top: "69%", size: "h-10 w-10", tone: "text-brand-400/80", dur: "32s", delay: "-9s", rot: "rotate-6" },
            { top: "77%", size: "h-12 w-12", tone: "text-brand-300/90", dur: "35s", delay: "-30s", rot: "rotate-12" },
            { top: "86%", size: "h-9 w-9", tone: "text-brand-400/85", dur: "29s", delay: "-15s", rot: "-rotate-6" },
            { top: "95%", size: "h-11 w-11", tone: "text-brand-300/90", dur: "41s", delay: "-38s", rot: "rotate-45" },
          ].map((l, i) => (
            <span
              key={`m-${i}`}
              className={`animate-cross absolute ${l.size} ${l.tone} sm:hidden`}
              style={{ top: l.top, ["--cd" as string]: l.dur, animationDelay: l.delay } as React.CSSProperties}
            >
              <LeafFill className={`h-full w-full ${l.rot}`} />
            </span>
          ))}
        </div>
        <section className="relative z-10 overflow-hidden pt-40 text-center lg:pt-44">
          {/* subtle static depth */}
          <div className="pointer-events-none absolute inset-0" aria-hidden>
            <span className="animate-float absolute left-[8%] top-[38%]">
              <LeafFill className="h-16 w-16 rotate-12 text-brand-300/70" />
            </span>
            <span className="animate-sway absolute right-[10%] top-[30%]">
              <LeafFill className="h-14 w-14 -rotate-12 text-brand-300/60" />
            </span>
            <span className="absolute left-1/2 top-10 h-64 w-64 -translate-x-1/2 rounded-full bg-white/50 blur-3xl" />
          </div>
          <div className="container-x relative">
            <p className="eyebrow">Our Menu</p>
            <h1 className="mt-4 font-display text-4xl font-bold tracking-tight text-ink sm:text-5xl lg:text-6xl">
              Fresh dishes, made daily
            </h1>
            <p className="mx-auto mt-5 max-w-md text-base leading-relaxed text-muted">
              Explore every dish on our menu — search by name or ingredient, or filter by category.
            </p>
          </div>
        </section>
        <section className="container-x relative z-10 pb-24 pt-10">
          <MenuExplorer items={menu} />
        </section>
      </main>
      <Footer />
    </>
  );
}
