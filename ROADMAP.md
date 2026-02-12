# MAD GAMES — Роадмап v2

## Контекст

Сейчас: одна Unity WebGL игра на GitHub Pages (`mad-games.ru`), без дизайна.
Цель: сайт-каталог игр с дизайном в стиле CrazyGames / games.pikabu.ru, рекламой РСЯ, хостингом на VPS.

Референсы: CrazyGames (тёмная тема, карточки, hover-видео), games.pikabu.ru (минимализм).
Рейтинг пока не нужен.

---

## Итерация 2: Каталог с дизайном + РСЯ + VPS

### Стек

| Компонент | Технология |
|-----------|-----------|
| Фреймворк | Next.js 14+ (App Router), TypeScript |
| Стили | Tailwind CSS + shadcn/ui |
| Шрифт | Nunito (через next/font/google) |
| Unity | react-unity-webgl |
| БД | SQLite (better-sqlite3) |
| Реклама | РСЯ (Рекламная Сеть Яндекса) |
| Деплой | Docker + nginx + certbot |

### Цветовая палитра (как CrazyGames)

| Токен | Цвет | Где |
|-------|------|-----|
| background | `#0C0D14` | Фон страниц |
| card | `#1A1B28` | Карточки, контейнеры |
| card-hover | `#212233` | Карточки при наведении |
| text | `#F9FAFF` | Основной текст |
| text-muted | `#AAADBE` | Вторичный текст |
| accent | `#6842FF` | Кнопки, акценты |

---

### Главная страница (`/`)

```
┌──────────────────────────────────────────────────┐
│  [Лого]  MAD GAMES                    (sticky)   │
├──────────────────────────────────────────────────┤
│  [РСЯ баннер 728×90]                             │
├──────────────────────────────────────────────────┤
│                                                   │
│  ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐    │
│  │ cover  │ │ cover  │ │ cover  │ │ cover  │    │
│  │ (16:9) │ │ (16:9) │ │ (16:9) │ │ (16:9) │    │
│  │→video  │ │        │ │        │ │        │    │
│  │на hover│ │        │ │        │ │        │    │
│  ├────────┤ ├────────┤ ├────────┤ ├────────┤    │
│  │Название│ │Название│ │Название│ │Название│    │
│  └────────┘ └────────┘ └────────┘ └────────┘    │
│                                                   │
├──────────────────────────────────────────────────┤
│  [Footer]                                         │
└──────────────────────────────────────────────────┘
```

- **Header**: sticky, 64px, фон `#0C0D14` с blur. Текст "MAD GAMES" — Nunito 900
- **Сетка**: `grid-template-columns: repeat(auto-fill, minmax(220px, 1fr))`, gap 16px
- **Адаптивность**: 2 колонки мобильный → 4-6 десктоп

### Карточка игры

- Обложка 16:9 (`cover.jpg`)
- **При hover**: обложка плавно заменяется на `preview.webm` (autoplay, muted, loop)
- `preload="none"` — видео не грузится заранее, только при наведении
- При hover: `scale(1.03)`, тень, фон → `#212233`
- Название под обложкой: Nunito 14px semibold
- Border-radius: 12px

### Превью-видео

- Формат: `.webm` (VP9), 480×270, 3-8 сек, без звука, ~500 КБ
- Создание: записать геймплей → обрезать через FFmpeg:
  ```bash
  ffmpeg -i gameplay.mp4 -ss 5 -t 6 -vf "scale=480:270" -c:v libvpx-vp9 -b:v 300k -an preview.webm
  ```

---

### Страница игры (`/game/[slug]`)

Игра НЕ на весь экран — стилизованная страница:

```
┌──────────────────────────────────────────────────┐
│  [Лого]  MAD GAMES                               │
├──────────────────────────────────────────────────┤
│  [РСЯ 728×90]                                    │
├──────────────┬──────────────────┬────────────────┤
│              │                  │                 │
│  [РСЯ       │   Unity Canvas   │  [РСЯ          │
│   300×600]   │   70% ширины     │   300×250]      │
│              │   max 960px      │                 │
│              │   aspect 16:9    │  [РСЯ          │
│              │                  │   300×600]      │
│              │   [⛶ Fullscreen] │                 │
├──────────────┴──────────────────┴────────────────┤
│  Название игры (h1)                               │
│  Описание                                         │
├──────────────────────────────────────────────────┤
│  [РСЯ 728×90]                                    │
├──────────────────────────────────────────────────┤
│  Похожие игры (сетка карточек)                    │
├──────────────────────────────────────────────────┤
│  [Footer]                                         │
└──────────────────────────────────────────────────┘
```

