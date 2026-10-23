/* ============ CONFIG: edit these ============ */
const CONFIG = {
  WHATSAPP: "918870107668",          // country code + number, no + or spaces
  SHEET_CSV_URL: "https://docs.google.com/spreadsheets/d/e/2PACX-1vTj7ktT3NmkMnsf7JuMV0YyJZZnA1PiPcuXNdLDsD_4JBLgCNWdLsFIfja_-P3JlxrWcOkr_zuExs7Z/pub?output=csv",
  IMAGE_BASE: "",                    // "" = images sit next to index.html. Use "images/" if they are in a folder.
  CURRENCY: "₹",
  INSTAGRAM: "neutral_basics_",      // your handle without @ (blank hides the links)
  HERO_IMAGES: ["hero-1.jpg","hero-2.jpg","hero-3.jpg","hero-4.jpg"],   // full-screen photos (landscape works best on computers)
  HERO_IMAGES_MOBILE: [],            // optional portrait versions for phones
  HERO_FOCUS: "center",              // "center", "top", "center 30%" ...
  HERO_SECONDS: 5,
  TILES: { half: "tile-half.jpg", full: "tile-full.png", plain: "tile-plain.jpg" },   // photos for the style tiles on the home page
  SIZE_CHARTS: { half: "", full: "", plain: "" }   // optional: one size chart per style (same format as the sheet's Size Chart column)
};
const CATEGORIES = {
  half:  { title: "Oversized Tees", sub: "Half Sleeve",           pill: "Oversized Tees · Half Sleeve" },
  full:  { title: "Boxy Fit",       sub: "Full Sleeve",           pill: "Boxy Fit · Full Sleeve" },
  plain: { title: "Plain Tees",     sub: "Acid Wash · Oversized", pill: "Acid Wash Plain Tees" }
};
/* ============================================ */

const $ = id => document.getElementById(id);
const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const money = n => CONFIG.CURRENCY + Number(n || 0).toLocaleString("en-IN");
const imgUrl = f => /^https?:/i.test(f) ? f : CONFIG.IMAGE_BASE + encodeURI(f);
let products = [];
let cart = [];
try { cart = JSON.parse(localStorage.getItem("nb_cart") || "[]"); } catch(e){}
const save = () => { try { localStorage.setItem("nb_cart", JSON.stringify(cart)); } catch(e){} };

function parseCSV(text){
  const rows = []; let row = [], cur = "", q = false;
  for (let i = 0; i < text.length; i++){
    const c = text[i];
    if (q){
      if (c === '"' && text[i+1] === '"'){ cur += '"'; i++; }
      else if (c === '"') q = false;
      else cur += c;
    } else if (c === '"') q = true;
    else if (c === ","){ row.push(cur); cur = ""; }
    else if (c === "\n" || c === "\r"){
      if (c === "\r" && text[i+1] === "\n") i++;
      row.push(cur); cur = ""; rows.push(row); row = [];
    } else cur += c;
  }
  if (cur || row.length){ row.push(cur); rows.push(row); }
  const head = rows.shift().map(h => h.trim().toLowerCase());
  return rows.filter(r => r.some(v => v.trim())).map(r => {
    const o = {}; head.forEach((h, i) => o[h] = (r[i] || "").trim()); return o;
  });
}

function toProduct(o, id){
  const sizes = (o["sizes"] || "").split(/[|,\/]/).map(x => x.trim()).filter(Boolean);
  const variants = sizes.map(sz => {
    const raw = o[sz.toLowerCase() + " size"];
    let qty = raw === undefined || raw === "" ? 99 : Number(raw);
    if (isNaN(qty)) qty = 0;                 // "-" means not available
    return {size: sz, qty};
  });
  const inStock = o["in_stock"] === undefined || /^(yes|y|true|1)$/i.test(o["in_stock"]);
  const images = [1,2,3,4].map(n => o["image " + n]).filter(Boolean);
  const sold = !inStock || (variants.length && variants.every(v => v.qty <= 0));
  const catRaw = (o["category"] || o["type"] || o["style"] || o["sleeve"] || "").toLowerCase();
  const cat = /plain/.test(catRaw) ? "plain" : /full|boxy/.test(catRaw) ? "full" : "half";      // blank = half sleeve
  const chart = o["size chart"] || o["sizechart"] || o["size_chart"] || "";
  return {id, name:o["name"], price:Number(String(o["price"]).replace(/[^\d.]/g,"")) || 0, variants, images, sold, cat, chart};
}
const parseProducts = text => parseCSV(text).filter(o => o["name"]).map(toProduct);

/* Calls cb(list) at once from the saved copy (if any), then again with fresh data. cb(null) = couldn't load. */
function loadProducts(cb){
  let first = null;
  try { const c = sessionStorage.getItem("nb_sheet"); if (c){ first = c; cb(parseProducts(c)); } } catch(e){}
  fetch(CONFIG.SHEET_CSV_URL, {cache:"no-store"})
    .then(r => { if (!r.ok) throw new Error(r.status); return r.text(); })
    .then(t => { try { sessionStorage.setItem("nb_sheet", t); } catch(e){} if (t !== first) cb(parseProducts(t)); })
    .catch(() => { if (first === null) cb(null); });
}

