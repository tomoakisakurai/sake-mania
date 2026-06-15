/* eslint-disable @typescript-eslint/no-explicit-any */
// この銘柄の利き酒帳(レビュー一覧)
export function Reviews({ v }: { v: any }) {
  return (
    <div style={{ maxWidth: 560 }}>
      <div style={{ fontFamily: "'Shippori Mincho', serif", fontSize: 18, fontWeight: 700, borderBottom: "1px solid #E3DBCB", paddingBottom: 10, marginBottom: 4 }}>この銘柄の利き酒帳</div>
      {v.dReviews.map((rv: any, i: number) => (
        <div key={i} style={{ padding: "16px 4px", borderBottom: "1px solid #F0EADC" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
            <div style={{ fontSize: 13, fontWeight: 700 }}>{rv.user}</div>
            <div style={{ fontSize: 11, color: "#A89D8A" }}>{rv.date}</div>
            <div style={{ marginLeft: "auto", color: "#BC6A2D", fontSize: 13, letterSpacing: 2 }}>{rv.stars}</div>
          </div>
          <div style={{ fontSize: 13, lineHeight: 1.9, color: "#5C5547" }}>{rv.memo}</div>
        </div>
      ))}
    </div>
  );
}
