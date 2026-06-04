import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { LeafFill, Arrow } from "@/components/icons";

export default function NotFound() {
  return (
    <>
      <Navbar />
      <main className="relative overflow-hidden bg-gradient-to-b from-brand-50 to-white">
        {/* subtle leaf accents */}
        <div className="pointer-events-none absolute inset-0" aria-hidden>
          <LeafFill className="absolute left-[10%] top-[30%] h-14 w-14 rotate-12 text-brand-300/50" />
          <LeafFill className="absolute right-[12%] top-[24%] h-10 w-10 -rotate-12 text-brand-300/45" />
          <LeafFill className="absolute right-[22%] bottom-[18%] h-12 w-12 rotate-45 text-brand-300/40" />
        </div>

        <section className="container-x relative flex min-h-[70vh] flex-col items-center justify-center pt-40 pb-24 text-center lg:pt-44">
          <p className="eyebrow">Error 404</p>
          <p className="mt-6 font-display text-7xl font-bold leading-none text-brand-500 sm:text-8xl">
            404
          </p>
          <h1 className="mt-6 font-display text-3xl font-bold text-ink sm:text-4xl">
            This recipe isn&apos;t on the menu
          </h1>
          <p className="mx-auto mt-4 max-w-md text-base leading-relaxed text-muted">
            We turned the kitchen upside down, but this page seems to have gone off the boil.
            Let&apos;s get you back to something fresh.
          </p>
          <Link href="/" className="btn-primary mt-9">
            Back to home <Arrow />
          </Link>
        </section>
      </main>
      <Footer />
    </>
  );
}
