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
  { id: 'ultrafast', name: '⚡ Сверхбыстрый', brands: 'Фиасп, Люмжев', preMin: 'За 0–5 мин до еды', baseWait: 3, diaHours: 3.5, isfRule: 100, postTiming: 'через 60–90 мин после еды', coversBJE: false },
  { id: 'ultralong', name: '🚀 Ультракороткий', brands: 'НовоРапид, Хумалог', preMin: 'За 10–15 мин ПЕРЕД едой', baseWait: 12, diaHours: 4.0, isfRule: 100, postTiming: 'через 60–90 мин ПОСЛЕ еды', coversBJE: false },
  { id: 'short', name: '⏱ Короткий', brands: 'Актрапид, Регуляр', preMin: 'За 25–30 мин ПЕРЕД едой', baseWait: 25, diaHours: 5.5, isfRule: 83, postTiming: 'входит в 1 укол', coversBJE: true }
];

function getProf() {
  const p = appData.profiles[appData.activeProfile];
  if (!p.macroBase) p.macroBase = 'target';
  if (!p.dietType) p.dietType = 'highprot';
  if (!p.diabetesType) p.diabetesType = 'none';
  if (!p.icr || p.icr <= 0) p.icr = 1.2;
  if (!p.insulinType) p.insulinType = 'ultralong';
  if (!p.targetBg || p.targetBg < 4.0) p.targetBg = 5.6;
  if (typeof p.customIsf === 'undefined') p.customIsf = 0;
  if (!p.penStep) p.penStep = 0.5; // Шаг ручки: 0.5 или 1 ЕД
  if (!p.basalUnits) p.basalUnits = 12; // Доза длинного инсулина (базы)
  if (!Array.isArray(p.iobLog)) p.iobLog = [];
  if (!p.sectionsOpen) p.sectionsOpen = { p1: true, p2: true, p3: true, ins: true, day: true, meal: true };
  return p;
}

function saveStorage() {
  try { localStorage.setItem('diaingo_v12', JSON.stringify(appData)); } catch (e) {}
}

function loadStorage() {
  try {
    const raw = localStorage.getItem('diaingo_v12') || localStorage.getItem('nutriingo_v11') || localStorage.getItem('nutriingo_v10');
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && parsed.profiles) appData = parsed;
    }
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

// Научно логичное округление дозы с учетом шага ручки (0.5 или 1 ЕД)
function roundDose(units, step) {
  if (!units || units <= 0) return 0;
  const s = step === 1 ? 1 : 0.5;
  // Медицинское округление: при диабете дозы обычно округляются математически к ближайшему шагу ручки
  return +(Math.round(units / s) * s).toFixed(1);
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
        const leftMin = Math.round(totalMin - elapsedMin);
        activeRecords.push({
          ...item,
          remUnits: +remUnits.toFixed(1),
          leftText: leftMin >= 60 ? `${Math.floor(leftMin / 60)}ч ${leftMin % 60}м` : `${leftMin} мин`
        });
      }
    }
  });

  return { totalIob: +totalIob.toFixed(1), activeRecords, diaHours: ins.diaHours };
}

