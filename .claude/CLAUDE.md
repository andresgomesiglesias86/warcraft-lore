# Warcraft Lore Project

## Routing skills

### Warcraft Expert
Pour toute question sur le lore Warcraft, les personnages, la chronologie, les romans ou les connexions avec les jeux :
- Utiliser le skill `/warcraft-expert`
- L'agent peut fouiller directement dans les PDFs via PyMuPDF
- Les livres sont dans `G:\wacraft\Warcraft\books\`

## Ressources disponibles

- **30 romans en PDF** : `G:\wacraft\Warcraft\books\`
- **32 short stories en PDF** : `G:\wacraft\Warcraft\books\Short Stories\`
- **PyMuPDF installé** (`pip install pymupdf`) — pour extraction de texte PDF
- **Site HTML** : `G:\wacraft\Warcraft\arbre-cytoscape.html`
- **Site CSS** : `G:\wacraft\Warcraft\arbre-cytoscape.css`
- **Site JS (moteur)** : `G:\wacraft\Warcraft\arbre-cytoscape.js`
- **Site JS (données)** : `G:\wacraft\Warcraft\warcraft-data.js`

## Notes techniques

- Python 3.12 disponible
- PyMuPDF 1.28.0 installé (extraction PDF via `import fitz`)
- Encodage PDFs : UTF-8 avec caractères mal encodés (apostrophes → `�`)
