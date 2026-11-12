import { ImageResponse } from "next/og";

import { siteConfig } from "@/lib/site";

export const alt = siteConfig.title;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: "#09090B",
          padding: "72px",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
          <div
            style={{
              width: "64px",
              height: "64px",
              borderRadius: "18px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundImage:
                "linear-gradient(135deg, #A78BFA 0%, #8B5CF6 50%, #6D28D9 100%)",
              color: "#FFFFFF",
              fontSize: "38px",
              fontWeight: 700,
            }}
          >
            M
          </div>
          <div
            style={{
              display: "flex",
              fontSize: "34px",
              fontWeight: 600,
              color: "#FAFAFA",
            }}
          >
            {siteConfig.name}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              fontSize: "68px",
              fontWeight: 700,
              color: "#FAFAFA",
              lineHeight: 1.06,
              letterSpacing: "-0.03em",
              maxWidth: "980px",
            }}
          >
            <span>Honest feedback</span>
            <span>
              starts with{" "}
              <span style={{ color: "#A78BFA" }}>anonymity.</span>
            </span>
          </div>
          <div
            style={{
              display: "flex",
              marginTop: "28px",
              fontSize: "28px",
              color: "#A1A1AA",
              maxWidth: "900px",
              lineHeight: 1.4,
            }}
          >
            {siteConfig.description}
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
          {[
            "No account needed to send",
            "Private by default",
            "Free to start",
          ].map((label) => (
            <div
              key={label}
              style={{
                display: "flex",
                alignItems: "center",
                border: "1px solid #27272F",
                borderRadius: "999px",
                padding: "10px 20px",
                fontSize: "20px",
                color: "#A1A1AA",
                backgroundColor: "#111114",
              }}
            >
              {label}
            </div>
          ))}
        </div>
      </div>
    ),
    { ...size }
  );
}
