---
type: reference
description: Guide de référence complet pour naviguer le lore Warcraft via les livres
derniere_maj: 2026-07-25
---

# Lore Reference Guide

Navigateur de contenu pour l'expertise Warcraft à travers les 27 livres canoniques.

## Accès Rapide

### Par Type d'Information

**Cherchez un...**
- 🧑 **Personnage** ? → `[[index-personnages.md]]` + fiche du livre ou `[[perso-nom.md]]`
- 📍 **Lieu/Zone** ? → `[[index-zones.md]]` (à créer) + `[[zones/continent-nom.md]]`
- ⚔️ **Événement/Guerre** ? → `[[lore-chronologie.md]]`
- 📖 **Livre entier** ? → `[[livres/NN-titre.md]]`
- 🗡️ **Quête** ? → `[[quetes/expertise-quetes.md]]` (à créer)
- 🧬 **Relation** ? → Voir section "Relations Complexes" ci-dessous

---

## Guide de Navigation

### 1️⃣ Je cherche un PERSONNAGE

**Exemple : "Qui est Tirion Fordring ?"**

```
index-personnages.md 
  ↓ (cherche "Tirion")
  ↓ Voir qu'il est dans livres 1, 6, 11, 13, 14
01-of-blood-and-honor.md 
  ↓ (cherche section "Tirion Fordring")
  ↓ Lit traits, amours, arc narratif
  ↓ Voir lien vers perso-tirion-fordring.md (si existe)
```

**Si perso n'existe pas dans index** → Skill va :
1. Lire le résumé du livre pertinent
2. Créer la page `perso-[nom].md`
3. Mettre à jour `index-personnages.md`

---

### 2️⃣ Je cherche une LOCATION

**Exemple : "Où se passe l'histoire de Lordaéron ?"**

```
zones/royaumes-estériens.md
  ↓ Cherche "Lordaéron"
  ↓ Voit qu'elle apparaît dans livres 1, 2, 4, 13, 15
  ↓ Clique sur un livre pour lire le contexte de cette zone
```

**Si zone n'existe pas dans la doc** → Skill va :
1. Chercher dans les résumés des livres
2. Créer la page `zones/continent/ville.md`
3. Lier aux livres pertinents

---

### 3️⃣ Je cherche une ÉVÉNEMENT/GUERRE

**Exemple : "Parle-moi de la Deuxième Guerre"**

```
lore-chronologie.md
  ↓ Cherche "Deuxième Guerre"
  ↓ Voit la liste des livres en ordre chronologique
  ↓ Clique sur chaque livre pour détails
```

---

### 4️⃣ Je cherche une RELATION

**Exemple : "Quelle est la relation entre Arthas et Uther ?"**

```
perso-arthas.md (ou arthas dans index-personnages.md)
  ↓ Voit "Uther" dans la section "Relationships"
  ↓ Lit la nature et l'évolution de la relation
  ↓ Voit dans quels livres elle se développe
```

---

## Structure Complète

```
warcraft-expert/
├── livres/
│   ├── 01-of-blood-and-honor.md          ✅ DONE
│   ├── 02-day-of-dragon.md               ⏳ NEXT
│   ├── 03-lord-of-clans.md
│   ├── ... (24 livres à ajouter)
│   └── 27-movie-novelization.md
│
├── references/
│   ├── index-personnages.md              ✅ DONE
│   ├── index-zones.md                    ⏳ TODO
│   ├── index-clans.md                    ⏳ TODO
│   ├── lore-chronologie.md               ✅ DONE
│   ├── lore-reference.md                 ✅ DONE (ce fichier)
│   └── expertise-quetes.md               ⏳ TODO
│
├── zones/
│   ├── kalimdor.md                       ⏳ TODO
│   ├── royaumes-estériens.md             ⏳ TODO
│   ├── autres-mondes.md                  ⏳ TODO
│   └── plan-émeraude.md                  ⏳ TODO
│
└── (fiches personnages à créer au besoin)
    ├── perso-tirion-fordring.md          ⏳ TODO
    ├── perso-arthas.md                   ⏳ TODO
    └── ...
```

---

## Relations Complexes (Arcs Multi-Livres)

### Arc 1 : Tirion's Redemption
**Livres** : 1 → 6 → 11 → 13 → 14  
**Persos** : Tirion, Eitrigg, Uther, Arthas  
**Thème** : Exil → Rédemption → Leadership  
**Détails** : `01-of-blood-and-honor.md` + `perso-tirion-fordring.md`

