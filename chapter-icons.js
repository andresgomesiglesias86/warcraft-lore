// SVG Icons for chapters - animated
const chapterIcons = {
  characters: `
    <svg viewBox="0 0 100 100" width="100" height="100" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <style>
          .icon-glow { filter: drop-shadow(0 0 8px rgba(203,161,53,.4)); }
          @keyframes pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.6; } }
          .icon-pulse { animation: pulse 3s ease-in-out infinite; }
        </style>
      </defs>
      <circle cx="50" cy="35" r="12" fill="none" stroke="var(--gold,#cba135)" stroke-width="2" class="icon-glow icon-pulse"/>
      <path d="M 50 50 L 35 70 M 50 50 L 65 70" stroke="var(--gold,#cba135)" stroke-width="2" fill="none" class="icon-glow"/>
      <circle cx="35" cy="75" r="3" fill="var(--gold,#cba135)" class="icon-glow"/>
      <circle cx="65" cy="75" r="3" fill="var(--gold,#cba135)" class="icon-glow"/>
    </svg>
  `,
  books: `
    <svg viewBox="0 0 100 100" width="100" height="100" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <style>
          .book-glow { filter: drop-shadow(0 0 8px rgba(203,161,53,.4)); }
          @keyframes float { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-8px); } }
          .book-float { animation: float 3s ease-in-out infinite; }
        </style>
      </defs>
      <rect x="35" y="30" width="30" height="40" fill="none" stroke="var(--gold,#cba135)" stroke-width="2" class="book-glow book-float"/>
      <line x1="50" y1="30" x2="50" y2="70" stroke="var(--gold,#cba135)" stroke-width="1" class="book-glow"/>
      <line x1="38" y1="38" x2="47" y2="38" stroke="var(--gold,#cba135)" stroke-width="1" class="book-glow"/>
      <line x1="38" y1="46" x2="47" y2="46" stroke="var(--gold,#cba135)" stroke-width="1" class="book-glow"/>
      <line x1="38" y1="54" x2="47" y2="54" stroke="var(--gold,#cba135)" stroke-width="1" class="book-glow"/>
      <line x1="38" y1="62" x2="47" y2="62" stroke="var(--gold,#cba135)" stroke-width="1" class="book-glow"/>
    </svg>
  `,
  games: `
    <svg viewBox="0 0 100 100" width="100" height="100" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <style>
          .game-glow { filter: drop-shadow(0 0 8px rgba(203,161,53,.4)); }
          @keyframes rotate { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
          .game-spin { animation: rotate 6s linear infinite; transform-origin: 50% 50%; }
        </style>
      </defs>
      <rect x="30" y="30" width="40" height="40" rx="3" fill="none" stroke="var(--gold,#cba135)" stroke-width="2" class="game-glow"/>
      <circle cx="42" cy="50" r="4" fill="var(--gold,#cba135)" class="game-glow game-spin"/>
      <circle cx="58" cy="50" r="4" fill="var(--gold,#cba135)" class="game-glow game-spin"/>
      <circle cx="50" cy="40" r="3" fill="var(--gold,#cba135)" class="game-glow"/>
      <circle cx="50" cy="60" r="3" fill="var(--gold,#cba135)" class="game-glow"/>
    </svg>
  `,
  cinematics: `
    <svg viewBox="0 0 100 100" width="100" height="100" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <style>
          .film-glow { filter: drop-shadow(0 0 8px rgba(203,161,53,.4)); }
          @keyframes flicker { 0%,100% { opacity: 1; } 50% { opacity: 0.5; } }
          .film-flicker { animation: flicker 2s ease-in-out infinite; }
        </style>
      </defs>
      <rect x="25" y="35" width="50" height="30" rx="2" fill="none" stroke="var(--gold,#cba135)" stroke-width="2" class="film-glow"/>
      <circle cx="35" cy="38" r="2" fill="var(--gold,#cba135)" class="film-glow"/>
      <circle cx="50" cy="38" r="2" fill="var(--gold,#cba135)" class="film-glow"/>
      <circle cx="65" cy="38" r="2" fill="var(--gold,#cba135)" class="film-glow"/>
      <polygon points="50,40 60,50 50,60 40,50" fill="none" stroke="var(--gold,#cba135)" stroke-width="2" class="film-glow film-flicker"/>
    </svg>
  `,
  library: `
    <svg viewBox="0 0 100 100" width="100" height="100" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <style>
          .lib-glow { filter: drop-shadow(0 0 8px rgba(203,161,53,.4)); }
          @keyframes sway { 0%,100% { transform: translateX(0); } 50% { transform: translateX(3px); } }
          .lib-sway { animation: sway 2.5s ease-in-out infinite; }
        </style>
      </defs>
      <rect x="32" y="32" width="8" height="36" fill="none" stroke="var(--gold,#cba135)" stroke-width="2" class="lib-glow lib-sway"/>
      <rect x="46" y="28" width="8" height="40" fill="none" stroke="var(--gold,#cba135)" stroke-width="2" class="lib-glow lib-sway" style="animation-delay: 0.2s;"/>
      <rect x="60" y="34" width="8" height="34" fill="none" stroke="var(--gold,#cba135)" stroke-width="2" class="lib-glow lib-sway" style="animation-delay: 0.4s;"/>
    </svg>
  `
};

// Replace chapter numbers with icons
document.addEventListener('DOMContentLoaded', function() {
  const chapters = document.querySelectorAll('.chapter');
  const iconNames = ['characters', 'books', 'games', 'cinematics', 'library'];

  chapters.forEach((chapter, index) => {
    const chNum = chapter.querySelector('.ch-num');
    if (chNum && iconNames[index]) {
      chNum.innerHTML = chapterIcons[iconNames[index]];
      chNum.style.color = 'inherit';
      chNum.style.webkitTextStroke = 'none';
      chNum.style.fontSize = 'clamp(60px, 12vw, 120px)';
      chNum.style.display = 'flex';
      chNum.style.alignItems = 'center';
      chNum.style.justifyContent = 'center';
    }
  });
});
