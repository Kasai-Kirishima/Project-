/* Состояние, сохранение и общие функции. */
(function(){
  const KEY='oderzhimye-save-v1';
  const defaultStats={strength:12,agility:12,endurance:12,intellect:12,perception:12,will:12,combat:10,medicine:5,stealth:5,charisma:10};
  function freshState(){return {
    version:1,step:'landing',characterType:null,player:null,started:false,startMode:null,
    stats:{...defaultStats},needs:{hunger:90,thirst:90,energy:90,health:100,sanity:100,minerals:90},money:250,
    inventory:[{id:'water',name:'Бутылка воды',qty:2},{id:'sandwich',name:'Сэндвич',qty:2},{id:'bandage',name:'Бинт',qty:2},{id:'mineral',name:'Минеральная смесь',qty:1}],
    location:'mitte',day:1,hour:8,minute:0,teamId:null,jobId:null,log:['Вы начинаете новую историю в Берлине.'],history:[],relations:{},visited:['mitte'],flags:{interviewDone:false,firstBriefing:false,orderIntro:false},
    combat:null,training:{sessions:0,lastResult:'Пока тренировок не было.'},mapFilter:'all',
    discovered:{'mitte':true,'kreuzberg':true,'friedrichshain':true,'charlottenburg':true,'neukolln':true,'spandau':true}
  };}
  let state=freshState();
  function load(){try{const raw=localStorage.getItem(KEY);if(raw){const parsed=JSON.parse(raw);state={...freshState(),...parsed,stats:{...defaultStats,...(parsed.stats||{})},needs:{...freshState().needs,...(parsed.needs||{})}};}}catch(e){console.warn('Не удалось прочитать сохранение',e);}}
  function save(){try{localStorage.setItem(KEY,JSON.stringify(state));return true;}catch(e){console.warn('Не удалось сохранить игру',e);return false;}}
  function reset(){state=freshState();save();return state;}
  function get(){return state;}
  function set(patch){state={...state,...patch};save();return state;}
  function update(fn){fn(state);save();return state;}
  function addLog(message){state.log.unshift(`[День ${state.day}, ${String(state.hour).padStart(2,'0')}:${String(state.minute).padStart(2,'0')}] ${message}`);state.log=state.log.slice(0,80);save();}
  function advanceMinutes(n){let total=state.hour*60+state.minute+n;while(total>=1440){total-=1440;state.day++;}state.hour=Math.floor(total/60);state.minute=total%60;const hours=n/60;state.needs.hunger=Math.max(0,state.needs.hunger-hours*1.5);state.needs.thirst=Math.max(0,state.needs.thirst-hours*2.3);state.needs.energy=Math.max(0,state.needs.energy-hours*0.8);if(state.needs.hunger<15||state.needs.thirst<15){state.needs.health=Math.max(5,state.needs.health- Math.max(0,15-state.needs.hunger)*0.018 - Math.max(0,15-state.needs.thirst)*0.035);}if(state.player?.type==='Одержимый'){state.needs.minerals=Math.max(0,(state.needs.minerals??90)-hours*1.4);if(state.needs.minerals<12)state.needs.health=Math.max(5,state.needs.health-hours*0.22);else if(state.needs.minerals>45&&state.needs.health<100)state.needs.health=Math.min(100,state.needs.health+hours*0.08);}save();}
  function addItem(id,name,qty=1){let item=state.inventory.find(x=>x.id===id);if(item)item.qty+=qty;else state.inventory.push({id,name,qty});save();}
  function removeItem(id,qty=1){const item=state.inventory.find(x=>x.id===id);if(!item||item.qty<qty)return false;item.qty-=qty;if(item.qty<=0)state.inventory=state.inventory.filter(x=>x.id!==id);save();return true;}
  function findItem(id){return state.inventory.find(x=>x.id===id)||null;}
  window.OD_STATE={load,save,reset,get,set,update,addLog,advanceMinutes,addItem,removeItem,findItem,freshState};
})();
