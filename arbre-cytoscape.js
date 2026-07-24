/* ═══ DATA ═══ */
// Les données sont chargées depuis warcraft-data.js
// FACTIONS, CHARS (81 personnages), GROUPS (groupes d'affichage), RELS, BOOKS, PORTRAITS_IMG, LIB, REGIONS, WIKI_BASE, WIKI, WIKI_REGIONS, CHAR_INFO, CHAR_BIB, CHAR_QUESTS

/* ═══ HELPERS ═══ */
function iconSvgUrl(icon,color){
  const s=`<svg xmlns="http://www.w3.org/2000/svg" width="72" height="72"><defs><radialGradient id="g" cx="40%" cy="35%" r="65%"><stop offset="0%" stop-color="${color}" stop-opacity=".35"/><stop offset="100%" stop-color="${color}" stop-opacity=".08"/></radialGradient></defs><circle cx="36" cy="36" r="35" fill="#1a0d08"/><circle cx="36" cy="36" r="35" fill="url(#g)"/><text x="36" y="51" text-anchor="middle" font-size="30" font-family="Apple Color Emoji,Segoe UI Emoji,serif">${icon}</text></svg>`;
  return 'data:image/svg+xml,'+encodeURIComponent(s);
}
function wikiBtn(page){return page?`<a class="wikibtn" href="${WIKI_BASE}${page}" target="_blank" rel="noopener">🔗 Voir sur Warcraft Wiki</a>`:""}
function medallion(c,id){
  const ring={demon:"#b0402f",corrupt:"#82c437",draenei:"#6db3d8",mystery:"#b48cdc",paladin:"#ffe050"}[c.cls]||"#cba135";
  if(PORTRAITS_IMG[id])return`<img style="width:110px;height:110px;object-fit:cover;border-radius:0;border:1px solid ${ring};box-shadow:0 4px 12px rgba(0,0,0,.6);display:block;flex-shrink:0" src="${PORTRAITS_IMG[id]}" alt="${c.name}" loading="lazy" onerror="this.replaceWith(document.createElementNS('http://www.w3.org/2000/svg','svg'))">`;
  return`<svg class="medaillon" viewBox="0 0 120 120"><rect width="120" height="120" rx="5" fill="#160d08"/><rect x="3" y="3" width="114" height="114" rx="3" fill="${ring}" opacity=".1"/><text x="60" y="74" text-anchor="middle" font-size="46">${c.icon}</text><rect width="120" height="120" rx="5" fill="none" stroke="#7a1f1f" stroke-width="2.5"/><rect x="3" y="3" width="114" height="114" rx="3" fill="none" stroke="${ring}" stroke-width="1" opacity=".45"/></svg>`;
}

/* ═══ PERSONNAGES : GROUPES DE CARTES ═══ */
const RING_COLOR={demon:"#b0402f",corrupt:"#82c437",draenei:"#6db3d8",mystery:"#b48cdc",paladin:"#ffe050"};
const EDGE_COLOR={fam:"#cba135",ami:"#6db3d8",man:"#82c437",con:"#b0402f"};

// Groupes explicites définis dans warcraft-data.js (GROUPS) ; les personnages non listés vont dans un groupe "Autres".
const charsByFaction=GROUPS.map(g=>({label:g.label,ids:[...g.ids]}));
const grouped=new Set(GROUPS.flatMap(g=>g.ids));
const others=Object.keys(CHARS).filter(id=>!grouped.has(id));
if(others.length) charsByFaction.push({label:"Autres",ids:others});

