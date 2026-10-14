const DEFAULT_FOODS = [
  { id: 'f1', name: 'Куриная грудка (филе)', kw: ['грудк','куриц','курин','филе'], cat: 'Мясо / Птица', p: 23.6, f: 1.9, c: 0.4, kcal: 113, cookRatio: 0.75 },
  { id: 'f2', name: 'Индейка (филе грудки)', kw: ['индейк','индейки','котлет'], cat: 'Мясо / Птица', p: 24.0, f: 1.5, c: 0.0, kcal: 110, cookRatio: 0.75 },
  { id: 'f3', name: 'Постная говядина (вырезка)', kw: ['говядин','телятин','стейк'], cat: 'Мясо / Птица', p: 20.0, f: 7.0, c: 0.0, kcal: 143, cookRatio: 0.72 },
  { id: 'f4', name: 'Треска / Минтай (белая рыба)', kw: ['треск','минтай','рыб','хек','судак'], cat: 'Рыба', p: 17.5, f: 0.7, c: 0.0, kcal: 76, cookRatio: 0.80 },
  { id: 'f5', name: 'Лосось / Семга', kw: ['лосос','семг','форел','красная рыба'], cat: 'Рыба', p: 20.0, f: 13.0, c: 0.0, kcal: 197, cookRatio: 0.82 },
  { id: 'f6', name: 'Тунец в собственном соку', kw: ['тунец','тунца'], cat: 'Рыба', p: 23.0, f: 1.0, c: 0.0, kcal: 101 },
  { id: 'f7', name: 'Яйцо куриное (1 шт ~ 55 г)', kw: ['яйц','яйца','омлет','яичниц'], unitWeight: 55, cat: 'Яйца / Молочка', p: 12.7, f: 11.5, c: 0.7, kcal: 157 },
  { id: 'f8', name: 'Жидкий яичный белок пастериз.', kw: ['белок','белка','белков'], unitWeight: 33, cat: 'Диет / 0 ккал', p: 11.0, f: 0.0, c: 0.7, kcal: 47 },
  { id: 'f9', name: 'Творог 2% мягкий / брикет', kw: ['творог','творога','сырник'], cat: 'Яйца / Молочка', p: 18.0, f: 2.0, c: 3.3, kcal: 103 },
  { id: 'f10', name: 'Творог 5%', kw: ['творог 5'], cat: 'Яйца / Молочка', p: 17.2, f: 5.0, c: 1.8, kcal: 121 },
  { id: 'f11', name: 'Греческий йогурт Teos 2%', kw: ['йогурт','теос','teos','греческий'], cat: 'Яйца / Молочка', p: 8.0, f: 2.0, c: 4.2, kcal: 67 },
  { id: 'f12', name: 'Сыр легкий 15%', kw: ['сыр','сыра','ламбер','natura'], cat: 'Яйца / Молочка', p: 30.0, f: 15.0, c: 0.0, kcal: 255 },
  { id: 'f13', name: 'Гречка (крупа)', kw: ['гречк','гречн','гречи'], cat: 'Крупы', p: 12.6, f: 3.3, c: 62.1, kcal: 329, cookRatio: 2.8 },
  { id: 'f14', name: 'Овсяные хлопья (Геркулес)', kw: ['овсян','геркулес','каша'], cat: 'Крупы', p: 12.5, f: 6.2, c: 61.0, kcal: 350, cookRatio: 3.0 },
  { id: 'f15', name: 'Рис басмати / жасмин', kw: ['рис','басмати','жасмин'], cat: 'Крупы', p: 7.5, f: 0.6, c: 77.0, kcal: 344, cookRatio: 2.7 },
  { id: 'f16', name: 'Картофель печеный/отварной', kw: ['картоф','картошк','пюре'], cat: 'Крупы', p: 2.0, f: 0.4, c: 16.3, kcal: 77 },
  { id: 'f17', name: 'Рис Ширатаки / Конжак', kw: ['ширатак','конжак','фунчоза 0'], cat: 'Диет / 0 ккал', p: 0.1, f: 0.1, c: 0.6, kcal: 9 },
  { id: 'f18', name: 'Псиллиум (клетчатка)', kw: ['псиллиум','клетчатк','отруб'], cat: 'Диет / 0 ккал', p: 1.5, f: 0.5, c: 7.0, kcal: 38 },
  { id: 'f19', name: 'Соус / Джем 0 ккал (Mr. Djemius)', kw: ['соус','джем','сироп','0 ккал'], cat: 'Диет / 0 ккал', p: 0.4, f: 0.1, c: 4.5, kcal: 20 },
  { id: 'f20', name: 'Протеин сывороточный (Изолят)', kw: ['протеин','изолят','коктейль'], unitWeight: 30, cat: 'Диет / 0 ккал', p: 84.0, f: 1.5, c: 3.0, kcal: 362 },
  { id: 'f21', name: 'Огурцы / Томаты / Зелень', kw: ['огурц','огурец','помидор','томат','салат','зелен','овощ'], cat: 'Овощи / Фрукты', p: 0.9, f: 0.2, c: 3.2, kcal: 18 },
  { id: 'f22', name: 'Брокколи / Цветная капуста', kw: ['броккол','капуст','стручков','кабач'], cat: 'Овощи / Фрукты', p: 2.8, f: 0.4, c: 6.6, kcal: 34 },
  { id: 'f23', name: 'Яблоко / Ягоды', kw: ['яблок','ягод','клубник','голубик','черник','малин','груш'], unitWeight: 130, cat: 'Овощи / Фрукты', p: 0.5, f: 0.3, c: 10.5, kcal: 47 },
  { id: 'f24', name: 'Банан очищенный', kw: ['банан'], unitWeight: 110, cat: 'Овощи / Фрукты', p: 1.5, f: 0.2, c: 21.8, kcal: 95 },
  { id: 'f25', name: 'Масло оливковое / Гхи', kw: ['масл','оливков','гхи','сливочн'], cat: 'Жиры / Орехи', p: 0.0, f: 99.8, c: 0.0, kcal: 898 },
  { id: 'f26', name: 'Миндаль / Грецкий орех', kw: ['орех','миндал','грецк','кешью','арахис'], cat: 'Жиры / Орехи', p: 18.6, f: 54.0, c: 13.0, kcal: 609 },
  { id: 'f27', name: 'Авокадо Хасс', kw: ['авокад'], cat: 'Жиры / Орехи', p: 2.0, f: 15.0, c: 6.0, kcal: 160 }
];

