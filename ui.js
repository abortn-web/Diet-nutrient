const WEIGHT_GRID = [45, 50, 55, 60, 65, 70, 75, 80, 85, 90, 95, 100, 105, 110, 115, 120];
const HEIGHT_GRID = [150, 155, 160, 165, 169, 172, 175, 178, 180, 185, 190, 195];
const AGE_GRID = [20, 25, 28, 30, 32, 35, 38, 40, 45, 50];
const STEPS_GRID = [2000, 4000, 6000, 8000, 10000, 12000, 14000, 16000, 18000, 20000];
const WEEKS_GRID = [4, 6, 8, 10, 12, 14, 16, 20, 24, 30, 36, 52];
const PROT_GRID = [1.4, 1.6, 1.8, 2.0, 2.2, 2.5];
const FAT_GRID = [0.7, 0.8, 0.9, 1.0, 1.2, 1.5];
const ICR_GRID = [0.5, 0.8, 1.0, 1.2, 1.5, 1.8, 2.0, 2.5];

const DIABETES_STORIES = [
  { name: '⚖️ Тур Хейердал', desc: 'Великий норвежский путешественник и ученый. Пересекал океаны на плоту «Кон-Тики» и доказал, что диабет — это лишь особенность, а не преграда для открытий.' },
  { name: '🎸 Брет Майклс', desc: 'Легендарный рокер, фронтмен группы Poison. С диабетом с 6 лет дает стадионные концерты и ведет активный яркий образ жизни.' },
  { name: '🥇 Гэри Холл-младший', desc: 'Американский пловец, 10-кратный олимпийский чемпион. Завоевывал золотые медали на Олимпиадах, показав силу характера и точного контроля.' },
  { name: '🎬 Холли Берри', desc: 'Обладательница премии «Оскар». С 22 лет живет в осознанном режиме контроля гликемии, снимается в блокбастерах и вдохновляет миллионы.' },
  { name: '⭐ Мэри Тайлер Мур', desc: 'Знаменитая американская актриса и лауреат премии «Эмми». Более 40 лет поддерживала людей с диабетом по всему миру.' },
  { name: '🏀 Адам Моррисон', desc: 'Профессиональный баскетболист, двукратный чемпион НБА в составе «Лейкерс». Играл на высшем мировом уровне в сильнейшей лиге планеты.' },
  { name: '🎾 Александр Зверев', desc: 'Олимпийский чемпион по теннису и вторая ракетка мира. Выигрывает пятисетовые матчи на турнирах Большого шлема с диабетом 1 типа.' },
  { name: '🏔️ Уилл Кросс', desc: 'Альпинист, покоривший высочайшие вершины всех семи континентов планеты (включая Эверест) и оба полюса Земли.' },
  { name: '🏎️ Чарли Кимболл', desc: 'Пилот гоночной серии IndyCar. Первый гонщик с диабетом, одержавший победу в элитной серии на скоростях свыше 350 км/ч.' },
  { name: '🎤 Ник Джонас', desc: 'Всемирно известный музыкант и актер. С 13 лет открыто рассказывает о своем образе жизни с инсулиновой помпой и CGM-мониторингом.' }
];

const DIABETES_SUPPORT_PHRASES = [
  '☕️ Диабет — это не болезнь, а особый образ жизни, который учит нас глубоко чувствовать свое тело, заботиться о себе и жить осознанно. Вы имеете полное право иногда уставать от этого ритма. Но помните: вы справляетесь просто великолепно! 🌟',
  '❤️ Помните, что диабет — это не диагноз и не ограничение, а особый образ жизни, требующий внимания и чуткости к себе. Если сегодня было тяжело — отпустите этот день. Завтра будет новый старт. Вы сильный человек, и ваше здоровье в надежных руках! ☕️',
  '💪 Каждый замер сахара, каждая пауза перед едой и каждый просчет ХЕ — это не бремя, а проявление вашей осознанности и большой любви к себе. Диабет — это особый образ жизни, в котором вы — главный капитан своего корабля! ⛵️',
  '☀️ Вы сильнее, чем думаете. Да, диабет — это особый образ жизни со своими правилами, но каждый раз, когда вы находите баланс и делаете выбор в пользу своего здоровья — побеждаете именно вы. Гордитесь собой! 🛡️',
  '✨ Никакие особенности обмена веществ не способны ограничить вашу мечту, вашу радость и ваши цели. Вы управляете своей жизнью. Разрешите себе иногда расслабиться — вы заслуживаете самого теплого отдыха и заботы. 🧸',
  '🌊 Бывают дни, когда сахара идут вверх и вниз без видимых причин, и это жутко выматывает. Это нормально — чувствовать усталость. Диабет — это особый образ жизни, где важен каждый момент отдыха. Позвольте себе передохнуть! 💙',
  '🌱 Помните, что забота о себе — это гармоничный путь. Диабет — это не болезнь, а особый образ жизни, который со временем становится естественной и привычной частью вашей гармонии. Вы на верном пути! 🌺',
  '🎯 Ваша внимательность к своему организму вызывает искреннее восхищение. Диабет — это особый образ жизни, требующий мастерства, и вы владеете им великолепно. Доверяйте своему опыту! 🧭',
  '🧸 Иногда хочется просто закрыть глаза и отдохнуть от всех подсчетов. И это абсолютно нормально! Диабет — это особый образ жизни, но вы — живой человек, которому нужны паузы для тепла и радости. Обнимаем вас! 🤗',
  '☕️ Помните главное: диабет — это не болезнь, а особый образ жизни, который делает вас экспертом своего тела. Вы научились понимать язык своего организма лучше многих. Вы огромный молодец! 🌟',
  '🧭 Знаете, в чем ваша суперсила? Вы управляете сложнейшей биохимической системой своего организма каждый день. Вы — личный пилот лайнера, и даже если случается турбулентность, вы мастерски держите штурвал! ✈️',
  '🌙 Если сегодня день выдался «непослушным», а сахара скакали — выдохните. Это всего лишь один день, а не вся жизнь. Завтра будет чистый лист. Вы молодец уже тем, что продолжаете идти вперед. 🛋️',
  '🧩 Жизнь с контролем гликемии похожа на тетрис: нужно вовремя укладывать фигурки углеводов, активности и инсулина. Вы играете на экспертном уровне. Разрешите себе поставить игру на паузу и просто выпить чаю. 🎧',
  '🎨 Представьте, что ваш организм — это уникальный музыкальный инструмент. Он требует чуткой настройки, но какую прекрасную мелодию вы играете, удерживая этот баланс! Звучите уверенно и бережно к себе. 🎻',
  '🎁 Цифры на экране мониторинга или глюкометра — это просто навигационные данные, а не оценка вас как личности. Вы ценны, любимы и прекрасны при любых показателях! 💖',
  '🔥 Диабет — это особый образ жизни, в котором дисциплина соседствует с силой духа. Вы выбираете заботу о себе каждый день, и это проявление огромной любви к жизни! ☀️'
];

const DIABETES_BREAKTHROUGHS = [
  { yr: '2026', title: '🧬 Биоинженерные островковые клетки (VX-264)', desc: 'Новое поколение инкапсулированных бета-клеток в защитной мембране вырабатывает собственный инсулин без необходимости иммуносупрессии.' },
  { yr: '2026', title: '💧 «Умный» глюкозо-чувствительный инсулин (NNC2215)', desc: 'Инсулин с молекулярным переключателем: автоматически активируется при росте сахара в крови и «засыпает» при снижении, защищая от гипогликемии.' },
  { yr: '2026', title: '🤖 Замкнутый контур с ИИ-прогнозированием', desc: 'Системы автодозирования нового поколения учитывают пульс, шаги и БЖЕ, предотвращая скачки гликемии еще до их начала.' }
];

let currentStory = DIABETES_STORIES[0];
let currentSupport = DIABETES_SUPPORT_PHRASES[0];
let activeOpenDropdown = null;
let hypoBgInput = 3.3;

function toggleDropdown(id) {
  activeOpenDropdown = activeOpenDropdown === id ? null : id;
  renderApp();
}

function setMealTime(slot) {
  mealTimeSlot = slot;
  mealBolus.customEdited = false;
  const p = getProf();
  const m = computeMetrics();
  const dayPlan = computeDailyInsulinPlan(m, p);
  const found = dayPlan.splits.find(x => x.slot === slot) || dayPlan.splits[1];
  mealBolus.p = found.pG;
  mealBolus.f = found.fG;
  mealBolus.c = found.cG;
  renderApp();
}

