const WEIGHT_GRID = [45, 50, 55, 60, 65, 70, 75, 80, 85, 90, 95, 100, 105, 110, 115, 120];
const HEIGHT_GRID = [150, 155, 160, 165, 169, 172, 175, 178, 180, 185, 190, 195];
const AGE_GRID = [20, 25, 28, 30, 32, 35, 38, 40, 45, 50];
const STEPS_GRID = [2000, 4000, 6000, 8000, 10000, 12000, 14000, 16000, 18000, 20000];
const WEEKS_GRID = [4, 6, 8, 10, 12, 14, 16, 20, 24, 30, 36, 52];
const PROT_GRID = [1.4, 1.6, 1.8, 2.0, 2.2, 2.5];
const FAT_GRID = [0.7, 0.8, 0.9, 1.0, 1.2, 1.5];
const ICR_GRID = [0.5, 0.8, 1.0, 1.2, 1.5, 1.8, 2.0, 2.5];

const DIABETES_STORIES = [
  { name: '⚖️ Сэр Торстен Хайердал', desc: 'Великий норвежский путешественник и антрополог (экспедиция «Кон-Тики»). Жил с сахарным диабетом, пересек океаны и доказал, что болезнь не преграда для великих открытий.' },
  { name: '🎸 Брет Майклс', desc: 'Легендарный фронтмен рок-группы Poison. С диагностированным в детстве СД 1 типа успешно дает стадионные концерты, ведет активный образ жизни и вдохновляет миллионы.' },
  { name: 'olympic 🥇 Гэри Холл-младший', desc: 'Американский пловец, 10-кратный олимпийский чемпион. Когда врачи говорили, что с диабетом профессиональный спорт невозможен, он завоевывал золотые медали на Олимпиадах.' },
  { name: '🏀 Брэд Купер / Джей Китлер', desc: 'Профессиональные аттестованные спортсмены и баскетболисты НБА, открыто выступающие с инсулиновыми помпами наперекор любым стереотипам.' }
];

const DIABETES_BREAKTHROUGHS = [
  { yr: '2026', title: '🧬 Клеточная терапия исцеления', desc: 'Успешные клинические фазы пересадки инкапсулированных островковых клеток, вырабатывающих инсулин автономно.' },
  { yr: '📈 Мониторинг без проколов', desc: 'Новейшие неинвазивные датчики гликемии по составу пот и слезной жидкости с точностью лабораторного анализа.' },
  { yr: '🤖 Искусственная поджелудочная железа', desc: 'Алгоритмы замкнутого контура (Closed-Loop) на базе ИИ сами управляют подачей инсулина на помпе в реальном времени.' }
];

