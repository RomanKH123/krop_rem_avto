(function () {
    'use strict';

    const storageKey = 'krop-rem-avto-cookie-consent';
    const policyUrl = './privacy.html#cookies';
    let banner;
    let metrikaLoaded = false;

    function getChoice() {
        try {
            const choice = window.localStorage.getItem(storageKey);
            return choice === 'accepted' || choice === 'rejected' ? choice : null;
        } catch (error) {
            return null;
        }
    }

    function saveChoice(choice) {
        const previousChoice = getChoice();
        try {
            window.localStorage.setItem(storageKey, choice);
        } catch (error) {
            // Баннер всё равно можно закрыть, если хранилище браузера недоступно.
        }
        hideBanner();

        if (choice === 'accepted') {
            loadMetrika();
        } else if (previousChoice === 'accepted') {
            stopMetrika();
        }
    }

    function getMetrikaId() {
        const meta = document.querySelector('meta[name="yandex-metrika-id"]');
        const value = meta ? meta.getAttribute('content').trim() : '';
        return /^\d+$/.test(value) ? Number(value) : null;
    }

    function loadMetrika() {
        const counterId = getMetrikaId();
        if (!counterId || metrikaLoaded) {
            return;
        }

        window.ym = window.ym || function () {
            (window.ym.a = window.ym.a || []).push(arguments);
        };
        window.ym.l = Number(new Date());

        const script = document.createElement('script');
        script.async = true;
        script.src = 'https://mc.yandex.ru/metrika/tag.js';
        script.setAttribute('data-metrika-script', '');
        document.head.appendChild(script);

        window.ym(counterId, 'init', {
            clickmap: true,
            trackLinks: true,
            accurateTrackBounce: true,
            webvisor: false
        });
        metrikaLoaded = true;
    }

    function stopMetrika() {
        const counterId = getMetrikaId();
        if (counterId && typeof window.ym === 'function' && metrikaLoaded) {
            window.ym(counterId, 'destruct');
        }
        metrikaLoaded = false;
    }

    function showBanner() {
        if (banner) {
            banner.classList.add('is-visible');
            banner.setAttribute('aria-hidden', 'false');
        }
    }

    function hideBanner() {
        if (banner) {
            banner.classList.remove('is-visible');
            banner.setAttribute('aria-hidden', 'true');
        }
    }

    function createBanner() {
        banner = document.createElement('section');
        banner.className = 'cookie-consent';
        banner.setAttribute('role', 'dialog');
        banner.setAttribute('aria-modal', 'false');
        banner.setAttribute('aria-label', 'Настройки cookie');
        banner.setAttribute('aria-hidden', 'true');
        banner.innerHTML =
            '<p>Мы используем файлы cookie для корректной работы сайта, анализа посещаемости и улучшения качества обслуживания. Вы можете принять или отклонить использование необязательных cookie. Подробнее — в <a href="' + policyUrl + '">политике конфиденциальности</a>.</p>' +
            '<div class="cookie-consent__actions">' +
                '<button class="cookie-consent__button" type="button" data-cookie-reject>Отклонить</button>' +
                '<button class="cookie-consent__button cookie-consent__button--accept" type="button" data-cookie-accept>Принять</button>' +
            '</div>';

        document.body.appendChild(banner);
        banner.querySelector('[data-cookie-accept]').addEventListener('click', function () {
            saveChoice('accepted');
        });
        banner.querySelector('[data-cookie-reject]').addEventListener('click', function () {
            saveChoice('rejected');
        });
    }

    function init() {
        createBanner();
        const choice = getChoice();
        if (!choice) {
            showBanner();
        } else if (choice === 'accepted') {
            loadMetrika();
        }

        document.querySelectorAll('[data-cookie-settings]').forEach(function (button) {
            button.addEventListener('click', showBanner);
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
