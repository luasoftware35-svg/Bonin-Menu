/** Square brand mark for favicon / apple-touch (ImageResponse JSX). */
export function BrandMark({ size }: { size: number }) {
  const pad = Math.round(size * 0.14);
  const outer = size - pad * 2;
  const hole = Math.round(outer * 0.36);
  const sprinkle = Math.max(2, Math.round(size * 0.045));

  return (
    <div
      style={{
        width: size,
        height: size,
        background: "#F5EEE4",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          width: outer,
          height: outer,
          borderRadius: "50%",
          background:
            "linear-gradient(165deg, #E8C9A0 0%, #C4844A 38%, #A04F17 62%, #7A3A12 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          boxShadow: `0 ${Math.round(size * 0.04)}px ${Math.round(size * 0.08)}px rgba(59,36,22,0.22)`,
        }}
      >
        {[
          { top: "18%", left: "28%" },
          { top: "22%", left: "58%" },
          { top: "32%", left: "42%" },
        ].map((pos, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              width: sprinkle,
              height: sprinkle,
              borderRadius: sprinkle,
              background: "#FFF9F2",
              ...pos,
            }}
          />
        ))}
        <div
          style={{
            width: hole,
            height: hole,
            borderRadius: "50%",
            background: "#F5EEE4",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -Math.round(outer * 0.06),
            left: "22%",
            width: "18%",
            height: "14%",
            borderRadius: "0 0 40% 40%",
            background: "#7A3A12",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -Math.round(outer * 0.1),
            left: "48%",
            width: "14%",
            height: "18%",
            borderRadius: "0 0 50% 50%",
            background: "#7A3A12",
          }}
        />
      </div>
    </div>
  );
}
