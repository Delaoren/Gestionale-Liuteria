@echo off
chcp 65001 >nul
title Installazione Remota Atelier Liuteria Master su Server Ubuntu

echo ==================================================================
echo   TRASFERIMENTO E INSTALLAZIONE SU SERVER UBUNTU
echo ==================================================================
echo.
set UBUNTU_IP=192.168.68.108
set /p UBUNTU_IP="1) Indirizzo IP del server Ubuntu [premi Invio per 192.168.68.108]: "
set /p UBUNTU_USER="2) Inserisci il nome utente del server Ubuntu (es. ubuntu): "

echo.
echo [Passo 1/2] Trasferimento dei file in corso su %UBUNTU_USER%@%UBUNTU_IP%...
echo (Inserisci la password del server Ubuntu quando richiesto)
echo.

tar.exe -cf - -C "D:\Liuteria\Programmi\Gestionale" --exclude=.git --exclude=__pycache__ . | ssh %UBUNTU_USER%@%UBUNTU_IP% "rm -rf ~/atelier-liuteria-tmp && mkdir -p ~/atelier-liuteria-tmp && tar -xf - -C ~/atelier-liuteria-tmp"

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo [!] Errore durante il trasferimento. Verifica nome utente e password.
    pause
    exit /b 1
)

echo.
echo [Passo 2/2] Aggiornamento e riavvio del servizio sul server Ubuntu...
echo (Inserisci la password del server Ubuntu quando richiesto)
echo.

ssh -t %UBUNTU_USER%@%UBUNTU_IP% "chmod +x ~/atelier-liuteria-tmp/install_ubuntu.sh && sudo ~/atelier-liuteria-tmp/install_ubuntu.sh"

echo.
echo ==================================================================
echo   OPERAZIONE COMPLETATA!
echo   Apertura del gestionale su: http://%UBUNTU_IP%:8080
echo ==================================================================
start "" "http://%UBUNTU_IP%:8080"
pause
