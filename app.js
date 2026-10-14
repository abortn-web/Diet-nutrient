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
function saveStorage() { try { localStorage.setItem('nutricalc_pro_v10', JSON.stringify(appData)); } catch (e) {} }
function loadStorage() {
  try {
    const raw = localStorage.getItem('nutricalc_pro_v10') || localStorage.getItem('nutricalc_pro_v9');
    if (raw) { const parsed = JSON.parse(raw); if (parsed && parsed.profiles) appData = parsed; }
  } catch (e) {}
}

function calcBMRForWeight(w, p) {
  if (p.useBodyFat) return Math.round(370 + 21.6 * (w * (1 - p.bodyFat / 100)));
  const base = 10 * w + 6.25 * p.height - 5 * p.age;
  return Math.round(p.gender === 'male' ? base + 5 : base - 161);
}

function calcTDEEForWeight(w, p) {
  const bmr = calcBMRForWeight(w, p);
  const neat = Math.round(bmr * p.neatLevel);
  const distKm = p.steps * ((p.height * 0.415) / 100000);
  const stepsKcal = Math.round(distKm * w * 0.62);
  const singleWk = (p.workoutMins / 60) * w * 4.25;
  const workoutKcal = p.workoutMode === 'today' ? Math.round(singleWk) : Math.round((singleWk * p.workoutDays) / 7);
  return { bmr, neat, distKm, stepsKcal, workoutKcal, tdee: bmr + neat + stepsKcal + workoutKcal };
}

function computeMetrics() {
  const p = getProf();
  const curr = calcTDEEForWeight(p.weight, p);
  const hm = p.height / 100;
  const bmi = +(p.weight / (hm * hm)).toFixed(1);
  const targetBmi = +(p.targetWeight / (hm * hm)).toFixed(1);

  let targetKcal = curr.tdee, dailyDelta = 0, weeklyKg = 0;
  if (p.goalMode === 'custom') {
    const diffKg = p.targetWeight - p.weight;
    dailyDelta = Math.round((diffKg * 7700) / Math.max(7, p.targetWeeks * 7));
    weeklyKg = +(diffKg / p.targetWeeks).toFixed(2);
    targetKcal = curr.tdee + dailyDelta;
  } else {
    dailyDelta = Math.round(curr.tdee * p.presetDelta);
    targetKcal = curr.tdee + dailyDelta;
    weeklyKg = +((dailyDelta * 7) / 7700).toFixed(2);
  }

  const minSafe = p.gender === 'female' ? Math.max(1100, Math.round(curr.bmr * 0.88)) : Math.max(1350, Math.round(curr.bmr * 0.90));
  const effectiveKcal = Math.max(minSafe, targetKcal);

  const estBf = p.useBodyFat ? p.bodyFat : (p.gender === 'female' ? 24 : 18);
  const lbmWeight = +(p.weight * (1 - estBf / 100)).toFixed(1);
  let refWeight = p.targetWeight, refLabel = 'желаемого веса';
  if (p.macroBase === 'current') { refWeight = p.weight; refLabel = 'текущего веса'; }
  else if (p.macroBase === 'lbm') { refWeight = lbmWeight; refLabel = 'сухой массы'; }

  let normP = 0, normF = 0, normC = 0;
  if (p.macroMode === 'gkg') {
    normP = Math.round(refWeight * p.protGkg);
    normF = Math.round(refWeight * p.fatGkg);
    normC = Math.round(Math.max(80, effectiveKcal - (normP * 4 + normF * 9)) / 4);
  } else {
    normP = Math.round((effectiveKcal * (p.pPct / 100)) / 4);
    normF = Math.round((effectiveKcal * (p.fPct / 100)) / 9);
    normC = Math.round((effectiveKcal * (p.cPct / 100)) / 4);
  }
  return { ...curr, bmi, targetBmi, targetKcal, effectiveKcal, minSafe, dailyDelta, weeklyKg, refWeight, refLabel, lbmWeight, normP, normF, normC };
}

function formatDateOffset(days) {
  const d = new Date(); d.setDate(d.getDate() + Math.round(days));
  return d.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' });
}

function selectDietType(typeId) {
  const p = getProf(), dt = DIET_TYPES.find(x => x.id === typeId);
  if (!dt) return;
  p.dietType = dt.id; p.pPct = dt.p; p.fPct = dt.f; p.cPct = dt.c; p.protGkg = dt.pGkg; p.fatGkg = dt.fGkg;
  saveStorage(); renderApp();
}

function setParam(key, val) {
  const p = getProf();
  if (['age','height','steps','workoutDays','workoutMins','targetWeeks'].includes(key)) p[key] = parseInt(val, 10) || 0;
  else if (['weight','bodyFat','neatLevel','targetWeight','presetDelta','protGkg','fatGkg'].includes(key)) p[key] = parseFloat(val) || 0;
  else p[key] = val;
  saveStorage(); renderApp();
}

function switchProfile(pk) { appData.activeProfile = pk; saveStorage(); renderApp(); }
function applySmartMacros(protG, fatG) { const p = getProf(); p.macroMode = 'gkg'; p.protGkg = protG; p.fatGkg = fatG; saveStorage(); renderApp(); }
function getItemEffectiveGrams(item, food) { return (!item.isCooked || !food.cookRatio) ? item.grams : Math.round(item.grams / food.cookRatio); }

