# 🎨 Guide de Configuration des Logos INVIVO

## 📁 Emplacements des Logos

### 1. **Logo Étendu (Sidebar Ouverte)**
```html
<img src="https://via.placeholder.com/120x40/04a4dc/ffffff?text=INVIVO+LOGO" 
     alt="Logo INVIVO" 
     class="h-10 w-auto object-contain">
```
- **Taille recommandée :** 120x40px (ou proportionnel)
- **Format :** PNG avec transparence ou SVG
- **Usage :** Affiché quand la sidebar est étendue

### 2. **Logo Compact (Sidebar Réduite)**
```html
<img src="https://via.placeholder.com/40x40/04a4dc/ffffff?text=IV" 
     alt="Logo INVIVO Compact" 
     class="h-10 w-10 object-contain rounded-lg">
```
- **Taille recommandée :** 40x40px (carré)
- **Format :** PNG avec transparence ou SVG
- **Usage :** Affiché quand la sidebar est réduite

### 3. **Logo Écran de Chargement**
```html
<img src="https://via.placeholder.com/200x60/ffffff/04a4dc?text=INVIVO+LOGO" 
     alt="Logo INVIVO" 
     class="h-12 w-auto mx-auto object-contain">
```
- **Taille recommandée :** 200x60px (ou proportionnel)
- **Format :** PNG avec transparence ou SVG
- **Usage :** Affiché pendant le chargement initial

## 🔧 Comment Remplacer les Logos

### Option 1 : Fichiers Locaux
1. Placez vos logos dans un dossier `images/` ou `assets/`
2. Remplacez les URLs :
```html
<!-- Logo étendu -->
<img src="assets/logo-invivo-full.png" alt="Logo INVIVO" class="h-10 w-auto object-contain">

<!-- Logo compact -->
<img src="assets/logo-invivo-compact.png" alt="Logo INVIVO Compact" class="h-10 w-10 object-contain rounded-lg">

<!-- Logo chargement -->
<img src="assets/logo-invivo-loading.png" alt="Logo INVIVO" class="h-12 w-auto mx-auto object-contain">
```

### Option 2 : URLs Externes
Utilisez des URLs hébergées (CDN, site web, etc.) :
```html
<img src="https://votre-site.com/images/logo-full.png" alt="Logo INVIVO">
```

## 📐 Recommandations de Design

### Logo Étendu
- **Ratio :** 3:1 (largeur:hauteur)
- **Couleurs :** S'adapte au mode sombre/clair
- **Lisibilité :** Visible sur fond blanc et gris

### Logo Compact
- **Format :** Carré ou circulaire
- **Symbole :** Initiales ou icône représentative
- **Contraste :** Bien visible en petit format

### Logo Chargement
- **Style :** Peut être plus décoratif
- **Contraste :** Optimisé pour fond bleu INVIVO
- **Animation :** Compatible avec les effets de chargement

## 🎯 Emplacements dans le Code

### Fichier `index.html`

**Ligne ~67 :** Logo étendu sidebar
```html
<img src="VOTRE_LOGO_FULL.png" alt="Logo INVIVO" class="h-10 w-auto object-contain">
```

**Ligne ~74 :** Logo compact sidebar
```html
<img src="VOTRE_LOGO_COMPACT.png" alt="Logo INVIVO Compact" class="h-10 w-10 object-contain rounded-lg">
```

**Ligne ~45 :** Logo écran chargement
```html
<img src="VOTRE_LOGO_LOADING.png" alt="Logo INVIVO" class="h-12 w-auto mx-auto object-contain">
```

## ✅ Test Final

Après remplacement :
1. **Sidebar étendue** → Logo complet visible
2. **Sidebar réduite** → Logo compact visible  
3. **Rechargement page** → Logo dans écran de chargement
4. **Mode sombre/clair** → Logos adaptés aux deux modes

---
*Guide créé pour le Panel INVIVO - Remplacez les placeholders par vos vrais logos !* 