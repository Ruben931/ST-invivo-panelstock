# 🚀 Guide de Déploiement Vercel - INVIVO Panel

## 📋 Prérequis

### 1. **Installation Git**
Télécharger et installer depuis : https://git-scm.com/download/win

### 2. **Comptes Requis**
- GitHub → Votre compte : `ruben931` ✅
- Vercel → Se connecter avec GitHub

## 🏗️ Étapes de Déploiement

### **Étape 1 : Configuration Git**
```bash
# Ouvrir PowerShell dans le dossier ST-invivo-panelstock
git init
git add .
git commit -m "🚀 Initial commit - INVIVO Panel BTP"
```

### **Étape 2 : Pousser sur GitHub**
```bash
git remote add origin https://github.com/ruben931/ST-invivo-panelstock.git
git branch -M main
git push -u origin main
```

### **Étape 3 : Déployer sur Vercel**
1. Aller sur https://vercel.com
2. Se connecter avec GitHub
3. Importer le repo `ruben931/ST-invivo-panelstock`
4. Cliquer "Deploy"

## 🌐 Résultat
Votre site sera accessible sur : `https://st-invivo-panelstock.vercel.app`

## ⚡ Auto-Deploy Activé
Chaque push sur GitHub déclenchera un redéploiement automatique ! 