function addFoodToMeal(foodId, grams = 100) {
  const list = getProf().diary[activeMeal];
  const ex = list.find(i => i.foodId === foodId && !i.isCooked);
  if (ex) ex.grams += grams; else list.push({ foodId, grams, isCooked: false });
  saveStorage(); renderApp();
}

function renderApp() {
  const p = getProf();
  document.documentElement.setAttribute('data-gender', p.gender);
  const m = computeMetrics(), foods = getAllFoods();
  const mealNames = { breakfast: '🌅 Завтрак', lunch: '☀️ Обед', dinner: '🌙 Ужин', snack: '🍏 Перекус' };

  let totKcal = 0, totP = 0, totF = 0, totC = 0, totGrams = 0, totalItems = 0;
  const mealSummaries = {};
  ['breakfast','lunch','dinner','snack'].forEach(mk => {
    let mkcal = 0, mp = 0, mf = 0, mc = 0, mg = 0;
    (p.diary[mk] || []).forEach(it => {
      const f = foods.find(x => x.id === it.foodId);
      if (!f) return;
      totalItems++;
      const mult = getItemEffectiveGrams(it, f) / 100;
      mkcal += f.kcal * mult; mp += f.p * mult; mf += f.f * mult; mc += f.c * mult; mg += it.grams;
    });
    mkcal = Math.round(mkcal);
    totKcal += mkcal; totP += mp; totF += mf; totC += mc; totGrams += mg;
    mealSummaries[mk] = { kcal: mkcal, p: Math.round(mp), f: Math.round(mf), c: Math.round(mc), g: mg };
  });
  totP = Math.round(totP); totF = Math.round(totF); totC = Math.round(totC);

  const diffKg = +(p.targetWeight - p.weight).toFixed(1), totalDays = p.targetWeeks * 7;
  const checkpoints = [0, 0.25, 0.5, 0.75, 1].map((pct, i) => {
    const w = +(p.weight + diffKg * pct).toFixed(1);
    return { label: i===0?'Старт':i===2?'Экватор':i===4?'Финиш':`${pct*100}%`, w, date: formatDateOffset(totalDays * pct), tdee: calcTDEEForWeight(w, p).tdee };
  });

  const extra3kKcal = Math.round(((p.height * 0.415) / 100000) * 3000 * p.weight * 0.62);
  const recProt = p.gender === 'female' ? 1.8 : 2.1, recFat = p.gender === 'female' ? 0.95 : 0.9;
  const isTooStrict = m.targetKcal < m.minSafe;
  const safeWeeks = Math.max(4, Math.ceil(Math.abs(diffKg * 7700) / (Math.max(300, m.tdee - m.minSafe) * 7)));
  const quickWeights = p.gender === 'female' ? [42, 45, 48, 50, 52, 55, 58, 62] : [68, 70, 72, 74, 76, 80, 85];
  const cats = ['Все', ...new Set(foods.map(f => f.cat))];
  const filteredFoods = foods.filter(f => (activeCategory === 'Все' || f.cat === activeCategory) && f.name.toLowerCase().includes(searchQuery.toLowerCase()));
  const hasSavedKey = !!(localStorage.getItem('nutricalc_gemini_key') || '').trim();

  document.getElementById('app').innerHTML = `
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
          <button onclick="openAiModal()" class="px-3 py-1.5 rounded-xl theme-grad text-white text-xs font-bold shadow">✨ AI</button>
          <button onclick="openCustomFoodModal()" class="px-2.5 py-1.5 rounded-xl theme-soft text-xs font-bold">➕ Блюдо</button>
        </div>
      </div>
    </header>

    <div class="max-w-7xl mx-auto px-3 pt-3 lg:hidden">
      <div class="grid grid-cols-2 gap-2 p-1 rounded-2xl glass-card">
        <button onclick="activeTab='calc'; renderApp();" class="py-2 rounded-xl text-xs font-bold ${activeTab === 'calc' ? 'theme-grad text-white shadow' : 'opacity-75'}">⚙️ Параметры и План</button>
        <button onclick="activeTab='diary'; renderApp();" class="py-2 rounded-xl text-xs font-bold ${activeTab === 'diary' ? 'theme-grad text-white shadow' : 'opacity-75'}">🍽 Дневник и Итог (${totalItems})</button>
      </div>
    </div>

    <main class="max-w-7xl mx-auto px-3 pt-4 grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
      <section class="lg:col-span-5 space-y-4 ${activeTab === 'diary' ? 'hidden lg:block' : ''}">
        <div class="glass-card rounded-3xl p-4 sm:p-5 space-y-4 shadow-lg">
          <div class="flex items-center justify-between">
            <h2 class="font-extrabold text-base">1. Ваши параметры</h2>
            <span class="text-[11px] px-2 py-0.5 rounded-lg theme-soft font-semibold">${p.useBodyFat ? 'Кетч-МакАрдл' : 'Миффлин-Сан Жеор'}</span>
          </div>
          <div class="grid grid-cols-2 gap-2">
            <button onclick="setParam('gender','female')" class="py-2.5 px-3 rounded-2xl text-xs font-bold border ${p.gender === 'female' ? 'theme-grad text-white border-transparent shadow-md' : 'theme-input opacity-80'}">♀ Женщина (Тиффани)</button>
            <button onclick="setParam('gender','male')" class="py-2.5 px-3 rounded-2xl text-xs font-bold border ${p.gender === 'male' ? 'theme-grad text-white border-transparent shadow-md' : 'theme-input opacity-80'}">♂ Мужчина (Фиолет)</button>
          </div>
          <div class="p-3 rounded-2xl theme-input space-y-1.5">
            <div class="flex justify-between items-center"><span class="text-xs font-bold opacity-80">ВОЗРАСТ (ЛЕТ)</span><input type="number" value="${p.age}" onchange="setParam('age', this.value)" class="w-16 text-right font-mono-num font-bold text-sm rounded-lg px-2 py-0.5 theme-soft"></div>
            <input type="range" min="14" max="80" value="${p.age}" onchange="setParam('age', this.value)" class="w-full">
          </div>
          <div class="p-3 rounded-2xl theme-input space-y-1.5">
            <div class="flex justify-between items-center"><span class="text-xs font-bold opacity-80">РОСТ (СМ)</span><input type="number" value="${p.height}" onchange="setParam('height', this.value)" class="w-16 text-right font-mono-num font-bold text-sm rounded-lg px-2 py-0.5 theme-soft"></div>
            <input type="range" min="140" max="210" value="${p.height}" onchange="setParam('height', this.value)" class="w-full">
          </div>
          <div class="p-3 rounded-2xl theme-input space-y-1.5">
            <div class="flex justify-between items-center"><span class="text-xs font-bold opacity-80">ТЕКУЩИЙ ВЕС (КГ)</span><input type="number" value="${p.weight}" step="0.5" onchange="setParam('weight', this.value)" class="w-20 text-right font-mono-num font-bold text-sm rounded-lg px-2 py-0.5 theme-soft"></div>
            <input type="range" min="30" max="150" step="0.5" value="${p.weight}" onchange="setParam('weight', this.value)" class="w-full">
          </div>
          <div class="p-3 rounded-2xl theme-input space-y-2">
            <label class="flex items-center justify-between cursor-pointer text-xs font-bold">
              <span><input type="checkbox" ${p.useBodyFat ? 'checked' : ''} onchange="setParam('useBodyFat', this.checked)" class="mr-2">Учитывать % жира (атлет)</span>
              ${p.useBodyFat ? `<span class="font-mono-num">Сухая: ${(p.weight*(1-p.bodyFat/100)).toFixed(1)}кг</span>` : ''}
            </label>
            ${p.useBodyFat ? `<input type="range" min="6" max="45" step="0.5" value="${p.bodyFat}" onchange="setParam('bodyFat', this.value)" class="w-full">` : ''}
          </div>
          <div class="grid grid-cols-2 gap-2.5">
            <div class="p-3 rounded-2xl theme-soft"><div class="text-[11px] opacity-80">ИМТ (${m.bmi < 25 ? 'Норма' : 'Выше нормы'})</div><div class="text-xl font-extrabold font-mono-num">${m.bmi}</div></div>
            <div class="p-3 rounded-2xl theme-soft"><div class="text-[11px] opacity-80">Базовый обмен (BMR) 🔥</div><div class="text-xl font-extrabold font-mono-num">${m.bmr} ккал</div></div>
          </div>
        </div>

        <div class="glass-card rounded-3xl p-4 sm:p-5 space-y-4 shadow-lg">
          <div class="flex items-center justify-between">
            <h2 class="font-extrabold text-base">2. Активность: Шаги + Тренировки</h2>
            <span class="text-xs font-mono-num font-extrabold px-2 py-0.5 rounded-lg theme-soft">TDEE: ${m.tdee} ккал</span>
          </div>
          <div class="grid grid-cols-3 gap-1.5">
            <button onclick="setParam('neatLevel', 0.12)" class="p-2 rounded-xl text-left text-xs ${p.neatLevel === 0.12 ? 'theme-grad text-white font-bold' : 'theme-input'}"><div>Сидячий</div><div class="text-[10px] opacity-75">+12%</div></button>
            <button onclick="setParam('neatLevel', 0.18)" class="p-2 rounded-xl text-left text-xs ${p.neatLevel === 0.18 ? 'theme-grad text-white font-bold' : 'theme-input'}"><div>Умеренный</div><div class="text-[10px] opacity-75">+18%</div></button>
            <button onclick="setParam('neatLevel', 0.25)" class="p-2 rounded-xl text-left text-xs ${p.neatLevel === 0.25 ? 'theme-grad text-white font-bold' : 'theme-input'}"><div>Активный</div><div class="text-[10px] opacity-75">+25%</div></button>
          </div>
          <div class="p-3.5 rounded-2xl theme-input space-y-2">
            <div class="flex justify-between items-center">
              <div><div class="text-xs font-bold">👣 Шагов в день</div><div class="text-[11px] opacity-75">~${m.distKm.toFixed(1)} км · +${m.stepsKcal} ккал</div></div>
              <input type="number" value="${p.steps}" step="500" onchange="setParam('steps', this.value)" class="w-20 text-right font-mono-num font-bold text-sm rounded-lg px-2 py-0.5 theme-soft">
            </div>
            <input type="range" min="0" max="25000" step="500" value="${Math.min(25000, p.steps)}" onchange="setParam('steps', this.value)" class="w-full">
            <div class="flex flex-wrap gap-1">
              ${[4000, 6000, 8000, 10000, 12000, 15000].map(st => `<button onclick="setParam('steps', ${st})" class="px-2 py-0.5 rounded-lg text-[10px] font-bold ${p.steps === st ? 'theme-grad text-white' : 'theme-soft'}">${st}</button>`).join('')}
            </div>
          </div>
          <div class="p-3.5 rounded-2xl theme-input space-y-2">
            <div class="flex justify-between text-xs font-bold"><span>🏋️ Тренировки (${p.workoutDays} р/нед по ${p.workoutMins} мин)</span><span>+${m.workoutKcal} ккал/дн</span></div>
            <div class="grid grid-cols-2 gap-2">
              <input type="range" min="0" max="7" value="${p.workoutDays}" onchange="setParam('workoutDays', this.value)" class="w-full">
              <input type="range" min="0" max="150" step="10" value="${p.workoutMins}" onchange="setParam('workoutMins', this.value)" class="w-full">
            </div>
            <div class="grid grid-cols-2 gap-1.5">
              <button onclick="setParam('workoutMode','avg')" class="py-1 rounded-xl text-[11px] font-bold ${p.workoutMode === 'avg' ? 'theme-grad text-white' : 'theme-soft'}">Среднесуточно (/7)</button>
              <button onclick="setParam('workoutMode','today')" class="py-1 rounded-xl text-[11px] font-bold ${p.workoutMode === 'today' ? 'theme-grad text-white' : 'theme-soft'}">Тренировка сегодня</button>
            </div>
          </div>
        </div>

        <div class="glass-card rounded-3xl p-4 sm:p-5 space-y-4 shadow-lg">
          <h2 class="font-extrabold text-base">3. Цель, Контрольные точки и БЖУ</h2>
          <div class="p-3.5 rounded-2xl theme-input space-y-2">
            <div class="flex justify-between items-center"><span class="text-xs font-bold">🎯 Желаемый вес (кг)</span><input type="number" value="${p.targetWeight}" step="0.5" onchange="setParam('targetWeight', this.value)" class="w-20 text-right font-mono-num font-bold text-sm rounded-lg px-2 py-0.5 theme-soft"></div>
            <input type="range" min="30" max="150" step="0.5" value="${p.targetWeight}" onchange="setParam('targetWeight', this.value)" class="w-full">
            <div class="flex flex-wrap gap-1 pt-1">
              ${quickWeights.map(w => `<button onclick="setParam('targetWeight', ${w})" class="px-2 py-0.5 rounded-lg text-[10px] font-bold ${p.targetWeight === w ? 'theme-grad text-white' : 'theme-soft'}">${w} кг</button>`).join('')}
            </div>
          </div>
          <div class="p-3.5 rounded-2xl theme-input space-y-2">
            <div class="flex justify-between text-xs font-bold"><span>📅 Срок: ${p.targetWeeks} нед. (${totalDays} дн.)</span><span>${m.dailyDelta > 0 ? '+' : ''}${m.dailyDelta} ккал/дн</span></div>
            <input type="range" min="2" max="52" value="${Math.min(52, p.targetWeeks)}" onchange="setParam('targetWeeks', this.value)" class="w-full">
          </div>

          <div class="p-3.5 rounded-2xl theme-soft space-y-2.5 text-xs">
            ${isTooStrict ? `<div class="p-2 rounded-xl bg-amber-500/20 border border-amber-400 text-[11px]">⚠️ Жесткий темп! Норма ограничена безопасным порогом <strong>${m.minSafe} ккал</strong>. <button onclick="setParam('targetWeeks', ${safeWeeks})" class="underline font-bold">Поставить ${safeWeeks} нед.</button></div>` : `<div class="text-[11px]">✅ Комфортный темп (${m.weeklyKg} кг/нед). ИМТ: ${m.bmi} →${m.targetBmi}.</div>`}
            <div class="grid grid-cols-2 gap-1.5">
              <button onclick="setParam('steps', ${p.steps + 3000})" class="p-2 rounded-xl theme-input text-left"><div class="font-bold text-[11px]">👟 +3 000 шагов</div><div class="text-[10px] opacity-75">+${extra3kKcal} ккал к рациону</div></button>
              <button onclick="applySmartMacros(${recProt}, ${recFat})" class="p-2 rounded-xl theme-input text-left"><div class="font-bold text-[11px]">🥩 Смарт-БЖУ</div><div class="text-[10px] opacity-75">Б ${recProt} · Ж ${recFat} г/кг</div></button>
            </div>
            <div class="pt-1 border-t border-white/15">
              <div class="font-bold text-[11px] mb-1">🏁 Контрольные точки и адаптация TDEE:</div>
              <div class="grid grid-cols-5 gap-1 text-center font-mono-num">
                ${checkpoints.map(cp => `<div class="p-1.5 rounded-xl theme-input"><div class="text-[9px] opacity-70 font-sans">${cp.label}</div><div class="font-extrabold text-[11px]">${cp.w}кг</div><div class="text-[9px] opacity-75 font-sans">${cp.date}</div><div class="text-[8px] opacity-60">⚡${cp.tdee}</div></div>`).join('')}
              </div>
            </div>
          </div>

          <div class="space-y-1.5">
            <div class="text-xs font-bold">🥗 Тип питания под цель:</div>
            ${DIET_TYPES.map(dt => `<button onclick="s
                      <div class="p-3 rounded-2xl theme-input space-y-2 text-xs">
            <div class="text-[10px] opacity-80 font-bold">База расчета белка и жиров (г/кг):</div>
            <div class="grid grid-cols-3 gap-1">
              <button onclick="setParam('macroBase','target')" class="py-1 px-1 rounded-lg text-[10px] font-bold ${p.macroBase === 'target' ? 'theme-grad text-white' : 'theme-soft'}">Желаемый (${p.targetWeight}кг)</button>
              <button onclick="setParam('macroBase','current')" class="py-1 px-1 rounded-lg text-[10px] font-bold ${p.macroBase === 'current' ? 'theme-grad text-white' : 'theme-soft'}">Текущий (${p.weight}кг)</button>
              <button onclick="setParam('macroBase','lbm')" class="py-1 px-1 rounded-lg text-[10px] font-bold ${p.macroBase === 'lbm' ? 'theme-grad text-white' : 'theme-soft'}">Сухая (${m.lbmWeight}кг)</button>
            </div>
            <div><div class="flex justify-between"><span>Белки (${p.protGkg} г/кг от ${m.refLabel})</span><strong>${m.normP} г</strong></div><input type="range" min="1.2" max="2.8" step="0.1" value="${p.protGkg}" onchange="setParam('protGkg', this.value)" class="w-full"></div>
            <div><div class="flex justify-between"><span>Жиры (${p.fatGkg} г/кг от ${m.refLabel})</span><strong>${m.normF} г</strong></div><input type="range" min="0.6" max="1.6" step="0.05" value="${p.fatGkg}" onchange="setParam('fatGkg', this.value)" class="w-full"></div>
          </div>

          <div class="grid grid-cols-4 gap-2">
            <div class="p-2.5 rounded-2xl theme-grad text-white text-center"><div class="text-[10px]">НОРМА</div><div class="font-mono-num font-extrabold text-sm">${m.effectiveKcal}</div></div>
            <div class="p-2.5 rounded-2xl theme-soft text-center"><div class="text-[10px]">Белки</div><div class="font-mono-num font-extrabold text-sm">${m.normP}г</div></div>
            <div class="p-2.5 rounded-2xl theme-soft text-center"><div class="text-[10px]">Жиры</div><div class="font-mono-num font-extrabold text-sm">${m.normF}г</div></div>
            <div class="p-2.5 rounded-2xl theme-soft text-center"><div class="text-[10px]">Углеводы</div><div class="font-mono-num font-extrabold text-sm">${m.normC}г</div></div>
          </div>
        </div>
      </section>

      <section class="lg:col-span-7 space-y-4 ${activeTab === 'calc' ? 'hidden lg:block' : ''}">
        <div class="glass-card rounded-3xl p-4 sm:p-5 space-y-4 shadow-lg">
          <div class="flex flex-wrap items-center justify-between gap-2">
            <h2 class="font-extrabold text-base">Конструктор дневного рациона</h2>
            <div class="flex gap-1.5">
              <button onclick="openAiModal('dinner')" class="px-2.5 py-1 rounded-xl theme-grad text-white text-xs font-bold shadow">🪄 Под остаток</button>
              <button onclick="resetDemoDiary()" class="px-2 py-1 rounded-xl theme-soft text-xs">🔄</button>
              <button onclick="clearDiary()" class="px-2 py-1 rounded-xl theme-soft text-xs">🗑</button>
            </div>
          </div>
          <div class="p-3.5 rounded-2xl theme-input space-y-2">
            <div class="flex justify-between items-baseline">
              <div><span class="text-2xl font-extrabold font-mono-num">${totKcal}</span><span class="text-xs opacity-70 font-mono-num"> / ${m.effectiveKcal} ккал</span></div>
              <span class="text-xs font-bold px-2.5 py-0.5 rounded-full theme-soft">${m.effectiveKcal - totKcal >= 0 ? `В запасе: ${m.effectiveKcal - totKcal} ккал` : `Перебор: +${Math.abs(m.effectiveKcal - totKcal)} ккал`}</span>
            </div>
            <div class="w-full h-3 rounded-full bg-black/20 overflow-hidden"><div class="h-full theme-grad" style="width:${Math.min(100, Math.round((totKcal/m.effectiveKcal)*100))}%"></div></div>
            <div class="grid grid-cols-3 gap-2 pt-1 text-center font-mono-num text-xs">
              <div class="p-1.5 rounded-xl theme-soft">Б: <strong>${totP}</strong>/${m.normP}г</div>
              <div class="p-1.5 rounded-xl theme-soft">Ж: <strong>${totF}</strong>/${m.normF}г</div>
              <div class="p-1.5 rounded-xl theme-soft">У: <strong>${totC}</strong>/${m.normC}г</div>
            </div>
          </div>

          <div class="grid grid-cols-4 gap-1.5">
            ${['breakfast','lunch','dinner','snack'].map(mk => `<button onclick="activeMeal='${mk}'; renderApp();" class="py-2 px-1 rounded-xl text-xs font-bold ${activeMeal === mk ? 'theme-grad text-white shadow' : 'theme-input'}"><div>${mealNames[mk]}</div><div class="text-[10px] font-mono-num opacity-80">${mealSummaries[mk].kcal} ккал</div></button>`).join('')}
          </div>

          <div class="space-y-2">
            <input type="text" value="${searchQuery}" oninput="searchQuery=this.value; renderCatalogOnly();" placeholder="🔍 Поиск продукта..." class="w-full px-3.5 py-2 rounded-2xl theme-input text-xs">
            <div class="flex gap-1 overflow-x-auto pb-1">
              ${cats.map(c => `<button onclick="activeCategory='${c}'; renderApp();" class="px-2.5 py-1 rounded-xl text-[11px] font-bold whitespace-nowrap ${activeCategory === c ? 'theme-grad text-white' : 'theme-input'}">${c}</button>`).join('')}
            </div>
          </div>

          <div id="catalog-box" class="max-h-48 overflow-y-auto divide-y divide-white/10 rounded-2xl theme-input px-3">
            ${filteredFoods.map(f => `<div class="py-2 flex items-center justify-between gap-2 text-xs"><div><div class="font-bold">${f.name}</div><div class="text-[10px] opacity-70 font-mono-num">100г: ${f.kcal} ккал · Б ${f.p} · Ж ${f.f} · У ${f.c}</div></div><button onclick="addFoodToMeal('${f.id}')" class="px-2.5 py-1 rounded-xl theme-grad text-white font-bold text-xs">+ Добавить</button></div>`).join('')}
          </div>

          <div class="space-y-2">
            <div class="flex justify-between text-xs font-bold"><span>Состав: ${mealNames[activeMeal]}</span><span class="font-mono-num">${mealSummaries[activeMeal].kcal} ккал</span></div>
            ${(p.diary[activeMeal] || []).map((it, idx) => {
              const f = foods.find(x => x.id === it.foodId) || { name: 'Продукт', kcal: 0 };
              const rg = getItemEffectiveGrams(it, f);
              return `<div class="p-2.5 rounded-2xl theme-input flex items-center justify-between gap-2 text-xs"><div><div class="font-bold">${f.name}${f.cookRatio ? `<button onclick="toggleCooked(${idx})" class="px-1.5 py-0.5 rounded text-[10px] theme-soft">${it.isCooked ? '🍳 Готовое' : '🌾 Сырое'}</button>` : ''}</div><div class="text-[10px] opacity-75 font-mono-num">${Math.round(f.kcal*(rg/100))} ккал</div></div><div class="flex items-center gap-1"><input type="number" value="${it.grams}" step="10" onchange="updateGrams(${idx}, this.value)" class="w-16 text-right font-mono-num font-bold rounded-xl px-2 py-1 theme-soft"><span>г</span><button onclick="removeItem(${idx})" class="px-1.5 text-rose-400 font-bold">✕</button></div></div>`;
            }).join('')}
          </div>
        </div>

        <div class="glass-card rounded-3xl p-5 space-y-4 shadow-xl border-2" style="border-color: var(--brand);">
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-extrabold">Финальная калорийность рациона</h3>
            <button onclick="copyFinalReport(${totKcal},${totP},${totF},${totC},${m.effectiveKcal},${m.tdee})" class="px-3 py-1.5 rounded-xl theme-grad text-white text-xs font-bold">📋 Скопировать</button>
          </div>
          <div class="grid grid-cols-4 gap-2 font-mono-num text-center">
            <div class="p-2.5 rounded-2xl theme-soft"><div class="text-[10px] font-sans">Ккал</div><div class="text-lg font-extrabold">${totKcal}</div></div>
            <div class="p-2.5 rounded-2xl theme-soft"><div class="text-[10px] font-sans">Белки</div><div class="text-lg font-extrabold">${totP}г</div></div>
            <div class="p-2.5 rounded-2xl theme-soft"><div class="text-[10px] font-sans">Жиры</div><div class="text-lg font-extrabold">${totF}г</div></div>
            <div class="p-2.5 rounded-2xl theme-soft"><div class="text-[10px] font-sans">Углев</div><div class="text-lg font-extrabold">${totC}г</div></div>
          </div>
        </div>
      </section>
    </main>

    <div id="modal-ai" class="fixed inset-0 z-50 hidden bg-black/75 backdrop-blur-sm flex items-center justify-center p-3">
      <div class="glass-card rounded-3xl max-w-lg w-full p-5 space-y-3.5 max-h-[92vh] overflow-y-auto shadow-2xl">
        <div class="flex justify-between items-center">
          <h3 class="font-extrabold text-sm">✨ ИИ-помощник (${hasSavedKey ? '☁️ Gemini API' : '⚡ Локальный без ключа'})</h3>
          <button onclick="document.getElementById('modal-ai').classList.add('hidden')" class="px-2.5 py-1 rounded-xl theme-soft text-xs font-bold">✕</button>
        </div>
        <div class="p-3 rounded-2xl theme-input space-y-2">
          <div class="flex flex-wrap items-center justify-between gap-1">
            <span class="text-[11px] font-bold">🔑 Ключ Gemini (необязательно):</span>
            <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener" class="px-2 py-0.5 rounded-lg theme-grad text-white text-[10px] font-bold">Получить ключ в Google AI Studio ↗</a>
          </div>
          <div class="flex gap-1.5">
            <input type="password" id="inp-gemini-key" value="${localStorage.getItem('nutricalc_gemini_key') || ''}" placeholder="Пусто = локальный режим, или AIzaSy..." class="flex-1 px-3 py-1.5 rounded-xl theme-soft text-xs font-mono-num">
            <button onclick="localStorage.setItem('nutricalc_gemini_key', document.getElementById('inp-gemini-key').value.trim()); renderApp(); openAiModal();" class="px-3 py-1.5 rounded-xl theme-grad text-white text-xs font-bold">ОК</button>
          </div>
        </div>
        <textarea id="inp-ai-prompt" rows="2" placeholder="Например: 200г грудки, 150 ширатаки, 2 яйца" class="w-full p-2.5 rounded-xl theme-input text-xs"></textarea>
        <div class="grid grid-cols-3 gap-1.5">
          <button onclick="runAi('parse', ${m.effectiveKcal - totKcal}, ${m.normP - totP}, ${m.normF - totF}, ${m.normC - totC})" class="p-2.5 rounded-xl theme-grad text-white text-xs font-bold">🎙 В дневник</button>
          <button id="btn-ai-dinner" onclick="runAi('dinner', ${m.effectiveKcal - totKcal}, ${m.normP - totP}, ${m.normF - totF}, ${m.normC - totC})" class="p-2.5 rounded-xl theme-soft text-xs font-bold">🍽 Под остаток</button>
          <button onclick="runAi('audit', ${m.effectiveKcal - totKcal}, ${m.normP - totP}, ${m.normF - totF}, ${m.normC - totC})" class="p-2.5 rounded-xl theme-soft text-xs font-bold">🔍 Аудит дня</button>
        </div>
        <div id="ai-out" class="hidden p-3.5 rounded-2xl theme-input text-xs space-y-2 whitespace-pre-line"></div>
      </div>
    </div>
  `;
}

function renderCatalogOnly() {
  const filtered = getAllFoods().filter(f => (activeCategory === 'Все' || f.cat === activeCategory) && f.name.toLowerCase().includes(searchQuery.toLowerCase()));
  const box = document.getElementById('catalog-box');
  if (box) box.innerHTML = filtered.map(f => `<div class="py-2 flex items-center justify-between gap-2 text-xs"><div><div class="font-bold">${f.name}</div><div class="text-[10px] opacity-70 font-mono-num">100г: ${f.kcal} ккал · Б ${f.p} · Ж ${f.f} · У ${f.c}</div></div><button onclick="addFoodToMeal('${f.id}')" class="px-2.5 py-1 rounded-xl theme-grad text-white font-bold text-xs">+ Добавить</button></div>`).join('');
}

function updateGrams(idx, val) { const g = Math.max(0, parseInt(val, 10) || 0); if (g === 0) getProf().diary[activeMeal].splice(idx, 1); else getProf().diary[activeMeal][idx].grams = g; saveStorage(); renderApp(); }
function toggleCooked(idx) { getProf().diary[activeMeal][idx].isCooked = !getProf().diary[activeMeal][idx].isCooked; saveStorage(); renderApp(); }
function removeItem(idx) { getProf().diary[activeMeal].splice(idx, 1); saveStorage(); renderApp(); }
function clearDiary() { getProf().diary = { breakfast: [], lunch: [], dinner: [], snack: [] }; saveStorage(); renderApp(); }
function resetDemoDiary() { const pk = appData.activeProfile; appData.profiles[pk].diary = JSON.parse(JSON.stringify(DEFAULT_PROFILES[pk].diary)); saveStorage(); renderApp(); }
function openCustomFoodModal() {
  const name = prompt('Название блюда:'); if (!name) return;
  const p = parseFloat(prompt('Белки на 100г:', '15')) || 0, f = parseFloat(prompt('Жиры на 100г:', '5')) || 0, c = parseFloat(prompt('Углеводы на 100г:', '10')) || 0;
  const id = 'cf_' + Date.now(); appData.customFoods.unshift({ id, name, cat: 'Мои блюда', p, f, c, kcal: Math.round(p*4+f*9+c*4) }); addFoodToMeal(id, 100);
}
function copyFinalReport(kcal, p, f, c, norm, tdee) {
  navigator.clipboard.writeText(`📊 NutriCalc Pro\nРасход: ${tdee} ккал | Норма: ${norm} ккал\nСъедено: ${kcal} ккал (Б:${p}г, Ж:${f}г, У:${c}г)`);
  alert('Скопировано!');
}
function openAiModal(mode) { document.getElementById('modal-ai').classList.remove('hidden'); if (mode === 'dinner') document.getElementById('btn-ai-dinner').click(); }
function applyLocalPresetToDiary(idx) { (lastLocalPresets[idx] || []).forEach(it => addFoodToMeal(it.foodId, it.grams)); document.getElementById('modal-ai').classList.add('hidden'); }

async function runAi(mode, remK, remP, remF, remC) {
  const key = ((document.getElementById('inp-gemini-key')?.value) || localStorage.getItem('nutricalc_gemini_key') || '').trim();
  const out = document.getElementById('ai-out'); out.classList.remove('hidden');
  if (!key) return runLocalSmartEngine(mode, remK, remP, remF, remC, out);
  out.textContent = '☁️ Запрос к Gemini...';
  try {
    const promptText = mode === 'dinner'
      ? `Остаток КБЖУ: ${remK} ккал, Б:${remP}г, Ж:${remF}г, У:${remC}г. Предложи 3 простых ужина с граммовками.`
      : `Оцени остаток КБЖУ за день: ${remK} ккал (Б:${remP}г, Ж:${remF}г, У:${remC}г). Дай 3 совета.`;
    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${encodeURIComponent(key)}`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents: [{ parts: [{ text: promptText }] }] })
    });
    const data = await res.json();
    out.textContent = data?.candidates?.[0]?.content?.parts?.[0]?.text || 'Нет ответа';
  } catch (e) { runLocalSmartEngine(mode, remK, remP, remF, remC, out, true); }
}