const groupsEl=document.getElementById("chars-groups");
function renderGroups(){
  groupsEl.innerHTML="";
  charsByFaction.filter(g=>g.ids.length).forEach(g=>{
    const wrap=document.createElement("div");wrap.className="char-group";
    const title=document.createElement("div");title.className="char-group-title";title.textContent=g.label;
    wrap.appendChild(title);
    const grid=document.createElement("div");grid.className="char-grid";
    g.ids.forEach(id=>{
      const c=CHARS[id];if(!c)return;
      const ring=RING_COLOR[c.cls]||"#cba135";
      const card=document.createElement("div");card.className="char-card";card.dataset.id=id;
      const imgHtml=PORTRAITS_IMG[id]
        ?`<img src="${PORTRAITS_IMG[id]}" alt="${c.name}" loading="lazy" onerror="this.style.display='none';this.nextElementSibling.style.display='flex'">`
        :"";
      card.innerHTML=`
        <div class="char-card-img" style="border-color:${ring}">
          ${imgHtml}
          <div class="char-card-fallback" style="${PORTRAITS_IMG[id]?'display:none':'display:flex'}">${c.icon}</div>
        </div>
        <div class="char-card-name">${c.name}</div>`;
      card.onclick=()=>openSheet(id,false);
      grid.appendChild(card);
    });
    wrap.appendChild(grid);
    groupsEl.appendChild(wrap);
  });
}
renderGroups();

/* ═══ BOOKS (rangées alternées, cadre orné) ═══ */
const booksEl=document.getElementById("books");
BOOKS.forEach((b,i)=>{
  const d=document.createElement("div");d.className="book-row";d.style.flexDirection=i%2===0?"row":"row-reverse";
  const persos=b.persos.map(([id,name])=>id?`<span class="link" data-char="${id}">${name}</span>`:`<span>${name}</span>`).join("");
  const coverHtml=COVERS[b.num]?`<img src="${COVERS[b.num]}" class="book-cover-framed" onerror="this.style.display='none'" alt="Couverture ${b.title}">`:'';
  d.innerHTML=`
    <div class="book-frame">
      <span class="frame-corner tl"></span><span class="frame-corner tr"></span><span class="frame-corner bl"></span><span class="frame-corner br"></span>
      <div class="book-num-badge">${b.num}</div>
      ${coverHtml}
    </div>
    <div class="book-content">
      <div class="book-title-banner">${b.title}</div>
      <div class="meta">${b.author} · ${b.year}</div>
      <div class="badges"><span class="period">📍 ${b.period}</span></div>
      <p>${b.resume}</p>
      <div class="why spoilable"><b>POURQUOI À CETTE PLACE</b>${b.why}</div>
      <div class="persos">${persos}</div>
    </div>`;
  booksEl.appendChild(d);
});
booksEl.addEventListener("click",e=>{const c=e.target.closest(".link");if(c)openSheet(c.dataset.char,false);});

/* ═══ BIBLIOTHÈQUE ═══ */
const libEl=document.getElementById("lib");
LIB.forEach((cat,i)=>{
  const d=document.createElement("details");if(i===0)d.open=true;
  const rows=cat.items.map(item=>`<li><span class="yr">${item.yr}</span><span>${item.t}</span><span class="au">— ${item.au}</span></li>`).join("");
  d.innerHTML=`<summary>${cat.icon} ${cat.title}<span class="cnt">${cat.items.length} titres</span></summary><div class="cat-desc">${cat.desc}</div><ol>${rows}</ol>`;
  libEl.appendChild(d);
});

