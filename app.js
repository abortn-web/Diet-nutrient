let appData = {
  activeProfile: 'p1',
  profiles: JSON.parse(JSON.stringify(DEFAULT_PROFILES))
};

let activeTab = 'calc';
let mealTimeSlot = 'lunch';
let mealBolus = {
  p: 0,
  f: 0,
  c: 0,
  gi: 'mid',
  currBg: '',
  initialized: false,
  customEdited: false
};

const INSULIN_TYPES = [
  { id: 'ultrafast', name: '⚡ Сверхбыстрый', desc: 'Пик через 45–60 мин', brands: 'Фиасп (Fiasp), Люмжев (Lyumjev)', preMin: 'За 0–5 мин до еды', baseWait: 3, diaHours: 3.5, isfRule: 100, postTiming: 'через 60–90 мин ПОСЛЕ еды', coversBJE: false },
  { id: 'ultralong', name: '🚀 Ультракороткий', desc: 'Пик через 60–90 мин', brands: 'НовоРапид, Хумалог, Апидра, РинФаст, Росинсулин Аспарт', preMin: 'За 10–15 мин ДО еды', baseWait: 12, diaHours: 4.0, isfRule: 100, postTiming: 'через 60–90 мин ПОСЛЕ еды', coversBJE: false },
  { id: 'short', name: '⏱ Короткий (Регуляр)', desc: 'Пик через 2–3 часа', brands: 'Актрапид, Хумулин Регуляр, Биосулин Р, Инсуман Рапид', preMin: 'За 25–30 мин ДО еды', baseWait: 25, diaHours: 5.5, isfRule: 83, postTiming: 'входит в 1 укол (хвост до 6 ч перекрывает БЖЕ)', coversBJE: true }
];

// Уровни интенсивности тренировок (влияют на TDEE и распределение КБЖУ для всех профилей)
const WORKOUT_INTENSITIES = [
  {
    id: 'low',
    name: '🧘 Лёгкая',
    metFactor: 3.0,
    hrPctMin: 0.55,
    hrPctMax: 0.65,
    shortDesc: 'Йога, пилатес, стретчинг, ЛФК',
    examples: 'Йога, пилатес, стретчинг, суставная гимнастика, спокойное плавание, настольный теннис, неспешный велопрогулочный темп.'
  },
  {
    id: 'mid',
    name: '🏋️ Средняя',
    metFactor: 4.5,
    hrPctMin: 0.65,
    hrPctMax: 0.76,
    shortDesc: 'Силовая в зале, фитнес, кардио',
    examples: 'Классическая силовая тренировка в тренажерном зале (с отдыхом 1.5–2 мин между подходами), групповой фитнес, эллипс, бодрое плавание, сноуборд/горные лыжи.'
  },
  {
    id: 'high',
    name: '🔥 Высокая',
    metFactor: 6.5,
    hrPctMin: 0.76,
    hrPctMax: 0.88,
    shortDesc: 'Кроссфит, HIIT, бег, спарринги',
    examples: 'Интенсивный кроссфит, круговые и интервальные тренировки (HIIT/Табата), бег в темпе, бокс/единоборства, футбол/баскетбол, тяжелый силовой день ног/спины с коротким отдыхом.'
  }
];

const DIABETES_STORIES = [
  { name: '⚖️ Тур Хейердал', desc: 'Великий норвежский путешественник и ученый. Пересекал океаны на плоту «Кон-Тики» и доказал, что диабет — это лишь особенность, а не преграда для открытий.' },
  { name: '🎸 Брет Майклс', desc: 'Легендарный рокер, фронтмен группы Poison. С диабетом с 6 лет дает стадионные концерты и ведет активный яркий образ жизни.' },
  { name: '🥇 Гэри Холл-младший', desc: 'Американский пловец, 10-кратный олимпийский чемпион. Завоевывал золотые медали на Олимпиадах, показав силу характера и точного контроля.' },
  { name: '🎬 Холли Берри', desc: 'Обладательница премии «Оскар». С 22 лет живет в осознанном режиме контроля гликемии, снимается в блокбастерах и вдохновляет миллионы.' },
  { name: '🎾 Александр Зверев', desc: 'Олимпийский чемпион по теннису и мировая звезда корта. Выигрывает пятисетовые матчи на турнирах Большого шлема с диабетом 1 типа.' },
  { name: '🏔️ Уилл Кросс', desc: 'Альпинист, покоривший высочайшие вершины всех семи континентов планеты (включая Эверест) и оба полюса Земли.' },
  { name: '🏎️ Чарли Кимболл', desc: 'Пилот гоночной серии IndyCar. Первый гонщик с диабетом, одержавший победу в элитной серии на скоростях свыше 350 км/ч.' },
  { name: '🎤 Ник Джонас', desc: 'Всемирно известный музыкант и актер. С 13 лет открыто рассказывает о своем образе жизни с инсулиновой помпой и CGM-мониторингом.' }
];