const markIcon = '<svg class="mark" viewBox="0 0 100 100" aria-hidden="true"><defs><clipPath id="cpph"><circle cx="50" cy="50" r="40"/></clipPath></defs><circle cx="50" cy="50" r="48" fill="none" stroke="#8A6D2F" stroke-width="1.6"/><g clip-path="url(#cpph)"><rect x="0" y="0" width="36.7" height="100" fill="#D8C9AC"/><rect x="36.7" y="0" width="26.6" height="100" fill="#9C8F7A"/><rect x="63.3" y="0" width="40" height="100" fill="#1D423C"/></g><polygon points="33.1,35.8 44.0,32.0 44.9,34.5 50.0,35.8 55.1,34.5 56.0,32.0 66.9,35.8 74.9,48.2 69.1,52.2 64.2,46.4 64.2,67.8 35.8,67.8 35.8,46.4 30.9,52.2 25.1,48.2" fill="#F3ECDC"/></svg>';
const picked = {}, shown = {};

function render(){
  const g = $("grid"); if (!g) return;
  g.innerHTML = products.map(p => {
    const idx = shown[p.id] || 0, v = p.variants.find(v => v.size === picked[p.id]);
    const thumbs = p.images.length > 1 ? `<div class="thumbs">${p.images.map((f, i) =>
      `<img loading="lazy" src="${esc(imgUrl(f))}" data-th="${p.id}" data-i="${i}" class="${i === idx ? "on" : ""}" alt="">`).join("")}</div>` : "";
    const sizes = p.variants.length ? `<div class="sizes">${p.variants.map(x =>
      `<button type="button" data-size="${esc(x.size)}" data-pid="${p.id}" ${x.qty <= 0 ? "disabled" : ""} class="${picked[p.id] === x.size ? "on" : ""}">${esc(x.size)}</button>`).join("")}</div>` : "";
    const left = v && v.qty <= 3 ? `Only ${v.qty} left` : "";
    return `<article class="card">
      <div class="img" data-cycle="${p.id}">${p.sold ? '<span class="tag">Sold out</span>' : ""}
        ${markIcon}${p.images.length ? `<img src="${esc(imgUrl(p.images[idx]))}" alt="${esc(p.name)}" onerror="this.style.display='none'">` : ""}</div>
      ${thumbs}
      <div class="info">
        <div class="name">${esc(p.name)}</div>
        <div class="price">${p.price ? money(p.price) : "Price on WhatsApp"}</div>
        ${sizes}
        <button type="button" class="sc-link" data-sc="${p.id}">Size chart</button>
        <div class="left">${left}</div>
        <button class="add" data-add="${p.id}" ${p.sold ? "disabled" : ""}>${p.sold ? "Sold out" : "Add to cart"}</button>
      </div></article>`;
  }).join("");
}

if ($("grid")) $("grid").addEventListener("click", e => {
  const scb = e.target.closest("[data-sc]");
  if (scb){ openChart(products[+scb.dataset.sc]); return; }
  const th = e.target.closest("[data-th]");
  if (th){ shown[th.dataset.th] = +th.dataset.i; render(); return; }
  const cy = e.target.closest("[data-cycle]");
  if (cy){ const p = products[+cy.dataset.cycle]; if (p.images.length > 1){ shown[p.id] = ((shown[p.id] || 0) + 1) % p.images.length; render(); } return; }
  const sz = e.target.closest("[data-size]");
  if (sz){ picked[sz.dataset.pid] = sz.dataset.size; render(); return; }
  const add = e.target.closest("[data-add]");
  if (add){
    const p = products[+add.dataset.add];
    if (p.variants.length && !picked[p.id]){ alert("Please pick a size first."); return; }
    const v = p.variants.find(v => v.size === picked[p.id]) || {size:"", qty:99};
    const hit = cart.find(c => c.name === p.name && c.size === v.size);
    if (hit){ if (hit.qty >= v.qty){ alert("Only " + v.qty + " available in this size."); return; } hit.qty++; }
    else cart.push({name:p.name, size:v.size, price:p.price, qty:1, max:v.qty});
    save(); drawCart(); openCart();
  }
});