/* ═══ DRAENOR MAP ═══ */
function openRegion(id){
  const r=REGIONS[id];
  document.querySelectorAll("#draenor .region").forEach(p=>p.classList.toggle("sel",p.dataset.region===id));
  document.getElementById("s-art").innerHTML=`<div class="art">${r.art}</div>`;
  document.getElementById("s-name").textContent="🗺️ "+r.name;
  document.getElementById("s-role").textContent=r.sub;
  document.getElementById("s-desc").textContent=r.hist;
  const ul=document.getElementById("s-rels");ul.innerHTML="";ul.className="events";
  r.events.forEach(ev=>{const li=document.createElement("li");li.className="fam";li.textContent=ev;ul.appendChild(li);});
  const pd=document.getElementById("s-persos");pd.innerHTML="";
  r.chars.forEach(cid=>{const s=document.createElement("span");s.textContent=CHARS[cid].icon+" "+CHARS[cid].name;s.onclick=()=>openSheet(cid,false);pd.appendChild(s);});
  document.getElementById("s-wiki").innerHTML=wikiBtn(WIKI_REGIONS[id]);
  document.getElementById("s-bib").innerHTML="";document.getElementById("s-info").innerHTML="";document.getElementById("s-quests").innerHTML="";
  document.getElementById("sheet-top").classList.add("region-mode");
  sheet.classList.add("open");
}
document.querySelectorAll("#draenor .region").forEach(p=>p.onclick=()=>openRegion(p.dataset.region));
document.querySelectorAll("#draenor .loc").forEach(l=>l.onclick=()=>openRegion(l.dataset.region));

/* ═══ EN JEU (timeline verticale) ═══ */
const gameEl=document.getElementById("game");
gameEl.className="game-timeline";
GAME.forEach(g=>{
  const row=document.createElement("div");row.className="game-row";
  let questsHtml="";
  if(g.quests&&g.quests.length){
    const items=g.quests.map(q=>`<li><span class="q-name">⬥ ${q.n}</span><span class="q-zone">${q.z}</span><span class="q-tip">${q.t}</span></li>`).join("");
    questsHtml=`<div class="quests-wrap"><div class="quests-title">⚔ Quêtes clés dans l'ordre</div><ul class="quests-list">${items}</ul></div>`;
  }
  row.innerHTML=`
    <div class="game-num"><div class="game-num-circle">${g.num}</div></div>
    <div class="game-card">
      <h2>${g.title}</h2>
      <span class="period">📍 ${g.period}</span>
      <p>${g.resume}</p>
      <div class="why">${g.why}</div>
      ${questsHtml}
    </div>`;
  gameEl.appendChild(row);
});

