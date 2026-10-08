@echo off
title Atelier Liuteria Master - Suite Gestionale
cd /d "%~dp0"
echo ==================================================================
echo   ATELIER LIUTERIA MASTER - SUITE GESTIONALE
echo ==================================================================
echo Avvio del server locale con proxy Home Assistant integrato...
echo (Apre automaticamente il browser senza restrizioni CORS)
echo.
python server.py
pause