const DIET_TYPES = [
  { id: 'balanced', name: 'Сбалансированное', desc: 'Универсальный баланс на каждый день', p: 30, f: 25, c: 45, pGkg: 1.8, fGkg: 0.9 },
  { id: 'highprot', name: 'Высокобелковое (Сушка)', desc: 'Максимальная защита мышц при дефиците', p: 38, f: 25, c: 37, pGkg: 2.1, fGkg: 0.85 },
  { id: 'lowcarb', name: 'Низкоуглеводное (Low-Carb)', desc: 'Контроль аппетита и инсулина', p: 35, f: 40, c: 25, pGkg: 2.0, fGkg: 1.1 },
  { id: 'keto', name: 'Кето / LCHF', desc: 'Жировой обмен и минимум углеводов', p: 25, f: 68, c: 7, pGkg: 1.7, fGkg: 1.5 },
  { id: 'sport', name: 'Энергия и Сила', desc: 'Акцент на гликоген и выносливость', p: 28, f: 22, c: 50, pGkg: 1.9, fGkg: 0.8 }
];

const DEFAULT_PROFILES = {
  p1: {
    gender: 'male', age: 35, height: 169, weight: 85,
    useBodyFat: false, bodyFat: 20,
    neatLevel: 0.12, steps: 8000,
    workoutDays: 3, workoutMins: 60, workoutMode: 'avg',
    goalMode: 'custom', targetWeight: 73, targetWeeks: 16, presetDelta: -0.20,
    dietType: 'highprot', macroMode: 'gkg', macroBase: 'target', protGkg: 2.0, fatGkg: 0.9,
    pPct: 35, fPct: 25, cPct: 40,
    diary: {
      breakfast: [{ foodId: 'f7', grams: 110, isCooked: false }, { foodId: 'f8', grams: 150, isCooked: false }, { foodId: 'f14', grams: 50, isCooked: false }],
      lunch: [{ foodId: 'f1', grams: 220, isCooked: false }, { foodId: 'f13', grams: 65, isCooked: false }, { foodId: 'f21', grams: 180, isCooked: false }],
      dinner: [{ foodId: 'f2', grams: 200, isCooked: false }, { foodId: 'f17', grams: 200, isCooked: false }, { foodId: 'f18', grams: 10, isCooked: false }, { foodId: 'f19', grams: 35, isCooked: false }],
      snack: [{ foodId: 'f9', grams: 170, isCooked: false }, { foodId: 'f23', grams: 120, isCooked: false }]
    }
  },
  p2: {
    gender: 'female', age: 30, height: 164, weight: 58,
    useBodyFat: false, bodyFat: 23,
    neatLevel: 0.12, steps: 8000,
    workoutDays: 3, workoutMins: 50, workoutMode: 'avg',
    goalMode: 'custom', targetWeight: 52, targetWeeks: 12, presetDelta: -0.15,
    dietType: 'balanced', macroMode: 'gkg', macroBase: 'target', protGkg: 1.8, fatGkg: 0.95,
    pPct: 30, fPct: 30, cPct: 40,
    diary: {
      breakfast: [{ foodId: 'f7', grams: 110, isCooked: false }, { foodId: 'f14', grams: 45, isCooked: false }],
      lunch: [{ foodId: 'f1', grams: 160, isCooked: false }, { foodId: 'f13', grams: 50, isCooked: false }, { foodId: 'f21', grams: 150, isCooked: false }],
      dinner: [{ foodId: 'f4', grams: 180, isCooked: false }, { foodId: 'f22', grams: 180, isCooked: false }],
      snack: [{ foodId: 'f11', grams: 140, isCooked: false }, { foodId: 'f23', grams: 100, isCooked: false }]
    }
  }
};