/* ═══ CINÉMATIQUES ═══ */
(function(){
  // Ordre Blizzard = ordre dans le tableau VIDEOS (par défaut)
  // Ordre lore = ordre chronologique in-universe
  const ERA_CHRON_ORDER=["War of the Ancients","Mists of Pandaria","Warlords of Draenor","Legion","Battle for Azeroth","Shadowlands","Dragonflight","The War Within","Midnight",""];
  const ERA_LABELS={"The War Within":"The War Within","Midnight":"Midnight","Dragonflight":"Dragonflight","Shadowlands":"Shadowlands","Battle for Azeroth":"Battle for Azeroth","War of the Ancients":"Guerre des Anciens","Legion":"Legion","Warlords of Draenor":"Warlords of Draenor","Mists of Pandaria":"Mists of Pandaria","":"Hors extension"};
  // Pour les filtres, on affiche les eras dans l'ordre chrono
  const ERA_FILTER_ORDER=[...ERA_CHRON_ORDER];

  let activeEra="all";
  let sortMode="blizzard"; // "blizzard" | "lore"
  const filtersEl=document.getElementById("vid-filters");
  const gridEl=document.getElementById("vid-grid");

  // Sort toggle button
  const sortBar=document.createElement("div");
  sortBar.className="vid-sort-bar";
  sortBar.innerHTML=`
    <span class="vid-sort-label">Ordre :</span>
    <button class="vid-sort-btn active" data-sort="blizzard">📅 Blizzard</button>
    <button class="vid-sort-btn" data-sort="lore">📖 Ordre du lore</button>`;
  filtersEl.parentNode.insertBefore(sortBar,filtersEl);
  sortBar.querySelectorAll(".vid-sort-btn").forEach(btn=>{
    btn.onclick=()=>{
      sortMode=btn.dataset.sort;
      sortBar.querySelectorAll(".vid-sort-btn").forEach(b=>b.classList.toggle("active",b===btn));
      renderGrid();
    };
  });

  // Build era list from data (chrono order, only eras that exist)
  const eras=[];
  ERA_FILTER_ORDER.forEach(e=>{if(VIDEOS.some(v=>v.era===e))eras.push(e);});

  // Filter chips
  const allChip=document.createElement("span");
  allChip.className="vid-chip active";allChip.textContent="Tout";
  allChip.onclick=()=>setEra("all");
  filtersEl.appendChild(allChip);
  eras.forEach(era=>{
    const ch=document.createElement("span");
    ch.className="vid-chip";ch.textContent=ERA_LABELS[era]||era||"Hors extension";
    ch.dataset.era=era;
    ch.onclick=()=>setEra(era);
    filtersEl.appendChild(ch);
  });

  function setEra(era){
    activeEra=era;
    filtersEl.querySelectorAll(".vid-chip").forEach(c=>{
      c.classList.toggle("active", c===allChip?(era==="all"):(c.dataset.era===era));
    });
    renderGrid();
  }

  function getSorted(list){
    if(sortMode==="blizzard") return list; // ordre original du tableau
    // Ordre lore : trier par position dans ERA_CHRON_ORDER, puis par index original
    return [...list].sort((a,b)=>{
      const ia=ERA_CHRON_ORDER.indexOf(a.era);
      const ib=ERA_CHRON_ORDER.indexOf(b.era);
      const ra=ia===-1?999:ia;
      const rb=ib===-1?999:ib;
      return ra!==rb ? ra-rb : VIDEOS.indexOf(a)-VIDEOS.indexOf(b);
    });
  }

  function renderGrid(){
    gridEl.innerHTML="";
    const filtered=activeEra==="all"?VIDEOS:VIDEOS.filter(v=>v.era===activeEra);
    const sorted=getSorted(filtered);

    // En mode lore, grouper par ère avec un séparateur
    if(sortMode==="lore" && activeEra==="all"){
      let lastEra=null;
      sorted.forEach(v=>{
        if(v.era!==lastEra){
          lastEra=v.era;
          const sep=document.createElement("div");
          sep.className="vid-era-separator";
          sep.textContent=ERA_LABELS[v.era]||v.era||"Hors extension";
          gridEl.appendChild(sep);
        }
        gridEl.appendChild(makeCard(v));
      });
    } else {
      sorted.forEach(v=>gridEl.appendChild(makeCard(v)));
    }
  }

  function makeCard(v){
      const card=document.createElement("div");
      card.className="vid-card";
      const charBadges=v.chars.map(cid=>{
        const c=CHARS[cid];
        return c?`<span class="vid-char-badge">${c.icon} ${c.name}</span>`:"";
      }).join("");
      card.innerHTML=`
        <div class="vid-thumb" data-yt="${v.youtube}">
          <img src="https://i.ytimg.com/vi/${v.youtube}/mqdefault.jpg" alt="${v.title}" loading="lazy" onerror="this.src='https://i.ytimg.com/vi/${v.youtube}/default.jpg'">
          <div class="vid-play-btn">▶</div>
        </div>
        <div class="vid-info">
          <div class="vid-title">${v.title}</div>
          ${v.era?`<div class="vid-era-tag">${ERA_LABELS[v.era]||v.era}</div>`:""}
          <p class="vid-desc">${v.desc}</p>
          ${charBadges?`<div class="vid-chars">${charBadges}</div>`:""}
        </div>`;
      card.querySelector(".vid-thumb").onclick=()=>openVidModal(v);
      card.querySelectorAll(".vid-char-badge").forEach((b,i)=>{
        b.onclick=e=>{e.stopPropagation();openSheet(v.chars[i],false);};
      });
      return card;
  }

  function openVidModal(v){
    document.getElementById("vid-modal-iframe").src=`https://www.youtube.com/embed/${v.youtube}?autoplay=1`;
    document.getElementById("vid-modal-title").textContent=v.title;
    document.getElementById("vid-modal-era").textContent=v.era?(ERA_LABELS[v.era]||v.era):"";
    document.getElementById("vid-modal-desc").textContent=v.desc;
    const charHtml=v.chars.map(cid=>{
      const c=CHARS[cid];
      return c?`<span class="vid-modal-char" data-char="${cid}">${c.icon} ${c.name}</span>`:"";
    }).join("");
    document.getElementById("vid-modal-chars").innerHTML=charHtml?`<b>Personnages :</b> ${charHtml}`:"";
    document.getElementById("vid-modal-chars").querySelectorAll(".vid-modal-char").forEach(el=>{
      el.onclick=()=>{closeVidModal();openSheet(el.dataset.char,false);};
    });
    document.getElementById("vid-modal-overlay").classList.add("open");
  }

  function closeVidModal(){
    document.getElementById("vid-modal-iframe").src="";
    document.getElementById("vid-modal-overlay").classList.remove("open");
  }

  document.getElementById("vid-modal-close").onclick=closeVidModal;
  document.getElementById("vid-modal-overlay").onclick=e=>{if(e.target===e.currentTarget)closeVidModal();};

  renderGrid();
})();

