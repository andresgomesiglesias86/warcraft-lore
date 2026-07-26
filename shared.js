/* ═══ SHARED — helpers communs à toutes les pages ═══ */
/* Dépend de warcraft-data.js (CHARS, PORTRAITS_IMG, RELS, etc.) */

const RING_COLOR = { demon:"#b0402f", corrupt:"#82c437", draenei:"#6db3d8", mystery:"#b48cdc", paladin:"#ffe050" };
const EDGE_COLOR = { fam:"#cba135", ami:"#6db3d8", man:"#82c437", con:"#b0402f" };
const STATUS_LABELS = { vivant:"Vivant", mort:"Mort", dechu:"Déchu", corrompu:"Corrompu" };

/* Navigation : liste des menus (label + fichier + clé active) */
const NAV = [
  { key:"personnages",  label:"Personnages",     href:"personnages.html" },
  { key:"livres",       label:"Ordre de lecture", href:"livres.html" },
  { key:"bibliotheque", label:"Bibliothèque",    href:"bibliotheque.html" },
  { key:"jeu",          label:"En jeu",          href:"jeu.html" },
  { key:"cinematiques", label:"Cinématiques",    href:"cinematiques.html" },
];

/* Rend le header commun (titre + anti-spoilers + onglets).
   activeKey = clé du menu courant pour surligner l'onglet. */
function renderMasthead(activeKey) {
  const tabs = NAV.map(n =>
    `<a class="tab${n.key === activeKey ? " active" : ""}" href="${n.href}">${n.label}</a>`
  ).join("");

  return `
    <header id="masthead">
      <a href="index.html" style="text-decoration:none;color:inherit">
        <h1>Warcraft</h1>
        <p>La Saga complète</p>
      </a>
      <button class="nospoil-toggle" id="nospoil-btn">🙈 Anti-spoilers</button>
      <div class="tabs">${tabs}</div>
    </header>`;
}

/* Lien vers la page d'un personnage */
function charUrl(id) { return `personnage.html?id=${encodeURIComponent(id)}`; }

/* ═══ ANTI-SPOILERS (partagé) ═══ */
function initNospoil() {
  const btn = document.getElementById("nospoil-btn");
  if (!btn) return;
  let noSpoil = localStorage.getItem("nospoil") === "1";
  const apply = () => {
    document.body.classList.toggle("no-spoil", noSpoil);
    btn.classList.toggle("active", noSpoil);
    btn.textContent = noSpoil ? "👁 Spoilers cachés — toucher pour révéler" : "🙈 Anti-spoilers";
    if (!noSpoil) document.querySelectorAll(".spoilable.revealed").forEach(e => e.classList.remove("revealed"));
  };
  btn.onclick = () => { noSpoil = !noSpoil; localStorage.setItem("nospoil", noSpoil ? "1" : "0"); apply(); };
  apply();
  document.addEventListener("click", e => {
    if (!noSpoil) return;
    const s = e.target.closest(".spoilable");
    if (s && !s.classList.contains("revealed")) { s.classList.add("revealed"); e.stopPropagation(); }
  });
}

/* ═══ RECHERCHE PERSONNAGES (partagée) — redirige vers personnage.html ═══ */
function initCharSearch() {
  const input = document.getElementById("char-search");
  const results = document.getElementById("search-results");
  if (!input || !results) return;

  input.addEventListener("input", () => {
    const q = input.value.toLowerCase().trim();
    if (!q) { results.style.display = "none"; results.innerHTML = ""; return; }
    const matches = Object.entries(CHARS).filter(([id, c]) =>
      c.name.toLowerCase().includes(q) || c.role.toLowerCase().includes(q)
    );
    if (!matches.length) { results.style.display = "none"; results.innerHTML = ""; return; }
    results.innerHTML = matches.map(([id, c]) =>
      `<a class="search-item" href="${charUrl(id)}">${c.icon} <b>${c.name}</b> <small>${c.role}</small></a>`
    ).join("");
    results.style.display = "block";
  });

  document.addEventListener("click", e => {
    if (!e.target.closest(".search-wrap")) results.style.display = "none";
  });
}

/* ═══ HELPERS FICHE PERSONNAGE ═══ */
function wikiBtn(page) {
  return page ? `<a class="wikibtn" href="${WIKI_BASE}${page}" target="_blank" rel="noopener">🔗 Voir sur Warcraft Wiki</a>` : "";
}