let appData = {
  activeProfile: 'p1',
  profiles: JSON.parse(JSON.stringify(DEFAULT_PROFILES)),
  customFoods: [],
  templates: [
    { name: 'Белковый завтрак', items: [{ foodId: 'f7', grams: 110, isCooked: false }, { foodId: 'f8', grams: 150, isCooked: false }, { foodId: 'f18', grams: 8, isCooked: false }] },
    { name: 'Ужин Ширатаки 0 ккал', items: [{ foodId: 'f1', grams: 220, isCooked: false }, { foodId: 'f17', grams: 200, isCooked: false }, { foodId: 'f19', grams: 30, isCooked: false }] }
  ]
};

let activeTab = 'calc';
let activeMeal = 'breakfast';
let activeCategory = 'Все';
let searchQuery = '';
let lastLocalPresets = [];

function getProf() {
  const p = appData.profiles[appData.activeProfile];
  if (!p.macroBase) p.macroBase = 'target';
  return p;
}
function getAllFoods() { return [...appData.customFoods, ...DEFAULT_FOODS]; }

function saveStorage() {
  try { localStorage.setItem('nutricalc_pro_v9', JSON.stringify(appData)); } catch (e) {}
}

function loadStorage() {
  try {
    const raw = localStorage.getItem('nutricalc_pro_v9') || localStorage.getItem('nutricalc_pro_v8');
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && parsed.profiles) appData = parsed;
    }
  } catch (e) {}
}

function calcBMRForWeight(w, p) {
  if (p.useBodyFat) {
    const lbm = w * (1 - p.bodyFat / 100);
    return Math.round(370 + 21.6 * lbm);
  }
  const base = 10 * w + 6.25 * p.height - 5 * p.age;
  return Math.round(p.gender === 'male' ? base + 5 : base - 161);
}

function calcTDEEForWeight(w, p) {
  const bmr = calcBMRForWeight(w, p);
  const neat = Math.round(bmr * p.neatLevel);
  const strideKm = (p.height * 0.415) / 100000;
  const distKm = p.steps * strideKm;
  const stepsKcal = Math.round(distKm * w * 0.62);
  const singleWorkoutKcal = (p.workoutMins / 60) * w * 4.25;
  const workoutKcal = p.workoutMode === 'today'
    ? Math.round(singleWorkoutKcal)
    : Math.round((singleWorkoutKcal * p.workoutDays) / 7);
  return { bmr, neat, distKm, stepsKcal, workoutKcal, tdee: bmr + neat + stepsKcal + workoutKcal };
}

function computeMetrics() {
  const p = getProf();
  const curr = calcTDEEForWeight(p.weight, p);
  const heightM = p.height / 100;
  const bmi = +(p.weight / (heightM * heightM)).toFixed(1);
  const targetBmi = +(p.targetWeight / (heightM * heightM)).toFixed(1);

  let targetKcal = curr.tdee;
  let dailyDelta = 0;
  let weeklyKg = 0;

  if (p.goalMode === 'custom') {
    const diffKg = p.targetWeight - p.weight;
    const totalDays = Math.max(7, p.targetWeeks * 7);
    dailyDelta = Math.round((diffKg * 7700) / totalDays);
    weeklyKg = +(diffKg / p.targetWeeks).toFixed(2);
    targetKcal = curr.tdee + dailyDelta;
  } else {
    dailyDelta = Math.round(curr.tdee * p.presetDelta);
    targetKcal = curr.tdee + dailyDelta;
    weeklyKg = +((dailyDelta * 7) / 7700).toFixed(2);
  }

  const minSafe = p.gender === 'female' ? Math.max(1100, Math.round(curr.bmr * 0.88)) : Math.max(1350, Math.round(curr.bmr * 0.90));
  const effectiveKcal = Math.max(minSafe, targetKcal);

  // Reference weight for g/kg macro calculation
  const estBf = p.useBodyFat ? p.bodyFat : (p.gender === 'female' ? 24 : 18);
  const lbmWeight = +(p.weight * (1 - estBf / 100)).toFixed(1);
  let refWeight = p.targetWeight;
  let refLabel = 'желаемого веса';
  if (p.macroBase === 'current') {
    refWeight = p.weight;
    refLabel = 'текущего веса';
  } else if (p.macroBase === 'lbm') {
    refWeight = lbmWeight;
    refLabel = 'сухой массы (LBM)';
  }

  let normP = 0, normF = 0, normC = 0;
  if (p.macroMode === 'gkg') {
    normP = Math.round(refWeight * p.protGkg);
    normF = Math.round(refWeight * p.fatGkg);
    const remKcal = Math.max(80, effectiveKcal - (normP * 4 + normF * 9));
    normC = Math.round(remKcal / 4);
  } else {
    normP = Math.round((effectiveKcal * (p.pPct / 100)) / 4);
    normF = Math.round((effectiveKcal * (p.fPct / 100)) / 9);
    normC = Math.round((effectiveKcal * (p.cPct / 100)) / 4);
  }

  return { ...curr, bmi, targetBmi, targetKcal, effectiveKcal, minSafe, dailyDelta, weeklyKg, refWeight, refLabel, lbmWeight, normP, normF, normC };
}

