/* Локальный разбор свободного ввода: игровые правила, контекст помещения и сцены. */
(function(){
  const norm=t=>(t||'').toLowerCase().replace(/[ё]/g,'е').replace(/[.,!?;:()\"«»]/g,' ').replace(/\s+/g,' ').trim();
  const aliases={
    'центр':'mitte','митте':'mitte','кройцберг':'kreuzberg','фридрихсхайн':'friedrichshain','шарлоттенбург':'charlottenburg','нейкёльн':'neukolln','нойкёльн':'neukolln','шпандау':'spandau',
    'отдел 1':'office-1','отдел номер 1':'office-1','отдел 2':'office-2','отдел номер 2':'office-2','отдел 3':'office-3','отдел 4':'office-4','отдел 5':'office-5','отдел 6':'office-6',
    'кафе':'cafe-k','ресторан':'restaurant-m','закусочная':'restaurant-n','боулинг':'bowling','дартс':'darts','стадион':'stadium','бранденбургские ворота':'landmark-gate','телебашня':'landmark-tower','галерея ист сайд':'landmark-wall','логово':'order-den','база ордена':'order-den',
    'кухня':'house-1-kitchen','гостиная':'house-1-living','спальня':'house-1-bedroom','ванная':'house-1-bathroom','прихожая':'house-1-hall'
  };
  function matchPlace(t){
    const n=norm(t),player=OD_STATE.get().player||{},home=player.home;
    // Русские падежи комнат: «на кухню», «в спальне», «в ванную» и т. п.
    const roomRules=[
      [/кухн[а-я]*/,'kitchen','quarters-bpsd-room-1'],
      [/гостин[а-я]*/,'living','quarters-bpsd-room-2'],
      [/спальн[а-я]*/,'bedroom','quarters-bpsd-room-3'],
      [/ванн[а-я]*/,'bathroom','quarters-bpsd-room-4'],
      [/прихож[а-я]*|коридор[а-я]*/,'hall',null]
    ];
    for(const [pattern,suffix,quartersRoom] of roomRules){
      if(pattern.test(n)){
        if(home)return `${home}-${suffix}`;
        if(player.faction==='БПСД'&&quartersRoom)return quartersRoom;
      }
    }
    for(const [a,id] of Object.entries(aliases)){if(n.includes(a))return id;}
    const pool=OD_DATA.locations.slice().sort((a,b)=>norm(b.name).length-norm(a.name).length);
    const place=pool.find(x=>n.includes(norm(x.name))||norm(x.name).includes(n)&&n.length>4);
    return place?.id||null;
  }
  function nearestHuman(){const st=OD_STATE.get();const pool=OD_DATA.humanNPCs.filter(p=>p.id!==st.player?.id);return pool[Math.floor(Math.random()*pool.length)];}
  function talk(text){const n=norm(text);if(!OD_WORLD.featuresAt().includes('people'))return `В локации «${OD_WORLD.getPlace(OD_STATE.get().location)?.name||'текущем помещении'}» рядом нет человека, с которым можно поговорить. Сначала перейдите в общественное место или общую комнату.`;const npc=nearestHuman();let response;
    if(/привет|здравств|добрый день|доброе утро/.test(n))response=`${npc.name} кивает: «Здравствуйте. Сейчас в городе неспокойно, будьте осторожны».`;
    else if(/бпсд|бюро|отряд|служб/.test(n))response=`${npc.name} отвечает: «БПСД занимается делами, связанными с одержимыми и ходячими. Обычной полиции такие случаи не по зубам».`;
    else if(/орден|вар/.test(n))response=`${npc.name} понижает голос: «О них лучше не говорить вслух. Говорят, их лидер — одержимый духом Войны».`;
    else if(/дух|одержим|прокаж/.test(n))response=`${npc.name} вздыхает: «После смерти тело иногда занимает дух. У каждого свой Дар, но за него приходится платить».`;
    else response=`${npc.name} выслушивает вас и отвечает: «Я не уверен, что могу помочь. В Берлине сейчас все стараются держаться ближе к знакомым».`;
    OD_STATE.update(st=>{st.relations[npc.id]=(st.relations[npc.id]||0)+2;});OD_STATE.advanceMinutes(4);OD_STATE.addLog(`Разговор с ${npc.name}: ${response}`);return response;
  }
  function findWalker(){const st=OD_STATE.get(),place=OD_WORLD.getPlace(st.location);if(st.encounter)return {ok:false,message:`Вы уже видите противника: ${st.encounter.name}. Решите, что делать дальше: отойти, наблюдать или напасть.`};
    const habitats={industrial:['промзона','заброшенный двор'],underpass:['подземный переход'],alley:['заброшенный двор','подземный переход'],danger:['лесополоса','окраина города'],district:['промзона','окраина города','заброшенный двор']};
    let allowed=habitats[place?.kind]||[];
    if(place?.id==='spandau')allowed=['промзона','окраина города','заброшенный двор'];
    if(!allowed.length)return {ok:false,message:`В локации «${place?.name||'неизвестно'}» нет подходящих условий для появления ходячего. Ищите следы в заброшенном промышленном дворе, подземном переходе, тёмном переулке или за городской чертой.`};
    const pool=OD_DATA.walkers.filter(w=>allowed.includes(w.habitat));
    if(!pool.length)return {ok:false,message:'В этой местности сейчас нет признаков активности ходячих.'};
    const walker=pool[Math.floor(Math.random()*pool.length)];const encounter={...walker,hp:Math.round(walker.hp*.72),kind:'walker'};OD_STATE.set({encounter});OD_STATE.addLog(`Вы заметили ходячего: ${walker.name}. Контакт пока не перешёл в бой.`);OD_STATE.advanceMinutes(3);
    return {ok:true,message:`Вы замечаете ${walker.name}. Существо ${walker.size} размера затаилось неподалёку. По его движениям видно, что дух уже исказил тело животного. Оно пока не бросилось на вас. Вы можете отступить, наблюдать или сознательно напасть.`};
  }
  function provoke(text){const n=norm(text);if(!OD_WORLD.featuresAt().includes('people'))return 'В этой локации рядом нет человека, которого можно спровоцировать. Сначала выйдите в общественное место или найдите NPC.';const names=OD_DATA.humanNPCs.filter(p=>n.includes(norm(p.name).split(' ')[0])||n.includes(norm(p.name)));const npc=names[0]||nearestHuman();const encounter={id:`hostile-${npc.id}`,name:npc.name,description:`Человек. ${npc.role||'Горожанин'}; после провокации настроен враждебно.`,size:'человек',hp:58,strength:34,aggression:55,ability:'Импровизированный удар',habitat:OD_WORLD.getPlace(OD_STATE.get().location)?.name||'город',kind:'human'};OD_STATE.set({encounter,sceneTarget:npc.id});OD_STATE.addLog(`Вы провоцируете ${npc.name}. Тот резко меняется в лице и требует отойти.`);return `Вы задеваете ${npc.name}. Он перестаёт улыбаться, делает шаг навстречу и сжимает кулаки: «Ты сейчас серьёзно?» Напряжение нарастает, но драка ещё не началась. Ваш следующий поступок решит, перерастёт ли конфликт в бой.`;}
  function handle(text){const n=norm(text),st=OD_STATE.get(),place=OD_WORLD.getPlace(st.location),features=OD_WORLD.featuresAt();if(!n)return 'Опишите действие словами. Например: «выхожу из квартиры на улицу», «спускаюсь на кухню и открываю холодильник», «подхожу к сотруднику и спрашиваю о деле».';
    if(/^(помощь|что делать|команды|справка)$/.test(n))return 'Это свободное текстовое RP. Пишите действия и реплики от первого лица. Можно осматриваться, разговаривать, перемещаться по доступным локациям, пользоваться устройствами и предметами. Для боя сначала обнаружьте противника или спровоцируйте конкретного человека, затем отдельно решите напасть. Переходы между комнатами доступны только через соответствующее здание.';
    if(/(какое сегодня число|какая дата|какой год|посмотреть дату|сегодняшняя дата)/.test(n)){const c=st.calendar||{year:2023,month:9,date:1};return `Сейчас ${String(c.date).padStart(2,'0')}.${String(c.month).padStart(2,'0')}.${c.year}, ${String(st.hour).padStart(2,'0')}:${String(st.minute).padStart(2,'0')}.`;}

    // Действия, которые возможны только в конкретном месте.
    if(/холодильник/.test(n)){if(!features.includes('fridge')){const kitchenId=st.player?.home?`${st.player.home}-kitchen`:(st.player?.faction==='БПСД'?'quarters-bpsd-room-1':null);if(kitchenId&&matchPlace(n)===kitchenId){const move=OD_WORLD.travel(kitchenId);if(move.ok)return `${move.message} Вы открываете холодильник на кухне. Внутри слышно ровное гудение; продукты и напитки можно проверить в инвентаре. Вы решаете, что взять?`;}return 'Здесь нет холодильника. Чтобы открыть его, нужно находиться на кухне своего жилья или служебного помещения.';}return 'Вы открываете холодильник. Внутри слышно ровное гудение; продукты и напитки можно проверить в инвентаре. Вы решаете, что взять?';}
    if(/(угон|краду|красть|ворую|украсть).*(мопед|скутер)|(мопед|скутер).*(угон|краду|украсть|забрать)/.test(n)){if(!features.includes('moped-park'))return 'В этой локации нет припаркованного мопеда. Для такого действия нужно находиться на улице возле парковки или стоянки.';OD_STATE.update(x=>{x.player.car='Мопед (не оформлен)';x.flags=x.flags||{};x.flags.stolenMoped=true;});OD_STATE.advanceMinutes(5);return 'Вы проверяете замок, быстро справляетесь с ним и откатываете мопед со стоянки. Это рискованно: поблизости есть камеры и прохожие.';}
    if(/(лечь|ложусь|засыпаю|спать|поспать)/.test(n)&&!features.includes('bed')&&!features.includes('sofa'))return 'Здесь негде нормально лечь спать. Найдите спальню с кроватью или помещение, где можно безопасно отдохнуть.';
    if(/(душ|помыться|принимаю ванну)/.test(n)&&!features.includes('shower'))return 'В этой локации нет душа или ванной. Перейдите в ванную комнату своего жилья.';
    if(/(включаю|открываю|запускаю).*(ноутбук|компьютер)|сесть за ноутбук/.test(n)){if(!features.includes('laptop')&&!features.includes('computer'))return 'Рядом нет доступного ноутбука или компьютера. Используйте собственное устройство через раздел «Устройства» либо найдите компьютер в помещении.';OD_STATE.set({device:'laptop'});return 'Вы открываете ноутбук. На экране появляется рабочий стол с браузером, почтой и локальными закладками. Раздел «Устройства» покажет доступные сайты.';}
    if(/(выпить|попить|жажда|вода)/.test(n)){const r=OD_SURVIVAL.drink();return r.message;}
    if(/(съесть|поесть|перекус|голод|еда|сэндвич)/.test(n)){const r=OD_SURVIVAL.eat();return r.message;}
    if(/(спать|поспать|лечь|отдохнуть|сон)/.test(n)){const r=OD_SURVIVAL.rest();return r.message;}
    if(/(минерал|смесь для регенерации)/.test(n)){const r=OD_SURVIVAL.useMineral();return r.message;}
    if(/(тренир|спорт|побегать|отжим|подтяг|штанг|бокс|разминк)/.test(n)){const r=OD_SURVIVAL.train(text);return r.message;}
    if(/(работать|поработать|смена|заработать|устроиться на работу)/.test(n)){const r=OD_SURVIVAL.work();return r.message;}
    if(/(ищу|разыскиваю|пытаюсь найти|выслеживаю).*(ходяч|существ|звер)|ищу ходячего|осматриваю опасный двор|проверяю темный переулок/.test(n))return findWalker().message;
    if(/(провоцирую|угрожаю|оскорбляю|толкаю|цепляюсь к)/.test(n)){if(st.encounter)return `Вы уже находитесь рядом с противником ${st.encounter.name}. Ситуация и без того напряжена.`;return provoke(text);}
    if(/не\s+(?:напада|атак|ударя|стреля|дерусь|сражаюсь)|не хочу драться|не собираюсь нападать/.test(n))return 'Вы решаете не переходить к насилию. Напряжение сохраняется, но вы не начинаете драку.';
    if(/(напад|атак|удар|стреля|бью его|начать бой|начинаю бой|драк|сразит)/.test(n)){if(!st.encounter)return 'Вы не можете начать бой из пустоты: рядом нет конкретного противника. Сначала найдите ходячего, подойдите к персонажу или спровоцируйте конфликт. После этого можно решить, нападать ли.';const r=OD_COMBAT.start();return r.message;}
    if(/(отступаю|ухожу от него|пытаюсь скрыться|убегаю)/.test(n)&&st.encounter){OD_STATE.set({encounter:null,sceneTarget:null});OD_STATE.advanceMinutes(2);return 'Вы не провоцируете столкновение и отходите на безопасное расстояние. Противник остаётся позади.';}
    if(/(карта|где я|осмотреть город|посмотреть окрестности)/.test(n))return `Вы находитесь в локации «${place?.name||'неизвестно'}». ${place?.description||''} Откройте карту или список ближайших переходов, чтобы переместиться.`;
    if(/(инвентарь|что у меня есть|вещи)/.test(n)){const inv=st.inventory.map(i=>`${i.name} ×${i.qty}`).join(', ')||'пусто';return `В вашем инвентаре: ${inv}.`;}
    if(/(статус|характеристик|самочувств|состояние)/.test(n))return `Здоровье ${Math.round(st.needs.health)}%, энергия ${Math.round(st.needs.energy)}%, голод ${Math.round(st.needs.hunger)}%, жажда ${Math.round(st.needs.thirst)}%. Деньги: ${st.money} €.`;
    if(/(поговор|спросить|обратиться|поздороваться|диалог|говорю с)/.test(n))return talk(text);
    if(/(осмотреть|исследовать|обыскать|проверить)/.test(n)){OD_STATE.advanceMinutes(12);const roll=Math.random();if(roll<.20){OD_STATE.addItem('mineral','Минеральная смесь',1);OD_STATE.addLog('Во время осмотра вы нашли минеральную смесь.');return 'Вы внимательно осматриваете доступное пространство и находите небольшую упаковку минеральной смеси.';}if(roll<.38){OD_STATE.addItem('water','Бутылка воды',1);return 'В шкафчике или ящике обнаруживается целая бутылка воды.';}return 'Вы осматриваете доступную часть помещения. Ничего ценного не находите, но замечаете свежие следы и несколько деталей, которые раньше ускользали от внимания.';}
    if(/(позвон|телефон|сообщени)/.test(n)){OD_STATE.set({device:'phone'});OD_STATE.advanceMinutes(2);return 'Вы проверяете телефон. Связь работает, но новых важных сообщений пока нет. Откройте раздел «Устройства», чтобы посмотреть сообщения и приложения.';}
    if(/(часы|который час|время)/.test(n))return `Вы смотрите на часы: ${String(st.hour).padStart(2,'0')}:${String(st.minute).padStart(2,'0')}, ${String(st.calendar.date).padStart(2,'0')}.${String(st.calendar.month).padStart(2,'0')}.${st.calendar.year}.`;
    if(/(сесть|сидеть|ждать|подождать)/.test(n)){OD_STATE.advanceMinutes(30);return 'Вы некоторое время ждёте. Время проходит, люди вокруг занимаются своими делами.';}

    const pid=matchPlace(n);if(pid){const r=OD_WORLD.travel(pid);return r.message;}
    if(/(выйти на улицу|выхожу из дома|покинуть квартиру)/.test(n)&&place?.kind==='interior'){const r=OD_WORLD.travel(place.parent);return r.message;}
    if(/(на улицу|выйти наружу|покинуть здание)/.test(n)&&place?.kind==='house')return 'Вы уже находитесь у входа в здание. Выберите ближайшую улицу или район на карте.';
    if(/(поговор|спросить|обратиться|поздороваться|диалог)/.test(n))return talk(text);
    OD_STATE.advanceMinutes(2);return `Вы пытаетесь это сделать в локации «${place?.name||'неизвестно'}». Я не буду автоматически превращать действие в успех: уточните, к чему вы подходите, с кем взаимодействуете и что именно пытаетесь получить. Напишите «помощь», чтобы увидеть примеры.`;
  }
  window.OD_INTERPRETER={handle,talk,matchPlace,norm,findWalker,provoke};
})();
