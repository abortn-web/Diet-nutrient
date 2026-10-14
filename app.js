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
  if (!p.dietType) p.dietType = 'highprot';
  return p;
}
function getAllFoods() { return [...appData.customFoods, ...DEFAULT_FOODS]; }
function saveStorage() { try { localStorage.setItem('nutriingo_v2', JSON.stringify(appData)); } catch (e) {} }
function loadStorage() {
  try {
    const raw = localStorage.getItem('nutriingo_v2') || localStorage.getItem('nutriingo_v1');
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

  const minSafe = p.gender === 'female' ? Math.max(1150, Math.round(curr.bmr * 0.88)) : Math.max(1400, Math.round(curr.bmr * 0.90));
  const effectiveKcal = Math.max(minSafe, targetKcal);

  const estBf = p.useBodyFat ? p.bodyFat : (p.gender === 'female' ? 24 : 18);
  const lbmWeight = +(p.weight * (1 - estBf / 100)).toFixed(1);
  let refWeight = p.targetWeight, refLabel = 'желаемого веса';
  if (p.macroBase === 'current') { refWeight = p.weight; refLabel = 'текущего веса'; }
  else if (p.macroBase === 'lbm') { refWeight = lbmWeight; refLabel = 'сухой массы'; }

  let normP = Math.round(refWeight * p.protGkg);
  let normF = Math.round(refWeight * p.fatGkg);
  let normC = 0;

  if (p.dietType === 'keto') {
    // Строгий Кето-протокол: углеводы <= 30 г (5% ккал), белок по норме г/кг, остаток калорий — жиры
    normC = Math.min(30, Math.max(15, Math.round((effectiveKcal * 0.05) / 4)));
    const remForFat = Math.max(450, effectiveKcal - normP * 4 - normC * 4);
    normF = Math.round(remForFat / 9);
    p.fatGkg = +(normF / refWeight).toFixed(2);
  } else if (p.dietType === 'lowcarb') {
    // Low-Carb протокол: углеводы не более 90-110 г (до 22% ккал), остаток идет в жиры
    const rawRemKcal = effectiveKcal - normP * 4 - normF * 9;
    const maxLowCarbG = Math.min(105, Math.round((effectiveKcal * 0.22) / 4));
    if (rawRemKcal / 4 > maxLowCarbG) {
      normC = maxLowCarbG;
      normF = Math.round(Math.max(400, effectiveKcal - normP * 4 - normC * 4) / 9);
      p.fatGkg = +(normF / refWeight).toFixed(2);
    } else {
      normC = Math.max(40, Math.round(rawRemKcal / 4));
    }
  } else {
    // Сбалансированное, Высокобелковое, Сила: точный баланс Б и Ж по г/кг, остаток в углеводы
    let remKcal = effectiveKcal - (normP * 4 + normF * 9);
    if (remKcal < 160) {
      normF = Math.max(Math.round(refWeight * 0.7), Math.round((effectiveKcal - normP * 4 - 160) / 9));
      remKcal = Math.max(120, effectiveKcal - (normP * 4 + normF * 9));
    }
    normC = Math.round(remKcal / 4);
  }

  const realPpct = Math.round((normP * 4 / effectiveKcal) * 100);
  const realFpct = Math.round((normF * 9 / effectiveKcal) * 100);
  const realCpct = Math.max(0, 100 - realPpct - realFpct);

  return { ...curr, bmi, targetBmi, targetKcal, effectiveKcal, minSafe, dailyDelta, weeklyKg, refWeight, refLabel, lbmWeight, normP, normF, normC, realPpct, realFpct, realCpct };
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
  if (['age','height','steps','workoutDays','workoutMins','targetWeeks'].includes(key)) p[key] = Math.max(0, parseInt(val, 10) || 0);
  else if (['weight','bodyFat','neatLevel','targetWeight','presetDelta','protGkg','fatGkg'].includes(key)) p[key] = Math.max(0, parseFloat(val) || 0);
  else p[key] = val;
  if (key === 'fatGkg' && (p.dietType === 'keto' || p.dietType === 'lowcarb')) p.dietType = 'highprot';
  saveStorage(); renderApp();
}

function switchProfile(pk) { appData.activeProfile = pk; saveStorage(); renderApp(); }
function applySmartMacros(protG, fatG) { const p = getProf(); p.dietType = 'highprot'; p.protGkg = protG; p.fatGkg = fatG; saveStorage(); renderApp(); }
function getItemEffectiveGrams(item, food) { return (!item.isCooked || !food.cookRatio) ? item.grams : Math.round(item.grams / food.cookRatio); }

function addFoodToMeal(foodId, grams = 100) {
  const list = getProf().diary[activeMeal];
  const ex = list.find(i => i.foodId === foodId && !i.isCooked);
  if (ex) ex.grams += grams; else list.push({ foodId, grams, isCooked: false });
  saveStorage(); renderApp();
}
