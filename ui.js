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
    return { label: i===0?'Старт':i===2?'Экватор':i===4?'Финиш':(pct*100)+'%', w, date: formatDateOffset(totalDays * pct), tdee: calcTDEEForWeight(w, p).tdee };
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
            <div class="font-extrabold text-sm sm:text-base leading-tight tracking-tight">NUTRIingo</div>
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
              ${p.useBodyFat ? `<span class="font-mono-num">${p.bodyFat}\% (Сухая: ${(p.weight*(1-p.bodyFat/100)).toFixed(1)}кг)</span>` : ''}
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
            ${DIET_TYPES.map(dt => `<button onclick="selectDietType('${dt.id}')" class="w-full p-2 rounded-xl text-left flex justify-between items-center ${p.dietType === dt.id ? 'theme-grad text-white shadow' : 'theme-input'}"><div><div class="text-xs font-bold">${dt.name}</div><div class="text-[10px] opacity-80">${dt.desc}</div></div><span class="text-[10px] font-mono-num font-bold px-2 py-0.5 rounded bg-black/20 text-white">${dt.p}/${dt.f}/${dt.c}%</span></button>`).join('')}
          </div>

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
            <input type="text" value="${searchQuery}" oninput="searchQuery=this.value; renderCatalogOnly();" placeholder="🔍 Поиск