const DIABETES_SUPPORT_PHRASES = [
  '☕️ Диабет — это не болезнь, а особый образ жизни, который учит нас глубоко чувствовать свое тело, заботиться о себе и жить осознанно. Вы имеете полное право иногда уставать от этого ритма. Но помните: вы справляетесь просто великолепно! 🌟',
  '❤️ Помните, что диабет — это не диагноз и не ограничение, а особый образ жизни, требующий внимания и чуткости к себе. Если сегодня было тяжело — отпустите этот день. Завтра будет новый старт. Вы сильный человек! ☕️',
  '💪 Каждый замер сахара, каждая пауза перед едой и каждый просчет ХЕ — это не бремя, а проявление вашей осознанности и большой любви к себе. Вы — главный капитан своего корабля! ⛵️',
  '☀️ Вы сильнее, чем думаете. Да, диабет — это особый образ жизни со своими правилами, но каждый раз, когда вы находите баланс и делаете выбор в пользу своего здоровья — побеждаете именно вы. Гордитесь собой! 🛡️',
  '✨ Никакие особенности обмена веществ не способны ограничить вашу мечту, вашу радость и ваши цели. Вы управляете своей жизнью. Разрешите себе иногда расслабиться — вы заслуживаете самого теплого отдыха. 🧸',
  '🌊 Бывают дни, когда сахара идут вверх и вниз без видимых причин, и это выматывает. Это нормально — чувствовать усталость. Главное — не винить себя, вы делаете колоссальную работу каждый день! 💙',
  '🧭 Знаете, в чем ваша суперсила? Вы управляете сложнейшей биохимической системой своего организма каждый день. Вы — личный пилот лайнера, и даже если случается турбулентность, вы мастерски держите штурвал! ✈️',
  '🎁 Цифры на экране мониторинга или глюкометра — это просто навигационные данные, а не оценка вас как личности. Вы ценны, любимы и прекрасны при любых показателях! 💖'
];

