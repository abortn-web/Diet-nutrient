const WEIGHT_GRID = [45, 50, 55, 60, 65, 70, 75, 80, 85, 90, 95, 100, 105, 110, 115, 120];
const HEIGHT_GRID = [150, 155, 160, 165, 169, 172, 175, 178, 180, 185, 190, 195];
const AGE_GRID = [20, 25, 28, 30, 32, 35, 38, 40, 45, 50];
const STEPS_GRID = [2000, 4000, 6000, 8000, 10000, 12000, 14000, 16000, 18000, 20000];
const WEEKS_GRID = [4, 6, 8, 10, 12, 14, 16, 20, 24, 30, 36, 52];
const PROT_GRID = [1.4, 1.6, 1.8, 2.0, 2.2, 2.5];
const FAT_GRID = [0.7, 0.8, 0.9, 1.0, 1.2, 1.5];
const ICR_GRID = [0.5, 0.8, 1.0, 1.2, 1.5, 1.8, 2.0, 2.5];

function renderApp() {
  const p = getProf(), m = computeMetrics(), foods = getAllFoods();
  document.documentElement.setAttribute('data-gender', p.gender);
  const mealNames = { breakfast: '🌅 Завтрак', lunch: '☀️ Обед', dinner: '🌙 Ужин', snack: '🍏 Перекус' };
  let totKcal = 0, totP = 0, totF = 0, totC = 0, totGrams = 0, totalItems = 0, mealSummaries = {};
  ['breakfast','lunch','dinner','snack'].forEach(mk => {
    let mkcal = 0, mp = 0, mf = 0, mc = 0, mg = 0;
    (p.diary[mk] || []).forEach(it => {
      const f = foods.find(x => x.id === it.foodId); if (!f) return;
      totalItems++; const mult = getItemEffectiveGrams(it, f) / 100;
      mkcal += f.kcal * mult; mp += f.p * mult; mf += f.f * mult; mc += f.c * mult; mg += it.grams;
    });
    mkcal = Math.round(mkcal); totKcal += mkcal; totP += mp; totF += mf; totC += mc; totGrams += mg;
    mealSummaries[mk] = { kcal: mkcal, p: Math.round(mp), f: Math.round(mf), c: Math.round(mc), xe: +(mc/12).toFixed(1), g: mg };
  });
  totP = Math.round(totP); totF = Math.round(totF); totC = Math.round(totC);
  const eatenXE = +(totC / 12).toFixed(1);
  const curM = mealSummaries[activeMeal];
  const bP = customBolusMeal.useCustom ? customBolusMeal.p : curM.p;
  const bF = customBolusMeal.useCustom ? customBolusMeal.f : curM.f;
  const bC = customBolusMeal.useCustom ? customBolusMeal.c : curM.c;
  const bKcal = Math.round(bP * 4 + bF * 9 + bC * 4);
  const bolus = computeBolusForMeal(bP, bF, bC, p);

  const diffKg = +(p.targetWeight - p.weight).toFixed(1), totalDays = p.targetWeeks * 7;
  const checkpoints = [0, 0.25, 0.5, 0.75, 1].map((pct, i) => {
    const w = +(p.weight + diffKg * pct).toFixed(1);
    return { label: i===0?'Старт':i===2?'Экватор':i===4?'Финиш':(pct*100)+'%', w, date: formatDateOffset(totalDays * pct), tdee: calcTDEEForWeight(w, p).tdee };
  });
  const extra3kKcal = Math.round(((p.height * 0.415) / 100000) * 3000 * p.weight * 0.62);
  const recProt = p.diabetesType !== 'none' ? 1.7 : (p.gender === 'female' ? 1.8 : 2.0);
  const recFat = p.gender === 'female' ? 0.95 : 0.9;
  const isTooStrict = m.targetKcal < m.minSafe, safeWeeks = Math.max(4, Math.ceil(Math.abs(diffKg * 7700) / (Math.max(300, m.tdee - m.minSafe) * 7)));
  const cats = ['Все', ...new Set(foods.map(f => f.cat))];
  const filteredFoods = foods.filter(f => (activeCategory === 'Все' || f.cat === activeCategory) && f.name.toLowerCase().includes(searchQuery.toLowerCase()));
  const hasSavedKey = !!(localStorage.getItem('nutricalc_gemini_key') || '').trim();

  document.getElementById('app').innerHTML = `
    <header class="sticky top-0 z-30 glass-card border-b px-3 py-2.5"><div class="max-w-7xl mx-auto flex items-center justify-between gap-2">
      <div class="flex items-center gap-2.5"><div class="w-9 h-9 rounded-xl theme-grad flex items-center justify-center text-white text-base shadow">🌿</div><span class="font-extrabold text-base sm:text-lg tracking-tight leading-none">NUTRIingo</span></div>
      <div class="flex items-center gap-1 p-1 rounded-xl theme-input"><button onclick="switchProfile('p1')" class="px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap ${appData.activeProfile==='p1'?'theme-grad text-white shadow':'opacity-75'}">♂ Профиль 1</button><button onclick="switchProfile('p2')" class="px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap ${appData.activeProfile==='p2'?'theme-grad text-white shadow':'opacity-75'}">♀ Профиль 2</button></div>
    </div></header>

    <div class="max-w-7xl mx-auto px-3 pt-3 lg:hidden"><div class="grid grid-cols-2 gap-2 p-1 rounded-2xl glass-card">
      <button onclick="activeTab='calc';renderApp();" class="py-2 rounded-xl text-xs font-bold ${activeTab==='calc'?'theme-grad text-white shadow':'opacity-75'}">⚙️ Параметры и План</button>
      <button onclick="activeTab='diary';renderApp();" class="py-2 rounded-xl text-xs font-bold ${activeTab==='diary'?'theme-grad text-white shadow':'opacity-75'}">🍽 Дневник и Болюс (${totalItems})</button>
    </div></div>

    <main class="max-w-7xl mx-auto px-3 pt-4 pb-20 grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
      <section class="lg:col-span-5 space-y-4 ${activeTab==='diary'?'hidden lg:block':''}">
        <div class="glass-card rounded-3xl p-4 space-y-3.5 shadow-lg">
          <div class="flex justify-between items-center"><h2 class="font-extrabold text-base">1. Ваши параметры</h2><span class="text-[11px] px-2 py-0.5 rounded-lg theme-soft font-semibold">${p.useBodyFat?'Кетч-МакАрдл':'Миффлин-Сан Жеор'}</span></div>
          <div class="grid grid-cols-2 gap-2"><button onclick="setParam('gender','female')" class="py-2.5 px-3 rounded-2xl text-xs font-bold border ${p.gender==='female'?'theme-grad text-white border-transparent shadow-md':'theme-input opacity-80'}">♀ Женщина</button><button onclick="setParam('gender','male')" class="py-2.5 px-3 rounded-2xl text-xs font-bold border ${p.gender==='male'?'theme-grad text-white border-transparent shadow-md':'theme-input opacity-80'}">♂ Мужчина</button></div>

          <div class="p-3 rounded-2xl theme-input space-y-2">
            <div class="flex justify-between items-center"><span class="text-xs font-bold opacity-80">ВОЗРАСТ (ЛЕТ)</span><div class="flex items-center gap-1"><button onclick="setParam('age',${p.age-1})" class="w-7 h-7 rounded-lg theme-soft font-bold">-</button><input type="number" value="${p.age}" onchange="setParam('age',this.value)" class="w-14 text-center font-mono-num font-bold text-sm rounded-lg py-0.5 theme-soft"><button onclick="setParam('age',${p.age+1})" class="w-7 h-7 rounded-lg theme-soft font-bold">+</button></div></div>
            <div class="grid grid-cols-5 gap-1">${AGE_GRID.map(a=>`<button onclick="setParam('age',${a})" class="py-1 rounded-lg text-[11px] font-mono-num font-bold ${p.age===a?'theme-grad text-white':'theme-soft'}">${a}</button>`).join('')}</div>
          </div>

          <div class="p-3 rounded-2xl theme-input space-y-2">
            <div class="flex justify-between items-center"><span class="text-xs font-bold opacity-80">РОСТ (СМ)</span><div class="flex items-center gap-1"><button onclick="setParam('height',${p.height-1})" class="w-7 h-7 rounded-lg theme-soft font-bold">-</button><input type="number" value="${p.height}" onchange="setParam('height',this.value)" class="w-16 text-center font-mono-num font-bold text-sm rounded-lg py-0.5 theme-soft"><button onclick="setParam('height',${p.height+1})" class="w-7 h-7 rounded-lg theme-soft font-bold">+</button></div></div>
            <div class="grid grid-cols-6 gap-1">${HEIGHT_GRID.map(h=>`<button onclick="setParam('height',${h})" class="py-1 rounded-lg text-[11px] font-mono-num font-bold ${p.height===h?'theme-grad text-white':'theme-soft'}">${h}</button>`).join('')}</div>
          </div>

          <div class="p-3 rounded-2xl theme-input space-y-2">
            <div class="flex justify-between items-center"><span class="text-xs font-bold opacity-80">ТЕКУЩИЙ ВЕС (КГ)</span><div class="flex items-center gap-1"><button onclick="setParam('weight',${+(p.weight-0.5).toFixed(1)})" class="w-7 h-7 rounded-lg theme-soft font-bold">-</button><input type="number" value="${p.weight}" step="0.5" onchange="setParam('weight',this.value)" class="w-16 text-center font-mono-num font-bold text-sm rounded-lg py-0.5 theme-soft"><button onclick="setParam('weight',${+(p.weight+0.5).toFixed(1)})" class="w-7 h-7 rounded-lg theme-soft font-bold">+</button></div></div>
            <div class="grid grid-cols-8 gap-1">${WEIGHT_GRID.map(w=>`<button onclick="setParam('weight',${w})" class="py-1 rounded-lg text-[10px] font-mono-num font-bold ${p.weight===w?'theme-grad text-white':'theme-soft'}">${w}</button>`).join('')}</div>
          </div>

          <div class="p-3 rounded-2xl theme-input space-y-2">
            <div class="flex items-center justify-between">
              <label class="flex items-center cursor-pointer text-xs font-bold"><input type="checkbox" ${p.useBodyFat?'checked':''} onchange="setParam('useBodyFat',this.checked)" class="w-4 h-4 mr-2">Учитывать % жира</label>
              ${p.useBodyFat?`<div class="flex items-center gap-1"><span class="text-[10px] opacity-75">Сухая:${m.lbmWeight}кг</span><input type="number" value="${p.bodyFat}" step="0.5" onchange="setParam('bodyFat',this.value)" class="w-14 text-center font-mono-num font-bold text-sm rounded-lg py-0.5 theme-soft"><span class="text-xs font-bold">%</span></div>`:''}
            </div>
            ${p.useBodyFat?`<div class="grid grid-cols-6 gap-1">${[10,12,15,18,20,22,25,28,30,32,35,40].map(bf=>`<button onclick="setParam('bodyFat',${bf})" class="py-1 rounded-lg text-[10px] font-mono-num font-bold ${p.bodyFat===bf?'theme-grad text-white':'theme-soft'}">${bf}%</button>`).join('')}</div>`:''}
          </div>

          <div class="p-3 rounded-2xl theme-input space-y-2">
            <div class="flex justify-between items-center"><span class="text-xs font-bold">🩺 Учет сахарного диабета (ADA / Минздрав РФ):</span></div>
            <div class="grid grid-cols-3 gap-1.5">
              <button onclick="setDiabetesType('none')" class="py-2 px-1 rounded-xl text-[11px] font-bold ${p.diabetesType==='none'?'theme-grad text-white shadow':'theme-soft'}">Нет (Стандарт)</button>
              <button onclick="setDiabetesType('dm1')" class="py-2 px-1 rounded-xl text-[11px] font-bold ${p.diabetesType==='dm1'?'theme-grad text-white shadow':'theme-soft'}">СД 1 типа (ХЕ)</button>
              <button onclick="setDiabetesType('dm2')" class="py-2 px-1 rounded-xl text-[11px] font-bold ${p.diabetesType==='dm2'?'theme-grad text-white shadow':'theme-soft'}">СД 2 типа / ИР</button>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-2.5"><div class="p-3 rounded-2xl theme-soft"><div class="text-[11px] opacity-80">ИМТ (${m.bmi<25?'Норма':'Выше нормы'})</div><div class="text-xl font-extrabold font-mono-num">${m.bmi}</div></div><div class="p-3 rounded-2xl theme-soft"><div class="text-[11px] opacity-80">Базовый обмен (BMR) 🔥</div><div class="text-xl font-extrabold font-mono-num">${m.bmr} ккал</div></div></div>
        </div>

        <div class="glass-card rounded-3xl p-4 space-y-3.5 shadow-lg">
          <div class="flex justify-between items-center"><h2 class="font-extrabold text-base">2. Активность: Шаги + Тренировки</h2><span class="text-xs font-mono-num font-extrabold px-2 py-0.5 rounded-lg theme-soft">TDEE: ${m.tdee} ккал</span></div>
          <div class="grid grid-cols-3 gap-1.5"><button onclick="setParam('neatLevel',0.12)" class="p-2 rounded-xl text-left text-xs ${p.neatLevel===0.12?'theme-grad text-white font-bold':'theme-input'}"><div>Сидячий</div><div class="text-[10px] opacity-75">+12%</div></button><button onclick="setParam('neatLevel',0.18)" class="p-2 rounded-xl text-left text-xs ${p.neatLevel===0.18?'theme-grad text-white font-bold':'theme-input'}"><div>Умеренный</div><div class="text-[10px] opacity-75">+18%</div></button><button onclick="setParam('neatLevel',0.25)" class="p-2 rounded-xl text-left text-xs ${p.neatLevel===0.25?'theme-grad text-white font-bold':'theme-input'}"><div>Активный</div><div class="text-[10px] opacity-75">+25%</div></button></div>
          <div class="p-3 rounded-2xl theme-input space-y-2">
            <div class="flex justify-between items-center"><div><div class="text-xs font-bold">👣 Шагов в день</div><div class="text-[11px] opacity-75">~${m.distKm.toFixed(1)} км · +${m.stepsKcal} ккал</div></div><input type="number" value="${p.steps}" step="500" onchange="setParam('steps',this.value)" class="w-20 text-right font-mono-num font-bold text-sm rounded-lg px-2 py-0.5 theme-soft"></div>
            <div class="grid grid-cols-5 gap-1">${STEPS_GRID.map(st=>`<button onclick="setParam('steps',${st})" class="py-1 rounded-lg text-[10px] font-mono-num font-bold ${p.steps===st?'theme-grad text-white':'theme-soft'}">${st}</button>`).join('')}</div>
          </div>
          <div class="p-3 rounded-2xl theme-input space-y-2.5">
            <div class="flex justify-between items-center text-xs font-bold"><span>🏋️ Тренировки</span><span class="font-mono-num">+${m.workoutKcal} ккал/дн</span></div>
            <div><div class="text-[10px] opacity-75 mb-1">Тренировок в неделю:</div><div class="grid grid-cols-8 gap-1">${[0,1,2,3,4,5,6,7].map(d=>`<button onclick="setParam('workoutDays',${d})" class="py-1.5 rounded-lg text-xs font-mono-num font-bold ${p.workoutDays===d?'theme-grad text-white shadow':'theme-soft'}">${d}</button>`).join('')}</div></div>
            <div><div class="text-[10px] opacity-75 mb-1">Длительность (минут):</div><div class="grid grid-cols-6 gap-1">${[30,45,60,75,90,120].map(mn=>`<button onclick="setParam('workoutMins',${mn})" class="py-1.5 rounded-lg text-xs font-mono-num font-bold ${p.workoutMins===mn?'theme-grad text-white shadow':'theme-soft'}">${mn}</button>`).join('')}</div></div>
            <div class="grid grid-cols-2 gap-1.5 pt-1"><button onclick="setParam('workoutMode','avg')" class="py-1.5 rounded-xl text-[11px] font-bold ${p.workoutMode==='avg'?'theme-grad text-white shadow':'theme-soft'}">Среднесуточно (/7)</button><button onclick="setParam('workoutMode','today')" class="py-1.5 rounded-xl text-[11px] font-bold ${p.workoutMode==='today'?'theme-grad text-white shadow':'theme-soft'}">Тренировка сегодня</button></div>
          </div>
        </div>
                <div class="glass-card rounded-3xl p-4 space-y-3.5 shadow-lg">
          <h2 class="font-extrabold text-base">3. Цель, Контрольные точки и БЖУ</h2>
          <div class="p-3 rounded-2xl theme-input space-y-2">
            <div class="flex justify-between items-center"><span class="text-xs font-bold">🎯 Желаемый вес (кг)</span>
              <div class="flex items-center gap-1">
                <button onclick="setParam('targetWeight',${+(p.targetWeight-0.5).toFixed(1)})" class="w-7 h-7 rounded-lg theme-soft font-bold">-</button>
                <input type="number" value="${p.targetWeight}" step="0.5" onchange="setParam('targetWeight',this.value)" class="w-16 text-center font-mono-num font-bold text-sm rounded-lg py-0.5 theme-soft">
                <button onclick="setParam('targetWeight',${+(p.targetWeight+0.5).toFixed(1)})" class="w-7 h-7 rounded-lg theme-soft font-bold">+</button>
              </div>
            </div>
            <div class="grid grid-cols-8 gap-1">${WEIGHT_GRID.map(w=>`<button onclick="setParam('targetWeight',${w})" class="py-1 rounded-lg text-[10px] font-mono-num font-bold ${p.targetWeight===w?'theme-grad text-white':'theme-soft'}">${w}</button>`).join('')}</div>
          </div>

          <div class="p-3 rounded-2xl theme-input space-y-2">
            <div class="flex justify-between items-center text-xs font-bold">
              <span>📅 Срок (нед): ${totalDays} дн.</span>
              <div class="flex items-center gap-1.5">
                <span class="font-mono-num">${m.dailyDelta>0?'+':''}${m.dailyDelta} ккал/дн</span>
                <input type="number" value="${p.targetWeeks}" min="1" max="104" onchange="setParam('targetWeeks',this.value)" class="w-14 text-center font-mono-num font-bold text-sm rounded-lg py-0.5 theme-soft">
              </div>
            </div>
            <div class="grid grid-cols-6 gap-1">${WEEKS_GRID.map(wk=>`<button onclick="setParam('targetWeeks',${wk})" class="py-1 rounded-lg text-[10px] font-mono-num font-bold ${p.targetWeeks===wk?'theme-grad text-white':'theme-soft'}">${wk}н</button>`).join('')}</div>
          </div>

          ${p.diabetesType!=='none'?`
            <div class="p-3.5 rounded-2xl border-2 space-y-2 text-xs" style="border-color:var(--brand);background:var(--brand-soft);">
              <div class="font-extrabold flex items-center justify-between">
                <span>🩺 Протокол ${p.diabetesType==='dm1'?'СД 1 типа (ХЕ + БЖЕ)':'СД 2 типа (Снижение ИР)'}</span>
                <span class="px-2 py-0.5 rounded-md theme-grad text-white font-mono-num">${m.totalXE} ХЕ/сут</span>
              </div>
              <div class="text-[11px] opacity-90 leading-relaxed">
                ${p.diabetesType==='dm1'
                  ? `• Стандарт ADA/ISPAD: Углеводы <strong>${m.normC} г (${m.totalXE} ХЕ)</strong> для защиты от кетоацидоза. На вкладке «Дневник» включен Болюс-калькулятор.`
                  : `• Стандарт ADA/Минздрав: Углеводы до <strong>${m.normC} г/сут (${m.totalXE} ХЕ)</strong> с низким ГИ. На 1 прием: до <strong>${m.maxMealCarbs} г (${m.maxMealXE} ХЕ)</strong>. Клетчатка: <strong>${m.fiberNorm} г/сут</strong>.`}
              </div>
            </div>
          `:''}

          <div class="p-3 rounded-2xl theme-soft space-y-2 text-xs">
            ${isTooStrict
              ? `<div class="p-2 rounded-xl bg-amber-500/20 border border-amber-400 text-[11px]">⚠️ Жесткий темп! Порог безопасности: <strong>${m.minSafe} ккал</strong>. <button onclick="setParam('targetWeeks',${safeWeeks})" class="underline font-bold">Поставить ${safeWeeks} нед.</button></div>`
              : `<div class="text-[11px]">✅ Темп: ${m.weeklyKg} кг/нед. ИМТ: ${m.bmi} → ${m.targetBmi}. Клетчатка: от ${m.fiberNorm} г/сут.</div>`}
            <div class="grid grid-cols-2 gap-1.5">
              <button onclick="setParam('steps',${p.steps+3000})" class="p-2 rounded-xl theme-input text-left"><div class="font-bold text-[11px]">👟 +3 000 шагов</div><div class="text-[10px] opacity-75">+${extra3kKcal} ккал к рациону</div></button>
              <button onclick="applySmartMacros(${recProt},${recFat})" class="p-2 rounded-xl theme-input text-left"><div class="font-bold text-[11px]">🥩 Смарт-БЖУ</div><div class="text-[10px] opacity-75">Б ${recProt} · Ж ${recFat} г/кг</div></button>
            </div>
            <div class="pt-1 border-t border-white/15">
              <div class="font-bold text-[11px] mb-1">🏁 Контрольные точки и адаптация TDEE:</div>
              <div class="grid grid-cols-5 gap-1 text-center font-mono-num">${checkpoints.map(cp=>`<div class="p-1 rounded-xl theme-input"><div class="text-[9px] opacity-70 font-sans">${cp.label}</div><div class="font-extrabold text-[11px]">${cp.w}кг</div><div class="text-[9px] opacity-75 font-sans">${cp.date}</div><div class="text-[8px] opacity-60">⚡${cp.tdee}</div></div>`).join('')}</div>
            </div>
          </div>

          <div class="space-y-1.5">
            <div class="text-xs font-bold">🥗 Тип питания под цель:</div>
            ${DIET_TYPES.map(dt=>`<button onclick="selectDietType('${dt.id}')" class="w-full p-2.5 rounded-xl text-left flex justify-between items-center ${p.dietType===dt.id?'theme-grad text-white shadow':'theme-input'}"><div><div class="text-xs font-bold">${dt.name}</div><div class="text-[10px] opacity-80">${dt.desc}</div></div><span class="text-[10px] font-mono-num font-bold px-2 py-0.5 rounded bg-black/20 text-white">${p.dietType===dt.id?`${m.realPpct}/${m.realFpct}/${m.realCpct}%`:`${dt.p}/${dt.f}/${dt.c}%`}</span></button>`).join('')}
          </div>

          <div class="p-3 rounded-2xl theme-input space-y-2.5 text-xs">
            <div class="text-[10px] opacity-80 font-bold">База расчета белка и жиров (г/кг):</div>
            <div class="grid grid-cols-3 gap-1">
              <button onclick="setParam('macroBase','target')" class="py-1.5 px-1 rounded-lg text-[10px] font-bold ${p.macroBase==='target'?'theme-grad text-white':'theme-soft'}">Желаемый (${p.targetWeight}кг)</button>
              <button onclick="setParam('macroBase','current')" class="py-1.5 px-1 rounded-lg text-[10px] font-bold ${p.macroBase==='current'?'theme-grad text-white':'theme-soft'}">Текущий (${p.weight}кг)</button>
              <button onclick="setParam('macroBase','lbm')" class="py-1.5 px-1 rounded-lg text-[10px] font-bold ${p.macroBase==='lbm'?'theme-grad text-white':'theme-soft'}">Сухая (${m.lbmWeight}кг)</button>
            </div>
            <div class="space-y-1">
              <div class="flex justify-between items-center"><span>Белки (от ${m.refLabel}) → <strong>${m.normP} г</strong></span><input type="number" value="${p.protGkg}" step="0.1" onchange="setParam('protGkg',this.value)" class="w-14 text-center font-mono-num font-bold rounded-lg py-0.5 theme-soft"></div>
              <div class="grid grid-cols-6 gap-1">${PROT_GRID.map(v=>`<button onclick="setParam('protGkg',${v})" class="py-1 rounded-lg text-[10px] font-mono-num font-bold ${p.protGkg===v?'theme-grad text-white':'theme-soft'}">${v}</button>`).join('')}</div>
            </div>
            <div class="space-y-1">
              <div class="flex justify-between items-center"><span>Жиры (от ${m.refLabel}) → <strong>${m.normF} г</strong></span><input type="number" value="${p.fatGkg}" step="0.05" onchange="setParam('fatGkg',this.value)" class="w-14 text-center font-mono-num font-bold rounded-lg py-0.5 theme-soft"></div>
              <div class="grid grid-cols-6 gap-1">${FAT_GRID.map(v=>`<button onclick="setParam('fatGkg',${v})" class="py-1 rounded-lg text-[10px] font-mono-num font-bold ${p.fatGkg===v?'theme-grad text-white':'theme-soft'}">${v}</button>`).join('')}</div>
            </div>
          </div>

          <div class="grid grid-cols-4 gap-2">
            <div class="p-2.5 rounded-2xl theme-grad text-white text-center"><div class="text-[10px]">НОРМА</div><div class="font-mono-num font-extrabold text-sm">${m.effectiveKcal}</div></div>
            <div class="p-2.5 rounded-2xl theme-soft text-center"><div class="text-[10px]">Белки</div><div class="font-mono-num font-extrabold text-sm">${m.normP}г</div></div>
            <div class="p-2.5 rounded-2xl theme-soft text-center"><div class="text-[10px]">Жиры</div><div class="font-mono-num font-extrabold text-sm">${m.normF}г</div></div>
            <div class="p-2.5 rounded-2xl theme-soft text-center"><div class="text-[10px]">Угл (${m.totalXE}ХЕ)</div><div class="font-mono-num font-extrabold text-sm">${m.normC}г</div></div>
          </div>
        </div>
      </section>
            <section class="lg:col-span-7 space-y-4 ${activeTab==='calc'?'hidden lg:block':''}">
        <div class="glass-card rounded-3xl p-4 space-y-3.5 shadow-lg">
          <div class="flex justify-between items-center">
            <h2 class="font-extrabold text-base">Конструктор рациона</h2>
            <div class="flex gap-1.5">
              <button onclick="openAiModal('dinner')" class="px-2.5 py-1 rounded-xl theme-grad text-white text-xs font-bold">🪄 Под остаток</button>
              <button onclick="resetDemoDiary()" class="px-2 py-1 rounded-xl theme-soft text-xs">🔄</button>
              <button onclick="clearDiary()" class="px-2 py-1 rounded-xl theme-soft text-xs">🗑</button>
            </div>
          </div>

          <div class="p-3 rounded-2xl theme-input space-y-2">
            <div class="flex justify-between items-baseline">
              <div><span class="text-2xl font-extrabold font-mono-num">${totKcal}</span><span class="text-xs opacity-70 font-mono-num"> / ${m.effectiveKcal} ккал</span></div>
              <span class="text-xs font-bold px-2 py-0.5 rounded-full theme-soft">${m.effectiveKcal-totKcal>=0?`Остаток: ${m.effectiveKcal-totKcal} ккал`:`Перебор: +${Math.abs(m.effectiveKcal-totKcal)} ккал`}</span>
            </div>
            <div class="w-full h-3 rounded-full bg-black/20 overflow-hidden"><div class="h-full theme-grad" style="width:${Math.min(100,Math.round((totKcal/m.effectiveKcal)*100))}%"></div></div>
            <div class="grid grid-cols-3 gap-2 pt-1 text-center font-mono-num text-xs">
              <div class="p-1.5 rounded-xl theme-soft">Б: <strong>${totP}</strong>/${m.normP}г</div>
              <div class="p-1.5 rounded-xl theme-soft">Ж: <strong>${totF}</strong>/${m.normF}г</div>
              <div class="p-1.5 rounded-xl theme-soft">У: <strong>${totC}</strong>/${m.normC}г (${eatenXE}ХЕ)</div>
            </div>
          </div>

          <div class="grid grid-cols-4 gap-1.5">
            ${['breakfast','lunch','dinner','snack'].map(mk=>`<button onclick="activeMeal='${mk}';renderApp();" class="py-2 px-1 rounded-xl text-xs font-bold ${activeMeal===mk?'theme-grad text-white shadow':'theme-input'}"><div>${mealNames[mk]}</div><div class="text-[10px] font-mono-num opacity-80">${mealSummaries[mk].kcal} ккал · ${mealSummaries[mk].xe}ХЕ</div></button>`).join('')}
          </div>

          <div class="p-3.5 rounded-2xl border-2 space-y-2.5 text-xs" style="border-color:var(--brand);background:var(--brand-soft);">
            <div class="flex flex-wrap items-center justify-between gap-1">
              <div class="font-extrabold text-sm">💉 Болюс-калькулятор (${customBolusMeal.useCustom?'Ручной ввод':mealNames[activeMeal]})</div>
              <button onclick="setCustomBolusMacro('useCustom',!customBolusMeal.useCustom)" class="px-2 py-0.5 rounded-lg theme-input text-[10px] font-bold">${customBolusMeal.useCustom?'📋 Из дневника':'✏️ Ввести БЖУ'}</button>
            </div>

            ${customBolusMeal.useCustom?`
              <div class="grid grid-cols-3 gap-1.5 p-2 rounded-xl theme-input">
                <div><div class="text-[10px] opacity-75">Белки (г)</div><input type="number" value="${customBolusMeal.p}" onchange="setCustomBolusMacro('p',this.value)" class="w-full text-center font-mono-num font-bold rounded-lg py-1 theme-soft"></div>
                <div><div class="text-[10px] opacity-75">Жиры (г)</div><input type="number" value="${customBolusMeal.f}" onchange="setCustomBolusMacro('f',this.value)" class="w-full text-center font-mono-num font-bold rounded-lg py-1 theme-soft"></div>
                <div><div class="text-[10px] opacity-75">Углеводы (г)</div><input type="number" value="${customBolusMeal.c}" onchange="setCustomBolusMacro('c',this.value)" class="w-full text-center font-mono-num font-bold rounded-lg py-1 theme-soft"></div>
              </div>
            `:''}

            <div class="space-y-1.5">
              <div class="text-[10px] font-bold opacity-85">1. Тип болюсного инсулина:</div>
              <div class="grid grid-cols-3 gap-1">${INSULIN_TYPES.map(ins=>`<button onclick="setParam('insulinType','${ins.id}')" class="p-1.5 rounded-xl text-left ${p.insulinType===ins.id?'theme-grad text-white shadow':'theme-input'}"><div class="text-[11px] font-bold">${ins.name}</div><div class="text-[9px] opacity-80 truncate">${ins.brands}</div></button>`).join('')}</div>
            </div>

            <div class="space-y-1">
              <div class="flex justify-between items-center"><span class="text-[10px] font-bold opacity-85">2. Ваш индекс УК (ЕД на 1 ХЕ = 12г угл.):</span><input type="number" value="${p.icr}" step="0.1" onchange="setParam('icr',this.value)" class="w-14 text-center font-mono-num font-bold rounded-lg py-0.5 theme-input"></div>
              <div class="grid grid-cols-8 gap-1">${ICR_GRID.map(v=>`<button onclick="setParam('icr',${v})" class="py-1 rounded-lg text-[10px] font-mono-num font-bold ${p.icr===v?'theme-grad text-white':'theme-input'}">${v}</button>`).join('')}</div>
            </div>

            <div class="grid grid-cols-2 gap-2 pt-1">
              <div class="p-2.5 rounded-xl theme-input">
                <div class="text-[10px] opacity-75">ПЕРЕД ЕДОЙ (${bolus.ins.preMin})</div>
                <div class="text-lg font-extrabold font-mono-num">${bolus.preUnits} ЕД</div>
                <div class="text-[10px] opacity-80">На углеводы: ${bolus.xe} ХЕ (${bC}г)</div>
              </div>
              <div class="p-2.5 rounded-xl theme-input">
                <div class="text-[10px] opacity-75">ПОСЛЕ ЕДЫ (${bolus.ins.postTiming})</div>
                <div class="text-lg font-extrabold font-mono-num">${bolus.splitWaves?`${bolus.postUnits} ЕД`:'0 ЕД'}</div>
                <div class="text-[10px] opacity-80">На БЖЕ: ${bolus.bje} БЖЕ (${bolus.fpKcal} ккал)${bolus.waveHours?` · ~${bolus.waveHours}ч`:''}</div>
              </div>
            </div>
            <div class="text-[10px] opacity-75 leading-tight">ℹ️ Всего на прием (${bKcal} ккал): <strong>${bolus.totalUnits} ЕД</strong> (ХЕ + Варшавский метод БЖЕ ISPAD). Справочный расчет.</div>
          </div>

          <input type="text" value="${searchQuery}" oninput="searchQuery=this.value;renderCatalogOnly();" placeholder="🔍 Поиск продукта..." class="w-full px-3.5 py-2 rounded-2xl theme-input text-xs">
          <div id="catalog-box" class="max-h-48 overflow-y-auto divide-y divide-white/10 rounded-2xl theme-input px-3">
            ${filteredFoods.map(f=>`<div class="py-2 flex items-center justify-between gap-2 text-xs"><div><div class="font-bold">${f.name}</div><div class="text-[10px] opacity-70 font-mono-num">100г: ${f.kcal} ккал · Б ${f.p} · Ж ${f.f} · У ${f.c}</div></div><button onclick="addFoodToMeal('${f.id}')" class="px-2.5 py-1 rounded-xl theme-grad text-white font-bold text-xs">+ Добавить</button></div>`).join('')}
          </div>

          <div class="space-y-2">
            <div class="flex justify-between text-xs font-bold"><span>Состав: ${mealNames[activeMeal]} (${curM.xe} ХЕ)</span><span class="font-mono-num">${curM.kcal} ккал</span></div>
            ${(p.diary[activeMeal]||[]).map((it,idx)=>{
              const f=foods.find(x=>x.id===it.foodId)||{name:'Продукт',kcal:0,c:0};
              const rg=getItemEffectiveGrams(it,f);
              return `<div class="p-2.5 rounded-2xl theme-input flex items-center justify-between gap-2 text-xs"><div><div class="font-bold">${f.name} ${f.cookRatio?`<button onclick="toggleCooked(${idx})" class="px-1.5 py-0.5 rounded text-[10px] theme-soft">${it.isCooked?'🍳 Готовое':'🌾 Сырое'}</button>`:''}</div><div class="text-[10px] opacity-75 font-mono-num">${Math.round(f.kcal*(rg/100))} ккал · ${((f.c*(rg/100))/12).toFixed(1)} ХЕ</div></div><div class="flex items-center gap-1"><input type="number" value="${it.grams}" step="10" onchange="updateGrams(${idx},this.value)" class="w-16 text-right font-mono-num font-bold rounded-xl px-2 py-1 theme-soft"><span>г</span><button onclick="removeItem(${idx})" class="px-1.5 text-rose-400 font-bold">✕</button></div></div>`;
            }).join('')}
          </div>
        </div>

        <div class="glass-card rounded-3xl p-5 space-y-3 shadow-xl border-2" style="border-color:var(--brand);">
          <div class="flex justify-between items-center"><h3 class="text-base font-extrabold">Финальная калорийность рациона</h3><button onclick="copyFinalReport(${totKcal},${totP},${totF},${totC},${m.effectiveKcal},${m.tdee})" class="px-3 py-1.5 rounded-xl theme-grad text-white text-xs font-bold">📋 Скопировать</button></div>
          <div class="grid grid-cols-4 gap-2 font-mono-num text-center">
            <div class="p-2.5 rounded-2xl theme-soft"><div class="text-[10px] font-sans">Ккал</div><div class="text-lg font-extrabold">${totKcal}</div></div>
            <div class="p-2.5 rounded-2xl theme-soft"><div class="text-[10px] font-sans">Белки</div><div class="text-lg font-extrabold">${totP}г</div></div>
            <div class="p-2.5 rounded-2xl theme-soft"><div class="text-[10px] font-sans">Жиры</div><div class="text-lg font-extrabold">${totF}г</div></div>
            <div class="p-2.5 rounded-2xl theme-soft"><div class="text-[10px] font-sans">Угл (${eatenXE}ХЕ)</div><div class="text-lg font-extrabold">${totC}г</div></div>
          </div>
        </div>
      </section>
    </main>
        <div class="fixed bottom-0 left-0 right-0 z-40 glass-card border-t px-3 py-2 shadow-2xl">
      <div class="max-w-7xl mx-auto grid grid-cols-2 gap-2.5">
        <button onclick="openCustomFoodModal()" class="py-2.5 px-4 rounded-2xl theme-soft font-extrabold text-xs flex items-center justify-center gap-1.5 shadow">➕ Добавить своё блюдо</button>
        <button onclick="openAiModal()" class="py-2.5 px-4 rounded-2xl theme-grad text-white font-extrabold text-xs flex items-center justify-center gap-1.5 shadow-lg">✨ AI-Помощник и Подбор</button>
      </div>
    </div>

    <div id="modal-ai" class="fixed inset-0 z-50 hidden bg-black/75 backdrop-blur-sm flex items-center justify-center p-3">
      <div class="glass-card rounded-3xl max-w-lg w-full p-5 space-y-3">
        <div class="flex justify-between items-center">
          <h3 class="font-extrabold text-sm">✨ NUTRIingo AI (${hasSavedKey?'☁️ Gemini API':'⚡ Локальный без ключа'})</h3>
          <button onclick="document.getElementById('modal-ai').classList.add('hidden')" class="px-2.5 py-1 rounded-xl theme-soft text-xs font-bold">✕</button>
        </div>
        <div class="p-3 rounded-2xl theme-input space-y-2">
          <div class="flex justify-between items-center">
            <span class="text-[11px] font-bold">🔑 Ключ Gemini:</span>
            <a href="https://aistudio.google.com/app/apikey" target="_blank" class="px-2 py-0.5 rounded-lg theme-grad text-white text-[10px] font-bold">Получить ключ в AI Studio ↗</a>
          </div>
          <div class="flex gap-1.5">
            <input type="password" id="inp-gemini-key" value="${localStorage.getItem('nutricalc_gemini_key')||''}" placeholder="Пусто = локальный режим, или AIzaSy..." class="flex-1 px-3 py-1.5 rounded-xl theme-soft text-xs font-mono-num">
            <button onclick="localStorage.setItem('nutricalc_gemini_key',document.getElementById('inp-gemini-key').value.trim());renderApp();openAiModal();" class="px-3 py-1.5 rounded-xl theme-grad text-white text-xs font-bold">ОК</button>
          </div>
        </div>
        <textarea id="inp-ai-prompt" rows="2" placeholder="Например: 200г грудки, 150 ширатаки, 2 яйца" class="w-full p-2.5 rounded-xl theme-input text-xs"></textarea>
        <div class="grid grid-cols-3 gap-1.5">
          <button onclick="runAi('parse',${m.effectiveKcal-totKcal},${m.normP-totP},${m.normF-totF},${m.normC-totC})" class="p-2.5 rounded-xl theme-grad text-white text-xs font-bold">🎙 В дневник</button>
          <button id="btn-ai-dinner" onclick="runAi('dinner',${m.effectiveKcal-totKcal},${m.normP-totP},${m.normF-totF},${m.normC-totC})" class="p-2.5 rounded-xl theme-soft text-xs font-bold">🍽 Под остаток</button>
          <button onclick="runAi('audit',${m.effectiveKcal-totKcal},${m.normP-totP},${m.normF-totF},${m.normC-totC})" class="p-2.5 rounded-xl theme-soft text-xs font-bold">🔍 Аудит дня</button>
        </div>
        <div id="ai-out" class="hidden p-3 rounded-2xl theme-input text-xs whitespace-pre-line"></div>
      </div>
    </div>`;
}

