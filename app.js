let appData = {
  activeProfile: 'p1',
  profiles: JSON.parse(JSON.stringify(DEFAULT_PROFILES))
};

let activeTab = 'calc';
let mealBolus = { p: 35, f: 15, c: 48 };

const INSULIN_TYPES = [
  { id: 'ultrafast', name: '⚡ Сверхбыстрый инсулин', brands: 'Фиасп, Люмжев', preMin: 'За 0–5 мин до еды (или в начале еды)', postTiming: 'через 60–90 мин после еды', coversBJE: false },
  { id: 'ultralong', name: '🚀 Ультракороткий инсулин', brands: 'НовоРапид, Хумалог, Апидра, РинФаст', preMin: 'За 10–15 мин ПЕРЕД едой', postTiming: 'через 60–90 мин ПОСЛЕ еды', coversBJE: false },
  { id: 'short', name: '⏱ Короткий инсулин', brands: 'Актрапид, Хумулин Регуляр, Биосулин Р', preMin: 'За 25–30 мин ПЕРЕД едой', postTiming: 'входит в 1 укол (хвост до 6 ч перекрывает БЖЕ)', coversBJE: true }
];

function getProf() {
  const p = appData.profiles[appData.activeProfile];
  if (!p.macroBase) p.macroBase = 'target';
  if (!p.dietType) p.dietType = 'highprot';
  if (!p.diabetesType) p.diabetesType = 'none';
  if (!p.icr) p.icr = 1.2;
  if (!p.insulinType) p.insulinType = 'ultralong';
  return p;
}