const HELP_TOPICS = {
  neat: {
    title: '🛋 Что такое бытовой образ жизни (NEAT)?',
    html: `
      <p><strong>NEAT (Non-Exercise Activity Thermogenesis)</strong> — это энергия, которую ваше тело тратит в течение дня на обычную бытовую и рабочую суету <strong>без учёта шагов и спорта</strong> (жестикуляция, поддержание позы, домашние дела, работа руками, термический эффект пищи).</p>
      <div class="space-y-2 mt-2">
        <div class="p-2.5 rounded-2xl theme-input">
          <div class="font-extrabold text-sky-300">💻 Сидячий (+12% к базовому обмену)</div>
          <div class="text-[11px] opacity-90 mt-0.5"><strong>Примеры:</strong> офисная работа за компьютером, удаленка из дома, программист, бухгалтер, водитель, студент на лекциях. Большую часть дня вы проводите сидя, а бытовая нагрузка минимальна.</div>
        </div>
        <div class="p-2.5 rounded-2xl theme-input">
          <div class="font-extrabold text-emerald-300">🚶 Умеренный (+18% к базовому обмену)</div>
          <div class="text-[11px] opacity-90 mt-0.5"><strong>Примеры:</strong> преподаватель, врач, продавец-консультант, парикмахер, работа на ногах в течение части дня, активные игры с детьми, ежедневная готовка и уборка по дому.</div>
        </div>
        <div class="p-2.5 rounded-2xl theme-input">
          <div class="font-extrabold text-amber-300">🔨 Активный (+25% к базовому обмену)</div>
          <div class="text-[11px] opacity-90 mt-0.5"><strong>Примеры:</strong> работа в постоянном движении или физический труд (тренер, курьер, официант, строитель, работник склада/производства, работа на участке).</div>
        </div>
      </div>
      <p class="mt-2 text-[11px] opacity-85">💡 <em>Почему проценты именно такие (+12..+25%)?</em> Потому что ваши <strong>шаги</strong> и <strong>тренировки</strong> калькулятор считает отдельно с точностью до километра и минуты, чтобы не начислять калории дважды!</p>
    `
  },
  xe: {
    title: '🍞 Что такое 1 ХЕ и скорость углеводов',
    html: `
      <p><strong>1 ХЕ (Хлебная Единица) = 12 граммов</strong> чистых усваиваемых углеводов (без учета клетчатки). Без инсулина 1 ХЕ поднимает сахар крови в среднем на <strong>1.8–2.2 ммоль/л</strong>.</p>
      <div class="p-2.5 rounded-2xl theme-input space-y-1.5 mt-2">
        <div class="font-extrabold text-rose-300">🔴 Быстрые углеводы (Высокий ГИ ≥ 70) — подъем за 5–15 мин:</div>
        <div class="text-[11px] opacity-90">Фруктовый сок (100 мл = 1 ХЕ), обычная Кола, сахар/мед (1 ст.л. = 1 ХЕ), декстроза, белый хлеб, картофельное пюре, спелый банан, манка.</div>
      </div>
      <div class="p-2.5 rounded-2xl theme-input space-y-1.5 mt-1.5">
        <div class="font-extrabold text-amber-300">🟡 Средние углеводы (Средний ГИ 50–69) — усвоение за 20–40 мин:</div>
        <div class="text-[11px] opacity-90">Ржаной/цельнозерновой хлеб, овсянка долгой варки, бурый рис, отварной картофель в мундире, яблоки, груши, ягоды, молоко/кефир.</div>
      </div>
      <div class="p-2.5 rounded-2xl theme-input space-y-1.5 mt-1.5">
        <div class="font-extrabold text-emerald-300">🟢 Медленные углеводы (Низкий ГИ &lt; 50) — плавный подъем 1–3 часа:</div>
        <div class="text-[11px] opacity-90">Гречка (50 г вареной = 1 ХЕ), паста из твердых сортов пшеницы (al dente), чечевица, нут, фасоль, киноа, перловка, зеленые овощи, горький шоколад.</div>
      </div>
    `
  },
  insulins: {
    title: '💧 Группы инсулинов и примеры препаратов',
    html: `
      <p>Болюсные (пищевые) инсулины делятся по скорости начала работы и длительности действия (DIA):</p>
      <div class="space-y-2 mt-2">
        <div class="p-2.5 rounded-2xl theme-input">
          <div class="font-extrabold">⚡ Сверхбыстрые (активны 3–3.5 часа)</div>
          <div class="text-[11px] opacity-90 mt-0.5"><strong>Препараты:</strong> Фиасп (Fiasp), Люмжев (Lyumjev).<br>Колются за 0–5 мин до еды или прямо в начале приема пищи.</div>
        </div>
        <div class="p-2.5 rounded-2xl theme-input">
          <div class="font-extrabold">🚀 Ультракороткие (активны 4 часа)</div>
          <div class="text-[11px] opacity-90 mt-0.5"><strong>Препараты:</strong> НовоРапид, Хумалог, Апидра, РинФаст, Росинсулин Аспарт.<br>Требуют паузы 10–15 мин перед едой со средним ГИ.</div>
        </div>
        <div class="p-2.5 rounded-2xl theme-input">
          <div class="font-extrabold">⏱ Короткие / Регуляр (активны 5–6 часов)</div>
          <div class="text-[11px] opacity-90 mt-0.5"><strong>Препараты:</strong> Актрапид, Хумулин Регуляр, Биосулин Р.<br>Пауза 25–30 мин до еды; длинный «хвост» в один укол перекрывает БЖЕ.</div>
        </div>
        <div class="p-2.5 rounded-2xl theme-soft">
          <div class="font-extrabold">🌙 Базальные (Фоновые / Ночные)</div>
          <div class="text-[11px] opacity-90 mt-0.5"><strong>Препараты:</strong> Тресиба (Деглудек), Туджео / Лантус (Гларгин), Левемир (Детемир). Держат ровный сахар натощак и ночью.</div>
        </div>
      </div>
    `
  },
  icr: {
    title: '🧮 Что такое УК и как его считать (Правило 500)',
    html: `
      <p><strong>УК (Углеводный коэффициент)</strong> показывает, сколько единиц (ЕД) инсулина нужно на усвоение <strong>1 ХЕ (12 г углеводов)</strong>.</p>
      <div class="p-3 rounded-2xl theme-input mt-2 space-y-1">
        <div class="font-extrabold">📐 Научная формула расчета (Правило 500 / 450):</div>
        <div class="text-[11px] opacity-90">1. Найдите свою <strong>СДИ (Суточную дозу инсулина)</strong> = весь болюс за день + вся база (ночной инсулин).<br>2. Разделите <strong>500</strong> (для ультракоротких) или <strong>450</strong> (для коротких) на СДИ — вы получите количество граммов углеводов на 1 ЕД.<br>3. В пересчете на ХЕ: <strong>УК = (12 × СДИ) / 500</strong>.</div>
      </div>
      <p class="mt-2 text-[11px] opacity-85">⚠️ Утром гормоны снижают чувствительность к инсулину (УК выше на ~15%), а вечером чувствительность выше (УК ниже на ~10%).</p>
    `
  },
  isf: {
    title: '📉 Что такое ФЧИ и Правило 100 (1800)',
    html: `
      <p><strong>ФЧИ (Фактор чувствительности к инсулину)</strong> показывает, на сколько <strong>ммоль/л</strong> ровно <strong>1 ЕД</strong> инсулина снижает повышенный сахар крови.</p>
      <div class="p-3 rounded-2xl theme-input mt-2 space-y-1">
        <div class="font-extrabold">📐 Научная формула (Правило 100 для ммоль/л):</div>
        <div class="text-[11px] opacity-90">• Для ультракоротких инсулинов: <strong>ФЧИ = 100 / СДИ</strong> (где СДИ — сумма базы и болюса за сутки).<br>• Для коротких инсулинов: <strong>ФЧИ = 83 / СДИ</strong>.<br><em>Пример: при СДИ = 40 ЕД, 100 / 40 = 2.5 ммоль/л на 1 ЕД.</em></div>
      </div>
    `
  },
  targetBg: {
    title: '🎯 Целевой сахар и мягкий диапазон',
    html: `
      <p><strong>Целевой сахар</strong> — это уровень глюкозы крови, к которому калькулятор рассчитывает коррекцию (ДПС).</p>
      <div class="p-3 rounded-2xl theme-input mt-2 space-y-1.5">
        <div class="font-extrabold text-emerald-300">🛡 Мягкий безопасный диапазон (ADA / ISPAD):</div>
        <div class="text-[11px] opacity-90">• Натощак и перед едой: <strong>5.0 – 6.5 ммоль/л</strong> (оптимальная цель — <strong>5.5–5.8 ммоль/л</strong>).<br>• Через 2 часа после еды: <strong>до 7.8–8.5 ммоль/л</strong>.<br>• Перед сном и ночью: <strong>5.8 – 7.0 ммоль/л</strong> (для защиты от ночной гипогликемии).</div>
      </div>
    `
  },
  basal: {
    title: '🌙 Базальный (ночной) инсулин и компенсация',
    html: `
      <p><strong>Базальный инсулин (База)</strong> удерживает ровный сахар натощак, во сне и между приемами пищи, компенсируя фоновую выработку глюкозы печенью.</p>
      <div class="p-3 rounded-2xl theme-input mt-2 space-y-1">
        <div class="font-extrabold">⚖️ Как база влияет на расчёты:</div>
        <div class="text-[11px] opacity-90">1. В норме база составляет <strong>40–50% от всей суточной дозы (СДИ)</strong>.<br>2. Доза базы напрямую входит в расчет вашего <strong>ФЧИ (100 / СДИ)</strong> и ориентира <strong>УК (Правило 500)</strong>.</div>
      </div>
    `
  },
  bje: {
    title: '🥩🍕 Что такое БЖЕ и «Эффект пиццы»',
    html: `
      <p><strong>1 БЖЕ (Белково-Жировая Единица) = 100 ккал</strong> из белков и жиров: <code>(Белки×4 + Жиры×9) / 100</code>.</p>
      <div class="p-3 rounded-2xl theme-input mt-2 space-y-1.5">
        <div class="font-extrabold">Почему жиры и белки важны:</div>
        <div class="text-[11px] opacity-90">• <strong>Жиры (от 25–28 г)</strong> тормозят всасывание углеводов в желудке.<br>• <strong>Белки (от 30 г)</strong> через 1.5–2 часа запускают глюконеогенез в печени и дают поздний подъем сахара.<br>• По <strong>Варшавскому протоколу ISPAD</strong> на 1 БЖЕ требуется ~50% от УК во 2-й укол после еды.</div>
      </div>
    `
  },
  penStep: {
    title: '💉 Научно-логическое округление по шагу ручки',
    html: `
      <p>Обычное математическое округление опасно: округлить дозу вверх при нормальном или низковатом сахаре — значит повысить риск гипогликемии.</p>
      <div class="p-3 rounded-2xl theme-input mt-2 space-y-1">
        <div class="font-extrabold">🧠 Алгоритм округления DIAingo:</div>
        <div class="text-[11px] opacity-90">• Поддерживается шаг <strong>1.0 ЕД</strong> (ручка), <strong>0.5 ЕД</strong> (Джуниор) и <strong>0.1 ЕД</strong> (помпа).<br>• В покое и вечером дробный остаток до 60–70% шага округляется <strong>консервативно вниз</strong>.<br>• При повышенном сахаре (&gt; 6.8 ммоль/л) порог смещается для полной отработки ДПС.</div>
      </div>
    `
  }
};

