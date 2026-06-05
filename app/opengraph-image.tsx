import { ImageResponse } from "next/og";

export const alt = "Vegety — Healthy food to live a healthier life";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#15573E",
          color: "#ffffff",
          fontFamily: "sans-serif",
        }}
      >
        {/* Same leaf mark as the favicon (app/icon.svg) */}
        <svg
          width="200"
          height="200"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#ffffff"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
          <path d="M2 21c0-3 1.85-5.36 5.08-6" />
        </svg>
        <div style={{ fontSize: 96, fontWeight: 700, marginTop: 24 }}>Vegety</div>
        <div style={{ fontSize: 36, opacity: 0.85, marginTop: 8 }}>
          Healthy food to live a healthier life
        </div>
      </div>
    ),
    { ...size }
  );
}
