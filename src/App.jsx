import { useState } from "react";

const fmt  = (n) => Number(n).toLocaleString("en-GB", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const VAT_RATES = [
  { label: "Standard Rate — 20%", rate: 20, desc: "Most goods and services" },
  { label: "Reduced Rate — 5%",   rate: 5,  desc: "Energy, children's car seats, some renovation work" },
  { label: "Zero Rate — 0%",      rate: 0,  desc: "Food, books, children's clothing" },
  { label: "Custom Rate",         rate: null, desc: "Enter your own rate" },
];

export default function App() {
  const [mode,       setMode]       = useState("add");   // add | remove
  const [amount,     setAmount]     = useState("");
  const [rateOption, setRateOption] = useState(20);
  const [customRate, setCustomRate] = useState("");

  const effectiveRate = rateOption === null ? (parseFloat(customRate) || 0) : rateOption;
  const A = parseFloat(amount) || 0;

  let net = 0, vat = 0, gross = 0;
  if (A && effectiveRate !== undefined) {
    if (mode === "add") {
      net   = A;
      vat   = A * effectiveRate / 100;
      gross = A + vat;
    } else {
      gross = A;
      net   = A / (1 + effectiveRate / 100);
      vat   = A - net;
    }
  }

  const hasResult = A > 0;

  const inputStyle = { width: "100%", padding: "11px 14px", fontSize: "15px", border: "1.5px solid #e5e7eb", borderRadius: "10px", outline: "none", boxSizing: "border-box", fontFamily: "inherit", background: "#fff" };
  const labelStyle = { display: "block", fontSize: "12px", fontWeight: "700", color: "#374151", marginBottom: "5px", textTransform: "uppercase", letterSpacing: "0.04em" };

  return (
    <div style={{ minHeight: "100vh", background: "#f8fafc", fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
      <style>{`@media print { .no-print { display:none!important; } }`}</style>

      <div className="no-print" style={{ background: "#fff", borderBottom: "1px solid #e5e7eb", padding: "16px 24px" }}>
        <div style={{ maxWidth: "680px", margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <a href="https://tabutility.com" style={{ fontSize: "15px", fontWeight: "700", color: "#6366f1", textDecoration: "none" }}>⌘ Tabutility</a>
          <button onClick={() => window.print()} style={{ padding: "8px 18px", background: "#0f172a", color: "#fff", border: "none", borderRadius: "8px", fontSize: "13px", fontWeight: "700", cursor: "pointer" }}>🖨️ Print</button>
        </div>
      </div>

      <div style={{ maxWidth: "680px", margin: "0 auto", padding: "32px 16px" }}>
        <h1 style={{ fontSize: "30px", fontWeight: "900", color: "#0f172a", margin: "0 0 6px" }}>UK VAT Calculator</h1>
        <p style={{ fontSize: "15px", color: "#6b7280", margin: "0 0 28px" }}>Add or remove VAT instantly. Covers standard (20%), reduced (5%), and zero rates.</p>

        {/* Mode toggle */}
        <div style={{ display: "flex", background: "#f3f4f6", borderRadius: "12px", padding: "4px", marginBottom: "20px", gap: "4px" }}>
          {[
            { id: "add",    label: "➕ Add VAT",    desc: "I have the net price" },
            { id: "remove", label: "➖ Remove VAT",  desc: "I have the gross price" },
          ].map(m => (
            <button key={m.id} onClick={() => setMode(m.id)} style={{ flex: 1, padding: "12px", borderRadius: "9px", border: "none", cursor: "pointer", fontWeight: "700", fontSize: "14px", background: mode === m.id ? "#fff" : "transparent", color: mode === m.id ? "#0f172a" : "#6b7280", boxShadow: mode === m.id ? "0 1px 4px rgba(0,0,0,0.1)" : "none", transition: "all 0.15s" }}>
              <div>{m.label}</div>
              <div style={{ fontSize: "11px", fontWeight: "500", marginTop: "2px", color: mode === m.id ? "#6b7280" : "#9ca3af" }}>{m.desc}</div>
            </button>
          ))}
        </div>

        {/* Input */}
        <div style={{ background: "#fff", borderRadius: "16px", padding: "24px", boxShadow: "0 1px 4px rgba(0,0,0,0.08)", marginBottom: "16px" }}>
          <div style={{ marginBottom: "20px" }}>
            <label style={labelStyle}>{mode === "add" ? "Net Amount (ex. VAT)" : "Gross Amount (inc. VAT)"}</label>
            <div style={{ position: "relative" }}>
              <span style={{ position: "absolute", left: "13px", top: "50%", transform: "translateY(-50%)", color: "#6b7280", fontWeight: "700" }}>£</span>
              <input type="number" placeholder="0.00" value={amount} onChange={e => setAmount(e.target.value)} min="0" step="0.01" style={{ ...inputStyle, paddingLeft: "28px", fontSize: "20px", fontWeight: "700" }} />
            </div>
          </div>

          <div>
            <label style={labelStyle}>VAT Rate</label>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {VAT_RATES.map(v => (
                <button key={v.label} onClick={() => setRateOption(v.rate)}
                  style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 16px", borderRadius: "10px", border: `1.5px solid ${rateOption === v.rate ? "#6366f1" : "#e5e7eb"}`, background: rateOption === v.rate ? "#f5f3ff" : "#fff", cursor: "pointer", textAlign: "left" }}>
                  <div>
                    <span style={{ fontSize: "14px", fontWeight: "700", color: rateOption === v.rate ? "#6366f1" : "#0f172a" }}>{v.label}</span>
                    <span style={{ fontSize: "12px", color: "#9ca3af", marginLeft: "8px" }}>{v.desc}</span>
                  </div>
                  {rateOption === v.rate && <span style={{ color: "#6366f1", fontWeight: "900" }}>✓</span>}
                </button>
              ))}
              {rateOption === null && (
                <div style={{ position: "relative", marginTop: "4px" }}>
                  <input type="number" placeholder="Enter rate e.g. 12.5" value={customRate} onChange={e => setCustomRate(e.target.value)} style={{ ...inputStyle, paddingRight: "34px" }} autoFocus />
                  <span style={{ position: "absolute", right: "13px", top: "50%", transform: "translateY(-50%)", color: "#6b7280", fontWeight: "700" }}>%</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Result */}
        {hasResult && (
          <div style={{ background: "linear-gradient(135deg, #1e1b4b, #4338ca)", borderRadius: "20px", padding: "28px", marginBottom: "16px", color: "#fff" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "16px", textAlign: "center" }}>
              {[
                { label: "Net (ex. VAT)", value: `£${fmt(net)}`, highlight: mode === "remove" },
                { label: `VAT (${effectiveRate}%)`, value: `£${fmt(vat)}`, highlight: false },
                { label: "Gross (inc. VAT)", value: `£${fmt(gross)}`, highlight: mode === "add" },
              ].map(r => (
                <div key={r.label} style={{ padding: "16px 8px", background: r.highlight ? "rgba(255,255,255,0.15)" : "rgba(255,255,255,0.06)", borderRadius: "12px" }}>
                  <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.65)", textTransform: "uppercase", fontWeight: "700", marginBottom: "8px", letterSpacing: "0.04em" }}>{r.label}</div>
                  <div style={{ fontSize: "22px", fontWeight: "900" }}>{r.value}</div>
                  {r.highlight && <div style={{ fontSize: "10px", color: "rgba(255,255,255,0.5)", marginTop: "4px" }}>← your answer</div>}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Quick reference */}
        <div style={{ background: "#fff", borderRadius: "16px", padding: "22px", boxShadow: "0 1px 4px rgba(0,0,0,0.08)", marginBottom: "32px" }}>
          <h2 style={{ fontSize: "14px", fontWeight: "800", margin: "0 0 14px" }}>UK VAT Quick Reference</h2>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", fontSize: "13px" }}>
            {[
              { rate: "20%", items: "Most goods & services, alcohol, electronics, clothing (adult)" },
              { rate: "5%",  items: "Home energy, children's car seats, stop-smoking products, period products" },
              { rate: "0%",  items: "Food (most), children's clothing, books, newspapers, prescription medicine" },
              { rate: "Exempt", items: "Financial services, education, health, postal services" },
            ].map(r => (
              <div key={r.rate} style={{ padding: "12px", background: "#f9fafb", borderRadius: "10px" }}>
                <div style={{ fontWeight: "800", fontSize: "14px", color: "#6366f1", marginBottom: "4px" }}>{r.rate}</div>
                <div style={{ color: "#6b7280", fontSize: "12px", lineHeight: "1.5" }}>{r.items}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="no-print" style={{ textAlign: "center" }}>
          <a href="https://tabutility.com" style={{ fontSize: "14px", color: "#6366f1", textDecoration: "none", fontWeight: "600" }}>← Back to all free tools</a>
        </div>
      </div>
    </div>
  );
}