function saveStorage() { try { localStorage.setItem('nutriingo_v7', JSON.stringify(appData)); } catch (e) {} }
function loadStorage() {
  try {
    const raw = localStorage.getItem('nutriingo_v7') || localStorage.getItem('nutriingo_v6');
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

function computeBolusForMeal(pGrams, fGrams, cGrams, p) {
  const ins = INSULIN_TYPES.find(x => x.id === p.insulinType) || INSULIN_TYPES[1];
  const xe = +(cGrams / 12).toFixed(1);
  const fpKcal = Math.round(pGrams * 4 + fGrams * 9);
  const bje = +(fpKcal / 100).toFixed(1);
  const carbUnits = +(xe * p.icr).toFixed(1);
  const bjeUnits = bje >= 1.0 ? +(bje * p.icr * 0.5).toFixed(1) : 0;
  const totalUnits = +(carbUnits + bjeUnits).toFixed(1);
  const splitWaves = bjeUnits >= 0.4 && !ins.coversBJE;
  const preUnits = splitWaves ? carbUnits : totalUnits;
  const postUnits = splitWaves ? bjeUnits : 0;
  const waveHours = bje < 1 ? 0 : (bje < 2 ? 3 : (bje < 3 ? 4 : 5));
  return { ins, xe, fpKcal, bje, carbUnits, bjeUnits, totalUnits, preUnits, postUnits, splitWaves, waveHours };
}

function computeDailyInsulinPlan(m, p) {
  const ins = INSULIN_TYPES.find(x => x.id === p.insulinType) || INSULIN_TYPES[1];
  const dayXE = +(m.normC / 12).toFixed(1);
  const dayFpKcal = Math.round(m.normP * 4 + m.normF * 9);
  const dayBJE = +(dayFpKcal / 100).toFixed(1);

  const dayCarbBolus = +(dayXE * p.icr).toFixed(1);
  const dayBjeBolus = +(dayBJE * p.icr * 0.45).toFixed(1);
  const totalBolusDay = +(dayCarbBolus + dayBjeBolus).toFixed(1);
  const estBasal = +(Math.max(p.weight * 0.22, totalBolusDay * 0.82)).toFixed(1);
  const totalDailyDose = +(totalBolusDay + estBasal).toFixed(1);

  const splits = [
    { name: '🌅 Завтрак (30%)', share: 0.30, icrMult: 1.15 },
    { name: '☀️ Обед (35%)', share: 0.35, icrMult: 1.00 },
    { name: '🌙 Ужин (25%)', share: 0.25, icrMult: 0.90 },
    { name: '🍏 Перекус (10%)', share: 0.10, icrMult: 1.00 }
  ].map(s => {
    const cG = Math.round(m.normC * s.share);
    const pG = Math.round(m.normP * s.share);
    const fG = Math.round(m.normF * s.share);
    const xe = +(cG / 12).toFixed(1);
    const bje = +((pG * 4 + fG * 9) / 100).toFixed(1);
    const effIcr = +(p.icr * s.icrMult).toFixed(2);
    const preU = +(xe * effIcr).toFixed(1);
    const postU = (!ins.coversBJE && bje >= 1.0) ? +(bje * effIcr * 0.45).toFixed(1) : 0;
    const totU = +(preU + postU).toFixed(1);
    return { ...s, cG, pG, fG, xe, bje, effIcr, preU, postU, totU };
  });

  return { ins, dayXE, dayBJE, dayCarbBolus, dayBjeBolus, totalBolusDay, estBasal, totalDailyDose, splits };
}

function computeMetrics() {
  const p = getProf();
  const curr = calcTDEEForWeight(p.weight, p);
  const hm = p.height / 100;
  const bmi = +(p.weight / (hm * hm)).toFixed(1);
  const targetBmi = +(p.targetWeight / (hm * hm)).toFixed(1);

  let targetKcal = curr.tdee, dailyDelta = 0, weeklyKg = 0;
  const diffKg = p.targetWeight - p.weight;
  dailyDelta = Math.round((diffKg * 7700) / Math.max(7, p.targetWeeks * 7));
  weeklyKg = +(diffKg / p.targetWeeks).toFixed(2);
  targetKcal = curr.tdee + dailyDelta;

  // Умный физиологический минимум с прямым учетом текущего веса
  let weightBasedMin = Math.round(p.weight * (p.diabetesType !== 'none' ? 23.5 : 21.0));
  let bmrBasedMin = p.gender === 'female' ? Math.round(curr.bmr * 0.88) : Math.round(curr.bmr * 0.90);
  if (p.diabetesType !== 'none') {
    bmrBasedMin = Math.max(bmrBasedMin, Math.round(curr.tdee * 0.78));
  }
  let minSafe = Math.max(weightBasedMin, bmrBasedMin);
  minSafe = p.diabetesType === 'none' ? Math.max(1150, minSafe) : Math.max(1400, minSafe);

  const effectiveKcal = Math.max(minSafe, targetKcal);

  const estBf = p.useBodyFat ? p.bodyFat : (p.gender === 'female' ? 24 : 18);
  const lbmWeight = +(p.weight * (1 - estBf / 100)).toFixed(1);
  let refWeight = p.targetWeight, refLabel = 'желаемого веса';
  if (p.macroBase === 'current') { refWeight = p.weight; refLabel = 'текущего веса'; }
  else if (p.macroBase === 'lbm') { refWeight = lbmWeight; refLabel = 'сухой массы'; }

  let normP = Math.round(refWeight * p.protGkg);
  let normF = Math.round(refWeight * p.fatGkg);
  let normC = 0;

  if (p.diabetesType === 'dm2') {
    const maxDm2Carbs = Math.min(120, Math.round((effectiveKcal * 0.28) / 4));
    const minDm2Carbs = 80;
    const rawRemC = Math.round((effectiveKcal - normP * 4 - normF * 9) / 4);
    normC = Math.max(minDm2Carbs, Math.min(maxDm2Carbs, rawRemC));
    normF = Math.round(Math.max(400, effectiveKcal - normP * 4 - normC * 4) / 9);
    p.fatGkg = +(normF / refWeight).toFixed(2);
  } else if (p.diabetesType === 'dm1') {
    const minDm1Carbs = 110;
    const maxDm1Carbs = Math.min(145, Math.round((effectiveKcal * 0.38) / 4));
    const rawRemC = Math.round((effectiveKcal - normP * 4 - normF * 9) / 4);
    normC = Math.max(minDm1Carbs, Math.min(maxDm1Carbs, rawRemC));
    normF = Math.round(Math.max(360, effectiveKcal - normP * 4 - normC * 4) / 9);
    p.fatGkg = +(normF / refWeight).toFixed(2);
  } else if (p.dietType === 'keto') {
    normC = Math.min(30, Math.max(15, Math.round((effectiveKcal * 0.05) / 4)));
    normF = Math.round(Math.max(450, effectiveKcal - normP * 4 - normC * 4) / 9);
    p.fatGkg = +(normF / refWeight).toFixed(2);
  } else if (p.dietType === 'lowcarb') {
    const rawRemKcal = effectiveKcal - normP * 4 - normF * 9;
    const maxLowCarbG = Math.min(105, Math.round((effectiveKcal * 0.22) / 4));
    if (rawRemKcal / 4 > maxLowCarbG) {
      normC = maxLowCarbG;
      normF = Math.round(Math.max(400, effectiveKcal - normP * 4 - normC * 4) / 9);
      p.fatGkg = +(normF / refWeight).toFixed(2);
    } else normC = Math.max(40, Math.round(rawRemKcal / 4));
  } else {
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
  const totalXE = +(normC / 12).toFixed(1);
  const maxMealCarbs = p.diabetesType === 'dm2' ? Math.min(35, Math.round(normC / 3.5)) : Math.round(normC / 3.5);
  const maxMealXE = +(maxMealCarbs / 12).toFixed(1);
  const fiberNorm = Math.round((effectiveKcal / 1000) * (p.diabetesType === 'none' ? 14 : 18));

  return { ...curr, bmi, targetBmi, targetKcal, effectiveKcal, minSafe, dailyDelta, weeklyKg, refWeight, refLabel, lbmWeight, normP, normF, normC, realPpct, realFpct, realCpct, totalXE, maxMealCarbs, maxMealXE, fiberNorm };
}

function setDiabetesType(dType) {
  const p = getProf(); p.diabetesType = dType;
  if (dType === 'dm1') { if (p.dietType === 'keto') p.dietType = 'balanced'; p.protGkg = 1.6; p.fatGkg = 1.0; }
  else if (dType === 'dm2') { p.dietType = 'lowcarb'; p.protGkg = 1.8; p.fatGkg = 1.0; }
  saveStorage(); renderApp();
}

function formatDateOffset(days) {
  const d = new Date(); d.setDate(d.getDate() + Math.round(days));
  return d.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' });
}

function selectDietType(typeId) {
  const p = getProf(), dt = DIET_TYPES.find(x => x.id === typeId); if (!dt) return;
  if (p.diabetesType === 'dm1' && typeId === 'keto') { alert('⚠️ При СД 1 типа строгое Кето повышает риск кетоацидоза. Выбран безопасный Low-Carb.'); typeId = 'lowcarb'; }
  p.dietType = typeId; p.pPct = dt.p; p.fPct = dt.f; p.cPct = dt.c; p.protGkg = dt.pGkg; p.fatGkg = dt.fGkg;
  saveStorage(); renderApp();
}

function setParam(key, val) {
  const p = getProf();
  if (['age','height','steps','workoutDays','workoutMins','targetWeeks'].includes(key)) p[key] = Math.max(0, parseInt(val, 10) || 0);
  else if (['weight','bodyFat','neatLevel','targetWeight','presetDelta','protGkg','fatGkg','icr'].includes(key)) p[key] = Math.max(0, parseFloat(val) || 0);
  else p[key] = val;
  if (key === 'fatGkg' && p.diabetesType === 'none' && (p.dietType === 'keto' || p.dietType === 'lowcarb')) p.dietType = 'highprot';
  saveStorage(); renderApp();
}

function setMealBolus(k, v) { mealBolus[k] = Math.max(0, Math.round(parseFloat(v) || 0)); renderApp(); }
function switchProfile(pk) { appData.activeProfile = pk; saveStorage(); renderApp(); }
function applySmartMacros(protG, fatG) { const p = getProf(); p.protGkg = protG; p.fatGkg = fatG; saveStorage(); renderApp(); }
