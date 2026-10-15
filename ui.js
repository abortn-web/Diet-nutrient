const WEIGHT_GRID = [45, 50, 55, 60, 65, 70, 75, 80, 85, 90, 95, 100, 105, 110, 115, 120];
const HEIGHT_GRID = [150, 155, 160, 165, 169, 172, 175, 178, 180, 185, 190, 195];
const AGE_GRID = [20, 25, 28, 30, 32, 35, 38, 40, 45, 50];
const STEPS_GRID = [2000, 4000, 6000, 8000, 10000, 12000, 14000, 16000, 18000, 20000];
const WEEKS_GRID = [4, 6, 8, 10, 12, 14, 16, 20, 24, 30, 36, 52];
const PROT_GRID = [1.4, 1.6, 1.8, 2.0, 2.2, 2.5];
const FAT_GRID = [0.7, 0.8, 0.9, 1.0, 1.2, 1.5];
const ICR_GRID = [0.5, 0.8, 1.0, 1.2, 1.5, 1.8, 2.0, 2.5];
const BG_PRESETS = [4.2, 5.5, 7.2, 9.0, 11.5, 14.0];

let breakthroughsList = [
  { yr: '2026', title: '🧬 Биоинженерные островковые клетки (VX-264)', desc: 'Новое поколение инкапсулированных бета-клеток в защитной мембране вырабатывает собственный инсулин без иммуносупрессии.' },
  { yr: '2026', title: '💧 «Умный» глюкозо-чувствительный инсулин (NNC2215)', desc: 'Инсулин с молекулярным переключателем: активируется при росте сахара и «засыпает» при снижении, защищая от гипогликемии.' },
  { yr: '2026', title: '🤖 Замкнутый контур с ИИ-прогнозированием', desc: 'Системы автодозирования учитывают пульс, шаги и БЖЕ, предотвращая скачки гликемии еще до их начала.' }
];

const LOGO_SVG = `<svg class="w-8 h-8 shrink-0 drop-shadow" viewBox="0 0 40 40" fill="none"><defs><linearGradient id="diaG" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse"><stop offset="0%" stop-color="#7C3AED"/><stop offset="55%" stop-color="#2DD4BF"/><stop offset="100%" stop-color="#F43F5E"/></linearGradient></defs><rect width="40" height="40" rx="12" fill="url(#diaG)"/><path d="M20 7C20 7 11 17.2 11 24C11 29 15 33 20 33C25 33 29 29 29 24C29 17.2 20 7 20 7Z" fill="rgba(255,255,255,0.18)" stroke="#fff" stroke-width="2" stroke-linejoin="round"/><path d="M13.5 23.5H16.5L18.2 19.5L21.2 27L23 23.5H26.5" stroke="#fff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/><circle cx="20" cy="14" r="1.6" fill="#2DD4BF"/></svg>`;

const IC_SPARK = `<svg class="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3l1.9 5.8a2 2 0 0 0 1.3 1.3L21 12l-5.8 1.9a2 2 0 0 0-1.3 1.3L12 21l-1.9-5.8a2 2 0 0 0-1.3-1.3L3 12l5.8-1.9a2 2 0 0 0 1.3-1.3L12 3z"/></svg>`;
const IC_REFRESH = `<svg class="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/><path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16"/><path d="M16 16h5v5"/></svg>`;
const IC_DOC = `<svg class="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect width="8" height="4" x="8" y="2" rx="1" ry="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><path d="M12 11h4"/><path d="M12 16h4"/><path d="M8 11h.01"/><path d="M8 16h.01"/></svg>`;

let currentStory = DIABETES_STORIES[0];
let currentSupport = DIABETES_SUPPORT_PHRASES[0];
let activeOpenDropdown = null;
let hypoBgInput = 3.3;

let aiModeEnabled = false;
let aiConnectionVerified = false;
let aiCheckingStatus = false;

let newsBoxOpen = false;
let aiTurnCounter = 0;
let showDiabetesToast = false;
let aiChatAnswer = '';
let subtractIobFromDps = false;
const aiAnswerCache = new Map();

function helpBtn(topicKey) {
  return `<span onclick="event.stopPropagation();showHelpTopic('${topicKey}')" class="inline-flex items-center justify-center w-4 h-4 rounded-full text-[10px] font-extrabold ml-1 cursor-pointer select-none shrink-0 shadow-sm" style="background:rgba(45,212,191,0.22);color:#2DD4BF;border:1px solid rgba(45,212,191,0.5);" title="Что это и как считать?">?</span>`;
}

function showHelpTopic(key) {
  const item = (typeof HELP_TOPICS !== 'undefined' && HELP_TOPICS[key]) ? HELP_TOPICS[key] : null;
  if (!item) return;
  const tEl = document.getElementById('help-modal-title');
  const bEl = document.getElementById('help-modal-text');
  if (tEl) tEl.innerHTML = item.title;
  if (bEl) bEl.innerHTML = item.html;
  const m = document.getElementById('modal-help');
  if (m) m.classList.remove('hidden');
}

function closeHelpModal() {
  const m = document.getElementById('modal-help');
  if (m) m.classList.add('hidden');
}

function toggleDropdown(id) {
  activeOpenDropdown = activeOpenDropdown === id ? null : id;
  renderApp();
}

async function verifyExternalAiConnection() {
  if (!navigator.onLine) return false;
  const key = (localStorage.getItem('nutricalc_gemini_key') || '').trim();
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 3200);

  try {
    if (key) {
      const resp = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key=${encodeURIComponent(key)}`, {
        method: 'POST',
        signal: ctrl.signal,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: 'Ответь одним словом: ОК' }] }],
          generationConfig: { maxOutputTokens: 10 }
        })
      });
      clearTimeout(timer);
      if (resp.ok) {
        const d = await resp.json();
        if (d?.candidates?.[0]?.content?.parts?.[0]?.text) return true;
      }
      return false;
    }

    const resp2 = await fetch('https://text.pollinations.ai/openai', {
      method: 'POST',
      signal: ctrl.signal,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'openai-fast',
        max_tokens: 10,
        messages: [{ role: 'user', content: 'ping' }]
      })
    });
    clearTimeout(timer);
    if (resp2.ok) {
      const d2 = await resp2.json();
      if (d2?.choices?.[0]?.message?.content) return true;
    }
    return false;
  } catch (e) {
    clearTimeout(timer);
    return false;
  }
}

async function toggleAiMode() {
  if (aiCheckingStatus) return;

  if (aiModeEnabled && aiConnectionVerified) {
    aiModeEnabled = false;
    aiConnectionVerified = false;
    localStorage.setItem('nutricalc_ai_mode', 'false');
    renderApp();
    openAiModal();
    return;
  }

  aiCheckingStatus = true;
  renderApp();
  openAiModal();

  const isAlive = await verifyExternalAiConnection();
  aiCheckingStatus = false;

  if (isAlive) {
    aiModeEnabled = true;
    aiConnectionVerified = true;
    localStorage.setItem('nutricalc_ai_mode', 'true');
  } else {
    aiModeEnabled = false;
    aiConnectionVerified = false;
    localStorage.setItem('nutricalc_ai_mode', 'false');
    const hasKey = !!(localStorage.getItem('nutricalc_gemini_key') || '').trim();
    alert(hasKey
      ? '⚠️ Не удалось подключиться к Gemini API. Проверьте правильность ключа или интернет-соединение (VPN). Кнопка AI оставлена в локальном режиме.'
      : '⚠️ Внешний AI-сервер сейчас недоступен или заблокирован вашей сетью. Введите персональный ключ Gemini API внизу окна или используйте локальный режим.');
    const det = document.getElementById('api-key-details');
    if (det) det.open = true;
  }

  renderApp();
  openAiModal();
}

async function callSmartAi(promptText, systemContext = '') {
  if (!navigator.onLine) {
    aiModeEnabled = false;
    aiConnectionVerified = false;
    return null;
  }
  const cacheKey = (systemContext + '|' + promptText).toLowerCase().trim();
  if (aiAnswerCache.has(cacheKey)) return aiAnswerCache.get(cacheKey);

  const key = (localStorage.getItem('nutricalc_gemini_key') || '').trim();
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 4000);
  const shortSys = systemContext || 'Ты клинический ментор DIAingo. Ответь на русском языке, коротко (2-4 предложения), научно и тепло. Без слова болезнь.';

  try {
    if (key) {
      const resp = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key=${encodeURIComponent(key)}`, {
        method: 'POST',
        signal: ctrl.signal,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: `${shortSys}\nВопрос пользователя: ${promptText}` }] }],
          generationConfig: { temperature: 0.5, maxOutputTokens: 240 }
        })
      });
      if (resp.ok) {
        const d = await resp.json();
        const t = d?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (t && t.trim().length > 10) {
          clearTimeout(timer);
          const clean = t.trim();
          aiAnswerCache.set(cacheKey, clean);
          return clean;
        }
      }
    }

    const resp2 = await fetch('https://text.pollinations.ai/openai', {
      method: 'POST',
      signal: ctrl.signal,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'openai-fast',
        temperature: 0.5,
        max_tokens: 240,
        messages: [
          { role: 'system', content: shortSys },
          { role: 'user', content: promptText }
        ]
      })
    });
    clearTimeout(timer);
    if (resp2.ok) {
      const d2 = await resp2.json();
      const t2 = d2?.choices?.[0]?.message?.content;
      if (t2 && t2.trim().length > 10) {
        const clean2 = t2.trim();
        aiAnswerCache.set(cacheKey, clean2);
        return clean2;
      }
    }
  } catch (e) {
    clearTimeout(timer);
  }

  aiModeEnabled = false;
  aiConnectionVerified = false;
  return null;
}

function getInstantMentorAnswer(q, p, m, dayPlan) {
  const ql = q.toLowerCase().replace(/ё/g, 'е');

  if (ql.includes('гипер') || ql.includes('высок') || ql.includes('сбить') || ql.includes('дпс') || ql.includes('скач') || ql.includes('прыг') || ql.includes('большой сахар')) {
    return {
      matched: true,
      html: `<strong>📈 Что такое гипергликемия и как снизить высокий сахар:</strong><br><strong>Гипергликемия</strong> — это повышение уровня глюкозы в крови выше целевой нормы (обычно <strong>выше 7.0 ммоль/л натощак</strong> или <strong>выше 8.5–9.0 ммоль/л после еды</strong>).<br>• <strong>Почему возникает:</strong> нехватка болюсного или базального инсулина, промах с подсчетом ХЕ, малая пауза перед быстрыми углеводами или стресс.<br>• <strong>Как безопасно сколоть (ДПС):</strong> используйте ваш ФЧИ (~${dayPlan.effectiveIsf} ммоль/л на 1 ЕД): <code>(Текущий ГК − ${p.targetBg}) / ${dayPlan.effectiveIsf}</code>. При сахаре ≥ 11 ммоль/л пейте больше воды и не делайте повторных подколок чаще чем раз в 3 часа!`
    };
  }

  if (ql.includes('гипо') || /\bгип(а|ы|е|у|ой)\b/.test(ql) || ql.includes('низк') || ql.includes('падает') || ql.includes('упал') || ql.includes('тряс')) {
    return {
      matched: true,
      html: `<strong>🆘 Что такое гипогликемия (низкий сахар &lt; 4.0 ммоль/л):</strong><br><strong>Гипогликемия</strong> — это падение уровня сахара в крови ниже <strong>3.9 ммоль/л</strong>, когда мозгу не хватает быстрой энергии (появляется дрожь, потливость, голод, слабость).<br>• <strong>Правило 15/15:</strong> немедленно примите <strong>${computeHypoRescue(3.3, p).fastCarbGrams} г быстрых углеводов</strong> БЕЗ жира (сок, декстроза, теплая вода с сахаром) и перемерьте сахар через 15 минут. Шоколад, мороженое и бутерброды при гипе не подходят — жиры задержат подъем сахара!`
    };
  }

  if (ql.includes('что такое диабет') || (ql.includes('диабет') && (ql.includes('это') || ql.includes('тип') || ql.includes('отлич') || ql.includes('почем')))) {
    return {
      matched: true,
      html: `<strong>💎 Что такое сахарный диабет:</strong><br>Это состояние обмена веществ, при котором глюкоза из пищи не может самостоятельно попасть в клетки без инсулина.<br>• <strong>СД 1 типа:</strong> поджелудочная не вырабатывает свой инсулин, поэтому мы вводим базу (~${dayPlan.effectiveBasal} ЕД) и болюс на еду (по УК ~${p.icr}).<br>• <strong>СД 2 типа:</strong> свой инсулин есть, но клетки хуже его чувствуют — здесь помогают контроль калорий (${m.effectiveKcal} ккал), движение и низкий ГИ.`
    };
  }

  if (ql.includes('инсулин') || ql.includes('болюс') || ql.includes('база') || ql.includes('базал') || ql.includes('укол') || ql.includes('пауз')) {
    return {
      matched: true,
      html: `<strong>💧 Как работает инсулин и паузы:</strong><br>• <strong>Базальный (ночной):</strong> держит ровный сахар натощак и между едой (ваша расчетная норма ~${dayPlan.effectiveBasal} ЕД).<br>• <strong>Болюсный (пищевой):</strong> компенсирует углеводы (УК ~${p.icr}) и снижает повышенный сахар (1 ЕД снижает на ~${dayPlan.effectiveIsf} ммоль/л). Перед быстрыми углеводами нужна пауза 10–15 мин, а при жирной еде укол делят на 2 части.`
    };
  }

  if (ql.includes('утр') || ql.includes('зар') || ql.includes('тощак') || ql.includes('ноч')) {
    return {
      matched: true,
      html: `<strong>🌅 Почему растет сахар утром («утренняя заря»):</strong><br>С 4 до 8 утра организм выбрасывает гормоны пробуждения (кортизол, гормон роста), которые снижают чувствительность к инсулину. Поэтому утренний УК в DIAingo автоматически увеличен на ×1.15 (до <strong>${+(p.icr*1.15).toFixed(2)} ЕД/ХЕ</strong>), а вечером снижен на ×0.90 (до <strong>${+(p.icr*0.9).toFixed(2)} ЕД/ХЕ</strong>).`
    };
  }

  if (ql.includes('пицц') || ql.includes('жир') || ql.includes('бургер') || ql.includes('шашлык') || ql.includes('стейк') || ql.includes('мяс') || ql.includes('бже') || ql.includes('белок') || ql.includes('белки') || ql.includes('рыб') || ql.includes('сыр') || ql.includes('пельмен') || ql.includes('плов') || ql.includes('суши') || ql.includes('ролл')) {
    return {
      matched: true,
      html: `<strong>🍕 Жиры, белки и сложные блюда (БЖЕ):</strong><br>Жиры (от 25 г) тормозят всасывание углеводов, а белки (от 30 г) через 2–4 часа превращаются в печени в глюкозу. Если уколоть весь инсулин сразу до еды — можно словить гипу в 1-й час, а через 3 часа получить скачок сахара. Решение: делите болюс на 2 волны (до еды и через 60–120 мин после).`
    };
  }

  if (ql.includes('спорт') || ql.includes('тренир') || ql.includes('шаг') || ql.includes('бег') || ql.includes('зал') || ql.includes('активн')) {
    return {
      matched: true,
      html: `<strong>🏋️ Спорт и физическая активность:</strong><br>Кардио и долгая ходьба ускоряют кровоток и усиливают работу инсулина в 1.5–2 раза. Если тренировка идет на активном болюсе, уменьшите дозу инсулина на еду перед залом на 25–30% или съешьте 1 ХЕ медленных углеводов без подколки.`
    };
  }

  if (ql.includes('алког') || ql.includes('вин') || ql.includes('пив') || ql.includes('праздн')) {
    return {
      matched: true,
      html: `<strong>🍷 Алкоголь и контроль гликемии:</strong><br>Пока печень расщепляет алкоголь, она блокирует фоновый выброс гликогена в кровь — это создает риск отсроченной ночной гипогликемии. Не колите инсулин на крепкий алкоголь и сухое вино, а перед сном съешьте 1 ХЕ сложных углеводов.`
    };
  }

  if (ql.includes('похуд') || ql.includes('вес') || ql.includes('калор') || ql.includes('дефицит') || ql.includes('сушк') || ql.includes('диет')) {
    return {
      matched: true,
      html: `<strong>⚖️ Снижение веса и КБЖУ:</strong><br>Ваш базовый обмен (BMR) — <strong>${m.bmr} ккал</strong>, расход с активностью (TDEE) — <strong>${m.tdee} ккал</strong>. Для достижения цели (${p.targetWeight} кг) безопасная норма — <strong>${m.effectiveKcal} ккал/сут</strong> (Б:${m.normP}г, Ж:${m.normF}г, У:${m.normC}г). При снижении веса чувствительность к инсулину растет, поэтому проверяйте УК и базу!`
    };
  }

  if (ql.includes('хе') || ql.includes('хлебн') || ql.includes('углевод') || ql.includes('фчи') || ql.includes('ук') || ql.includes('коэф') || ql.includes('гликемич')) {
    return {
      matched: true,
      html: `<strong>🍞 ХЕ, УК и ФЧИ по вашему профилю:</strong><br>• <strong>1 ХЕ = 12 г углеводов</strong> (ваша суточная норма — ${m.normC} г = ${m.totalXE} ХЕ).<br>• <strong>УК (Углеводный коэффициент):</strong> ${p.icr} ЕД на 1 ХЕ.<br>• <strong>ФЧИ (Чувствительность):</strong> 1 ЕД инсулина снижает сахар на <strong>${dayPlan.effectiveIsf} ммоль/л</strong>.`
    };
  }

  return {
    matched: false,
    html: `<strong>💡 Ориентир DIAingo по вашему вопросу («${q}»):</strong><br>Ваша суточная норма — <strong>${m.effectiveKcal} ккал</strong> (Б:${m.normP}г, Ж:${m.normF}г, У:${m.normC}г / ${m.totalXE} ХЕ), чувствительность ФЧИ — <strong>1 ЕД = -${dayPlan.effectiveIsf} ммоль/л</strong>, ночная база — <strong>~${dayPlan.effectiveBasal} ЕД</strong>.<br><span class="text-[10px] opacity-80">Нажмите кнопку <strong>«✨ AI»</strong> в шапке окна, чтобы подключить внешнюю нейросеть для свободных вопросов!</span>`
  };
}