function normalizeSingleProfile(p) {
  if (!p) return;
  if (!p.macroBase) p.macroBase = 'target';
  if (!p.dietType) p.dietType = 'highprot';
  if (!p.diabetesType) p.diabetesType = 'none';
  if (!p.workoutIntensity || !['low', 'mid', 'high'].includes(p.workoutIntensity)) p.workoutIntensity = 'mid';
  if (!p.icr || isNaN(p.icr) || p.icr <= 0) p.icr = 1.2;
  if (!p.insulinType) p.insulinType = 'ultralong';
  if (!p.insulinStep || ![0.1, 0.5, 1.0].includes(+p.insulinStep)) p.insulinStep = 0.5;
  if (!p.targetBg || isNaN(p.targetBg) || p.targetBg < 4.4) p.targetBg = 5.6;
  if (typeof p.customIsf === 'undefined' || isNaN(p.customIsf)) p.customIsf = 0;
  if (typeof p.basalDose === 'undefined' || isNaN(p.basalDose)) p.basalDose = 0;
  if (!Array.isArray(p.iobLog)) p.iobLog = [];
  if (!p.sectionsOpen || typeof p.sectionsOpen !== 'object') {
    p.sectionsOpen = { p1: true, p2: true, p3: true, d1: true, d2: true, d3: true };
  }
}

function getProf() {
  if (!appData.profiles[appData.activeProfile]) appData.activeProfile = 'p1';
  const p = appData.profiles[appData.activeProfile];
  normalizeSingleProfile(p);
  return p;
}

function saveStorage() {
  try { localStorage.setItem('diaingo_v16', JSON.stringify(appData)); } catch (e) {}
}

function loadStorage() {
  try {
    const keys = ['diaingo_v16', 'diaingo_v15', 'diaingo_v14', 'nutriingo_v12', 'nutriingo_v11', 'nutriingo_v10'];
    for (const k of keys) {
      const raw = localStorage.getItem(k);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && parsed.profiles) {
          appData = parsed;
          normalizeSingleProfile(appData.profiles.p1);
          normalizeSingleProfile(appData.profiles.p2);
          break;
        }
      }
    }
  } catch (e) {}
}

// Расчет индивидуального пульса на тренировке по формуле Танака (208 - 0.7 * возраст)
function getWorkoutMeta(p) {
  const age = Math.max(10, Math.min(100, +p.age || 30));
  const maxHr = Math.round(208 - 0.7 * age);
  const wObj = WORKOUT_INTENSITIES.find(x => x.id === p.workoutIntensity) || WORKOUT_INTENSITIES[1];
  const hrMin = Math.round(maxHr * wObj.hrPctMin);
  const hrMax = Math.round(maxHr * wObj.hrPctMax);
  return { ...wObj, maxHr, hrMin, hrMax };
}

function calcBMRForWeight(w, p) {
  const safeW = Math.max(30, Math.min(250, +w || 70));
  const safeH = Math.max(100, Math.min(230, +p.height || 170));
  const safeA = Math.max(10, Math.min(100, +p.age || 30));
  if (p.useBodyFat) {
    const bf = Math.max(4, Math.min(60, +p.bodyFat || 20));
    return Math.round(370 + 21.6 * (safeW * (1 - bf / 100)));
  }
  const base = 10 * safeW + 6.25 * safeH - 5 * safeA;
  return Math.round(p.gender === 'male' ? base + 5 : base - 161);
}

function calcTDEEForWeight(w, p) {
  const bmr = calcBMRForWeight(w, p);
  const neat = Math.round(bmr * (+p.neatLevel || 0.12));
  const distKm = Math.max(0, +p.steps || 0) * ((p.height * 0.415) / 100000);
  const stepsKcal = Math.round(distKm * w * 0.62);

  // Расход на тренировку напрямую зависит от выбранного уровня интенсивности (3.0 / 4.5 / 6.5 ккал/кг/ч)
  const wMeta = getWorkoutMeta(p);
  const singleWk = (Math.max(0, +p.workoutMins || 0) / 60) * w * wMeta.metFactor;
  const workoutKcal = p.workoutMode === 'today'
    ? Math.round(singleWk)
    : Math.round((singleWk * Math.min(7, Math.max(0, +p.workoutDays || 0))) / 7);

  return { bmr, neat, distKm, stepsKcal, workoutKcal, singleWkKcal: Math.round(singleWk), wMeta, tdee: bmr + neat + stepsKcal + workoutKcal };
}