function formatDateOffset(daysFromNow) {
  const d = new Date();
  d.setDate(d.getDate() + Math.round(daysFromNow));
  return d.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' });
}
function selectDietType(typeId) {
  const p = getProf();
  const dt = DIET_TYPES.find(x => x.id === typeId);
  if (!dt) return;
  p.dietType = dt.id;
  p.pPct = dt.p; p.fPct = dt.f; p.cPct = dt.c;
  p.protGkg = dt.pGkg; p.fatGkg = dt.fGkg;
  saveStorage();
  renderApp();
}

function setParam(key, val) {
  const p = getProf();
  if (['age','height','steps','workoutDays','workoutMins','targetWeeks'].includes(key)) {
    p[key] = parseInt(val, 10) || 0;
  } else if (['weight','bodyFat','neatLevel','targetWeight','presetDelta','protGkg','fatGkg'].includes(key)) {
    p[key] = parseFloat(val) || 0;
  } else {
    p[key] = val;
  }
  saveStorage();
  renderApp();
}

function switchProfile(pk) {
  appData.activeProfile = pk;
  saveStorage();
  renderApp();
}

function applySmartMacros(protG, fatG) {
  const p = getProf();
  p.macroMode = 'gkg';
  p.protGkg = protG;
  p.fatGkg = fatG;
  saveStorage();
  renderApp();
}

function getItemEffectiveGrams(item, food) {
  if (!item.isCooked || !food.cookRatio) return item.grams;
  return Math.round(item.grams / food.cookRatio);
}

function addFoodToMeal(foodId, grams = 100) {
  const p = getProf();
  const list = p.diary[activeMeal];
  const ex = list.find(i => i.foodId === foodId && !i.isCooked);
  if (ex) ex.grams += grams;
  else list.push({ foodId, grams, isCooked: false });
  saveStorage();
  renderApp();
}

