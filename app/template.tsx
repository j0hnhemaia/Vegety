"use client";

import { usePathname } from "next/navigation";

// Next.js re-mounts template.tsx on every navigation, so keying it to the
// pathname replays the fade each time you move between pages.
export default function Template({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  return (
    <div key={pathname} className="page-transition">
      {children}
    </div>
  );
}