function roundSmartInsulin(rawUnits, stepVal, context = 'normal') {
  if (!rawUnits || isNaN(rawUnits) || rawUnits <= 0) return 0;
  const step = (+stepVal === 1.0 || +stepVal === 0.1) ? +stepVal : 0.5;
  const quotient = rawUnits / step;
  const intPart = Math.floor(quotient + 1e-7);
  const frac = Math.max(0, quotient - intPart);

  let upThreshold = 0.58;
  if (context === 'hypo_risk') upThreshold = 0.70;
  else if (context === 'hyper') upThreshold = 0.42;

  const stepsCount = (frac + 1e-7) >= upThreshold ? intPart + 1 : intPart;
  return +(stepsCount * step).toFixed(1);
}

function computeActiveIOB(p) {
  const ins = INSULIN_TYPES.find(x => x.id === p.insulinType) || INSULIN_TYPES[1];
  const diaMs = ins.diaHours * 3600 * 1000;
  const now = Date.now();
  let totalIob = 0;
  const activeRecords = [];

  (p.iobLog || []).forEach(item => {
    const elapsedMs = now - item.ts;
    if (elapsedMs >= 0 && elapsedMs < diaMs) {
      const elapsedMin = elapsedMs / 60000;
      const totalMin = ins.diaHours * 60;
      let remFrac = 1.0;
      if (elapsedMin > 15) {
        remFrac = Math.max(0, 1 - (elapsedMin - 15) / (totalMin - 15));
      }
      const remUnits = +(item.units * remFrac).toFixed(2);
      if (remUnits >= 0.05) {
        totalIob += remUnits;
        const leftSecTotal = Math.max(0, Math.round((diaMs - elapsedMs) / 1000));
        const h = Math.floor(leftSecTotal / 3600);
        const m = Math.floor((leftSecTotal % 3600) / 60);
        const s = leftSecTotal % 60;
        const leftText = h > 0 ? `${h}ч ${String(m).padStart(2, '0')}м` : `${m}м ${String(s).padStart(2, '0')}с`;
        const pctLeft = Math.min(100, Math.round(remFrac * 100));
        activeRecords.push({
          ...item,
          remUnits: +remUnits.toFixed(1),
          leftText,
          pctLeft
        });
      }
    }
  });

  return { totalIob: +totalIob.toFixed(1), activeRecords, diaHours: ins.diaHours };
}

function logInsulinInjection(units) {
  const u = parseFloat(units);
  if (!u || u <= 0) {
    alert('⚠️ Доза равна 0 ЕД. Введите углеводы или текущий сахар для расчета укола.');
    return;
  }
  const p = getProf();
  const d = new Date();
  const timeStr = d.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
  p.iobLog.unshift({ ts: Date.now(), units: +u.toFixed(1), timeStr });
  if (p.iobLog.length > 10) p.iobLog = p.iobLog.slice(0, 10);
  saveStorage();
  renderApp();
}

function clearIobLog() {
  const p = getProf();
  p.iobLog = [];
  saveStorage();
  renderApp();
}

function toggleSection(secKey) {
  const p = getProf();
  p.sectionsOpen[secKey] = p.sectionsOpen[secKey] === false ? true : false;
  saveStorage();
  renderApp();
}

function computeDailyInsulinPlan(m, p) {
  const ins = INSULIN_TYPES.find(x => x.id === p.insulinType) || INSULIN_TYPES[1];
  const dayXE = +(m.normC / 12).toFixed(1);
  const dayFpKcal = Math.round(m.normP * 4 + m.normF * 9);
  const dayBJE = +(dayFpKcal / 100).toFixed(1);

  const splits = [
    { slot: 'morning', name: '🌅 Завтрак (30%)', share: 0.30, icrMult: 1.15, ctx: 'normal' },
    { slot: 'lunch',   name: '☀️ Обед (35%)',    share: 0.35, icrMult: 1.00, ctx: 'normal' },
    { slot: 'evening', name: '🌙 Ужин (25%)',    share: 0.25, icrMult: 0.90, ctx: 'hypo_risk' },
    { slot: 'night',   name: '🍏 Перекус (10%)', share: 0.10, icrMult: 0.95, ctx: 'hypo_risk' }
  ].map(s => {
    const cG = Math.round(m.normC * s.share);
    const pG = Math.round(m.normP * s.share);
    const fG = Math.round(m.normF * s.share);
    const xe = +(cG / 12).toFixed(1);
    const bje = +((pG * 4 + fG * 9) / 100).toFixed(1);
    const effIcr = +(p.icr * s.icrMult).toFixed(2);
    const preU = roundSmartInsulin(xe * effIcr, p.insulinStep, s.ctx);
    const postU = (!ins.coversBJE && bje >= 1.0) ? roundSmartInsulin(bje * effIcr * 0.5, p.insulinStep, s.ctx) : 0;
    const totU = +(preU + postU).toFixed(1);
    return { ...s, cG, pG, fG, xe, bje, effIcr, preU, postU, totU };
  });

  const dayCarbBolus = +(splits.reduce((acc, s) => acc + s.preU, 0)).toFixed(1);
  const dayBjeBolus = +(splits.reduce((acc, s) => acc + s.postU, 0)).toFixed(1);
  const totalBolusDay = +(dayCarbBolus + dayBjeBolus).toFixed(1);

  const autoBasal = Math.max(4, Math.round(Math.max(p.weight * 0.22, totalBolusDay * 0.82)));
  const effectiveBasal = (p.basalDose && p.basalDose > 0) ? +p.basalDose : autoBasal;
  const totalDailyDose = +(totalBolusDay + effectiveBasal).toFixed(1);
  const basalPct = totalDailyDose > 0 ? Math.round((effectiveBasal / totalDailyDose) * 100) : 45;

  let basalStatus = 'ok';
  let basalNote = `Оптимальный баланс: база составляет ${basalPct}% от СДИ (${totalDailyDose} ЕД).`;
  if (basalPct > 56) {
    basalStatus = 'high';
    basalNote = `⚠️ Доля базы высокая (${basalPct}% от СДИ). Возможны провалы сахара натощак и ночью — осторожнее с ДПС!`;
  } else if (basalPct < 33) {
    basalStatus = 'low';
    basalNote = `ℹ️ Доля базы низкая (${basalPct}% от СДИ). Если сахар растет натощак, часть болюса уходит на покрытие фона.`;
  }

  const autoIsf = +(ins.isfRule / Math.max(8, totalDailyDose)).toFixed(1);
  const effectiveIsf = (p.customIsf && p.customIsf > 0) ? +p.customIsf.toFixed(1) : autoIsf;
  const rule500Icr = +((12 * Math.max(8, totalDailyDose)) / (ins.id === 'short' ? 450 : 500)).toFixed(2);

  if (!mealBolus.initialized || !mealBolus.customEdited) {
    const activeSlot = typeof mealTimeSlot !== 'undefined' ? mealTimeSlot : 'lunch';
    const found = splits.find(x => x.slot === activeSlot) || splits[1];
    mealBolus.p = found.pG;
    mealBolus.f = found.fG;
    mealBolus.c = found.cG;
    mealBolus.initialized = true;
  }

  return {
    ins, dayXE, dayBJE, dayCarbBolus, dayBjeBolus, totalBolusDay,
    autoBasal, effectiveBasal, totalDailyDose, basalPct, basalStatus, basalNote,
    autoIsf, effectiveIsf, rule500Icr, splits
  };
}