### Arc 2 : Arthas' Fall
**Livres** : 2 → 4 → 13  
**Persos** : Arthas, Uther, Jaina, Medivh  
**Thème** : Jeune prince → Lich King  
**Détails** : `13-arthas-rise-lich-king.md` + `perso-arthas.md`

### Arc 3 : Dragons & Corruption
**Livres** : 2 → 5 → 6 → 7 → 12 → 14 → 15  
**Persos** : Alextrasza, Nefarian, Malygos, Ysondre  
**Thème** : Magie, contrôle, liberté  
**Détails** : `02-day-of-dragon.md` + dragon focus files

### Arc 4 : Horde's Rise
**Livres** : 3 → 9 → 10 → 11  
**Persos** : Thrall, Gul'dan, Durotan, Eitrigg  
**Thème** : Esclavage → Libération → Unification  
**Détails** : `03-lord-of-clans.md` + `09-rise-of-horde.md`

---

## Clans & Factions

### The Alliance of Lordaeron
- **Kingdom of Lordaeron** (leaders: Terenas, Arthas)
- **Stormwind** (leaders: Varian, Anduin)
- **Kul Tiras** (naval power)
- **Gilneas** (independant/isolationist)
- **The Silver Hand** (Paladins, Uther → Tirion)

### The Horde (Orcish)
- **Orcish Clans** (multiple, see `09-rise-of-horde.md`)
- **Tauren Tribes** (Buffalo people)
- **Jungle Trolls** (Darkspear)
- **Later: Undead Scourge** (Arthas' influence)

### Other Powers
- **The Burning Legion** (Demons, Sargeras)
- **Dragonflights** (Five aspects)
- **Titans & Creators** (Ancient lore)

---

## Thèmes Récurrents

| Thème | Apparaît dans | Essence |
|-------|---------------|---------|
| **Miséricorde vs Vengeance** | 1, 8, 13, 25 | Humanité face à la guerre |
| **Corruption du Pouvoir** | 1, 4, 13, 14, 25 | Absolute power corrupts absolutely |
| **Dragons & Destin** | 2, 5, 6, 7, 12, 14, 15 | Fate, freedom, sacrifice |
| **Sacrifice Personnel** | 1, 7, 13, 16 | What cost victory? |
| **Breaking the Cycle** | 1, 3, 9, 13, 16 | Escaping predestination |

---

## Personnes de Référence à Travers les Livres

### "Sages" / Mentors
- Uther le Lumière (Paladin mentor)
- Medivh (Sorcier mystérieux)
- Malfurion Stormrage (Druide ancien)
- Thrall (Chef charismatique)

### "Antagonistes Majeurs"
- Arthas Menethil (Prince corrompu)
- Gul'dan (Seigneur noir orc)
- Archimonde (Seigneur démonique)
- Nefarian (Dragon noir machiavélien)

### "Héros Complexes"
- Tirion Fordring (Paladin idéaliste)
- Jaina Proudmoore (Archimage diplomat)
- Illidan Hurlorage (Démon ou libérateur ?)

---

## Comment le Skill Fonctionne

**Phase 1 - Écouter ta question**
```
Utilisateur: "Qui est Tyrande ?"
```

**Phase 2 - Naviguer**
```
Skill va dans index-personnages.md
Trouve: "Tyrande | Livres 5, 6, 7, 14, 17 | Prêtresse de la Lune"
```

**Phase 3 - Consulter la source**
```
Skill ouvre 05-well-of-eternity.md
Cherche la section "Tyrande Whisperwind"
Extrait infos : traits, amours, arc narratif
```

**Phase 4 - Répondre + Mettre à jour (si nécessaire)**
```
Si tu demandes des détails très spécifiques qui ne sont pas dans la fiche:
  → Skill va relire le PDF du livre
  → Crée/met à jour perso-tyrande.md
  → Ajoute à l'index
  → Te répond avec la source complète
```

---

## Mise à Jour de cette Référence

**Cette page est mise à jour automatiquement** quand :
- ✅ Un nouveau livre est ajouté aux `livres/`
- ✅ Un nouvel index est créé
- ✅ Une fiche de perso est créée
- ✅ Une fiche de zone est créée

*Tu dois mettre à jour manuellement* si :
- ❌ Liens cassés
- ❌ Infos obsolètes
- ❌ Contradictions découvertes

---

**Dernière vérification** : 2026-07-25  
**Livres couverts** : 1/27 complet, template établi  
**Prochains à créer** : 02-day-of-dragon.md → 27
