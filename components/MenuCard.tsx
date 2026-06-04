import Image from "next/image";
import type { MenuItem } from "@/lib/types";

export default function MenuCard({ item }: { item: MenuItem }) {
  const unavailable = !item.available;

  return (
    <article
      aria-disabled={unavailable}
      className={`group rounded-xl2 border border-white/80 bg-white/95 p-3 shadow-[0_8px_32px_-8px_rgba(20,80,60,0.3)] transition-shadow duration-200 hover:shadow-card lg:border-white/60 lg:bg-gradient-to-br lg:from-white/40 lg:via-white/28 lg:to-white/18 lg:shadow-[0_22px_70px_-28px_rgba(20,80,60,0.5)] lg:ring-1 lg:ring-inset lg:ring-white/50 lg:backdrop-blur-[150px] lg:backdrop-saturate-150 ${
        unavailable ? "opacity-75" : ""
      }`}
    >
      <div className="relative aspect-[5/4] overflow-hidden rounded-2xl rounded-tl-none rounded-br-none">
        {item.image ? (
          <Image
            src={item.image}
            alt={item.name}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className={`object-cover transition-transform duration-300 group-hover:scale-105 ${
              unavailable ? "grayscale" : ""
            }`}
          />
        ) : (
          <div className="h-full w-full bg-brand-100" />
        )}
        <span className="absolute left-0 top-0 rounded-br-2xl bg-white px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-brand-500 shadow-sm lg:bg-white/55 lg:ring-1 lg:ring-inset lg:ring-white/50 lg:backdrop-blur-[36px]">
          {item.category}
        </span>
        <span className="absolute bottom-0 right-0 rounded-tl-2xl bg-white px-3 py-1.5 font-display text-sm font-bold text-brand-500 shadow-sm lg:bg-white/55 lg:ring-1 lg:ring-inset lg:ring-white/50 lg:backdrop-blur-[36px]">
          £{item.price.toFixed(2)}
        </span>
        {unavailable && (
          <div className="absolute inset-0 grid place-items-center bg-white/40">
            <span className="rounded-full bg-ink/85 px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-white shadow-sm">
              Unavailable
            </span>
          </div>
        )}
      </div>

      <div className="px-2 py-4">
        <h3 className="font-display text-base font-semibold leading-snug text-ink">{item.name}</h3>
        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted">{item.description}</p>
      </div>
    </article>
  );
}