function setMealTime(slot) {
  mealTimeSlot = slot;
  mealBolus.customEdited = false;
  const p = getProf(), m = computeMetrics(), dayPlan = computeDailyInsulinPlan(m, p);
  const found = dayPlan.splits.find(x => x.slot === slot) || dayPlan.splits[1];
  if (found) {
    mealBolus.p = found.pG;
    mealBolus.f = found.fG;
    mealBolus.c = found.cG;
  }
  renderApp();
}

function adjustCurrBg(delta) {
  const p = getProf();
  const base = (mealBolus.currBg !== '' && !isNaN(parseFloat(mealBolus.currBg))) ? parseFloat(mealBolus.currBg) : p.targetBg;
  const next = Math.max(2.0, Math.min(30.0, +(base + delta).toFixed(1)));
  mealBolus.currBg = next;
  renderApp();
}

// ВЫВЕРЕННЫЙ РАСЧЕТ ВРЕМЕНИ УКОЛОВ И ДОЗ БЕЗ ЛОГИЧЕСКИХ ПРОТИВОРЕЧИЙ
function computeMealBolusWithTime(pGrams, fGrams, cGrams, p, dayPlan, iobData) {
  const ins = INSULIN_TYPES.find(x => x.id === p.insulinType) || INSULIN_TYPES[1];
  const xe = +(cGrams / 12).toFixed(1);
  const fpKcal = Math.round(pGrams * 4 + fGrams * 9);
  const bje = +(fpKcal / 100).toFixed(1);
  const isZeroFood = pGrams === 0 && fGrams === 0 && cGrams === 0;

  let timeMult = 1.0;
  if (mealTimeSlot === 'morning') timeMult = 1.15;
  else if (mealTimeSlot === 'lunch') timeMult = 1.00;
  else if (mealTimeSlot === 'evening') timeMult = 0.90;
  else if (mealTimeSlot === 'night') timeMult = 0.95;

  const effIcr = +(p.icr * timeMult).toFixed(2);
  const rawCarbU = +(xe * effIcr).toFixed(2);
  const bjeFactor = (fGrams >= 30 && cGrams >= 25) ? 0.55 : 0.50;
  const rawBjeU = bje >= 1.0 ? +(bje * effIcr * bjeFactor).toFixed(2) : 0;

  const isf = (dayPlan && dayPlan.effectiveIsf > 0) ? dayPlan.effectiveIsf : 2.5;
  let rawDps = 0, safeDps = 0, iobSubtracted = 0, hyperResistMult = 1.0;

  const hasBg = mealBolus.currBg !== '' && !isNaN(parseFloat(mealBolus.currBg));
  const bgVal = hasBg ? parseFloat(mealBolus.currBg) : null;
  const isHypoNow = hasBg && bgVal < 4.2;
  const isHighBg = hasBg && bgVal > p.targetBg + 0.4;
  const isSevereHyper = hasBg && bgVal >= 13.0;

  let roundCtx = (mealTimeSlot === 'evening' || mealTimeSlot === 'night') ? 'hypo_risk' : 'normal';
  if (hasBg && bgVal < 4.8) roundCtx = 'hypo_risk';
  else if (hasBg && bgVal >= 6.8) roundCtx = 'hyper';

  if (hasBg && bgVal > 0) {
    const diffBg = bgVal - p.targetBg;
    if (bgVal >= 13.5) hyperResistMult = 1.20;
    else if (bgVal >= 11.0) hyperResistMult = 1.12;

    rawDps = +((diffBg / isf) * hyperResistMult).toFixed(2);

    if (rawDps > 0) {
      const activeIob = (subtractIobFromDps && iobData) ? iobData.totalIob : 0;
      safeDps = Math.max(0, +(rawDps - activeIob).toFixed(2));
      iobSubtracted = +(rawDps - safeDps).toFixed(1);
    } else if (diffBg < -0.3) {
      safeDps = +rawDps.toFixed(2);
    }
  }

  // Эффект пиццы включается ТОЛЬКО когда жиров реально много и по массе (>=28г), и по отношению к углеводам (>=35%)
  const fatToCarbRatio = cGrams > 0 ? (fGrams / cGrams) : 1.0;
  const isPizzaEffect = !ins.coversBJE && fGrams >= 28 && cGrams >= 24 && fatToCarbRatio >= 0.35 && (!hasBg || bgVal < 9.0);
  const delayedCarbShare = isPizzaEffect ? (fGrams >= 40 ? 0.30 : 0.25) : 0;
  const rawDelayedCarb = +(rawCarbU * delayedCarbShare).toFixed(2);
  const rawUpfrontCarb = +(rawCarbU - rawDelayedCarb).toFixed(2);

  const splitWaves = (rawBjeU >= 0.35 || rawDelayedCarb >= 0.35) && !ins.coversBJE && !isZeroFood;
  const rawPre = isHypoNow && isZeroFood ? 0 : Math.max(0, (splitWaves ? rawUpfrontCarb : (rawCarbU + rawBjeU)) + safeDps);
  const rawPost = splitWaves ? (rawBjeU + rawDelayedCarb) : 0;

  const preUnits = roundSmartInsulin(rawPre, p.insulinStep, roundCtx);
  const postUnits = roundSmartInsulin(rawPost, p.insulinStep, roundCtx);
  const totalUnits = +(preUnits + postUnits).toFixed(1);
  const upfrontCarbUnits = roundSmartInsulin(rawUpfrontCarb, p.insulinStep, roundCtx);
  const delayedCarbUnits = roundSmartInsulin(rawDelayedCarb, p.insulinStep, roundCtx);
  const bjeUnits = roundSmartInsulin(rawBjeU, p.insulinStep, roundCtx);
  const dpsRounded = safeDps >= 0 ? roundSmartInsulin(safeDps, p.insulinStep, 'hyper') : -roundSmartInsulin(Math.abs(safeDps), p.insulinStep, 'normal');
  const waveHours = bje < 1 ? 0 : (bje < 2 ? 3 : (bje < 3 ? 4 : (fGrams >= 35 ? 6 : 5)));

  // ВЫВЕРЕННАЯ ЛОГИКА ВРЕМЕНИ 1-ГО УКОЛА (ПАУЗЫ) С УЧЕТОМ ПРОПОРЦИИ ЖИРОВ К УГЛЕВОДАМ
  let waitMin = ins.baseWait; // 3 мин (сверхбыстрый), 12 мин (ультра), 25 мин (короткий)
  if (mealBolus.gi === 'low') waitMin -= (ins.id === 'ultrafast' ? 4 : 6);
  else if (mealBolus.gi === 'high') waitMin += (ins.id === 'ultrafast' ? 5 : 7);

  if (mealTimeSlot === 'morning') waitMin += 3;
  else if (mealTimeSlot === 'evening' || mealTimeSlot === 'night') waitMin -= 2;

  // При большой углеводной нагрузке (>= 60 г угл.) и умеренных жирах (< 30% от углеводов) нужна уверенная пауза до еды!
  if (cGrams >= 60 && fatToCarbRatio < 0.30 && mealBolus.gi !== 'low') {
    waitMin += 3;
  }

  // Поправка на высокий сахар (+2..4 мин на каждый ммоль превышения)
  let extraHyperWait = 0;
  if (hasBg && bgVal > 6.8) {
    const excessMmol = bgVal - 6.5;
    const minPerMmol = ins.id === 'ultrafast' ? 2.0 : (ins.id === 'ultralong' ? 3.2 : 4.0);
    extraHyperWait = Math.min(30, Math.round(excessMmol * minPerMmol));
    waitMin += extraHyperWait;
  }

  // Жиры гасят паузу ТОЛЬКО если их доля существенна по отношению к углеводам (fatToCarbRatio >= 0.35) и сахар не высокий!
  if (!hasBg || bgVal < 8.5) {
    if (fGrams >= 35 && fatToCarbRatio >= 0.45) waitMin -= 8;
    else if (fGrams >= 25 && fatToCarbRatio >= 0.35) waitMin -= 4;
  }

  let preHeaderTitle = `1️⃣ ПЕРЕД ЕДОЙ (УК ~${effIcr})`;
  let dynamicWaitText = ins.preMin;

  if (isHypoNow) {
    preHeaderTitle = `1️⃣ ПОСЛЕ КУПИРОВАНИЯ ГИПЫ (УК ~${effIcr})`;
    dynamicWaitText = '🚨 СНАЧАЛА купируйте низкий сахар! Укол только ПОСЛЕ начала еды и подъема ГК';
  } else if (isZeroFood && isHighBg) {
    preHeaderTitle = `1️⃣ ЧИСТАЯ КОРРЕКЦИЯ ДПС`;
    dynamicWaitText = '💉 Укол сейчас (без еды). Контрольный замер сахара через 2 часа';
  } else if (isSevereHyper) {
    dynamicWaitText = `🚨 Сахар высокий (${bgVal})! Уколите ${preUnits} ЕД сейчас и выждите паузу ~${Math.max(25, waitMin)}–${Math.max(30, waitMin + 10)} мин ДО еды`;
  } else if (hasBg && bgVal >= 8.5) {
    dynamicWaitText = `⏳ Увеличенная пауза ~${Math.max(12, waitMin)}–${Math.max(16, waitMin + 4)} мин ДО еды (учтен высокий сахар ${bgVal} ммоль/л)`;
  } else if (cGrams === 0 && (pGrams > 0 || fGrams > 0)) {
    preHeaderTitle = `1️⃣ БЕЗ УГЛЕВОДОВ (УК ~${effIcr})`;
    dynamicWaitText = preUnits > 0 ? 'В начале еды (только коррекция ДПС)' : 'Перед едой укол не требуется (0 г углеводов)';
  } else if (waitMin <= 0) {
    preHeaderTitle = `1️⃣ В НАЧАЛЕ / ВО ВРЕМЯ ЕДЫ (УК ~${effIcr})`;
    dynamicWaitText = mealBolus.gi === 'low'
      ? 'Колите в середине или сразу после еды (медленные углеводы с низким ГИ)'
      : 'Колите прямо в начале еды без паузы (высокая доля жиров замедлит всасывание)';
  } else if (waitMin <= 4) {
    dynamicWaitText = `За 3–5 мин ДО еды (ГИ: ${mealBolus.gi === 'low' ? 'низкий' : mealBolus.gi === 'high' ? 'высокий' : 'средний'})`;
  } else {
    dynamicWaitText = `Пауза ~${waitMin}–${waitMin + 4} мин ДО еды (ГИ: ${mealBolus.gi === 'low' ? 'низкий' : mealBolus.gi === 'high' ? 'высокий' : 'средний'})`;
  }

  // СИНХРОНИЗИРОВАННЫЙ ТАЙМИНГ 2-ГО УКОЛА И ОБЪЯСНЕНИЯ (БЕЗ ПРОТИВОРЕЧИЙ!)
  let postTimingText = 'не требуется';
  let postExplainTiming = 'через 90–120 мин';
  const isProteinDominant = pGrams >= 30 && !isPizzaEffect;

  if (splitWaves) {
    if (isPizzaEffect) {
      // Когда перенесены углеводы из-за жира — колоть нужно раньше (через 60–75 мин)
      postTimingText = 'через 60–75 мин ПОСЛЕ еды (на задержанные жиром угл. + БЖЕ)';
      postExplainTiming = 'через 60–75 мин';
    } else if (isProteinDominant) {
      // Когда все углеводы уколоты в 1-ю волну, а во 2-й волне идет белковый глюконеогенез:
      // Белок начинает поднимать сахар с 90-120 минуты (пик на 2-4 часу).
      // Для сверхбыстрого инсулина колем через 100-120 мин, для ультракороткого — через 90-120 мин!
      postTimingText = ins.id === 'ultrafast'
        ? 'через 100–120 мин (1.5–2 ч) ПОСЛЕ еды — к началу белкового выброса'
        : 'через 90–120 мин (1.5–2 ч) ПОСЛЕ еды — к началу белкового выброса';
      postExplainTiming = ins.id === 'ultrafast' ? 'через 100–120 мин (1.5–2 ч)' : 'через 90–120 мин (1.5–2 ч)';
    } else {
      postTimingText = 'через 75–90 мин ПОСЛЕ еды (на жировую волну БЖЕ)';
      postExplainTiming = 'через 75–90 мин';
    }
  }

  const kineticAlerts = [];
  if (isHypoNow) {
    kineticAlerts.push(`🚨 <strong>Гипогликемия (${bgVal} ммоль/л):</strong> Болюс на еду уменьшен на <strong>${Math.abs(dpsRounded)} ЕД</strong>. Сначала примите быстрые углеводы (кнопка «Гипо» внизу экрана), дождитесь подъема ГК выше 5.0 ммоль/л и только затем колите уменьшенную дозу.`);
  } else if (isSevereHyper) {
    kineticAlerts.push(`🔥 <strong>Высокая гипергликемия (${bgVal} ммоль/л):</strong> При сахаре ≥ 13 ммоль/л возникает инсулинорезистентность (учтен коэф. ×${hyperResistMult}). В 1-й укол включена ДПС <strong>+${dpsRounded} ЕД</strong>. <strong>Рекомендация:</strong> сделайте паузу ${Math.max(25, waitMin)} мин перед едой, чтобы инсулин начал снижать сахар до приема углеводов!`);
  } else if (isHighBg) {
    kineticAlerts.push(`📈 <strong>Повышенный сахар перед едой (${bgVal} ммоль/л):</strong> К болюсу на еду добавлена коррекция (ДПС) <strong>+${dpsRounded} ЕД</strong> для возврата к цели ${p.targetBg} ммоль/л${extraHyperWait > 0 ? `, а пауза до еды увеличена на +${extraHyperWait} мин` : ''}.`);
  }

  if (isPizzaEffect) {
    kineticAlerts.push(`🍕 <strong>Эффект жирной пищи (${fGrams}г жиров на ${cGrams}г угл.):</strong> Высокая доля жиров затормозит всасывание углеводов. Чтобы избежать гипы в 1-й час, <strong>${delayedCarbUnits} ЕД</strong> из углеводной дозы перенесено во 2-й укол (${postExplainTiming} после еды).`);
  }

  if (pGrams >= 30 && bjeUnits > 0) {
    kineticAlerts.push(`🥩 <strong>Белковый «дострел» (${pGrams}г белка + ${fGrams}г жиров = ${bje} БЖЕ):</strong> Белки и жиры усваиваются 4–5 часов, а через 1.5–2 часа печень начнет превращать часть аминокислот в глюкозу (глюконеогенез). Поэтому 2-й укол (<strong>${bjeUnits} ЕД</strong> на БЖЕ) ставится <strong>${postExplainTiming} после еды</strong>, чтобы его пик точно совпал с белковым подъемом сахара.`);
  }

  return {
    ins, xe, fpKcal, bje, upfrontCarbUnits, delayedCarbUnits, bjeUnits,
    totalUnits, preUnits, postUnits, splitWaves, waveHours, effIcr, isf, hasBg, bgVal,
    rawDps: +rawDps.toFixed(2), safeDps: +safeDps.toFixed(2), dpsRounded,
    iobSubtracted, hyperResistMult, preHeaderTitle, dynamicWaitText, postTimingText, kineticAlerts, isHighBg, isHypoNow
  };
}