function buildInfobox(id) {
  const info = CHAR_INFO[id];
  if (!info) return "";
  const row = (k, v) => `<div class="infobox-row"><span class="ib-key">${k}</span><span class="ib-val">${v}</span></div>`;
  let rows = row("Race", info.race) + row("Titre", info.titre) + row("Affiliation", info.affil);
  if (info.statut) rows += row("Statut", `<span class="status-dot ${info.statut}"></span>${STATUS_LABELS[info.statut] || info.statut}`);
  if (info.lieu) rows += row("Naissance", info.lieu);
  if (info.parents && info.parents.length) {
    const pHtml = info.parents.map(p => CHARS[p.id] ? `<a class="ib-link" href="${charUrl(p.id)}">${p.nom}</a>` : p.nom).join(" &amp; ");
    rows += row("Parents", pHtml);
  }
  return `<div class="infobox">${rows}</div>`;
}

function buildBib(id) {
  const entries = CHAR_BIB[id] || [];
  if (!entries.length) return "";
  const rows = entries.map(e => {
    const badge = e.type === "short" ? `<span class="bib-badge short">Nouvelle</span>` : `<span class="bib-badge novel">№ ${e.n}</span>`;
    return `<div class="bib-entry">${badge}<div class="bib-info"><span class="bib-book">${e.t}</span></div></div><div class="bib-role spoilable">${e.r}</div>`;
  }).join("");
  return `<div class="bib-section"><div class="bib-title">Bibliographie</div>${rows}</div>`;
}

function buildQuests(id) {
  const entries = CHAR_QUESTS[id] || [];
  if (!entries.length) return "";
  const rows = entries.map(e =>
    `<div class="quest-entry"><span class="quest-badge">${e.g}</span><div class="quest-info"><span class="quest-name">${e.n}</span><span class="quest-zone"> — ${e.z}</span><span class="quest-tip">${e.t}</span></div></div>`
  ).join("");
  return `<div class="quest-section"><div class="quest-title">🗡️ Quêtes en jeu</div>${rows}</div>`;
}

const ERA_LABELS = {
  "The War Within":"The War Within","Midnight":"Midnight","Dragonflight":"Dragonflight",
  "Shadowlands":"Shadowlands","Battle for Azeroth":"Battle for Azeroth",
  "War of the Ancients":"Guerre des Anciens","Legion":"Legion",
  "Warlords of Draenor":"Warlords of Draenor","Mists of Pandaria":"Mists of Pandaria","":"Hors extension"
};

function buildCharVideos(id) {
  const vids = VIDEOS.filter(v => v.chars.includes(id));
  if (!vids.length) return "";
  const rows = vids.map(v => `
    <div class="char-vid-entry">
      <div class="char-vid-thumb" data-yt="${v.youtube}">
        <img src="https://i.ytimg.com/vi/${v.youtube}/mqdefault.jpg" loading="lazy" alt="${v.title}" onerror="this.src='https://i.ytimg.com/vi/${v.youtube}/default.jpg'">
        <div class="char-vid-play">▶</div>
      </div>
      <div class="char-vid-info">
        <div class="char-vid-title">${v.title}</div>
        ${v.era ? `<div class="char-vid-era">${ERA_LABELS[v.era] || v.era}</div>` : ""}
        <p class="char-vid-desc spoilable">${v.desc}</p>
      </div>
    </div>`).join("");
  return `<div class="char-vid-section"><div class="char-vid-section-title">🎬 Cinématiques</div>${rows}</div>`;
}

function buildRelations(id) {
  const rels = RELS.filter(([a, b]) => a === id || b === id);
  if (!rels.length) return "";
  const cards = rels.map(([a, b, type, txt]) => {
    const otherId = a === id ? b : a;
    const other = CHARS[otherId];
    if (!other) return "";
    const ring = RING_COLOR[other.cls] || "#cba135";
    return `
      <a class="rel-card" href="${charUrl(otherId)}">
        <div class="rel-card-img" style="border-color:${ring}">
          ${PORTRAITS_IMG[otherId] ? `<img src="${PORTRAITS_IMG[otherId]}" alt="${other.name}" onerror="this.style.display='none';this.nextElementSibling.style.display='flex'">` : ""}
          <div class="rel-card-fallback" style="${PORTRAITS_IMG[otherId] ? 'display:none' : 'display:flex'}">${other.icon}</div>
          <div class="rel-card-bar" style="background:${EDGE_COLOR[type]}"></div>
        </div>
        <div class="rel-card-info">
          <div class="rel-card-name">${other.name}</div>
          <div class="rel-card-txt">${txt}</div>
        </div>
      </a>`;
  }).join("");
  return cards;
}