function computeMetrics() {
  const p = getProf();
  const curr = calcTDEEForWeight(p.weight, p);
  const hm = p.height / 100;
  const bmi = +(p.weight / (hm * hm)).toFixed(1);
  const targetBmi = +(p.targetWeight / (hm * hm)).toFixed(1);

  const diffKg = p.targetWeight - p.weight;
  const dailyDelta = Math.round((diffKg * 7700) / Math.max(7, p.targetWeeks * 7));
  const weeklyKg = +(diffKg / Math.max(1, p.targetWeeks)).toFixed(2);
  const targetKcal = curr.tdee + dailyDelta;

  const weightBasedMin = Math.round(p.weight * (p.diabetesType !== 'none' ? 22.5 : 20.0));
  let bmrBasedMin = p.gender === 'female' ? Math.round(curr.bmr * 0.88) : Math.round(curr.bmr * 0.90);
  if (p.diabetesType !== 'none') {
    bmrBasedMin = Math.max(bmrBasedMin, Math.round(curr.tdee * 0.75));
  }
  let minSafe = Math.max(weightBasedMin, bmrBasedMin);
  minSafe = p.diabetesType === 'none' ? Math.max(1200, minSafe) : Math.max(1400, minSafe);

  const effectiveKcal = Math.max(minSafe, targetKcal);

  const estBf = p.useBodyFat ? p.bodyFat : (p.gender === 'female' ? 24 : 18);
  const lbmWeight = +(p.weight * (1 - estBf / 100)).toFixed(1);
  let refWeight = p.targetWeight, refLabel = 'желаемого веса';
  if (p.macroBase === 'current') { refWeight = p.weight; refLabel = 'текущего веса'; }
  else if (p.macroBase === 'lbm') { refWeight = lbmWeight; refLabel = 'сухой массы'; }

  // Влияние интенсивности тренировок на потребность в белке и гликогене (для всех людей)
  const hasActiveWorkouts = (p.workoutMode === 'today' && p.workoutMins > 0) || (p.workoutDays >= 2 && p.workoutMins > 0);
  const isHighLoad = hasActiveWorkouts && p.workoutIntensity === 'high';
  const isMidLoad = hasActiveWorkouts && p.workoutIntensity === 'mid';

  const minProtFactor = isHighLoad ? 1.55 : (isMidLoad ? 1.35 : 1.20);
  const maxProtG = Math.round((effectiveKcal * 0.40) / 4);
  const minProtG = Math.round(refWeight * minProtFactor);

  let normP = Math.round(refWeight * p.protGkg);
  normP = Math.max(minProtG, Math.min(maxProtG, normP));

  const minFatG = Math.round(refWeight * 0.65);
  let normF = Math.max(minFatG, Math.round(refWeight * p.fatGkg));

  // Дополнительный буфер углеводов на восстановление гликогена при высокой/средней интенсивности тренировок
  const workoutCarbBonus = (p.dietType === 'keto') ? 0 : (isHighLoad ? 20 : (isMidLoad ? 10 : 0));
  let normC = 150;

  if (p.diabetesType === 'none') {
    if (p.dietType === 'keto') {
      normC = Math.max(20, Math.min(40, Math.round((effectiveKcal * 0.08) / 4)));
      normF = Math.max(minFatG, Math.round((effectiveKcal - normP * 4 - normC * 4) / 9));
    } else if (p.dietType === 'lowcarb') {
      const rawC = Math.round((effectiveKcal - normP * 4 - normF * 9) / 4);
      normC = Math.max(50 + workoutCarbBonus, Math.min(115 + workoutCarbBonus, rawC));
      normF = Math.max(minFatG, Math.round((effectiveKcal - normP * 4 - normC * 4) / 9));
    } else {
      let rawC = Math.round((effectiveKcal - normP * 4 - normF * 9) / 4);
      const minHealthyC = (p.dietType === 'energy' ? 140 : 85) + workoutCarbBonus;
      if (rawC < minHealthyC) {
        normC = minHealthyC;
        const remForFat = effectiveKcal - normP * 4 - normC * 4;
        if (remForFat >= minFatG * 9) {
          normF = Math.round(remForFat / 9);
        } else {
          normF = minFatG;
          normP = Math.max(minProtG, Math.round((effectiveKcal - normF * 9 - normC * 4) / 4));
        }
      } else {
        normC = rawC;
      }
    }
    normC = Math.max(20, Math.round((effectiveKcal - normP * 4 - normF * 9) / 4));
  } else {
    let minCarbG = 60, maxCarbG = 180;
    if (p.dietType === 'keto') {
      minCarbG = p.diabetesType === 'dm1' ? 80 : 25;
      maxCarbG = p.diabetesType === 'dm1' ? 110 : 40;
    } else if (p.dietType === 'lowcarb') {
      minCarbG = (p.diabetesType === 'dm1' ? 90 : 60) + Math.round(workoutCarbBonus * 0.5);
      maxCarbG = (p.diabetesType === 'dm1' ? 120 : 95) + workoutCarbBonus;
    } else if (p.dietType === 'highprot') {
      minCarbG = (p.diabetesType === 'dm2' ? 75 : 110) + Math.round(workoutCarbBonus * 0.5);
      maxCarbG = (p.diabetesType === 'dm2' ? 125 : 155) + workoutCarbBonus;
    } else if (p.dietType === 'energy') {
      minCarbG = (p.diabetesType === 'dm2' ? 100 : 140) + workoutCarbBonus;
      maxCarbG = (p.diabetesType === 'dm2' ? 150 : 210) + workoutCarbBonus;
    } else {
      minCarbG = (p.diabetesType === 'dm2' ? 85 : 120) + Math.round(workoutCarbBonus * 0.5);
      maxCarbG = (p.diabetesType === 'dm2' ? 135 : 175) + workoutCarbBonus;
    }

    const rawRemC = Math.round((effectiveKcal - normP * 4 - normF * 9) / 4);
    normC = Math.max(minCarbG, Math.min(maxCarbG, rawRemC));

    const remForFatKcal = effectiveKcal - normP * 4 - normC * 4;
    if (remForFatKcal < minFatG * 9) {
      normF = minFatG;
      normP = Math.max(minProtG, Math.round((effectiveKcal - normF * 9 - normC * 4) / 4));
      normC = Math.max(25, Math.round((effectiveKcal - normP * 4 - normF * 9) / 4));
    } else {
      normF = Math.round(remForFatKcal / 9);
    }
  }

  const realPpct = Math.round((normP * 4 / effectiveKcal) * 100);
  const realFpct = Math.round((normF * 9 / effectiveKcal) * 100);
  const realCpct = Math.max(0, 100 - realPpct - realFpct);
  const totalXE = +(normC / 12).toFixed(1);
  const maxMealCarbs = p.diabetesType === 'dm2' ? Math.min(36, Math.round(normC / 3.2)) : Math.round(normC / 3.2);
  const maxMealXE = +(maxMealCarbs / 12).toFixed(1);
  const fiberNorm = Math.round((effectiveKcal / 1000) * (p.diabetesType === 'none' ? 14 : 18));
  const effProtGkg = +(normP / refWeight).toFixed(1);
  const effFatGkg = +(normF / refWeight).toFixed(1);

  return {
    ...curr, bmi, targetBmi, targetKcal, effectiveKcal, minSafe, dailyDelta, weeklyKg,
    refWeight, refLabel, lbmWeight, normP, normF, normC, realPpct, realFpct, realCpct,
    totalXE, maxMealCarbs, maxMealXE, fiberNorm, effProtGkg, effFatGkg
  };
}