function logInsulinInjection(units) {
  const u = parseFloat(units);
  if (!u || u <= 0) return;
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

function computeDailyInsulinPlan(m, p) {
  const ins = INSULIN_TYPES.find(x => x.id === p.insulinType) || INSULIN_TYPES[1];
  const dayXE = +(m.normC / 12).toFixed(1);
  const dayFpKcal = Math.round(m.normP * 4 + m.normF * 9);
  const dayBJE = +(dayFpKcal / 100).toFixed(1);

  const splits = [
    { slot: 'morning', name: '🌅 Завтрак (30%)', share: 0.30, icrMult: 1.15 },
    { slot: 'lunch',   name: '☀️ Обед (35%)',    share: 0.35, icrMult: 1.00 },
    { slot: 'evening', name: '🌙 Ужин (25%)',    share: 0.25, icrMult: 0.90 },
    { slot: 'night',   name: '🍏 Перекус (10%)', share: 0.10, icrMult: 0.95 }
  ].map(s => {
    const cG = Math.round(m.normC * s.share);
    const pG = Math.round(m.normP * s.share);
    const fG = Math.round(m.normF * s.share);
    const xe = +(cG / 12).toFixed(1);
    const bje = +((pG * 4 + fG * 9) / 100).toFixed(1);
    const effIcr = +(p.icr * s.icrMult).toFixed(2);
    const preU = roundDose(xe * effIcr, p.penStep);
    const postU = (!ins.coversBJE && bje >= 1.0) ? roundDose(bje * effIcr * 0.5, p.penStep) : 0;
    const totU = +(preU + postU).toFixed(1);
    return { ...s, cG, pG, fG, xe, bje, effIcr, preU, postU, totU };
  });

  const dayCarbBolus = +(splits.reduce((acc, s) => acc + s.preU, 0)).toFixed(1);
  const dayBjeBolus = +(splits.reduce((acc, s) => acc + s.postU, 0)).toFixed(1);
  const totalBolusDay = +(dayCarbBolus + dayBjeBolus).toFixed(1);
  const estBasal = p.basalUnits || +(Math.max(p.weight * 0.22, totalBolusDay * 0.82)).toFixed(1);
  const totalDailyDose = +(totalBolusDay + estBasal).toFixed(1); // TDD = Суточный болюс + База

  const autoIsf = +(ins.isfRule / Math.max(10, totalDailyDose)).toFixed(1);
  const effectiveIsf = (p.customIsf && p.customIsf > 0) ? +p.customIsf.toFixed(1) : autoIsf;

  if (!mealBolus.initialized || !mealBolus.customEdited) {
    const activeSlot = typeof mealTimeSlot !== 'undefined' ? mealTimeSlot : 'lunch';
    const found = splits.find(x => x.slot === activeSlot) || splits[1];
    mealBolus.p = found.pG;
    mealBolus.f = found.fG;
    mealBolus.c = found.cG;
    mealBolus.initialized = true;
  }

  return { ins, dayXE, dayBJE, dayCarbBolus, dayBjeBolus, totalBolusDay, estBasal, totalDailyDose, autoIsf, effectiveIsf, splits };
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

  const weightBasedMin = Math.round(p.weight * (p.diabetesType !== 'none' ? 23.0 : 20.5));
  let bmrBasedMin = p.gender === 'female' ? Math.round(curr.bmr * 0.88) : Math.round(curr.bmr * 0.90);
  if (p.diabetesType !== 'none') {
    bmrBasedMin = Math.max(bmrBasedMin, Math.round(curr.tdee * 0.76));
  }
  let minSafe = Math.max(weightBasedMin, bmrBasedMin);
  minSafe = p.diabetesType === 'none' ? Math.max(1200, minSafe) : Math.max(1400, minSafe);

  const effectiveKcal = Math.max(minSafe, targetKcal);

  const estBf = p.useBodyFat ? p.bodyFat : (p.gender === 'female' ? 24 : 18);
  const lbmWeight = +(p.weight * (1 - estBf / 100)).toFixed(1);
  let refWeight = p.targetWeight, refLabel = 'желаемого веса';
  if (p.macroBase === 'current') { refWeight = p.weight; refLabel = 'текущего веса'; }
  else if (p.macroBase === 'lbm') { refWeight = lbmWeight; refLabel = 'сухой массы'; }

  let normP = Math.round(refWeight * p.protGkg);
  let normF = Math.round(refWeight * p.fatGkg);

  const maxProtG = Math.round((effectiveKcal * 0.42) / 4);
  if (normP > maxProtG) normP = maxProtG;
  const minFatG = Math.round(refWeight * 0.65);
  if (normF < minFatG) normF = minFatG;

  let minCarbG = 40;
  let maxCarbG = 400;

  if (p.dietType === 'keto') {
    if (p.diabetesType === 'dm1') {
      minCarbG = 80;
      maxCarbG = 110;
    } else {
      minCarbG = 20;
      maxCarbG = 35;
    }
  } else if (p.dietType === 'lowcarb') {
    if (p.diabetesType === 'dm1') {
      minCarbG = 90;
      maxCarbG = 120;
    } else if (p.diabetesType === 'dm2') {
      minCarbG = 60;
      maxCarbG = 95;
    } else {
      minCarbG = 50;
      maxCarbG = 105;
    }
  } else if (p.dietType === 'highprot') {
    if (p.diabetesType === 'dm2') {
      minCarbG = 75;
      maxCarbG = Math.min(125, Math.round((effectiveKcal * 0.30) / 4));
    } else if (p.diabetesType === 'dm1') {
      minCarbG = 110;
      maxCarbG = Math.min(155, Math.round((effectiveKcal * 0.38) / 4));
    } else {
      minCarbG = 80;
      maxCarbG = Math.round((effectiveKcal * 0.45) / 4);
    }
  } else {
    if (p.diabetesType === 'dm2') {
      minCarbG = 85;
      maxCarbG = Math.min(135, Math.round((effectiveKcal * 0.33) / 4));
    } else if (p.diabetesType === 'dm1') {
      minCarbG = 120;
      maxCarbG = Math.min(175, Math.round((effectiveKcal * 0.42) / 4));
    } else {
      minCarbG = 100;
      maxCarbG = Math.round((effectiveKcal * 0.55) / 4);
    }
  }

  if (maxCarbG < minCarbG) maxCarbG = minCarbG;

  let rawRemC = Math.round((effectiveKcal - normP * 4 - normF * 9) / 4);
  let normC = Math.max(minCarbG, Math.min(maxCarbG, rawRemC));

  let remForFatKcal = effectiveKcal - normP * 4 - normC * 4;
  if (remForFatKcal < minFatG * 9) {
    normF = minFatG;
    const minProtG = Math.round(refWeight * 1.35);
    const neededProtKcal = effectiveKcal - normF * 9 - normC * 4;
    normP = Math.max(minProtG, Math.round(neededProtKcal / 4));
    normC = Math.max(20, Math.round((effectiveKcal - normP * 4 - normF * 9) / 4));
  } else {
    normF = Math.round(remForFatKcal / 9);
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
  const bg = parseFloat(String(currBgVal).replace(',', '.')) || 3.2;
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
    alert('⚠️ При СД 1 типа строгое Кето не рекомендуется. Выбран безопасный низкоуглеводный режим (Low-Carb).');
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
  } else if (['weight', 'bodyFat', 'neatLevel', 'targetWeight', 'presetDelta', 'protGkg', 'fatGkg', 'icr', 'targetBg', 'customIsf', 'basalUnits', 'penStep'].includes(key)) {
    p[key] = Math.max(0, parseFloat(cleanVal) || 0);
  } else {
    p[key] = val;
  }
  if (key === 'icr' && p.icr < 0.1) p.icr = 0.1;
  if (key === 'targetBg') p.targetBg = Math.max(4.2, Math.min(9.0, p.targetBg));
  if (key === 'age' && p.age < 10) p.age = 10;
  if (key === 'height' && p.height < 100) p.height = 100;
  if (key === 'weight' && p.weight < 30) p.weight = 30;
  if (key === 'targetWeight' && p.targetWeight < 30) p.targetWeight = 30;
  if (key === 'targetWeeks' && p.targetWeeks < 1) p.targetWeeks = 1;

  mealBolus.customEdited = false;
  saveStorage();
  renderApp();
}

function setMealBolus(k, v) {
  if (k === 'gi') {
    mealBolus.gi = v;
  } else if (k === 'currBg') {
    const clean = String(v).replace(',', '.').trim();
    mealBolus.currBg = clean === '' ? '' : Math.max(1.5, Math.min(35, parseFloat(clean) || 0));
  } else {
    const cleanVal = String(v).replace(',', '.');
    mealBolus[k] = Math.max(0, Math.round(parseFloat(cleanVal) || 0));
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
    if (pMatch) mealBolus.p = Math.round(parseFloat(pMatch[1]));
    if (fMatch) mealBolus.f = Math.round(parseFloat(fMatch[1]));
    if (cMatch) mealBolus.c = Math.round(parseFloat(cMatch[1]));
    mealBolus.customEdited = true;
    renderApp();
    return true;
  }

  const nums = txt.match(/\d+(?:\.\d+)?/g);
  if (nums && nums.length >= 3) {
    mealBolus.p = Math.round(parseFloat(nums[0]));
    mealBolus.f = Math.round(parseFloat(nums[1]));
    mealBolus.c = Math.round(parseFloat(nums[2]));
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