function renderApp() {
  const p = getProf(), m = computeMetrics();
  document.documentElement.setAttribute('data-gender', p.gender);
  const bolus = computeBolusForMeal(mealBolus.p, mealBolus.f, mealBolus.c, p);
  const mealKcal = Math.round(mealBolus.p * 4 + mealBolus.f * 9 + mealBolus.c * 4);
  const dayPlan = computeDailyInsulinPlan(m, p);

  const diffKg = +(p.targetWeight - p.weight).toFixed(1), totalDays = p.targetWeeks * 7;
  const checkpoints = [0, 0.25, 0.5, 0.75, 1].map((pct, i) => {
    const w = +(p.weight + diffKg * pct).toFixed(1);
    return { label: i===0?'Старт':i===2?'Экватор':i===4?'Финиш':(pct*100)+'%', w, date: formatDateOffset(totalDays * pct), tdee: calcTDEEForWeight(w, p).tdee };
  });
  const extra3kKcal = Math.round(((p.height * 0.415) / 100000) * 3000 * p.weight * 0.62);
  const recProt = p.diabetesType !== 'none' ? 1.7 : (p.gender === 'female' ? 1.8 : 2.0);
  const recFat = p.gender === 'female' ? 0.95 : 0.9;
  const isTooStrict = m.targetKcal < m.minSafe, safeWeeks = Math.max(4, Math.ceil(Math.abs(diffKg * 7700) / (Math.max(300, m.tdee - m.minSafe) * 7)));
  const hasSavedKey = !!(localStorage.getItem('nutricalc_gemini_key') || '').trim();
  const randStory = DIET_STORIES_RANDOM || (DIET_STORIES_RANDOM = DIET_ABETES_STORIES_PICK());

  document.getElementById('app').innerHTML = `
    <header class="sticky top-0 z-30 glass-card border-b px-3 py-2.5"><div class="max-w-7xl mx-auto flex items-center justify-between gap-2">
      <div class="flex items-center gap-2.5"><div class="w-9 h-9 rounded-xl theme-grad flex items-center justify-center text-white text-base shadow">🌿</div><span class="font-extrabold text-base sm:text-lg tracking-tight leading-none">NUTRIingo</span></div>
      <div class="flex items-center gap-1 p-1 rounded-xl theme-input"><button onclick="switchProfile('p1')" class="px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap ${appData.activeProfile==='p1'?'theme-grad text-white shadow':'opacity-75'}">♂ Профиль 1</button><button onclick="switchProfile('p2')" class="px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap ${appData.activeProfile==='p2'?'theme-grad text-white shadow':'opacity-75'}">♀ Профиль 2</button></div>
    </div></header>

    <div class="max-w-7xl mx-auto px-3 pt-3 lg:hidden"><div class="grid grid-cols-2 gap-2 p-1 rounded-2xl glass-card">
      <button onclick="activeTab='calc';renderApp();" class="py-2.5 rounded-xl text-xs font-bold ${activeTab==='calc'?'theme-grad text-white shadow':'opacity-75'}">⚙️ КБЖУ и План</button>
      <button onclick="activeTab='diabetes';renderApp();" class="py-2.5 rounded-xl text-xs font-bold ${activeTab==='diabetes'?'theme-grad text-white shadow':'opacity-75'}">💉 Калькулятор Диабета</button>
    </div></div>

    <main class="max-w-7xl mx-auto px-3 pt-4 pb-20 grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
      <section class="lg:col-span-6 space-y-4 ${activeTab==='diabetes'?'hidden lg:block':''}">
        <div class="glass-card rounded-3xl p-4 space-y-3.5 shadow-lg">
          <div class="flex justify-between items-center"><h2 class="font-extrabold text-base">1. Ваши параметры</h2><span class="text-[11px] px-2 py-0.5 rounded-lg theme-soft font-semibold">${p.useBodyFat?'Кетч-МакАрдл':'Миффлин-Сан Жеор'}</span></div>
          <div class="grid grid-cols-2 gap-2"><button onclick="setParam('gender','female')" class="py-2.5 px-3 rounded-2xl text-xs font-bold border ${p.gender==='female'?'theme-grad text-white border-transparent shadow-md':'theme-input opacity-80'}">♀ Женщина</button><button onclick="setParam('gender','male')" class="py-2.5 px-3 rounded-2xl text-xs font-bold border ${p.gender==='male'?'theme-grad text-white border-transparent shadow-md':'theme-input opacity-80'}">♂ Мужчина</button></div>

          <div class="p-3 rounded-2xl theme-input space-y-2">
            <div class="flex justify-between items-center"><span class="text-xs font-bold opacity-80">ВОЗРАСТ (ЛЕТ)</span><div class="flex items-center gap-1.5"><button onclick="setParam('age',${p.age-1})" class="w-8 h-7 rounded-lg theme-soft font-bold">-</button><span class="w-12 text-center font-mono-num font-extrabold text-sm">${p.age}</span><button onclick="setParam('age',${p.age+1})" class="w-8 h-7 rounded-lg theme-soft font-bold">+</button></div></div>
            <div class="grid grid-cols-5 gap-1">${AGE_GRID.map(a=>`<button onclick="setParam('age',${a})" class="py-1 rounded-lg text-[11px] font-mono-num font-bold ${p.age===a?'theme-grad text-white':'theme-soft'}">${a}</button>`).join('')}</div>
          </div>

          <div class="p-3 rounded-2xl theme-input space-y-2">
            <div class="flex justify-between items-center"><span class="text-xs font-bold opacity-80">РОСТ (СМ)</span><div class="flex items-center gap-1.5"><button onclick="setParam('height',${p.height-1})" class="w-8 h-7 rounded-lg theme-soft font-bold">-</button><span class="w-12 text-center font-mono-num font-extrabold text-sm">${p.height}</span><button onclick="setParam('height',${p.height+1})" class="w-8 h-7 rounded-lg theme-soft font-bold">+</button></div></div>
            <div class="grid grid-cols-6 gap-1">${HEIGHT_GRID.map(h=>`<button onclick="setParam('height',${h})" class="py-1 rounded-lg text-[11px] font-mono-num font-bold ${p.height===h?'theme-grad text-white':'theme-soft'}">${h}</button>`).join('')}</div>
          </div>

          <div class="p-3 rounded-2xl theme-input space-y-2">
            <div class="flex justify-between items-center"><span class="text-xs font-bold opacity-80">ТЕКУЩИЙ ВЕС (КГ)</span><div class="flex items-center gap-1.5"><button onclick="setParam('weight',${+(p.weight-0.5).toFixed(1)})" class="w-8 h-7 rounded-lg theme-soft font-bold">-</button><span class="w-14 text-center font-mono-num font-extrabold text-sm">${p.weight}</span><button onclick="setParam('weight',${+(p.weight+0.5).toFixed(1)})" class="w-8 h-7 rounded-lg theme-soft font-bold">+</button></div></div>
            <div class="grid grid-cols-8 gap-1">${WEIGHT_GRID.map(w=>`<button onclick="setParam('weight',${w})" class="py-1 rounded-lg text-[10px] font-mono-num font-bold ${p.weight===w?'theme-grad text-white':'theme-soft'}">${w}</button>`).join('')}</div>
          </div>

          <div class="p-3 rounded-2xl theme-input space-y-2">
            <div class="flex items-center justify-between">
              <label class="flex items-center cursor-pointer text-xs font-bold"><input type="checkbox" ${p.useBodyFat?'checked':''} onchange="setParam('useBodyFat',this.checked)" class="w-4 h-4 mr-2">Учитывать % жира</label>
              ${p.useBodyFat?`<div class="flex items-center gap-1"><button onclick="setParam('bodyFat',${+(p.bodyFat-0.5).toFixed(1)})" class="w-7 h-6 rounded theme-soft font-bold">-</button><span class="px-2 font-mono-num font-bold text-xs">${p.bodyFat}\% (${m.lbmWeight}кг)</span><button onclick="setParam('bodyFat',${+(p.bodyFat+0.5).toFixed(1)})" class="w-7 h-6 rounded theme-soft font-bold">+</button></div>`:''}
            </div>
            ${p.useBodyFat?`<div class="grid grid-cols-6 gap-1">${[10,12,15,18,20,22,25,28,30,32,35,40].map(bf=>`<button onclick="setParam('bodyFat',${bf})" class="py-1 rounded-lg text-[10px] font-mono-num font-bold ${p.bodyFat===bf?'theme-grad text-white':'theme-soft'}">${bf}%</button>`).join('')}</div>`:''}
          </div>

          <div class="p-3 rounded-2xl theme-input space-y-2">
            <div class="text-xs font-bold">🩺 Наличие сахарного диабета (меняет логику КБЖУ):</div>
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
          <div class="p-3 rounded-2xl theme-input space-y-2">
            <div class="flex justify-between items-center"><div><div class="text-xs font-bold">👣 Шагов в день: ${p.steps}</div><div class="text-[11px] opacity-75">~${m.distKm.toFixed(1)} км · +${m.stepsKcal} ккал</div></div><div class="flex gap-1"><button onclick="setParam('steps',${Math.max(0,p.steps-1000)})" class="px-2.5 py-1 rounded-lg theme-soft font-bold text-xs">-1к</button><button onclick="setParam('steps',${p.steps+1000})" class="px-2.5 py-1 rounded-lg theme-soft font-bold text-xs">+1к</button></div></div>
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
          <h2 class="font-extrabold text-base">3. Цель, Контрольные точки и Норма КБЖУ</h2>
          <div class="p-3 rounded-2xl theme-input space-y-2">
            <div class="flex justify-between items-center"><span class="text-xs font-bold">🎯 Желаемый вес (кг)</span><div class="flex items-center gap-1.5"><button onclick="setParam('targetWeight',${+(p.targetWeight-0.5).toFixed(1)})" class="w-8 h-7 rounded-lg theme-soft font-bold">-</button><span class="w-14 text-center font-mono-num font-extrabold text-sm">${p.targetWeight}</span><button onclick="setParam('targetWeight',${+(p.targetWeight+0.5).toFixed(1)})" class="w-8 h-7 rounded-lg theme-soft font-bold">+</button></div></div>
            <div class="grid grid-cols-8 gap-1">${WEIGHT_GRID.map(w=>`<button onclick="setParam('targetWeight',${w})" class="py-1 rounded-lg text-[10px] font-mono-num font-bold ${p.targetWeight===w?'theme-grad text-white':'theme-soft'}">${w}</button>`).join('')}</div>
          </div>

          <div class="p-3 rounded-2xl theme-input space-y-2">
            <div class="flex justify-between items-center text-xs font-bold"><span>📅 Срок: ${p.targetWeeks} нед. (${totalDays} дн.)</span><div class="flex items-center gap-1"><button onclick="setParam('targetWeeks',${Math.max(1,p.targetWeeks-1)})" class="w-7 h-6 rounded theme-soft font-bold">-</button><span class="font-mono-num px-1">${m.dailyDelta>0?'+':''}${m.dailyDelta} ккал/дн</span><button onclick="setParam('targetWeeks',${p.targetWeeks+1})" class="w-7 h-6 rounded theme-soft font-bold">+</button></div></div>
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
                  ? `• Углеводы <strong>${m.normC} г (${m.totalXE} ХЕ)</strong> для защиты от кетоацидоза. На вкладке «Калькулятор Диабета» доступны суточные дозы инсулина и разовая компенсация.`
                  : `• Углеводы до <strong>${m.normC} г/сут (${m.totalXE} ХЕ)</strong> с низким ГИ. На 1 прием: до <strong>${m.maxMealCarbs} г (${m.maxMealXE} ХЕ)</strong>. Клетчатка: <strong>${m.fiberNorm} г/сут</strong>.`}
              </div>
            </div>
          `:''}

          <div class="p-3 rounded-2xl theme-soft space-y-2 text-xs">
            ${isTooStrict?`<div class="p-2 rounded-xl bg-amber-500/20 border border-amber-400 text-[11px]">⚠️ Жесткий темп! Порог безопасности: <strong>${m.minSafe} ккал</strong>. <button onclick="setParam('targetWeeks',${safeWeeks})" class="underline font-bold">Поставить ${safeWeeks} нед.</button></div>`:`<div class="text-[11px]">✅ Темп: ${m.weeklyKg} кг/нед. ИМТ: ${m.bmi} → ${m.targetBmi}. Клетчатка: от ${m.fiberNorm} г/сут.</div>`}
            <div class="grid grid-cols-2 gap-1.5"><button onclick="setParam('steps',${p.steps+3000})" class="p-2 rounded-xl theme-input text-left"><div class="font-bold text-[11px]">👟 +3 000 шагов</div><div class="text-[10px] opacity-75">+${extra3kKcal} ккал к рациону</div></button><button onclick="applySmartMacros(${recProt},${recFat})" class="p-2 rounded-xl theme-input text-left"><div class="font-bold text-[11px]">🥩 Смарт-БЖУ</div><div class="text-[10px] opacity-75">Б ${recProt} · Ж ${recFat} г/кг</div></button></div>
          </div>

          <div class="space-y-1.5"><div class="text-xs font-bold">🥗 Тип питания под цель:</div>${DIET_TYPES.map(dt=>`<button onclick="selectDietType('${dt.id}')" class="w-full p-2.5 rounded-xl text-left flex justify-between items-center ${p.dietType===dt.id?'theme-grad text-white shadow':'theme-input'}"><div><div class="text-xs font-bold">${dt.name}</div><div class="text-[10px] opacity-80">${dt.desc}</div></div><span class="text-[10px] font-mono-num font-bold px-2 py-0.5 rounded bg-black/20 text-white">${p.dietType===dt.id?`${m.realPpct}/${m.realFpct}/${m.realCpct}%`:`${dt.p}/${dt.f}/${dt.c}%`}</span></button>`).join('')}</div>

          <div class="p-3 rounded-2xl theme-input space-y-2.5 text-xs">
            <div class="text-[10px] opacity-80 font-bold">База расчета белка и жиров (г/кг):</div>
            <div class="grid grid-cols-3 gap-1"><button onclick="setParam('macroBase','target')" class="py-1.5 px-1 rounded-lg text-[10px] font-bold ${p.macroBase==='target'?'theme-grad text-white':'theme-soft'}">Желаемый (${p.targetWeight}кг)</button><button onclick="setParam('macroBase','current')" class="py-1.5 px-1 rounded-lg text-[10px] font-bold ${p.macroBase==='current'?'theme-grad text-white':'theme-soft'}">Текущий (${p.weight}кг)</button><button onclick="setParam('macroBase','lbm')" class="py-1.5 px-1 rounded-lg text-[10px] font-bold ${p.macroBase==='lbm'?'theme-grad text-white':'theme-soft'}">Сухая (${m.lbmWeight}кг)</button></div>
            <div class="space-y-1"><div class="flex justify-between"><span>Белки (${p.protGkg} г/кг от ${m.refLabel})</span><strong>${m.normP} г</strong></div><div class="grid grid-cols-6 gap-1">${PROT_GRID.map(v=>`<button onclick="setParam('protGkg',${v})" class="py-1 rounded-lg text-[10px] font-mono-num font-bold ${p.protGkg===v?'theme-grad text-white':'theme-soft'}">${v}</button>`).join('')}</div></div>
            <div class="space-y-1"><div class="flex justify-between"><span>Жиры (${p.fatGkg} г/кг от ${m.refLabel})</span><strong>${m.normF} г</strong></div><div class="grid grid-cols-6 gap-1">${FAT_GRID.map(v=>`<button onclick="setParam('fatGkg',${v})" class="py-1 rounded-lg text-[10px] font-mono-num font-bold ${p.fatGkg===v?'theme-grad text-white':'theme-soft'}">${v}</button>`).join('')}</div></div>
          </div>

          <div class="grid grid-cols-4 gap-2"><div class="p-2.5 rounded-2xl theme-grad text-white text-center"><div class="text-[10px]">НОРМА</div><div class="font-mono-num font-extrabold text-sm">${m.effectiveKcal}</div></div><div class="p-2.5 rounded-2xl theme-soft text-center"><div class="text-[10px]">Белки</div><div class="font-mono-num font-extrabold text-sm">${m.normP}г</div></div><div class="p-2.5 rounded-2xl theme-soft text-center"><div class="text-[10px]">Жиры</div><div class="font-mono-num font-extrabold text-sm">${m.normF}г</div></div><div class="p-2.5 rounded-2xl theme-soft text-center"><div class="text-[10px]">Угл (${m.totalXE}ХЕ)</div><div class="font-mono-num font-extrabold text-sm">${m.normC}г</div></div></div>
        </div>
      </section>

      <!-- RIGHT COLUMN: DIABETES & DAILY INSULIN CALCULATOR -->
      <section class="lg:col-span-6 space-y-4 ${activeTab==='calc'?'hidden lg:block':''}">
        <div class="glass-card rounded-3xl p-4 sm:p-5 space-y-4 shadow-lg">
          <div class="flex items-center justify-between">
            <h2 class="font-extrabold text-base">💉 1. Настройка инсулина и УК</h2>
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
                  <span class="text-[10px] font-bold px-2 py-1 rounded-lg bg-black/25 text-white shrink-0">${ins.preMin}</span>
                </button>
              `).join('')}
            </div>
          </div>

          <div class="p-3 rounded-2xl theme-input space-y-2">
            <div class="flex justify-between items-center"><span class="text-xs font-bold">Ваш индекс УК (ЕД на 1 ХЕ):</span><div class="flex items-center gap-1.5"><button onclick="setParam('icr',${+(p.icr-0.1).toFixed(1)})" class="w-8 h-7 rounded-lg theme-soft font-bold">-</button><span class="w-12 text-center font-mono-num font-extrabold text-sm">${p.icr}</span><button onclick="setParam('icr',${+(p.icr+0.1).toFixed(1)})" class="w-8 h-7 rounded-lg theme-soft font-bold">+</button></div></div>
            <div class="grid grid-cols-8 gap-1">${ICR_GRID.map(v=>`<button onclick="setParam('icr',${v})" class="py-1.5 rounded-lg text-[11px] font-mono-num font-bold ${p.icr===v?'theme-grad text-white':'theme-soft'}">${v}</button>`).join('')}</div>
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
            <div class="font-bold text-[11px] opacity-85">Рекомендуемое распределение по приемам пищи:</div>
            ${dayPlan.splits.map(s=>`
              <div class="p-2.5 rounded-2xl theme-input flex items-center justify-between gap-2">
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
          <div class="flex justify-between items-center">
            <h2 class="font-extrabold text-base">🍽 3. Разовый расчет на прием пищи</h2>
            <span class="text-xs font-mono-num font-bold px-2 py-0.5 rounded-lg theme-soft">${mealKcal} ккал</span>
          </div>

          <div class="space-y-2 text-xs">
            <div class="p-3 rounded-2xl theme-input space-y-2">
              <div class="flex justify-between items-center"><span class="font-bold">Белки: <strong>${mealBolus.p} г</strong></span><div class="flex gap-1"><button onclick="setMealBolus('p',${mealBolus.p-5})" class="px-2 py-1 rounded theme-soft font-bold">-5г</button><button onclick="setMealBolus('p',${mealBolus.p+5})" class="px-2 py-1 rounded theme-soft font-bold">+5г</button></div></div>
              <div class="grid grid-cols-7 gap-1">${[10,20,30,40,50,60,80].map(v=>`<button onclick="setMealBolus('p',${v})" class="py-1 rounded-lg text-[10px] font-mono-num font-bold ${mealBolus.p===v?'theme-grad text-white':'theme-soft'}">${v}г</button>`).join('')}</div>
            </div>

            <div class="p-3 rounded-2xl theme-input space-y-2">
              <div class="flex justify-between items-center"><span class="font-bold">Жиры: <strong>${mealBolus.f} г</strong></span><div class="flex gap-1"><button onclick="setMealBolus('f',${mealBolus.f-5})" class="px-2 py-1 rounded theme-soft font-bold">-5г</button><button onclick="setMealBolus('f',${mealBolus.f+5})" class="px-2 py-1 rounded theme-soft font-bold">+5г</button></div></div>
              <div class="grid grid-cols-7 gap-1">${[5,10,15,20,25,35,50].map(v=>`<button onclick="setMealBolus('f',${v})" class="py-1 rounded-lg text-[10px] font-mono-num font-bold ${mealBolus.f===v?'theme-grad text-white':'theme-soft'}">${v}г</button>`).join('')}</div>
            </div>

            <div class="p-3 rounded-2xl theme-input space-y-2">
              <div class="flex justify-between items-center"><span class="font-bold">Углеводы: <strong>${mealBolus.c} г (${bolus.xe} ХЕ)</strong></span><div class="flex gap-1"><button onclick="setMealBolus('c',${mealBolus.c-6})" class="px-2 py-1 rounded theme-soft font-bold">-0.5ХЕ</button><button onclick="setMealBolus('c',${mealBolus.c+6})" class="px-2 py-1 rounded theme-soft font-bold">+0.5ХЕ</button></div></div>
              <div class="grid grid-cols-7 gap-1">${[12,24,36,48,60,72,84].map(v=>`<button onclick="setMealBolus('c',${v})" class="py-1 rounded-lg text-[10px] font-mono-num font-bold ${mealBolus.c===v?'theme-grad text-white':'theme-soft'}">${v}г</button>`).join('')}</div>
            </div>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
            <div class="p-3 rounded-2xl theme-input space-y-1">
              <div class="text-[11px] font-bold opacity-80">1️⃣ ПЕРЕД ЕДОЙ</div>
              <div class="text-2xl font-extrabold font-mono-num">${bolus.preUnits} ЕД</div>
              <div class="text-[11px] opacity-90">⏱ ${bolus.ins.preMin}</div>
              <div class="text-[10px] opacity-75">На углеводы: ${bolus.xe} ХЕ (${mealBolus.c} г)</div>
            </div>
            <div class="p-3 rounded-2xl theme-input space-y-1">
              <div class="text-[11px] font-bold opacity-80">2️⃣ ПОСЛЕ ЕДЫ (на БЖЕ)</div>
              <div class="text-2xl font-extrabold font-mono-num">${bolus.splitWaves?`${bolus.postUnits} ЕД`:'0 ЕД'}</div>
              <div class="text-[11px] opacity-90">⏱ ${bolus.ins.postTiming}</div>
              <div class="text-[10px] opacity-75">БЖЕ: ${bolus.bje} (${bolus.fpKcal} ккал Б+Ж)${bolus.waveHours?` · волна ~${bolus.waveHours}ч`:''}</div>
            </div>
          </div>
          <div class="text-[10px] opacity-75 leading-relaxed">ℹ️ <strong>Итого на прием: ${bolus.totalUnits} ЕД</strong> (ХЕ + Варшавский протокол БЖЕ ISPAD). Справочный расчет.</div>
        </div>
      </section>
    </main>

    <div class="fixed bottom-0 left-0 right-0 z-40 glass-card border-t px-3 py-2 shadow-2xl">
      <div class="max-w-7xl mx-auto flex justify-center">
        <button onclick="openAiModal()" class="py-2.5 px-6 rounded-2xl theme-grad text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-lg">✨ Клинический AI-Помощник и Ментор</button>
      </div>
    </div>

    <!-- LARGE AI MENTOR MODAL WITH WARM SUPPORT, STORIES & BREAKTHROUGHS -->
    <div id="modal-ai" class="fixed inset-0 z-50 hidden bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-5">
      <div class="glass-card rounded-3xl max-w-xl w-full p-6 space-y-4 max-h-[92vh] overflow-y-auto shadow-2xl border-2" style="border-color:var(--brand);">
        <div class="flex justify-between items-center">
          <h3 class="font-extrabold text-base flex items-center gap-2"><span>🩺 Клинический AI-Ментор и Поддержка</span><span class="text-[10px] px-2 py-0.5 rounded theme-soft">${hasSavedKey?'☁️ Gemini API':'⚡ Локальный режим'}</span></h3>
          <button onclick="document.getElementById('modal-ai').classList.add('hidden')" class="w-8 h-8 rounded-full theme-soft font-bold flex items-center justify-center">✕</button>
        </div>

        <details class="p-3 rounded-2xl theme-input text-xs">
          <summary class="cursor-pointer font-bold opacity-80">🔑 Настройки API (необязательно)</summary>
          <div class="pt-2 flex gap-1.5">
            <input type="password" id="inp-gemini-key" value="${localStorage.getItem('nutricalc_gemini_key')||''}" placeholder="AIzaSy..." class="flex-1 px-3 py-1.5 rounded-xl theme-soft text-xs font-mono-num">
            <button onclick="localStorage.setItem('nutricalc_gemini_key',document.getElementById('inp-gemini-key').value.trim());renderApp();openAiModal();" class="px-3 py-1.5 rounded-xl theme-grad text-white text-xs font-bold">ОК</button>
          </div>
        </details>

        <!-- WARM MOTIVATION & SUPPORT BUTTONS -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          <button onclick="runAi('support', ${m.effectiveKcal}, ${m.normC})" class="p-3.5 rounded-2xl theme-grad text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-lg hover:scale-[1.02] transition">
            ❤️ Теплая поддержка и совет
          </button>
          <button onclick="runAi('recipe', ${m.effectiveKcal}, ${m.normC})" class="p-3.5 rounded-2xl theme-soft font-extrabold text-xs flex items-center justify-center gap-2 shadow">
            🍳 Низкогликемический рецепт и ХЕ
          </button>
        </div>

        <div class="p-3.5 rounded-2xl theme-input space-y-2">
          <div class="text-xs font-bold opacity-85">Задать вопрос ментору:</div>
          <textarea id="inp-ai-prompt" rows="2" placeholder="Например: Как снизить утренний сахар натощак?" class="w-full p-2.5 rounded-xl theme-soft text-xs"></textarea>
          <button onclick="runAi('custom', ${m.effectiveKcal}, ${m.normC})" class="w-full py-2 rounded-xl theme-soft font-bold text-xs">💬 Спросить ментора</button>
        </div>

        <div id="ai-out" class="hidden p-4 rounded-2xl theme-input text-xs space-y-2 whitespace-pre-line leading-relaxed border border-white/20"></div>

        <!-- INSPIRING DIABETES STORIES -->
        <div class="p-4 rounded-2xl theme-soft space-y-2">
          <div class="font-extrabold text-xs flex items-center gap-1.5"><span>⭐ Вдохновляющая история успеха</span></div>
          <div class="text-xs font-bold">${randStory.name}</div>
          <div class="text-[11px] opacity-90 leading-relaxed">${randStory.desc}</div>
        </div>

        <!-- SCIENTIFIC BREAKTHROUGHS -->
        <div class="p-4 rounded-2xl theme-input space-y-2">
          <div class="font-extrabold text-xs">🚀 Новые достижения в борьбе с диабетом</div>
          <div class="space-y-2 text-[11px]">
            ${DIABETES_BREAKTHROUGHS.map(b=>`
              <div class="p-2 rounded-xl theme-soft">
                <div class="font-bold flex items-center justify-between"><span>${b.title}</span><span class="opacity-75">${b.yr}</span></div>
                <div class="opacity-85 mt-0.5">${b.desc}</div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    </div>`;
}

function openAiModal() { document.getElementById('modal-ai').classList.remove('hidden'); }
function DIET_ABETES_STORIES_PICK() { return DIABETES_STORIES[Math.floor(Math.random() * DIABETES_STORIES.length)]; }
let DIET_STORIES_RANDOM = null;

async function runAi(mode, kcal, carbs) {
  const key = ((document.getElementById('inp-gemini-key')?.value) || localStorage.getItem('nutricalc_gemini_key') || '').trim();
  const out = document.getElementById('ai-out'); out.classList.remove('hidden');
  const dm = getProf().diabetesType;
  const promptTxt = document.getElementById('inp-ai-prompt')?.value?.trim() || '';

  if (!key) {
    runLocalAiMentor(mode, dm, carbs, promptTxt, out);
    return;
  }

  out.textContent = '☁️ Запрос к клиническому ментору Gemini...';
  try {
    const sysPrompt = `Ты — экспертный клинический нутрициолог и теплый, эмпатичный поддерживающий ментор для людей с сахарным диабетом (${dm === 'dm1' ? 'СД 1 типа' : dm === 'dm2' ? 'СД 2 типа' : 'профилактика'}). Давай заботливые, мотивирующие советы, поддерживай эмоционально, помогай справляться с выгоранием от контроля сахаров.`;
    const userQuery = promptTxt || (mode === 'support' ? 'Поддержи меня, я чувствую усталость от постоянного контроля сахаров, подсчета ХЕ и рутины диабета.' : mode === 'recipe' ? 'Предложи вкусный, безопасный низкогликемический ужин с минимальным ХЕ.' : 'Дай совет по питанию и компенсации.');
    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${encodeURIComponent(key)}`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents: [{ parts: [{ text: `${sysPrompt}\n\nЗапрос пользователя: ${userQuery}` }] }] })
    });
    const data = await res.json();
    out.textContent = data?.candidates?.[0]?.content?.parts?.[0]?.text || 'Нет ответа';
  } catch (e) {
    runLocalAiMentor(mode, dm, carbs, promptTxt, out);
  }
}

function runLocalAiMentor(mode, dm, carbs, promptTxt, out) {
  if (mode === 'support') {
    out.innerHTML = `❤️ <strong>Теплое слово поддержки для вас:</strong>\n\n` +
      `Я знаю, как бывает тяжело. Жить с диабетом — это не просто лечение, это вторая полноценная работа без выходных и отпусков: постоянно думать о сахарах, ХЕ, подбирать дозы и сомневаться. Вы имеете полное право уставать от этого.\n\n` +
      `Но посмотрите на себя: вы боретесь за свое здоровье каждый день, и это требует невероятной силы духа. Вы не одиноки в этом пути. Сделайте глубокий вдох, позвольте себе передохнуть — вы делаете потрясающую работу, и вы справляетесь! 🌟`;
  } else if (mode === 'recipe') {
    out.innerHTML = `🍳 <strong>Клинический низкогликемический рецепт (${dm === 'dm1' ? 'СД 1' : dm === 'dm2' ? 'СД 2' : 'Стандарт'}):</strong>\n\n` +
      `• <strong>Запеченная куриная грудка в травах (200 г):</strong> 0 ХЕ, 46 г белка. Чистый строительный материал без влияния на гликемию.\n` +
      `• <strong>Микс из брокколи и цветной капусты на пару (200 г):</strong> ~0.8 ХЕ. Богаты клетчаткой и антиоксидантами.\n` +
      `• <strong>Салат из авокадо и зелени с капелькой лимонного сока:</strong> 0.5 ХЕ и полезные омега-3 жирные кислоты.\n\n` +
      `💡 <em>Итого: ~1.3 ХЕ. Начните ужин с капусты и авокадо, затем съешьте грудку — это сгладит любой скачок сахара! Приятного аппетита! ✨</em>`;
  } else {
    out.innerHTML = `💬 <strong>Совет ментора по вашему запросу:</strong>\n\n` +
      `"${promptTxt}"\n\n` +
      `💡 Помните главное правило компенсации при диабете: стабильность важнее идеальных цифр. Старайтесь сочетать углеводы с белком и полезными жирами, а также всегда держите под рукой быстрые углеводы для купирования гипогликемии. Вы отлично справляетесь!`;
  }
}

loadStorage(); renderApp();
