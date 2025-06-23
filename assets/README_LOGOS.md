# 📁 Dossier Assets - Organisation des Logos INVIVO

## 🎯 Structure Recommandée

Placez vos 3 logos INVIVO dans ce dossier `assets/` :

```
ST-invivo-panelstock/
├── assets/
│   ├── logo-invivo-full.png      ← Logo complet (sidebar étendue)
│   ├── logo-invivo-compact.png   ← Logo compact (sidebar réduite)  
│   └── README_LOGOS.md           ← Ce fichier d'aide
├── index.html
└── app-advanced.js
```

## 📐 Spécifications des Logos

### 1. **logo-invivo-full.png**
- **Usage :** Sidebar ouverte (logo seul, agrandi)
- **Taille :** 120x40px (ou proportionnel 3:1)
- **Format :** PNG avec transparence ou SVG
- **Exemple :** Logo horizontal INVIVO
- **Affichage :** Hauteur 64px dans la sidebar

### 2. **logo-invivo-compact.png** 
- **Usage :** Sidebar fermée (icône seule) + Favicon
- **Taille :** 40x40px (carré)
- **Format :** PNG avec transparence ou SVG
- **Exemple :** Initiales "IV" ou symbole INVIVO
- **Affichage :** Hauteur 40px sidebar + favicon navigateur

## ⚡ Activation Automatique

Une fois vos 2 fichiers placés dans `assets/`, le code est **déjà configuré** pour les utiliser !

Les chemins sont prêts dans `index.html` :
- `assets/logo-invivo-full.png`
- `assets/logo-invivo-compact.png`

## 🔄 Formats Supportés

- **PNG** (recommandé avec transparence)
- **JPG** (fond blanc/transparent)
- **SVG** (vectoriel, idéal pour la qualité)
- **WEBP** (moderne, plus léger)

## ✅ Checklist

- [ ] Copier logo complet → `logo-invivo-full.png`
- [ ] Copier logo compact → `logo-invivo-compact.png`
- [ ] Tester en ouvrant `index.html`
- [ ] Vérifier sidebar étendue (logo agrandi 64px)
- [ ] Vérifier sidebar réduite (logo compact 40px)
- [ ] Vérifier favicon dans l'onglet navigateur
- [ ] Vérifier texte "Chargement Panel INVIVO"

---
*Dossier créé pour le Panel INVIVO - Glissez simplement vos 3 logos ici !* 