function renderCatalogOnly() {
  const box = document.getElementById('catalog-box');
  if (!box) return;
  box.innerHTML = getAllFoods().filter(f => (activeCategory === 'Все' || f.cat === activeCategory) && f.name.toLowerCase().includes(searchQuery.toLowerCase())).map(f => `<div class="py-2 flex items-center justify-between gap-2 text-xs"><div><div class="font-bold">${f.name}</div><div class="text-[10px] opacity-70 font-mono-num">100г: ${f.kcal} ккал · Б ${f.p} · Ж ${f.f} · У ${f.c}</div></div><button onclick="addFoodToMeal('${f.id}')" class="px-2.5 py-1 rounded-xl theme-grad text-white font-bold text-xs">+ Добавить</button></div>`).join('');
}
function updateGrams(i, v) { const g = Math.max(0, parseInt(v, 10) || 0); if (g === 0) getProf().diary[activeMeal].splice(i, 1); else getProf().diary[activeMeal][i].grams = g; saveStorage(); renderApp(); }
function toggleCooked(i) { getProf().diary[activeMeal][i].isCooked = !getProf().diary[activeMeal][i].isCooked; saveStorage(); renderApp(); }
function removeItem(i) { getProf().diary[activeMeal].splice(i, 1); saveStorage(); renderApp(); }
function clearDiary() { getProf().diary = { breakfast: [], lunch: [], dinner: [], snack: [] }; saveStorage(); renderApp(); }
function resetDemoDiary() { const pk = appData.activeProfile; appData.profiles[pk].diary = JSON.parse(JSON.stringify(DEFAULT_PROFILES[pk].diary)); saveStorage(); renderApp(); }
function openCustomFoodModal() {
  const name = prompt('Название блюда:'); if (!name) return;
  const p = parseFloat(prompt('Белки на 100г:', '15')) || 0;
  const f = parseFloat(prompt('Жиры на 100г:', '5')) || 0;
  const c = parseFloat(prompt('Углеводы на 100г:', '10')) || 0;
  const id = 'cf_' + Date.now();
  appData.customFoods.unshift({ id, name, cat: 'Мои блюда', p, f, c, kcal: Math.round(p * 4 + f * 9 + c * 4) });
  addFoodToMeal(id, 100);
}
function copyFinalReport(k, p, f, c, n, t) {
  navigator.clipboard.writeText(`📊 NUTRIingo\nРасход: ${t} ккал | Норма: ${n} ккал\nСъедено: ${k} ккал (Б:${p}г, Ж:${f}г, У:${c}г / ${(c / 12).toFixed(1)} ХЕ)`);
  alert('Скопировано!');
}
function openAiModal(mode) { document.getElementById('modal-ai').classList.remove('hidden'); if (mode === 'dinner') document.getElementById('btn-ai-dinner').click(); }
function applyLocalPresetToDiary(idx) { (lastLocalPresets[idx] || []).forEach(it => addFoodToMeal(it.foodId, it.grams)); document.getElementById('modal-ai').classList.add('hidden'); }

