@echo off
echo ====================================
echo 🚀 INVIVO Panel - Deploy to GitHub
echo ====================================
echo.

REM Vérifier si Git est installé
git --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Git n'est pas installé !
    echo.
    echo 📥 Téléchargez Git depuis : https://git-scm.com/download/win
    echo.
    pause
    exit /b 1
)

echo ✅ Git détecté !
echo.

REM Configurer Git si nécessaire
echo 🔧 Configuration Git...
git config --global user.name "ruben931" 2>nul
git config --global user.email "ruben931@users.noreply.github.com" 2>nul

REM Initialiser le repo si nécessaire
if not exist ".git" (
    echo 📦 Initialisation du repo Git...
    git init
)

REM Ajouter tous les fichiers
echo 📁 Ajout des fichiers...
git add .

REM Commit avec message
echo 💾 Création du commit...
git commit -m "🚀 Deploy INVIVO Panel BTP - Version %date:~-4,4%"

REM Vérifier si origin existe
git remote get-url origin >nul 2>&1
if errorlevel 1 (
    echo 🔗 Ajout du remote GitHub...
    git remote add origin https://github.com/ruben931/ST-invivo-panelstock.git
)

REM Renommer la branche principale
echo 🌿 Configuration branche main...
git branch -M main

REM Push vers GitHub
echo 🚀 Push vers GitHub...
git push -u origin main

if errorlevel 1 (
    echo.
    echo ❌ Erreur lors du push !
    echo.
    echo 💡 Solutions possibles :
    echo - Créer le repo sur GitHub : https://github.com/new
    echo - Vérifier vos identifiants GitHub
    echo - Générer un token : https://github.com/settings/tokens
    echo.
    pause
    exit /b 1
)

echo.
echo ✅ SUCCESS ! Votre code est sur GitHub !
echo.
echo 🌐 Repo : https://github.com/ruben931/ST-invivo-panelstock
echo 🚀 Vercel : https://vercel.com/new/clone?repository-url=https://github.com/ruben931/ST-invivo-panelstock
echo.
echo 📝 Prochaines étapes :
echo 1. Aller sur https://vercel.com
echo 2. Se connecter avec GitHub
echo 3. Importer le repo ruben931/ST-invivo-panelstock
echo 4. Cliquer Deploy
echo.
echo Votre site sera sur : https://st-invivo-panelstock.vercel.app
echo.
pause 