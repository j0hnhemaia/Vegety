import Image from "next/image";
import type { MenuItem } from "@/lib/types";

export default function MenuCard({ item }: { item: MenuItem }) {
  const unavailable = !item.available;

  return (
    <article
      aria-disabled={unavailable}
      className={`group rounded-xl2 border border-white/60 bg-white/70 p-3 shadow-soft backdrop-blur-md transition-shadow duration-200 hover:shadow-card ${
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
        <span className="absolute left-0 top-0 rounded-br-2xl bg-white px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-brand-500 shadow-sm">
          {item.category}
        </span>
        <span className="absolute bottom-0 right-0 rounded-tl-2xl bg-white px-3 py-1.5 font-display text-sm font-bold text-brand-500 shadow-sm">
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
