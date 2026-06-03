"use client";

import { useEffect, useState } from "react";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

export default function Splash() {
  const [hidden, setHidden] = useState(false); // start fade-out
  const [done, setDone] = useState(false); // remove from DOM

  useEffect(() => {
    // lock scroll while the splash is up
    document.body.style.overflow = "hidden";
    const fade = setTimeout(() => setHidden(true), 2400); // play ~2.4s
    const remove = setTimeout(() => {
      setDone(true);
      document.body.style.overflow = "";
    }, 2900); // 2.4s + 0.5s fade
    return () => {
      clearTimeout(fade);
      clearTimeout(remove);
      document.body.style.overflow = "";
    };
  }, []);

  if (done) return null;

  return (
    <div
      aria-hidden
      className={`fixed inset-0 z-[100] grid place-items-center bg-brand-50 transition-opacity duration-500 ${
        hidden ? "pointer-events-none opacity-0" : "opacity-100"
      }`}
    >
      <div className="w-48 sm:w-60">
        <DotLottieReact src="/food-animation.lottie" autoplay loop />
      </div>
    </div>
  );
}
