const DEFAULT_FOODS = [
  { id: 'f1', name: 'Куриная грудка (филе)', kw: ['грудк','куриц','курин','филе'], cat: 'Мясо / Птица', p: 23.6, f: 1.9, c: 0.4, kcal: 113, cookRatio: 0.75 },
  { id: 'f2', name: 'Индейка (филе грудки)', kw: ['индейк','котлет'], cat: 'Мясо / Птица', p: 24.0, f: 1.5, c: 0.0, kcal: 110, cookRatio: 0.75 },
  { id: 'f3', name: 'Постная говядина (вырезка)', kw: ['говядин','телятин','стейк'], cat: 'Мясо / Птица', p: 20.0, f: 7.0, c: 0.0, kcal: 143, cookRatio: 0.72 },
  { id: 'f4', name: 'Треска / Минтай (белая рыба)', kw: ['треск','минтай','рыб','хек','судак'], cat: 'Рыба', p: 17.5, f: 0.7, c: 0.0, kcal: 76, cookRatio: 0.80 },
  { id: 'f5', name: 'Лосось / Семга', kw: ['лосос','семг','форел'], cat: 'Рыба', p: 20.0, f: 13.0, c: 0.0, kcal: 197, cookRatio: 0.82 },
  { id: 'f6', name: 'Тунец в собственном соку', kw: ['тунец','тунца'], cat: 'Рыба', p: 23.0, f: 1.0, c: 0.0, kcal: 101 },
  { id: 'f7', name: 'Яйцо куриное (1 шт ~ 55 г)', kw: ['яйц','яйца','омлет'], unitWeight: 55, cat: 'Яйца / Молочка', p: 12.7, f: 11.5, c: 0.7, kcal: 157 },
  { id: 'f8', name: 'Жидкий яичный белок пастериз.', kw: ['белок','белка','белков'], unitWeight: 33, cat: 'Диет / 0 ккал', p: 11.0, f: 0.0, c: 0.7, kcal: 47 },
  { id: 'f9', name: 'Творог 2% мягкий / брикет', kw: ['творог','сырник'], cat: 'Яйца / Молочка', p: 18.0, f: 2.0, c: 3.3, kcal: 103 },
  { id: 'f10', name: 'Творог 5%', kw: ['творог 5'], cat: 'Яйца / Молочка', p: 17.2, f: 5.0, c: 1.8, kcal: 121 },
  { id: 'f11', name: 'Греческий йогурт Teos 2%', kw: ['йогурт','теос','греческий'], cat: 'Яйца / Молочка', p: 8.0, f: 2.0, c: 4.2, kcal: 67 },
  { id: 'f12', name: 'Сыр легкий 15%', kw: ['сыр','ламбер','natura'], cat: 'Яйца / Молочка', p: 30.0, f: 15.0, c: 0.0, kcal: 255 },
  { id: 'f13', name: 'Гречка (крупа)', kw: ['гречк','гречн'], cat: 'Крупы', p: 12.6, f: 3.3, c: 62.1, kcal: 329, cookRatio: 2.8 },
  { id: 'f14', name: 'Овсяные хлопья (Геркулес)', kw: ['овсян','геркулес','каша'], cat: 'Крупы', p: 12.5, f: 6.2, c: 61.0, kcal: 350, cookRatio: 3.0 },
  { id: 'f15', name: 'Рис басмати / жасмин', kw: ['рис','басмати'], cat: 'Крупы', p: 7.5, f: 0.6, c: 77.0, kcal: 344, cookRatio: 2.7 },
  { id: 'f16', name: 'Картофель печеный/отварной', kw: ['картоф','картошк'], cat: 'Крупы', p: 2.0, f: 0.4, c: 16.3, kcal: 77 },
  { id: 'f17', name: 'Рис Ширатаки / Конжак', kw: ['ширатак','конжак'], cat: 'Диет / 0 ккал', p: 0.1, f: 0.1, c: 0.6, kcal: 9 },
  { id: 'f18', name: 'Псиллиум (клетчатка)', kw: ['псиллиум','клетчатк'], cat: 'Диет / 0 ккал', p: 1.5, f: 0.5, c: 7.0, kcal: 38 },
  { id: 'f19', name: 'Соус / Джем 0 ккал (Mr. Djemius)', kw: ['соус','джем','сироп'], cat: 'Диет / 0 ккал', p: 0.4, f: 0.1, c: 4.5, kcal: 20 },
  { id: 'f20', name: 'Протеин сывороточный (Изолят)', kw: ['протеин','изолят'], unitWeight: 30, cat: 'Диет / 0 ккал', p: 84.0, f: 1.5, c: 3.0, kcal: 362 },
  { id: 'f21', name: 'Огурцы / Томаты / Зелень', kw: ['огурц','помидор','томат','салат','зелен','овощ'], cat: 'Овощи / Фрукты', p: 0.9, f: 0.2, c: 3.2, kcal: 18 },
  { id: 'f22', name: 'Брокколи / Цветная капуста', kw: ['броккол','капуст','кабач'], cat: 'Овощи / Фрукты', p: 2.8, f: 0.4, c: 6.6, kcal: 34 },
  { id: 'f23', name: 'Яблоко / Ягоды', kw: ['яблок','ягод','клубник','голубик','малин'], unitWeight: 130, cat: 'Овощи / Фрукты', p: 0.5, f: 0.3, c: 10.5, kcal: 47 },
  { id: 'f24', name: 'Банан очищенный', kw: ['банан'], unitWeight: 110, cat: 'Овощи / Фрукты', p: 1.5, f: 0.2, c: 21.8, kcal: 95 },
  { id: 'f25', name: 'Масло оливковое / Гхи', kw: ['масл','оливков','гхи'], cat: 'Жиры / Орехи', p: 0.0, f: 99.8, c: 0.0, kcal: 898 },
  { id: 'f26', name: 'Миндаль / Грецкий орех', kw: ['орех','миндал','грецк','кешью'], cat: 'Жиры / Орехи', p: 18.6, f: 54.0, c: 13.0, kcal: 609 },
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
    useBodyFat: false, bodyFat: 20, neatLevel: 0.12, steps: 8000,
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
    useBodyFat: false, bodyFat: 23, neatLevel: 0.12, steps: 8000,
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