function blurOnEnter(e) {
  if (e.key === 'Enter') e.target.blur();
}

function buildWeightSvgChart(checkpoints) {
  const wVals = checkpoints.map(c => c.w);
  const minW = Math.min(...wVals) - 1.5, maxW = Math.max(...wVals) + 1.5;
  const range = Math.max(2, maxW - minW), width = 320, height = 95, padX = 28, padY = 20;
  const pts = checkpoints.map((c, idx) => ({
    ...c,
    x: Math.round(padX + (idx / (checkpoints.length - 1)) * (width - padX * 2)),
    y: Math.round(height - padY - ((c.w - minW) / range) * (height - padY * 2))
  }));
  return `<svg viewBox="0 0 ${width} ${height}" class="w-full h-24 overflow-visible"><polyline fill="none" stroke="var(--brand)" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" points="${pts.map(p => `${p.x},${p.y}`).join(' ')}" />${pts.map(pt => `<circle cx="${pt.x}" cy="${pt.y}" r="4.5" fill="var(--brand)" stroke="#fff" stroke-width="1.5" /><text x="${pt.x}" y="${pt.y - 8}" text-anchor="middle" fill="currentColor" font-size="9.5" font-weight="800">${pt.w}кг</text><text x="${pt.x}" y="${height - 3}" text-anchor="middle" fill="currentColor" opacity="0.7" font-size="8.5">${pt.date}</text>`).join('')}</svg>`;
}

function getShortInsulinLabel(id) {
  if (id === 'ultrafast') return '⚡ Сверхбыстрый инсулин';
  if (id === 'ultralong') return '🚀 Ультракороткий инсулин';
  return '⏱ Короткий (Регуляр)';
}

