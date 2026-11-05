interface OgPreviewProps {
  eyebrow: string;
  title: string;
  description: string;
  imageUrl?: string;
  priceLabel?: string;
  detailLabel?: string;
}

export default function OgPreview({
  eyebrow,
  title,
  description,
  imageUrl,
  priceLabel,
  detailLabel = "Дэлгэрэнгүй мэдээлэл",
}: OgPreviewProps) {
  return (
    <div
      style={{
        display: "flex",
        width: "100%",
        height: "100%",
        padding: 28,
        gap: 24,
        color: "#0f172a",
        background: "linear-gradient(135deg, #f1f5f9 0%, #fffaf0 100%)",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div
        style={{
          display: "flex",
          position: "relative",
          width: 536,
          height: 574,
          flexShrink: 0,
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
          border: "1px solid #e2e8f0",
          borderRadius: 28,
          background: "#ffffff",
        }}
      >
        {imageUrl ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={imageUrl}
            alt=""
            style={{ width: "100%", height: "100%", objectFit: "contain", padding: 28 }}
          />
        ) : (
          <div
            style={{
              display: "flex",
              position: "relative",
              alignItems: "center",
              justifyContent: "center",
              width: 238,
              height: 438,
              border: "3px solid #0f172a",
              borderRadius: 34,
              background: "linear-gradient(145deg, #263b53 0%, #10243d 70%)",
              boxShadow: "0 20px 34px rgba(15,23,42,0.22)",
            }}
          >
            <div style={{ display: "flex", position: "absolute", top: -115, left: 37, width: 8, height: 120, borderRadius: 8, background: "#d99a20", transform: "rotate(8deg)" }} />
            <div style={{ display: "flex", position: "absolute", top: 24, right: 28, width: 36, height: 36, borderRadius: 18, background: "#d99a20" }} />
            <div style={{ display: "flex", position: "absolute", top: 75, width: 152, height: 80, border: "3px solid #64748b", borderRadius: 10, background: "#c9e9df" }} />
            <div style={{ display: "flex", position: "absolute", top: 180, width: 132, height: 3, borderRadius: 3, background: "#94a3b8" }} />
            <div style={{ display: "flex", position: "absolute", top: 195, width: 132, height: 3, borderRadius: 3, background: "#94a3b8" }} />
            <div style={{ display: "flex", position: "absolute", top: 210, width: 132, height: 3, borderRadius: 3, background: "#94a3b8" }} />
            <div style={{ display: "flex", position: "absolute", bottom: 46, color: "#ffffff", fontSize: 20, fontWeight: 700, letterSpacing: 1.5 }}>RETEVIS</div>
          </div>
        )}
        <div
          style={{
            display: "flex",
            position: "absolute",
            left: 22,
            bottom: 22,
            padding: "10px 16px",
            border: "1px solid #e2e8f0",
            borderRadius: 999,
            color: "#334155",
            background: "rgba(255,255,255,0.92)",
            fontSize: 17,
            fontWeight: 600,
          }}
        >
          Retevis Mongolia
        </div>
      </div>

      <div
        style={{
          display: "flex",
          flex: 1,
          flexDirection: "column",
          justifyContent: "space-between",
          overflow: "hidden",
          padding: "42px 40px 32px",
          borderRadius: 28,
          color: "#ffffff",
          background: "linear-gradient(145deg, #10243d 0%, #172f4d 60%, #243b59 100%)",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              display: "flex",
              alignSelf: "flex-start",
              padding: "8px 13px",
              border: "1px solid rgba(255,255,255,0.2)",
              borderRadius: 999,
              color: "#ffd36b",
              background: "rgba(255,255,255,0.08)",
              fontSize: 16,
              fontWeight: 700,
              letterSpacing: 1.5,
            }}
          >
            {eyebrow.toLocaleUpperCase("en-US")}
          </div>
          <div
            style={{
              display: "flex",
              marginTop: 26,
              color: "#ffffff",
              fontSize: 49,
              fontWeight: 700,
              lineHeight: 1.12,
            }}
          >
            {title.slice(0, 58)}
          </div>
          <div
            style={{
              display: "flex",
              marginTop: 18,
              color: "#d4deea",
              fontSize: 20,
              lineHeight: 1.4,
            }}
          >
            {description.slice(0, 112)}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          {priceLabel ? (
            <>
              <div style={{ display: "flex", color: "#b8c5d5", fontSize: 16 }}>Үнэ · НӨАТ багтсан</div>
              <div style={{ display: "flex", marginTop: 5, color: "#ffd36b", fontSize: 39, fontWeight: 700 }}>
                {priceLabel}
              </div>
            </>
          ) : null}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginTop: 20,
              paddingTop: 16,
              borderTop: "1px solid rgba(255,255,255,0.2)",
              color: "#ffffff",
              fontSize: 18,
              fontWeight: 600,
            }}
          >
            <span>{detailLabel.slice(0, 34)}</span>
            <span style={{ color: "#ffd36b", fontSize: 20 }}>retevis.mn</span>
          </div>
        </div>
      </div>
    </div>
  );
}
