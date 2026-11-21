/* Контент проекта «Одержимые». Все данные генерируются локально и не требуют сети. */
(function () {
  const firstNames = ['Александр','Михаэль','Лукас','Эрих','Томас','Пауль','Даниэль','Марк','Феликс','Борис','Анна','Юлия','Мария','София','Елена','Клара','Ханна','Леон','Никлас','Оскар','Виктор','Ирина','Карл','Эмиль','Глеб','Артём','Марта','Лина','Нина','Ян'];
  const surnames = ['Вебер','Шнайдер','Фишер','Мюллер','Шульц','Беккер','Вольф','Келлер','Бауэр','Рихтер','Краузе','Хоффман','Нойман','Шварц','Фогель','Крюгер','Брандт','Ланге','Кох','Бергер','Крамер','Фукс','Винтер','Хартман','Венс','Штайнер'];
  const spirits = [
    {name:'Вар',gift:'Боевой импульс',desc:'Кратковременно усиливает силу и скорость в бою.',mark:'Рваный шрам, похожий на наконечник копья',skill:'ближний бой',power:'силовой рывок'},
    {name:'Пепел',gift:'Пепельный след',desc:'Оставляет на поверхности тлеющий след, который может ослепить противника.',mark:'Серый узор из точек на предплечье',skill:'скрытность',power:'дымовая завеса'},
    {name:'Стекло',gift:'Хрупкий барьер',desc:'Создаёт тонкую защитную оболочку на короткое время.',mark:'Тонкие линии, похожие на трещины',skill:'защита',power:'барьер'},
    {name:'Тень',gift:'Смещение',desc:'Позволяет на мгновение скрыть силуэт в ближайшей тени.',mark:'Чёрное пятно с острыми краями',skill:'скрытность',power:'короткое исчезновение'},
    {name:'Шторм',gift:'Разряд',desc:'Даёт возможность выпустить короткий электрический разряд.',mark:'Ветвистый знак под ключицей',skill:'контроль',power:'разряд'},
    {name:'Зверь',gift:'Инстинкт охотника',desc:'Обостряет слух, нюх и реакцию.',mark:'Три параллельные полосы',skill:'следопытство',power:'обострённые чувства'},
    {name:'Голод',gift:'Поглощение минералов',desc:'Лучше усваивает редкие минералы и ненадолго повышает выносливость.',mark:'Кольцо мелких тёмных точек',skill:'выживание',power:'минеральный рывок'},
    {name:'Костолом',gift:'Ударная волна',desc:'Передаёт часть силы удара в небольшую область вокруг цели.',mark:'Белая костяная дуга',skill:'сила',power:'ударная волна'},
    {name:'Шёпот',gift:'Чуткий слух',desc:'Улавливает тихие звуки и движение за тонкими преградами.',mark:'Завиток за ухом',skill:'наблюдательность',power:'эхолокация'},
    {name:'Лёд',gift:'Холодное касание',desc:'Понижает температуру небольшого предмета или участка поверхности.',mark:'Голубоватый геометрический узор',skill:'контроль',power:'охлаждение'}
  ];
  // У каждого духа только один носитель: либо одержимый человек, либо ходячий.
  // Первые десять имён сохраняют основные известные сущности; остальные — уникальные имена духов.
  const spiritPrefixes = ['Тихий','Серый','Чёрный','Белый','Ржавый','Пепельный','Древний','Холодный','Бледный','Алый','Сломанный','Пустой','Глухой','Дальний'];
  const spiritSuffixes = ['Порог','Омут','Скиталец','Жнец','Страж','Шорох','Предел','Осколок','Прах','Ветер'];
  const spiritIdentityNames = [...spirits.map(x=>x.name), ...spiritPrefixes.flatMap(a=>spiritSuffixes.map(b=>`${a} ${b}`))].slice(0,150);
  const surnames2 = ['Альбрехт','Бранднер','Дитрих','Энгель','Фальк','Герц','Инграм','Йегер','Крон','Леман','Майер','Норр','Отто','Прайс','Квант','Рот','Зайдель','Тиль','Ульман','Фосс'];
  const possessed = Array.from({length:50}, (_,i) => {
    const template = spirits[i % spirits.length];
    const first = firstNames[(i*7+3)%firstNames.length];
    const last = surnames2[(i*3+5)%surnames2.length];
    return {id:`poss-${String(i+1).padStart(3,'0')}`,name:`${first} ${last}`,age:19+(i*7)%54,spirit:spiritIdentityNames[i],spiritTemplate:template.name,gift:template.gift,mark:template.mark,skill:template.skill,role:i===0?'Орден — лидер':i<31?'БПСД — смешанный отряд':i<40?'БПСД — одержимый отряд':'Свободный агент',temper:['Сдержанный','Вспыльчивый','Наблюдательный','Молчаливый','Дерзкий'][i%5],hp:85+(i%4)*5,level:1+(i%8)};
  });
  const orderLeader = possessed[0];
  orderLeader.name = 'Вар';
  orderLeader.faction = 'Орден';
  orderLeader.role = 'Лидер Ордена · одержимый духом Войны';
  const walkerKinds = [
    {name:'волк',gender:'m'},{name:'пёс',gender:'m'},{name:'кабан',gender:'m'},{name:'олень',gender:'m'},
    {name:'лошадь',gender:'f'},{name:'крыса',gender:'f'},{name:'ворон',gender:'m'},{name:'медведь',gender:'m'},
    {name:'лиса',gender:'f'},{name:'крупная кошка',gender:'f'},{name:'безымянное животное',gender:'n'}
  ];
  const walkerAdjectives = {
    m:['Искажённый','Костяной','Слепой','Голодный','Длиннорукий','Шипастый','Тихий','Рваный','Тяжёлый','Пепельный'],
    f:['Искажённая','Костяная','Слепая','Голодная','Длиннорукая','Шипастая','Тихая','Рваная','Тяжёлая','Пепельная'],
    n:['Искажённое','Костяное','Слепое','Голодное','Длиннорукое','Шипастое','Тихое','Рваное','Тяжёлое','Пепельное']
  };
  const walkers = Array.from({length:100}, (_,i) => ({
    id:`walker-${String(i+1).padStart(3,'0')}`,
    name:`${walkerAdjectives[walkerKinds[i%walkerKinds.length].gender][i%10]} ${walkerKinds[i%walkerKinds.length].name}`,
    spirit:spiritIdentityNames[50+i],
    spiritTemplate:spirits[(50+i)%spirits.length].name,
    size:['малый','средний','крупный','огромный'][i%4],
    aggression:45+(i*13)%56,
    hp:35+(i*17)%125,
    strength:25+(i*11)%75,
    ability:['Рывок','Таран','Ядовитый укус','Слух охотника','Рёв','Прыжок','Панцирная кожа','Стая'][i%8],
    habitat:['лесополоса','промзона','подземный переход','заброшенный двор','окраина города'][i%5],
    description:'Животное, чьё тело исказил вселившийся дух. Повадки непредсказуемы, особенно при голоде.'
  }));
  const humanNPCs = Array.from({length:150},(_,i)=>{
    const first=firstNames[(i*11+2)%firstNames.length];
    const last=surnames[(i*7+9)%surnames.length];
    const bureau=i<90;
    return {
      id:`human-${String(i+1).padStart(3,'0')}`,
      name:`${first} ${last}`,
      age:21+(i*9)%43,
      gender:['мужчина','женщина'][i%2],
      faction:bureau?'БПСД':'Мирный житель',
      role:bureau?(['Оперативник','Следователь','Медик','Техник','Аналитик','Инструктор'][i%6]):(['Бариста','Врач','Механик','Продавец','Студент','Таксист','Повар','Учитель'][i%8]),
      district:['Митте','Кройцберг','Фридрихсхайн','Шарлоттенбург','Нойкёльн','Шпандау'][i%6],
      squad:bureau&&i<60?`H-${String(Math.floor(i/4)+1).padStart(2,'0')}`:bureau&&i<70?`M-${String(i-59).padStart(2,'0')}`:null,
      trust:40+(i*7)%60,
      bio:bureau?'Сотрудник Бюро по сопротивлению духов. Работает с делами, связанными с одержимыми и ходячими.':'Обычный житель Берлина, старающийся жить привычной жизнью.'
    };
  });
  const humanTeams=Array.from({length:15},(_,i)=>({
    id:`H-${String(i+1).padStart(2,'0')}`,
    name:['Сокол','Факел','Штиль','Барьер','Гранит','Рубеж','Вектор','Маяк','Контур','Форпост','Кедр','Молот','Спектр','Патруль','Ястреб'][i],
    type:'human',
    members:humanNPCs.slice(i*4,i*4+4).map(p=>p.id),
    description:'Человеческий оперативный отряд БПСД. Работает с обычными преступлениями, эвакуацией, оцеплением и поддержкой операций против духов.'
  }));
  const mixedTeams=Array.from({length:10},(_,i)=>({
    id:`M-${String(i+1).padStart(2,'0')}`,
    name:['Клин','Гриф','Пепел','Ворон','Клык','Рой','Кобра','Таран','Шрам','Волк'][i],
    type:'mixed',
    leader:humanNPCs[60+i].id,
    members:possessed.slice(1+i*3,1+i*3+3).map(p=>p.id),
    description:'Смешанный отряд: три одержимых оперативника под командованием человека.'
  }));
  const possessedTeams=Array.from({length:3},(_,i)=>({
    id:`P-${String(i+1).padStart(2,'0')}`,
    name:['Рой','Кремень','Ночной дозор'][i],
    type:'possessed',
    leader:possessed[31+i*3].id,
    members:possessed.slice(32+i*3,34+i*3).map(p=>p.id),
    description:'Отряд БПСД, полностью состоящий из одержимых. Лидер также является одержимым.'
  }));
  const supportStaff=humanNPCs.slice(70,90);
  const civilians=humanNPCs.slice(90);
  const locations=[
    {id:'mitte',name:'Митте',kind:'district',x:50,y:34,description:'Центральный район, административные здания и старые улицы.'},
    {id:'kreuzberg',name:'Кройцберг',kind:'district',x:53,y:57,description:'Кафе, небольшие рестораны, бары и дворы.'},
    {id:'friedrichshain',name:'Фридрихсхайн',kind:'district',x:69,y:42,description:'Молодёжные заведения, боулинг и уличные площадки.'},
    {id:'charlottenburg',name:'Шарлоттенбург',kind:'district',x:22,y:47,description:'Стадион, магазины и широкие улицы.'},
    {id:'neukolln',name:'Нойкёльн',kind:'district',x:58,y:75,description:'Жилые кварталы и недорогие кафе.'},
    {id:'spandau',name:'Шпандау',kind:'district',x:8,y:49,description:'Западная окраина, промышленные территории и старый центр.'},
    {id:'office-1',name:'Отдел БПСД №1 — Митте',kind:'office',x:51,y:29,description:'Центральный координационный отдел. Приём граждан и архив дел.'},
    {id:'office-2',name:'Отдел БПСД №2 — Кройцберг',kind:'office',x:47,y:61,description:'Оперативная группа и комната допросов.'},
    {id:'office-3',name:'Отдел БПСД №3 — Фридрихсхайн',kind:'office',x:73,y:38,description:'Отдел наблюдения и анализа следов.'},
    {id:'office-4',name:'Отдел БПСД №4 — Шарлоттенбург',kind:'office',x:18,y:42,description:'Западный патруль и тренировочный зал.'},
    {id:'office-5',name:'Отдел БПСД №5 — Нойкёльн',kind:'office',x:61,y:79,description:'Медицинский пункт и лаборатория.'},
    {id:'office-6',name:'Отдел БПСД №6 — Шпандау',kind:'office',x:5,y:55,description:'Склад снаряжения и наблюдение за окраиной.'},
    {id:'cafe-k',name:'Кафе «Кофейный круг»',kind:'cafe',x:43,y:54,price:8,description:'Тихое кафе с недорогим кофе и завтраками.'},
    {id:'restaurant-m',name:'Ресторан «Старый мост»',kind:'restaurant',x:56,y:31,price:24,description:'Небольшой ресторан немецкой кухни.'},
    {id:'restaurant-n',name:'Закусочная «Ночная смена»',kind:'restaurant',x:61,y:69,price:12,description:'Работает допоздна. Простая еда.'},
    {id:'bowling',name:'Боулинг «Strike»',kind:'bowling',x:77,y:48,price:18,description:'Дорожки для игры в боулинг.'},
    {id:'darts',name:'Бар с дартсом «Три дротика»',kind:'darts',x:46,y:70,price:10,description:'Мишени для дартса и столики.'},
    {id:'stadium',name:'Олимпийский стадион',kind:'stadium',x:15,y:29,price:0,description:'Большой стадион и спортивные маршруты вокруг.'},
    {id:'landmark-gate',name:'Бранденбургские ворота',kind:'landmark',x:47,y:25,price:0,description:'Одна из главных достопримечательностей Берлина.'},
    {id:'landmark-tower',name:'Телебашня',kind:'landmark',x:57,y:20,price:0,description:'Высокая башня в центре города.'},
    {id:'landmark-wall',name:'Галерея Ист-Сайд',kind:'landmark',x:75,y:57,price:0,description:'Участок Берлинской стены с уличными росписями.'},
    {id:'house-1',name:'Арендная квартира — Митте',kind:'house',x:55,y:38,price:650,description:'Небольшая меблированная квартира.'},
    {id:'house-2',name:'Комната — Нойкёльн',kind:'house',x:64,y:83,price:380,description:'Скромная комната в жилом доме.'},
    {id:'house-3',name:'Дом на окраине Шпандау',kind:'house',x:9,y:64,price:920,description:'Отдельный дом с небольшим двором.'},
    {id:'order-den',name:'Логово Ордена',kind:'order',x:87,y:17,hidden:true,description:'Тайная база Ордена в старом подземном комплексе за пределами плотной городской застройки. Руководитель — Вар.'},
    {id:'street-1',name:'Унтер-ден-Линден',kind:'street',x:42,y:18,description:'Центральная улица с историческими зданиями.'},
    {id:'street-2',name:'Фридрихштрассе',kind:'street',x:39,y:36,description:'Оживлённая торговая улица.'},
    {id:'street-3',name:'Карл-Маркс-аллее',kind:'street',x:79,y:31,description:'Широкая городская магистраль.'},
    {id:'street-4',name:'Курфюрстендамм',kind:'street',x:22,y:58,description:'Известная торговая улица на западе города.'},
    {id:'industrial-yard',name:'Заброшенный промышленный двор',kind:'industrial',x:8,y:68,description:'Старые ангары и ржавые ворота на окраине. Здесь часто находят следы ходячих.'},
    {id:'underpass',name:'Подземный переход у Шпандау',kind:'underpass',x:15,y:61,description:'Тускло освещённый переход, где эхо шагов слышно раньше самих людей.'},
    {id:'kreuzberg-alley',name:'Тёмный переулок Кройцберга',kind:'alley',x:50,y:66,description:'Узкий проход между домами. Местные стараются не задерживаться здесь после наступления темноты.'},
    {id:'forest-edge',name:'Лесополоса за Берлином',kind:'danger',x:3,y:84,description:'Заросшая полоса за городской чертой. В этих местах пропадали животные и находили странные следы.'}
  ];

  const countries = [
    'Германия','Украина','Польша','Чехия','Франция','Великобритания','Россия','Австрия','Швейцария','Нидерланды',
    'Бельгия','Люксембург','Дания','Швеция','Норвегия','Финляндия','Исландия','Ирландия','Испания','Португалия',
    'Италия','Греция','Турция','Румыния','Болгария','Венгрия','Словакия','Словения','Хорватия','Сербия',
    'Босния и Герцеговина','Черногория','Албания','Северная Македония','Литва','Латвия','Эстония','Беларусь','Молдова','Грузия',
    'Армения','Азербайджан','Казахстан','США','Канада','Мексика','Бразилия','Аргентина','Япония','Южная Корея',
    'Китай','Индия','Израиль','Египет','Марокко','ЮАР','Австралия','Новая Зеландия','Другая страна'
  ];
  const extraHomes = [
    ['house-4','Студия у Александерплац','Митте',52,31,540,'Небольшая студия в многоквартирном доме.'],
    ['house-5','Комната в Веддинге','Веддинг',36,18,320,'Недорогая комната в старом жилом доме.'],
    ['house-6','Квартира в Пренцлауэр-Берге','Пренцлауэр-Берг',66,17,780,'Светлая квартира в спокойном квартале.'],
    ['house-7','Мансарда во Фридрихсхайне','Фридрихсхайн',74,43,610,'Небольшая мансарда с видом на улицу.'],
    ['house-8','Квартира в Темпельхофе','Темпельхоф',43,76,590,'Обычная квартира в жилом районе.'],
    ['house-9','Дом в Шпандау','Шпандау',10,68,980,'Отдельный дом на тихой окраине.'],
    ['house-10','Комната в Моабите','Моабит',30,28,360,'Комната с общей кухней и ванной.'],
    ['house-11','Квартира в Шёнеберге','Шёнеберг',34,66,690,'Двухкомнатная квартира недалеко от транспорта.'],
    ['house-12','Квартира в Трептове','Трептов',83,69,570,'Жильё рядом с зелёной зоной и набережной.'],
    ['house-13','Старый таунхаус в Панкове','Панков',81,9,890,'Небольшой таунхаус с внутренним двориком.'],
    ['house-14','Подвальная студия в Кройцберге','Кройцберг',48,59,410,'Скромная студия с отдельным входом.'],
    ['house-15','Комната в Нойкёльне','Нойкёльн',59,82,340,'Комната в квартире с соседями.']
  ];
  extraHomes.forEach(([id,name,district,x,y,price,description])=>locations.push({id,name,kind:'house',district,x,y,price,description}));
  // Интерьеры — отдельные локации. Они не отображаются на городской карте.
  const interiors=[];
  locations.filter(l=>l.kind==='house').forEach((home,index)=>{
    const rooms=[
      {suffix:'hall',name:'Прихожая',features:['coat-rack','door']},
      {suffix:'kitchen',name:'Кухня',features:['fridge','sink','table','kettle']},
      {suffix:'living',name:'Гостиная',features:['sofa','tv','laptop']},
      {suffix:'bedroom',name:'Спальня',features:['bed','wardrobe']},
      {suffix:'bathroom',name:'Ванная',features:['shower','mirror','sink']}
    ];
    rooms.forEach((room,ri)=>interiors.push({id:`${home.id}-${room.suffix}`,name:`${room.name} · ${home.name}`,kind:'interior',parent:home.id,district:home.district||'Берлин',x:home.x,y:home.y,private:true,map:false,features:room.features,description:`Внутреннее помещение: ${room.name.toLowerCase()}.`}));
  });
  locations.push(...interiors);
  // Служебное размещение БПСД — это не личная собственность персонажа.
  locations.push({id:'quarters-bpsd',name:'Служебный дом БПСД',kind:'quarters',district:'Митте',x:53,y:39,map:false,description:'Общее служебное здание для сотрудников, которым не полагается личное жильё.'});
  ['Общая кухня','Комната отдыха','Спальня дежурной смены','Душевая'].forEach((name,i)=>locations.push({id:`quarters-bpsd-room-${i+1}`,name:`${name} · Служебный дом БПСД`,kind:'interior',parent:'quarters-bpsd',allowedFaction:'БПСД',district:'Митте',x:53,y:39,private:true,map:false,features:[['fridge','sink','table','people'],['sofa','tv','laptop','people'],['bed','wardrobe'],['shower','sink']][i],description:`Служебное помещение: ${name.toLowerCase()}.`}));
  const deviceDefaults = {phone:'Смартфон',laptop:'Ноутбук',watch:'Наручные часы'};
  function findSpiritHost(name){
    const key=String(name||'').trim().toLocaleLowerCase('ru');
    if(!key)return null;
    return possessed.find(x=>x.spirit.toLocaleLowerCase('ru')===key)
      || walkers.find(x=>x.spirit.toLocaleLowerCase('ru')===key)
      || null;
  }
  function isSpiritAvailable(name){return !findSpiritHost(name);}

  const jobs=[
    {id:'barista',name:'Бариста',place:'cafe-k',pay:75,energy:18,desc:'Приготовление кофе и обслуживание посетителей.'},
    {id:'courier',name:'Курьер',place:'mitte',pay:95,energy:28,desc:'Доставка небольших заказов по городу.'},
    {id:'mechanic',name:'Помощник механика',place:'spandau',pay:110,energy:25,desc:'Простая работа в мастерской.'},
    {id:'cleaner',name:'Уборщик',place:'neukolln',pay:70,energy:16,desc:'Уборка помещений и дворов.'},
    {id:'security',name:'Охранник',place:'stadium',pay:105,energy:20,desc:'Контроль входа и порядка.'},
    {id:'cook',name:'Помощник повара',place:'restaurant-n',pay:90,energy:22,desc:'Подготовка продуктов и помощь на кухне.'}
  ];
  window.OD_DATA={spirits,spiritIdentityNames,possessed,walkers,orderLeader,humanNPCs,humanTeams,mixedTeams,possessedTeams,supportStaff,civilians,locations,jobs,countries,deviceDefaults,findSpiritHost,isSpiritAvailable};
})();
