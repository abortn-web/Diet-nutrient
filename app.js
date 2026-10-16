const WORKOUT_INTENSITIES = [
  {
    id: 'low',
    name: 'Легкая',
    metFactor: 3.0,
    hrPctMin: 0.55,
    hrPctMax: 0.65,
    shortDesc: 'Йога, пилатес, стретчинг, ЛФК',
    examples: 'Йога, пилатес, стретчинг, суставная гимнастика, спокойное плавание, настольный теннис, неспешный велопрогулочный темп.'
  },
  {
    id: 'mid',
    name: 'Средняя',
    metFactor: 4.5,
    hrPctMin: 0.65,
    hrPctMax: 0.76,
    shortDesc: 'Силовая в зале, фитнес, кардио',
    examples: 'Классическая силовая тренировка в тренажерном зале (с отдыхом 1.5–2 мин между подходами), групповой фитнес, эллипс, бодрое плавание, сноуборд/горные лыжи.'
  },
  {
    id: 'high',
    name: 'Высокая',
    metFactor: 6.5,
    hrPctMin: 0.76,
    hrPctMax: 0.88,
    shortDesc: 'Кроссфит, HIIT, бег, спарринги',
    examples: 'Интенсивный кроссфит, круговые и интервальные тренировки (HIIT/Табата), бег в темпе, бокс/единоборства, футбол/баскетбол, тяжелый силовой день ног/спины с коротким отдыхом.'
  }
];
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
 // Текущий выбранный день в 3-дневном дневнике (1, 2 или 3) и состояние расчета
let activeDiaryDay = 1;
let diaryCalibrationVisible = false;
let editingDiaryId = null;

const CURR_BG_HELP = {
  title: '💧 Зачем вводить текущий сахар перед едой?',
  html: `
    <p>Это поле нужно для автоматического расчёта <strong>ДПС (дозы на коррекцию сахара)</strong> и точного времени паузы перед едой:</p>
    <div class="p-3 rounded-2xl theme-input space-y-1.5 mt-2">
      <div>📈 <strong>Если сахар выше целевого:</strong> калькулятор прибавит нужную дозу инсулина (по вашему ФЧИ) к уколу на еду и подскажет, на сколько минут увеличить паузу перед приемом пищи.</div>
      <div>📉 <strong>Если сахар ниже целевого:</strong> калькулятор бережно уменьшит дозу болюса и отменит паузу, чтобы защитить вас от гипогликемии.</div>
      <div>✨ <strong>Если сахар в норме:</strong> поле можно оставить пустым — расчёт пойдёт ровно по КБЖУ.</div>
    </div>
  `
};

const WORKOUT_DIABETES_HELP = {
  title: '🏃 Как режим «Тренировка сегодня» меняет расчёт инсулина?',
  html: `
    <p>Эта кнопка синхронизирована с первой вкладкой («КБЖУ и План»). Когда она включена, приложение учитывает работу ваших мышц и защищает от спортивной гипогликемии:</p>
    <div class="space-y-2 mt-2">
      <div class="p-2.5 rounded-2xl theme-input">
        <div class="font-extrabold text-emerald-300">1. Автоматическое снижение УК (по стандартам ISPAD / ADA):</div>
        <div class="text-[11px] opacity-90 mt-0.5">Во время и в течение 4–6 часов после физической нагрузки мышцы поглощают глюкозу напрямую (через рецепторы GLUT-4), поэтому чувствительность к инсулину резко растёт:<br>• 🧘 <strong>Лёгкая тренировка:</strong> УК снижается на <strong>10% (×0.90)</strong>.<br>• 🏋️ <strong>Средняя тренировка:</strong> УК снижается на <strong>20% (×0.80)</strong>.<br>• 🔥 <strong>Высокая тренировка:</strong> УК снижается на <strong>25% (×0.75)</strong>, а пауза до еды сокращается.</div>
      </div>
      <div class="p-2.5 rounded-2xl theme-input">
        <div class="font-extrabold text-sky-300">2. Кардио vs Силовая / Интенсив (Важное отличие!):</div>
        <div class="text-[11px] opacity-90 mt-0.5">• <strong>Аэробная нагрузка (ходьба, бег трусцой, плавание, пульс до 135 уд/мин):</strong> плавно и быстро снижает сахар прямо во время занятия.<br>• <strong>Тяжелая силовая / Кроссфит / Спринты (пульс &gt; 145 уд/мин):</strong> из-за выброса адреналина и лактата сахар во время тренировки может временно <strong>вырасти на 2–3 ммоль/л</strong>! Не скалывайте этот пик полной ДПС — через 1–2 часа после зала мышцы начнут активно забирать глюкозу, и сахар пойдет вниз сам.</div>
      </div>
      <div class="p-2.5 rounded-2xl theme-soft">
        <div class="font-extrabold">🛡 Главные правила безопасности:</div>
        <div class="text-[11px] opacity-90 mt-0.5">• Не начинайте тренировку при сахаре <strong>ниже 5.5 ммоль/л</strong> (съешьте 1 ХЕ перед стартом) или <strong>выше 13.5 ммоль/л</strong>.<br>• Всегда держите под рукой быстрые углеводы (сок / декстрозу).<br>• После вечерней тренировки контролируйте ночной сахар — мышцы пополняют гликоген всю ночь!</div>
      </div>
    </div>
  `
};