function computeHypoRescue(currBgVal, p) {
  let rawBg = parseFloat(String(currBgVal).replace(',', '.'));
  if (!isNaN(rawBg) && rawBg > 25) rawBg = +(rawBg / 18).toFixed(1);
  const bg = (!isNaN(rawBg) && rawBg > 0) ? Math.max(1.0, Math.min(10.0, rawBg)) : 3.3;
  const target = Math.max(5.2, p.targetBg || 5.6);
  const deficitMmol = Math.max(0.5, target - bg);
  const raisePerGram = 20 / Math.max(35, p.weight);
  const rawGrams = Math.round(deficitMmol / raisePerGram);
  const fastCarbGrams = Math.max(10, Math.min(30, rawGrams));
  const xe = +(fastCarbGrams / 12).toFixed(1);
  const sugarCubes = Math.max(2, Math.round(fastCarbGrams / 5));
  const juiceMl = Math.round((fastCarbGrams / 11) * 100);
  const dextroseTabs = Math.max(2, Math.round(fastCarbGrams / 4));
  return { bg, target, fastCarbGrams, xe, sugarCubes, juiceMl, dextroseTabs };
}

function setDiabetesType(dType) {
  const p = getProf();
  p.diabetesType = dType;
  if (dType === 'dm1') {
    if (p.dietType === 'keto') p.dietType = 'lowcarb';
    p.protGkg = 1.7;
    p.fatGkg = 1.0;
  } else if (dType === 'dm2') {
    if (p.dietType === 'balanced') p.dietType = 'lowcarb';
    p.protGkg = 1.8;
    p.fatGkg = 1.0;
  }
  mealBolus.customEdited = false;
  saveStorage();
  renderApp();
}

function formatDateOffset(days) {
  const d = new Date();
  d.setDate(d.getDate() + Math.round(days));
  return d.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' });
}