/* ---- size chart popup ---- */
const chartFor = p => (p.chart || (CONFIG.SIZE_CHARTS && CONFIG.SIZE_CHARTS[p.cat]) || "").trim();
/* Sheet cell format:  M=Chest 40, Length 27, Shoulder 18; L=Chest 42, Length 28, Shoulder 19   (or an image file name) */
function parseChart(txt){
  const rows = [], labels = [];
  txt.split(/;|\n/).map(s => s.trim()).filter(Boolean).forEach(part => {
    const m = part.match(/^([^=:]+)[=:](.*)$/); if (!m) return;
    const cells = {};
    m[2].split(",").forEach(c => {
      const mm = c.trim().match(/^(.*?)\s+(\d[\d.\/ ]*\s*(?:in|inch|inches|cm|mm|")?)$/i);
      if (mm && mm[1].trim()){ const l = mm[1].trim(); if (!labels.includes(l)) labels.push(l); cells[l] = mm[2].trim(); }
    });
    rows.push({size: m[1].trim(), cells});
  });
  return {labels, rows};
}
function openChart(p){
  let m = $("scm");
  if (!m){
    m = document.createElement("div"); m.className = "scm"; m.id = "scm";
    m.innerHTML = '<div class="box"><button class="x" aria-label="Close" id="scx">×</button><div id="scb"></div></div>';
    document.body.appendChild(m);
    const close = () => m.classList.remove("open");
    m.addEventListener("click", e => { if (e.target === m) close(); });
    $("scx").onclick = close;
    document.addEventListener("keydown", e => { if (e.key === "Escape") close(); });
  }
  const t = chartFor(p);
  const wa = "https://wa.me/" + CONFIG.WHATSAPP + "?text=" + encodeURIComponent("Hi Neutral Basics! I need help choosing a size for: " + p.name);
  let body;
  if (t && (/\.(jpe?g|png|webp|gif)$/i.test(t) || /^https?:/i.test(t))){
    body = '<img src="' + esc(imgUrl(t)) + '" alt="Size chart">';
  } else {
    const c = t ? parseChart(t) : null;
    if (c && c.rows.length && c.labels.length){
      body = '<table><thead><tr><th>Size</th>' + c.labels.map(l => '<th>' + esc(l) + '</th>').join("") + '</tr></thead><tbody>' +
        c.rows.map(r => '<tr><td>' + esc(r.size) + '</td>' + c.labels.map(l => '<td>' + esc(r.cells[l] || "–") + '</td>').join("") + '</tr>').join("") + '</tbody></table>';
    } else if (t){
      body = '<p class="none" style="white-space:pre-line">' + esc(t) + '</p>';
    } else {
      body = '<p class="none">The size chart for this style is coming soon.</p><a class="wa-help" href="' + wa + '" target="_blank" rel="noopener">Ask on WhatsApp</a>';
    }
  }
  $("scb").innerHTML = '<h3>Size chart</h3><div class="sub">' + esc(p.name) + '</div>' + body +
    (t ? '<p class="tip">Not sure which size? <a href="' + wa + '" target="_blank" rel="noopener">Message us on WhatsApp</a>.</p>' : "");
  m.classList.add("open");
}

function drawCart(){
  $("count").textContent = cart.reduce((a, c) => a + c.qty, 0);
  $("items").innerHTML = cart.length ? cart.map((c, i) => `
    <div class="row"><div>
      <div>${esc(c.name)}</div><small>${c.size ? "Size " + esc(c.size) : ""}</small>
      <div class="qty"><button data-dec="${i}">−</button>${c.qty}<button data-inc="${i}">+</button></div>
    </div><div>${c.price ? money(c.price * c.qty) : ""}</div></div>`).join("")
    : '<div class="empty">Your cart is empty.</div>';
  $("total").textContent = money(cart.reduce((a, c) => a + c.price * c.qty, 0));
  $("foot").style.display = cart.length ? "flex" : "none";
}
$("items").addEventListener("click", e => {
  const d = e.target.closest("[data-dec]"), n = e.target.closest("[data-inc]");
  if (d){ const c = cart[+d.dataset.dec]; if (--c.qty <= 0) cart.splice(+d.dataset.dec, 1); }
  if (n){ const c = cart[+n.dataset.inc]; if (c.qty < (c.max || 99)) c.qty++; else alert("Only " + c.max + " available in this size."); }
  if (d || n){ save(); drawCart(); }
});
function openCart(){ $("drawer").classList.add("open"); $("overlay").classList.add("open"); }
function closeCart(){ $("drawer").classList.remove("open"); $("overlay").classList.remove("open"); }
$("openCart").onclick = openCart; $("closeCart").onclick = closeCart; $("overlay").onclick = closeCart;

$("checkout").onclick = () => {
  const name = $("cName").value.trim(), addr = $("cAddr").value.trim();
  if (!cart.length) return;
  if (!name || !addr){ alert("Please add your name and address."); return; }
  const lines = cart.map((c, i) =>
    `${i + 1}. ${c.name}${c.size ? " (Size " + c.size + ")" : ""} x${c.qty}${c.price ? " - " + money(c.price * c.qty) : ""}`);
  const total = cart.reduce((a, c) => a + c.price * c.qty, 0);
  const msg = `Hi Neutral Basics! I'd like to place an order:\n\n${lines.join("\n")}\n\n` +
    (total ? `Total: ${money(total)}\n\n` : "") + `Name: ${name}\nAddress: ${addr}`;
  window.open(`https://wa.me/${CONFIG.WHATSAPP}?text=${encodeURIComponent(msg)}`, "_blank");
};

if (CONFIG.INSTAGRAM) document.querySelectorAll("[data-ig]").forEach(a => {
  a.href = "https://instagram.com/" + CONFIG.INSTAGRAM; a.hidden = false;
  const s = a.querySelector(".igt"); if (s) s.textContent = "@" + CONFIG.INSTAGRAM;
});
$("yr").textContent = new Date().getFullYear();
drawCart();
