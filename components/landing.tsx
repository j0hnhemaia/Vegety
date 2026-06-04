import Image from "next/image";
import Link from "next/link";
import type { MenuItem } from "@/lib/types";
import { Arrow, LeafFill } from "./icons";
import Parallax from "./Parallax";
import TestimonialCarousel from "./TestimonialCarousel";

const spd = (v: number) => ({ "--spd": v }) as React.CSSProperties;

const food = (id: string, w = 700) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=75`;

/* Signature decoration: orbit ring + scattered dots + floating leaves around a circular image */
function OrbitFrame({
  src, alt, priority = false, className = "", decor = false,
}: { src: string; alt: string; priority?: boolean; className?: string; decor?: boolean }) {
  return (
    <div className={`relative mx-auto aspect-square w-full max-w-md ${className}`}>
      <svg viewBox="0 0 100 100" fill="none" className={`absolute inset-0 h-full w-full text-ink/25 ${decor ? "animate-spin-slow" : ""}`} aria-hidden>
        <circle cx="50" cy="50" r="47" stroke="currentColor" strokeWidth="0.25" />
        <circle cx="50" cy="48" r="44" stroke="currentColor" strokeWidth="0.18" opacity="0.6" />
      </svg>
      {decor && (
        <Parallax className="pointer-events-none absolute inset-0">
          <span className="parallax absolute left-0 top-1/3" style={spd(35)}><span className="block h-3.5 w-3.5 rounded-full bg-ink" /></span>
          <span className="parallax absolute right-4 top-6" style={spd(-45)}><span className="block h-2.5 w-2.5 rounded-full bg-ink/80" /></span>
          <span className="parallax absolute bottom-10 left-4" style={spd(50)}><span className="block h-2 w-2 rounded-full bg-ink/70" /></span>
          <span className="parallax absolute -right-1 bottom-1/3" style={spd(-38)}><span className="block h-3 w-3 rounded-full bg-ink/60" /></span>
          <span className="parallax absolute -left-2 bottom-10" style={spd(60)}><LeafFill className="h-9 w-9 -rotate-12 text-brand-500 animate-sway" /></span>
          <span className="parallax absolute -right-1 top-6" style={spd(-55)}><LeafFill className="h-8 w-8 rotate-45 text-brand-400 animate-float" /></span>
        </Parallax>
      )}
      <div className={`absolute inset-[8%] overflow-hidden rounded-full shadow-card ${decor ? "animate-float-slow" : ""}`}>
        <Image src={src} alt={alt} fill priority={priority} sizes="(max-width:1024px) 80vw, 40vw" className="object-cover" />
      </div>
    </div>
  );
}

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-brand-50 to-white">
      {/* moving background decoration — drifts on scroll (local parallax) + idle float */}
      <Parallax className="pointer-events-none absolute inset-0">
        <span className="parallax absolute left-[6%] top-[22%]" style={spd(50)}>
          <LeafFill className="h-10 w-10 text-brand-300/70 animate-float" />
        </span>
        <span className="parallax absolute left-[16%] bottom-[16%]" style={spd(-40)}>
          <LeafFill className="h-8 w-8 -scale-x-100 text-brand-400/60 animate-sway" />
        </span>
        <span className="parallax absolute right-[8%] top-[28%]" style={spd(70)}>
          <LeafFill className="h-12 w-12 text-brand-300/60 animate-drift" />
        </span>
        <span className="parallax absolute right-[22%] bottom-[12%]" style={spd(-55)}>
          <LeafFill className="h-7 w-7 text-brand-400/50 animate-float-slow" />
        </span>
        <span className="parallax absolute left-[30%] top-[18%]" style={spd(90)}>
          <span className="block h-3 w-3 rounded-full bg-brand-500/50 animate-dot" />
        </span>
        <span className="parallax absolute right-[14%] top-[60%]" style={spd(-80)}>
          <span className="block h-2.5 w-2.5 rounded-full bg-ink/40 animate-dot" style={{ animationDelay: "1.5s" }} />
        </span>
        <span className="parallax absolute left-[45%] bottom-[20%]" style={spd(65)}>
          <span className="block h-2 w-2 rounded-full bg-brand-500/60 animate-dot" style={{ animationDelay: "0.8s" }} />
        </span>
      </Parallax>
      <div className="container-x relative z-10 grid items-center gap-12 pb-12 pt-40 lg:grid-cols-2 lg:pb-20 lg:pt-44">
        <div className="order-2 lg:order-1">
          <h1 className="font-display text-4xl font-bold leading-[1.1] text-ink sm:text-5xl lg:text-6xl">
            Healthy food to live a healthier life in the future
          </h1>
          <p className="mt-6 max-w-md text-base leading-relaxed text-muted">
            Enjoy a healthy life by eating healthy foods that have extraordinary flavours that
            make your life healthier for today and in the future.
          </p>
          <Link href="/menu" className="btn-primary mt-8">Get Started</Link>
        </div>
        <OrbitFrame src={food("photo-1512621776951-a57141f2eefd", 800)} alt="Bowl of fresh healthy salad" priority decor className="order-1 lg:order-2" />
      </div>
    </section>
  );
}

const DISHES = [
  { name: "Green Salad", img: "photo-1540420773420-3366772f4999", desc: "A green salad filled with cabbage, mustard greens, and added chicken pieces for a more delicious." },
  { name: "Beef Salad", img: "photo-1490474418585-ba9bad8fd0ea", desc: "A salad combined with a delicious cut of bacon and mixed with tasty and fresh sesame oil." },
  { name: "Nut Salad", img: "photo-1505253716362-afaea1d3d1af", desc: "The salad is mixed with various types of savory nuts so that it adds a delicious and addictive taste." },
];

export function SpecialDish() {
  return (
    <section className="py-20">
      <div className="container-x text-center">
        <h2 className="font-display text-3xl font-bold text-ink sm:text-4xl">Our Special Dish</h2>
        <p className="mt-3 text-muted">Made with premium ingredients.</p>
        <div className="mt-12 grid gap-8 sm:grid-cols-3">
          {DISHES.map((d, i) => (
            <div key={d.name} className={`rounded-xl2 px-7 pt-7 text-center ${i === 1 ? "bg-white pb-12 shadow-card" : "pb-7 shadow-[0_12px_30px_-20px_rgba(27,67,50,0.3)]"}`}>
              <div className="relative mx-auto h-36 w-36 overflow-hidden rounded-full bg-brand-50 shadow-sm">
                <Image src={food(d.img, 360)} alt={d.name} fill sizes="160px" className="object-cover" />
              </div>
              <h3 className="mt-5 font-display text-lg font-semibold text-ink">{d.name}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted">{d.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function FreshVeg() {
  return (
    <section className="relative overflow-hidden bg-white py-20">
      {/* leaves drift inversely to scroll (negative amplitudes) */}
      <Parallax className="pointer-events-none absolute inset-0">
        <span className="parallax absolute right-[10%] top-[12%]" style={spd(-70)}><LeafFill className="h-10 w-10 text-brand-300/60" /></span>
        <span className="parallax absolute right-[26%] bottom-[16%]" style={spd(-55)}><LeafFill className="h-7 w-7 -scale-x-100 text-brand-400/50" /></span>
        <span className="parallax absolute left-[46%] top-[20%]" style={spd(-90)}><LeafFill className="h-6 w-6 text-brand-300/50" /></span>
        <span className="parallax absolute right-[6%] bottom-[28%]" style={spd(-110)}><span className="block h-2.5 w-2.5 rounded-full bg-brand-400/50" /></span>
      </Parallax>
      <div className="container-x relative grid items-center gap-12 lg:grid-cols-2">
        <OrbitFrame src={food("photo-1622206151226-18ca2c9ab4a1", 700)} alt="Fresh leafy greens on a dark plate" className="max-w-sm" />
        <div>
          <h2 className="font-display text-3xl font-bold leading-tight text-ink sm:text-4xl">Fresh Vegetables Every Day</h2>
          <p className="mt-5 max-w-md text-base leading-relaxed text-muted">
            We present various types of fresh vegetables and taken directly from the
            farmer&apos;s garden especially for you.
          </p>
          <Link href="/menu" className="btn-primary mt-8">Learn More <Arrow /></Link>
        </div>
      </div>
    </section>
  );
}

export function PopularMenu({ items }: { items: MenuItem[] }) {
  return (
    <section className="bg-brand-50/40 py-20">
      <div className="container-x text-center">
        <h2 className="font-display text-3xl font-bold text-ink sm:text-4xl">Our Popular Menu</h2>
        <p className="mt-3 text-muted">Made with premium ingredients.</p>
        <div className="mt-14 grid items-start gap-7 text-left sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item, i) => (
            <article
              key={item.id}
              className={`rounded-xl2 bg-white p-3 shadow-soft transition-shadow duration-200 hover:shadow-card ${i === 1 ? "shadow-card lg:-translate-y-8" : ""}`}
            >
              <div className="relative aspect-[5/4] overflow-hidden rounded-2xl rounded-tl-none">
                <Image src={item.image} alt={item.name} fill sizes="(max-width:768px) 100vw, 33vw" className="object-cover" />
                <span className="absolute left-0 top-0 rounded-br-2xl bg-white px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-brand-500 shadow-sm">
                  {item.category}
                </span>
              </div>
              <div className="flex items-center justify-between gap-3 px-2 py-4">
                <h3 className="font-display text-sm font-semibold leading-snug text-ink">{item.name}</h3>
                <span className="shrink-0 font-display text-sm font-bold text-brand-500">£{item.price.toFixed(2)}</span>
              </div>
            </article>
          ))}
        </div>
        <Link href="/menu" className="btn-primary mt-12">Load more menu <Arrow /></Link>
      </div>
    </section>
  );
}

export function Testimonials() {
  return (
    <section className="bg-brand-50/60 py-20">
      <div className="container-x grid items-center gap-12 lg:grid-cols-2">
        <OrbitFrame src={food("photo-1546069901-ba9599a7e63c", 700)} alt="Healthy salmon avocado bowl" className="max-w-sm lg:justify-self-center" />
        <div className="w-full max-w-md lg:justify-self-center">
          <h2 className="font-display text-3xl font-bold leading-tight text-ink sm:text-4xl">Customer say about us</h2>
          <TestimonialCarousel />
        </div>
      </div>
    </section>
  );
}

export function MemberCTA() {
  return (
    <section className="py-20">
      <div className="container-x">
        <div className="relative overflow-hidden rounded-xl2 bg-cta px-8 py-16 text-center shadow-card">
          <Image src={food("photo-1490645935967-10de6ba17061", 1200)} alt="" aria-hidden fill sizes="100vw" className="object-cover opacity-25" />
          <div className="relative mx-auto max-w-xl">
            <h2 className="font-display text-2xl font-bold text-white sm:text-3xl">Join our member and get discount up to 50%</h2>
            <form className="mx-auto mt-8 flex max-w-md items-center rounded-full bg-white p-1.5" aria-label="Newsletter sign up (demo)">
              <label htmlFor="email" className="sr-only">Email address</label>
              <input id="email" type="email" placeholder="Enter your email" className="flex-1 rounded-full border-0 bg-transparent px-5 py-2.5 text-sm text-ink outline-none" />
              <button type="submit" className="rounded-full bg-brand-400 px-7 py-2.5 text-sm font-semibold text-white transition-colors duration-200 hover:bg-brand-500">Sign Up</button>
            </form>
            <p className="mt-4 text-sm text-white/70 underline underline-offset-4">I&apos;m new member</p>
          </div>
        </div>
      </div>
    </section>
  );
}
