# Сайт Dr. Shapovalov

Готовая сборка сайта для GitHub Pages. Исходники и сборка — в репозитории `max`, папка
`branding/dr-shapovalov/site/` (`python3 build.py` → `dist/`).

Текст сайта правится через `admin.html` («Опубликовать» записывает `content.json` сюда).
## Хостинг (с 06.11.2026 — Yandex Cloud)

- **Домен:** drshapovalov.ru в REG.RU. DNS-серверы: ns1.yandexcloud.net, ns2.yandexcloud.net (смена 07.11.2026 ~00:12 МСК).
- **Сайт:** Yandex Cloud Object Storage, бакет `drshapovalov.ru` (статический хостинг, index.html);
  бакет `www.drshapovalov.ru` перенаправляет на https://drshapovalov.ru/.
- **DNS-зона** `drshapovalov-ru` в Cloud DNS: ANAME @ → drshapovalov.ru.website.yandexcloud.net,
  CNAME www → www.drshapovalov.ru.website.yandexcloud.net, CNAME _acme-challenge и _acme-challenge.www → <id сертификата>.cm.yandexcloud.net (для автопродления).
- **HTTPS:** Certificate Manager, Let's Encrypt `drshapovalov-ru` (drshapovalov.ru + www), продлевается сам.
- **Выкладка:** репозиторий DrPavelShapovalov/dr-shapovalov-site → workflow «Страницы и IndexNow» после каждого push
  копирует файлы в бакет (`aws s3 sync`, временный статический ключ создаётся и удаляется). Ключ сервисного аккаунта
  `site-deploy` (роль editor) — в секрете GitHub `YC_SA_KEY`. Ручные шаги — workflow «Yandex Cloud — настройка»
  (inspect / create / deploy / status / https / verify).
- **Оплата:** аккаунт Yandex Cloud доктора, стартовый грант 4 000 ₽ до 05.01.2027, далее — карта.
- GitHub Pages пока оставлен как резерв; отключить после проверки, что домен смотрит на Yandex Cloud.
