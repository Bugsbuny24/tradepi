type Chart = {
  id: string;
  title?: string | null;
  chart_type: string;
};

type Entry = {
  label: string;
  value: number;
};

type Settings = {
  theme_color?: string | null;
  dark_mode?: boolean;
  remove_watermark?: boolean;
};

function esc(s: string) {
  return s
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

export function renderEmbedHtml(opts: {
  chart: Chart;
  entries: Entry[];
  settings: Settings | null;
  watermark: boolean; // true => watermark göster
}) {
  const { chart, entries, settings, watermark } = opts;

  const dark = Boolean(settings?.dark_mode);
  const theme = settings?.theme_color?.trim() || "#6b7280";

  const payload = {
    chart: {
      id: chart.id,
      title: chart.title ?? "",
      chart_type: chart.chart_type,
    },
    entries: entries.map((e) => ({ label: e.label, value: Number(e.value) })),
    ui: { dark, theme, watermark },
  };

  // canvas basit chart: bar (default) + pie + line (min)
  return `<!doctype html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${esc(chart.title ?? "Embed")}</title>
  <style>
    :root{
      --bg: ${dark ? "#0b1220" : "#ffffff"};
      --fg: ${dark ? "#e5e7eb" : "#111827"};
      --muted: ${dark ? "#94a3b8" : "#6b7280"};
      --card: ${dark ? "#0f172a" : "#f9fafb"};
      --line: ${dark ? "#1f2937" : "#e5e7eb"};
      --theme: ${theme};
    }
    html,body{height:100%; margin:0; background:var(--bg); color:var(--fg); font-family: ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto; }
    .wrap{min-height:100%; display:flex; align-items:center; justify-content:center; padding:16px;}
    .card{width:min(920px, 100%); background:var(--card); border:1px solid var(--line); border-radius:16px; padding:14px 14px 10px;}
    .top{display:flex; align-items:center; justify-content:space-between; gap:12px; margin-bottom:10px;}
    .title{font-weight:700; font-size:14px; color:var(--fg); white-space:nowrap; overflow:hidden; text-overflow:ellipsis;}
    .type{font-size:12px; color:var(--muted);}
    canvas{width:100%; height:360px; display:block; background:transparent; border-radius:12px;}
    .wm{margin-top:8px; font-size:11px; color:var(--muted); text-align:right;}
    .err{padding:14px; border-radius:12px; border:1px dashed var(--line); color:var(--muted); font-size:13px;}
  </style>
</head>
<body>
  <div class="wrap">
    <div class="card">
      <div class="top">
        <div class="title">${esc(chart.title ?? "Chart")}</div>
        <div class="type" id="type"></div>
      </div>

      <canvas id="c" width="920" height="360"></canvas>

      ${watermark ? `<div class="wm">Powered by SnapLogic</div>` : ``}
    </div>
  </div>

  <script id="__SNAP_PAYLOAD__" type="application/json">${esc(JSON.stringify(payload))}</script>

  <script>
    const payload = JSON.parse(document.getElementById("__SNAP_PAYLOAD__").textContent);
    const chartType = (payload.chart.chart_type || "bar").toLowerCase();
    document.getElementById("type").textContent = chartType;

    const entries = payload.entries || [];
    const canvas = document.getElementById("c");
    const ctx = canvas.getContext("2d");

    function dpr() {
      const r = window.devicePixelRatio || 1;
      const w = canvas.clientWidth || 920;
      const h = canvas.clientHeight || 360;
      canvas.width = Math.floor(w * r);
      canvas.height = Math.floor(h * r);
      ctx.setTransform(r,0,0,r,0,0);
      return { w, h };
    }

    function clear(w,h){
      ctx.clearRect(0,0,w,h);
    }

    function drawBar(w,h){
      if (!entries.length) { empty(w,h); return; }

      const pad = 28;
      const bw = (w - pad*2) / entries.length;
      const max = Math.max(...entries.map(e => Number(e.value) || 0), 1);

      // axes
      ctx.strokeStyle = "rgba(148,163,184,0.35)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(pad, h - pad);
      ctx.lineTo(w - pad, h - pad);
      ctx.stroke();

      entries.forEach((e, i) => {
        const v = Number(e.value) || 0;
        const barH = (h - pad*2) * (v / max);
        const x = pad + i*bw + bw*0.15;
        const y = (h - pad) - barH;
        const ww = bw*0.7;

        ctx.fillStyle = payload.ui.theme;
        roundRect(ctx, x, y, ww, barH, 10, true, false);

        // label
        ctx.fillStyle = payload.ui.dark ? "rgba(229,231,235,0.9)" : "rgba(17,24,39,0.85)";
        ctx.font = "12px ui-sans-serif, system-ui";
        const lab = String(e.label ?? "");
        ctx.save();
        ctx.translate(x + ww/2, h - pad + 14);
        ctx.textAlign = "center";
        ctx.fillText(trim(lab, 10), 0, 0);
        ctx.restore();
      });
    }

    function drawLine(w,h){
      if (!entries.length) { empty(w,h); return; }
      const pad = 28;
      const max = Math.max(...entries.map(e => Number(e.value) || 0), 1);

      ctx.strokeStyle = "rgba(148,163,184,0.35)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(pad, h - pad);
      ctx.lineTo(w - pad, h - pad);
      ctx.stroke();

      const step = (w - pad*2) / Math.max(entries.length-1, 1);
      ctx.strokeStyle = payload.ui.theme;
      ctx.lineWidth = 3;
      ctx.beginPath();
      entries.forEach((e,i)=>{
        const v = Number(e.value)||0;
        const x = pad + i*step;
        const y = (h - pad) - (h - pad*2) * (v / max);
        if (i===0) ctx.moveTo(x,y); else ctx.lineTo(x,y);
      });
      ctx.stroke();

      // points
      entries.forEach((e,i)=>{
        const v = Number(e.value)||0;
        const x = pad + i*step;
        const y = (h - pad) - (h - pad*2) * (v / max);
        ctx.fillStyle = payload.ui.theme;
        ctx.beginPath();
        ctx.arc(x,y,4,0,Math.PI*2);
        ctx.fill();
      });
    }

    function drawPie(w,h){
      if (!entries.length) { empty(w,h); return; }
      const total = entries.reduce((a,e)=>a+(Number(e.value)||0),0) || 1;
      const cx = w/2, cy = h/2;
      const r = Math.min(w,h)*0.34;

      let start = -Math.PI/2;
      entries.forEach((e, idx)=>{
        const v = Number(e.value)||0;
        const ang = (v/total) * Math.PI*2;
        ctx.fillStyle = colorIdx(idx, payload.ui.theme);
        ctx.beginPath();
        ctx.moveTo(cx,cy);
        ctx.arc(cx,cy,r,start,start+ang);
        ctx.closePath();
        ctx.fill();
        start += ang;
      });

      // center hole
      ctx.fillStyle = payload.ui.dark ? "#0f172a" : "#f9fafb";
      ctx.beginPath();
      ctx.arc(cx,cy,r*0.55,0,Math.PI*2);
      ctx.fill();
    }

    function empty(w,h){
      clear(w,h);
      ctx.fillStyle = payload.ui.dark ? "rgba(148,163,184,0.9)" : "rgba(107,114,128,0.9)";
      ctx.font = "14px ui-sans-serif, system-ui";
      ctx.textAlign = "center";
      ctx.fillText("No data", w/2, h/2);
    }

    function trim(s,n){ return s.length>n ? s.slice(0,n-1)+"…" : s; }

    function roundRect(ctx, x, y, w, h, r, fill, stroke) {
      if (w < 2*r) r = w/2;
      if (h < 2*r) r = h/2;
      ctx.beginPath();
      ctx.moveTo(x+r, y);
      ctx.arcTo(x+w, y, x+w, y+h, r);
      ctx.arcTo(x+w, y+h, x, y+h, r);
      ctx.arcTo(x, y+h, x, y, r);
      ctx.arcTo(x, y, x+w, y, r);
      ctx.closePath();
      if (fill) ctx.fill();
      if (stroke) ctx.stroke();
    }

    function colorIdx(i, base){
      // base rengin üstüne hafif varyasyon
      // i arttıkça alpha ile oynayıp farklılık veriyoruz
      const a = 0.85 - (i%6)*0.10;
      return hexToRgba(base, Math.max(0.25, a));
    }

    function hexToRgba(hex, a){
      const h = hex.replace("#","").trim();
      if (h.length !== 6) return "rgba(107,114,128,"+a+")";
      const r = parseInt(h.slice(0,2),16);
      const g = parseInt(h.slice(2,4),16);
      const b = parseInt(h.slice(4,6),16);
      return "rgba("+r+","+g+","+b+","+a+")";
    }

    function render(){
      const { w, h } = dpr();
      clear(w,h);
      if (chartType.includes("pie")) drawPie(w,h);
      else if (chartType.includes("line")) drawLine(w,h);
      else drawBar(w,h);
    }

    window.addEventListener("resize", render);
    render();
  </script>
</body>
</html>`;
}