- **Canvas**: `width: 70vw; max-width: 960px; aspect-ratio: 16/9; border-radius: 12px`
- **Fullscreen**: кнопка в нижнем правом углу canvas → `requestFullscreen()`
- **Прогресс-бар загрузки**: фиолетовая полоска + процент
- **Мобильный**: canvas 100% ширины, сайдбар-реклама скрывается
- **Используем `react-unity-webgl`** вместо ручного `unityApp.js`

---

### РСЯ (Рекламная Сеть Яндекса)

**Шаги для подключения:**
1. Зарегистрироваться на https://partner.yandex.ru
2. Добавить площадку `mad-games.ru`, пройти модерацию
3. Создать RTB-блоки (получить blockId вида `R-A-XXXXXX-1`)
4. Вставить код на сайт

**Позиции баннеров:**

| Позиция | Размер | Страница |
|---------|--------|----------|
| Верхний | 728×90 | Главная + страница игры |
| Левый сайдбар | 300×600 | Страница игры (десктоп) |
| Правый сайдбар | 300×250 + 300×600 | Страница игры (десктоп) |
| Под игрой | 728×90 | Страница игры |
| Мобильный | 320×100 | Между секциями |

**Реализация:** компонент `<YandexAdBlock blockId="R-A-..." />`. До одобрения РСЯ показывает placeholder. Флаг `NEXT_PUBLIC_ADS_ENABLED` в `.env`.

**Важно:** подавать заявку в РСЯ ПОСЛЕ того, как сайт будет оформлен (не пустой), иначе откажут.

---

### БД (SQLite)

```sql
CREATE TABLE games (
    id              INTEGER PRIMARY KEY AUTOINCREMENT,
    slug            TEXT UNIQUE NOT NULL,
    title           TEXT NOT NULL,
    description     TEXT DEFAULT '',
    cover_url       TEXT DEFAULT '',
    preview_video_url TEXT DEFAULT '',
    build_folder    TEXT NOT NULL,
    is_published    INTEGER DEFAULT 1,
    created_at      TEXT DEFAULT (datetime('now')),
    updated_at      TEXT DEFAULT (datetime('now'))
);
```

---

### Хранение файлов

```
public/games/
    escape-tsunami/
        Build/
            escape-tsunami.loader.js
            escape-tsunami.data
            escape-tsunami.framework.js
            escape-tsunami.wasm
        cover.jpg          ← 600×338, 16:9
        preview.webm       ← 480×270, 3-8 сек
        icon.png           ← 256×256
```

**Важно:** переименовать файлы билда — убрать `[2]` и `[5.0.18]` из имён (квадратные скобки ломают URL-маршрутизацию).

---

### VPS

**Минимальные требования:** 1-2 vCPU, 2 ГБ RAM, 20+ ГБ NVMe, Москва.

| Провайдер | RAM | Диск | Цена |
|-----------|-----|------|------|
| Beget | 2 ГБ | 20 ГБ NVMe | ~350₽/мес |
| Timeweb Cloud | 2 ГБ | 30 ГБ NVMe | ~400₽/мес |
| FirstVDS | 2 ГБ | 20 ГБ SSD | ~300₽/мес |

**Оптимизация трафика** (.wasm = 33 МБ на каждый визит):
- nginx `Cache-Control: public, max-age=31536000, immutable` для файлов билда
- gzip для .js, .css (НЕ для .wasm/.data — они уже сжаты)
- В будущем: CDN

---

### Структура проекта

```
mad-games-site/
├── docker-compose.yml
├── Dockerfile
├── nginx/nginx.conf
├── .env
├── next.config.ts          # output: 'standalone'
├── tailwind.config.ts
├── data/
│   └── games.db            # SQLite (Docker volume)
├── public/
│   └── games/              # Файлы игр (Docker volume)
└── src/
    ├── app/
    │   ├── layout.tsx       # Тёмная тема, Nunito, РСЯ loader
    │   ├── page.tsx         # Главная — каталог
    │   ├── globals.css
    │   ├── game/[slug]/
    │   │   └── page.tsx     # Страница игры
    │   └── api/games/
    │       └── route.ts     # GET список игр
    ├── components/
    │   ├── Header.tsx
    │   ├── Footer.tsx
    │   ├── GameCard.tsx     # Карточка с hover-видео
    │   ├── GameGrid.tsx
    │   ├── GamePlayer.tsx   # react-unity-webgl обёртка
    │   ├── SimilarGames.tsx
    │   └── YandexAdBlock.tsx
    └── lib/
        ├── db.ts            # SQLite
        └── types.ts
```

