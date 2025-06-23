@echo off
echo ===============================================
echo    🏢 INVIVO Panel - Ouverture Directe
echo ===============================================
echo 🚀 Ouverture du panel...
echo 📂 Fichier: %~dp0index.html
echo.

REM Ouvrir avec le navigateur par défaut
start "" "%~dp0index.html"

echo ✅ Panel ouvert dans votre navigateur !
echo 💡 Marquez cette page en favori pour un accès rapide
echo.
pause 