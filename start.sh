#!/bin/bash

echo "========================================"
echo " Запуск 'Шумовой детокс'"
echo "========================================"
echo ""
echo "Проверка Python..."
python3 --version
echo ""
echo "Запуск сервера..."
echo "Откройте браузер и перейдите по адресу: http://localhost:5000"
echo ""
echo "Для остановки сервера нажмите Ctrl+C"
echo ""
python3 app.py
