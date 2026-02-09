// Класс для управления данными в LocalStorage
class NoiseDetoxDB {
    constructor() {
        this.DIARY_KEY = 'noise_detox_diary';
        this.HEARING_KEY = 'noise_detox_hearing';
        this.SETTINGS_KEY = 'noise_detox_settings';
    }

    // Получить все записи дневника
    getDiaryEntries() {
        const data = localStorage.getItem(this.DIARY_KEY);
        return data ? JSON.parse(data) : [];
    }

    // Добавить запись в дневник
    addDiaryEntry(entry) {
        const entries = this.getDiaryEntries();
        entry.id = Date.now().toString();
        entry.timestamp = new Date().toISOString();
        entries.push(entry);
        localStorage.setItem(this.DIARY_KEY, JSON.stringify(entries));
        return entry;
    }

    // Удалить запись из дневника
    deleteDiaryEntry(id) {
        let entries = this.getDiaryEntries();
        entries = entries.filter(entry => entry.id !== id);
        localStorage.setItem(this.DIARY_KEY, JSON.stringify(entries));
    }

    // Получить записи за период
    getDiaryEntriesByDateRange(startDate, endDate) {
        const entries = this.getDiaryEntries();
        return entries.filter(entry => {
            const entryDate = new Date(entry.timestamp);
            return entryDate >= startDate && entryDate <= endDate;
        });
    }

    // Получить тесты слуха
    getHearingTests() {
        const data = localStorage.getItem(this.HEARING_KEY);
        return data ? JSON.parse(data) : [];
    }

    // Добавить тест слуха
    addHearingTest(test) {
        const tests = this.getHearingTests();
        test.id = Date.now().toString();
        test.timestamp = new Date().toISOString();
        tests.push(test);
        localStorage.setItem(this.HEARING_KEY, JSON.stringify(tests));
        return test;
    }

    // Получить настройки
    getSettings() {
        const data = localStorage.getItem(this.SETTINGS_KEY);
        return data ? JSON.parse(data) : {
            notifications: true,
            theme: 'light'
        };
    }

    // Сохранить настройки
    saveSettings(settings) {
        localStorage.setItem(this.SETTINGS_KEY, JSON.stringify(settings));
    }

    // Экспорт данных
    exportData() {
        return {
            diary: this.getDiaryEntries(),
            hearing: this.getHearingTests(),
            settings: this.getSettings(),
            exportDate: new Date().toISOString()
        };
    }

    // Импорт данных
    importData(data) {
        if (data.diary) {
            localStorage.setItem(this.DIARY_KEY, JSON.stringify(data.diary));
        }
        if (data.hearing) {
            localStorage.setItem(this.HEARING_KEY, JSON.stringify(data.hearing));
        }
        if (data.settings) {
            localStorage.setItem(this.SETTINGS_KEY, JSON.stringify(data.settings));
        }
    }

    // Очистить все данные
    clearAllData() {
        localStorage.removeItem(this.DIARY_KEY);
        localStorage.removeItem(this.HEARING_KEY);
        localStorage.removeItem(this.SETTINGS_KEY);
    }
}

// Инициализация базы данных
const db = new NoiseDetoxDB();

// Утилиты для работы с датами
const DateUtils = {
    formatDate(date) {
        return new Date(date).toLocaleDateString('ru-RU', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    },

    formatDateTime(date) {
        return new Date(date).toLocaleDateString('ru-RU', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    },

    formatTime(date) {
        return new Date(date).toLocaleTimeString('ru-RU', {
            hour: '2-digit',
            minute: '2-digit'
        });
    },

    getDaysAgo(days) {
        const date = new Date();
        date.setDate(date.getDate() - days);
        return date;
    },

    getWeekDates() {
        const dates = [];
        for (let i = 6; i >= 0; i--) {
            dates.push(this.getDaysAgo(i));
        }
        return dates;
    }
};

// Утилиты для уведомлений
const Notification = {
    show(message, type = 'success') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-icon">${type === 'success' ? '✓' : '⚠'}</span>
                <span class="notification-message">${message}</span>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.add('show');
        }, 10);
        
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    },

    success(message) {
        this.show(message, 'success');
    },

    error(message) {
        this.show(message, 'error');
    },

    warning(message) {
        this.show(message, 'warning');
    }
};

