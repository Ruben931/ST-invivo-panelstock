@echo off
echo ===============================================
echo    🌱 INVIVO Panel de Gestion - Serveur Local
echo ===============================================
echo.

REM Vérifier si Python est installé
where python >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    echo ✅ Python détecté - Démarrage du serveur...
    echo 🌐 Panel disponible sur: http://localhost:8000
    echo 🔄 Appuyez sur Ctrl+C pour arrêter le serveur
    echo.
    python -m http.server 8000
) else (
    REM Vérifier si Node.js est installé
    where node >nul 2>nul
    if %ERRORLEVEL% EQU 0 (
        echo ✅ Node.js détecté - Installation de live-server...
        npm install -g live-server
        echo 🌐 Panel disponible sur: http://localhost:8080
        echo 🔄 Appuyez sur Ctrl+C pour arrêter le serveur
        echo.
        live-server --port=8080
    ) else (
        echo ❌ Ni Python ni Node.js détecté
        echo 📝 Veuillez installer l'un des deux pour utiliser le serveur local
        echo.
        echo 💡 Alternatives:
        echo    1. Installer Python: https://python.org
        echo    2. Installer Node.js: https://nodejs.org
        echo    3. Ouvrir directement index.html dans votre navigateur
        echo.
        pause
    )
) 