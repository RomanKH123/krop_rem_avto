(() => {
    'use strict';
    const suggestions = {
        check: { title: 'Начните с компьютерной диагностики', text: 'Индикатор сообщает об ошибке, но не определяет её причину. Считывание кодов и проверка параметров помогут выбрать следующий шаг.', target: '#diagnostics' },
        start: { title: 'Обсудите проблему с автоэлектриком', text: 'Расскажите, крутит ли стартер, загораются ли индикаторы и когда появилась проблема. Это поможет мастеру определить, с чего начать проверку.', target: '#electrics' },
        cold: { title: 'Проверьте систему кондиционирования', text: 'Недостаточное охлаждение может быть связано с утечкой или другими неисправностями. Перед заправкой стоит обсудить проверку системы и давления.', target: '#aircon' },
        power: { title: 'Сначала выясните причину потери тяги', text: 'Причина может быть в разных системах автомобиля. Компьютерная диагностика поможет сузить поиск и понять, какие проверки нужны дальше.', target: '#diagnostics' }
    };
    const buttons = document.querySelectorAll('[data-symptom]');
    buttons.forEach(button => {
        button.addEventListener('click', () => {
            const item = suggestions[button.dataset.symptom];
            if (!item) return;
            buttons.forEach(other => other.setAttribute('aria-pressed', String(other === button)));
            document.getElementById('symptom-title').textContent = item.title;
            document.getElementById('symptom-text').textContent = item.text;
            document.getElementById('symptom-link').setAttribute('href', item.target);
        });
    });
})();
