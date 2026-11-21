/* Потребности, тренировки и экономика. */
(function(){
  function consume(itemId,need,amount,log){const s=OD_STATE.get();const item=OD_STATE.findItem(itemId);if(!item||item.qty<1)return {ok:false,message:'У вас нет этого предмета.'};OD_STATE.removeItem(itemId,1);OD_STATE.update(st=>{st.needs[need]=Math.min(100,st.needs[need]+amount);});OD_STATE.advanceMinutes(5);OD_STATE.addLog(log);return {ok:true,message:log};}
  function eat(){return consume('sandwich','hunger',35,'Вы перекусили. Голод отступил.');}
  function drink(){return consume('water','thirst',40,'Вы выпили воды. Жажда утолена.');}
  function rest(){const s=OD_STATE.get();OD_STATE.advanceMinutes(420);OD_STATE.update(st=>{st.needs.energy=100;st.needs.health=Math.min(100,st.needs.health+12);st.needs.sanity=Math.min(100,st.needs.sanity+8);});OD_STATE.addLog('Вы отдохнули несколько часов.');return {ok:true,message:'Вы отдохнули. Энергия восстановлена.'};}
  function findJob(id){return OD_DATA.jobs.find(j=>j.id===id)||null;}
  function canWork(){const f=OD_STATE.get().player?.faction;return !f||f==='Без фракции';}
  function takeJob(id){if(!canWork())return {ok:false,message:'Обычная работа доступна только персонажам без фракции.'};const job=findJob(id);if(!job)return {ok:false,message:'Вакансия не найдена.'};OD_STATE.set({jobId:id});OD_STATE.addLog(`Вы устроились на работу: ${job.name}.`);return {ok:true,message:`Вы устроились: ${job.name}. Оплата за смену — ${job.pay} €.`,job};}
  function work(){const s=OD_STATE.get();if(!canWork())return {ok:false,message:'Ваша служба или принадлежность к фракции не позволяет брать обычные смены.'};let job=findJob(s.jobId);if(!job){job=OD_DATA.jobs[Math.floor(Math.random()*OD_DATA.jobs.length)];OD_STATE.set({jobId:job.id});}if(s.needs.energy<job.energy)return {ok:false,message:'Вы слишком устали для смены. Сначала отдохните.'};OD_STATE.advanceMinutes(240);OD_STATE.update(st=>{st.money+=job.pay;st.needs.energy=Math.max(0,st.needs.energy-job.energy);st.needs.hunger=Math.max(0,st.needs.hunger-8);st.needs.thirst=Math.max(0,st.needs.thirst-12);});OD_STATE.addLog(`Вы отработали смену «${job.name}» и получили ${job.pay} €.`);return {ok:true,message:`Смена окончена. Вы заработали ${job.pay} €.`,job};}
  function buy(id){const s=OD_STATE.get();const shop=[{id:'sandwich',name:'Сэндвич',price:8,qty:1},{id:'water',name:'Бутылка воды',price:4,qty:1},{id:'mineral',name:'Минеральная смесь',price:22,qty:1},{id:'bandage',name:'Бинт',price:15,qty:1},{id:'medkit',name:'Аптечка',price:55,qty:1}];const item=shop.find(x=>x.id===id);if(!item)return {ok:false,message:'Такого товара нет.'};if(s.money<item.price)return {ok:false,message:'Недостаточно денег.'};OD_STATE.update(st=>{st.money-=item.price;const existing=st.inventory.find(x=>x.id===item.id);if(existing)existing.qty+=item.qty;else st.inventory.push({id:item.id,name:item.name,qty:item.qty});});OD_STATE.addLog(`Покупка: ${item.name} за ${item.price} €.`);return {ok:true,message:`Куплено: ${item.name}.`};}
  function train(description){const s=OD_STATE.get();const d=(description||'').toLowerCase();if(!d.trim())return {ok:false,message:'Опишите тренировку: например, «30 минут бегал, сделал 20 отжиманий и растяжку».'};if(s.needs.energy<12)return {ok:false,message:'Вы слишком устали. Отдохните перед тренировкой.'};
    const gains={};let minutes=30;let labels=[];
    const add=(skill,points,label,extraMinutes)=>{gains[skill]=(gains[skill]||0)+points;labels.push(label);minutes+=extraMinutes;};
    const has=(...words)=>words.some(w=>d.includes(w));
    if(has('бег','кардио','велосипед','плав','ходьб'))add('endurance',2,'выносливость',20);
    if(has('отжим','подтяг','жим','штанг','гантел','присед','силов'))add('strength',2,'сила',25);
    if(has('растяж','йог','гибк','мобил'))add('agility',1,'гибкость и подвижность',10);
    if(has('бокс','спарр','удар','борьб','единобор'))add('combat',2,'боевые навыки',25);
    if(has('медитац','дых','концентр'))add('will',1,'самоконтроль',10);
    if(!Object.keys(gains).length)add('endurance',1,'общая физическая подготовка',0);
    if(d.split(/\s+/).filter(Boolean).length>12){const main=Object.keys(gains).sort((a,b)=>gains[b]-gains[a])[0];gains[main]++;}
    const totalPoints=Object.values(gains).reduce((a,b)=>a+b,0);const cost=Math.min(65,12+Math.floor(minutes/3));
    const result=Object.entries(gains).map(([skill,points])=>`${({strength:'сила',agility:'ловкость',endurance:'выносливость',combat:'боевые навыки',will:'воля'}[skill]||skill)} +${points}`).join(' · ');
    OD_STATE.advanceMinutes(minutes);OD_STATE.update(st=>{Object.entries(gains).forEach(([skill,points])=>{st.stats[skill]=(st.stats[skill]||10)+points;});st.needs.energy=Math.max(0,st.needs.energy-cost);st.needs.thirst=Math.max(0,st.needs.thirst-10);st.needs.hunger=Math.max(0,st.needs.hunger-6);st.training.sessions++;st.training.lastResult=`${result}. Длительность: ${minutes} мин.`;});
    OD_STATE.addLog(`Тренировка: ${labels.join(', ')}. Развитие: ${result}.`);return {ok:true,message:`Тренировка оценена. ${result}. Затрачено энергии: ${cost}.`};
  }
  function useMineral(){const s=OD_STATE.get();if(s.player?.type!=='Одержимый')return {ok:false,message:'Минеральная смесь нужна только одержимым.'};if(!OD_STATE.removeItem('mineral',1))return {ok:false,message:'Минеральной смеси нет.'};OD_STATE.update(st=>{st.needs.health=Math.min(100,st.needs.health+8);st.needs.energy=Math.min(100,st.needs.energy+10);st.needs.minerals=Math.min(100,(st.needs.minerals??0)+40);});OD_STATE.addLog('Вы приняли минеральную смесь.');return {ok:true,message:'Минеральная смесь усвоена. Восстановлены здоровье, энергия и запас минералов.'};}
  window.OD_SURVIVAL={eat,drink,rest,canWork,takeJob,work,buy,train,useMineral,findJob};
})();