function selectDietType(typeId) {
  const p = getProf();
  if (p.diabetesType === 'dm1' && typeId === 'keto') {
    alert('⚠️ При СД 1 типа строгое Кето не рекомендуется из-за риска кетоацидоза. Выбран безопасный низкоуглеводный режим (Low-Carb).');
    typeId = 'lowcarb';
  }
  const dt = DIET_TYPES.find(x => x.id === typeId);
  if (!dt) return;
  p.dietType = typeId;
  p.pPct = dt.p;
  p.fPct = dt.f;
  p.cPct = dt.c;
  p.protGkg = dt.pGkg;
  p.fatGkg = dt.fGkg;
  mealBolus.customEdited = false;
  saveStorage();
  renderApp();
}

function setParam(key, val) {
  const p = getProf();
  const cleanVal = String(val).replace(',', '.');
  if (['age', 'height', 'steps', 'workoutDays', 'workoutMins', 'targetWeeks'].includes(key)) {
    p[key] = Math.max(0, parseInt(cleanVal, 10) || 0);
  } else if (['weight', 'bodyFat', 'neatLevel', 'targetWeight', 'presetDelta', 'protGkg', 'fatGkg', 'icr', 'targetBg', 'customIsf', 'insulinStep', 'basalDose'].includes(key)) {
    p[key] = Math.max(0, parseFloat(cleanVal) || 0);
  } else {
    p[key] = val;
  }
  if (key === 'icr') p.icr = Math.max(0.1, Math.min(6.0, p.icr));
  if (key === 'insulinStep' && ![0.1, 0.5, 1.0].includes(p.insulinStep)) p.insulinStep = 0.5;
  if (key === 'targetBg') p.targetBg = Math.max(4.4, Math.min(9.0, p.targetBg));
  if (key === 'basalDose') p.basalDose = Math.max(0, Math.min(120, p.basalDose));
  if (key === 'age') p.age = Math.max(10, Math.min(100, p.age));
  if (key === 'height') p.height = Math.max(100, Math.min(230, p.height));
  if (key === 'weight') p.weight = Math.max(30, Math.min(250, p.weight));
  if (key === 'targetWeight') p.targetWeight = Math.max(30, Math.min(250, p.targetWeight));
  if (key === 'targetWeeks') p.targetWeeks = Math.max(1, Math.min(156, p.targetWeeks));

  mealBolus.customEdited = false;
  saveStorage();
  renderApp();
}

function setMealBolus(k, v) {
  if (k === 'gi') {
    mealBolus.gi = v;
  } else if (k === 'currBg') {
    let clean = String(v).replace(',', '.').trim();
    if (clean === '') {
      mealBolus.currBg = '';
    } else {
      let num = parseFloat(clean) || 0;
      if (num > 35) num = +(num / 18).toFixed(1);
      mealBolus.currBg = Math.max(1.5, Math.min(35.0, num));
    }
  } else {
    const cleanVal = String(v).replace(',', '.');
    mealBolus[k] = Math.max(0, Math.min(500, Math.round(parseFloat(cleanVal) || 0)));
    mealBolus.customEdited = true;
  }
  renderApp();
}

function parseSmartFoodText(rawText) {
  if (!rawText || !rawText.trim()) return false;
  const txt = rawText.toLowerCase().replace(/,/g, '.');

  const pMatch = txt.match(/(?:бел[а-я]*|б|prot[a-z]*)\s*[:=-]?\s*(\d+(?:\.\d+)?)/i);
  const fMatch = txt.match(/(?:жир[а-я]*|ж|fat[a-z]*)\s*[:=-]?\s*(\d+(?:\.\d+)?)/i);
  const cMatch = txt.match(/(?:угл[а-я]*|у|carb[a-z]*)\s*[:=-]?\s*(\d+(?:\.\d+)?)/i);

  if (pMatch || fMatch || cMatch) {
    if (pMatch) mealBolus.p = Math.min(500, Math.round(parseFloat(pMatch[1])));
    if (fMatch) mealBolus.f = Math.min(500, Math.round(parseFloat(fMatch[1])));
    if (cMatch) mealBolus.c = Math.min(500, Math.round(parseFloat(cMatch[1])));
    mealBolus.customEdited = true;
    renderApp();
    return true;
  }

  const nums = txt.match(/\d+(?:\.\d+)?/g);
  if (nums && nums.length >= 3) {
    mealBolus.p = Math.min(500, Math.round(parseFloat(nums[0])));
    mealBolus.f = Math.min(500, Math.round(parseFloat(nums[1])));
    mealBolus.c = Math.min(500, Math.round(parseFloat(nums[2])));
    mealBolus.customEdited = true;
    renderApp();
    return true;
  }
  return false;
}

function switchProfile(pk) {
  appData.activeProfile = pk;
  mealBolus.initialized = false;
  mealBolus.customEdited = false;
  saveStorage();
  renderApp();
}

function applySmartMacros(protG, fatG) {
  const p = getProf();
  p.protGkg = protG;
  p.fatGkg = fatG;
  mealBolus.customEdited = false;
  saveStorage();
  renderApp();
}

setInterval(() => {
  try {
    const p = getProf();
    if (!p.iobLog || p.iobLog.length === 0) return;
    const iobData = computeActiveIOB(p);
    const badge = document.getElementById('live-iob-units');
    const sub = document.getElementById('live-iob-sub');
    if (badge && iobData.activeRecords.length > 0) {
      badge.textContent = `${iobData.totalIob} ЕД`;
      if (sub) {
        sub.textContent = `Укол ${iobData.activeRecords[0].units} ЕД в ${iobData.activeRecords[0].timeStr} · осталось ${iobData.activeRecords[0].leftText}`;
      }
    } else if (badge && iobData.totalIob === 0) {
      renderApp();
    }
  } catch (e) {}
}, 1000);
