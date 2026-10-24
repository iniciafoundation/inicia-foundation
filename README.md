# inicia-foundation

Multilingual public NGO site for environmental and global issues — iniciafoundation.org


Исходный код сайта. Получен из Netlify («Download source code», публикация от 22.08.2026),
очищен 24.10.2026.

## Что убрано по сравнению с исходным архивом
- Служебные папки и журналы Manus (`.manus/`, `.manus-logs/`) — в журналах были токены сессий.
- `.project-config.json` — содержал пароль базы данных, ключи API и секреты Manus.
- `client/public/__manus__/` — скрипт записи действий посетителей (клики, ввод, запросы).
- Аналитика `manus-analytics.com` (тег umami в `client/index.html`).
- Плагины Manus в `vite.config.ts` (`vite-plugin-manus-runtime`, сборщик отладки, `jsx-loc`).
- Старая сборка `dist/` и шаблон `template.json`.

Остальной код не менялся. Сборка (`pnpm exec vite build`) и все 30 тестов (`pnpm exec vitest run`) проходят.

## Как устроено
- Публичная часть: React + Vite, папка `client/`. Сборка в `dist/public`.
- Серверные функции Netlify: `netlify/functions/` (auth, evidence, health, legal-gone, trpc).
- База данных Netlify: схема `netlify/db/schema.ts`, миграции `netlify/database/migrations/`.
- Настройки публикации и переадресации: `netlify.toml`.
- Папка `server/` — старая серверная часть Manus, на Netlify не используется.

## Правила
- Секреты (пароли, ключи) — только в Netlify: Project configuration → Environment variables. Никогда в коде.
- Тестовые версии — через pull request (Deploy Preview, 0 кредитов). Публикация на основной сайт — 15 кредитов.