/* ═══ TABS ═══ */
document.querySelectorAll(".tab").forEach(t=>{
  t.onclick=()=>{
    document.querySelectorAll(".tab").forEach(x=>x.classList.remove("active"));
    document.querySelectorAll(".view").forEach(x=>x.classList.remove("active"));
    t.classList.add("active");
    document.getElementById("view-"+t.dataset.view).classList.add("active");
  };
});

/* Deep-link depuis la page d'accueil : arbre-cytoscape.html#books, #game, #videos… */
(()=>{
  const tab=document.querySelector(`.tab[data-view="${location.hash.slice(1)}"]`);
  if(tab)tab.click();
})();

/* ═══ SHEET ═══ */
const sheet=document.getElementById("sheet");
let selected=null;
const STATUS_LABELS={vivant:"Vivant",mort:"Mort",dechu:"Déchu",corrompu:"Corrompu"};

function renderInfo(id,targetId="s-info"){
  const el=document.getElementById(targetId);
  const info=CHAR_INFO[id];
  if(!info){el.innerHTML="";return;}
  const row=(k,v)=>`<div class="infobox-row"><span class="ib-key">${k}</span><span class="ib-val">${v}</span></div>`;
  let rows=`${row("Race",info.race)}${row("Titre",info.titre)}${row("Affiliation",info.affil)}`;
  if(info.lieu) rows+=row("Naissance",info.lieu);
  if(info.parents&&info.parents.length){
    const pHtml=info.parents.map(p=>CHARS[p.id]?`<span class="ib-link" data-char="${p.id}">${p.nom}</span>`:p.nom).join(' &amp; ');
    rows+=row("Parents",pHtml);
  }
  el.innerHTML=`<div class="infobox">${rows}</div>`;
}
function renderBib(id,targetId="s-bib"){
  const el=document.getElementById(targetId);
  const entries=(CHAR_BIB[id]||[]);
  if(!entries.length){el.innerHTML="";return;}
  const rows=entries.map(e=>{
    const isShort=e.type==="short";
    const badge=isShort?`<span class="bib-badge short">Nouvelle</span>`:`<span class="bib-badge novel">№ ${e.n}</span>`;
    return`<div class="bib-entry">${badge}<div class="bib-info"><span class="bib-book">${e.t}</span></div></div><div class="bib-role spoilable">${e.r}</div>`;
  }).join("");
  el.innerHTML=`<div class="bib-section"><div class="bib-title">Bibliographie</div>${rows}</div>`;
}
function renderQuests(id,targetId="s-quests"){
  const el=document.getElementById(targetId);
  const entries=(CHAR_QUESTS[id]||[]);
  if(!entries.length){el.innerHTML="";return;}
  const rows=entries.map(e=>`<div class="quest-entry"><span class="quest-badge">${e.g}</span><div class="quest-info"><span class="quest-name">${e.n}</span><span class="quest-zone"> — ${e.z}</span><span class="quest-tip">${e.t}</span></div></div>`).join("");
  el.innerHTML=`<div class="quest-section"><div class="quest-title">🗡️ Quêtes en jeu</div>${rows}</div>`;
}
function renderCharVideos(id,targetId="s-videos"){
  const el=document.getElementById(targetId);
  const vids=VIDEOS.filter(v=>v.chars.includes(id));
  if(!vids.length){el.innerHTML="";return;}
  const ERA_LABELS={"The War Within":"The War Within","Midnight":"Midnight","Dragonflight":"Dragonflight","Shadowlands":"Shadowlands","Battle for Azeroth":"Battle for Azeroth","War of the Ancients":"Guerre des Anciens","Legion":"Legion","Warlords of Draenor":"Warlords of Draenor","Mists of Pandaria":"Mists of Pandaria","":"Hors extension"};
  const rows=vids.map(v=>`
    <div class="char-vid-entry">
      <div class="char-vid-thumb" data-yt="${v.youtube}">
        <img src="https://i.ytimg.com/vi/${v.youtube}/mqdefault.jpg" loading="lazy" alt="${v.title}" onerror="this.src='https://i.ytimg.com/vi/${v.youtube}/default.jpg'">
        <div class="char-vid-play">▶</div>
      </div>
      <div class="char-vid-info">
        <div class="char-vid-title">${v.title}</div>
        ${v.era?`<div class="char-vid-era">${ERA_LABELS[v.era]||v.era}</div>`:""}
        <p class="char-vid-desc spoilable">${v.desc}</p>
      </div>
    </div>`).join("");
  el.innerHTML=`<div class="char-vid-section"><div class="char-vid-section-title">🎬 Cinématiques</div>${rows}</div>`;
  el.querySelectorAll(".char-vid-thumb").forEach((thumb,i)=>{
    thumb.onclick=()=>{
      // Ouvrir la modal vidéo globale
      document.getElementById("vid-modal-iframe").src=`https://www.youtube.com/embed/${vids[i].youtube}?autoplay=1`;
      document.getElementById("vid-modal-title").textContent=vids[i].title;
      document.getElementById("vid-modal-era").textContent=vids[i].era?(ERA_LABELS[vids[i].era]||vids[i].era):"";
      document.getElementById("vid-modal-desc").textContent=vids[i].desc;
      document.getElementById("vid-modal-chars").innerHTML="";
      document.getElementById("vid-modal-overlay").classList.add("open");
    };
  });
}

