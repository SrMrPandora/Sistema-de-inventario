@echo off
echo ========================================================
echo   COMPARTIR DEMO DE INVENTARIO CON CLIENTE EXTERNO
echo   Servidor Local + Tunel Cloudflare
echo ========================================================
echo.
echo 1. Iniciando servidor en puerto 3000...
start /b cmd /c "npx vite preview --port 3000 --host 0.0.0.0"
timeout /t 3 >nul
echo.
echo 2. Creando tunel seguro de acceso externo...
echo En breve aparecera el enlace HTTPS publico que puedes enviar a tu cliente.
echo.
"C:\Program Files (x86)\cloudflared\cloudflared.exe" tunnel --url http://127.0.0.1:3000
