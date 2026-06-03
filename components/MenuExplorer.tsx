"use client";

import { useMemo, useState } from "react";
import type { MenuItem } from "@/lib/types";
import { getCategories } from "@/lib/menu";
import MenuCard from "./MenuCard";
import { Search, Close } from "./icons";

export default function MenuExplorer({ items }: { items: MenuItem[] }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");

  const categories = useMemo(() => getCategories(items), [items]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return items.filter((item) => {
      const inCat = category === "All" || item.category === category;
      const inText =
        !q ||
        item.name.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q);
      return inCat && inText;
    });
  }, [items, query, category]);

  return (
    <div>
      {/* search */}
      <div className="group relative mx-auto max-w-lg">
        <Search className="pointer-events-none absolute left-5 top-1/2 z-10 h-5 w-5 -translate-y-1/2 text-brand-400 transition-colors group-focus-within:text-brand-600" />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search dishes, ingredients, categories…"
          aria-label="Search menu"
          className="w-full rounded-full border border-brand-100/80 bg-white/90 py-4 pl-[3.25rem] pr-12 text-sm text-ink shadow-[0_18px_40px_-24px_rgba(20,80,60,0.45)] outline-none backdrop-blur transition focus:border-brand-300 focus:shadow-[0_22px_50px_-22px_rgba(20,80,60,0.55)]"
        />
        {query && (
          <button
            type="button"
            onClick={() => setQuery("")}
            aria-label="Clear search"
            className="absolute right-4 top-1/2 z-10 -translate-y-1/2 text-muted transition-colors hover:text-ink"
          >
            <Close className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* category filter */}
      <div className="mt-6 flex flex-wrap justify-center gap-2">
        {categories.map((c) => {
          const active = c === category;
          return (
            <button
              key={c}
              type="button"
              onClick={() => setCategory(c)}
              aria-pressed={active}
              className={`rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-wide transition-all duration-200 ${
                active
                  ? "bg-cta text-white shadow-[0_10px_22px_-12px_rgba(26,44,34,0.8)]"
                  : "border border-brand-100 bg-white/70 text-muted hover:border-brand-300 hover:text-brand-600"
              }`}
            >
              {c}
            </button>
          );
        })}
      </div>

      {/* count */}
      <p className="mt-7 text-center text-xs font-medium uppercase tracking-[0.18em] text-brand-400" aria-live="polite">
        {filtered.length} {filtered.length === 1 ? "dish" : "dishes"}
        {category !== "All" && ` · ${category}`}
        {query && ` · “${query}”`}
      </p>

      {/* grid */}
      {filtered.length > 0 ? (
        <div key={category} className="mt-8 grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((item, i) => (
            <div
              key={item.id}
              className="animate-card-in"
              style={{ animationDelay: `${Math.min(i, 8) * 45}ms` }}
            >
              <MenuCard item={item} />
            </div>
          ))}
        </div>
      ) : (
        <div className="mt-12 rounded-xl2 border border-dashed border-brand-200 bg-brand-50/50 py-16 text-center">
          <p className="font-display text-lg font-semibold text-ink">No dishes found</p>
          <p className="mt-2 text-sm text-muted">Try a different search or category.</p>
        </div>
      )}
    </div>
  );
}