function openLoreModal(id){
  const c=CHARS[id];
  document.getElementById("lore-modal-name").textContent=c.name;
  document.getElementById("lore-modal-role").textContent=c.role;
  document.getElementById("lore-modal-text").textContent=c.desc;
  document.getElementById("lore-modal-overlay").classList.add("open");
}
function openFullLoreModal(id){
  const c=CHARS[id];
  const info=CHAR_INFO[id];
  const imgData=PORTRAITS_IMG[id];

  // Construire l'en-tête : IMAGE à gauche + TITRE/INFOS à droite
  let headerHtml=``;

  // IMAGE d'abord
  if(imgData){
    headerHtml+=`<div class="full-lore-image"><img src="${imgData}" alt="${c.name}" loading="lazy"></div>`;
  }else{
    headerHtml+=`<div class="full-lore-image">${c.icon || '🎭'}</div>`;
  }

  // TITRE + INFOS à droite
  headerHtml+=`<div class="full-lore-title">
    <h2>${c.name}</h2>
    <p class="full-lore-subtitle">${c.role}</p>`;

  // Ajouter l'infobox si des infos existent
  if(info){
    headerHtml+=`<div class="full-lore-infobox">`;
    if(info.race) headerHtml+=`<div class="full-lore-info-row"><span class="full-lore-info-key">Race</span><span class="full-lore-info-val">${info.race}</span></div>`;
    if(info.titre) headerHtml+=`<div class="full-lore-info-row"><span class="full-lore-info-key">Titre</span><span class="full-lore-info-val">${info.titre}</span></div>`;
    if(info.affil) headerHtml+=`<div class="full-lore-info-row"><span class="full-lore-info-key">Affiliation</span><span class="full-lore-info-val">${info.affil}</span></div>`;
    if(info.statut) headerHtml+=`<div class="full-lore-info-row"><span class="full-lore-info-key">Statut</span><span class="full-lore-info-val"><span class="status-dot ${info.statut}"></span>${STATUS_LABELS[info.statut]||info.statut}</span></div>`;
    if(info.lieu) headerHtml+=`<div class="full-lore-info-row"><span class="full-lore-info-key">Naissance</span><span class="full-lore-info-val">${info.lieu}</span></div>`;
    headerHtml+=`</div>`;
  }

  headerHtml+=`</div>`;

  // Construire le corps avec le texte de description + sections
  let bodyHtml=`<div class="full-lore-text">${c.desc}</div>`;


  // Afficher dans les deux sections
  document.getElementById("full-lore-header").innerHTML=headerHtml;
  document.getElementById("full-lore-body").innerHTML=bodyHtml;

  document.getElementById("full-lore-overlay").classList.add("open");
}
document.getElementById("lore-modal-close").onclick=()=>document.getElementById("lore-modal-overlay").classList.remove("open");
document.getElementById("lore-modal-overlay").onclick=e=>{if(e.target===e.currentTarget)e.currentTarget.classList.remove("open");};
document.getElementById("full-lore-close").onclick=()=>document.getElementById("full-lore-overlay").classList.remove("open");
document.getElementById("full-lore-overlay").onclick=e=>{if(e.target===e.currentTarget)e.currentTarget.classList.remove("open");};