function renderApp() {
  const p = getProf();
  document.documentElement.setAttribute('data-gender', p.gender);
  const metaTheme = document.getElementById('meta-theme-color');
  if (metaTheme) metaTheme.setAttribute('content', p.gender === 'female' ? '#0ABAB5' : '#3b0764');

  const m = computeMetrics();
  const foods = getAllFoods();
  const mealNames = { breakfast: '🌅 Завтрак', lunch: '☀️ Обед', dinner: '🌙 Ужин', snack: '🍏 Перекус' };

  let totKcal = 0, totP = 0, totF = 0, totC = 0, totGrams = 0, totalItems = 0;
  const mealSummaries = {};
  ['breakfast','lunch','dinner','snack'].forEach(mk => {
    let mkcal = 0, mp = 0, mf = 0, mc = 0, mg = 0;
    (p.diary[mk] || []).forEach(it => {
      const f = foods.find(x => x.id === it.foodId);
      if (!f) return;
      totalItems++;
      const rg = getItemEffectiveGrams(it, f);
      const mult = rg / 100;
      mkcal += f.kcal * mult; mp += f.p * mult; mf += f.f * mult; mc += f.c * mult; mg += it.grams;
    });
    mkcal = Math.round(mkcal);
    totKcal += mkcal; totP += mp; totF += mf; totC += mc; totGrams += mg;
    mealSummaries[mk] = { kcal: mkcal, p: Math.round(mp), f: Math.round(mf), c: Math.round(mc), g: mg };
  });
  totP = Math.round(totP); totF = Math.round(totF); totC = Math.round(totC);

  const diffKg = +(p.targetWeight - p.weight).toFixed(1);
  const totalDays = p.targetWeeks * 7;
  const checkpoints = [0, 0.25, 0.5, 0.75, 1].map((pct, i) => {
    const w = +(p.weight + diffKg * pct).toFixed(1);
    const tdeeAtW = calcTDEEForWeight(w, p).tdee;
    const label = i === 0 ? 'Старт' : i === 2 ? 'Экватор' : i === 4 ? 'Финиш' : `${pct*100}%`;
    return { label, w, date: formatDateOffset(totalDays * pct), tdee: tdeeAtW };
  });

  const extra3kKcal = Math.round(((p.height * 0.415) / 100000) * 3000 * p.weight * 0.62);
  const recProt = p.gender === 'female' ? 1.8 : 2.1;
  const recFat = p.gender === 'female' ? 0.95 : 0.9;
  const isTooStrict = m.targetKcal < m.minSafe;
  const safeWeeks = Math.max(4, Math.ceil(Math.abs(diffKg * 7700) / (Math.max(300, m.tdee - m.minSafe) * 7)));

  const quickWeights = p.gender === 'female' ? [42, 45, 48, 50, 52, 55, 58, 62] : [68, 70, 72, 74, 76, 80, 85];
  const cats = ['Все', ...new Set(foods.map(f => f.cat))];
  const filteredFoods = foods.filter(f => (activeCategory === 'Все' || f.cat === activeCategory) && f.name.toLowerCase().includes(searchQuery.toLowerCase()));
  const hasSavedKey = !!(localStorage.getItem('nutricalc_gemini_key') || '').trim();

  document.getElementById('app').innerHTML = `
    <!-- STICKY HEADER -->
    <header class="sticky top-0 z-30 glass-card border-b px-3 py-2.5">
      <div class="max-w-7xl mx-auto flex items-center justify-between gap-2">
        <div class="flex items-center gap-2">
          <div class="w-9 h-9 rounded-xl theme-grad flex items-center justify-center text-white font-extrabold shadow">🌿</div>
          <div>
            <div class="font-extrabold text-sm sm:text-base leading-tight">NutriCalc Pro</div>
            <div class="text-[10px] opacity-75">${p.gender === 'female' ? '💎 Стиль Тиффани (Ж)' : '🔮 Королевский Фиолет (М)'}</div>
          </div>
        </div>

        <div class="flex items-center gap-1 p-1 rounded-xl theme-input">
          <button onclick="switchProfile('p1')" class="px-2.5 py-1 rounded-lg text-xs font-bold ${appData.activeProfile === 'p1' ? 'theme-grad text-white shadow' : 'opacity-70'}">♂ Проф 1</button>
          <button onclick="switchProfile('p2')" class="px-2.5 py-1 rounded-lg text-xs font-bold ${appData.activeProfile === 'p2' ? 'theme-grad text-white shadow' : 'opacity-70'}">♀ Проф 2</button>
        </div>

        <div class="flex items-center gap-1.5">
          <button onclick="openAiModal()" class="px-3 py-1.5 rounded-xl theme-grad text-white text-xs font-bold shadow flex items-center gap-1">✨ AI</button>
          <button onclick="openCustomFoodModal()" class="px-2.5 py-1.5 rounded-xl theme-soft text-xs font-bold" title="Свой продукт">➕ Блюдо</button>
        </div>
      </div>
    </header>

    <!-- MOBILE NAVIGATION TABS -->
    <div class="max-w-7xl mx-auto px-3 pt-3 lg:hidden">
      <div class="grid grid-cols-2 gap-2 p-1 rounded-2xl glass-card">
        <button onclick="activeTab='calc'; renderApp();" class="py-2 rounded-xl text-xs font-bold ${activeTab === 'calc' ? 'theme-grad text-white shadow' : 'opacity-75'}">⚙️ Параметры и План</button>
        <button onclick="activeTab='diary'; renderApp();" class="py-2 rounded-xl text-xs font-bold ${activeTab === 'diary' ? 'theme-grad text-white shadow' : 'opacity-75'}">🍽 Дневник и Итог (${totalItems})</button>
      </div>
    </div>

    <!-- MAIN CONTENT -->
    <main class="max-w-7xl mx-auto px-3 pt-4 grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">

      <!-- LEFT COLUMN -->
      <section class="lg:col-span-5 space-y-4 ${activeTab === 'diary' ? 'hidden lg:block' : ''}">

        <!-- 1. ANTHROPOMETRY -->
        <div class="glass-card rounded-3xl p-4 sm:p-5 space-y-4 shadow-lg">
          <div class="flex items-center justify-between">
            <h2 class="font-extrabold text-base">1. Ваши параметры</h2>
            <span class="text-[11px] px-2 py-0.5 rounded-lg theme-soft font-semibold">${p.useBodyFat ? 'Формула Кетч-МакАрдла' : 'Миффлин-Сан Жеор'}</span>
          </div>

          <div class="grid grid-cols-2 gap-2">
            <button onclick="setParam('gender','female')" class="py-2.5 px-3 rounded-2xl text-xs font-bold border transition ${p.gender === 'female' ? 'theme-grad text-white border-transparent shadow-md' : 'theme-input opacity-80'}">♀ Женщина (Тиффани)</button>
            <button onclick="setParam('gender','male')" class="py-2.5 px-3 rounded-2xl text-xs font-bold border transition ${p.gender === 'male' ? 'theme-grad text-white border-transparent shadow-md' : 'theme-input opacity-80'}">♂ Мужчина (Фиолет)</button>
          </div>

          <div class="p-3 rounded-2xl theme-input space-y-1.5">
            <div class="flex justify-between items-center">
              <span class="text-xs font-bold opacity-80">ВОЗРАСТ (ЛЕТ)</span>
              <input type="number" value="${p.age}" min="14" max="90" onchange="setParam('age', this.value)" class="w-16 text-right font-mono-num font-bold text-sm rounded-lg px-2 py-0.5 theme-soft">
            </div>
            <input type="range" min="14" max="80" step="1" value="${p.age}" onchange="setParam('age', this.value)" oninput="this.previousElementSibling.querySelector('input').value=this.value" class="w-full">
          </div>

          <div class="p-3 rounded-2xl theme-input space-y-1.5">
            <div class="flex justify-between items-center">
              <span class="text-xs font-bold opacity-80">РОСТ (СМ)</span>
              <input type="number" value="${p.height}" min="130" max="220" onchange="setParam('height', this.value)" class="w-16 text-right font-mono-num font-bold text-sm rounded-lg px-2 py-0.5 theme-soft">
            </div>
            <input type="range" min="140" max="210" step="1" value="${p.height}" onchange="setParam('height', this.value)" oninput="this.previousElementSibling.querySelector('input').value=this.value" class="w-full">
          </div>

          <div class="p-3 rounded-2xl theme-input space-y-1.5">
            <div class="flex justify-between items-center">
              <span class="text-xs font-bold opacity-80">ТЕКУЩИЙ ВЕС (КГ)</span>
              <input type="number" value="${p.weight}" min="30" max="220" step="0.5" onchange="setParam('weight', this.value)" class="w-20 text-right font-mono-num font-bold text-sm rounded-lg px-2 py-0.5 theme-soft">
            </div>
            <input type="range" min="30" max="150" step="0.5" value="${p.weight}" onchange="setParam('weight', this.value)" oninput="this.previousElementSibling.querySelector('input').value=this.value" class="w-full">
            <div class="flex justify-between text-[10px] opacity-60"><span>30 кг</span><span>65 кг</span><span>100 кг</span><span>150 кг</span></div>
          </div>

          <div class="p-3 rounded-2xl theme-input space-y-2">
            <label class="flex items-center justify-between cursor-pointer">
              <span class="text-xs font-bold flex items-center gap-2">
                <input type="checkbox" ${p.useBodyFat ? 'checked' : ''} onchange="setParam('useBodyFat', this.checked)" class="w-4 h-4">
                Учитывать % жира (атлетический режим)
              </span>
              ${p.useBodyFat ? `<span class="text-xs font-mono-num font-bold">Сухая: ${(p.weight*(1-p.bodyFat/100)).toFixed(1)} кг</span>` : ''}
            </label>
            ${p.useBodyFat ? `
              <div>
                <div class="flex justify-between text-xs mb-1"><span>Процент жира (%)</span><span class="font-mono-num font-bold">${p.bodyFat}%</span></div>
                <input type="range" min="6" max="45" step="0.5" value="${p.bodyFat}" onchange="setParam('bodyFat', this.value)" class="w-full">
              </div>
            ` : ''}
          </div>

          <div class="grid grid-cols-2 gap-2.5">
            <div class="p-3 rounded-2xl theme-soft">
              <div class="text-[11px] opacity-80">ИМТ (${m.bmi < 18.5 ? 'Дефицит' : m.bmi < 25 ? 'Норма' : 'Выше нормы'})</div>
              <div class="text-xl font-extrabold font-mono-num">${m.bmi}</div>
            </div>
            <div class="p-3 rounded-2xl theme-soft">
              <div class="text-[11px] opacity-80">Базовый обмен (BMR) 🔥</div>
              <div class="text-xl font-extrabold font-mono-num">${m.bmr} <span class="text-xs font-normal">ккал</span></div>
            </div>
          </div>
        </div>

        <!-- 2. ACTIVITY: STEPS + WORKOUTS -->
        <div class="glass-card rounded-3xl p-4 sm:p-5 space-y-4 shadow-lg">
          <div class="flex items-center justify-between">
            <h2 class="font-extrabold text-base">2. Активность: Шаги + Тренировки</h2>
            <span class="text-xs font-mono-num font-extrabold px-2 py-0.5 rounded-lg theme-soft">TDEE: ${m.tdee} ккал</span>
          </div>

          <div class="grid grid-cols-3 gap-1.5">
            <button onclick="setParam('neatLevel', 0.12)" class="p-2 rounded-xl text-left text-xs ${p.neatLevel === 0.12 ? 'theme-grad text-white font-bold shadow' : 'theme-input'}"><div>Сидячий</div><div class="text-[10px] opacity-75">+12% к BMR</div></button>
            <button onclick="setParam('neatLevel', 0.18)" class="p-2 rounded-xl text-left text-xs ${p.neatLevel === 0.18 ? 'theme-grad text-white font-bold shadow' : 'theme-input'}"><div>Умеренный</div><div class="text-[10px] opacity-75">+18% к BMR</div></button>
            <button onclick="setParam('neatLevel', 0.25)" class="p-2 rounded-xl text-left text-xs ${p.neatLevel === 0.25 ? 'theme-grad text-white font-bold shadow' : 'theme-input'}"><div>Активный</div><div class="text-[10px] opacity-75">+25% к BMR</div></button>
          </div>

          <div class="p-3.5 rounded-2xl theme-input space-y-2">
            <div class="flex justify-between items-center">
              <div>
                <div class="text-xs font-bold">👣 Шагов в день</div>
                <div class="text-[11px] opacity-75">~${m.distKm.toFixed(1)} км · +${m.stepsKcal} ккал</div>
              </div>
              <input type="number" value="${p.steps}" step="500" onchange="setParam('steps', this.value)" class="w-20 text-right font-mono-num font-bold text-sm rounded-lg px-2 py-0.5 theme-soft">
            </div>
            <input type="range" min="0" max="25000" step="500" value="${Math.min(25000, p.steps)}" onchange="setParam('steps', this.value)" class="w-full">
            <div class="flex flex-wrap gap-1">
              ${[4000, 6000, 8000, 10000, 12000, 15000].map(st => `
                <button onclick="setParam('steps', ${st})" class="px-2 py-0.5 rounded-lg text-[10px] font-bold ${p.steps === st ? 'theme-grad text-white' : 'theme-soft'}">${st}</button>
              `).join('')}
            </div>
          </div>

          <div class="p-3.5 rounded-2xl theme-input space-y-2.5">
            <div class="flex justify-between items-center">
              <span class="text-xs font-bold">🏋️ Тренировки (средн. интенсивность)</span>
              <span class="text-xs font-mono-num font-bold">+${m.workoutKcal} ккал/день</span>
            </div>
            <div class="grid grid-cols-2 gap-2 text-xs">
              <div>
                <div class="flex justify-between mb-1"><span class="opacity-75">Дней в нед:</span><strong class="font-mono-num">${p.workoutDays}</strong></div>
                <input type="range" min="0" max="7" step="1" value="${p.workoutDays}" onchange="setParam('workoutDays', this.value)" class="w-full">
              </div>
              <div>
                <div class="flex justify-between mb-1"><span class="opacity-75">Минут:</span><strong class="font-mono-num">${p.workoutMins}</strong></div>
                <input type="range" min="0" max="150" step="10" value="${p.workoutMins}" onchange="setParam('workoutMins', this.value)" class="w-full">
              </div>
            </div>
            <div class="grid grid-cols-2 gap-1.5 pt-1">
              <button onclick="setParam('workoutMode','avg')" class="py-1.5 rounded-xl text-[11px] font-bold ${p.workoutMode === 'avg' ? 'theme-grad text-white shadow' : 'theme-soft'}">Среднесуточно (/7)</button>
              <button onclick="setParam('workoutMode','today')" class="py-1.5 rounded-xl text-[11px] font-bold ${p.workoutMode === 'today' ? 'theme-grad text-white shadow' : 'theme-soft'}">Тренировка сегодня</button>
            </div>
          </div>

          <div class="p-3 rounded-2xl theme-soft text-xs space-y-1">
            <div class="flex justify-between font-bold"><span>Суточный расход (TDEE):</span><span class="font-mono-num">${m.tdee} ккал</span></div>
            <div class="text-[11px] font-mono-num opacity-80">BMR ${m.bmr} + Быт ${m.neat} + Шаги ${m.stepsKcal} + Трен ${m.workoutKcal}</div>
          </div>
        </div>

        <!-- 3. GOAL, RECOMMENDATIONS, CHECKPOINTS & DIET PROFILES -->
        <div class="glass-card rounded-3xl p-4 sm:p-5 space-y-4 shadow-lg">
          <div class="flex items-center justify-between">
            <h2 class="font-extrabold text-base">3. Цель, Рекомендации и БЖУ</h2>
            <div class="flex gap-1 p-0.5 rounded-xl theme-input text-[11px] font-bold">
              <button onclick="setParam('goalMode','custom')" class="px-2 py-1 rounded-lg ${p.goalMode === 'custom' ? 'theme-grad text-white' : 'opacity-70'}">По весу и сроку</button>
              <button onclick="setParam('goalMode','preset')" class="px-2 py-1 rounded-lg ${p.goalMode === 'preset' ? 'theme-grad text-white' : 'opacity-70'}">По %</button>
            </div>
          </div>

          ${p.goalMode === 'custom' ? `
            <div class="p-3.5 rounded-2xl theme-input space-y-2">
              <div class="flex justify-between items-center">
                <span class="text-xs font-bold">🎯 Желаемый вес (кг)</span>
                <input type="number" value="${p.targetWeight}" min="30" max="160" step="0.5" onchange="setParam('targetWeight', this.value)" class="w-20 text-right font-mono-num font-bold text-sm rounded-lg px-2 py-0.5 theme-soft">
              </div>
              <input type="range" min="30" max="150" step="0.5" value="${p.targetWeight}" onchange="setParam('targetWeight', this.value)" class="w-full">
              <div class="flex justify-between text-[10px] opacity-60"><span>30 кг</span><span>60 кг</span><span>90 кг</span><span>120+ кг</span></div>
              <div class="flex flex-wrap gap-1 pt-1">
                ${quickWeights.map(w => `
                  <button onclick="setParam('targetWeight', ${w})" class="px-2 py-0.5 rounded-lg text-[10px] font-bold ${p.targetWeight === w ? 'theme-grad text-white' : 'theme-soft'}">${w} кг</button>
                `).join('')}
              </div>
            </div>

            <div class="p-3.5 rounded-2xl theme-input space-y-2">
              <div class="flex justify-between items-center">
                <span class="text-xs font-bold">📅 Желаемый период (недель)</span>
                <span class="font-mono-num font-bold text-sm">${p.targetWeeks} нед. (${totalDays} дн.)</span>
              </div>
              <input type="range" min="2" max="52" step="1" value="${Math.min(52, p.targetWeeks)}" onchange="setParam('targetWeeks', this.value)" class="w-full">
            </div>

            <div class="p-3.5 rounded-2xl theme-soft space-y-3 text-xs">
              <div class="flex justify-between items-center font-bold">
                <span>Изменение: ${diffKg > 0 ? '+' : ''}${diffKg} кг (${m.weeklyKg > 0 ? '+' : ''}${m.weeklyKg} кг/нед)</span>
                <span class="font-mono-num">${m.dailyDelta > 0 ? '+' : ''}${m.dailyDelta} ккал/дн</span>
              </div>

              ${isTooStrict ? `
                <div class="p-2.5 rounded-xl bg-amber-500/20 border border-amber-400 text-[11px] space-y-1">
                  <div class="font-bold">⚠️ Внимание: слишком жесткий дефицит (${m.targetKcal} ккал)!</div>
                  <div>Норма ограничена безопасным минимумом <strong>${m.minSafe} ккал</strong>.</div>
                  <button onclick="setParam('targetWeeks', ${safeWeeks})" class="px-2.5 py-1 rounded-lg theme-grad text-white font-bold mt-1 inline-block">Установить безопасный срок (${safeWeeks} нед.)</button>
                </div>
              ` : `
                <div class="text-[11px] opacity-90">
                  ✅ <strong>Оптимальный темп.</strong> ИМТ изменится с <strong>${m.bmi}</strong> до <strong>${m.targetBmi}</strong>.
                </div>
              `}

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-1.5 pt-1">
                <button onclick="setParam('steps', ${p.steps + 3000})" class="p-2 rounded-xl theme-input text-left hover:opacity-90">
                  <div class="font-bold text-[11px]">👟 Комбо: +3 000 шагов</div>
                  <div class="text-[10px] opacity-75">Позволит есть на +${extra3kKcal} ккал сытнее</div>
                </button>
                <button onclick="applySmartMacros(${recProt},${recFat})" class="p-2 rounded-xl theme-input text-left hover:opacity-90">
                  <div class="font-bold text-[11px]">🥩 Рекомендуемые БЖУ</div>
                  <div class="text-[10px] opacity-75">Белок ${recProt} г/кг · Жиры ${recFat} г/кг</div>
                </button>
              </div>

              <div class="pt-2 border-t border-white/15 space-y-1.5">
                <div class="font
