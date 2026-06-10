// igc-trace.js — renders an IGC flight log as the inline SVG "Flight trace"
// section used in layouts/aviation/list.html.
//
// Usage: node scripts/igc-trace.js scripts/data/20250602-100km-diploma.igc
//
// Prints the full <section> markup to stdout; paste it over the existing
// FLIGHT TRACE section in the template. Stats (distances, altitude, duration)
// are computed from the log's B records; the dashed task triangle comes from
// the declared task C records. Turnpoint label offsets and the date/glider
// lines are flight-specific — adjust them in the emitter below for a new log.
const fs = require('fs');
const lines = fs.readFileSync(process.argv[2], 'utf8').split(/\r?\n/);

function parseLat(s) { // DDMMmmm + N/S
  const d = +s.slice(0,2), m = +s.slice(2,4) + (+s.slice(4,7))/1000;
  return (d + m/60) * (s[7] === 'S' ? -1 : 1);
}
function parseLon(s) { // DDDMMmmm + E/W
  const d = +s.slice(0,3), m = +s.slice(3,5) + (+s.slice(5,8))/1000;
  return (d + m/60) * (s[8] === 'W' ? -1 : 1);
}

const fixes = [];
for (const l of lines) {
  if (l[0] !== 'B') continue;
  const t = +l.slice(1,3)*3600 + +l.slice(3,5)*60 + +l.slice(5,7);
  const lat = parseLat(l.slice(7,15));
  const lon = parseLon(l.slice(15,24));
  const galt = +l.slice(30,35);
  fixes.push({t, lat, lon, galt});
}

// task turnpoints from C records (skip the zero TAKEOFF/LANDING ones)
const task = [];
for (const l of lines) {
  if (!/^C\d{7}[NS]\d{8}[EW]/.test(l)) continue;
  const lat = parseLat(l.slice(1,9));
  const lon = parseLon(l.slice(9,18));
  const name = l.slice(18).trim();
  if (Math.abs(lat) < 0.01 || /TAKEOFF|LANDING/.test(name)) continue;
  task.push({lat, lon, name});
}

// trim ground time: find first/last fix where position changes meaningfully
function hav(a, b) {
  const R = 6371, rad = Math.PI/180;
  const dLat = (b.lat-a.lat)*rad, dLon = (b.lon-a.lon)*rad;
  const h = Math.sin(dLat/2)**2 + Math.cos(a.lat*rad)*Math.cos(b.lat*rad)*Math.sin(dLon/2)**2;
  return 2*R*Math.asin(Math.sqrt(h));
}
let i0 = 0; while (i0 < fixes.length-1 && hav(fixes[i0], fixes[i0+1]) < 0.01) i0++;
let i1 = fixes.length-1; while (i1 > 0 && hav(fixes[i1], fixes[i1-1]) < 0.01) i1--;
const fl = fixes.slice(Math.max(0,i0-2), i1+2);

// stats
let dist = 0;
for (let i=1;i<fl.length;i++) dist += hav(fl[i-1], fl[i]);
let taskDist = 0;
for (let i=1;i<task.length;i++) taskDist += hav(task[i-1], task[i]);
const maxAlt = Math.max(...fl.map(f=>f.galt));
const minAlt = Math.min(...fl.map(f=>f.galt));
const dur = fl[fl.length-1].t - fl[0].t;
const hh = Math.floor(dur/3600), mm = Math.round((dur%3600)/60);
const fmtT = s => String(Math.floor(s/3600)).padStart(2,'0') + ':' + String(Math.floor((s%3600)/60)).padStart(2,'0');

// ---- projection (equirectangular, scaled by cos(midlat)) ----
const all = fl.concat(task);
const latMid = (Math.min(...all.map(p=>p.lat)) + Math.max(...all.map(p=>p.lat)))/2;
const kx = Math.cos(latMid*Math.PI/180);
const xs = all.map(p=>p.lon*kx), ys = all.map(p=>p.lat);
const xMin=Math.min(...xs), xMax=Math.max(...xs), yMin=Math.min(...ys), yMax=Math.max(...ys);
const W=640, H=560, PAD=46;
const s = Math.min((W-2*PAD)/(xMax-xMin), (H-2*PAD)/(yMax-yMin));
const ox = (W - s*(xMax-xMin))/2, oy = (H - s*(yMax-yMin))/2;
const px = p => (ox + (p.lon*kx - xMin)*s).toFixed(1);
const py = p => (H - oy - (p.lat - yMin)*s).toFixed(1);