const charFullEl=document.getElementById("char-full");

function openSheet(id){
  document.querySelectorAll('.char-card.selected').forEach(el=>el.classList.remove('selected'));
  selected=id;
  const card=groupsEl.querySelector(`.char-card[data-id="${id}"]`);
  if(card) card.classList.add('selected');
  const c=CHARS[id];
  const ring=RING_COLOR[c.cls]||"#cba135";

  document.getElementById("cf-art").innerHTML=PORTRAITS_IMG[id]
    ?`<img src="${PORTRAITS_IMG[id]}" alt="${c.name}" style="border-color:${ring}" onerror="this.style.display='none'">`
    :`<div class="char-hero-fallback" style="border-color:${ring}">${c.icon}</div>`;
  document.getElementById("cf-wiki").innerHTML="";
  document.getElementById("cf-name").textContent=c.name;
  document.getElementById("cf-role").textContent=c.role;
  const shortText=CHAR_SHORT[id]||c.desc;
  document.getElementById("cf-desc").innerHTML=`${shortText}<br><button class="read-more-btn" onclick="openFullLoreModal('${id}')">📖 Lire l'histoire complète</button>`;
  renderInfo(id,"cf-info");renderBib(id,"cf-bib");renderQuests(id,"cf-quests");renderCharVideos(id,"cf-videos");

  const relsGrid=document.getElementById("cf-rels");relsGrid.innerHTML="";
  const rels=RELS.filter(([a,b])=>a===id||b===id);
  document.getElementById("cf-rels-section").style.display=rels.length?"":"none";
  rels.forEach(([a,b,type,txt])=>{
    const otherId=a===id?b:a;
    const other=CHARS[otherId];if(!other)return;
    const otherRing=RING_COLOR[other.cls]||"#cba135";
    const card=document.createElement("div");card.className="rel-card";
    card.innerHTML=`
      <div class="rel-card-img" style="border-color:${otherRing}">
        ${PORTRAITS_IMG[otherId]?`<img src="${PORTRAITS_IMG[otherId]}" alt="${other.name}" onerror="this.style.display='none';this.nextElementSibling.style.display='flex'">`:""}
        <div class="rel-card-fallback" style="${PORTRAITS_IMG[otherId]?'display:none':'display:flex'}">${other.icon}</div>
        <div class="rel-card-bar" style="background:${EDGE_COLOR[type]}"></div>
      </div>
      <div class="rel-card-info">
        <div class="rel-card-name">${other.name}</div>
        <div class="rel-card-txt">${txt}</div>
      </div>`;
    card.onclick=()=>openSheet(otherId);
    relsGrid.appendChild(card);
  });

  charFullEl.classList.add("open");
  charFullEl.scrollTop=0;
}
function closeSheet(){
  charFullEl.classList.remove("open");
  if(selected){
    const card=groupsEl.querySelector(`.char-card[data-id="${selected}"]`);
    if(card) card.classList.remove('selected');
    selected=null;
  }
}
document.getElementById("char-full-close").onclick=closeSheet;
document.getElementById("close").onclick=closeSheet;
document.getElementById('cf-info').addEventListener('click',e=>{
  const c=e.target.closest('.ib-link');
  if(c) openSheet(c.dataset.char);
});

