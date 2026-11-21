/* Локальный интерпретатор свободного ввода. Это набор эвристик, а не облачная нейросеть. */
(function(){
  const norm=t=>(t||'').toLowerCase().replace(/[ё]/g,'е').replace(/[.,!?;:()"«»]/g,' ').replace(/\s+/g,' ').trim();
  const places=()=>OD_WORLD.visibleLocations();
  const aliases={
    'центр':'mitte','митте':'mitte','кройцберг':'kreuzberg','фридрихсхайн':'friedrichshain','шарлоттенбург':'charlottenburg','нейкёльн':'neukolln','нойкёльн':'neukolln','шпандау':'spandau',
    'отдел 1':'office-1','отдел номер 1':'office-1','отдел 2':'office-2','отдел номер 2':'office-2','отдел 3':'office-3','отдел 4':'office-4','отдел 5':'office-5','отдел 6':'office-6',
    'кафе':'cafe-k','кофейный круг':'cafe-k','ресторан':'restaurant-m','старый мост':'restaurant-m','ночная смена':'restaurant-n','боулинг':'bowling','дартс':'darts','стадион':'stadium','олимпийский стадион':'stadium','ворота':'landmark-gate','бранденбургские ворота':'landmark-gate','телебашня':'landmark-tower','стена':'landmark-wall','галерея ист сайд':'landmark-wall','дом':'house-1','квартира':'house-1','логово':'order-den','база ордена':'order-den'
  };
  function matchPlace(t){const n=norm(t);for(const [a,id] of Object.entries(aliases)){if(n.includes(a))return id;}const p=places().find(x=>n.includes(norm(x.name)));return p?.id||null;}
  function nearestHuman(){const s=OD_STATE.get();const pool=OD_DATA.humanNPCs.filter(p=>p.id!==s.player?.id);return pool[Math.floor(Math.random()*pool.length)];}
  function talk(text){const n=norm(text);const npc=nearestHuman();let response;
    if(/привет|здравств|добрый день|доброе утро/.test(n))response=`${npc.name} кивает: «Здравствуйте. Сейчас в городе неспокойно, будьте осторожны».`;
    else if(/бпсд|бюро|отряд|служб/.test(n))response=`${npc.name} отвечает: «БПСД занимается делами, связанными с одержимыми и ходячими. Обычной полиции такие случаи не по зубам».`;
    else if(/орден|вар/.test(n))response=`${npc.name} понижает голос: «О них лучше не говорить вслух. Говорят, их лидер — одержимый духом Войны».`;
    else if(/дух|одержим|прокаж/.test(n))response=`${npc.name} вздыхает: «После смерти тело иногда занимает дух. У каждого свой Дар, но за него приходится платить».`;
    else response=`${npc.name} выслушивает вас и отвечает: «Я не уверен, что могу помочь. В Берлине сейчас все стараются держаться ближе к знакомым».`;
    OD_STATE.update(s=>{s.relations[npc.id]=(s.relations[npc.id]||0)+2;});OD_STATE.advanceMinutes(4);OD_STATE.addLog(`Разговор с ${npc.name}: ${response}`);return response;
  }
  function handle(text){const n=norm(text);if(!n)return 'Напишите действие своими словами. Например: «иду в кафе», «хочу поесть», «поговорить с прохожим», «потренироваться».';
    if(/^(помощь|что делать|команды|справка)$/.test(n))return 'Можно писать обычными фразами: «иду в кафе», «выпить воды», «поесть», «лечь спать», «поговорить», «устроиться на работу», «поработать смену», «начать тренировку», «осмотреться», «начать бой». Также используйте кнопки карты и действий.';
    if(/(съесть|поесть|перекус|голод|еда|сэндвич)/.test(n)){const r=OD_SURVIVAL.eat();return r.message;}
    if(/(выпить|попить|жажда|вода)/.test(n)){const r=OD_SURVIVAL.drink();return r.message;}
    if(/(спать|поспать|лечь|отдохнуть|сон)/.test(n)){const r=OD_SURVIVAL.rest();return r.message;}
    if(/(минерал|смесь для регенерации)/.test(n)){const r=OD_SURVIVAL.useMineral();return r.message;}
    if(/(тренир|спорт|побегать|отжим|подтяг|штанг|бокс|разминк)/.test(n)){const r=OD_SURVIVAL.train(text);return r.message;}
    if(/(работать|поработать|смена|заработать|устроиться на работу)/.test(n)){const r=OD_SURVIVAL.work();return r.message;}
    if(/(начать бой|атак|напасть|сразиться|драться|в бой)/.test(n)){const r=OD_COMBAT.start();return r.message;}
    if(/(карта|где я|осмотреть город|посмотреть окрестности)/.test(n)){return `Вы находитесь в районе «${OD_WORLD.getPlace(OD_STATE.get().location).name}». Откройте вкладку «Карта», чтобы увидеть доступные места.`;}
    if(/(инвентарь|что у меня есть|вещи)/.test(n)){const inv=OD_STATE.get().inventory.map(i=>`${i.name} ×${i.qty}`).join(', ')||'пусто';return `В вашем инвентаре: ${inv}.`;}
    if(/(статус|характеристик|самочувств|состояние)/.test(n)){const s=OD_STATE.get();return `Здоровье ${Math.round(s.needs.health)}%, энергия ${Math.round(s.needs.energy)}%, голод ${Math.round(s.needs.hunger)}%, жажда ${Math.round(s.needs.thirst)}%. Деньги: ${s.money} €.`;}
    const pid=matchPlace(n);if(pid){const p=OD_WORLD.getPlace(pid);if(p?.hidden&&OD_STATE.get().player?.faction!=='Орден')return 'Вы не знаете, где находится это место.';const r=OD_WORLD.travel(pid);return r.message;}
    if(/(поговор|спросить|обратиться|поздороваться|диалог)/.test(n))return talk(text);
    if(/(осмотреть|исследовать|обыскать|проверить)/.test(n)){OD_STATE.advanceMinutes(12);const roll=Math.random();if(roll<.25){OD_STATE.addItem('mineral','Минеральная смесь',1);OD_STATE.addLog('Во время осмотра вы нашли минеральную смесь.');return 'Вы внимательно осмотрели место и нашли небольшую упаковку минеральной смеси.';}if(roll<.48){OD_STATE.addItem('water','Бутылка воды',1);return 'В ящике нашлась целая бутылка воды.';}return 'Вы осмотрели окрестности, но ничего ценного не обнаружили. Зато заметили несколько свежих следов.';}
    if(/(позвон|телефон|сообщени)/.test(n)){OD_STATE.advanceMinutes(2);return 'Вы проверяете телефон. Связь нестабильна, новых сообщений нет.';}
    if(/(сесть|сидеть|ждать|подождать)/.test(n)){OD_STATE.advanceMinutes(30);return 'Вы некоторое время ждёте. Город живёт своей обычной, тревожной жизнью.';}
    OD_STATE.advanceMinutes(2);return 'Вы пытаетесь это сделать, но окружающая обстановка не даёт однозначного результата. Уточните действие, поговорите с кем-нибудь или осмотритесь. Напишите «помощь», чтобы увидеть примеры.';
  }
  window.OD_INTERPRETER={handle,talk,matchPlace,norm};
})();
