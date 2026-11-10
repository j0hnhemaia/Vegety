import Link from "next/link";
import { Leaf, Facebook, Instagram, Twitter } from "./icons";

const HOURS = [
  { day: "Mon - Fri", time: "8:00 - 18:00" },
  { day: "Sat - Sun", time: "9:00 - 17:00" },
];

export default function Footer() {
  return (
    <footer id="footer" className="bg-cta text-brand-100">
      <div className="container-x grid gap-8 py-10 sm:grid-cols-2">
        {/* brand */}
        <div>
          <Link href="/" className="flex items-center gap-2 font-display text-xl font-bold text-white">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-brand-400 text-white">
              <Leaf className="h-5 w-5" />
            </span>
            Vegety
          </Link>
          <p className="mt-3 max-w-xs text-sm leading-relaxed text-brand-200">
            Fresh, healthy meals made daily with premium ingredients.
          </p>
          <div className="mt-4 flex gap-3">
            {[Facebook, Instagram, Twitter].map((Icon, i) => (
              <a
                key={i}
                href="#"
                aria-label="social link"
                className="grid h-9 w-9 place-items-center rounded-full bg-white/10 text-white transition-colors duration-200 hover:bg-brand-400"
              >
                <Icon />
              </a>
            ))}
          </div>
        </div>

        {/* visit */}
        <div className="sm:text-right">
          <h3 className="font-display text-sm font-semibold uppercase tracking-wide text-white">Visit Us</h3>
          <address className="mt-3 not-italic text-sm leading-relaxed text-brand-200">
            Champ de Mars, 5 Avenue, Anatole France, 75007 Paris, France
          </address>
          <dl className="mt-3 inline-flex flex-col gap-1.5 text-sm">
            {HOURS.map((h) => (
              <div key={h.day} className="flex justify-between gap-6 text-brand-200">
                <dt>{h.day}</dt>
                <dd className="font-medium text-white">{h.time}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      <div className="border-t border-white/10">
        <p className="container-x py-4 text-center text-xs text-brand-200">
          © {new Date().getFullYear()} Vegety. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