/* ═══ CONTROLS ═══ */
// Search
const searchInput=document.getElementById('char-search');
const searchResults=document.getElementById('search-results');
searchInput.addEventListener('input',()=>{
  const q=searchInput.value.toLowerCase().trim();
  if(!q){searchResults.style.display='none';searchResults.innerHTML='';return;}
  const matches=Object.entries(CHARS).filter(([id,c])=>
    c.name.toLowerCase().includes(q)||c.role.toLowerCase().includes(q)
  );
  if(!matches.length){searchResults.style.display='none';searchResults.innerHTML='';return;}
  searchResults.innerHTML=matches.map(([id,c])=>
    `<div class="search-item" data-id="${id}">${c.icon} <b>${c.name}</b> <small>${c.role}</small></div>`
  ).join('');
  searchResults.style.display='block';
});
searchResults.addEventListener('click',e=>{
  const item=e.target.closest('.search-item');
  if(!item)return;
  const id=item.dataset.id;
  searchInput.value='';searchResults.style.display='none';
  // Switch to tree tab if not already active
  const treeTab=document.querySelector('[data-view="tree"]');
  if(!treeTab.classList.contains('active')) treeTab.click();
  openSheet(id);
});
document.addEventListener('click',e=>{
  if(!e.target.closest('.search-wrap')) searchResults.style.display='none';
});

/* ═══ ANTI-SPOILERS ═══ */
const nospoilBtn=document.getElementById("nospoil-btn");
let noSpoil=localStorage.getItem("nospoil")==="1";
function applyNospoil(){
  document.body.classList.toggle("no-spoil",noSpoil);
  nospoilBtn.classList.toggle("active",noSpoil);
  nospoilBtn.textContent=noSpoil?"👁 Spoilers cachés — toucher pour révéler":"🙈 Anti-spoilers";
  if(!noSpoil)document.querySelectorAll(".spoilable.revealed").forEach(e=>e.classList.remove("revealed"));
}
nospoilBtn.onclick=()=>{noSpoil=!noSpoil;localStorage.setItem("nospoil",noSpoil?"1":"0");applyNospoil();};
applyNospoil();
document.addEventListener("click",e=>{
  if(!noSpoil)return;
  const s=e.target.closest(".spoilable");
  if(s&&!s.classList.contains("revealed")){s.classList.add("revealed");e.stopPropagation();}
});
