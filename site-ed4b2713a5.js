(() => {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const $ = (id) => document.getElementById(id);
  let PREVIEW = location.hash === '#preview';   // в админке пустые поля видны как «Добавить»
  /* ---------- язык: ?lang=en — английская версия (текст из content.en.json, подписи интерфейса — из EN) ---------- */
  const LANG = (/[?&]lang=en\b/.test(location.search) || /^\/en(\/|$)/.test(location.pathname)) ? 'en' : 'ru';
  // старые ссылки ?lang=en ведут на /en/ (предпросмотр в админке остаётся на ?lang=en)
  if (/[?&]lang=en\b/.test(location.search) && !/^\/en(\/|$)/.test(location.pathname) && window.top === window && location.hash !== '#preview') location.replace('/en/' + location.hash);
  const EN = {
    'Обо мне': 'About', 'Направления': 'Treatment', 'Кейсы': 'Cases', 'Наука': 'Research', 'Контакты': 'Contacts', 'Меню': 'Menu',
    'Отзывы': 'Reviews', 'Как растёт кость': 'How bone grows', 'Лечение': 'Treatment', 'Родителям': 'For parents', 'Коллегам': 'For colleagues',
    'Как растёт кость →': 'How bone grows →',
    'Схема: дистракция нижней челюсти. Задний фрагмент неподвижен, передний отходит вперёд, в щели формируется новая кость.': 'Diagram: mandibular distraction. The posterior fragment stays still, the anterior one moves forward, and new bone forms in the gap.',
    'ветвь': 'ramus', 'челюсть': 'mandible', 'мм': 'mm', 'Покрутите аппарат': 'Turn the device',
    'Образование, курсы и то, где я работаю сейчас.': 'Education, courses and where I work now.', 'Образование': 'Education',
    'Курсы и повышение квалификации': 'Courses and training', 'Чем я': 'What I', 'занимаюсь': 'treat',
    'Термины подчёркнуты пунктиром. Нажмите на любой, чтобы прочитать короткое объяснение.': 'Terms are underlined with dots. Tap any of them to read a short explanation.',
    'Результат': 'Results', 'в цифрах': 'in numbers',
    'Полосы на графиках отложены в масштабе. Фото пациентов публикуются только с письменного согласия пациентов и их законных представителей.': 'Bars are drawn to scale. Patient photos are published only with the written consent of the patients and their legal guardians.',
    'Показать фото операции': 'Show surgery photos', 'Скрыть фото операции': 'Hide surgery photos', 'Диссертация': 'Dissertation', 'и статьи': 'and papers',
    'Нажмите на страницу, чтобы открыть её целиком': 'Tap a page to open it in full', 'Где': 'Where', 'меня найти': 'to find me',
    'Новые кейсы выходят в Telegram-канале и в Instagram.': 'New cases are posted on my Telegram channel and Instagram (in Russian).',
    'Где я': 'Where I', 'работаю': 'work', 'Здесь карта не встраивается. Откройте её в Яндекс Картах или 2ГИС: кнопки ниже.': 'The map cannot be embedded here. Open it in Yandex Maps or 2GIS with the buttons below.',
    'Показать карту': 'Show map', 'Яндекс Карты ↗': 'Yandex Maps ↗', '2ГИС ↗': '2GIS ↗', 'Наверх ↑': 'Back to top ↑',
    'Сайт считает посещения с помощью сервиса': 'This site counts visits with', 'Яндекс Метрика': 'Yandex Metrica',
    ': страницы, источник перехода, город, устройство — без имён и контактов.': ': pages, referral source, city, device — no names or contact details.',
    'Открыть статью ↗': 'Open paper ↗', 'К публикации в списке': 'Go to the paper in the list', 'Разделы': 'Sections', 'Наверх': 'Back to top',
    'Меню сайта': 'Site menu', 'Павел Шаповалов в кабинете': 'Pavel Shapovalov in his office', 'Кому рассказать': 'Audience',
    'Павел Шаповалов': 'Pavel Shapovalov', 'Разделы сайта': 'Site sections', 'Титульные страницы публикаций': 'Title pages of publications',
    'Научные работы': 'Research work', 'Закрыть': 'Close', 'Закрыть меню': 'Close menu',
    'Работа с ортодонтом': 'Work with orthodontists', 'Статьи': 'Papers', 'Доклады': 'Talks', 'Программы для ЭВМ': 'Software',
    'Кандидатская диссертация': 'PhD dissertation', 'Специальность': 'Specialty', 'Руководитель': 'Supervisor', 'Защита': 'Defence',
    'Открыть диссертацию →': 'Open the dissertation →', 'ЭВМ': 'SW', 'Читать ↗': 'Read ↗', 'Этап': 'Step', 'Страница: ': 'Page: ', 'Карта: ': 'Map: ',
    'тело нижней челюсти': 'mandibular body', 'English version': 'Русская версия', 'Подробнее о случае': 'Case details (in Russian)',
    'Имеются противопоказания. Необходима консультация специалиста.': 'Contraindications apply. Consult a specialist.', 'Политика конфиденциальности': 'Privacy policy (in Russian)',
    'Настройки cookie': 'Cookie settings', 'Принять': 'Accept', 'Отклонить': 'Decline', 'Фото из операционной. Нажмите, чтобы открыть': 'Operating-room photo. Tap to open', 'Читать отзывы ↗': 'Read reviews ↗'
  };
  const tr = (ru) => (LANG === 'en' && EN[ru] != null ? EN[ru] : ru);
  // подписи интерфейса в HTML и в разметке, которую собирает render(): точное совпадение текста узла или атрибута
  function i18nDom(root) {
    if (LANG !== 'en') return;
    const w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    for (let n; (n = w.nextNode());) { const k = n.nodeValue.replace(/\s+/g, ' ').trim(); if (k && EN[k] != null) n.nodeValue = n.nodeValue.replace(n.nodeValue.trim(), EN[k]); }
    root.querySelectorAll('[aria-label],[alt],[title]').forEach((e) => ['aria-label', 'alt', 'title'].forEach((a) => { const v = e.getAttribute(a); if (v && EN[v] != null) e.setAttribute(a, EN[v]); }));
  }
  if (LANG === 'en') {
    document.documentElement.lang = 'en';
    document.title = 'Pavel Shapovalov — pediatric maxillofacial surgeon, Moscow';
    document.querySelector('meta[name="description"]')?.setAttribute('content', 'Pavel Shapovalov, MD, PhD, pediatric oral and maxillofacial surgeon in Moscow: mandibular distraction osteogenesis, clinical cases, research.');
    for (const id of ['lang-sw', 'menu-lang']) { const a = $(id); if (a) { a.href = '/'; a.hreflang = 'ru'; a.lang = 'ru'; } }
    $('lang-sw').textContent = 'RU'; $('lang-sw').setAttribute('aria-label', 'Русская версия');
    $('ck-text').innerHTML = 'Allow Yandex Metrica cookies? <a href="/privacy/">Details</a>';
    i18nDom(document.body);
  }

  let TERMS = {};

  /* ---------- текст из content.json ---------- */
  const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  // **жирный** и [[ключ|термин]]: термины из словаря открываются по нажатию
  const rich = (s) => esc(s)
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\[\[([a-z0-9_-]+)\|(.+?)\]\]/gi, (m, k, t) => TERMS[k] ? `<button class="term" type="button" data-term="${k}">${t}</button>` : t);
  const todo = (what) => PREVIEW ? `<span class="todo">Добавить: ${esc(what)}</span>` : '';
  const val = (v, what) => (v && String(v).trim()) ? rich(v) : todo(what);
  const safeUrl = (u) => { const v = String(u || '').trim(); return /^(https?:|#|mailto:|tel:|\/?img\/|\/?lechenie\/|\/?kejsy\/)/i.test(v) ? v.replace(/^(img|lechenie|kejsy)\//i, '/$1/') : ''; };
  const ext = (u) => /^https?:/i.test(u) ? ' target="_blank" rel="noopener"' : '';
  const num = (s) => parseFloat(String(s).replace(',', '.'));

  let CONTENT = {};
  function render(c) {
    CONTENT = c;
    TERMS = Object.fromEntries((c.terms || []).map((t) => [t.key, t]));
    const h = c.hero || {};
    $('h-name').innerHTML = `<span class="given">${esc([h.firstName, h.middleName].filter(Boolean).join(' '))}</span> <b>${esc(h.lastName)}</b>`;
    $('h-card').innerHTML = [h.cardLine1, h.cardLine2].filter(Boolean).map(esc).join('<br>');
    if (safeUrl(h.portrait)) $('h-portrait').src = safeUrl(h.portrait);
    const fig = safeUrl(h.figure);
    $('h-figure').hidden = !fig; document.querySelector('.hero').classList.toggle('has-fig', !!fig);
    if (fig) $('h-figure').src = fig;
    const m = c.meta || {};
    $('nav-handle').textContent = m.handle || '';
    if (safeUrl(m.telegram)) $('nav-tg').href = safeUrl(m.telegram);
    if (safeUrl(m.instagram)) $('h-ig').href = safeUrl(m.instagram);

    $('readings').innerHTML = (c.readings || []).map((r) => `
      <div class="reading reveal"><div class="val">${r.from ? `<span class="count" data-to="${esc(r.from)}">${esc(r.from)}</span> <span class="arr">→</span> ` : ''}<span class="count" data-to="${esc(r.to)}">${esc(r.to)}</span><small>${esc(r.unit)}</small></div><p class="lbl">${rich(r.label)}</p></div>`).join('');

    const dirs = c.directions || [];
    const mq = `<span>${dirs.map((d) => esc(d.title)).join(' <i></i> ')} <i></i> Работа с ортодонтом <i></i></span>`;
    if ($('marquee')) $('marquee').innerHTML = mq + mq;

    const a = c.about || {};
    $('about-h').innerHTML = rich(a.heading);
    $('about-text').innerHTML = rich(a.text);
    $('about-facts').innerHTML = (a.facts || []).filter((f) => f.value || PREVIEW).map((f) => `<dt>${esc(f.label)}</dt><dd>${val(f.value, String(f.label).toLowerCase())}</dd>`).join('');
    $('edu').innerHTML = (a.education || []).filter((e) => e.place || e.degree || PREVIEW).map((e) => `
      <li><span class="y">${val(e.years, 'годы')}</span><div><b>${val(e.degree, 'ступень')}</b><span>${val(e.place, 'вуз')}</span></div></li>`).join('') || todo('образование');
    const courses = (a.courses || []).filter((k) => k.title || PREVIEW);
    $('courses').innerHTML = courses.map((k) => `<div class="course"><span class="y">${val(k.year, 'год')}</span><b>${val(k.title, 'название курса')}</b><span>${val(k.org, 'где проходил')}</span></div>`).join('');
    $('courses-panel').hidden = !courses.length;
    const rv = c.reviews || {}, rvl = (rv.links || []).filter((l) => safeUrl(l.url) && l.label);
    $('rev-h').innerHTML = esc(rv.heading || 'Отзывы').replace(/\*(.+?)\*/g, '<em>$1</em>');
    $('rev-text').innerHTML = rich(rv.text);
    $('rev-list').innerHTML = rvl.map((l) => `<a class="rev glass reveal" href="${esc(safeUrl(l.url))}"${ext(l.url)}><div><small>${esc(l.note || 'Отзывы')}</small><b>${esc(l.label)}</b></div><span class="go">Читать отзывы ↗</span></a>`).join('');
    $('reviews').hidden = !rvl.length;

    $('dirs').innerHTML = dirs.map((d) => {
      const u = safeUrl(d.link), tag = u ? 'a' : 'div';
      return `<${tag} class="dir glass reveal"${u ? ` href="${esc(u)}"${ext(u)}` : ''}><h3>${esc(d.title)}</h3>${d.text ? `<p>${rich(d.text)}</p>` : ''}${u && d.linkLabel ? `<span class="go">${esc(d.linkLabel)} →</span>` : ''}</${tag}>`;
    }).join('');

    const gallery = (k) => {
      const ims = (k.images || []).filter((m) => safeUrl(m.src));
      if (!ims.length) return '';
      return `<div class="case-gal${ims.length > 3 ? ' many' : ''}">${ims.map((m) => `<figure><button type="button"${m.sensitive ? ' class="sens"' : ''} data-cimg="${esc(safeUrl(m.src))}" data-cap="${esc(m.caption || '')}" data-alt="${esc(m.alt || m.caption || k.title)}" data-case="${esc(k.title)}" aria-label="Открыть крупно: ${esc(m.caption || k.title)}"><img src="${esc(safeUrl(m.src))}" alt="${esc(m.alt || m.caption || '')}" loading="lazy">${m.sensitive ? `<span class="sens-note">${esc(tr('Фото из операционной. Нажмите, чтобы открыть'))}</span>` : ''}</button>${m.caption ? `<figcaption>${rich(m.caption)}</figcaption>` : ''}</figure>`).join('')}</div>${k.consent ? `<p class="case-note">${esc(k.consent)}</p>` : ''}`;
    };
    // у каждого кейса своя страница kejsy/<адрес>/ (её собирает pages.py): адрес из поля slug, иначе метка id
    const caseHref = (k) => { const s = String(k.slug || k.id || '').trim(); return /^[a-z0-9][a-z0-9-]{0,80}$/.test(s) ? `/kejsy/${s}/` : ''; };
    $('case-list').innerHTML = (c.cases || []).map((k) => {
      const max = +k.scaleMax || Math.max(...(k.bars || []).map((b) => +b.value || 0), 1);
      const ticks = [0, .25, .5, .75, 1].map((f) => `<span>${+(max * f).toFixed(1)}</span>`).join('');
      const metric = esc(k.metric).replace(/→/g, '<span class="arr">→</span>');
      return `<article class="case glass reveal" id="${esc(k.id)}">
        <div class="case-text"><div class="tags">${(k.tags || []).map((t) => `<span class="tag">${esc(t)}</span>`).join('')}</div>
          <h3>${esc(k.title)}</h3><ul>${(k.points || []).map((p) => `<li>${rich(p)}</li>`).join('')}</ul>${caseHref(k) ? `<a class="case-more" href="${caseHref(k)}">${esc(tr('Подробнее о случае'))} →</a>` : ''}</div>
        <div class="viz${(k.bars || []).length ? '' : ' solo'}"><div class="big">${metric}<small>${esc(k.metricUnit)}</small></div><p class="cap">${rich(k.metricCaption)}</p>
          ${(k.bars || []).length ? `<div class="bars" role="img" aria-label="${esc((k.bars || []).map((b) => `${b.name} ${b.value} ${b.unit}`).join(', '))}">
            ${(k.bars || []).map((b) => `<div class="bar"><span class="n">${esc(b.name)}</span><span class="rail"><span class="fill${b.accent ? ' on' : ''}" style="--w:${Math.min(100, (+b.value / max) * 100).toFixed(2)}%"></span></span><span class="v">${esc(LANG === 'en' ? String(b.value) : String(b.value).replace('.', ','))} ${esc(b.unit)}</span></div>`).join('')}
            <div class="scale"><span></span><span class="t">${ticks}</span><span></span></div></div>` : ''}</div>${gallery(k)}</article>`;
    }).join('');

    const s = c.steps || {};
    $('steps-h').innerHTML = esc(s.heading).replace(/(дистракционного аппарата|distraction device)/i, '<em>$1</em>');
    $('steps-intro').innerHTML = rich(s.intro);
    $('step-list').innerHTML = '<span class="rail-y" aria-hidden="true"></span><span class="prog" aria-hidden="true"></span>' +
      (s.items || []).map((it, i) => {
        const ph = safeUrl(it.image), cap = `${tr('Этап')} ${i + 1}: ${[it.title, it.detail].filter(Boolean).join(' ')}`;
        return `<li class="step${ph ? ' has-ph' : ''}"><span class="n">${i + 1}</span><p>${esc(it.title)} <span>${esc(it.detail)}</span></p>${ph ? `<button class="step-ph" type="button" data-cimg="${esc(ph)}" data-cap="${esc(cap)}" data-case="${esc(s.heading || 'Этапы операции')}" data-alt="${esc('Фото с операции. ' + cap)}" aria-label="Открыть фото: ${esc(cap)}"><img src="${esc(ph)}" alt="" loading="lazy"></button>` : ''}</li>`;
      }).join('');
    $('op-toggle').hidden = !(s.items || []).some((it) => safeUrl(it.image));

    const sc = c.science || {}, d = sc.dissertation || {};
    $('sci-intro').innerHTML = rich(sc.intro);
    $('diss').innerHTML = `<div class="diss-top"><span class="deg">${esc(d.degree || 'Кандидатская диссертация')}</span><span id="diss-page"></span></div>
      <h3>${d.title ? esc(d.title) : (todo('название диссертации') || 'Кандидатская диссертация')}</h3>
      ${d.summary ? `<p class="diss-sum">${rich(d.summary)}</p>` : todo('главный вывод')}
      <dl>${[['Специальность', d.specialty, 'шифр и название'], ['Руководитель', d.supervisor, 'научный руководитель'], ['Защита', d.year, 'год защиты'], ['Где', d.place, 'где защищена']]
        .filter(([, v]) => v || PREVIEW).map(([k, v, w]) => `<dt>${k}</dt><dd>${val(v, w)}</dd>`).join('')}</dl>
      ${safeUrl(d.link) ? `<a class="pill" href="${esc(safeUrl(d.link))}"${ext(d.link)}>Открыть диссертацию →</a>` : todo('ссылку на диссертацию')}
      ${(sc.profiles || []).length ? `<div class="profiles">${sc.profiles.map((p) => { const u = safeUrl(p.url);
        return `<${u ? 'a' : 'span'} class="chip"${u ? ` href="${esc(u)}"${ext(u)}` : ''}><small>${esc(p.label)}</small>${esc(p.value)}</${u ? 'a' : 'span'}>`; }).join('')}</div>` : ''}`;
    const pubs = (sc.publications || []).filter((p) => p.title), talks = (sc.talks || []).filter((t) => t.title), soft = (sc.software || []).filter((t) => t.title);
    $('sci-tabs').innerHTML = [['pubs', 'Статьи', pubs.length], ['talks', 'Доклады', talks.length], ['soft', 'Программы для ЭВМ', soft.length]]
      .filter(([, , n]) => n).map(([k, l, n], i) => `<button type="button" role="tab" data-tab="${k}" aria-selected="${i === 0}">${l}<span>${n}</span></button>`).join('');
    // титульные страницы: веер наверху и миниатюра у каждой работы
    LB = [];
    const card = (src) => src.replace(/(\.[a-z]+)$/i, '-card$1');
    const addLb = (it) => { LB.push(it); return LB.length - 1; };
    // кнопка завёрнута в обычный блок: растягиваться в сетке может только блок, а кнопка остаётся по размеру страницы
    const thumb = (k, poster) => `<div class="thumb-cell"><button class="thumb${poster ? ' poster' : ''}" type="button" data-lb="${k}" aria-label="Открыть страницу целиком: ${esc(LB[k].title)}"><img src="${esc(card(LB[k].img))}" data-full="${esc(LB[k].img)}" alt="" loading="lazy"></button></div>`;
    $('talks').innerHTML = talks.map((t, i) => {
      const k = safeUrl(t.image) ? addLb({ img: safeUrl(t.image), title: t.title, sub: [t.event, t.type && t.type + ' доклад'].filter(Boolean).join(' · '), panel: 'talks', id: 'talk-' + i, tall: true }) : -1;
      return `<div class="pub glass" id="talk-${i}">${k >= 0 ? thumb(k, true) : `<span class="num">${esc(t.year)}</span>`}<div><b>${esc(t.title)}</b><span class="au">${esc(t.authors)}</span>
      <span class="src"><span>${esc(t.event)}</span>${t.type ? `<span class="lnk">${esc(t.type)}${LANG === 'en' ? '' : ' доклад'}</span>` : ''}</span></div></div>`; }).join('');
    $('soft').innerHTML = soft.map((t, i) => {
      const k = safeUrl(t.image) ? addLb({ img: safeUrl(t.image), title: t.title, sub: t.number, panel: 'soft', id: 'soft-' + i, fan: true }) : -1;
      return `<div class="pub glass" id="soft-${i}">${k >= 0 ? thumb(k) : '<span class="num">ЭВМ</span>'}<div><b>${esc(t.title)}</b><span class="au">${esc(t.authors)}</span>
      <span class="src"><span>${esc(t.number)}</span></span></div></div>`; }).join('');
    bindTabs();
    $('pubs').innerHTML = pubs.map((p, i) => {
      const u = safeUrl(p.link) || (p.doi ? `https://doi.org/${p.doi}` : '');
      const k = safeUrl(p.image) ? addLb({ img: safeUrl(p.image), title: p.title, sub: p.journal, url: u, panel: 'pubs', id: 'pub-' + i, fan: true }) : -1;
      return `<article class="pub glass reveal" id="pub-${i}">${k >= 0 ? thumb(k) : `<span class="num">${esc((String(p.journal).match(/(19|20)\d\d/) || [''])[0])}</span>`}
        <div><b>${esc(p.title)}</b><span class="au">${esc(p.authors)}</span>
        <span class="src"><span>${esc(p.journal)}</span>${p.doi ? `<span>DOI ${esc(p.doi)}</span>` : ''}${u ? `<a class="lnk" href="${esc(u)}"${ext(u)}>Читать ↗</a>` : ''}</span></div></article>`;
    }).join('') || todo('статьи');
    // титульный лист диссертации — в карточке диссертации и первым в веере
    if (safeUrl(d.image)) {
      const k = addLb({ img: safeUrl(d.image), title: d.title, sub: [d.degree, d.specialty].filter(Boolean).join(' · '), url: safeUrl(d.link), panel: 'diss', id: 'diss', fan: true });
      $('diss-page').innerHTML = thumb(k);
    }
    // фото диплома под карточкой диссертации
    if (safeUrl(d.diploma)) {
      const dt = LANG === 'en' ? 'Candidate of Medical Sciences diploma' : 'Диплом кандидата медицинских наук';
      const k = addLb({ img: safeUrl(d.diploma), title: dt, sub: d.year || '', panel: 'diss', id: 'diss', clean: true });
      const src = esc(card(LB[k].img)), full = esc(LB[k].img);
      $('diss').insertAdjacentHTML('beforeend', `<figure class="dipl" id="dipl"><button class="dipl-btn" type="button" data-lb="${k}" aria-label="${esc((LANG === 'en' ? 'Open the diploma: ' : 'Открыть диплом целиком: ') + dt)}">
        <span class="dipl-book"><span class="dipl-half dipl-l"><span class="dipl-face"><img src="${src}" data-full="${full}" alt="" loading="lazy"></span><span class="dipl-cover" aria-hidden="true"><i></i>${LANG === 'en' ? 'DIPLOMA' : 'ДИПЛОМ<br>КАНДИДАТА НАУК'}</span></span><span class="dipl-half dipl-r"><span class="dipl-face"><img src="${src}" data-full="${full}" alt="" loading="lazy"></span></span></span>
        <span class="dipl-shine"></span></button><figcaption>${esc(dt)}</figcaption></figure>`);
    }
    // веер: диссертация, статьи по порядку списка, затем свидетельство о регистрации программы
    const rank = (it) => (it.panel === 'diss' ? 0 : it.panel === 'soft' ? 2 : 1);
    const fanItems = LB.map((it, k) => [it, k]).filter(([it]) => it.fan).sort((a, b) => rank(a[0]) - rank(b[0]));
    $('fan').innerHTML = fanItems.map(([it, k], j) => `<button class="fan-card" type="button" data-lb="${k}" data-z="${it.panel === 'diss' ? 40 : j + 1}" style="z-index:${it.panel === 'diss' ? 40 : j + 1}" aria-label="Открыть страницу целиком: ${esc(it.title)}"><img src="${esc(card(it.img))}" data-full="${esc(it.img)}" alt="" loading="lazy"></button>`).join('');
    $('fan-wrap').hidden = !fanItems.length;
    document.querySelectorAll('img[data-full]').forEach((im) => im.addEventListener('error', () => { if (im.src.indexOf(im.dataset.full) < 0) im.src = im.dataset.full; }, { once: true }));
    layoutFan(false);

    const w = c.work || {};
    $('work-h').innerHTML = esc(w.name).replace(/(«.+»)/, '<em>$1</em>');
    $('work-text').innerHTML = rich(w.text);
    $('work-side').innerHTML = (w.links || []).filter((l) => safeUrl(l.url)).map((l) => `<a class="ghost" href="${esc(safeUrl(l.url))}"${ext(l.url)}>${esc(l.label)} →</a>`).join('') +
      (w.address ? `<span class="ghost" style="cursor:default">${esc(w.address)}</span>` : todo('адрес приёма и как записаться'));

    $('contact-list').innerHTML = (c.contacts || []).filter((k) => k.value || PREVIEW).map((k) => {
      const u = safeUrl(k.url);
      return u && k.value ? `<a class="contact glass reveal" href="${esc(u)}"${ext(u)}><small>${esc(k.label)} ↗</small><span>${esc(k.value)}</span></a>`
        : `<div class="contact glass reveal"><small>${esc(k.label)}</small><span>${val(k.value, k.label)}</span></div>`;
    }).join('');
    // меню: направления лечения с цветными шариками, внизу — быстрые контакты
    $('menu-dirs').innerHTML = dirs.map((d) => `<li><a href="#directions"><span class="orb" aria-hidden="true"></span>${esc(d.title)}</a></li>`).join('');
    $('menu-foot').innerHTML = (c.contacts || []).filter((k) => safeUrl(k.url) && k.value).slice(0, 4)
      .map((k) => `<a href="${esc(safeUrl(k.url))}"${ext(k.url)}>${esc(k.value)}</a>`).join('');

    // дистракция
    const dxc = c.distraction || {};
    DX = { max: +dxc.maxMm > 0 ? +dxc.maxMm : 15, phases: dxc.phases || [] };
    $('dx-h').innerHTML = esc(dxc.heading || '').replace(/(кость|кости|bone)$/i, '<em>$1</em>');
    $('dx-note').innerHTML = rich(dxc.note);

    // карта
    const q = w.mapQuery || w.address || '';
    $('map-addr').textContent = w.address || '';
    $('map-place').textContent = w.name || '';
    $('map-ya').href = 'https://yandex.ru/maps/?text=' + encodeURIComponent(q);
    $('map-2gis').href = 'https://2gis.ru/moscow/search/' + encodeURIComponent(q);
    $('map-card').hidden = !q;
    MAPQ = q;

    applyAud();
    $('foot-note').textContent = `© ${new Date().getFullYear()} ${[h.firstName, h.middleName, h.lastName].filter(Boolean).join(' ')}. ${(c.footer || {}).note || ''}`;
    bindTerms();
    bindGlass();
  }

  /* ---------- родителям / коллегам ---------- */
  const AUD_KEY = 'shp-audience';
  let AUD = 'parents';
  try { if (localStorage.getItem(AUD_KEY) === 'colleagues') AUD = 'colleagues'; } catch (e) {}
  const pro = () => AUD === 'colleagues';
  function placeAudInk() {
    const b = document.querySelector(`#aud [data-aud="${AUD}"]`), ink = $('aud-ink'); if (!b) return;
    ink.style.left = b.offsetLeft + 'px'; ink.style.width = b.offsetWidth + 'px';
  }
  function applyAud() {
    const c = CONTENT, h = c.hero || {}, au = c.audience || {}, dxc = c.distraction || {};
    document.querySelectorAll('#aud button').forEach((b) => {
      b.setAttribute('aria-checked', String(b.dataset.aud === AUD));
      const l = b.dataset.aud === 'colleagues' ? au.colleaguesLabel : au.parentsLabel; if (l) b.textContent = l;
    });
    placeAudInk();
    $('h-lede').innerHTML = rich(pro() && h.ledePro ? h.ledePro : h.lede);
    const cta = (pro() ? au.colleaguesCta : au.parentsCta) || {};
    if (cta.label && safeUrl(cta.link)) { $('h-cta').textContent = cta.label + ' →'; $('h-cta').href = safeUrl(cta.link); }
    $('dx-intro').innerHTML = rich(pro() && dxc.introPro ? dxc.introPro : dxc.intro);
    $('dx-steps').innerHTML = DX.phases.map((ph) => `<li><i><b></b></i>${esc(pro() && ph.titlePro ? ph.titlePro : ph.title)}</li>`).join('');
    $('dx-lbl-body').textContent = tr(pro() ? 'тело нижней челюсти' : 'челюсть');
    dxIdx = -1; dxSet(dxP);
  }
  function setAud(a) {
    if (a === AUD) return;
    AUD = a; try { localStorage.setItem(AUD_KEY, a); } catch (e) {}
    const els = [$('h-lede'), $('h-cta'), $('dx-intro'), $('dx-now')];
    if (window.gsap && !reduce) {
      placeAudInk();
      gsap.to(els, { autoAlpha: 0, y: -6, duration: 0.16, ease: 'power2.out', onComplete: () => {
        applyAud(); gsap.fromTo(els, { autoAlpha: 0, y: 8 }, { autoAlpha: 1, y: 0, duration: 0.32, stagger: 0.03, ease: 'power3.out', clearProps: 'transform' }); } });
    } else applyAud();
  }
  document.querySelectorAll('#aud button').forEach((b) => b.addEventListener('click', () => setAud(b.dataset.aud)));
  $('aud').addEventListener('keydown', (e) => {
    if (!['ArrowLeft', 'ArrowRight'].includes(e.key)) return;
    e.preventDefault(); const next = AUD === 'parents' ? 'colleagues' : 'parents';
    setAud(next); document.querySelector(`#aud [data-aud="${next}"]`).focus();
  });
  addEventListener('resize', placeAudInk);
  if (document.fonts) document.fonts.ready.then(placeAudInk);

  /* ---------- дистракция: прокрутка раздвигает фрагменты челюсти ---------- */
  let DX = { max: 15, phases: [] }, dxIdx = -1, dxP = 0;
  const fmt1 = (v) => (LANG === 'en' ? v.toFixed(1) : v.toFixed(1).replace('.', ','));
  function dxSet(p) {
    dxP = p;
    const s = (a, b) => Math.max(0, Math.min(1, (p - a) / (b - a)));
    const cut = s(0, 0.1), dev = s(0.05, 0.15), lat = s(0.1, 0.22), act = s(0.22, 0.82), con = s(0.82, 1);
    const mm = act * DX.max, dx = act * 90;
    $('dx-cut').setAttribute('y2', (210 + 139 * cut).toFixed(1));
    $('dx-dev').setAttribute('opacity', dev.toFixed(3));
    $('dx-dev').setAttribute('transform', `translate(0 ${((1 - dev) * -14).toFixed(2)})`);
    $('dx-plate-a').setAttribute('opacity', dev.toFixed(3));
    $('dx-ant').setAttribute('transform', `translate(${dx.toFixed(2)} 0)`);
    $('dx-gap').setAttribute('width', dx.toFixed(2)); $('dx-cons').setAttribute('width', dx.toFixed(2));
    $('dx-cons').setAttribute('opacity', (con * 0.92).toFixed(3));
    $('dx-knob').setAttribute('transform', `rotate(${(mm * 96).toFixed(1)} 100 333)`);
    $('dx-dim').setAttribute('opacity', act > 0.02 ? 1 : 0);
    $('dx-dim-r').setAttribute('transform', `translate(${dx.toFixed(2)} 0)`);
    $('dx-dim-l').setAttribute('x2', (345 + dx).toFixed(2));
    $('dx-dim-t').setAttribute('x', (345 + dx / 2).toFixed(2)); $('dx-dim-t').textContent = fmt1(mm) + ' ' + tr('мм');
    $('dx-mm').textContent = fmt1(mm);
    const fills = [cut, lat, act, con];
    document.querySelectorAll('#dx-steps b').forEach((b, i) => b.style.setProperty('--f', fills[i] ?? 0));
    const idx = p < 0.1 ? 0 : p < 0.22 ? 1 : p < 0.82 ? 2 : 3;
    if (idx !== dxIdx) {
      dxIdx = idx; const ph = DX.phases[idx] || {};
      $('dx-now').innerHTML = `<b>${esc(pro() && ph.titlePro ? ph.titlePro : ph.title)}</b><p>${rich(pro() && ph.textPro ? ph.textPro : ph.text)}</p>`;
      document.querySelectorAll('#dx-steps li').forEach((li, i) => li.classList.toggle('on', i === idx));
      bindTerms();
    }
  }

  /* ---------- подпись пишется пером ---------- */
  function writeSignature() {
    const svg = $('sig'); if (!svg || reduce || !window.gsap) return;
    const img = svg.querySelector('image'), strokes = [...svg.querySelectorAll('mask path')];
    img.setAttribute('mask', 'url(#sig-mask)');
    const tl = gsap.timeline({ delay: 0.6, onComplete: () => img.removeAttribute('mask') });
    strokes.forEach((p) => {
      const L = p.getTotalLength(); p.style.strokeDasharray = L; p.style.strokeDashoffset = L;
      tl.to(p, { strokeDashoffset: 0, duration: Math.max(0.14, L / 1150), ease: 'none' });
    });
  }

  /* ---------- полноэкранное меню ---------- */
  const menu = $('menu'), burger = $('burger');
  let menuOpen = false;
  function openMenu() {
    if (menuOpen) return; menuOpen = true;
    burger.setAttribute('aria-expanded', 'true'); burger.querySelector('.sr').textContent = tr('Закрыть меню');
    document.body.classList.add('menu-open'); menu.hidden = false; if (lenis) lenis.stop();
    const r = burger.getBoundingClientRect(), x = r.left + r.width / 2, y = r.top + r.height / 2;
    const R = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
    const items = menu.querySelectorAll('.menu-in > a, .menu-group > a, .menu-sub li, .menu-foot');
    if (window.gsap && !reduce) {
      gsap.fromTo(menu, { clipPath: `circle(0px at ${x}px ${y}px)` }, { clipPath: `circle(${R}px at ${x}px ${y}px)`, duration: 0.55, ease: 'expo.out', clearProps: 'clipPath' });
      gsap.fromTo(items, { autoAlpha: 0, y: 26 }, { autoAlpha: 1, y: 0, duration: 0.5, stagger: 0.04, delay: 0.08, ease: 'power3.out', clearProps: 'transform' });
    } else if (window.gsap) gsap.fromTo(menu, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.2 });
    menu.querySelector('a').focus({ preventScroll: true });
  }
  function closeMenu(focusBack = true) {
    if (!menuOpen) return; menuOpen = false;
    burger.setAttribute('aria-expanded', 'false'); burger.querySelector('.sr').textContent = tr('Меню');
    document.body.classList.remove('menu-open'); if (lenis) lenis.start();
    const done = () => { menu.hidden = true; if (window.gsap) gsap.set(menu, { clearProps: 'all' }); };
    if (window.gsap && !reduce) {
      const r = burger.getBoundingClientRect(), x = r.left + r.width / 2, y = r.top + r.height / 2;
      gsap.to(menu, { clipPath: `circle(0px at ${x}px ${y}px)`, duration: 0.32, ease: 'power3.out', onComplete: done });
    } else menu.hidden = true;
    if (focusBack) burger.focus({ preventScroll: true });
  }
  burger.addEventListener('click', () => (menuOpen ? closeMenu() : openMenu()));
  menu.addEventListener('click', (e) => { if (e.target.closest('a')) closeMenu(false); });
  document.addEventListener('keydown', (e) => {
    if (!menuOpen) return;
    if (e.key === 'Escape') { e.preventDefault(); closeMenu(); return; }
    if (e.key !== 'Tab') return;
    const f = [burger, ...menu.querySelectorAll('a')], i = f.indexOf(document.activeElement);
    if (e.shiftKey && i <= 0) { e.preventDefault(); f[f.length - 1].focus(); }
    else if (!e.shiftKey && i === f.length - 1) { e.preventDefault(); f[0].focus(); }
  });

  /* ---------- карта: грузится только по нажатию ---------- */
  let MAPQ = '';
  $('map-load').addEventListener('click', () => {
    if (!MAPQ) return;
    const f = document.createElement('iframe');
    f.src = 'https://yandex.ru/map-widget/v1/?mode=search&z=16&text=' + encodeURIComponent(MAPQ);
    f.title = tr('Карта: ') + MAPQ; f.allowFullscreen = true; f.referrerPolicy = 'strict-origin-when-cross-origin';
    f.setAttribute('sandbox', 'allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox');
    $('map-frame').append(f); $('map-frame').classList.add('on'); $('map-load').hidden = true;
  });
  // если страница открыта там, где чужие сайты встраивать запрещено (например, предпросмотр на claude.ai),
  // браузер блокирует карту — тогда убираем пустое окно и предлагаем открыть карту по ссылке
  document.addEventListener('securitypolicyviolation', (e) => {
    if (!/yandex/.test(e.blockedURI || '')) return;
    const fr = $('map-frame'); fr.querySelector('iframe')?.remove(); fr.classList.remove('on');
    $('map-note').hidden = false;
  });

  /* ---------- веер титульных страниц и просмотр целиком ---------- */
  let LB = [];
  function fanTargets() {
    const fan = $('fan'), cards = [...fan.children], n = cards.length; if (!n) return [];
    const W = fan.clientWidth, cw = cards[0].offsetWidth, mid = (n - 1) / 2;
    const spread = n > 1 ? Math.min(cw * 0.52, (W - cw * (W < 600 ? 2.2 : 1.5)) / (n - 1)) : 0, step = n > 1 ? Math.min(5.5, (W < 600 ? 30 : 44) / (n - 1)) : 0;
    return cards.map((c, i) => { const d = i - mid; return { c, x: d * spread, y: d * d * cw * 0.013, r: d * step }; });
  }
  function layoutFan(play) {
    const t = fanTargets(); if (!t.length) return;
    if (window.gsap) {
      if (play && !reduce) {
        gsap.fromTo(t.map((o) => o.c), { xPercent: -50, x: 0, y: 70, rotation: 0, autoAlpha: 0 },
          { x: (i) => t[i].x, y: (i) => t[i].y, rotation: (i) => t[i].r, autoAlpha: 1, duration: 1, ease: 'power3.out', stagger: { each: 0.06, from: 'center' }, delay: 0.1 });
      } else t.forEach((o) => gsap.set(o.c, { xPercent: -50, x: o.x, y: o.y, rotation: o.r, autoAlpha: 1 }));
    } else t.forEach((o) => { o.c.style.transform = `translate(-50%,0) translate(${o.x}px,${o.y}px) rotate(${o.r}deg)`; });
    t.forEach((o) => { o.c.dataset.y = o.y; });
  }
  addEventListener('resize', () => layoutFan(false));
  // карточка диссертации липкая; если она выше экрана (с фото диплома), прилипает нижним краем, чтобы диплом был виден
  const dissTop = () => { const d = $('diss'); if (d && d.offsetHeight) d.style.setProperty('--diss-top', Math.min(110, innerHeight - d.offsetHeight - 24) + 'px'); };
  addEventListener('resize', dissTop);
  if (window.ResizeObserver && $('diss')) new ResizeObserver(dissTop).observe($('diss'));
  $('fan').addEventListener('pointerover', (e) => {
    const c = e.target.closest('.fan-card'); if (!c || e.pointerType !== 'mouse' || !window.gsap || reduce) return;
    c.style.zIndex = 60; gsap.to(c, { y: +c.dataset.y - 34, scale: 1.08, duration: 0.28, ease: 'power3.out', overwrite: 'auto' });
  });
  $('fan').addEventListener('pointerout', (e) => {
    const c = e.target.closest('.fan-card'); if (!c || e.pointerType !== 'mouse' || !window.gsap || reduce || c.contains(e.relatedTarget)) return;
    c.style.zIndex = c.dataset.z; gsap.to(c, { y: +c.dataset.y, scale: 1, duration: 0.3, ease: 'power3.out', overwrite: 'auto' });
  });
  function thumbsFx(root) {
    if (!window.gsap || reduce) return;
    gsap.fromTo(root.querySelectorAll('.thumb'), { autoAlpha: 0, y: 26, rotation: -14, scale: 0.7 },
      { autoAlpha: 1, y: 0, rotation: 0, scale: 1, duration: 0.7, stagger: 0.06, delay: 0.45, ease: 'power3.out', clearProps: 'transform' });
  }
  // диплом: обложка раскрывается, затем по развороту проходит золотой блик; при «уменьшить движение» — сразу открыт
  let diplST = null;
  function diplomaFx() {
    const f = $('dipl'); if (!f || !window.gsap || reduce) return;
    const l = f.querySelector('.dipl-l'), book = f.querySelector('.dipl-book'), sh = f.querySelector('.dipl-shine');
    if (diplST) diplST.kill();
    gsap.set(l, { rotationY: -180 }); gsap.set(book, { autoAlpha: 0, y: 40, scale: 0.92, rotationX: 16 }); sh.classList.remove('go');
    const play = () => gsap.timeline()
      .to(book, { autoAlpha: 1, y: 0, scale: 1, rotationX: 0, duration: 0.8, ease: 'power3.out', clearProps: 'transform,opacity,visibility' })
      .to(l, { rotationY: 0, duration: 1.5, ease: 'expo.inOut', clearProps: 'transform' }, '-=0.2')
      .add(() => { void sh.offsetWidth; sh.classList.add('go'); }, '-=0.35')
      .fromTo(book, { filter: 'drop-shadow(0 0 0 rgba(240,212,142,0))' },
        { filter: 'drop-shadow(0 0 28px rgba(240,212,142,.45))', duration: 0.55, yoyo: true, repeat: 1, ease: 'sine.inOut', clearProps: 'filter' }, '<');
    if (window.ScrollTrigger) diplST = ScrollTrigger.create({ trigger: f, start: 'top 90%', once: true, onEnter: play });
    else play();
  }
  let lbItem = null, lbBack = null;
  function openLb(k, from) {
    const it = LB[k]; if (!it) return; lbItem = it; lbBack = from || null;
    const im = new Image(); im.src = it.img; im.alt = it.alt || (tr('Страница: ') + it.title); $('lb-fig').replaceChildren(im);
    $('lb-go').hidden = !it.panel; $('lb').classList.toggle('clean', !!it.clean);
    $('lb-t').textContent = it.title; $('lb-s').textContent = it.sub || '';
    $('lb-link').hidden = !it.url; if (it.url) $('lb-link').href = it.url;
    $('lb').classList.toggle('tall', !!it.tall); $('lb').hidden = false; $('lb-in').scrollTop = 0;
    if (lenis) lenis.stop();
    if (window.gsap && !reduce) {
      gsap.fromTo('.lb-scrim', { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.25, ease: 'power2.out' });
      gsap.fromTo('.lb-fig img', { autoAlpha: 0, y: 30, scale: 0.94 }, { autoAlpha: 1, y: 0, scale: 1, duration: 0.45, ease: 'power3.out' });
      gsap.fromTo('.lb-cap', { autoAlpha: 0, x: 16 }, { autoAlpha: 1, x: 0, duration: 0.4, delay: 0.08, ease: 'power3.out' });
    }
    $('lb-x').focus({ preventScroll: true });
  }
  function closeLb(keepScroll) {
    if ($('lb').hidden) return; $('lb').hidden = true; if (lenis) lenis.start();
    if (lbBack && !keepScroll) lbBack.focus({ preventScroll: true });
  }
  document.addEventListener('click', (e) => {
    const t = e.target.closest('[data-lb]'); if (t) { e.preventDefault(); openLb(+t.dataset.lb, t); return; }
    const ci = e.target.closest('[data-cimg]');
    if (ci) { e.preventDefault(); LB.push({ img: ci.dataset.cimg, title: ci.dataset.cap || ci.dataset.case, sub: ci.dataset.cap ? ci.dataset.case : '', alt: ci.dataset.alt, clean: true }); openLb(LB.length - 1, ci); return; }
    if (e.target.closest('#lb [data-close]')) closeLb();
  });
  document.addEventListener('keydown', (e) => {
    if ($('lb').hidden) return;
    if (e.key === 'Escape') { e.preventDefault(); closeLb(); }
    if (e.key === 'Tab') { const f = [$('lb-x'), ...$('lb').querySelectorAll('.lb-acts a:not([hidden]), .lb-acts button:not([hidden])')]; const i = f.indexOf(document.activeElement);
      if (e.shiftKey && i <= 0) { e.preventDefault(); f[f.length - 1].focus(); } else if (!e.shiftKey && i === f.length - 1) { e.preventDefault(); f[0].focus(); } }
  });
  $('op-toggle').addEventListener('click', (e) => {
    const on = document.querySelector('.steps-wrap').classList.toggle('show-op');
    e.currentTarget.setAttribute('aria-pressed', String(on)); e.currentTarget.textContent = tr(on ? 'Скрыть фото операции' : 'Показать фото операции');
  });
  $('lb-go').addEventListener('click', () => {
    const it = lbItem; closeLb(true); if (!it) return;
    const tab = document.querySelector(`#sci-tabs [data-tab="${it.panel}"]`); if (tab && tab.getAttribute('aria-selected') !== 'true') tab.click();
    const el = $(it.id); if (!el) return;
    setTimeout(() => { scrollToEl(el, -170); el.classList.add('flash'); setTimeout(() => el.classList.remove('flash'), 1800); }, 60);
  });

  /* ---------- волна Vanta, останавливается за пределами экрана ---------- */
  let fx = null;
  const startWaves = () => {
    if (fx || reduce || !window.VANTA || !window.THREE) return;
    try {
      fx = VANTA.WAVES({ el: '#waves', color: 0x0f3a30, shininess: 42, waveHeight: 16, waveSpeed: 0.55, zoom: 0.82,
        mouseControls: true, touchControls: true, gyroControls: false, minHeight: 200, minWidth: 200, scale: 1, scaleMobile: 1 });
    } catch (e) { fx = null; }
  };
  const stopWaves = () => { if (fx) { fx.destroy(); fx = null; } };
  if ('IntersectionObserver' in window) new IntersectionObserver(([e]) => e.isIntersecting ? startWaves() : stopWaves(), { threshold: 0.02 }).observe(document.querySelector('.hero'));
  else startWaves();

  /* ---------- вкладки в разделе «Наука» ---------- */
  function bindTabs() {
    const tabs = [...document.querySelectorAll('#sci-tabs button')];
    tabs.forEach((t) => t.addEventListener('click', () => {
      tabs.forEach((x) => x.setAttribute('aria-selected', String(x === t)));
      document.querySelectorAll('[data-panel]').forEach((p) => { p.hidden = p.dataset.panel !== t.dataset.tab; });
      const shown = document.querySelector(`[data-panel="${t.dataset.tab}"]`);
      if (window.gsap && !reduce) { gsap.fromTo(shown.children, { autoAlpha: 0, y: 16 }, { autoAlpha: 1, y: 0, duration: .5, stagger: .05, ease: 'power2.out' }); thumbsFx(shown); }
      if (window.ScrollTrigger) ScrollTrigger.refresh();
    }));
  }

  /* ---------- блик жидкого стекла за указателем ---------- */
  function bindGlass() {
    if (reduce || !matchMedia('(hover:hover)').matches) return;
    document.querySelectorAll('.glass').forEach((el) => {
      if (el.dataset.glass) return; el.dataset.glass = 1;
      el.addEventListener('pointermove', (e) => {
        const r = el.getBoundingClientRect();
        el.style.setProperty('--mx', `${e.clientX - r.left}px`); el.style.setProperty('--my', `${e.clientY - r.top}px`);
      });
    });
  }

  /* ---------- плавная прокрутка ---------- */
  const hasGsap = window.gsap && window.ScrollTrigger;
  let lenis = null;
  if (!reduce && window.Lenis) {
    lenis = new Lenis({ anchors: false, allowNestedScroll: true, autoRaf: !hasGsap });
    if (hasGsap) { lenis.on('scroll', ScrollTrigger.update); gsap.ticker.add((t) => lenis.raf(t * 1000)); gsap.ticker.lagSmoothing(0); }
  }
  if (hasGsap) gsap.registerPlugin(ScrollTrigger);
  const phone = matchMedia('(max-width:640px)');
  const scrollToEl = (el, offset = -150) => {
    if (!el) return;
    if (phone.matches && offset < 0) offset = offset + 60;   // на телефоне вкладки внизу: сверху только шапка
    // Lenis сам вычитает scroll-margin-top элемента — возвращаем его, чтобы отступ не считался дважды;
    // resize — высота страницы только что сменилась вместе с вкладкой
    if (lenis) { lenis.resize(); lenis.scrollTo(el, { offset: offset + (parseFloat(getComputedStyle(el).scrollMarginTop) || 0), duration: 1.1 }); }
    else scrollTo({ top: el.getBoundingClientRect().top + scrollY + offset, behavior: reduce ? 'auto' : 'smooth' });
  };

  /* ---------- вкладки разделов ---------- */
  const tabs = [...document.querySelectorAll('#tabbar [role="tab"]')];
  const ink = $('tab-ink');
  let currentTab = 'about', busy = false, stepsFx = false;
  function placeInk() {
    const t = tabs.find((x) => x.dataset.tab === currentTab); if (!t) return;
    ink.style.left = t.offsetLeft + 'px'; ink.style.width = t.offsetWidth + 'px';
    const bar = $('tabbar');            // прокрутка только внутри панели вкладок, страница не двигается
    if (bar.scrollWidth > bar.clientWidth) bar.scrollTo({ left: t.offsetLeft - (bar.clientWidth - t.offsetWidth) / 2, behavior: reduce ? 'auto' : 'smooth' });
  }
  function panelFx(panel) {
    if (!hasGsap || reduce) return;
    gsap.fromTo(panel.querySelectorAll('.reveal'), { autoAlpha: 0, y: 34, scale: 0.985 },
      { autoAlpha: 1, y: 0, scale: 1, duration: 0.8, stagger: 0.08, ease: 'power3.out', delay: 0.12, clearProps: 'transform' });
    gsap.fromTo(panel.querySelectorAll('.fill'), { scaleX: 0 }, { scaleX: 1, duration: 1.4, stagger: 0.08, ease: 'expo.out', delay: 0.35 });
    if (panel.id === 'science') { requestAnimationFrame(() => { layoutFan(true); thumbsFx(panel); diplomaFx(); }); }
    if (panel.id === 'cases' && !stepsFx) {
      stepsFx = true;
      gsap.fromTo('.steps .prog', { scaleY: 0 }, { scaleY: 1, ease: 'none', scrollTrigger: { trigger: '.steps', start: 'top 70%', end: 'bottom 60%', scrub: true } });
    }
  }
  function openTab(id, focus, scroll = true) {
    const inn = $(id); if (!inn || busy) return;
    const target = focus && focus !== inn ? focus : null;
    if (id === currentTab) { if (scroll) scrollToEl(target || $('stage')); return; }
    const out = $(currentTab);
    currentTab = id;
    tabs.forEach((t) => t.setAttribute('aria-selected', String(t.dataset.tab === id)));
    placeInk();
    try { history.replaceState(null, '', '#' + id); } catch (e) {}
    ymHit(id);
    const swap = () => {
      out.hidden = true; inn.hidden = false;
      if (hasGsap && !reduce) {
        gsap.fromTo(inn, { autoAlpha: 0, y: 26, clipPath: 'inset(0% 0% 100% 0%)' },
          { autoAlpha: 1, y: 0, clipPath: 'inset(0% 0% 0% 0%)', duration: 0.75, ease: 'power3.out', clearProps: 'clipPath,transform,opacity,visibility', onComplete: () => { busy = false; } });
        panelFx(inn); ScrollTrigger.refresh();
      } else busy = false;
      if (scroll) scrollToEl(target || $('stage'), target ? -170 : -150);
    };
    if (hasGsap && !reduce) { busy = true; gsap.to(out, { autoAlpha: 0, y: -14, duration: 0.24, ease: 'power2.in', onComplete: () => { gsap.set(out, { clearProps: 'all' }); swap(); } }); }
    else swap();
  }
  tabs.forEach((t) => t.addEventListener('click', () => openTab(t.dataset.tab)));
  $('tabbar').addEventListener('keydown', (e) => {
    const i = tabs.findIndex((t) => t.dataset.tab === currentTab);
    const j = e.key === 'ArrowRight' ? i + 1 : e.key === 'ArrowLeft' ? i - 1 : -1;
    if (j >= 0 && j < tabs.length) { e.preventDefault(); tabs[j].focus(); openTab(tabs[j].dataset.tab); }
  });
  addEventListener('resize', placeInk);
  // ссылки #about, #case-1, #steps… открывают нужную вкладку; #top — наверх
  document.addEventListener('click', (e) => {
    const a = e.target.closest('a[href^="#"]'); if (!a) return;
    const id = a.getAttribute('href').slice(1);
    if (!id || id === 'top') { e.preventDefault(); if (lenis) lenis.scrollTo(0, { duration: 1.1 }); else scrollTo({ top: 0, behavior: 'smooth' }); return; }
    const el = document.getElementById(id); if (!el) return;
    const panel = el.closest('.tabpanel'); e.preventDefault();
    if (panel) openTab(panel.id, el); else scrollToEl(el, el.dataset.offset != null ? +el.dataset.offset : -150);
  });

  function animate() {
    if (!hasGsap || reduce) return;
    gsap.utils.toArray('.count').forEach((el) => {
      const raw = el.dataset.to, to = num(raw); if (isNaN(to)) return;
      const dec = (raw.split(/[.,]/)[1] || '').length, o = { v: 0 };
      ScrollTrigger.create({ trigger: el, start: 'top 95%', once: true,
        onEnter: () => gsap.to(o, { v: to, duration: 1.6, ease: 'power2.out', onUpdate: () => { el.textContent = LANG === 'en' ? o.v.toFixed(dec) : o.v.toFixed(dec).replace('.', ','); } }) });
    });
    gsap.to('.hero-in', { yPercent: -12, autoAlpha: 0.2, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
    const fig = $('h-figure');
    if (fig && !fig.hidden) {
      gsap.from(fig, { autoAlpha: 0, y: 60, duration: 1.4, ease: 'power3.out', delay: 0.15 });
      gsap.to(fig, { yPercent: 6, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
      // на компьютере фото чуть следует за курсором
      if (matchMedia('(pointer:fine)').matches) {
        const qx = gsap.quickTo(fig, 'x', { duration: 1.2, ease: 'power3.out' }), qr = gsap.quickTo(fig, 'rotation', { duration: 1.2, ease: 'power3.out' });
        $('top').addEventListener('pointermove', (e) => { const k = e.clientX / innerWidth - 0.5; qx(k * 22); qr(k * 1.2); });
        $('top').addEventListener('pointerleave', () => { qx(0); qr(0); });
      }
    }
  }
  function startDx() {
    if (hasGsap && !reduce) {
      ScrollTrigger.create({ trigger: '#distraction', start: 'top top', end: () => '+=' + Math.round(innerHeight * 2.2), pin: true, anticipatePin: 1,
        invalidateOnRefresh: true, onUpdate: (st) => dxSet(st.progress) });
    } else {
      // без анимации: ползунок, который крутит аппарат вручную
      $('dx-range-wrap').hidden = false;
      const r = $('dx-range'); r.addEventListener('input', () => dxSet(r.value / 1000)); dxSet(r.value / 1000);
    }
  }
  function startTabs() {
    let hash = ''; try { hash = decodeURIComponent(location.hash.slice(1)); } catch (e) {}   // битая ссылка вида #% — просто без перехода
    const el = hash && hash !== 'preview' ? document.getElementById(hash) : null;
    const panel = el && el.closest('.tabpanel');
    placeInk();
    if (panel && panel.id !== 'about') openTab(panel.id, el, true);
    else if (panel) setTimeout(() => scrollToEl(el === panel ? $('stage') : el), 300);
    if (hasGsap && !reduce) panelFx($(currentTab));
  }

  /* ---------- пояснения к терминам ---------- */
  const tip = $('tip'); let cur = null, shownAt = 0;
  const show = (btn) => {
    const t = btn.dataset.meta ? { text: (CONTENT.meta || {}).metaNotice } : TERMS[btn.dataset.term]; if (!t || !t.text) return;
    if (cur && cur !== btn) cur.setAttribute('aria-expanded', 'false');
    cur = btn; shownAt = performance.now(); tip.innerHTML = '';
    if (t.title) { const b = document.createElement('b'); b.textContent = t.title; tip.append(b); }
    tip.append(document.createTextNode(t.text));
    if (btn.tagName !== 'A') btn.setAttribute('aria-expanded', 'true');
    const r = btn.getBoundingClientRect(), w = tip.offsetWidth, hh = tip.offsetHeight;
    let top = r.bottom + 10; if (top + hh > innerHeight - 12) top = Math.max(12, r.top - hh - 10);
    tip.style.left = Math.min(Math.max(16, r.left + r.width / 2 - w / 2), innerWidth - w - 16) + 'px'; tip.style.top = top + 'px'; tip.classList.add('on');
  };
  const hide = () => { tip.classList.remove('on'); if (cur) { cur.setAttribute('aria-expanded', 'false'); cur = null; } };
  function bindTerms() {
    document.querySelectorAll('.term').forEach((btn) => {
      if (btn.dataset.bound) return; btn.dataset.bound = 1;
      btn.setAttribute('aria-expanded', 'false'); btn.setAttribute('aria-describedby', 'tip');
      btn.addEventListener('click', (e) => { e.preventDefault(); e.stopPropagation(); cur === btn && performance.now() - shownAt > 400 ? hide() : show(btn); });
      btn.addEventListener('mouseenter', () => { if (matchMedia('(hover:hover)').matches) show(btn); });
      btn.addEventListener('mouseleave', () => { if (matchMedia('(hover:hover)').matches) hide(); });
      btn.addEventListener('focus', () => show(btn)); btn.addEventListener('blur', hide);
    });
  }
  /* Instagram везде на странице: слово получает «*», при наведении (на телефоне — при касании) всплывает
     пояснение о Meta из content.json → meta.metaNotice. Ссылки на Instagram остаются ссылками. */
  let metaTimer = 0;
  function markMeta() {
    const note = (CONTENT.meta || {}).metaNotice, desc = $('meta-desc');
    desc.textContent = note || '';
    if (!note) return;
    const skip = ['SCRIPT', 'STYLE', 'NOSCRIPT', 'TEXTAREA', 'TITLE'];
    const w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, { acceptNode: (n) =>
      /Instagram/.test(n.nodeValue) && !n.parentElement.closest('.meta-w,#tip,#meta-desc') && !skip.includes(n.parentElement.tagName)
        ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT });
    const nodes = []; for (let n; (n = w.nextNode());) nodes.push(n);
    nodes.forEach((n) => {
      const a = n.parentElement.closest('a');
      const frag = document.createDocumentFragment();
      n.nodeValue.split(/(Instagram)/).forEach((part) => {
        if (part !== 'Instagram') { if (part) frag.append(part); return; }
        const el = document.createElement(a ? 'span' : 'button');
        el.className = 'meta-w' + (a ? '' : ' meta-term');
        if (!a) { el.type = 'button'; bindMeta(el); }
        el.innerHTML = 'Instagram<span class="meta-star" aria-hidden="true">*</span>';
        frag.append(el);
      });
      n.replaceWith(frag);
      if (a) bindMeta(a);
    });
  }
  function bindMeta(el) {
    if (el.dataset.meta) return; el.dataset.meta = 1;
    el.setAttribute('aria-describedby', 'meta-desc');
    const link = el.tagName === 'A';
    if (!link) el.setAttribute('aria-expanded', 'false');
    // ссылка открывается как обычно; клик не всплывает до document, чтобы пояснение не закрылось сразу
    el.addEventListener('click', (e) => { e.stopPropagation(); if (link) return; e.preventDefault(); cur === el && performance.now() - shownAt > 400 ? hide() : show(el); });
    el.addEventListener('pointerdown', (e) => { if (link && e.pointerType !== 'mouse') { show(el); clearTimeout(metaTimer); metaTimer = setTimeout(hide, 6000); } });
    el.addEventListener('mouseenter', () => { if (matchMedia('(hover:hover)').matches) show(el); });
    el.addEventListener('mouseleave', () => { if (matchMedia('(hover:hover)').matches) hide(); });
    el.addEventListener('focus', () => show(el)); el.addEventListener('blur', hide);
  }
  document.addEventListener('click', hide);
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') hide(); });
  addEventListener('scroll', hide, { passive: true });

  /* ---------- загрузка: content.json; из админки приходит живой предпросмотр ---------- */
  // живой предпросмотр принимаем только от своей админки: тот же сайт и только из окна-родителя
  addEventListener('message', (e) => {
    // в админке предпросмотр изолирован (sandbox, «пустое» происхождение), поэтому сверяем адрес страницы, а не location.origin
    if (parent === window || e.source !== parent || e.origin !== new URL(location.href).origin) return;
    if (e.data && e.data.type === 'shapovalov:content' && e.data.content && typeof e.data.content === 'object') { PREVIEW = true; boot(e.data.content); if (hasGsap) ScrollTrigger.refresh(); }
  });
  let booted = false;
  /* ---------- Яндекс Метрика: включается номером счётчика в content.json (meta.metrika) ----------
     Не грузится только в предпросмотре админки (#preview). Внутри фрейма грузится: так Метрика показывает
     на сайте карту ссылок, кликов и скроллинга. Вебвизор выключен: записи действий посетителей не ведутся. */
  let YM = 0, YM_ID = '';
  /* Согласие на cookie Метрики (письмо РКН: аналитика — только с согласия). Выбор хранится в localStorage этого
     браузера: это технические данные, без них сайт не помнил бы ответ. До «Принять» скрипт Метрики не загружается. */
  const CK_KEY = 'ck-consent';
  const ckGet = () => { try { return localStorage.getItem(CK_KEY); } catch (e) { return null; } };
  const ckSet = (v) => { try { localStorage.setItem(CK_KEY, v); } catch (e) {} };
  const ckShow = (on) => { const b = $('ck'); if (b) b.hidden = !on; };
  function ckDropYm() {   // при отказе после согласия: удалить cookie Метрики (_ym_*) этого сайта
    document.cookie.split(';').map((c) => c.split('=')[0].trim()).filter((n) => n.startsWith('_ym')).forEach((n) => {
      for (const d of ['', '; domain=' + location.hostname, '; domain=.' + location.hostname.replace(/^www\./, '')]) document.cookie = n + '=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/' + d;
    });
  }
  function consentUi() {
    if (PREVIEW || !/^\d{5,12}$/.test(YM_ID)) return ckShow(false);
    const v = ckGet(); if (v === 'yes') metrika(YM_ID); else if (v !== 'no') ckShow(true);
  }
  $('ck-yes').addEventListener('click', () => { ckSet('yes'); ckShow(false); metrika(YM_ID); });
  $('ck-no').addEventListener('click', () => { const was = YM; ckSet('no'); ckShow(false); ckDropYm(); if (was) location.reload(); });
  $('ck-open').addEventListener('click', () => ckShow(true));
  function metrika(id) {
    if (YM || PREVIEW || ckGet() !== 'yes' || !/^\d{5,12}$/.test(String(id || ''))) return;
    YM = +id;
    window.ym = window.ym || function () { (window.ym.a = window.ym.a || []).push(arguments); }; window.ym.l = +new Date();
    // как в коде, который выдаёт Метрика для этого счётчика (tag.js?id=…, ssr, referrer, url); ecommerce и вебвизор не нужны
    const sc = document.createElement('script'); sc.async = true; sc.src = 'https://mc.yandex.ru/metrika/tag.js?id=' + YM; document.head.append(sc);
    window.ym(YM, 'init', { ssr: true, clickmap: true, trackLinks: true, accurateTrackBounce: true, referrer: document.referrer, url: location.href, webvisor: false });
    $('foot-ym').hidden = false;
  }
  // цели Метрики: кто с сайта пытался связаться. В Метрике их создают как «JavaScript-событие» с этими идентификаторами
  document.addEventListener('click', (ev) => {
    const a = ev.target.closest && ev.target.closest('a[href]'); if (!a || !YM || !window.ym) return;
    const u = a.getAttribute('href') || '';
    const g = /^tel:/.test(u) ? 'phone' : /^mailto:/.test(u) ? 'email' : /t\.me\//.test(u) ? 'telegram' : /instagram\.com/.test(u) ? 'instagram'
      : /(^|\/\/)(www\.)?(x|twitter)\.com/.test(u) ? 'x' : /prodoctorov/.test(u) ? 'prodoctorov' : '';
    if (g) window.ym(YM, 'reachGoal', g);
  }, true);
  // вкладки сайта считаются как отдельные страницы: видно, какие разделы смотрят
  const ymHit = (id) => { if (YM && window.ym) window.ym(YM, 'hit', location.pathname + '#' + id, { title: document.title + ' — ' + id }); };
  function boot(c) { render(c); i18nDom(document.body); markMeta(); YM_ID = String((c.meta || {}).metrika || '').trim(); consentUi(); if (booted) return; booted = true; animate(); startDx(); startTabs(); writeSignature(); }
  const ready = () => { if (parent !== window) parent.postMessage({ type: 'shapovalov:ready' }, '*'); };   // в сообщении нет ничего секретного
  const loadContent = (f) => fetch(f, { cache: 'no-store' }).then((r) => { if (!r.ok) throw new Error(r.status); return r.json(); });
  (LANG === 'en' ? loadContent('/content.en.json').catch(() => loadContent('/content.json')) : loadContent('/content.json')).then((c) => { boot(c); ready(); })
    .catch(() => { if (PREVIEW) return ready();   // предпросмотр получит текст из админки
      document.body.insertAdjacentHTML('afterbegin', '<p style="position:fixed;z-index:99;bottom:16px;left:16px;right:16px;padding:12px 16px;border-radius:12px;background:#2a2416;color:#e6c987;font-size:14px">Не удалось загрузить content.json. Откройте сайт через веб-сервер, а не как файл.</p>'); });
})();