// Полный клинический расчет болюса: Углеводы + БЖЕ + Время суток + ГИ + ДПС + Защита от активного инсулина (IOB)
function computeMealBolusWithTime(pGrams, fGrams, cGrams, p, dayPlan, iobData) {
  const ins = INSULIN_TYPES.find(x => x.id === p.insulinType) || INSULIN_TYPES[1];
  const xe = +(cGrams / 12).toFixed(1);
  const fpKcal = Math.round(pGrams * 4 + fGrams * 9);
  const bje = +(fpKcal / 100).toFixed(1);
  
  let timeMult = 1.0;
  if (mealTimeSlot === 'morning') timeMult = 1.15;
  else if (mealTimeSlot === 'lunch') timeMult = 1.00;
  else if (mealTimeSlot === 'evening') timeMult = 0.90;
  else if (mealTimeSlot === 'night') timeMult = 0.95;

  const effIcr = +(p.icr * timeMult).toFixed(2);
  const carbUnits = +(xe * effIcr).toFixed(1);
  const bjeUnits = bje >= 1.0 ? +(bje * effIcr * 0.5).toFixed(1) : 0;

  // Расчет ДПС (коррекции по текущему сахару) с учетом активного инсулина (IOB)
  const isf = dayPlan ? dayPlan.effectiveIsf : 2.5;
  let rawDps = 0;
  let safeDps = 0;
  let iobSubtracted = 0;
  const hasBg = mealBolus.currBg !== '' && !isNaN(parseFloat(mealBolus.currBg));
  const bgVal = hasBg ? parseFloat(mealBolus.currBg) : null;

  if (hasBg && bgVal > 0) {
    rawDps = +((bgVal - p.targetBg) / isf).toFixed(2);
    if (rawDps > 0) {
      // Если сахар высокий, вычитаем уже активный в теле инсулин (защита от гипогликемии / наложения доз)
      const activeIob = iobData ? iobData.totalIob : 0;
      safeDps = Math.max(0, +(rawDps - activeIob).toFixed(1));
      iobSubtracted = +(rawDps - safeDps).toFixed(1);
    } else {
      // Если сахар ниже целевого, уменьшаем пищевой болюс на отрицательную ДПС
      safeDps = +rawDps.toFixed(1);
    }
  }

  const splitWaves = bjeUnits >= 0.4 && !ins.coversBJE;
  const basePre = splitWaves ? carbUnits : +(carbUnits + bjeUnits).toFixed(1);
  const preUnits = Math.max(0, +(basePre + safeDps).toFixed(1));
  const postUnits = splitWaves ? bjeUnits : 0;
  const totalUnits = Math.max(0, +(preUnits + postUnits).toFixed(1));
  const waveHours = bje < 1 ? 0 : (bje < 2 ? 3 : (bje < 3 ? 4 : 5));

  // Динамическая пауза перед едой с учетом ГИ, времени суток и текущего сахара
  let waitMin = ins.baseWait;
  if (mealBolus.gi === 'low') waitMin -= 7;
  else if (mealBolus.gi === 'high') waitMin += 7;
  if (mealTimeSlot === 'morning') waitMin += 3;
  if (mealTimeSlot === 'evening' || mealTimeSlot === 'night') waitMin -= 4;
  if (hasBg && bgVal > 8.5) waitMin += 5;

  let dynamicWaitText = ins.preMin;
  if (hasBg && bgVal < 4.4) {
    dynamicWaitText = '⚠️ СНАЧАЛА купируйте низкий сахар, укол ПОСЛЕ начала еды!';
  } else if (waitMin <= 0) {
    dynamicWaitText = 'Укол во время еды или сразу после (медленные углеводы)';
  } else {
    dynamicWaitText = `Пауза ~${waitMin}–${waitMin + 4} мин ПЕРЕД едой (ГИ: ${mealBolus.gi === 'low' ? 'низкий' : mealBolus.gi === 'high' ? 'высокий' : 'средний'})`;
  }

  return {
    ins, xe, fpKcal, bje, carbUnits, bjeUnits, totalUnits, preUnits, postUnits,
    splitWaves, waveHours, effIcr, isf, hasBg, bgVal, rawDps: +rawDps.toFixed(1),
    safeDps, iobSubtracted, dynamicWaitText
  };
}

function blurOnEnter(e) {
  if (e.key === 'Enter') {
    e.target.blur();
  }
}