// Утилиты для анализа данных
const DataAnalyzer = {
    // Подсчитать среднее значение
    average(arr) {
        if (!arr.length) return 0;
        return arr.reduce((a, b) => a + b, 0) / arr.length;
    },

    // Получить статистику по уровню шума
    getNoiseStats(entries) {
        const noiseLevels = {
            quiet: 0,
            moderate: 0,
            loud: 0,
            veryLoud: 0
        };

        entries.forEach(entry => {
            if (entry.noiseLevel) {
                noiseLevels[entry.noiseLevel]++;
            }
        });

        return noiseLevels;
    },

    // Получить статистику по самочувствию
    getWellbeingStats(entries) {
        const wellbeing = {
            good: 0,
            tired: 0,
            headache: 0,
            irritated: 0,
            sleepy: 0,
            tinnitus: 0
        };

        entries.forEach(entry => {
            if (entry.wellbeing && Array.isArray(entry.wellbeing)) {
                entry.wellbeing.forEach(w => {
                    if (wellbeing.hasOwnProperty(w)) {
                        wellbeing[w]++;
                    }
                });
            }
        });

        return wellbeing;
    },

    // Получить корреляцию между шумом и самочувствием
    getNoiseWellbeingCorrelation(entries) {
        const correlation = {
            quiet: { good: 0, bad: 0 },
            moderate: { good: 0, bad: 0 },
            loud: { good: 0, bad: 0 },
            veryLoud: { good: 0, bad: 0 }
        };

        entries.forEach(entry => {
            if (!entry.noiseLevel || !entry.wellbeing) return;

            const isGood = entry.wellbeing.includes('good');
            const isBad = entry.wellbeing.some(w => 
                ['headache', 'irritated', 'tinnitus'].includes(w)
            );

            if (isGood) {
                correlation[entry.noiseLevel].good++;
            }
            if (isBad) {
                correlation[entry.noiseLevel].bad++;
            }
        });

        return correlation;
    },

    // Получить данные для графика по дням
    getDailyNoiseData(entries, days = 7) {
        const dates = DateUtils.getWeekDates();
        const data = dates.map(date => {
            const dayEntries = entries.filter(entry => {
                const entryDate = new Date(entry.timestamp);
                return entryDate.toDateString() === date.toDateString();
            });

            const noiseLevels = dayEntries.map(e => {
                const levels = { quiet: 1, moderate: 2, loud: 3, veryLoud: 4 };
                return levels[e.noiseLevel] || 0;
            });

            return {
                date: DateUtils.formatDate(date),
                avgNoise: noiseLevels.length ? this.average(noiseLevels) : 0,
                count: dayEntries.length
            };
        });

        return data;
    }
};

// Обработчик навигации с подсветкой активной ссылки
document.addEventListener('DOMContentLoaded', () => {
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        if (link.getAttribute('href') === currentPath) {
            link.classList.add('active');
        }
    });

    // Эффект прокрутки для навбара
    let lastScroll = 0;
    window.addEventListener('scroll', () => {
        const navbar = document.querySelector('.navbar');
        const currentScroll = window.pageYOffset;

        if (currentScroll > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        lastScroll = currentScroll;
    });
});

// Функция для экспорта данных в JSON
function exportDataToJSON() {
    const data = db.exportData();
    const dataStr = JSON.stringify(data, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `noise-detox-data-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    
    URL.revokeObjectURL(url);
    Notification.success('Данные успешно экспортированы!');
}

// Функция для импорта данных из JSON
function importDataFromJSON(file) {
    const reader = new FileReader();
    reader.onload = (e) => {
        try {
            const data = JSON.parse(e.target.result);
            db.importData(data);
            Notification.success('Данные успешно импортированы!');
            setTimeout(() => location.reload(), 1000);
        } catch (error) {
            Notification.error('Ошибка при импорте данных!');
            console.error(error);
        }
    };
    reader.readAsText(file);
}