async function runAi(mode, remK, remP, remF, remC) {
  const key = ((document.getElementById('inp-gemini-key')?.value) || localStorage.getItem('nutricalc_gemini_key') || '').trim();
  const out = document.getElementById('ai-out'); out.classList.remove('hidden');
  if (!key) return runLocalSmartEngine(mode, remK, remP, remF, remC, out);
  const dm = getProf().diabetesType;
  out.textContent = '☁️ Запрос к Gemini...';
  try {
    const promptText = mode === 'dinner'
      ? `Остаток КБЖУ: ${remK} ккал, Б:${remP}г, Ж:${remF}г, У:${remC}г. Диабет: ${dm}. Предложи 3 ужина с граммовками и ХЕ.`
      : `Оцени остаток КБЖУ: ${remK} ккал (Б:${remP}г, Ж:${remF}г, У:${remC}г), диабет: ${dm}. Дай 3 совета.`;
    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${encodeURIComponent(key)}`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents: [{ parts: [{ text: promptText }] }] })
    });
    const data = await res.json();
    out.textContent = data?.candidates?.[0]?.content?.parts?.[0]?.text || 'Нет ответа';
  } catch (e) { runLocalSmartEngine(mode, remK, remP, remF, remC, out); }
}

function runLocalSmartEngine(mode, remK, remP, remF, remC, out) {
  if (mode === 'parse') {
    const raw = (document.getElementById('inp-ai-prompt').value || '').toLowerCase();
    const parts = raw.split(/[,;+\n]| и /).map(s => s.trim()).filter(Boolean), added = [], foods = getAllFoods();
    parts.forEach(part => {
      const m = part.match(/(\d+)/); let num = m ? parseInt(m[1], 10) : 100;
      const fd = foods.find(f => (f.kw || []).some(k => part.includes(k)));
      if (fd) { if (num <= 10 && fd.unitWeight) num *= fd.unitWeight; getProf().diary[activeMeal].push({ foodId: fd.id, grams: num, isCooked: false }); added.push(`• ${fd.name} (${num}г)`); }
    });
    saveStorage(); renderApp(); document.getElementById('modal-ai').classList.remove('hidden');
    const no = document.getElementById('ai-out'); no.classList.remove('hidden');
    no.textContent = added.length ? `⚡ Добавлено:\n${added.join('\n')}` : 'Напишите: 200 грудки, 60 гречки, 2 яйца';
    return;
  }
  if (mode === 'dinner') {
    const needP = Math.max(20, remP), needC = Math.max(0, remC);
    const chG = Math.min(300, Math.max(100, Math.round((needP * 0.8) / 0.236 / 10) * 10));
    const curG = Math.min(280, Math.max(120, Math.round((needP * 0.75) / 0.18 / 10) * 10));
    const fshG = Math.min(320, Math.max(140, Math.round((needP * 0.85) / 0.175 / 10) * 10));
    lastLocalPresets = [
      [{ foodId: 'f1', grams: chG, label: `Грудка ${chG}г` }, needC > 20 ? { foodId: 'f13', grams: 45, label: 'Гречка 45г (2.3 ХЕ)' } : { foodId: 'f17', grams: 200, label: 'Ширатаки 200г (0 ХЕ)' }, { foodId: 'f18', grams: 8, label: 'Псиллиум 8г' }],
      [{ foodId: 'f9', grams: curG, label: `Творог 2% ${curG}г` }, { foodId: 'f8', grams: 120, label: 'Яичный белок 120г' }],
      [{ foodId: 'f4', grams: fshG, label: `Треска ${fshG}г` }, { foodId: 'f22', grams: 200, label: 'Брокколи 200г (1.1 ХЕ)' }]
    ];
    out.innerHTML = `<div class="font-bold mb-1">⚡ Под остаток (${remK} ккал · У:${remC}г / ${(remC / 12).toFixed(1)} ХЕ):</div>` +
      lastLocalPresets.map((o, i) => `<div class="p-2 rounded-xl theme-soft flex justify-between items-center mt-1"><span>${o.map(x => x.label).join(' + ')}</span><button onclick="applyLocalPresetToDiary(${i})" class="px-2 py-1 rounded-lg theme-grad text-white font-bold text-[10px]">+ В дневник</button></div>`).join('');
    return;
  }
  const dm = getProf().diabetesType;
  out.textContent = `⚡ Клинический экспресс-аудит NUTRIingo:\n• Остаток калорий: ${remK} ккал | Остаток углеводов: ${remC} г (${(remC / 12).toFixed(1)} ХЕ)\n• ${dm === 'dm2' ? 'Начинайте прием пищи с клетчатки и белка, а углеводы ешьте в конце.' : dm === 'dm1' ? 'Проверьте дозу перед/после еды в Болюс-калькуляторе на вкладке Дневника.' : 'Нажмите «🍽 Под остаток» для автоподбора блюд.'}`;
}
loadStorage(); renderApp();