function runLocalSmartEngine(mode, remK, remP, remF, remC, out) {
  if (mode === 'parse') {
    const raw = (document.getElementById('inp-ai-prompt').value || '').toLowerCase();
    const parts = raw.split(/[,;+\n]| и /).map(s => s.trim()).filter(Boolean);
    const added = [], foods = getAllFoods();
    parts.forEach(part => {
      const m = part.match(/(\d+)/); let num = m ? parseInt(m[1], 10) : 100;
      const fd = foods.find(f => (f.kw || []).some(k => part.includes(k)));
      if (fd) { if (num <= 10 && fd.unitWeight) num *= fd.unitWeight; getProf().diary[activeMeal].push({ foodId: fd.id, grams: num, isCooked: false }); added.push(`• ${fd.name} (${num}г)`); }
    });
    saveStorage(); renderApp(); document.getElementById('modal-ai').classList.remove('hidden');
    const newOut = document.getElementById('ai-out'); newOut.classList.remove('hidden');
    newOut.textContent = added.length ? `⚡ Добавлено:\n${added.join('\n')}` : 'Напишите, например: 200 грудки, 60 гречки, 2 яйца';
    return;
  }
  if (mode === 'dinner') {
    const needP = Math.max(20, remP), needC = Math.max(0, remC);
    const chG = Math.min(300, Math.max(100, Math.round((needP * 0.8) / 0.236 / 10) * 10));
    const curG = Math.min(280, Math.max(120, Math.round((needP * 0.75) / 0.18 / 10) * 10));
    const fshG = Math.min(320, Math.max(140, Math.round((needP * 0.85) / 0.175 / 10) * 10));
    const opt1 = [{ foodId: 'f1', grams: chG, label: `Куриная грудка ${chG}г` }, needC > 20 ? { foodId: 'f13', grams: 50, label: 'Гречка 50г' } : { foodId: 'f17', grams: 200, label: 'Ширатаки 200г' }];
    const opt2 = [{ foodId: 'f9', grams: curG, label: `Творог 2% ${curG}г` }, { foodId: 'f8', grams: 120, label: 'Яичный белок 120г' }];
    const opt3 = [{ foodId: 'f4', grams: fshG, label: `Треска ${fshG}г` }, { foodId: 'f22', grams: 200, label: 'Брокколи 200г' }];
    lastLocalPresets = [opt1, opt2, opt3];
    out.innerHTML = `<div class="font-bold mb-1">⚡ Под остаток (${remK} ккал · Б:${remP}г · Ж:${remF}г · У:${remC}г):</div>` +
      lastLocalPresets.map((o, i) => `<div class="p-2 rounded-xl theme-soft flex justify-between items-center mt-1"><span>${o.map(x=>x.label).join(' + ')}</span><button onclick="applyLocalPresetToDiary(${i})" class="px-2 py-1 rounded-lg theme-grad text-white font-bold text-[10px]">+ В дневник</button></div>`).join('');
    return;
  }
  out.textContent = `⚡ Экспресс-аудит:\n• Остаток калорий: ${remK} ккал\n• Остаток белка: ${remP} г\n• Нажмите «🍽 Под остаток», чтобы добавить сбалансированный прием пищи в 1 клик.`;
}

loadStorage();
renderApp();
