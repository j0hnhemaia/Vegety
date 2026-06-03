type P = { className?: string };

export const Leaf = ({ className = "h-6 w-6" }: P) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
    <path d="M2 21c0-3 1.85-5.36 5.08-6" />
  </svg>
);

export const LeafFill = ({ className = "h-6 w-6" }: P) => (
  <svg className={className} viewBox="0 0 24 24" fill="none">
    <path fill="currentColor" d="M21 3.4c-1 10.6-7.6 16.1-15.6 16.1-.9 0-1.8-.1-2.7-.3C3.5 9.5 10.4 3.5 21 3.4Z" />
    <path stroke="#ffffff" strokeWidth="1.3" strokeLinecap="round" strokeOpacity="0.8" d="M16.6 7C11.6 9.8 7.6 13.9 4.8 19" />
  </svg>
);

export const Search = ({ className = "h-5 w-5" }: P) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <circle cx={11} cy={11} r={8} />
    <path d="m21 21-4.3-4.3" />
  </svg>
);

export const Arrow = ({ className = "h-4 w-4" }: P) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);

export const Close = ({ className = "h-5 w-5" }: P) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 6 6 18M6 6l12 12" />
  </svg>
);

export const Facebook = ({ className = "h-4 w-4" }: P) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor"><path d="M22 12a10 10 0 1 0-11.56 9.88v-6.99H7.9V12h2.54V9.8c0-2.5 1.49-3.89 3.78-3.89 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56V12h2.78l-.44 2.89h-2.34v6.99A10 10 0 0 0 22 12Z" /></svg>
);

export const Instagram = ({ className = "h-4 w-4" }: P) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <rect x={2} y={2} width={20} height={20} rx={5} /><circle cx={12} cy={12} r={4} /><circle cx={17.5} cy={6.5} r={0.5} fill="currentColor" />
  </svg>
);

export const Twitter = ({ className = "h-4 w-4" }: P) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor"><path d="M18.9 2H22l-7.5 8.6L23 22h-6.8l-5.3-6.9L4.8 22H1.7l8-9.2L1 2h7l4.8 6.3L18.9 2Zm-2.4 18h1.9L7.6 4H5.6l10.9 16Z" /></svg>
);