function renderApp() {
  const p = getProf(), m = computeMetrics();
  document.documentElement.setAttribute('data-gender', p.gender);
  const dayPlan = computeDailyInsulinPlan(m, p);
  const iobData = computeActiveIOB(p);
  const bolus = computeMealBolusWithTime(mealBolus.p, mealBolus.f, mealBolus.c, p, dayPlan, iobData);
  const mealKcal = Math.round(mealBolus.p * 4 + mealBolus.f * 9 + mealBolus.c * 4);
  const hypoRescue = computeHypoRescue(hypoBgInput, p);

  const diffKg = +(p.targetWeight - p.weight).toFixed(1), totalDays = p.targetWeeks * 7;
  const finishDate = formatDateOffset(totalDays);
  const checkpoints = [0, 0.25, 0.5, 0.75, 1].map((pct) => {
    const w = +(p.weight + diffKg * pct).toFixed(1);
    return { w, date: formatDateOffset(totalDays * pct) };
  });

  const extra3kKcal = Math.round(((p.height * 0.415) / 100000) * 3000 * p.weight * 0.62);
  const recProt = p.diabetesType !== 'none' ? 1.7 : (p.gender === 'female' ? 1.8 : 2.0);
  const recFat = p.gender === 'female' ? 0.95 : 0.9;
  const isTooStrict = m.targetKcal < m.minSafe;
  const safeWeeks = Math.max(4, Math.ceil(Math.abs(diffKg * 7700) / (Math.max(250, m.tdee - m.minSafe) * 7)));
  const isOpen = (sec) => p.sectionsOpen[sec] !== false;
  const isAiTrulyActive = aiModeEnabled && aiConnectionVerified;

  document.getElementById('app').innerHTML = `
    <!-- HEADER WITH DIAingo LOGO -->
    <header class="sticky top-0 z-30 px-3 pt-2.5 pb-1.5">
      <div class="max-w-7xl mx-auto glass-card rounded-2xl px-3 py-2 flex items-center justify-between gap-2 shadow-lg border border-white/10">
        <div class="flex items-center gap-2.5 min-w-0 shrink-0">
          ${LOGO_SVG}
          <div class="font-extrabold text-base sm:text-lg tracking-tight leading-none whitespace-nowrap">
            <span>DIA</span><span style="color:#2DD4BF;">ingo</span>
          </div>
        </div>
        <div class="inline-flex items-center gap-1 p-1 rounded-xl theme-input shrink-0">
          <button onclick="switchProfile('p1')" class="h-7 px-3 rounded-lg text-xs font-extrabold whitespace-nowrap transition ${appData.activeProfile==='p1'?'theme-grad text-white shadow':'opacity-75'}">♂ Профиль 1</button>
          <button onclick="switchProfile('p2')" class="h-7 px-3 rounded-lg text-xs font-extrabold whitespace-nowrap transition ${appData.activeProfile==='p2'?'theme-grad text-white shadow':'opacity-75'}">♀ Профиль 2</button>
        </div>
      </div>
    </header>

    <div class="max-w-7xl mx-auto px-3 pt-1.5 lg:hidden">
      <div class="grid grid-cols-2 gap-1.5 p-1 rounded-2xl glass-card">
        <button onclick="activeTab='calc';showDiabetesToast=false;renderApp();" class="py-2.5 rounded-xl text-xs font-extrabold whitespace-nowrap transition ${activeTab==='calc'?'theme-grad text-white shadow':'opacity-75'}">✨ КБЖУ и План</button>
        <button onclick="activeTab='diabetes';showDiabetesToast=true;renderApp();" class="py-2.5 rounded-xl text-xs font-extrabold whitespace-nowrap transition ${activeTab==='diabetes'?'theme-grad text-white shadow':'opacity-75'}">💧 Калькулятор Диабета</button>
      </div>
    </div>

    <main class="max-w-7xl mx-auto px-3 pt-3.5 pb-28 grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
      <section class="lg:col-span-6 space-y-4 ${activeTab==='diabetes'?'hidden lg:block':''}">
        
        <!-- BLOCK 1: PARAMS -->
        <div class="glass-card rounded-3xl p-4 space-y-3.5 shadow-lg">
          <div class="flex justify-between items-center gap-2 cursor-pointer select-none" onclick="toggleSection('p1')">
            <h2 class="font-extrabold text-sm sm:text-base flex items-center gap-1.5 min-w-0"><span class="truncate">1. Ваши параметры</span><span class="text-xs opacity-60 shrink-0">${isOpen('p1')?'▴':'▾'}</span></h2>
            <span class="text-[11px] px-2.5 py-1 rounded-xl theme-soft font-bold whitespace-nowrap shrink-0">${p.weight} кг · ИМТ ${m.bmi}</span>
          </div>
          ${isOpen('p1') ? `
            <div class="space-y-3.5 pt-1">
              <div class="grid grid-cols-2 gap-2"><button onclick="setParam('gender','female')" class="py-2.5 px-3 rounded-2xl text-xs font-bold border transition ${p.gender==='female'?'theme-grad text-white border-transparent shadow-md':'theme-input opacity-80'}">♀ Женщина</button><button onclick="setParam('gender','male')" class="py-2.5 px-3 rounded-2xl text-xs font-bold border transition ${p.gender==='male'?'theme-grad text-white border-transparent shadow-md':'theme-input opacity-80'}">♂ Мужчина</button></div>

              <div class="p-3 rounded-2xl theme-input space-y-2 cursor-pointer" onclick="toggleDropdown('age')">
                <div class="flex justify-between items-center"><span class="text-xs font-bold opacity-80">ВОЗРАСТ (ЛЕТ)</span><div class="flex items-center gap-1.5" onclick="event.stopPropagation()"><button onclick="setParam('age',${p.age-1})" class="w-8 h-8 rounded-xl theme-soft font-bold">-</button><input type="text" value="${p.age}" onchange="setParam('age',this.value)" onkeydown="blurOnEnter(event)" class="w-14 h-8 text-center font-mono-num font-extrabold text-sm rounded-xl theme-soft"><button onclick="setParam('age',${p.age+1})" class="w-8 h-8 rounded-xl theme-soft font-bold">+</button></div></div>
                ${activeOpenDropdown==='age'?`<div class="grid grid-cols-5 gap-1.5 pt-2 border-t border-white/10" onclick="event.stopPropagation()">${AGE_GRID.map(a=>`<button onclick="setParam('age',${a});toggleDropdown('age');" class="py-1.5 rounded-xl text-xs font-mono-num font-bold ${p.age===a?'theme-grad text-white':'theme-soft'}">${a}</button>`).join('')}</div>`:''}
              </div>

              <div class="p-3 rounded-2xl theme-input space-y-2 cursor-pointer" onclick="toggleDropdown('height')">
                <div class="flex justify-between items-center"><span class="text-xs font-bold opacity-80">РОСТ (СМ)</span><div class="flex items-center gap-1.5" onclick="event.stopPropagation()"><button onclick="setParam('height',${p.height-1})" class="w-8 h-8 rounded-xl theme-soft font-bold">-</button><input type="text" value="${p.height}" onchange="setParam('height',this.value)" onkeydown="blurOnEnter(event)" class="w-14 h-8 text-center font-mono-num font-extrabold text-sm rounded-xl theme-soft"><button onclick="setParam('height',${p.height+1})" class="w-8 h-8 rounded-xl theme-soft font-bold">+</button></div></div>
                ${activeOpenDropdown==='height'?`<div class="grid grid-cols-6 gap-1.5 pt-2 border-t border-white/10" onclick="event.stopPropagation()">${HEIGHT_GRID.map(h=>`<button onclick="setParam('height',${h});toggleDropdown('height');" class="py-1.5 rounded-xl text-xs font-mono-num font-bold ${p.height===h?'theme-grad text-white':'theme-soft'}">${h}</button>`).join('')}</div>`:''}
              </div>

              <div class="p-3 rounded-2xl theme-input space-y-2 cursor-pointer" onclick="toggleDropdown('weight')">
                <div class="flex justify-between items-center"><span class="text-xs font-bold opacity-80">ТЕКУЩИЙ ВЕС (КГ)</span><div class="flex items-center gap-1.5" onclick="event.stopPropagation()"><button onclick="setParam('weight',${+(p.weight-0.5).toFixed(1)})" class="w-8 h-8 rounded-xl theme-soft font-bold">-</button><input type="text" value="${p.weight}" onchange="setParam('weight',this.value)" onkeydown="blurOnEnter(event)" class="w-16 h-8 text-center font-mono-num font-extrabold text-sm rounded-xl theme-soft"><button onclick="setParam('weight',${+(p.weight+0.5).toFixed(1)})" class="w-8 h-8 rounded-xl theme-soft font-bold">+</button></div></div>
                ${activeOpenDropdown==='weight'?`<div class="grid grid-cols-8 gap-1 pt-2 border-t border-white/10" onclick="event.stopPropagation()">${WEIGHT_GRID.map(w=>`<button onclick="setParam('weight',${w});toggleDropdown('weight');" class="py-1.5 rounded-xl text-[11px] font-mono-num font-bold ${p.weight===w?'theme-grad text-white':'theme-soft'}">${w}</button>`).join('')}</div>`:''}
              </div>

              <div class="p-3 rounded-2xl theme-input space-y-2">
                <div class="flex items-center justify-between gap-2">
                  <div onclick="setParam('useBodyFat',${!p.useBodyFat})" class="flex items-center gap-2 cursor-pointer select-none">
                    <div class="w-10 h-6 rounded-full p-0.5 transition flex items-center shrink-0 ${p.useBodyFat?'theme-grad justify-end':'theme-soft justify-start'}"><div class="w-5 h-5 rounded-full bg-white shadow"></div></div>
                    <span class="text-xs font-bold">Учитывать % жира</span>
                  </div>
                  ${p.useBodyFat?`<div class="flex items-center gap-1 cursor-pointer shrink-0" onclick="toggleDropdown('bf')"><button onclick="event.stopPropagation();setParam('bodyFat',${+(p.bodyFat-0.5).toFixed(1)})" class="w-7 h-7 rounded-xl theme-soft font-bold">-</button><input type="text" value="${p.bodyFat}" onclick="event.stopPropagation()" onchange="setParam('bodyFat',this.value)" onkeydown="blurOnEnter(event)" class="w-12 h-7 text-center font-mono-num font-bold text-xs rounded-xl theme-soft"><span class="text-xs font-bold">%</span><button onclick="event.stopPropagation();setParam('bodyFat',${+(p.bodyFat+0.5).toFixed(1)})" class="w-7 h-7 rounded-xl theme-soft font-bold">+</button></div>`:''}
                </div>
                ${p.useBodyFat && activeOpenDropdown==='bf'?`<div class="grid grid-cols-6 gap-1.5 pt-2 border-t border-white/10" onclick="event.stopPropagation()">${[10,12,15,18,20,22,25,28,30,32,35,40].map(bf=>`<button onclick="setParam('bodyFat',${bf});toggleDropdown('bf');" class="py-1.5 rounded-xl text-xs font-mono-num font-bold ${p.bodyFat===bf?'theme-grad text-white':'theme-soft'}">${bf}%</button>`).join('')}</div>`:''}
              </div>

              <div class="p-3 rounded-2xl theme-input space-y-2">
                <div class="text-xs font-bold">💎 Особенности углеводного обмена (КБЖУ):</div>
                <div class="grid grid-cols-3 gap-1.5">
                  <button onclick="setDiabetesType('none')" class="py-2 px-1 rounded-xl text-[11px] font-bold whitespace-nowrap transition ${p.diabetesType==='none'?'theme-grad text-white shadow':'theme-soft'}">Нет (Норма)</button>
                  <button onclick="setDiabetesType('dm1')" class="py-2 px-1 rounded-xl text-[11px] font-bold whitespace-nowrap transition ${p.diabetesType==='dm1'?'theme-grad text-white shadow':'theme-soft'}">СД 1 типа</button>
                  <button onclick="setDiabetesType('dm2')" class="py-2 px-1 rounded-xl text-[11px] font-bold whitespace-nowrap transition ${p.diabetesType==='dm2'?'theme-grad text-white shadow':'theme-soft'}">СД 2 типа</button>
                </div>
              </div>

              <div class="grid grid-cols-2 gap-2.5"><div class="p-3 rounded-2xl theme-soft"><div class="text-[11px] opacity-80">ИМТ (${m.bmi<25?'Норма':'Выше нормы'})</div><div class="text-xl font-extrabold font-mono-num">${m.bmi}</div></div><div class="p-3 rounded-2xl theme-soft"><div class="text-[11px] opacity-80">Базовый обмен (BMR) 🔥</div><div class="text-xl font-extrabold font-mono-num">${m.bmr} ккал</div></div></div>
            </div>
          ` : ''}
        </div>

        <!-- BLOCK 2: ACTIVITY -->
        <div class="glass-card rounded-3xl p-4 space-y-3.5 shadow-lg">
          <div class="flex justify-between items-center gap-2 cursor-pointer select-none" onclick="toggleSection('p2')">
            <h2 class="font-extrabold text-sm sm:text-base flex items-center gap-1.5 min-w-0"><span class="truncate">2. Активность и Тренировки</span><span class="text-xs opacity-60 shrink-0">${isOpen('p2')?'▴':'▾'}</span></h2>
            <span class="text-xs font-mono-num font-extrabold px-2.5 py-1 rounded-xl theme-soft whitespace-nowrap shrink-0">TDEE: ${m.tdee}</span>
          </div>
          ${isOpen('p2') ? `
            <div class="space-y-3.5 pt-1">
              <div class="grid grid-cols-3 gap-1.5"><button onclick="setParam('neatLevel',0.12)" class="p-2.5 rounded-2xl text-left text-xs transition ${p.neatLevel===0.12?'theme-grad text-white font-bold shadow':'theme-input'}"><div>Сидячий</div><div class="text-[10px] opacity-75">+12%</div></button><button onclick="setParam('neatLevel',0.18)" class="p-2.5 rounded-2xl text-left text-xs transition ${p.neatLevel===0.18?'theme-grad text-white font-bold shadow':'theme-input'}"><div>Умеренный</div><div class="text-[10px] opacity-75">+18%</div></button><button onclick="setParam('neatLevel',0.25)" class="p-2.5 rounded-2xl text-left text-xs transition ${p.neatLevel===0.25?'theme-grad text-white font-bold shadow':'theme-input'}"><div>Активный</div><div class="text-[10px] opacity-75">+25%</div></button></div>
              
              <div class="p-3 rounded-2xl theme-input space-y-2 cursor-pointer" onclick="toggleDropdown('steps')">
                <div class="flex justify-between items-center"><div><div class="text-xs font-bold">👟 Шагов в день:</div><div class="text-[11px] opacity-75">~${m.distKm.toFixed(1)} км · +${m.stepsKcal} ккал</div></div><div class="flex items-center gap-1" onclick="event.stopPropagation()"><button onclick="setParam('steps',${Math.max(0,p.steps-1000)})" class="px-2.5 h-8 rounded-xl theme-soft font-bold text-xs">-1к</button><input type="text" value="${p.steps}" onchange="setParam('steps',this.value)" onkeydown="blurOnEnter(event)" class="w-16 h-8 text-center font-mono-num font-extrabold text-xs rounded-xl theme-soft"><button onclick="setParam('steps',${p.steps+1000})" class="px-2.5 h-8 rounded-xl theme-soft font-bold text-xs">+1к</button></div></div>
                ${activeOpenDropdown==='steps'?`<div class="grid grid-cols-5 gap-1.5 pt-2 border-t border-white/10" onclick="event.stopPropagation()">${STEPS_GRID.map(st=>`<button onclick="setParam('steps',${st});toggleDropdown('steps');" class="py-1.5 rounded-xl text-xs font-mono-num font-bold ${p.steps===st?'theme-grad text-white':'theme-soft'}">${st}</button>`).join('')}</div>`:''}
              </div>

              <div class="p-3 rounded-2xl theme-input space-y-2.5">
                <div class="flex justify-between items-center text-xs font-bold"><span>⚡ Тренировки</span><span class="font-mono-num">+${m.workoutKcal} ккал/дн</span></div>
                <div><div class="text-[10px] opacity-75 mb-1">Тренировок в неделю:</div><div class="grid grid-cols-8 gap-1">${[0,1,2,3,4,5,6,7].map(d=>`<button onclick="setParam('workoutDays',${d})" class="py-1.5 rounded-xl text-xs font-mono-num font-bold transition ${p.workoutDays===d?'theme-grad text-white shadow':'theme-soft'}">${d}</button>`).join('')}</div></div>
                <div><div class="text-[10px] opacity-75 mb-1">Длительность (минут):</div><div class="grid grid-cols-6 gap-1">${[30,45,60,75,90,120].map(mn=>`<button onclick="setParam('workoutMins',${mn})" class="py-1.5 rounded-xl text-xs font-mono-num font-bold transition ${p.workoutMins===mn?'theme-grad text-white shadow':'theme-soft'}">${mn}</button>`).join('')}</div></div>
                <div class="grid grid-cols-2 gap-1.5 pt-1"><button onclick="setParam('workoutMode','avg')" class="py-2 px-2 rounded-xl text-[11px] font-bold whitespace-nowrap transition ${p.workoutMode==='avg'?'theme-grad text-white shadow':'theme-soft'}">Среднее в неделю</button><button onclick="setParam('workoutMode','today')" class="py-2 px-2 rounded-xl text-[11px] font-bold whitespace-nowrap transition ${p.workoutMode==='today'?'theme-grad text-white shadow':'theme-soft'}">Тренировка сегодня</button></div>
              </div>
            </div>
          ` : ''}
        </div>

        <!-- BLOCK 3: GOAL & MACROS -->
        <div class="glass-card rounded-3xl p-4 space-y-3.5 shadow-lg">
          <div class="flex justify-between items-center gap-2 cursor-pointer select-none" onclick="toggleSection('p3')">
            <h2 class="font-extrabold text-sm sm:text-base flex items-center gap-1.5 min-w-0"><span class="truncate">3. Цель и Норма КБЖУ</span><span class="text-xs opacity-60 shrink-0">${isOpen('p3')?'▴':'▾'}</span></h2>
            <span class="text-xs font-mono-num font-extrabold px-2.5 py-1 rounded-xl theme-grad text-white whitespace-nowrap shrink-0">${m.effectiveKcal} ккал</span>
          </div>
          ${isOpen('p3') ? `
            <div class="space-y-3.5 pt-1">
              <div class="p-3 rounded-2xl theme-input space-y-2 cursor-pointer" onclick="toggleDropdown('tweight')">
                <div class="flex justify-between items-center"><span class="text-xs font-bold">🎯 Желаемый вес (кг)</span><div class="flex items-center gap-1.5" onclick="event.stopPropagation()"><button onclick="setParam('targetWeight',${+(p.targetWeight-0.5).toFixed(1)})" class="w-8 h-8 rounded-xl theme-soft font-bold">-</button><input type="text" value="${p.targetWeight}" onchange="setParam('targetWeight',this.value)" onkeydown="blurOnEnter(event)" class="w-16 h-8 text-center font-mono-num font-extrabold text-sm rounded-xl theme-soft"><button onclick="setParam('targetWeight',${+(p.targetWeight+0.5).toFixed(1)})" class="w-8 h-8 rounded-xl theme-soft font-bold">+</button></div></div>
                ${activeOpenDropdown==='tweight'?`<div class="grid grid-cols-8 gap-1 pt-2 border-t border-white/10" onclick="event.stopPropagation()">${WEIGHT_GRID.map(w=>`<button onclick="setParam('targetWeight',${w});toggleDropdown('tweight');" class="py-1.5 rounded-xl text-[11px] font-mono-num font-bold ${p.targetWeight===w?'theme-grad text-white':'theme-soft'}">${w}</button>`).join('')}</div>`:''}
              </div>

              <div class="p-3 rounded-2xl theme-input space-y-2 cursor-pointer" onclick="toggleDropdown('weeks')">
                <div class="flex justify-between items-center text-xs font-bold"><div><div>📅 Срок (недель):</div><div class="text-[10px] opacity-75">Финиш: ${finishDate} (${m.dailyDelta>0?'+':''}${m.dailyDelta} ккал/дн)</div></div><div class="flex items-center gap-1.5" onclick="event.stopPropagation()"><button onclick="setParam('targetWeeks',${Math.max(1,p.targetWeeks-1)})" class="w-8 h-8 rounded-xl theme-soft font-bold">-</button><input type="text" value="${p.targetWeeks}" onchange="setParam('targetWeeks',this.value)" onkeydown="blurOnEnter(event)" class="w-14 h-8 text-center font-mono-num font-extrabold text-sm rounded-xl theme-soft"><button onclick="setParam('targetWeeks',${p.targetWeeks+1})" class="w-8 h-8 rounded-xl theme-soft font-bold">+</button></div></div>
                ${activeOpenDropdown==='weeks'?`<div class="grid grid-cols-6 gap-1.5 pt-2 border-t border-white/10" onclick="event.stopPropagation()">${WEEKS_GRID.map(wk=>`<button onclick="setParam('targetWeeks',${wk});toggleDropdown('weeks');" class="py-1.5 rounded-xl text-xs font-mono-num font-bold ${p.targetWeeks===wk?'theme-grad text-white':'theme-soft'}">${wk}н</button>`).join('')}</div>`:''}
              </div>

              <div class="p-3 rounded-2xl theme-input space-y-1">
                <div class="flex justify-between items-center text-[11px] font-bold opacity-85">
                  <span>📈 Траектория веса и адаптация TDEE</span>
                  <span class="font-mono-num">${p.weight} → ${p.targetWeight} кг</span>
                </div>
                ${buildWeightSvgChart(checkpoints)}
              </div>

              ${p.diabetesType!=='none'?`
                <div class="p-3.5 rounded-2xl border-2 space-y-2 text-xs" style="border-color:var(--brand);background:var(--brand-soft);">
                  <div class="font-extrabold flex items-center justify-between gap-2">
                    <span class="flex items-center">💎 Протокол ${p.diabetesType==='dm1'?'СД 1 типа':'СД 2 типа'} ${helpBtn('xe')}</span>
                    <span class="px-2.5 py-0.5 rounded-xl theme-grad text-white font-mono-num whitespace-nowrap shrink-0">${m.totalXE} ХЕ/сут</span>
                  </div>
                  <div class="text-[11px] opacity-90 leading-relaxed">
                    ${p.diabetesType==='dm1'
                      ? `• Углеводы адаптированы под выбранный тип питания: <strong>${m.normC} г (${m.totalXE} ХЕ)</strong> для стабильного гликемического профиля.`
                      : `• Углеводы ограничены до <strong>${m.normC} г/сут (${m.totalXE} ХЕ)</strong> с низким ГИ. На основной прием: до <strong>${m.maxMealCarbs} г (${m.maxMealXE} ХЕ)</strong>.`}
                  </div>
                </div>
              `:''}

              <div class="p-3 rounded-2xl theme-soft space-y-2 text-xs">
                ${isTooStrict?`<div class="p-2.5 rounded-2xl bg-amber-500/20 border border-amber-400 text-[11px]">⚠️ Жесткий темп! Порог безопасности для вашего веса (${p.weight} кг): <strong>${m.minSafe} ккал</strong>. <button onclick="setParam('targetWeeks',${safeWeeks})" class="underline font-bold">Поставить ${safeWeeks} нед.</button></div>`:`<div class="text-[11px]">✅ Безопасный темп: ${m.weeklyKg} кг/нед. Порог безопасности: ${m.minSafe} ккал. Клетчатка: от ${m.fiberNorm} г/сут.</div>`}
                <div class="grid grid-cols-2 gap-1.5"><button onclick="setParam('steps',${p.steps+3000})" class="p-2.5 rounded-2xl theme-input text-left"><div class="font-bold text-[11px]">👟 +3 000 шагов</div><div class="text-[10px] opacity-75">+${extra3kKcal} ккал к рациону</div></button><button onclick="applySmartMacros(${recProt},${recFat})" class="p-2.5 rounded-2xl theme-input text-left"><div class="font-bold text-[11px]">🥩 Смарт-БЖУ</div><div class="text-[10px] opacity-75">Б ${recProt} · Ж ${recFat} г/кг</div></button></div>
              </div>

              <div class="space-y-1.5"><div class="text-xs font-bold">🥗 Тип питания под цель:</div>${DIET_TYPES.map(dt=>`<button onclick="selectDietType('${dt.id}')" class="w-full p-3 rounded-2xl text-left flex justify-between items-center gap-2 transition ${p.dietType===dt.id?'theme-grad text-white shadow':'theme-input'}"><div><div class="text-xs font-bold">${dt.name}</div><div class="text-[10px] opacity-80">${dt.desc}</div></div><span class="text-[10px] font-mono-num font-bold px-2.5 py-1 rounded-xl bg-black/20 text-white whitespace-nowrap shrink-0">${p.dietType===dt.id?`${m.realPpct}/${m.realFpct}/${m.realCpct}%`:`${dt.p}/${dt.f}/${dt.c}%`}</span></button>`).join('')}</div>

              <div class="p-3 rounded-2xl theme-input space-y-2.5 text-xs">
                <div class="text-[10px] opacity-80 font-bold">База расчета белка и жиров (г/кг):</div>
                <div class="grid grid-cols-3 gap-1.5"><button onclick="setParam('macroBase','target')" class="py-1.5 px-1 rounded-xl text-[10px] font-bold whitespace-nowrap ${p.macroBase==='target'?'theme-grad text-white':'theme-soft'}">Цель (${p.targetWeight}кг)</button><button onclick="setParam('macroBase','current')" class="py-1.5 px-1 rounded-xl text-[10px] font-bold whitespace-nowrap ${p.macroBase==='current'?'theme-grad text-white':'theme-soft'}">Вес (${p.weight}кг)</button><button onclick="setParam('macroBase','lbm')" class="py-1.5 px-1 rounded-xl text-[10px] font-bold whitespace-nowrap ${p.macroBase==='lbm'?'theme-grad text-white':'theme-soft'}">Сухая (${m.lbmWeight}кг)</button></div>
                <div class="space-y-1 cursor-pointer" onclick="toggleDropdown('prot')"><div class="flex justify-between"><span>Белки (${m.effProtGkg} г/кг от ${m.refLabel})</span><strong>${m.normP} г</strong></div>
                  ${activeOpenDropdown==='prot'?`<div class="grid grid-cols-6 gap-1.5 pt-2 border-t border-white/10" onclick="event.stopPropagation()">${PROT_GRID.map(v=>`<button onclick="setParam('protGkg',${v});toggleDropdown('prot');" class="py-1.5 rounded-xl text-xs font-mono-num font-bold ${p.protGkg===v?'theme-grad text-white':'theme-soft'}">${v}</button>`).join('')}</div>`:''}
                </div>
                <div class="space-y-1 cursor-pointer" onclick="toggleDropdown('fat')"><div class="flex justify-between"><span>Жиры (${m.effFatGkg} г/кг от ${m.refLabel})</span><strong>${m.normF} г</strong></div>
                  ${activeOpenDropdown==='fat'?`<div class="grid grid-cols-6 gap-1.5 pt-2 border-t border-white/10" onclick="event.stopPropagation()">${FAT_GRID.map(v=>`<button onclick="setParam('fatGkg',${v});toggleDropdown('fat');" class="py-1.5 rounded-xl text-xs font-mono-num font-bold ${p.fatGkg===v?'theme-grad text-white':'theme-soft'}">${v}</button>`).join('')}</div>`:''}
                </div>
              </div>
            </div>
          ` : ''}

          <div class="grid grid-cols-4 gap-2 pt-1"><div class="p-2.5 rounded-2xl theme-grad text-white text-center"><div class="text-[10px]">НОРМА</div><div class="font-mono-num font-extrabold text-sm">${m.effectiveKcal}</div></div><div class="p-2.5 rounded-2xl theme-soft text-center"><div class="text-[10px]">Белки</div><div class="font-mono-num font-extrabold text-sm">${m.normP}г</div></div><div class="p-2.5 rounded-2xl theme-soft text-center"><div class="text-[10px]">Жиры</div><div class="font-mono-num font-extrabold text-sm">${m.normF}г</div></div><div class="p-2.5 rounded-2xl theme-soft text-center cursor-pointer" onclick="showHelpTopic('xe')"><div class="text-[10px]">${p.diabetesType==='none'?'Углеводы':`Угл (${m.totalXE}ХЕ)`}</div><div class="font-mono-num font-extrabold text-sm">${m.normC}г</div></div></div>
        </div>

        <div class="px-2 text-center pb-2">
          <p class="text-[10px] opacity-60 leading-relaxed font-sans">
            ℹ️ Все расчеты являются справочными, носят рекомендательный характер и не заменяют консультацию врача.
          </p>
        </div>
      </section>

      <!-- RIGHT COLUMN: DIABETES & INSULIN CALCULATOR -->
      <section class="lg:col-span-6 space-y-4 ${activeTab==='calc'?'hidden lg:block':''}">
        ${showDiabetesToast ? `
          <div onclick="showDiabetesToast=false;renderApp();" class="p-3.5 rounded-3xl theme-soft border border-white/30 shadow-lg flex items-center justify-between gap-2 cursor-pointer">
            <div class="text-xs leading-relaxed">
              💡 <strong>Важно:</strong> Расчетные коэффициенты и дозы носят рекомендательный характер. Согласовывайте терапию с лечащим врачом. <em>(Нажмите, чтобы скрыть)</em>
            </div>
            <span class="text-xs opacity-70 shrink-0 font-bold px-2 py-1 rounded-xl theme-input">✕</span>
          </div>
        ` : ''}

        <!-- ACTIVE INSULIN BANNER WITH CLEAN FULL-WIDTH TOGGLE -->
        ${iobData.totalIob > 0 ? `
          <div class="p-3.5 rounded-3xl border-2 space-y-2.5 shadow-lg" style="border-color:#2DD4BF;background:var(--brand-soft);">
            <div class="flex items-center justify-between gap-2">
              <div>
                <div class="text-xs font-extrabold flex items-center gap-1.5">⏳ Активный инсулин (IOB): <span id="live-iob-units" class="font-mono-num text-base" style="color:#2DD4BF;">${iobData.totalIob} ЕД</span></div>
                <div id="live-iob-sub" class="text-[10px] opacity-90 font-mono-num mt-0.5">Укол ${iobData.activeRecords[0].units} ЕД в ${iobData.activeRecords[0].timeStr} · осталось ${iobData.activeRecords[0].leftText}</div>
              </div>
              <button onclick="clearIobLog()" class="px-3 py-1.5 rounded-xl theme-input text-[11px] font-bold shrink-0">Сброс</button>
            </div>
            <button onclick="subtractIobFromDps=!subtractIobFromDps;renderApp();" class="w-full py-2 px-3 rounded-xl text-[11px] font-bold flex items-center justify-between gap-2 transition ${subtractIobFromDps?'theme-grad text-white shadow':'theme-input'}">
              <span>Вычитать этот IOB из новой ДПС:</span>
              <span class="whitespace-nowrap font-extrabold">${subtractIobFromDps ? '✓ Да (вычитается)' : 'Нет (это болюс еды)'}</span>
            </button>
          </div>
        ` : ''}

        <!-- DIABETES BLOCK 1: FULL-WIDTH ROWS FOR INSULIN GROUPS & PEN STEP -->
        <div class="glass-card rounded-3xl p-4 sm:p-5 space-y-3.5 shadow-lg">
          <div class="flex items-center justify-between gap-2 cursor-pointer select-none" onclick="toggleSection('d1')">
            <h2 class="font-extrabold text-sm sm:text-base flex items-center gap-1.5 min-w-0"><span class="truncate">💧 1. Инсулин, База и УК</span><span class="text-xs opacity-60 shrink-0">${isOpen('d1')?'▴':'▾'}</span></h2>
            <span class="text-[11px] px-2.5 py-1 rounded-xl theme-soft font-mono-num font-bold inline-flex items-center whitespace-nowrap shrink-0" onclick="event.stopPropagation();showHelpTopic('xe')">1 ХЕ = 12 г ${helpBtn('xe')}</span>
          </div>
          ${isOpen('d1') ? `
            <div class="space-y-3.5 pt-1">
              <div class="space-y-2">
                <div class="text-xs font-bold opacity-85 flex items-center justify-between gap-2">
                  <span>Группа болюсного инсулина:</span>
                  <span onclick="showHelpTopic('insulins')" class="text-[11px] underline cursor-pointer font-bold whitespace-nowrap shrink-0" style="color:#2DD4BF;">Примеры препаратов ${helpBtn('insulins')}</span>
                </div>
                <div class="space-y-1.5">
                  ${INSULIN_TYPES.map(ins=>`
                    <button onclick="setParam('insulinType','${ins.id}')" class="w-full p-3 rounded-2xl text-left flex items-center justify-between gap-2 transition ${p.insulinType===ins.id?'theme-grad text-white shadow-md':'theme-input'}">
                      <div>
                        <div class="text-xs font-extrabold">${getShortInsulinLabel(ins.id)}</div>
                        <div class="text-[10px] opacity-80 mt-0.5">${ins.desc}</div>
                      </div>
                      <span class="text-[10px] font-bold px-2.5 py-1 rounded-xl bg-black/25 text-white shrink-0">Активен ~${ins.diaHours}ч</span>
                    </button>
                  `).join('')}
                </div>
              </div>

              <div class="p-3 rounded-2xl theme-input space-y-2">
                <div class="text-xs font-bold flex items-center justify-between gap-2">
                  <span class="flex items-center">💉 Шаг шприц-ручки / помпы ${helpBtn('penStep')}</span>
                  <span class="font-mono-num text-[10px] opacity-75 whitespace-nowrap">Умное округление</span>
                </div>
                <div class="space-y-1.5">
                  <button onclick="setParam('insulinStep',1.0)" class="w-full py-2.5 px-3 rounded-xl text-left flex items-center justify-between transition ${p.insulinStep===1.0?'theme-grad text-white shadow':'theme-soft'}">
                    <span class="text-xs font-mono-num font-extrabold">1.0 ЕД — Стандартная ручка</span>
                    <span class="text-[10px] opacity-80">Шаг 1 ЕД</span>
                  </button>
                  <button onclick="setParam('insulinStep',0.5)" class="w-full py-2.5 px-3 rounded-xl text-left flex items-center justify-between transition ${p.insulinStep===0.5?'theme-grad text-white shadow':'theme-soft'}">
                    <span class="text-xs font-mono-num font-extrabold">0.5 ЕД — Ручка Джуниор</span>
                    <span class="text-[10px] opacity-80">Шаг 0.5 ЕД</span>
                  </button>
                  <button onclick="setParam('insulinStep',0.1)" class="w-full py-2.5 px-3 rounded-xl text-left flex items-center justify-between transition ${p.insulinStep===0.1?'theme-grad text-white shadow':'theme-soft'}">
                    <span class="text-xs font-mono-num font-extrabold">0.1 ЕД — Инсулиновая помпа</span>
                    <span class="text-[10px] opacity-80">Шаг 0.1 ЕД</span>
                  </button>
                </div>
              </div>

              <div class="p-3 rounded-2xl theme-input space-y-1.5">
                <div class="flex justify-between items-center gap-2">
                  <div class="min-w-0">
                    <div class="text-xs font-bold flex items-center">🌙 Ночной / Базальный ${helpBtn('basal')}</div>
                    <div class="text-[10px] opacity-75">${p.basalDose>0 ? `Ваша база (${dayPlan.basalPct}% от СДИ ${dayPlan.totalDailyDose} ЕД)` : `Авто (~${dayPlan.autoBasal} ЕД · 45% от СДИ)`}</div>
                  </div>
                  <div class="flex items-center gap-1.5 shrink-0">
                    <button onclick="setParam('basalDose',${Math.max(0, dayPlan.effectiveBasal-1)})" class="w-8 h-8 rounded-xl theme-soft font-bold">-</button>
                    <input type="text" value="${dayPlan.effectiveBasal}" onchange="setParam('basalDose',this.value)" onkeydown="blurOnEnter(event)" class="w-14 h-8 text-center font-mono-num font-extrabold text-sm rounded-xl theme-soft">
                    <button onclick="setParam('basalDose',${dayPlan.effectiveBasal+1})" class="w-8 h-8 rounded-xl theme-soft font-bold">+</button>
                  </div>
                </div>
                ${p.basalDose > 0 ? `<div class="text-[10px] opacity-85 flex justify-between items-center pt-1"><span>${dayPlan.basalNote}</span><button onclick="setParam('basalDose',0)" class="underline ml-2 shrink-0">Авто</button></div>` : ''}
              </div>

              <div class="p-3 rounded-2xl theme-input space-y-2 cursor-pointer" onclick="toggleDropdown('icr')">
                <div class="flex justify-between items-center gap-2">
                  <div class="min-w-0">
                    <div class="text-xs font-bold flex items-center">Базовый УК (ЕД на 1 ХЕ) ${helpBtn('icr')}</div>
                    <div class="text-[10px] opacity-75">По Правилу 500: ~${dayPlan.rule500Icr} ЕД/ХЕ</div>
                  </div>
                  <div class="flex items-center gap-1.5 shrink-0" onclick="event.stopPropagation()"><button onclick="setParam('icr',${+(Math.max(0.1,p.icr-0.1)).toFixed(1)})" class="w-8 h-8 rounded-xl theme-soft font-bold">-</button><input type="text" value="${p.icr}" onchange="setParam('icr',this.value)" onkeydown="blurOnEnter(event)" class="w-14 h-8 text-center font-mono-num font-extrabold text-sm rounded-xl theme-soft"><button onclick="setParam('icr',${+(p.icr+0.1).toFixed(1)})" class="w-8 h-8 rounded-xl theme-soft font-bold">+</button></div>
                </div>
                ${activeOpenDropdown==='icr'?`<div class="grid grid-cols-8 gap-1 pt-2 border-t border-white/10" onclick="event.stopPropagation()">${ICR_GRID.map(v=>`<button onclick="setParam('icr',${v});toggleDropdown('icr');" class="py-1.5 rounded-xl text-xs font-mono-num font-bold ${p.icr===v?'theme-grad text-white':'theme-soft'}">${v}</button>`).join('')}</div>`:''}
              </div>

              <div class="grid grid-cols-2 gap-2 text-xs">
                <div class="p-3 rounded-2xl theme-input flex flex-col justify-between">
                  <span class="text-[10px] opacity-85 font-bold flex items-center">🎯 Целевой ГК ${helpBtn('targetBg')}</span>
                  <div class="flex items-center justify-between mt-1.5">
                    <button onclick="setParam('targetBg',${+(p.targetBg-0.2).toFixed(1)})" class="w-7 h-7 rounded-xl theme-soft font-bold">-</button>
                    <input type="text" value="${p.targetBg}" onchange="setParam('targetBg',this.value)" onkeydown="blurOnEnter(event)" class="w-12 h-7 text-center font-mono-num font-extrabold text-xs rounded-xl theme-soft">
                    <button onclick="setParam('targetBg',${+(p.targetBg+0.2).toFixed(1)})" class="w-7 h-7 rounded-xl theme-soft font-bold">+</button>
                  </div>
                </div>
                <div class="p-3 rounded-2xl theme-input flex flex-col justify-between">
                  <div class="flex justify-between items-center">
                    <span class="text-[10px] opacity-85 font-bold flex items-center">📉 ФЧИ ${helpBtn('isf')}</span>
                    ${p.customIsf > 0 ? `<button onclick="setParam('customIsf',0)" class="text-[9px] underline opacity-75">Авто</button>` : `<span class="text-[9px] opacity-70">Авто</span>`}
                  </div>
                  <div class="flex items-center justify-between mt-1.5">
                    <button onclick="setParam('customIsf',${+(Math.max(0.5, dayPlan.effectiveIsf-0.2)).toFixed(1)})" class="w-7 h-7 rounded-xl theme-soft font-bold">-</button>
                    <input type="text" value="${dayPlan.effectiveIsf}" onchange="setParam('customIsf',this.value)" onkeydown="blurOnEnter(event)" class="w-12 h-7 text-center font-mono-num font-extrabold text-xs rounded-xl theme-soft">
                    <button onclick="setParam('customIsf',${+(dayPlan.effectiveIsf+0.2).toFixed(1)})" class="w-7 h-7 rounded-xl theme-soft font-bold">+</button>
                  </div>
                </div>
              </div>
            </div>
          ` : ''}
        </div>

        <!-- DIABETES BLOCK 2: DAILY INSULIN PLAN -->
        <div class="glass-card rounded-3xl p-4 sm:p-5 space-y-3.5 shadow-lg border-2" style="border-color:var(--brand);">
          <div class="flex items-center justify-between gap-2 cursor-pointer select-none" onclick="toggleSection('d2')">
            <div class="min-w-0">
              <div class="text-[10px] font-bold uppercase opacity-75">Суточная доза (СДИ: ~${dayPlan.totalDailyDose} ЕД)</div>
              <h2 class="font-extrabold text-sm sm:text-base flex items-center gap-1.5"><span class="truncate">📊 2. Инсулин на весь день</span><span class="text-xs opacity-60 shrink-0">${isOpen('d2')?'▴':'▾'}</span></h2>
            </div>
            <span class="px-2.5 py-1 rounded-xl theme-grad text-white font-mono-num font-extrabold text-xs whitespace-nowrap shrink-0">${dayPlan.dayXE} ХЕ / сут</span>
          </div>
          ${isOpen('d2') ? `
            <div class="space-y-3.5 pt-1">
              <div class="grid grid-cols-3 gap-2 text-center font-mono-num">
                <div class="p-2.5 rounded-2xl theme-input">
                  <div class="text-[10px] font-sans opacity-75">Болюс Угл</div>
                  <div class="text-lg font-extrabold">${dayPlan.dayCarbBolus} ЕД</div>
                  <div class="text-[10px] opacity-70">${m.normC}г (${dayPlan.dayXE} ХЕ)</div>
                </div>
                <div class="p-2.5 rounded-2xl theme-input">
                  <div class="text-[10px] font-sans opacity-75 flex items-center justify-center">Болюс БЖЕ ${helpBtn('bje')}</div>
                  <div class="text-lg font-extrabold">${dayPlan.dayBjeBolus} ЕД</div>
                  <div class="text-[10px] opacity-70">${dayPlan.dayBJE} БЖЕ/дн</div>
                </div>
                <div class="p-2.5 rounded-2xl theme-soft">
                  <div class="text-[10px] font-sans font-bold flex items-center justify-center">База ${helpBtn('basal')}</div>
                  <div class="text-lg font-extrabold">${dayPlan.effectiveBasal} ЕД</div>
                  <div class="text-[10px] opacity-80">${dayPlan.basalPct}% от СДИ</div>
                </div>
              </div>

              <div class="space-y-1.5 text-xs">
                <div class="font-bold text-[11px] opacity-85">Нажмите на прием пищи, чтобы подставить его КБЖУ в разовый расчет:</div>
                ${dayPlan.splits.map(s=>`
                  <div onclick="setMealTime('${s.slot}')" class="p-2.5 rounded-2xl cursor-pointer transition flex items-center justify-between gap-2 ${mealTimeSlot===s.slot && !mealBolus.customEdited ? 'theme-soft border border-white/30 shadow-sm' : 'theme-input'}">
                    <div>
                      <div class="font-bold">${s.name} <span class="text-[10px] font-mono-num opacity-75">(УК ~${s.effIcr})</span></div>
                      <div class="text-[10px] opacity-75 font-mono-num">Б:${s.pG}г · Ж:${s.fG}г · У:${s.cG}г (${s.xe} ХЕ · ${s.bje} БЖЕ)</div>
                    </div>
                    <div class="text-right font-mono-num shrink-0">
                      <div class="font-extrabold text-sm">${s.totU} ЕД</div>
                      <div class="text-[9px] opacity-80">До: ${s.preU} ${s.postU>0?`| После: ${s.postU}`:''}</div>
                    </div>
                  </div>
                `).join('')}
              </div>
            </div>
          ` : ''}
        </div>

        <!-- DIABETES BLOCK 3: SINGLE MEAL CALCULATOR WITH CONSISTENT TIMING -->
        <div class="glass-card rounded-3xl p-4 sm:p-5 space-y-3.5 shadow-lg">
          <div class="flex items-center justify-between gap-2 cursor-pointer select-none" onclick="toggleSection('d3')">
            <h2 class="font-extrabold text-sm sm:text-base flex items-center gap-1.5 min-w-0"><span class="truncate">🍽 3. Разовый расчет на еду</span><span class="text-xs opacity-60 shrink-0">${isOpen('d3')?'▴':'▾'}</span></h2>
            <span class="text-xs font-mono-num font-bold px-2.5 py-1 rounded-xl theme-soft whitespace-nowrap shrink-0">${mealKcal} ккал</span>
          </div>
          ${isOpen('d3') ? `
            <div class="space-y-3.5 pt-1">
              <details class="p-2.5 rounded-2xl theme-input text-xs">
                <summary class="cursor-pointer font-bold text-[11px] opacity-85">📋 Быстрая вставка цифр БЖУ из другого приложения</summary>
                <div class="pt-2 flex gap-1.5">
                  <input type="text" id="inp-smart-parse" onkeydown="blurOnEnter(event)" placeholder="Напр: Б 35 Ж 15 У 48 (или 35 15 48)" class="flex-1 px-2.5 py-1.5 rounded-xl theme-soft text-xs">
                  <button onclick="if(!parseSmartFoodText(document.getElementById('inp-smart-parse').value)) alert('Введите 3 числа (Белки Жиры Углеводы), например: 35 15 48');" class="px-3 py-1.5 rounded-xl theme-grad text-white font-bold text-xs">ОК</button>
                </div>
              </details>

              <div class="space-y-1.5">
                <div class="text-[11px] font-bold opacity-80">⏰ Время суток (автоматически корректирует УК):</div>
                <div class="grid grid-cols-4 gap-1.5">
                  <button onclick="setMealTime('morning')" class="py-2 px-1 rounded-xl text-[11px] font-bold transition ${mealTimeSlot==='morning'?'theme-grad text-white shadow':'theme-input'}">🌅 Утро<div class="text-[9px] opacity-80">УК ×1.15</div></button>
                  <button onclick="setMealTime('lunch')" class="py-2 px-1 rounded-xl text-[11px] font-bold transition ${mealTimeSlot==='lunch'?'theme-grad text-white shadow':'theme-input'}">☀️ День<div class="text-[9px] opacity-80">УК ×1.0</div></button>
                  <button onclick="setMealTime('evening')" class="py-2 px-1 rounded-xl text-[11px] font-bold transition ${mealTimeSlot==='evening'?'theme-grad text-white shadow':'theme-input'}">🌙 Вечер<div class="text-[9px] opacity-80">УК ×0.90</div></button>
                  <button onclick="setMealTime('night')" class="py-2 px-1 rounded-xl text-[11px] font-bold transition ${mealTimeSlot==='night'?'theme-grad text-white shadow':'theme-input'}">🌌 Ночь<div class="text-[9px] opacity-80">УК ×0.95</div></button>
                </div>
              </div>

              <div class="space-y-1.5">
                <div class="text-[11px] font-bold opacity-80 flex items-center justify-between">
                  <span>🥗 Гликемический индекс (ГИ) еды:</span>
                  <span onclick="showHelpTopic('xe')" class="text-[10px] underline cursor-pointer whitespace-nowrap" style="color:#2DD4BF;">Шпаргалка по ГИ ${helpBtn('xe')}</span>
                </div>
                <div class="grid grid-cols-3 gap-1.5">
                  <button onclick="setMealBolus('gi','low')" class="h-9 px-2 rounded-xl text-[11px] font-bold inline-flex items-center justify-center gap-1 whitespace-nowrap transition ${mealBolus.gi==='low'?'theme-grad text-white shadow':'theme-input'}"><span>🟢</span><span>Низкий ГИ</span></button>
                  <button onclick="setMealBolus('gi','mid')" class="h-9 px-2 rounded-xl text-[11px] font-bold inline-flex items-center justify-center gap-1 whitespace-nowrap transition ${mealBolus.gi==='mid'?'theme-grad text-white shadow':'theme-input'}"><span>🟡</span><span>Средний ГИ</span></button>
                  <button onclick="setMealBolus('gi','high')" class="h-9 px-2 rounded-xl text-[11px] font-bold inline-flex items-center justify-center gap-1 whitespace-nowrap transition ${mealBolus.gi==='high'?'theme-grad text-white shadow':'theme-input'}"><span>🔴</span><span>Высокий ГИ</span></button>
                </div>
              </div>

              <div class="space-y-2 text-xs">
                <div class="p-3 rounded-2xl border-2 space-y-2 transition ${bolus.isHighBg ? 'border-amber-400/70 bg-amber-500/10' : (bolus.isHypoNow ? 'border-rose-500/80 bg-rose-500/15' : 'theme-soft border-white/15')}">
                  <div class="flex justify-between items-center gap-2">
                    <div class="min-w-0">
                      <div class="font-extrabold flex items-center">💧 Текущий сахар (ммоль/л) ${helpBtn('targetBg')}</div>
                      <div class="text-[10px] opacity-80">Цель: ${p.targetBg} · ФЧИ: ${bolus.isf} ммоль/ЕД</div>
                    </div>
                    <div class="flex items-center gap-1 shrink-0">
                      <button onclick="adjustCurrBg(-0.5)" class="w-8 h-8 rounded-xl theme-input font-bold">-0.5</button>
                      <input type="text" placeholder="${p.targetBg}" value="${mealBolus.currBg}" onchange="setMealBolus('currBg',this.value)" onkeydown="blurOnEnter(event)" class="w-14 h-8 text-center font-mono-num font-extrabold rounded-xl theme-input text-sm">
                      <button onclick="adjustCurrBg(0.5)" class="w-8 h-8 rounded-xl theme-input font-bold">+0.5</button>
                      ${mealBolus.currBg !== '' ? `<button onclick="setMealBolus('currBg','')" class="w-7 h-8 rounded-xl theme-input text-xs opacity-75">✕</button>` : ''}
                    </div>
                  </div>
                  <div class="grid grid-cols-6 gap-1 pt-0.5">
                    ${BG_PRESETS.map(b => `<button onclick="setMealBolus('currBg',${b})" class="py-1 rounded-lg text-[10px] font-mono-num font-bold transition ${parseFloat(mealBolus.currBg)===b?'theme-grad text-white shadow':'theme-input opacity-85'}">${b}</button>`).join('')}
                  </div>
                  ${bolus.hasBg ? `
                    <div class="pt-1.5 border-t border-white/15 text-[11px] flex justify-between items-center">
                      <span>Коррекция на сахар (ДПС ${bolus.hyperResistMult>1?`с коэф. резист. ×${bolus.hyperResistMult}`:''}):</span>
                      <span class="font-mono-num font-extrabold text-sm">${bolus.dpsRounded > 0 ? '+' : ''}${bolus.dpsRounded} ЕД <span class="text-[10px] opacity-75">(точн: ${bolus.safeDps > 0 ? '+' : ''}${bolus.safeDps})</span></span>
                    </div>
                  ` : ''}
                </div>

                <div class="p-3 rounded-2xl theme-input flex justify-between items-center">
                  <span class="font-bold">Белки:</span>
                  <div class="flex items-center gap-1.5">
                    <button onclick="setMealBolus('p',Math.max(0,mealBolus.p-5))" class="w-8 h-8 rounded-xl theme-soft font-bold">-</button>
                    <input type="text" value="${mealBolus.p}" onchange="setMealBolus('p',this.value)" onkeydown="blurOnEnter(event)" class="w-16 h-8 text-center font-mono-num font-bold rounded-xl theme-soft text-sm">
                    <button onclick="setMealBolus('p',mealBolus.p+5)" class="w-8 h-8 rounded-xl theme-soft font-bold">+</button>
                    <span class="font-bold text-[11px]">г</span>
                  </div>
                </div>

                <div class="p-3 rounded-2xl theme-input flex justify-between items-center">
                  <span class="font-bold">Жиры:</span>
                  <div class="flex items-center gap-1.5">
                    <button onclick="setMealBolus('f',Math.max(0,mealBolus.f-5))" class="w-8 h-8 rounded-xl theme-soft font-bold">-</button>
                    <input type="text" value="${mealBolus.f}" onchange="setMealBolus('f',this.value)" onkeydown="blurOnEnter(event)" class="w-16 h-8 text-center font-mono-num font-bold rounded-xl theme-soft text-sm">
                    <button onclick="setMealBolus('f',mealBolus.f+5)" class="w-8 h-8 rounded-xl theme-soft font-bold">+</button>
                    <span class="font-bold text-[11px]">г</span>
                  </div>
                </div>

                <div class="p-3 rounded-2xl theme-input flex justify-between items-center">
                  <span class="font-bold flex items-center">Углеводы (${bolus.xe} ХЕ): ${helpBtn('xe')}</span>
                  <div class="flex items-center gap-1.5">
                    <button onclick="setMealBolus('c',Math.max(0,mealBolus.c-6))" class="w-8 h-8 rounded-xl theme-soft font-bold">-</button>
                    <input type="text" value="${mealBolus.c}" onchange="setMealBolus('c',this.value)" onkeydown="blurOnEnter(event)" class="w-16 h-8 text-center font-mono-num font-bold rounded-xl theme-soft text-sm">
                    <button onclick="setMealBolus('c',mealBolus.c+6)" class="w-8 h-8 rounded-xl theme-soft font-bold">+</button>
                    <span class="font-bold text-[11px]">г</span>
                  </div>
                </div>
              </div>

              <!-- TWO-WAVE RESULT WITH DYNAMIC CONSISTENT HEADERS & TIMING -->
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                <div class="p-3.5 rounded-2xl theme-input space-y-1 flex flex-col justify-between border ${bolus.isHighBg ? 'border-amber-400/50' : 'border-transparent'}">
                  <div class="text-[11px] font-bold opacity-80">${bolus.preHeaderTitle}</div>
                  <div class="text-2xl font-extrabold font-mono-num" style="color:${bolus.isHighBg?'#FBBF24':'inherit'}">${bolus.preUnits} ЕД</div>
                  <div class="text-[11px] opacity-95 font-semibold leading-snug">⏱ ${bolus.dynamicWaitText}</div>
                  <div class="text-[10px] opacity-80 font-mono-num pt-1 border-t border-white/10">
                    Еда: ${bolus.upfrontCarbUnits} ЕД ${bolus.ins.coversBJE && bolus.bjeUnits>0 ? `+ БЖЕ: ${bolus.bjeUnits} ЕД ` : ''}${bolus.hasBg ? `| <strong>ДПС: ${bolus.dpsRounded > 0 ? '+' : ''}${bolus.dpsRounded} ЕД</strong>` : ''}
                  </div>
                </div>
                <div class="p-3.5 rounded-2xl theme-input space-y-1 flex flex-col justify-between">
                  <div class="text-[11px] font-bold opacity-80 flex items-center">2️⃣ ПОСЛЕ ЕДЫ (БЖЕ + Хвост) ${helpBtn('bje')}</div>
                  <div class="text-2xl font-extrabold font-mono-num">${bolus.splitWaves?`${bolus.postUnits} ЕД`:'0 ЕД'}</div>
                  <div class="text-[11px] opacity-90 leading-snug">⏱ ${bolus.postTimingText}</div>
                  <div class="text-[10px] opacity-80 font-mono-num pt-1 border-t border-white/10">
                    БЖЕ: ${bolus.bjeUnits} ЕД (${bolus.bje} БЖЕ)${bolus.delayedCarbUnits > 0 ? ` + ${bolus.delayedCarbUnits} ЕД угл.` : ''}${bolus.waveHours?` · усвоение ~${bolus.waveHours}ч`:''}
                  </div>
                </div>
              </div>

              ${bolus.kineticAlerts.length > 0 ? `
                <div class="p-3.5 rounded-2xl theme-soft space-y-2 text-[11px] leading-relaxed border border-white/20">
                  ${bolus.kineticAlerts.map(a => `<div>${a}</div>`).join('')}
                </div>
              ` : ''}

              <button onclick="logInsulinInjection(${bolus.preUnits})" class="w-full py-3 px-4 rounded-2xl theme-grad text-white font-extrabold text-xs shadow flex items-center justify-center gap-1.5 cursor-pointer hover:opacity-95 transition">
                <span>⏱</span><span>Зафиксировать укол ${bolus.preUnits} ЕД (Запустить таймер IOB)</span>
              </button>

              <div class="text-[10px] opacity-75 leading-relaxed">ℹ️ <strong>Итого на прием: ${bolus.totalUnits} ЕД</strong> (округлено под шаг ${p.insulinStep} ЕД). Расчет носит рекомендательный характер.</div>
            </div>
          ` : ''}
        </div>
      </section>
    </main>

    <!-- FROZEN BOTTOM BAR -->
    <div class="fixed bottom-0 left-0 right-0 z-40 glass-card border-t px-3 py-2.5 shadow-2xl">
      <div class="max-w-7xl mx-auto grid grid-cols-12 gap-2 items-center">
        <button onclick="openHypoModal()" class="col-span-3 h-11 rounded-2xl text-white font-extrabold text-xs flex items-center justify-center gap-1 shadow-lg cursor-pointer transition" style="background:linear-gradient(135deg,#E11D48,#BE123C);border:1px solid rgba(255,255,255,0.35);">
          <span>🆘</span><span>Гипо</span>
        </button>
        <button onclick="openDoctorReportModal()" class="col-span-3 h-11 rounded-2xl theme-soft font-extrabold text-xs flex items-center justify-center gap-1.5 shadow cursor-pointer transition">
          ${IC_DOC}<span>Отчёт</span>
        </button>
        <button onclick="openAiModal()" class="col-span-6 h-11 rounded-2xl theme-grad text-white font-extrabold text-xs flex items-center justify-center gap-1.5 shadow-lg cursor-pointer transition">
          ${IC_SPARK}<span>AI-Помощник и Ментор</span>
        </button>
      </div>
    </div>

    <!-- EDUCATIONAL HELP POPUP MODAL -->
    <div id="modal-help" onclick="closeHelpModal()" class="fixed inset-0 z-50 hidden bg-black/80 backdrop-blur-md flex items-center justify-center p-3">
      <div onclick="event.stopPropagation()" class="glass-card rounded-3xl max-w-md w-full p-5 space-y-3.5 border-2 shadow-2xl max-h-[88vh] overflow-y-auto" style="border-color:#2DD4BF;">
        <div class="flex justify-between items-center gap-2">
          <h3 id="help-modal-title" class="font-extrabold text-sm sm:text-base">Справка</h3>
          <button onclick="closeHelpModal()" class="w-8 h-8 rounded-xl theme-soft font-bold flex items-center justify-center shrink-0">✕</button>
        </div>
        <div id="help-modal-text" class="text-xs leading-relaxed opacity-95 space-y-2"></div>
        <button onclick="closeHelpModal()" class="w-full py-2.5 rounded-2xl theme-grad text-white font-extrabold text-xs shadow">Понятно</button>
      </div>
    </div>

    <!-- SOS HYPOGLYCEMIA MODAL -->
    <div id="modal-hypo" class="fixed inset-0 z-50 hidden bg-black/80 backdrop-blur-md flex items-center justify-center p-3">
      <div class="glass-card rounded-3xl max-w-md w-full p-5 space-y-4 border-2 border-rose-500 shadow-2xl">
        <div class="flex justify-between items-center">
          <h3 class="font-extrabold text-base text-white px-3 py-1 rounded-xl" style="background:#E11D48;">🆘 Протокол 15/15: Низкий сахар</h3>
          <button onclick="document.getElementById('modal-hypo').classList.add('hidden')" class="w-9 h-9 rounded-2xl theme-soft font-bold flex items-center justify-center">✕</button>
        </div>
        <div class="p-3 rounded-2xl theme-input flex justify-between items-center text-xs">
          <span class="font-bold">Ваш текущий сахар (ммоль/л):</span>
          <input type="text" value="${hypoBgInput}" onchange="hypoBgInput=this.value;renderApp();openHypoModal();" onkeydown="blurOnEnter(event)" class="w-16 h-8 text-center font-mono-num font-extrabold text-sm rounded-xl theme-soft">
        </div>
        <div class="p-4 rounded-2xl bg-rose-500/20 border border-rose-400/50 space-y-2 text-xs">
          <div class="font-extrabold text-sm">Примите СЕЙЧАС: <span class="font-mono-num text-lg underline">${hypoRescue.fastCarbGrams} г</span> быстрых углеводов (${hypoRescue.xe} ХЕ)</div>
          <div class="text-[11px] opacity-90">Точный расчет для веса <strong>${p.weight} кг</strong>, чтобы плавно поднять сахар с ${hypoRescue.bg} до ${hypoRescue.target} ммоль/л без «отката»:</div>
          <ul class="space-y-1 pt-1 font-semibold">
            <li>🍬 Декстроза / Глюкоза: <strong>${hypoRescue.dextroseTabs} таб.</strong> (по 4 г)</li>
            <li>🧃 Фруктовый сок / Обычная Кола: <strong>${hypoRescue.juiceMl} мл</strong></li>
            <li>☕️ Сахар (растворить в теплой воде): <strong>${hypoRescue.sugarCubes} кус.</strong></li>
          </ul>
        </div>
        <div class="text-[11px] opacity-85 leading-relaxed">
          ⏱ <strong>Правило 15 минут:</strong> Примите быстрые углеводы, подождите 15 минут и перемерьте сахар. Не купируйте гипу шоколадом, мороженым или бутербродами — жиры затормозят подъем сахара!
        </div>
      </div>
    </div>

    <!-- DOCTOR SUMMARY REPORT MODAL -->
    <div id="modal-report" class="fixed inset-0 z-50 hidden bg-black/80 backdrop-blur-md flex items-center justify-center p-3">
      <div class="glass-card rounded-3xl max-w-md w-full p-5 space-y-4 border-2 shadow-2xl" style="border-color:var(--brand);">
        <div class="flex justify-between items-center">
          <h3 class="font-extrabold text-base">📋 Клиническая сводка DIAingo</h3>
          <button onclick="document.getElementById('modal-report').classList.add('hidden')" class="w-9 h-9 rounded-2xl theme-soft font-bold flex items-center justify-center">✕</button>
        </div>
        <div id="report-text-box" class="p-3.5 rounded-2xl theme-input text-xs font-mono-num space-y-1.5 leading-relaxed">
          <div><strong>Профиль:</strong> ${p.gender==='male'?'Мужчина':'Женщина'}, ${p.age} лет, ${p.height} см, ${p.weight} кг (ИМТ ${m.bmi})</div>
          <div><strong>Цель:</strong> ${p.targetWeight} кг за ${p.targetWeeks} нед. (Норма: ${m.effectiveKcal} ккал)</div>
          <div><strong>Суточное БЖУ:</strong> Б ${m.normP}г / Ж ${m.normF}г / У ${m.normC}г ${p.diabetesType!=='none'?`(${m.totalXE} ХЕ)`:''}</div>
          ${p.diabetesType !== 'none' ? `
            <div><strong>Инсулин:</strong> ${dayPlan.ins.name} (шаг ${p.insulinStep} ЕД)</div>
            <div><strong>Коэффициенты УК:</strong> Базовый ${p.icr} (Утро ${+(p.icr*1.15).toFixed(2)} / День ${p.icr} / Вечер ${+(p.icr*0.9).toFixed(2)})</div>
            <div><strong>ФЧИ (Правило 100):</strong> 1 ЕД = -${dayPlan.effectiveIsf} ммоль/л · Цель ГК: ${p.targetBg}</div>
            <div><strong>Суточная доза (СДИ):</strong> ~${dayPlan.totalDailyDose} ЕД (Болюс ${dayPlan.totalBolusDay} ЕД + База ${dayPlan.effectiveBasal} ЕД [${dayPlan.basalPct}%])</div>
          ` : `<div><strong>Углеводный обмен:</strong> Стандартный режим (без инсулинотерапии)</div>`}
        </div>
        <button onclick="copyDoctorReport()" class="w-full py-3 rounded-2xl theme-grad text-white font-extrabold text-xs shadow">📄 Скопировать сводку в буфер обмена</button>
      </div>
    </div>

    <!-- AI MENTOR MODAL WITH VERIFIED EXTERNAL CONNECTION STATUS -->
    <div id="modal-ai" class="fixed inset-0 z-50 hidden bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-5">
      <div class="glass-card rounded-3xl max-w-xl w-full p-5 sm:p-6 space-y-4 max-h-[92vh] overflow-y-auto shadow-2xl border-2 pb-8" style="border-color:var(--brand);">
        <div class="flex justify-between items-center sticky top-0 py-2.5 px-3.5 z-10 rounded-2xl glass-card border border-white/10 gap-2 mb-1" style="background: var(--card-bg);">
          <div class="flex items-center gap-2 min-w-0">
            ${LOGO_SVG}
            <h3 class="font-extrabold text-sm sm:text-base leading-tight truncate">Клинический Ментор</h3>
          </div>
          <div class="flex items-center gap-2 shrink-0">
            <button onclick="toggleAiMode()" class="h-9 px-3 rounded-2xl font-extrabold text-xs inline-flex flex-row items-center gap-1.5 whitespace-nowrap transition cursor-pointer ${isAiTrulyActive ? 'theme-grad text-white shadow-lg ring-2 ring-white/30' : 'theme-input opacity-65 hover:opacity-100'}" title="${isAiTrulyActive ? 'Внешний ИИ подключен и активен' : 'Локальный режим (нажмите для проверки и подключения внешнего ИИ)'}">
              ${IC_SPARK}
              <span>${aiCheckingStatus ? 'Проверка...' : 'AI'}</span>
              <span class="w-2 h-2 rounded-full ${aiCheckingStatus ? 'bg-amber-400 animate-ping' : (isAiTrulyActive ? 'bg-emerald-300 animate-pulse' : 'bg-white/30')}"></span>
            </button>
            <button onclick="document.getElementById('modal-ai').classList.add('hidden')" class="w-9 h-9 rounded-2xl theme-soft font-bold flex items-center justify-center shrink-0">✕</button>
          </div>
        </div>

        <div class="p-4 rounded-3xl theme-input space-y-2.5 border border-white/20">
          <div class="text-xs font-extrabold">💬 Задайте любой вопрос ментору:</div>
          <div class="flex gap-1.5">
            <input type="text" id="inp-ai-question" onkeydown="if(event.key==='Enter'){event.preventDefault();askAiMentor(this.value);}" placeholder="Что такое гипергликемия? Как колоть на пиццу?" class="flex-1 h-10 px-3 rounded-xl theme-soft text-xs">
            <button onmousedown="event.preventDefault();askAiMentor()" onclick="askAiMentor()" class="h-10 px-4 rounded-xl theme-grad text-white font-extrabold text-xs shrink-0 shadow cursor-pointer">Спросить</button>
          </div>
          <div class="flex flex-wrap gap-1 pt-0.5">
            <button onclick="askAiMentor('Что такое диабет и как работает инсулин?')" class="px-2 py-1 rounded-lg theme-soft text-[10px] font-bold">Что такое диабет?</button>
            <button onclick="askAiMentor('Что такое гипергликемия и как сбить высокий сахар?')" class="px-2 py-1 rounded-lg theme-soft text-[10px] font-bold">Гипергликемия</button>
            <button onclick="askAiMentor('Что такое гипогликемия и как поднять низкий сахар?')" class="px-2 py-1 rounded-lg theme-soft text-[10px] font-bold">Гипогликемия</button>
            <button onclick="askAiMentor('Как компенсировать пиццу, жиры и белки?')" class="px-2 py-1 rounded-lg theme-soft text-[10px] font-bold">Жиры и БЖЕ</button>
          </div>
          <div id="ai-chat-box" class="${aiChatAnswer ? '' : 'hidden'} p-3 rounded-2xl theme-soft text-xs leading-relaxed border border-white/15 space-y-1">${aiChatAnswer}</div>
        </div>

        <div class="p-4 rounded-3xl theme-soft space-y-1.5 shadow-sm">
          <div class="font-extrabold text-xs flex items-center justify-between gap-2">
            <span>⭐ Вдохновляющая история успеха</span>
            <button onclick="rotateStory()" class="w-9 h-9 rounded-2xl theme-input flex items-center justify-center cursor-pointer shadow-sm shrink-0">${isAiTrulyActive ? IC_SPARK : IC_REFRESH}</button>
          </div>
          <div id="story-name-box" class="text-xs font-extrabold mt-1">${currentStory.name}</div>
          <div id="story-desc-box" class="text-[11px] opacity-90 leading-relaxed">${currentStory.desc}</div>
        </div>

        <div class="p-4 rounded-3xl theme-input space-y-2 border border-white/15">
          <div class="font-extrabold text-xs flex items-center justify-between gap-2">
            <span>❤️ Слово тепла и поддержки для вас</span>
            <button onclick="rotateSupport()" class="w-9 h-9 rounded-2xl theme-soft flex items-center justify-center cursor-pointer shadow-sm shrink-0">${isAiTrulyActive ? IC_SPARK : IC_REFRESH}</button>
          </div>
          <div id="support-text-box" class="text-xs leading-relaxed opacity-95 mt-1">${currentSupport}</div>
        </div>

        <div class="space-y-2">
          <button onclick="toggleNews()" class="w-full py-3 px-4 rounded-2xl theme-soft font-extrabold text-xs flex items-center justify-center gap-2 cursor-pointer transition">
            <span>🚀</span><span>${newsBoxOpen ? 'Скрыть научные прорывы' : 'Открыть научные прорывы и достижения'}</span>
          </button>
          <div class="${newsBoxOpen ? '' : 'hidden'} p-4 rounded-3xl theme-input space-y-2.5 text-[11px]">
            <div class="flex justify-between items-center font-bold text-xs mb-1">
              <span>Последние достижения науки</span>
              <button onclick="refreshNews()" class="h-8 px-3 rounded-xl theme-soft text-[11px] font-extrabold inline-flex items-center gap-1.5">${isAiTrulyActive ? IC_SPARK : IC_REFRESH}<span>Обновить</span></button>
            </div>
            <div class="space-y-2">
              ${breakthroughsList.map(b=>`<div class="p-3 rounded-2xl theme-soft"><div class="font-bold flex items-center justify-between gap-2"><span>${b.title}</span><span class="opacity-75 font-mono-num shrink-0">${b.yr}</span></div><div class="opacity-85 mt-1 leading-relaxed">${b.desc}</div></div>`).join('')}
            </div>
          </div>
        </div>

        <button onclick="rotateSupport(); rotateStory();" class="w-full py-3.5 px-4 rounded-2xl theme-grad text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-xl cursor-pointer">
          <span>❤️</span><span>Получить новую порцию тепла и поддержки</span>
        </button>

        <details id="api-key-details" class="p-3 rounded-2xl theme-input text-xs opacity-75 hover:opacity-100 transition">
          <summary class="cursor-pointer text-[11px] font-bold">🔑 Персональный ключ Gemini API (для внешнего AI)</summary>
          <div class="pt-2.5 flex flex-col gap-2">
            <div class="flex justify-between items-center">
              <span class="text-[10px] opacity-80">Бесплатный ключ Google AI Studio:</span>
              <a href="https://aistudio.google.com/app/apikey" target="_blank" class="text-[10px] underline font-bold">Получить ключ ↗</a>
            </div>
            <div class="flex gap-1.5 items-center">
              <input type="password" id="inp-gemini-key" value="${localStorage.getItem('nutricalc_gemini_key')||''}" onkeydown="blurOnEnter(event)" placeholder="AIzaSy..." class="flex-1 h-9 px-3 rounded-xl theme-soft text-xs font-mono-num">
              <button onclick="saveApiKey()" class="h-9 px-4 rounded-xl theme-grad text-white text-xs font-extrabold shrink-0">Проверить и ОК</button>
            </div>
          </div>
        </details>
      </div>
    </div>`;
}