// decimate trace
const step = Math.max(1, Math.floor(fl.length/700));
const tracePts = fl.filter((_,i)=>i%step===0 || i===fl.length-1).map(p=>px(p)+','+py(p)).join(' ');
const taskPts = task.map(p=>px(p)+','+py(p)).join(' ');
const seen = new Set();
const tpMarkers = task.filter(p => !seen.has(p.name) && seen.add(p.name))
  .map(p=>({x:px(p), y:py(p), name:p.name}));

// barogram
const BW=640, BH=170, BPAD=10, BL=44, BB=24;
const t0=fl[0].t, t1=fl[fl.length-1].t;
const bx = t => (BL + (t-t0)/(t1-t0)*(BW-BL-BPAD)).toFixed(1);
const altTop = Math.ceil(maxAlt/500)*500;
const by = a => (BPAD + (1 - a/altTop)*(BH-BPAD-BB)).toFixed(1);
const bstep = Math.max(1, Math.floor(fl.length/500));
const baroPts = fl.filter((_,i)=>i%bstep===0 || i===fl.length-1).map(p=>bx(p.t)+','+by(p.galt)).join(' ');
const gridLines = [];
for (let a=500; a<=altTop; a+=500) gridLines.push({y: by(a), label: a});


// ---- emit section markup ----
const lab = {
  'USK': {dy: 24, anchor: 'middle'},
  'HEREFORD CATHEDRAL': {dy: -14, anchor: 'middle'},
  'LEDBURY': {dy: -14, anchor: 'middle'}
};
const markers = tpMarkers.map(m => {
  const l = lab[m.name] || {dy: -14, anchor: 'middle'};
  return `        <circle class="tr-tp" cx="${m.x}" cy="${m.y}" r="4"/>\n` +
         `        <text class="tr-label" x="${m.x}" y="${(+m.y + l.dy).toFixed(1)}" text-anchor="${l.anchor}">${m.name}</text>`;
}).join('\n');
const grid = gridLines.map(g =>
  `        <line class="tr-grid" x1="44" y1="${g.y}" x2="630" y2="${g.y}"/>\n` +
  `        <text class="tr-axis" x="38" y="${(+g.y + 3).toFixed(1)}" text-anchor="end">${g.label}</text>`
).join('\n');
const date = '02 JUN 2025';
const off = fmtT(t0) + 'Z', land = fmtT(t1) + 'Z';

console.log(`  <!-- FLIGHT TRACE — generated from the 02 Jun 2025 IGC log by scripts/igc-trace.js -->
  <section>
    <div class="section-head">
      <div class="section-num">§ 01 / Flight trace</div>
      <h2 class="section-title">The 100km diploma flight <span class="t-dim">— Usk · Hereford · Ledbury · Usk.</span></h2>
    </div>
    <div class="t-trace">
      <figure class="t-trace-map">
        <svg viewBox="0 0 ${W} ${H}" role="img" aria-label="GPS trace of the 100km diploma flight: a triangle from Usk to Hereford Cathedral to Ledbury and back">
          <polyline class="tr-task" points="${taskPts}"/>
          <polyline class="tr-line" points="${tracePts}"/>
${markers}
        </svg>
        <figcaption class="tr-caption">
          <span>ACTUAL GPS TRACK</span>
          <span class="tr-key"><span class="tr-key-task"></span> DECLARED TASK</span>
        </figcaption>
      </figure>
      <div class="t-trace-side">
        <dl class="tr-data">
          <div><dt>Date</dt><dd>${date}</dd></div>
          <div><dt>Glider</dt><dd>PIK-20D · G-DDLY</dd></div>
          <div><dt>Task</dt><dd>${taskDist.toFixed(0)} KM TRIANGLE</dd></div>
          <div><dt>Distance flown</dt><dd>${Number(dist.toFixed(0)).toLocaleString()} KM</dd></div>
          <div><dt>Max altitude</dt><dd>${maxAlt.toLocaleString()} M</dd></div>
          <div><dt>Duration</dt><dd>${hh}h ${String(mm).padStart(2,'0')}m · ${off} – ${land}</dd></div>
        </dl>
        <figure class="t-trace-baro">
          <svg viewBox="0 0 ${BW} ${BH}" role="img" aria-label="Barogram: altitude over the duration of the flight, peaking at ${maxAlt} metres">
${grid}
            <line class="tr-grid" x1="44" y1="${by(0)}" x2="630" y2="${by(0)}"/>
            <polyline class="tr-line" points="${baroPts}"/>
            <text class="tr-axis" x="44" y="${BH - 8}">${off}</text>
            <text class="tr-axis" x="630" y="${BH - 8}" text-anchor="end">${land}</text>
            <text class="tr-axis" x="38" y="${BH - 8}" text-anchor="end">ALT M</text>
          </svg>
          <figcaption class="tr-caption"><span>BAROGRAM</span></figcaption>
        </figure>
      </div>
    </div>
  </section>`);
