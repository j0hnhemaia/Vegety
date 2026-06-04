import Link from "next/link";
import { Leaf } from "./icons";

export default function Navbar() {
  return (
    <header className="relative z-30 w-full pt-4 md:fixed md:inset-x-0 md:top-4 md:pt-0">
      <nav className="mx-auto flex h-16 w-[min(100%-2rem,72rem)] items-center justify-between rounded-full border border-white/70 bg-white/70 px-5 shadow-soft backdrop-blur-md sm:px-7">
        <Link href="/" className="flex items-center gap-2 font-display text-2xl font-bold text-ink">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-brand-400 text-white">
            <Leaf className="h-5 w-5" />
          </span>
          Vege<span className="text-brand-500">ty</span>
        </Link>

        <Link href="/menu" className="btn-primary">
          View Menu
        </Link>
      </nav>
    </header>
  );
}
