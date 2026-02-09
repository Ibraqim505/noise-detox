@echo off
echo ========================================
echo  Запуск "Шумовой детокс"
echo ========================================
echo.
echo Проверка Python...
python --version
echo.
echo Запуск сервера...
echo Откройте браузер и перейдите по адресу: http://localhost:5000
echo.
echo Для остановки сервера нажмите Ctrl+C
echo.
python app.py
pause
