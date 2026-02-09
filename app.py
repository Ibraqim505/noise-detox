from flask import Flask, render_template, jsonify, request
import os

app = Flask(__name__)

# Главная страница
@app.route('/')
def index():
    return render_template('index.html')

# Страница дневника
@app.route('/diary')
def diary():
    return render_template('diary.html')

# Страница проверки слуха
@app.route('/hearing-test')
def hearing_test():
    return render_template('hearing_test.html')

# Страница результатов
@app.route('/results')
def results():
    return render_template('results.html')

# Страница защиты от шума
@app.route('/protection')
def protection():
    return render_template('protection.html')

# Страница о проекте
@app.route('/about')
def about():
    return render_template('about.html')

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