function openAiModal() { document.getElementById('modal-ai').classList.remove('hidden'); }
function openHypoModal() { document.getElementById('modal-hypo').classList.remove('hidden'); }
function openDoctorReportModal() { document.getElementById('modal-report').classList.remove('hidden'); }

function copyDoctorReport() {
  const el = document.getElementById('report-text-box');
  if (!el) return;
  navigator.clipboard.writeText(el.innerText).then(() => {
    alert('✅ Сводка скопирована! Вы можете отправить её врачу или сохранить в заметки.');
  });
}

async function askAiMentor(presetQuery, forceCloud = false) {
  const inp = document.getElementById('inp-ai-question');
  const box = document.getElementById('ai-chat-box');
  const q = (typeof presetQuery === 'string' && presetQuery.trim()) ? presetQuery.trim() : (inp ? inp.value.trim() : '');
  if (!q) return;
  if (inp) { inp.value = ''; inp.blur(); }

  const p = getProf(), m = computeMetrics(), dayPlan = computeDailyInsulinPlan(m, p);
  const instant = getInstantMentorAnswer(q, p, m, dayPlan);
  const safeQ = q.replace(/'/g, '').replace(/"/g, '');
  const isAiTrulyActive = aiModeEnabled && aiConnectionVerified;

  if (!forceCloud && instant.matched) {
    aiChatAnswer = `
      <div>${instant.html}</div>
      ${isAiTrulyActive ? `<div class="pt-2 mt-2 border-t border-white/10 flex justify-end"><button onclick="askAiMentor('${safeQ}', true)" class="px-2.5 py-1 rounded-xl theme-input text-[10px] font-extrabold inline-flex items-center gap-1 cursor-pointer" style="color:#2DD4BF;">✨ Спросить внешнюю нейросеть AI</button></div>` : ''}
    `;
    if (box) {
      box.classList.remove('hidden');
      box.innerHTML = aiChatAnswer;
    }
    return;
  }

  if (isAiTrulyActive) {
    if (box) {
      box.classList.remove('hidden');
      box.innerHTML = `<div class="flex items-center gap-2 font-bold animate-pulse">${IC_SPARK}<span>Внешний AI формирует ответ...</span></div>`;
    }
    const sys = `Ментор DIAingo. Профиль: ${p.weight}кг, норма ${m.effectiveKcal}ккал (Б:${m.normP}г, Ж:${m.normF}г, У:${m.normC}г), УК:${p.icr}, ФЧИ:${dayPlan.effectiveIsf}, база:${dayPlan.effectiveBasal}ЕД. Ответь прямо на вопрос (3 предложения), научно и тепло. Без слова болезнь.`;
    const cloudAns = await callSmartAi(q, sys);
    if (cloudAns) {
      aiChatAnswer = `<strong>✨ Ответ внешнего AI-ментора:</strong><br>${cloudAns.replace(/\n/g, '<br>')}`;
      if (box) box.innerHTML = aiChatAnswer;
      return;
    } else {
      renderApp();
      openAiModal();
    }
  }

  aiChatAnswer = instant.html;
  const boxAfter = document.getElementById('ai-chat-box');
  if (boxAfter) {
    boxAfter.classList.remove('hidden');
    boxAfter.innerHTML = aiChatAnswer;
  }
}

function rotateStory() {
  currentStory = DIABETES_STORIES[(DIABETES_STORIES.indexOf(currentStory) + 1) % DIABETES_STORIES.length];
  const nEl = document.getElementById('story-name-box');
  const dEl = document.getElementById('story-desc-box');
  if (nEl) nEl.textContent = currentStory.name;
  if (dEl) dEl.textContent = currentStory.desc;

  aiTurnCounter++;
  if (aiModeEnabled && aiConnectionVerified && aiTurnCounter % 2 === 1) {
    callSmartAi('Напиши 1 реальную историю известного человека с сахарным диабетом. Без слова болезнь. Формат: ЭМОДЗИ Имя | 2 предложения.').then(res => {
      if (res && res.includes('|')) {
        const parts = res.split('|');
        currentStory = { name: parts[0].trim() + ' ✨', desc: parts.slice(1).join(' ').trim() };
        if (document.getElementById('story-name-box')) document.getElementById('story-name-box').textContent = currentStory.name;
        if (document.getElementById('story-desc-box')) document.getElementById('story-desc-box').textContent = currentStory.desc;
      }
    });
  }
}

function rotateSupport() {
  currentSupport = DIABETES_SUPPORT_PHRASES[(DIABETES_SUPPORT_PHRASES.indexOf(currentSupport) + 1) % DIABETES_SUPPORT_PHRASES.length];
  const sEl = document.getElementById('support-text-box');
  if (sEl) sEl.textContent = currentSupport;

  aiTurnCounter++;
  if (aiModeEnabled && aiConnectionVerified && aiTurnCounter % 2 === 0) {
    const p = getProf();
    callSmartAi(`Напиши 2 теплых предложения поддержки для ${p.gender === 'female' ? 'женщины' : 'мужчины'}, которая контролирует сахар и питание. Без слова болезнь.`).then(res => {
      if (res && res.length > 20) {
        currentSupport = res + ' ✨';
        if (document.getElementById('support-text-box')) document.getElementById('support-text-box').textContent = currentSupport;
      }
    });
  }
}

function toggleNews() { newsBoxOpen = !newsBoxOpen; renderApp(); openAiModal(); }

async function refreshNews() {
  breakthroughsList.push(breakthroughsList.shift());
  renderApp(); openAiModal();
  if (aiModeEnabled && aiConnectionVerified) {
    const res = await callSmartAi('Напиши 1 научный прорыв в контроле гликемии (2025-2026). Формат: ЭМОДЗИ Заголовок | 1 предложение.');
    if (res && res.includes('|')) {
      const parts = res.split('|');
      breakthroughsList.unshift({ yr: '2026 ✨', title: parts[0].trim(), desc: parts.slice(1).join(' ').trim() });
      if (breakthroughsList.length > 5) breakthroughsList = breakthroughsList.slice(0, 5);
      renderApp(); openAiModal();
    }
  }
}

async function saveApiKey() {
  const val = document.getElementById('inp-gemini-key').value.trim();
  localStorage.setItem('nutricalc_gemini_key', val);
  if (!val) {
    aiModeEnabled = false;
    aiConnectionVerified = false;
    localStorage.setItem('nutricalc_ai_mode', 'false');
    renderApp(); openAiModal();
    return;
  }
  aiCheckingStatus = true;
  renderApp(); openAiModal();
  const ok = await verifyExternalAiConnection();
  aiCheckingStatus = false;
  if (ok) {
    aiModeEnabled = true;
    aiConnectionVerified = true;
    localStorage.setItem('nutricalc_ai_mode', 'true');
    alert('✅ Подключение к внешнему AI подтверждено! Режим AI активирован.');
  } else {
    aiModeEnabled = false;
    aiConnectionVerified = false;
    localStorage.setItem('nutricalc_ai_mode', 'false');
    alert('⚠️ Ключ сохранен, но сервер не ответил (проверьте ключ или VPN). Кнопка AI оставлена неактивной.');
  }
  renderApp(); openAiModal();
}

async function initAiStatusOnLoad() {
  if (localStorage.getItem('nutricalc_ai_mode') === 'true') {
    const ok = await verifyExternalAiConnection();
    if (ok) {
      aiModeEnabled = true;
      aiConnectionVerified = true;
      renderApp();
    } else {
      aiModeEnabled = false;
      aiConnectionVerified = false;
    }
  }
}

loadStorage();
renderApp();
initAiStatusOnLoad();