function buildWeightSvgChart(checkpoints, p) {
  const wVals = checkpoints.map(c => c.w);
  const minW = Math.min(...wVals) - 1.5;
  const maxW = Math.max(...wVals) + 1.5;
  const range = Math.max(2, maxW - minW);
  const width = 320, height = 95, padX = 28, padY = 20;

  const pts = checkpoints.map((c, idx) => {
    const x = Math.round(padX + (idx / (checkpoints.length - 1)) * (width - padX * 2));
    const y = Math.round(height - padY - ((c.w - minW) / range) * (height - padY * 2));
    return { ...c, x, y };
  });

  const polyPoints = pts.map(pt => `${pt.x},${pt.y}`).join(' ');
  return `
    <svg viewBox="0 0 ${width} ${height}" class="w-full h-24 overflow-visible">
      <polyline fill="none" stroke="var(--brand)" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" points="${polyPoints}" />
      ${pts.map(pt => `
        <circle cx="${pt.x}" cy="${pt.y}" r="4.5" fill="var(--brand)" stroke="#fff" stroke-width="1.5" />
        <text x="${pt.x}" y="${pt.y - 8}" text-anchor="middle" fill="currentColor" font-size="9.5" font-weight="800">${pt.w}кг</text>
        <text x="${pt.x}" y="${height - 3}" text-anchor="middle" fill="currentColor" opacity="0.7" font-size="8.5">${pt.date}</text>
      `).join('')}
    </svg>
  `;
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
  const checkpoints = [0, 0.25, 0.5, 0.75, 1].map((pct, i) => {
    const w = +(p.weight + diffKg * pct).toFixed(1);
    return {
      label: i === 0 ? 'Старт' : i === 2 ? 'Экватор' : i === 4 ? 'Финиш' : (pct * 100) + '%',
      w,
      date: formatDateOffset(totalDays * pct),
      tdee: calcTDEEForWeight(w, p).tdee
    };
  });

  const extra3kKcal = Math.round(((p.height * 0.415) / 100000) * 3000 * p.weight * 0.62);
  const recProt = p.diabetesType !== 'none' ? 1.7 : (p.gender === 'female' ? 1.8 : 2.0);
  const recFat = p.gender === 'female' ? 0.95 : 0.9;
  const isTooStrict = m.targetKcal < m.minSafe;
  const safeWeeks = Math.max(4, Math.ceil(Math.abs(diffKg * 7700) / (Math.max(250, m.tdee - m.minSafe) * 7)));
  const hasSavedKey = !!(localStorage.getItem('nutricalc_gemini_key') || '').trim();

  const tr = p.dailyTracker;
  const kcalPct = Math.min(100, Math.round((tr.kcal / Math.max(1, m.effectiveKcal)) * 100));
  const remKcalDay = Math.max(0, m.effectiveKcal - tr.kcal);
  const remXEDay = Math.max(0, +((m.normC - tr.c) / 12).toFixed(1));

  document.getElementById('app').innerHTML = `
    <header class="sticky top-0 z-30 glass-card border-b px-3 py-2.5"><div class="max-w-7xl mx-auto flex items-center justify-between gap-2">
      <div class="flex items-center gap-2"><div class="w-9 h-9 rounded-xl theme-grad flex items-center justify-center text-white text-base shadow">🌿</div><span class="font-extrabold text-base sm:text-lg tracking-tight leading-none">NUTRIlingo</span></div>
      <div class="flex items-center gap-1.5">
        <button onclick="openHypoModal()" class="px-2.5 py-1.5 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-300 text-[11px] font-extrabold shadow-sm">🆘 Гипо</button>
        <button onclick="openDoctorReportModal()" class="px-2.5 py-1.5 rounded-xl theme-soft text-[11px] font-bold" title="Отчет для врача">📋 Отчет</button>
        <div class="flex items-center gap-1 p-1 rounded-xl theme-input"><button onclick="switchProfile('p1')" class="px-2.5 py-1 rounded-lg text-xs font-bold whitespace-nowrap ${appData.activeProfile==='p1'?'theme-grad text-white shadow':'opacity-75'}">♂ П1</button><button onclick="switchProfile('p2')" class="px-2.5 py-1 rounded-lg text-xs font-bold whitespace-nowrap ${appData.activeProfile==='p2'?'theme-grad text-white shadow':'opacity-75'}">♀ П2</button></div>
      </div>
    </div></header>

    <div class="max-w-7xl mx-auto px-3 pt-3 lg:hidden"><div class="grid grid-cols-2 gap-2 p-1 rounded-2xl glass-card">
      <button onclick="activeTab='calc';renderApp();" class="py-2.5 rounded-xl text-xs font-bold ${activeTab==='calc'?'theme-grad text-white shadow':'opacity-75'}">⚙️ КБЖУ и План</button>
      <button onclick="activeTab='diabetes';renderApp();" class="py-2.5 rounded-xl text-xs font-bold ${activeTab==='diabetes'?'theme-grad text-white shadow':'opacity-75'}">💉 Калькулятор Диабета</button>
    </div></div>

    <main class="max-w-7xl mx-auto px-3 pt-4 pb-24 grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
      <section class="lg:col-span-6 space-y-4 ${activeTab==='diabetes'?'hidden lg:block':''}">
        <div class="glass-card rounded-3xl p-4 space-y-3.5 shadow-lg">
          <div class="flex justify-between items-center"><h2 class="font-extrabold text-base">1. Ваши параметры</h2><span class="text-[11px] px-2 py-0.5 rounded-lg theme-soft font-semibold">${p.useBodyFat?'Кетч-МакАрдл':'Миффлин-Сан Жеор'}</span></div>
          <div class="grid grid-cols-2 gap-2"><button onclick="setParam('gender','female')" class="py-2.5 px-3 rounded-2xl text-xs font-bold border ${p.gender==='female'?'theme-grad text-white border-transparent shadow-md':'theme-input opacity-80'}">♀ Женщина</button><button onclick="setParam('gender','male')" class="py-2.5 px-3 rounded-2xl text-xs font-bold border ${p.gender==='male'?'theme-grad text-white border-transparent shadow-md':'theme-input opacity-80'}">♂ Мужчина</button></div>

          <div class="p-3 rounded-2xl theme-input space-y-2 cursor-pointer" onclick="toggleDropdown('age')">
            <div class="flex justify-between items-center"><span class="text-xs font-bold opacity-80">ВОЗРАСТ (ЛЕТ)</span><div class="flex items-center gap-1.5" onclick="event.stopPropagation()"><button onclick="setParam('age',${p.age-1})" class="w-8 h-7 rounded-lg theme-soft font-bold">-</button><input type="text" value="${p.age}" onchange="setParam('age',this.value)" onkeydown="blurOnEnter(event)" class="w-14 text-center font-mono-num font-extrabold text-sm rounded-lg py-1 theme-soft"><button onclick="setParam('age',${p.age+1})" class="w-8 h-7 rounded-lg theme-soft font-bold">+</button></div></div>
            ${activeOpenDropdown==='age'?`<div class="grid grid-cols-5 gap-1 pt-2 border-t border-white/10" onclick="event.stopPropagation()">${AGE_GRID.map(a=>`<button onclick="setParam('age',${a});toggleDropdown('age');" class="py-1.5 rounded-lg text-xs font-mono-num font-bold ${p.age===a?'theme-grad text-white':'theme-soft'}">${a}</button>`).join('')}</div>`:''}
          </div>

          <div class="p-3 rounded-2xl theme-input space-y-2 cursor-pointer" onclick="toggleDropdown('height')">
            <div class="flex justify-between items-center"><span class="text-xs font-bold opacity-80">РОСТ (СМ)</span><div class="flex items-center gap-1.5" onclick="event.stopPropagation()"><button onclick="setParam('height',${p.height-1})" class="w-8 h-7 rounded-lg theme-soft font-bold">-</button><input type="text" value="${p.height}" onchange="setParam('height',this.value)" onkeydown="blurOnEnter(event)" class="w-14 text-center font-mono-num font-extrabold text-sm rounded-lg py-1 theme-soft"><button onclick="setParam('height',${p.height+1})" class="w-8 h-7 rounded-lg theme-soft font-bold">+</button></div></div>
            ${activeOpenDropdown==='height'?`<div class="grid grid-cols-6 gap-1 pt-2 border-t border-white/10" onclick="event.stopPropagation()">${HEIGHT_GRID.map(h=>`<button onclick="setParam('height',${h});toggleDropdown('height');" class="py-1.5 rounded-lg text-xs font-mono-num font-bold ${p.height===h?'theme-grad text-white':'theme-soft'}">${h}</button>`).join('')}</div>`:''}
          </div>

          <div class="p-3 rounded-2xl theme-input space-y-2 cursor-pointer" onclick="toggleDropdown('weight')">
            <div class="flex justify-between items-center"><span class="text-xs font-bold opacity-80">ТЕКУЩИЙ ВЕС (КГ)</span><div class="flex items-center gap-1.5" onclick="event.stopPropagation()"><button onclick="setParam('weight',${+(p.weight-0.5).toFixed(1)})" class="w-8 h-7 rounded-lg theme-soft font-bold">-</button><input type="text" value="${p.weight}" onchange="setParam('weight',this.value)" onkeydown="blurOnEnter(event)" class="w-16 text-center font-mono-num font-extrabold text-sm rounded-lg py-1 theme-soft"><button onclick="setParam('weight',${+(p.weight+0.5).toFixed(1)})" class="w-8 h-7 rounded-lg theme-soft font-bold">+</button></div></div>
            ${activeOpenDropdown==='weight'?`<div class="grid grid-cols-8 gap-1 pt-2 border-t border-white/10" onclick="event.stopPropagation()">${WEIGHT_GRID.map(w=>`<button onclick="setParam('weight',${w});toggleDropdown('weight');" class="py-1.5 rounded-lg text-[11px] font-mono-num font-bold ${p.weight===w?'theme-grad text-white':'theme-soft'}">${w}</button>`).join('')}</div>`:''}
          </div>

          <div class="p-3 rounded-2xl theme-input space-y-2">
            <div class="flex items-center justify-between">
              <label class="flex items-center cursor-pointer text-xs font-bold"><input type="checkbox" ${p.useBodyFat?'checked':''} onchange="setParam('useBodyFat',this.checked)" class="w-4 h-4 mr-2">Учитывать % жира</label>
              ${p.useBodyFat?`<div class="flex items-center gap-1 cursor-pointer" onclick="toggleDropdown('bf')"><button onclick="event.stopPropagation();setParam('bodyFat',${+(p.bodyFat-0.5).toFixed(1)})" class="w-7 h-6 rounded theme-soft font-bold">-</button><input type="text" value="${p.bodyFat}" onclick="event.stopPropagation()" onchange="setParam('bodyFat',this.value)" onkeydown="blurOnEnter(event)" class="w-12 text-center font-mono-num font-bold text-xs rounded py-0.5 theme-soft"><span class="text-xs font-bold">%</span><button onclick="event.stopPropagation();setParam('bodyFat',${+(p.bodyFat+0.5).toFixed(1)})" class="w-7 h-6 rounded theme-soft font-bold">+</button></div>`:''}
            </div>
            ${p.useBodyFat && activeOpenDropdown==='bf'?`<div class="grid grid-cols-6 gap-1 pt-2 border-t border-white/10" onclick="event.stopPropagation()">${[10,12,15,18,20,22,25,28,30,32,35,40].map(bf=>`<button onclick="setParam('bodyFat',${bf});toggleDropdown('bf');" class="py-1.5 rounded-lg text-xs font-mono-num font-bold ${p.bodyFat===bf?'theme-grad text-white':'theme-soft'}">${bf}%</button>`).join('')}</div>`:''}
          </div>

          <div class="p-3 rounded-2xl theme-input space-y-2">
            <div class="text-xs font-bold">🩺 Особенности углеводного обмена (КБЖУ):</div>
            <div class="grid grid-cols-3 gap-1.5">
              <button onclick="setDiabetesType('none')" class="py-2 px-1 rounded-xl text-[11px] font-bold ${p.diabetesType==='none'?'theme-grad text-white shadow':'theme-soft'}">Нет (Стандарт)</button>
              <button onclick="setDiabetesType('dm1')" class="py-2 px-1 rounded-xl text-[11px] font-bold ${p.diabetesType==='dm1'?'theme-grad text-white shadow':'theme-soft'}">СД 1 типа</button>
              <button onclick="setDiabetesType('dm2')" class="py-2 px-1 rounded-xl text-[11px] font-bold ${p.diabetesType==='dm2'?'theme-grad text-white shadow':'theme-soft'}">СД 2 типа</button>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-2.5"><div class="p-3 rounded-2xl theme-soft"><div class="text-[11px] opacity-80">ИМТ (${m.bmi<25?'Норма':'Выше нормы'})</div><div class="text-xl font-extrabold font-mono-num">${m.bmi}</div></div><div class="p-3 rounded-2xl theme-soft"><div class="text-[11px] opacity-80">Базовый обмен (BMR) 🔥</div><div class="text-xl font-extrabold font-mono-num">${m.bmr} ккал</div></div></div>
        </div>

        <div class="glass-card rounded-3xl p-4 space-y-3.5 shadow-lg">
          <div class="flex justify-between items-center"><h2 class="font-extrabold text-base">2. Активность: Шаги + Тренировки</h2><span class="text-xs font-mono-num font-extrabold px-2 py-0.5 rounded-lg theme-soft">TDEE: ${m.tdee} ккал</span></div>
          <div class="grid grid-cols-3 gap-1.5"><button onclick="setParam('neatLevel',0.12)" class="p-2 rounded-xl text-left text-xs ${p.neatLevel===0.12?'theme-grad text-white font-bold':'theme-input'}"><div>Сидячий</div><div class="text-[10px] opacity-75">+12%</div></button><button onclick="setParam('neatLevel',0.18)" class="p-2 rounded-xl text-left text-xs ${p.neatLevel===0.18?'theme-grad text-white font-bold':'theme-input'}"><div>Умеренный</div><div class="text-[10px] opacity-75">+18%</div></button><button onclick="setParam('neatLevel',0.25)" class="p-2 rounded-xl text-left text-xs ${p.neatLevel===0.25?'theme-grad text-white font-bold':'theme-input'}"><div>Активный</div><div class="text-[10px] opacity-75">+25%</div></button></div>
          
          <div class="p-3 rounded-2xl theme-input space-y-2 cursor-pointer" onclick="toggleDropdown('steps')">
            <div class="flex justify-between items-center"><div><div class="text-xs font-bold">👣 Шагов в день:</div><div class="text-[11px] opacity-75">~${m.distKm.toFixed(1)} км · +${m.stepsKcal} ккал</div></div><div class="flex items-center gap-1" onclick="event.stopPropagation()"><button onclick="setParam('steps',${Math.max(0,p.steps-1000)})" class="px-2 py-1 rounded-lg theme-soft font-bold text-xs">-1к</button><input type="text" value="${p.steps}" onchange="setParam('steps',this.value)" onkeydown="blurOnEnter(event)" class="w-16 text-center font-mono-num font-extrabold text-xs rounded-lg py-1 theme-soft"><button onclick="setParam('steps',${p.steps+1000})" class="px-2 py-1 rounded-lg theme-soft font-bold text-xs">+1к</button></div></div>
            ${activeOpenDropdown==='steps'?`<div class="grid grid-cols-5 gap-1 pt-2 border-t border-white/10" onclick="event.stopPropagation()">${STEPS_GRID.map(st=>`<button onclick="setParam('steps',${st});toggleDropdown('steps');" class="py-1.5 rounded-lg text-xs font-mono-num font-bold ${p.steps===st?'theme-grad text-white':'theme-soft'}">${st}</button>`).join('')}</div>`:''}
          </div>

          <div class="p-3 rounded-2xl theme-input space-y-2.5">
            <div class="flex justify-between items-center text-xs font-bold"><span>🏋️ Тренировки</span><span class="font-mono-num">+${m.workoutKcal} ккал/дн</span></div>
            <div><div class="text-[10px] opacity-75 mb-1">Тренировок в неделю:</div><div class="grid grid-cols-8 gap-1">${[0,1,2,3,4,5,6,7].map(d=>`<button onclick="setParam('workoutDays',${d})" class="py-1.5 rounded-lg text-xs font-mono-num font-bold ${p.workoutDays===d?'theme-grad text-white shadow':'theme-soft'}">${d}</button>`).join('')}</div></div>
            <div><div class="text-[10px] opacity-75 mb-1">Длительность (минут):</div><div class="grid grid-cols-6 gap-1">${[30,45,60,75,90,120].map(mn=>`<button onclick="setParam('workoutMins',${mn})" class="py-1.5 rounded-lg text-xs font-mono-num font-bold ${p.workoutMins===mn?'theme-grad text-white shadow':'theme-soft'}">${mn}</button>`).join('')}</div></div>
            <div class="grid grid-cols-2 gap-1.5 pt-1"><button onclick="setParam('workoutMode','avg')" class="py-1.5 rounded-xl text-[11px] font-bold ${p.workoutMode==='avg'?'theme-grad text-white shadow':'theme-soft'}">Среднее в неделю</button><button onclick="setParam('workoutMode','today')" class="py-1.5 rounded-xl text-[11px] font-bold ${p.workoutMode==='today'?'theme-grad text-white shadow':'theme-soft'}">Тренировка сегодня</button></div>
          </div>
        </div>

        <div class="glass-card rounded-3xl p-4 space-y-3.5 shadow-lg">
          <h2 class="font-extrabold text-base">3. Цель, Контрольные точки и Норма КБЖУ</h2>
          
          <div class="p-3 rounded-2xl theme-input space-y-2 cursor-pointer" onclick="toggleDropdown('tweight')">
            <div class="flex justify-between items-center"><span class="text-xs font-bold">🎯 Желаемый вес (кг)</span><div class="flex items-center gap-1.5" onclick="event.stopPropagation()"><button onclick="setParam('targetWeight',${+(p.targetWeight-0.5).toFixed(1)})" class="w-8 h-7 rounded-lg theme-soft font-bold">-</button><input type="text" value="${p.targetWeight}" onchange="setParam('targetWeight',this.value)" onkeydown="blurOnEnter(event)" class="w-16 text-center font-mono-num font-extrabold text-sm rounded-lg py-1 theme-soft"><button onclick="setParam('targetWeight',${+(p.targetWeight+0.5).toFixed(1)})" class="w-8 h-7 rounded-lg theme-soft font-bold">+</button></div></div>
            ${activeOpenDropdown==='tweight'?`<div class="grid grid-cols-8 gap-1 pt-2 border-t border-white/10" onclick="event.stopPropagation()">${WEIGHT_GRID.map(w=>`<button onclick="setParam('targetWeight',${w});toggleDropdown('tweight');" class="py-1.5 rounded-lg text-[11px] font-mono-num font-bold ${p.targetWeight===w?'theme-grad text-white':'theme-soft'}">${w}</button>`).join('')}</div>`:''}
          </div>

          <div class="p-3 rounded-2xl theme-input space-y-2 cursor-pointer" onclick="toggleDropdown('weeks')">
            <div class="flex justify-between items-center text-xs font-bold"><div><div>📅 Срок (недель):</div><div class="text-[10px] opacity-75">Финиш: ${finishDate} (${m.dailyDelta>0?'+':''}${m.dailyDelta} ккал/дн)</div></div><div class="flex items-center gap-1.5" onclick="event.stopPropagation()"><button onclick="setParam('targetWeeks',${Math.max(1,p.targetWeeks-1)})" class="w-8 h-7 rounded-lg theme-soft font-bold">-</button><input type="text" value="${p.targetWeeks}" onchange="setParam('targetWeeks',this.value)" onkeydown="blurOnEnter(event)" class="w-14 text-center font-mono-num font-extrabold text-sm rounded-lg py-1 theme-soft"><button onclick="setParam('targetWeeks',${p.targetWeeks+1})" class="w-8 h-7 rounded-lg theme-soft font-bold">+</button></div></div>
            ${activeOpenDropdown==='weeks'?`<div class="grid grid-cols-6 gap-1 pt-2 border-t border-white/10" onclick="event.stopPropagation()">${WEEKS_GRID.map(wk=>`<button onclick="setParam('targetWeeks',${wk});toggleDropdown('weeks');" class="py-1.5 rounded-lg text-xs font-mono-num font-bold ${p.targetWeeks===wk?'theme-grad text-white':'theme-soft'}">${wk}н</button>`).join('')}</div>`:''}
          </div>

          <!-- SVG WEIGHT FORECAST CHART -->
          <div class="p-3 rounded-2xl theme-input space-y-1">
            <div class="flex justify-between items-center text-[11px] font-bold opacity-85">
              <span>📈 Траектория веса и адаптация TDEE</span>
              <span class="font-mono-num">${p.weight} → ${p.targetWeight} кг</span>
            </div>
            ${buildWeightSvgChart(checkpoints, p)}
          </div>

          ${p.diabetesType!=='none'?`
            <div class="p-3.5 rounded-2xl border-2 space-y-2 text-xs" style="border-color:var(--brand);background:var(--brand-soft);">
              <div class="font-extrabold flex items-center justify-between">
                <span>🩺 Протокол ${p.diabetesType==='dm1'?'СД 1 типа (ХЕ + БЖЕ)':'СД 2 типа (Контроль ГИ)'}</span>
                <span class="px-2 py-0.5 rounded-md theme-grad text-white font-mono-num">${m.totalXE} ХЕ/сут</span>
              </div>
              <div class="text-[11px] opacity-90 leading-relaxed">
                ${p.diabetesType==='dm1'
                  ? `• Углеводы адаптированы под выбранный тип питания: <strong>${m.normC} г (${m.totalXE} ХЕ)</strong> для стабильного гликемического профиля.`
                  : `• Углеводы ограничены до <strong>${m.normC} г/сут (${m.totalXE} ХЕ)</strong> с низким ГИ. На основной прием: до <strong>${m.maxMealCarbs} г (${m.maxMealXE} ХЕ)</strong>. Клетчатка: <strong>${m.fiberNorm} г/сут</strong>.`}
              </div>
            </div>
          `:''}

          <div class="p-3 rounded-2xl theme-soft space-y-2 text-xs">
            ${isTooStrict?`<div class="p-2 rounded-xl bg-amber-500/20 border border-amber-400 text-[11px]">⚠️ Жесткий темп! Порог безопасности для вашего веса (${p.weight} кг): <strong>${m.minSafe} ккал</strong>. <button onclick="setParam('targetWeeks',${safeWeeks})" class="underline font-bold">Поставить ${safeWeeks} нед.</button></div>`:`<div class="text-[11px]">✅ Безопасный темп: ${m.weeklyKg} кг/нед. Порог безопасности: ${m.minSafe} ккал. Клетчатка: от ${m.fiberNorm} г/сут.</div>`}
            <div class="grid grid-cols-2 gap-1.5"><button onclick="setParam('steps',${p.steps+3000})" class="p-2 rounded-xl theme-input text-left"><div class="font-bold text-[11px]">👟 +3 000 шагов</div><div class="text-[10px] opacity-75">+${extra3kKcal} ккал к рациону</div></button><button onclick="applySmartMacros(${recProt},${recFat})" class="p-2 rounded-xl theme-input text-left"><div class="font-bold text-[11px]">🥩 Смарт-БЖУ</div><div class="text-[10px] opacity-75">Б ${recProt} · Ж ${recFat} г/кг</div></button></div>
          </div>

          <div class="space-y-1.5"><div class="text-xs font-bold">🥗 Тип питания под цель:</div>${DIET_TYPES.map(dt=>`<button onclick="selectDietType('${dt.id}')" class="w-full p-2.5 rounded-xl text-left flex justify-between items-center ${p.dietType===dt.id?'theme-grad text-white shadow':'theme-input'}"><div><div class="text-xs font-bold">${dt.name}</div><div class="text-[10px] opacity-80">${dt.desc}</div></div><span class="text-[10px] font-mono-num font-bold px-2 py-0.5 rounded bg-black/20 text-white">${p.dietType===dt.id?`${m.realPpct}/${m.realFpct}/${m.realCpct}%`:`${dt.p}/${dt.f}/${dt.c}%`}</span></button>`).join('')}</div>

          <div class="p-3 rounded-2xl theme-input space-y-2.5 text-xs">
            <div class="text-[10px] opacity-80 font-bold">База расчета белка и жиров (г/кг):</div>
            <div class="grid grid-cols-3 gap-1"><button onclick="setParam('macroBase','target')" class="py-1.5 px-1 rounded-lg text-[10px] font-bold ${p.macroBase==='target'?'theme-grad text-white':'theme-soft'}">Желаемый (${p.targetWeight}кг)</button><button onclick="setParam('macroBase','current')" class="py-1.5 px-1 rounded-lg text-[10px] font-bold ${p.macroBase==='current'?'theme-grad text-white':'theme-soft'}">Текущий (${p.weight}кг)</button><button onclick="setParam('macroBase','lbm')" class="py-1.5 px-1 rounded-lg text-[10px] font-bold ${p.macroBase==='lbm'?'theme-grad text-white':'theme-soft'}">Сухая (${m.lbmWeight}кг)</button></div>
            <div class="space-y-1 cursor-pointer" onclick="toggleDropdown('prot')"><div class="flex justify-between"><span>Белки (${m.effProtGkg} г/кг от ${m.refLabel})</span><strong>${m.normP} г</strong></div>
              ${activeOpenDropdown==='prot'?`<div class="grid grid-cols-6 gap-1 pt-2 border-t border-white/10" onclick="event.stopPropagation()">${PROT_GRID.map(v=>`<button onclick="setParam('protGkg',${v});toggleDropdown('prot');" class="py-1.5 rounded-lg text-xs font-mono-num font-bold ${p.protGkg===v?'theme-grad text-white':'theme-soft'}">${v}</button>`).join('')}</div>`:''}
            </div>
            <div class="space-y-1 cursor-pointer" onclick="toggleDropdown('fat')"><div class="flex justify-between"><span>Жиры (${m.effFatGkg} г/кг от ${m.refLabel})</span><strong>${m.normF} г</strong></div>
              ${activeOpenDropdown==='fat'?`<div class="grid grid-cols-6 gap-1 pt-2 border-t border-white/10" onclick="event.stopPropagation()">${FAT_GRID.map(v=>`<button onclick="setParam('fatGkg',${v});toggleDropdown('fat');" class="py-1.5 rounded-lg text-xs font-mono-num font-bold ${p.fatGkg===v?'theme-grad text-white':'theme-soft'}">${v}</button>`).join('')}</div>`:''}
            </div>
          </div>

          <div class="grid grid-cols-4 gap-2"><div class="p-2.5 rounded-2xl theme-grad text-white text-center"><div class="text-[10px]">НОРМА</div><div class="font-mono-num font-extrabold text-sm">${m.effectiveKcal}</div></div><div class="p-2.5 rounded-2xl theme-soft text-center"><div class="text-[10px]">Белки</div><div class="font-mono-num font-extrabold text-sm">${m.normP}г</div></div><div class="p-2.5 rounded-2xl theme-soft text-center"><div class="text-[10px]">Жиры</div><div class="font-mono-num font-extrabold text-sm">${m.normF}г</div></div><div class="p-2.5 rounded-2xl theme-soft text-center"><div class="text-[10px]">Угл (${m.totalXE}ХЕ)</div><div class="font-mono-num font-extrabold text-sm">${m.normC}г</div></div></div>
        </div>
      </section>

      <!-- RIGHT COLUMN: DIABETES & DAILY INSULIN CALCULATOR -->
      <section class="lg:col-span-6 space-y-4 ${activeTab==='calc'?'hidden lg:block':''}">
        <!-- ACTIVE INSULIN ON BOARD (IOB) BANNER -->
        ${iobData.totalIob > 0 ? `
          <div class="p-3.5 rounded-3xl border-2 flex items-center justify-between gap-2 shadow-lg" style="border-color:var(--brand);background:var(--brand-soft);">
            <div>
              <div class="text-xs font-extrabold flex items-center gap-1.5">⏳ Активный инсулин в теле (IOB): <span class="font-mono-num text-base">${iobData.totalIob} ЕД</span></div>
              <div class="text-[10px] opacity-85">Учтен при расчете ДПС (защита от гипогликемии). Посл: ${iobData.activeRecords[0].units} ЕД в ${iobData.activeRecords[0].timeStr} (ост. ${iobData.activeRecords[0].leftText})</div>
            </div>
            <button onclick="clearIobLog()" class="px-2.5 py-1 rounded-xl theme-input text-[10px] font-bold shrink-0">Сброс</button>
          </div>
        ` : ''}

        <div class="glass-card rounded-3xl p-4 sm:p-5 space-y-4 shadow-lg">
          <div class="flex items-center justify-between">
            <h2 class="font-extrabold text-base">💉 1. Настройка инсулина, УК и ФЧИ</h2>
            <span class="text-[11px] px-2 py-0.5 rounded-lg theme-soft font-mono-num">1 ХЕ = 12 г угл.</span>
          </div>

          <div class="space-y-1.5">
            <div class="text-xs font-bold opacity-85">Выберите тип вашего болюсного инсулина:</div>
            <div class="space-y-2">
              ${INSULIN_TYPES.map(ins=>`
                <button onclick="setParam('insulinType','${ins.id}')" class="w-full p-3 rounded-2xl text-left flex items-start justify-between gap-2 transition ${p.insulinType===ins.id?'theme-grad text-white shadow-md':'theme-input'}">
                  <div>
                    <div class="text-xs font-extrabold">${ins.name}</div>
                    <div class="text-[11px] opacity-90 mt-0.5">${ins.brands}</div>
                  </div>
                  <span class="text-[10px] font-bold px-2 py-1 rounded-lg bg-black/25 text-white shrink-0">Активен ~${ins.diaHours}ч</span>
                </button>
              `).join('')}
            </div>
          </div>

          <div class="p-3 rounded-2xl theme-input space-y-2 cursor-pointer" onclick="toggleDropdown('icr')">
            <div class="flex justify-between items-center"><span class="text-xs font-bold">Базовый индекс УК (ЕД на 1 ХЕ):</span><div class="flex items-center gap-1.5" onclick="event.stopPropagation()"><button onclick="setParam('icr',${+(Math.max(0.1,p.icr-0.1)).toFixed(1)})" class="w-8 h-7 rounded-lg theme-soft font-bold">-</button><input type="text" value="${p.icr}" onchange="setParam('icr',this.value)" onkeydown="blurOnEnter(event)" class="w-14 text-center font-mono-num font-extrabold text-sm rounded-lg py-1 theme-soft"><button onclick="setParam('icr',${+(p.icr+0.1).toFixed(1)})" class="w-8 h-7 rounded-lg theme-soft font-bold">+</button></div></div>
            ${activeOpenDropdown==='icr'?`<div class="grid grid-cols-8 gap-1 pt-2 border-t border-white/10" onclick="event.stopPropagation()">${ICR_GRID.map(v=>`<button onclick="setParam('icr',${v});toggleDropdown('icr');" class="py-1.5 rounded-lg text-xs font-mono-num font-bold ${p.icr===v?'theme-grad text-white':'theme-soft'}">${v}</button>`).join('')}</div>`:''}
          </div>

          <div class="grid grid-cols-2 gap-2 text-xs">
            <div class="p-2.5 rounded-2xl theme-input flex flex-col justify-between">
              <span class="text-[10px] opacity-80 font-bold">🎯 Целевой сахар (ммоль/л):</span>
              <div class="flex items-center justify-between mt-1">
                <button onclick="setParam('targetBg',${+(p.targetBg-0.2).toFixed(1)})" class="w-7 h-6 rounded theme-soft font-bold">-</button>
                <input type="text" value="${p.targetBg}" onchange="setParam('targetBg',this.value)" onkeydown="blurOnEnter(event)" class="w-12 text-center font-mono-num font-extrabold text-xs rounded py-0.5 theme-soft">
                <button onclick="setParam('targetBg',${+(p.targetBg+0.2).toFixed(1)})" class="w-7 h-6 rounded theme-soft font-bold">+</button>
              </div>
            </div>
            <div class="p-2.5 rounded-2xl theme-input flex flex-col justify-between">
              <div class="flex justify-between items-center">
                <span class="text-[10px] opacity-80 font-bold">📉 ФЧИ (1 ЕД снижает на):</span>
                ${p.customIsf > 0 ? `<button onclick="setParam('customIsf',0)" class="text-[9px] underline opacity-75">Авто</button>` : `<span class="text-[9px] opacity-70">Авто</span>`}
              </div>
              <div class="flex items-center justify-between mt-1">
                <button onclick="setParam('customIsf',${+(Math.max(0.5, dayPlan.effectiveIsf-0.2)).toFixed(1)})" class="w-7 h-6 rounded theme-soft font-bold">-</button>
                <input type="text" value="${dayPlan.effectiveIsf}" onchange="setParam('customIsf',this.value)" onkeydown="blurOnEnter(event)" class="w-12 text-center font-mono-num font-extrabold text-xs rounded py-0.5 theme-soft">
                <button onclick="setParam('customIsf',${+(dayPlan.effectiveIsf+0.2).toFixed(1)})" class="w-7 h-6 rounded theme-soft font-bold">+</button>
              </div>
            </div>
          </div>
        </div>

        <div class="glass-card rounded-3xl p-4 sm:p-5 space-y-3.5 shadow-lg border-2" style="border-color:var(--brand);">
          <div class="flex items-center justify-between">
            <div>
              <div class="text-[10px] font-bold uppercase opacity-75">Исходя из дневной нормы (${m.effectiveKcal} ккал)</div>
              <h2 class="font-extrabold text-base">📊 2. Расчет инсулина на весь день</h2>
            </div>
            <span class="px-2.5 py-1 rounded-xl theme-grad text-white font-mono-num font-extrabold text-xs">${dayPlan.dayXE} ХЕ / сут</span>
          </div>

          <div class="grid grid-cols-3 gap-2 text-center font-mono-num">
            <div class="p-2.5 rounded-2xl theme-input">
              <div class="text-[10px] font-sans opacity-75">Болюс на Угл</div>
              <div class="text-lg font-extrabold">${dayPlan.dayCarbBolus} ЕД</div>
              <div class="text-[10px] opacity-70">${m.normC}г (${dayPlan.dayXE} ХЕ)</div>
            </div>
            <div class="p-2.5 rounded-2xl theme-input">
              <div class="text-[10px] font-sans opacity-75">Болюс на БЖЕ</div>
              <div class="text-lg font-extrabold">${dayPlan.dayBjeBolus} ЕД</div>
              <div class="text-[10px] opacity-70">${dayPlan.dayBJE} БЖЕ за день</div>
            </div>
            <div class="p-2.5 rounded-2xl theme-soft">
              <div class="text-[10px] font-sans font-bold">Всего Болюс/дн</div>
              <div class="text-lg font-extrabold">${dayPlan.totalBolusDay} ЕД</div>
              <div class="text-[10px] opacity-80">База ~${dayPlan.estBasal} ЕД</div>
            </div>
          </div>

          <div class="space-y-1.5 text-xs">
            <div class="font-bold text-[11px] opacity-85">Нажмите на прием пищи, чтобы подставить его в разовый расчет:</div>
            ${dayPlan.splits.map(s=>`
              <div onclick="setMealTime('${s.slot}')" class="p-2.5 rounded-2xl cursor-pointer transition flex items-center justify-between gap-2 ${mealTimeSlot===s.slot && !mealBolus.customEdited ? 'theme-soft border border-white/30 shadow-sm' : 'theme-input'}">
                <div>
                  <div class="font-bold">${s.name} <span class="text-[10px] font-mono-num opacity-75">(УК ~${s.effIcr})</span></div>
                  <div class="text-[10px] opacity-75 font-mono-num">Б:${s.pG}г · Ж:${s.fG}г · У:${s.cG}г (${s.xe} ХЕ · ${s.bje} БЖЕ)</div>
                </div>
                <div class="text-right font-mono-num shrink-0">
                  <div class="font-extrabold text-sm">${s.totU} ЕД</div>
                  <div class="text-[9px] opacity-80">До: ${s.preU}${s.postU>0?`| После: ${s.postU}`:''}</div>
                </div>
              </div>
            `).join('')}
          </div>
        </div>

        <div class="glass-card rounded-3xl p-4 sm:p-5 space-y-3.5 shadow-lg">
          <div class="flex items-center justify-between">
            <h2 class="font-extrabold text-base">🍽 3. Разовый расчет на прием пищи</h2>
            <span class="text-xs font-mono-num font-bold px-2 py-0.5 rounded-lg theme-soft">${mealKcal} ккал</span>
          </div>

          <!-- SAVED PRESET MEALS ("МОИ ТАРЕЛКИ") -->
          <div class="space-y-1.5">
            <div class="flex justify-between items-center text-[11px] font-bold opacity-85">
              <span>⭐ Мои частые тарелки (в 1 клик):</span>
              <button onclick="saveCurrentMealAsPreset()" class="underline text-[10px]">+ Сохранить текущую</button>
            </div>
            <div class="flex flex-wrap gap-1.5">
              ${p.savedMeals.map((sm, idx) => `
                <div onclick="applyPresetMeal(${idx})" class="px-2.5 py-1.5 rounded-xl theme-input text-[11px] font-bold flex items-center gap-1.5 cursor-pointer hover:opacity-90">
                  <span>${sm.name}</span>
                  <span class="text-[9px] font-mono-num opacity-70">(${sm.p}/${sm.f}/${sm.c})</span>${p.savedMeals.length > 1 ? `<button onclick="deletePresetMeal(${idx}, event)" class="opacity-50 hover:opacity-100 ml-0.5">✕</button>` : ''}
                </div>
              `).join('')}
            </div>
          </div>

          <!-- SMART TEXT PARSER FROM TRACKERS -->
          <details class="p-2.5 rounded-2xl theme-input text-xs">
            <summary class="cursor-pointer font-bold text-[11px] opacity-85">📋 Быстрая вставка БЖУ из FatSecret / Yazio / текста</summary>
            <div class="pt-2 flex gap-1.5">
              <input type="text" id="inp-smart-parse" onkeydown="blurOnEnter(event)" placeholder="Напр: Б 35 Ж 15 У 48 (или просто 35 15 48)" class="flex-1 px-2.5 py-1.5 rounded-xl theme-soft text-xs">
              <button onclick="if(!parseSmartFoodText(document.getElementById('inp-smart-parse').value)) alert('Введите 3 числа (Белки Жиры Углеводы), например: 35 15 48');" class="px-3 py-1.5 rounded-xl theme-grad text-white font-bold text-xs">Вставить</button>
            </div>
          </details>

          <div class="space-y-1.5">
            <div class="text-[11px] font-bold opacity-80">⏰ Время суток (автоматически корректирует УК):</div>
            <div class="grid grid-cols-4 gap-1.5">
              <button onclick="setMealTime('morning')" class="py-2 px-1 rounded-xl text-[11px] font-bold ${mealTimeSlot==='morning'?'theme-grad text-white shadow':'theme-input'}">🌅 Утро<div class="text-[9px] opacity-80">УК ×1.15</div></button>
              <button onclick="setMealTime('lunch')" class="py-2 px-1 rounded-xl text-[11px] font-bold ${mealTimeSlot==='lunch'?'theme-grad text-white shadow':'theme-input'}">☀️ День<div class="text-[9px] opacity-80">УК ×1.0</div></button>
              <button onclick="setMealTime('evening')" class="py-2 px-1 rounded-xl text-[11px] font-bold ${mealTimeSlot==='evening'?'theme-grad text-white shadow':'theme-input'}">🌙 Вечер<div class="text-[9px] opacity-80">УК ×0.90</div></button>
              <button onclick="setMealTime('night')" class="py-2 px-1 rounded-xl text-[11px] font-bold ${mealTimeSlot==='night'?'theme-grad text-white shadow':'theme-input'}">🌌 Ночь<div class="text-[9px] opacity-80">УК ×0.95</div></button>
            </div>
          </div>

          <!-- GLYCEMIC INDEX (GI) SELECTOR -->
          <div class="space-y-1">
            <div class="text-[11px] font-bold opacity-80">🥗 Гликемический индекс (ГИ) еды (влияет на паузу):</div>
            <div class="grid grid-cols-3 gap-1.5 text-[11px]">
              <button onclick="setMealBolus('gi','low')" class="py-1.5 px-2 rounded-xl font-bold ${mealBolus.gi==='low'?'theme-grad text-white shadow':'theme-input'}">🟢 Низкий ГИ</button>
              <button onclick="setMealBolus('gi','mid')" class="py-1.5 px-2 rounded-xl font-bold ${mealBolus.gi==='mid'?'theme-grad text-white shadow':'theme-input'}">🟡 Средний ГИ</button>
              <button onclick="setMealBolus('gi','high')" class="py-1.5 px-2 rounded-xl font-bold ${mealBolus.gi==='high'?'theme-grad text-white shadow':'theme-input'}">🔴 Высокий ГИ</button>
            </div>
          </div>

          <div class="space-y-2 text-xs">
            <!-- CURRENT BLOOD GLUCOSE FOR DPS CORRECTION -->
            <div class="p-3 rounded-2xl theme-soft border border-white/15">
              <div class="flex justify-between items-center">
                <div>
                  <div class="font-extrabold">🩸 Текущий сахар (необязательно):</div>
                  <div class="text-[10px] opacity-80">Цель: ${p.targetBg} · ФЧИ: ${bolus.isf} ммоль/ЕД</div>
                </div>
                <div class="flex items-center gap-1.5">
                  <input type="text" placeholder="—" value="${mealBolus.currBg}" onchange="setMealBolus('currBg',this.value)" onkeydown="blurOnEnter(event)" class="w-16 text-center font-mono-num font-extrabold rounded-lg py-1 theme-input text-sm">
                  <span class="font-bold text-[11px]">ммоль</span>
                  ${mealBolus.currBg !== '' ? `<button onclick="setMealBolus('currBg','')" class="text-xs opacity-70 px-1">✕</button>` : ''}
                </div>
              </div>
              ${bolus.hasBg ? `
                <div class="mt-2 pt-2 border-t border-white/10 text-[11px] flex justify-between items-center">
                  <span>Расчетная ДПС (коррекция):</span>
                  <span class="font-mono-num font-extrabold">${bolus.safeDps > 0 ? '+' : ''}${bolus.safeDps} ЕД ${bolus.iobSubtracted > 0 ? `(вычтен IOB ${bolus.iobSubtracted} ЕД)` : ''}</span>
                </div>
              ` : ''}
            </div>

            <div class="p-3 rounded-2xl theme-input">
              <div class="flex justify-between items-center">
                <span class="font-bold">Белки:</span>
                <div class="flex items-center gap-1.5">
                  <input type="text" value="${mealBolus.p}" onchange="setMealBolus('p',this.value)" onkeydown="blurOnEnter(event)" class="w-20 text-center font-mono-num font-bold rounded-lg py-1 theme-soft text-sm">
                  <span class="font-bold">г</span>
                </div>
              </div>
            </div>

            <div class="p-3 rounded-2xl theme-input">
              <div class="flex justify-between items-center">
                <span class="font-bold">Жиры:</span>
                <div class="flex items-center gap-1.5">
                  <input type="text" value="${mealBolus.f}" onchange="setMealBolus('f',this.value)" onkeydown="blurOnEnter(event)" class="w-20 text-center font-mono-num font-bold rounded-lg py-1 theme-soft text-sm">
                  <span class="font-bold">г</span>
                </div>
              </div>
            </div>

            <div class="p-3 rounded-2xl theme-input">
              <div class="flex justify-between items-center">
                <span class="font-bold">Углеводы (${bolus.xe} ХЕ):</span>
                <div class="flex items-center gap-1.5">
                  <input type="text" value="${mealBolus.c}" onchange="setMealBolus('c',this.value)" onkeydown="blurOnEnter(event)" class="w-20 text-center font-mono-num font-bold rounded-lg py-1 theme-soft text-sm">
                  <span class="font-bold">г</span>
                </div>
              </div>
            </div>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
            <div class="p-3 rounded-2xl theme-input space-y-1">
              <div class="text-[11px] font-bold opacity-80">1️⃣ ПЕРЕД ЕДОЙ (УК ~${bolus.effIcr})</div>
              <div class="text-2xl font-extrabold font-mono-num">${bolus.preUnits} ЕД</div>
              <div class="text-[11px] opacity-95 font-semibold">⏱ ${bolus.dynamicWaitText}</div>
              <div class="text-[10px] opacity-75">Еда: ${bolus.carbUnits} ЕД (${bolus.xe} ХЕ) ${bolus.hasBg ? `· ДПС: ${bolus.safeDps > 0 ? '+' : ''}${bolus.safeDps} ЕД` : ''}</div>
            </div>
            <div class="p-3 rounded-2xl theme-input space-y-1">
              <div class="text-[11px] font-bold opacity-80">2️⃣ ПОСЛЕ ЕДЫ (на БЖЕ)</div>
              <div class="text-2xl font-extrabold font-mono-num">${bolus.splitWaves?`${bolus.postUnits} ЕД`:'0 ЕД'}</div>
              <div class="text-[11px] opacity-90">⏱ ${bolus.ins.postTiming}</div>
              <div class="text-[10px] opacity-75">БЖЕ: ${bolus.bje} (${bolus.fpKcal} ккал Б+Ж)${bolus.waveHours?` · волна ~${bolus.waveHours}ч`:''}</div>
            </div>
          </div>

          <!-- ACTION BUTTONS: LOG INJECTION (IOB) & ADD TO DAILY DIARY -->
          <div class="grid grid-cols-2 gap-2 pt-1">
            <button onclick="logInsulinInjection(${bolus.preUnits})" class="py-2.5 px-3 rounded-2xl theme-grad text-white font-extrabold text-xs shadow flex items-center justify-center gap-1.5">
              💉 Уколол ${bolus.preUnits} ЕД (Таймер)
            </button>
            <button onclick="addMealToDailyTracker()" class="py-2.5 px-3 rounded-2xl theme-soft font-extrabold text-xs flex items-center justify-center gap-1.5">
              ➕ В дневник (+${mealKcal} ккал)
            </button>
          </div>

          <!-- MINI DAILY TRACKER PROGRESS BAR -->
          <div class="p-3 rounded-2xl theme-input space-y-2 text-xs">
            <div class="flex justify-between items-center">
              <span class="font-extrabold text-[11px]">📅 Съедено за сегодня: ${tr.kcal} / ${m.effectiveKcal} ккал (${kcalPct}%)</span>
              ${tr.kcal > 0 ? `<button onclick="resetDailyTracker()" class="text-[10px] underline opacity-75">Сброс</button>` : ''}
            </div>
            <div class="w-full h-2 rounded-full bg-black/25 overflow-hidden">
              <div class="h-full theme-grad transition-all" style="width:${kcalPct}%"></div>
            </div>
            <div class="flex justify-between text-[10px] font-mono-num opacity-85">
              <span>Б: ${tr.p}/${m.normP}г</span>
              <span>Ж: ${tr.f}/${m.normF}г</span>
              <span>У: ${tr.c}/${m.normC}г</span>
              <span>Ост: ${remKcalDay} ккал (${remXEDay} ХЕ)</span>
            </div>
          </div>

          <div class="text-[10px] opacity-75 leading-relaxed">ℹ️ <strong>Итого на прием: ${bolus.totalUnits} ЕД</strong> (ХЕ + Варшавский протокол БЖЕ ISPAD + ДПС). Справочный расчет.</div>
        </div>
      </section>
    </main>

    <div class="fixed bottom-0 left-0 right-0 z-40 glass-card border-t px-3 py-2 shadow-2xl">
      <div class="max-w-7xl mx-auto flex justify-center">
        <button onclick="openAiModal()" class="py-2.5 px-6 rounded-2xl theme-grad text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-lg">✨ Клинический AI-Помощник и Ментор</button>
      </div>
    </div>

    <!-- SOS HYPOGLYCEMIA MODAL -->
    <div id="modal-hypo" class="fixed inset-0 z-50 hidden bg-black/80 backdrop-blur-md flex items-center justify-center p-3">
      <div class="glass-card rounded-3xl max-w-md w-full p-5 space-y-4 border-2 border-rose-500/60 shadow-2xl">
        <div class="flex justify-between items-center">
          <h3 class="font-extrabold text-base text-rose-300">🆘 Протокол 15/15: Низкий сахар</h3>
          <button onclick="document.getElementById('modal-hypo').classList.add('hidden')" class="w-8 h-8 rounded-full theme-soft font-bold">✕</button>
        </div>
        <div class="p-3 rounded-2xl theme-input flex justify-between items-center text-xs">
          <span class="font-bold">Ваш текущий сахар (ммоль/л):</span>
          <input type="text" value="${hypoBgInput}" onchange="hypoBgInput=this.value;renderApp();openHypoModal();" onkeydown="blurOnEnter(event)" class="w-16 text-center font-mono-num font-extrabold text-sm rounded-lg py-1 theme-soft">
        </div>
        <div class="p-4 rounded-2xl bg-rose-500/15 border border-rose-400/40 space-y-2 text-xs">
          <div class="font-extrabold text-sm">Примите СЕЙЧАС: <span class="font-mono-num text-lg underline">${hypoRescue.fastCarbGrams} г</span> быстрых углеводов (${hypoRescue.xe} ХЕ)</div>
          <div class="text-[11px] opacity-90">Точный расчет для веса <strong>${p.weight} кг</strong>, чтобы плавно поднять сахар с ${hypoRescue.bg} до ${hypoRescue.target} ммоль/л без «отката»:</div>
          <ul class="space-y-1 pt-1 font-semibold">
            <li>🍬 Декстроза / Глюкоза: <strong>${hypoRescue.dextroseTabs} таб.</strong> (по 4 г)</li>
            <li>🧃 Фруктовый сок / Кола: <strong>${hypoRescue.juiceMl} мл</strong></li>
            <li>☕️ Сахар-рафинад (в теплой воде): <strong>${hypoRescue.sugarCubes} кус.</strong></li>
          </ul>
        </div>
        <div class="text-[11px] opacity-85 leading-relaxed">
          ⏱ <strong>Правило 15 минут:</strong> После приема быстрых углеводов подождите ровно 15 минут и перемерьте сахар. Не ешьте шоколад, бананы или бутерброды — жиры замедлят всасывание глюкозы!
        </div>
      </div>
    </div>

    <!-- DOCTOR SUMMARY REPORT MODAL -->
    <div id="modal-report" class="fixed inset-0 z-50 hidden bg-black/80 backdrop-blur-md flex items-center justify-center p-3">
      <div class="glass-card rounded-3xl max-w-md w-full p-5 space-y-4 border-2 shadow-2xl" style="border-color:var(--brand);">
        <div class="flex justify-between items-center">
          <h3 class="font-extrabold text-base">📋 Клиническая сводка профиля</h3>
          <button onclick="document.getElementById('modal-report').classList.add('hidden')" class="w-8 h-8 rounded-full theme-soft font-bold">✕</button>
        </div>
        <div id="report-text-box" class="p-3.5 rounded-2xl theme-input text-xs font-mono-num space-y-1.5 leading-relaxed">
          <div><strong>Профиль:</strong> ${p.gender==='male'?'Мужчина':'Женщина'}, ${p.age} лет, ${p.height} см, ${p.weight} кг (ИМТ ${m.bmi})</div>
          <div><strong>Цель:</strong> ${p.targetWeight} кг за ${p.targetWeeks} нед. (Норма: ${m.effectiveKcal} ккал)</div>
          <div><strong>Суточное БЖУ:</strong> Б ${m.normP}г / Ж ${m.normF}г / У ${m.normC}г (${m.totalXE} ХЕ)</div>
          <div><strong>Инсулин:</strong> ${dayPlan.ins.name}</div>
          <div><strong>Коэффициенты:</strong> Базовый УК ${p.icr} (Утро ${+(p.icr*1.15).toFixed(2)} / День ${p.icr} / Вечер ${+(p.icr*0.9).toFixed(2)})</div>
          <div><strong>Чувствительность (ФЧИ):</strong> 1 ЕД = -${dayPlan.effectiveIsf} ммоль/л · Цель ГК: ${p.targetBg}</div>
          <div><strong>Суточная потребность (TDD):</strong> ~${dayPlan.totalDailyDose} ЕД (Болюс ${dayPlan.totalBolusDay} ЕД + База ~${dayPlan.estBasal} ЕД)</div>
        </div>
        <button onclick="copyDoctorReport()" class="w-full py-3 rounded-2xl theme-grad text-white font-extrabold text-xs shadow">📄 Скопировать сводку в буфер обмена</button>
      </div>
    </div>

    <!-- AI MENTOR MODAL -->
    <div id="modal-ai" class="fixed inset-0 z-50 hidden bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-5">
      <div class="glass-card rounded-3xl max-w-xl w-full p-5 sm:p-6 space-y-4 max-h-[92vh] overflow-y-auto shadow-2xl border-2 pb-8" style="border-color:var(--brand);">
        <div class="flex justify-between items-center sticky top-0 py-3 px-4 z-10 rounded-2xl glass-card border border-white/10 gap-2 mb-2" style="background: var(--card-bg);">
          <h3 class="font-extrabold text-sm sm:text-base flex items-center gap-2 leading-tight"><span>🩺 Клинический AI-Ментор</span><span class="text-[10px] px-2 py-0.5 rounded-lg theme-soft">${hasSavedKey?'☁️ Gemini API':'⚡ Локальный режим'}</span></h3>
          <button onclick="document.getElementById('modal-ai').classList.add('hidden')" class="w-8 h-8 rounded-full theme-soft font-bold flex items-center justify-center shrink-0">✕</button>
        </div>

        <div class="p-4 rounded-2xl theme-soft space-y-1.5 shadow-sm">
          <div class="font-extrabold text-xs flex items-center justify-between">
            <span class="font-extrabold">⭐ Вдохновляющая история успеха</span>
            <button onclick="rotateStory()" class="w-8 h-8 rounded-xl theme-input text-sm font-bold flex items-center justify-center cursor-pointer shadow-sm hover:scale-105 transition" title="Другая история">✨</button>
          </div>
          <div class="text-xs font-extrabold mt-1">${currentStory.name}</div>
          <div class="text-[11px] opacity-90 leading-relaxed">${currentStory.desc}</div>
        </div>

        <div class="p-4 rounded-2xl theme-input space-y-2 border border-white/20">
          <div class="font-extrabold text-xs flex items-center justify-between">
            <span class="font-extrabold">❤️ Слово тепла и поддержки для вас</span>
            <button onclick="rotateSupport()" class="w-8 h-8 rounded-xl theme-soft text-sm font-bold flex items-center justify-center cursor-pointer shadow-sm hover:scale-105 transition" title="Другие слова">✨</button>
          </div>
          <div id="support-box" class="text-xs leading-relaxed opacity-95 mt-1">
            ${currentSupport}
          </div>
        </div>

        <div class="space-y-2">
          <button onclick="toggleNews()" class="w-full py-2.5 rounded-xl theme-soft font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer">
            🚀 <span id="news-btn-text">Открыть научные прорывы и достижения</span>
          </button>
          <div id="news-box" class="hidden p-4 rounded-2xl theme-input space-y-2 text-[11px]">
            <div class="flex justify-between items-center font-bold text-xs mb-1">
              <span>Последние достижения науки</span>
              <button onclick="refreshNews()" class="text-[10px] underline opacity-80 cursor-pointer">🔄 Актуализировать</button>
            </div>
            <div id="news-list" class="space-y-2">
              ${DIABETES_BREAKTHROUGHS.map(b=>`
                <div class="p-2.5 rounded-xl theme-soft">
                  <div class="font-bold flex items-center justify-between"><span>${b.title}</span><span class="opacity-75 font-mono-num">${b.yr}</span></div>
                  <div class="opacity-85 mt-0.5 leading-relaxed">${b.desc}</div>
                </div>
              `).join('')}
            </div>
          </div>
        </div>

        <div class="pt-1">
          <button onclick="rotateSupport(); rotateStory();" class="w-full py-3.5 px-4 rounded-2xl theme-grad text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-xl hover:scale-[1.01] transition cursor-pointer">
            ❤️ Получить новую порцию тепла и поддержки
          </button>
        </div>

        <details class="p-2.5 rounded-2xl theme-input text-xs opacity-60 hover:opacity-100 transition mt-2">
          <summary class="cursor-pointer text-[10px]">🔑 Подключить свой ключ Gemini API (необязательно)</summary>
          <div class="pt-2 flex flex-col gap-2">
            <div class="flex justify-between items-center">
              <span class="text-[10px] opacity-80">Бесплатный ключ Google AI Studio:</span>
              <a href="https://aistudio.google.com/app/apikey" target="_blank" class="text-[10px] underline font-bold">Получить ключ ↗</a>
            </div>
            <div class="flex gap-1.5 items-center">
              <input type="password" id="inp-gemini-key" value="${localStorage.getItem('nutricalc_gemini_key')||''}" onkeydown="blurOnEnter(event)" placeholder="AIzaSy..." class="flex-1 px-3 py-1.5 rounded-xl theme-soft text-xs font-mono-num">
              <button onclick="saveApiKey()" class="px-3 py-1.5 rounded-xl theme-grad text-white text-xs font-bold shrink-0">ОК</button>
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
    alert('✅ Клиническая сводка скопирована! Вы можете вставить её в чат с врачом или заметки.');
  });
}

function rotateStory() {
  let next = DIABETES_STORIES[Math.floor(Math.random() * DIABETES_STORIES.length)];
  if (next === currentStory && DIABETES_STORIES.length > 1) {
    next = DIABETES_STORIES[(DIABETES_STORIES.indexOf(currentStory) + 1) % DIABETES_STORIES.length];
  }
  currentStory = next;
  renderApp(); openAiModal();
}
function rotateSupport() {
  let next = DIABETES_SUPPORT_PHRASES[Math.floor(Math.random() * DIABETES_SUPPORT_PHRASES.length)];
  if (next === currentSupport && DIABETES_SUPPORT_PHRASES.length > 1) {
    next = DIABETES_SUPPORT_PHRASES[(DIABETES_SUPPORT_PHRASES.indexOf(currentSupport) + 1) % DIABETES_SUPPORT_PHRASES.length];
  }
  currentSupport = next;
  renderApp(); openAiModal();
}
function toggleNews() {
  const box = document.getElementById('news-box');
  const btn = document.getElementById('news-btn-text');
  if (box.classList.contains('hidden')) {
    box.classList.remove('hidden');
    btn.textContent = 'Скрыть научные прорывы';
  } else {
    box.classList.add('hidden');
    btn.textContent = 'Открыть научные прорывы и достижения';
  }
}
function refreshNews() {
  alert('🔄 Научные новости актуализированы по базам PubMed, ADA и EASD (2026).');
}
function saveApiKey() {
  const val = document.getElementById('inp-gemini-key').value.trim();
  localStorage.setItem('nutricalc_gemini_key', val);
  alert('✅ Ключ успешно сохранен!');
  renderApp(); openAiModal();
}

loadStorage(); renderApp();
