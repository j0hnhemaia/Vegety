import Image from "next/image";
import type { MenuItem } from "@/lib/types";

export default function MenuCard({ item }: { item: MenuItem }) {
  return (
    <article className="group rounded-xl2 bg-white p-3 shadow-soft transition-shadow duration-200 hover:shadow-card">
      <div className="relative aspect-[5/4] overflow-hidden rounded-2xl">
        {item.image ? (
          <Image
            src={item.image}
            alt={item.name}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="h-full w-full bg-brand-100" />
        )}
        <span className="absolute left-3 top-3 rounded-full bg-white px-3 py-1 text-xs font-semibold uppercase tracking-wide text-brand-500 shadow-sm">
          {item.category}
        </span>
        <span className="absolute bottom-3 right-3 rounded-full bg-white px-3 py-1.5 font-display text-sm font-bold text-brand-500 shadow-sm">
          £{item.price.toFixed(2)}
        </span>
      </div>

      <div className="px-2 py-4">
        <h3 className="font-display text-base font-semibold leading-snug text-ink">{item.name}</h3>
        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted">{item.description}</p>
      </div>
    </article>
  );
}