function currentHHMM() {
  const d = new Date();
  return d.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
}

function logInsulinInjection(units) {
  const u = parseFloat(units);
  if (!u || u <= 0) {
    alert('⚠️ Доза равна 0 ЕД. Введите углеводы или текущий сахар для расчета укола.');
    return;
  }
  const p = getProf();
  const timeStr = currentHHMM();
  p.iobLog.unshift({ ts: Date.now(), units: +u.toFixed(1), timeStr });
  if (p.iobLog.length > 10) p.iobLog = p.iobLog.slice(0, 10);

  // Автоматическая фиксация приема пищи и укола в активный день 3-дневного дневника
  const slotLabels = { morning: 'Завтрак', lunch: 'Обед', evening: 'Ужин', night: 'Ночь/Перекус' };
  const mealName = slotLabels[mealTimeSlot] || 'Прием пищи';
  const pG = +mealBolus.p || 0;
  const fG = +mealBolus.f || 0;
  const cG = +mealBolus.c || 0;
  const xe = +(cG / 12).toFixed(1);
  const bg = (mealBolus.currBg !== '' && !isNaN(parseFloat(mealBolus.currBg))) ? parseFloat(mealBolus.currBg) : null;

  p.diary3d.unshift({
    id: Date.now(),
    day: activeDiaryDay,
    time: timeStr,
    type: 'meal',
    p: pG,
    f: fG,
    c: cG,
    xe: xe,
    bg: bg,
    insulin: +u.toFixed(1),
    title: `🍽 ${mealName}: Б:${pG}г Ж:${fG}г У:${cG}г (${xe} ХЕ)`,
    notes: `ГИ: ${mealBolus.gi === 'low' ? 'низкий' : mealBolus.gi === 'high' ? 'высокий' : 'средний'}`
  });
  if (p.diary3d.length > 60) p.diary3d = p.diary3d.slice(0, 60);

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

function toggleWorkoutTodayMode() {
  const p = getProf();
  if (p.workoutMode === 'today') {
    p.workoutMode = 'avg';
  } else {
    p.workoutMode = 'today';
    if (!p.workoutMins || p.workoutMins <= 0) p.workoutMins = 60;
    if (!p.workoutDays || p.workoutDays <= 0) p.workoutDays = 3;
  }
  mealBolus.customEdited = false;
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
  editingDiaryId = null;
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

function blurOnEnter(e) {
  if (e.key === 'Enter') e.target.blur();
}

function getShortInsulinLabel(id) {
  if (id === 'ultrafast') return '⚡ Сверхбыстрый инсулин';
  if (id === 'ultralong') return '🚀 Ультракороткий инсулин';
  return '⏱ Короткий (Регуляр)';
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

  const wMeta = getWorkoutMeta(p);
  const isWorkoutToday = p.workoutMode === 'today' && p.workoutMins > 0;
  let workoutIcrMult = 1.0;
  let workoutWaitCut = 0;
  if (isWorkoutToday) {
    if (p.workoutIntensity === 'high') { workoutIcrMult = 0.75; workoutWaitCut = 7; }
    else if (p.workoutIntensity === 'mid') { workoutIcrMult = 0.80; workoutWaitCut = 5; }
    else { workoutIcrMult = 0.90; workoutWaitCut = 3; }
  }

  const effIcr = +(p.icr * timeMult * workoutIcrMult).toFixed(2);
  const rawCarbU = +(xe * effIcr).toFixed(2);
  const bjeFactor = (fGrams >= 30 && cGrams >= 25) ? 0.55 : 0.50;
  const rawBjeU = bje >= 1.0 ? +(bje * effIcr * bjeFactor).toFixed(2) : 0;

  const isf = (dayPlan && dayPlan.effectiveIsf > 0) ? dayPlan.effectiveIsf : 2.5;
  let rawDps = 0, safeDps = 0, iobSubtracted = 0, hyperResistMult = 1.0, isDpsCapped = false;

  const hasBg = mealBolus.currBg !== '' && !isNaN(parseFloat(mealBolus.currBg));
  const bgVal = hasBg ? parseFloat(mealBolus.currBg) : null;
  const isHypoNow = hasBg && bgVal < 4.2;
  const isHighBg = hasBg && bgVal > p.targetBg + 0.4;
  const isSevereHyper = hasBg && bgVal >= 13.0;

  let roundCtx = (mealTimeSlot === 'evening' || mealTimeSlot === 'night' || isWorkoutToday) ? 'hypo_risk' : 'normal';
  if (hasBg && bgVal < 4.8) roundCtx = 'hypo_risk';
  else if (hasBg && bgVal >= 6.8) roundCtx = 'hyper';

  const maxSafeSingleDps = Math.max(4.0, Math.min(7.0, +((dayPlan ? dayPlan.totalDailyDose : 35) * 0.18).toFixed(1)));

  if (hasBg && bgVal > 0) {
    const diffBg = bgVal - p.targetBg;
    if (bgVal >= 13.5) hyperResistMult = 1.20;
    else if (bgVal >= 11.0) hyperResistMult = 1.12;

    const workoutDpsFactor = (isWorkoutToday && diffBg > 0) ? 0.85 : 1.0;
    rawDps = +((diffBg / isf) * hyperResistMult * workoutDpsFactor).toFixed(2);

    if (rawDps > 0) {
      const useSub = (typeof subtractIobFromDps !== 'undefined') ? subtractIobFromDps : false;
      const activeIob = (useSub && iobData) ? iobData.totalIob : 0;
      safeDps = Math.max(0, +(rawDps - activeIob).toFixed(2));
      iobSubtracted = +(rawDps - safeDps).toFixed(1);
      if (safeDps > maxSafeSingleDps) {
        safeDps = maxSafeSingleDps;
        isDpsCapped = true;
      }
    } else if (diffBg < -0.3) {
      safeDps = +rawDps.toFixed(2);
    }
  }

  const fatToCarbRatio = cGrams > 0 ? (fGrams / cGrams) : 1.0;
  const isPizzaEffect = !ins.coversBJE && fGrams >= 28 && cGrams >= 24 && fatToCarbRatio >= 0.35 && (!hasBg || bgVal < 9.0);
  const delayedCarbShare = isPizzaEffect ? (fGrams >= 40 ? 0.30 : 0.25) : 0;
  const rawDelayedCarb = +(rawCarbU * delayedCarbShare).toFixed(2);
  const rawUpfrontCarb = +(rawCarbU - rawDelayedCarb).toFixed(2);

  const splitWaves = (rawBjeU >= 0.35 || rawDelayedCarb >= 0.35) && !ins.coversBJE && !isZeroFood;

  const upfrontCarbUnits = roundSmartInsulin(rawUpfrontCarb, p.insulinStep, roundCtx);
  const delayedCarbUnits = roundSmartInsulin(rawDelayedCarb, p.insulinStep, roundCtx);
  const bjeUnits = roundSmartInsulin(rawBjeU, p.insulinStep, roundCtx);
  const dpsRounded = safeDps >= 0
    ? roundSmartInsulin(safeDps, p.insulinStep, 'hyper')
    : -roundSmartInsulin(Math.abs(safeDps), p.insulinStep, 'normal');

  const basePreUnits = splitWaves ? upfrontCarbUnits : +(upfrontCarbUnits + bjeUnits).toFixed(1);
  const preUnits = (isHypoNow && isZeroFood) ? 0 : Math.max(0, +(basePreUnits + dpsRounded).toFixed(1));
  const postUnits = splitWaves ? +(bjeUnits + delayedCarbUnits).toFixed(1) : 0;
  const totalUnits = +(preUnits + postUnits).toFixed(1);
  const waveHours = bje < 1 ? 0 : (bje < 2 ? 3 : (bje < 3 ? 4 : (fGrams >= 35 ? 6 : 5)));

  let waitMin = ins.baseWait;
  if (mealBolus.gi === 'low') waitMin -= (ins.id === 'ultrafast' ? 4 : 6);
  else if (mealBolus.gi === 'high') waitMin += (ins.id === 'ultrafast' ? 5 : 7);

  if (mealTimeSlot === 'morning') waitMin += 3;
  else if (mealTimeSlot === 'evening' || mealTimeSlot === 'night') waitMin -= 2;

  if (cGrams >= 60 && fatToCarbRatio < 0.30 && mealBolus.gi !== 'low') {
    waitMin += 3;
  }

  if (isWorkoutToday) {
    waitMin -= workoutWaitCut;
  }

  let extraHyperWait = 0;
  if (hasBg && bgVal > 6.8) {
    const excessMmol = bgVal - 6.5;
    const minPerMmol = ins.id === 'ultrafast' ? 2.0 : (ins.id === 'ultralong' ? 3.2 : 4.0);
    extraHyperWait = Math.min(30, Math.round(excessMmol * minPerMmol));
    waitMin += extraHyperWait;
  }

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
    dynamicWaitText = isWorkoutToday
      ? 'Колите прямо в начале или середине еды без паузы (защита от гипы в день тренировки)'
      : (mealBolus.gi === 'low'
        ? 'Колите в середине или сразу после еды (медленные углеводы с низким ГИ)'
        : 'Колите прямо в начале еды без паузы (высокая доля жиров замедлит всасывание)');
  } else if (waitMin <= 4) {
    dynamicWaitText = `За 3–5 мин ДО еды (ГИ: ${mealBolus.gi === 'low' ? 'низкий' : mealBolus.gi === 'high' ? 'высокий' : 'средний'})`;
  } else {
    dynamicWaitText = `Пауза ~${waitMin}–${waitMin + 4} мин ДО еды (ГИ: ${mealBolus.gi === 'low' ? 'низкий' : mealBolus.gi === 'high' ? 'высокий' : 'средний'})`;
  }

  let postTimingText = 'не требуется';
  let postExplainTiming = 'через 90–120 мин';
  const isProteinDominant = pGrams >= 30 && !isPizzaEffect;

  if (splitWaves) {
    if (isPizzaEffect) {
      postTimingText = 'через 60–75 мин ПОСЛЕ еды (на задержанные жиром угл. + БЖЕ)';
      postExplainTiming = 'через 60–75 мин';
    } else if (isProteinDominant) {
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
  if (isWorkoutToday) {
    const cutPct = Math.round((1 - workoutIcrMult) * 100);
    kineticAlerts.push(`🏃 <strong>Режим «Тренировка сегодня» (${wMeta.name}, ЧСС ${wMeta.hrMin}–${wMeta.hrMax} уд/мин):</strong> Рабочий УК автоматически снижен на <strong>-${cutPct}% (до ${effIcr})</strong>, а пауза сокращена, чтобы мышцы не обрушили сахар во время и после нагрузки.`);
  }

  if (isHypoNow) {
    kineticAlerts.push(`🚨 <strong>Гипогликемия (${bgVal} ммоль/л):</strong> Болюс на еду уменьшен на <strong>${Math.abs(dpsRounded)} ЕД</strong>. Сначала примите быстрые углеводы (кнопка «Гипо» внизу экрана), дождитесь подъема ГК выше 5.0 ммоль/л и только затем колите уменьшенную дозу.`);
  } else if (isSevereHyper) {
    kineticAlerts.push(`🔥 <strong>Высокая гипергликемия (${bgVal} ммоль/л):</strong> При сахаре ≥ 13 ммоль/л возникает инсулинорезистентность (учтен коэф. ×${hyperResistMult}). В 1-й укол включена ДПС <strong>+${dpsRounded} ЕД</strong>${isDpsCapped ? ' (ограничена безопасным разовым пределом — остаток сколите через 3 часа)' : ''}. ${isWorkoutToday ? '⚠️ <strong>При таком сахаре тренировку начинать нельзя!</strong> Сначала снизьте ГК ниже 10 ммоль/л.' : `Сделайте паузу ${Math.max(25, waitMin)} мин перед едой!`}`);
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
    iobSubtracted, hyperResistMult, preHeaderTitle, dynamicWaitText, postTimingText,
    kineticAlerts, isHighBg, isHypoNow, isWorkoutToday, workoutIcrMult
  };
}

// === МОДУЛЬ 3-ДНЕВНОГО ДНЕВНИКА, РЕДАКТИРОВАНИЯ И НАУЧНОЙ КАЛИБРОВКИ ===
function parseHourFromTimeStr(tStr) {
  if (!tStr || typeof tStr !== 'string') return 12;
  const parts = tStr.trim().split(':');
  const h = parseInt(parts[0], 10);
  return (!isNaN(h) && h >= 0 && h <= 23) ? h : 12;
}

function logDiaryEvent(type, title, bgVal, insVal, noteText, dayNum, customTime, macrosObj) {
  const p = getProf();
  const timeStr = (customTime && customTime.trim()) ? customTime.trim() : currentHHMM();
  let cleanBg = String(bgVal !== undefined && bgVal !== null ? bgVal : '').replace(',', '.').trim();
  let bg = (cleanBg !== '' && !isNaN(parseFloat(cleanBg))) ? parseFloat(cleanBg) : null;
  if (bg !== null && bg > 35) bg = +(bg / 18).toFixed(1);

  let cleanIns = String(insVal !== undefined && insVal !== null ? insVal : '').replace(',', '.').trim();
  const insulin = (cleanIns !== '' && !isNaN(parseFloat(cleanIns))) ? Math.max(0, +parseFloat(cleanIns).toFixed(1)) : 0;

  const pG = macrosObj && macrosObj.p !== undefined ? +macrosObj.p : 0;
  const fG = macrosObj && macrosObj.f !== undefined ? +macrosObj.f : 0;
  const cG = macrosObj && macrosObj.c !== undefined ? +macrosObj.c : 0;
  const xe = +(cG / 12).toFixed(1);

  p.diary3d.unshift({
    id: Date.now() + Math.floor(Math.random() * 100),
    day: parseInt(dayNum, 10) || activeDiaryDay || 1,
    time: timeStr,
    type: type, // 'meal' | 'hypo' | 'hyper' | 'basal'
    p: pG,
    f: fG,
    c: cG,
    xe: xe,
    bg: bg,
    insulin: insulin,
    title: title,
    notes: noteText || ''
  });
  if (p.diary3d.length > 60) p.diary3d = p.diary3d.slice(0, 60);
  saveStorage();
  renderApp();
}

// Запись в дневник напрямую из формы, предзаполненной данными из КБЖУ-калькулятора
function addPulledMealToDiary() {
  const dayEl = document.getElementById('diary-inp-day');
  const timeEl = document.getElementById('diary-inp-time');
  const typeEl = document.getElementById('diary-inp-type');
  const pEl = document.getElementById('diary-inp-p');
  const fEl = document.getElementById('diary-inp-f');
  const cEl = document.getElementById('diary-inp-c');
  const bgEl = document.getElementById('diary-inp-bg');
  const insEl = document.getElementById('diary-inp-ins');

  const dNum = dayEl ? parseInt(dayEl.value, 10) || activeDiaryDay : activeDiaryDay;
  const tStr = timeEl && timeEl.value ? timeEl.value : currentHHMM();
  const evType = typeEl ? typeEl.value : 'meal';
  const pG = pEl ? Math.max(0, Math.round(parseFloat(String(pEl.value).replace(',', '.')) || 0)) : mealBolus.p;
  const fG = fEl ? Math.max(0, Math.round(parseFloat(String(fEl.value).replace(',', '.')) || 0)) : mealBolus.f;
  const cG = cEl ? Math.max(0, Math.round(parseFloat(String(cEl.value).replace(',', '.')) || 0)) : mealBolus.c;
  const xe = +(cG / 12).toFixed(1);
  const bgVal = bgEl ? bgEl.value : mealBolus.currBg;
  const insVal = insEl ? insEl.value : 0;

  let title = `🍽 Приём пищи: Б:${pG}г Ж:${fG}г У:${cG}г (${xe} ХЕ)`;
  let note = 'Добавлено из формы дневника';
  if (evType === 'hypo') {
    title = `🆘 Гипогликемия${cG > 0 ? ` (купировано: ${cG}г угл / ${xe} ХЕ)` : ''}`;
    note = 'Зафиксирован низкий сахар';
  } else if (evType === 'hyper') {
    title = `📈 Гипергликемия / ДПС`;
    note = 'Зафиксирован высокий сахар';
  } else if (evType === 'basal') {
    title = `🌙 Введение базального (ночного) инсулина`;
    note = 'Фоновый инсулин';
  }

  logDiaryEvent(evType, title, bgVal, insVal, note, dNum, tStr, { p: pG, f: fG, c: cG });
}

function startEditDiaryItem(id) {
  editingDiaryId = editingDiaryId === id ? null : id;
  renderApp();
}

function saveEditedDiaryItem(id) {
  const p = getProf();
  const item = (p.diary3d || []).find(x => x.id === id);
  if (!item) return;

  const dayEl = document.getElementById(`edit-day-${id}`);
  const timeEl = document.getElementById(`edit-time-${id}`);
  const typeEl = document.getElementById(`edit-type-${id}`);
  const bgEl = document.getElementById(`edit-bg-${id}`);
  const insEl = document.getElementById(`edit-ins-${id}`);
  const pEl = document.getElementById(`edit-p-${id}`);
  const fEl = document.getElementById(`edit-f-${id}`);
  const cEl = document.getElementById(`edit-c-${id}`);

  if (dayEl) item.day = parseInt(dayEl.value, 10) || 1;
  if (timeEl && timeEl.value) item.time = timeEl.value;
  if (typeEl) item.type = typeEl.value;

  if (bgEl) {
    const cleanBg = String(bgEl.value).replace(',', '.').trim();
    item.bg = (cleanBg !== '' && !isNaN(parseFloat(cleanBg))) ? parseFloat(cleanBg) : null;
  }
  if (insEl) {
    const cleanIns = String(insEl.value).replace(',', '.').trim();
    item.insulin = (cleanIns !== '' && !isNaN(parseFloat(cleanIns))) ? Math.max(0, +parseFloat(cleanIns).toFixed(1)) : 0;
  }
  if (pEl) item.p = Math.max(0, Math.round(parseFloat(String(pEl.value).replace(',', '.')) || 0));
  if (fEl) item.f = Math.max(0, Math.round(parseFloat(String(fEl.value).replace(',', '.')) || 0));
  if (cEl) {
    item.c = Math.max(0, Math.round(parseFloat(String(cEl.value).replace(',', '.')) || 0));
    item.xe = +(item.c / 12).toFixed(1);
  }

  if (item.type === 'meal') {
    item.title = `🍽 Приём пищи: Б:${item.p||0}г Ж:${item.f||0}г У:${item.c||0}г (${item.xe||0} ХЕ)`;
  } else if (item.type === 'hypo') {
    item.title = `🆘 Гипогликемия${item.c > 0 ? ` (${item.c}г угл)` : ''}`;
  } else if (item.type === 'hyper') {
    item.title = `📈 Гипергликемия / ДПС`;
  } else if (item.type === 'basal') {
    item.title = `🌙 Базальный инсулин`;
  }

  editingDiaryId = null;
  saveStorage();
  renderApp();
}

function deleteDiaryItem(id) {
  const p = getProf();
  p.diary3d = (p.diary3d || []).filter(x => x.id !== id);
  if (editingDiaryId === id) editingDiaryId = null;
  saveStorage();
  renderApp();
}

function clearAllDiary3d() {
  if (!confirm('Очистить все записи 3-дневного дневника?')) return;
  const p = getProf();
  p.diary3d = [];
  diaryCalibrationVisible = false;
  editingDiaryId = null;
  saveStorage();
  renderApp();
}

// НАУЧНЫЙ АНАЛИЗАТОР 3 ДНЕЙ (ADA / ISPAD / ATTD) С УЧЕТОМ ТРЕНИРОВОК НА СЛЕДУЮЩИЕ 3 ДНЯ
function analyze3dDiaryAndRecalibrate() {
  const p = getProf();
  const m = computeMetrics();
  const dayPlan = computeDailyInsulinPlan(m, p);
  const logs = p.diary3d || [];
  const ins = dayPlan.ins;

  let fastingHypo = 0, dayHypo = 0;
  let fastingHyper = 0, dayHyper = 0;
  let totalBolusRecorded = 0;
  let totalCarbsRecorded = 0;
  const daysSet = new Set();

  logs.forEach(item => {
    const hr = parseHourFromTimeStr(item.time);
    const isNightOrFasting = (hr >= 0 && hr <= 8) || hr >= 23;
    daysSet.add(item.day || 1);

    if (item.type !== 'basal' && item.insulin > 0) {
      totalBolusRecorded += item.insulin;
    }
    if (item.c && item.c > 0 && item.type === 'meal') {
      totalCarbsRecorded += item.c;
    }

    const isHypo = item.type === 'hypo' || (item.bg !== null && item.bg < 4.0);
    const isHyper = item.type === 'hyper' || (item.bg !== null && item.bg >= 9.5);

    if (isHypo) {
      if (isNightOrFasting) fastingHypo++;
      else dayHypo++;
    }
    if (isHyper) {
      if (isNightOrFasting) fastingHyper++;
      else dayHyper++;
    }
  });

  const activeDays = Math.max(1, daysSet.size);
  const avgDailyBolus = totalBolusRecorded > 0 ? +(totalBolusRecorded / activeDays).toFixed(1) : dayPlan.totalBolusDay;
  const currentBasal = dayPlan.effectiveBasal;
  const currentIcr = p.icr;

  let basalMult = 1.0;
  let icrMult = 1.0;
  const notes = [];

  notes.push(`📊 <strong>Статистика за ${activeDays} дн. (${logs.length} зап.):</strong> средний болюс ~${avgDailyBolus} ЕД/сут, ночных/утренних гип: ${fastingHypo}, дневных гип: ${dayHypo}, эпизодов гипер: ${fastingHyper + dayHyper}.`);

  // 1. Титрация БАЗЫ по ночным и утренним (тощаковым) паттернам + правилу 20-30% при гипах
  if (fastingHypo >= 1 || (fastingHypo + dayHypo) >= 3) {
    basalMult = fastingHypo >= 2 ? 0.86 : 0.90;
    notes.push(`🚨 <strong>Коррекция базы вниз (-${Math.round((1 - basalMult) * 100)}%):</strong> зафиксированы ночные/утренние или частые гипогликемии. По протоколу безопасности ADA первоочередная мера — снижение базального фона.`);
  } else if (fastingHyper >= 2 && fastingHypo === 0) {
    basalMult = 1.10;
    notes.push(`📈 <strong>Коррекция базы вверх (+10%):</strong> повторяющийся высокий сахар ночью или утром натощак без гипогликемий указывает на нехватку ночного фона.`);
  } else {
    notes.push(`✅ <strong>Базовый фон до учета спорта:</strong> ночной и тощаковый профиль без критических перекосов.`);
  }

  // 2. Титрация УК по дневным (постпрандиальным) гипо/гипер и реальному СДИ (Правило 500/450)
  if (dayHypo >= 2) {
    icrMult = 0.88; // Уменьшаем УК (колем меньше ЕД на 1 ХЕ!)
    notes.push(`⚠️ <strong>Снижение УК на -12%:</strong> зафиксированы дневные гипогликемии после еды — пищевой болюс избыточен.`);
  } else if (dayHyper >= 2 && dayHypo === 0) {
    icrMult = 1.10; // Увеличиваем УК (колем больше ЕД на 1 ХЕ)
    notes.push(`🍽 <strong>Усиление УК на +10%:</strong> частые подъемы сахара днем после еды и подколки ДПС говорят о нехватке пищевого коэффициента.`);
  }

  let recBasalBeforeSport = Math.max(2, Math.round(currentBasal * basalMult * 2) / 2);
  const estTdd = +(avgDailyBolus + recBasalBeforeSport).toFixed(1);
  const rule500TargetIcr = +((12 * Math.max(8, estTdd)) / (ins.id === 'short' ? 450 : 500)).toFixed(2);

  // Мягкое сближение текущего УК (с учетом поправки на гипы/гипер) и расчетного по Правилу 500
  let recIcrBeforeSport = +(((currentIcr * icrMult) * 0.75 + rule500TargetIcr * 0.25)).toFixed(2);
  let recIsfBeforeSport = +(ins.isfRule / Math.max(8, estTdd)).toFixed(1);

  // 3. Коррекция на ПЛАНИРУЕМЫЕ ТРЕНИРОВКИ В СЛЕДУЮЩИЕ 3 ДНЯ
  const tw = p.next3dWorkout || { planned: false, intensity: 'mid', daysCount: 2 };
  let finalBasal = recBasalBeforeSport;
  let finalIcr = recIcrBeforeSport;
  let finalIsf = recIsfBeforeSport;

  if (tw.planned) {
    const freqFactor = tw.daysCount >= 3 ? 1.0 : (tw.daysCount === 2 ? 0.75 : 0.5);
    const baseSportCut = tw.intensity === 'high' ? 0.14 : (tw.intensity === 'mid' ? 0.09 : 0.05);
    const icrSportCut = tw.intensity === 'high' ? 0.15 : (tw.intensity === 'mid' ? 0.10 : 0.06);

    const effBaseMult = 1 - +(baseSportCut * freqFactor).toFixed(3);
    const effIcrMult = 1 - +(icrSportCut * freqFactor).toFixed(3);

    finalBasal = Math.max(2, +(recBasalBeforeSport * effBaseMult).toFixed(1));
    finalIcr = Math.max(0.2, +(recIcrBeforeSport * effIcrMult).toFixed(2));
    const sportTdd = +(avgDailyBolus * effIcrMult + finalBasal).toFixed(1);
    finalIsf = +(ins.isfRule / Math.max(8, sportTdd)).toFixed(1);

    const wName = tw.intensity === 'high' ? '🔥 Высокая' : (tw.intensity === 'mid' ? '🏋️ Средняя' : '🧘 Лёгкая');
    notes.push(`🏃 <strong>Поправка на спорт в следующие 3 дня (${wName}, ${tw.daysCount} дн. из 3):</strong> из-за пополнения гликогена мышцами база дополнительно снижена до <strong>${finalBasal} ЕД</strong> (-${Math.round((1 - effBaseMult) * 100)}%), УК снижен до <strong>${finalIcr} ЕД/ХЕ</strong>, а чувствительность ФЧИ выросла до <strong>${finalIsf} ммоль/ЕД</strong>.`);
  } else {
    notes.push(`🛋 <strong>План на следующие 3 дня — без тренировок:</strong> коэффициенты рассчитаны для стандартного бытового режима.`);
  }

  return {
    recBasal: finalBasal,
    recIcr: finalIcr,
    recIsf: finalIsf,
    recMorningIcr: +(finalIcr * 1.15).toFixed(2),
    recLunchIcr: finalIcr,
    recEveningIcr: +(finalIcr * 0.90).toFixed(2),
    recBasalBeforeSport,
    recIcrBeforeSport,
    hypoCount: fastingHypo + dayHypo,
    hyperCount: fastingHyper + dayHyper,
    activeDays,
    avgDailyBolus,
    notes
  };
}

function applyDiaryCalibration(newBasal, newIcr, newIsf) {
  const p = getProf();
  p.basalDose = parseFloat(newBasal) || p.basalDose;
  p.icr = parseFloat(newIcr) || p.icr;
  if (newIsf && parseFloat(newIsf) > 0) p.customIsf = parseFloat(newIsf);
  saveStorage();
  renderApp();
  alert(`✅ Новые параметры успешно применены в профиль:\n• База: ${p.basalDose} ЕД\n• Базовый УК: ${p.icr} ЕД/ХЕ\n• ФЧИ: ${p.customIsf} ммоль/ЕД`);
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