---

### Порядок реализации

#### Шаг 1. Инициализация проекта
- `npx create-next-app@latest` с TypeScript + Tailwind
- `npm install react-unity-webgl better-sqlite3`
- Настроить shadcn/ui, Nunito, цветовую палитру
- Переименовать файлы Unity билда (убрать спецсимволы)

#### Шаг 2. Компоненты и дизайн
- `Header.tsx` — sticky, логотип "MAD GAMES"
- `GameCard.tsx` — карточка с hover-видео
- `GamePlayer.tsx` — обёртка react-unity-webgl + fullscreen + прогресс-бар
- `Footer.tsx`

#### Шаг 3. Страницы
- Главная `/` — сетка карточек из SQLite
- Страница игры `/game/[slug]` — canvas по центру, описание, похожие игры
- `lib/db.ts` — SQLite, seed первой игры

#### Шаг 4. Превью-видео
- Записать геймплей, конвертировать в .webm через FFmpeg
- Сделать обложку (скриншот 600×338)
- Интегрировать hover-видео в GameCard

#### Шаг 5. РСЯ
- Компонент `YandexAdBlock.tsx` (placeholder до одобрения)
- Разместить баннеры на страницах
- Зарегистрировать площадку в РСЯ

#### Шаг 6. Docker + VPS + деплой
- Dockerfile (multi-stage)
- docker-compose.yml (nextjs + nginx)
- nginx.conf (прокси, кеш статики, SSL)
- Купить VPS, установить Docker
- Перенести DNS с GitHub Pages на VPS
- Certbot для SSL

---

### ✅ Выполнено (Итерация 2)

- [x] Инициализация Next.js проекта (TypeScript + Tailwind)
- [x] Дизайн-система (тёмная тема, glassmorphism, glow-эффекты)
- [x] Компоненты: Header, Footer, GameCard, GameGrid, GamePlayer, SimilarGames, YandexAdBlock
- [x] Главная страница — герой-секция + каталог игр
- [x] Страница игры — Unity плеер + описание + похожие
- [x] GameCard: hover → accent outline + видео-превью, мелкий title в углу
- [x] GamePlayer: blurred video bg → cover fade-in при hover → Play → Unity загрузка
- [x] Промо-ассеты из Unity проекта (cover, preview video)
- [x] `npm run build` — static export успешно
- [x] Локальная проверка через `npm run dev`

---

### 📋 TODO (Итерация 2 — осталось)

- [x] **Деплой на GitHub Pages**
  - [x] GitHub Actions workflow (`.github/workflows/deploy.yml`)
  - [x] CNAME файл для `mad-games.ru`
  - [x] Проверить static export на GitHub Pages
- [ ] **РСЯ**
  - [ ] Зарегистрировать площадку на partner.yandex.ru
  - [ ] Получить RTB-блоки (blockId)
  - [ ] Заменить placeholder-ы на реальные баннеры
- [x] **Контент**
  - [x] Добавить ещё 1–2 Unity игры для каталога
  - [ ] Уточнить описания и SEO-мету для каждой игры
- [x] **Оптимизация**
  - [x] Open Graph / Twitter Card мета-теги
  - [x] `metadataBase` в layout.tsx
  - [x] Favicon и PWA manifest

---

### Отложено на итерацию 3

- Переезд на VPS (Docker + nginx + certbot)
- SQLite вместо JSON для данных
- Админ-панель (загрузка игр через веб-интерфейс)
- Категории и фильтры
- Больше игр (5+)
- CDN для тяжёлых файлов
- Рейтинг / счётчик просмотров

---

### Проверка

1. Локально: `npm run dev` → главная с карточками, hover-видео работает, клик → страница игры с canvas ✅
2. Static build: `npm run build` → `out/` без ошибок ✅
3. GitHub Pages: `https://mad-games.ru` → каталог, игра загружается, РСЯ placeholder-ы на месте
