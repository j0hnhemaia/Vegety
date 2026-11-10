"use client";

import { useState } from "react";
import { Arrow } from "./icons";

type Review = { initials: string; name: string; quote: string };

const REVIEWS: Review[] = [
  {
    initials: "OB",
    name: "Olivia Bennett",
    quote:
      "Honestly the freshest meals I've had delivered - vibrant flavours, generous portions and you can taste how fresh the ingredients are. My new weekday go-to.",
  },
  {
    initials: "JW",
    name: "James Whitaker",
    quote:
      "Ordering lunch for the team every week now. Always on time, always spot on, and the salads actually keep you full through the afternoon.",
  },
  {
    initials: "PS",
    name: "Priya Sharma",
    quote:
      "Eating well used to feel like a chore. With Vegety it's the part of my day I look forward to - proper food that happens to be healthy.",
  },
];

export default function TestimonialCarousel() {
  const [i, setI] = useState(0);
  const r = REVIEWS[i];
  const go = (dir: number) => setI((v) => (v + dir + REVIEWS.length) % REVIEWS.length);

  return (
    <div>
      <div key={i} className="animate-fade-slide">
        <div className="mt-8 flex items-center gap-3">
          <div className="grid h-12 w-12 place-items-center rounded-full bg-brand-400 font-display font-semibold text-white">
            {r.initials}
          </div>
          <p className="font-display font-semibold text-ink">{r.name}</p>
        </div>

        <p className="mt-6 min-h-[6.5rem] max-w-md text-base leading-relaxed text-muted">
          &ldquo;{r.quote}&rdquo;
        </p>
      </div>

      <div className="mt-6 flex items-center justify-between">
        <div className="flex gap-1.5">
          {REVIEWS.map((_, idx) => (
            <button
              key={idx}
              type="button"
              aria-label={`Go to review ${idx + 1}`}
              onClick={() => setI(idx)}
              className={`h-2 rounded-full transition-all duration-200 ${
                idx === i ? "w-6 bg-brand-500" : "w-2 bg-brand-200 hover:bg-brand-300"
              }`}
            />
          ))}
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            aria-label="Previous review"
            onClick={() => go(-1)}
            className="grid h-10 w-10 place-items-center rounded-full border border-brand-200 text-brand-600 transition-colors duration-200 hover:bg-brand-50"
          >
            <Arrow className="h-4 w-4 rotate-180" />
          </button>
          <button
            type="button"
            aria-label="Next review"
            onClick={() => go(1)}
            className="grid h-10 w-10 place-items-center rounded-full bg-cta text-white transition-colors duration-200 hover:bg-brand-700"
          >
            <Arrow className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
