/* Карта, контекст локаций и ограниченное перемещение. */
(function(){
  const D=()=>window.OD_DATA;
  const state=()=>OD_STATE.get();
  function visibleLocations(){const s=state();return D().locations.filter(l=>l.map!==false&&(!l.hidden||s.player?.faction==='Орден'));}
  function getPlace(id){return D().locations.find(x=>x.id===id)||null;}
  function canEnter(place){const s=state(),p=s.player||{},current=getPlace(s.location);
    if(place.hidden&&p.faction!=='Орден')return {ok:false,message:'Это место скрыто. Вы не знаете, где оно находится.'};
    if(place.kind==='house'&&place.id!==p.home)return {ok:false,message:'Это частное жильё. У вас нет ключей и разрешения войти.'};
    if(place.kind==='quarters'&&p.faction!=='БПСД')return {ok:false,message:'Служебный дом доступен только сотрудникам БПСД.'};
    if(place.private){const homeId=place.parent;const allowedByFaction=place.allowedFaction&&p.faction===place.allowedFaction;if(p.home!==homeId&&!allowedByFaction&&p.faction!=='Орден')return {ok:false,message:'Это закрытое частное помещение. У вас нет доступа.'};if(!(s.location===homeId||current?.parent===homeId))return {ok:false,message:'Сначала нужно войти в здание, а затем перейти в нужную комнату.'};}
    if(place.kind==='order'&&p.faction!=='Орден')return {ok:false,message:'Вы не состоите в Ордене и не можете попасть в его логово.'};
    return {ok:true};
  }
  function travel(id){const s=state(),place=getPlace(id);if(!place)return {ok:false,message:'Такой локации не существует.'};if(place.id===s.location)return {ok:false,message:'Вы уже находитесь здесь.'};
    const access=canEnter(place);if(!access.ok)return access;
    const from=getPlace(s.location)||{x:50,y:50};
    const distance=Math.max(1,Math.round(Math.hypot((place.x-from.x),(place.y-from.y))/8));
    OD_STATE.set({location:id,encounter:null,sceneTarget:null});OD_STATE.advanceMinutes(distance*7);
    OD_STATE.update(st=>{if(!st.visited.includes(id))st.visited.push(id);});
    OD_STATE.addLog(`Вы переместились в локацию: ${place.name}.`);
    return {ok:true,message:`Вы добрались до места «${place.name}». Дорога заняла около ${distance*7} минут.`,place};
  }
  function getLocalExits(){const s=state(),current=getPlace(s.location);if(!current)return [];
    if(current.kind==='house'||current.kind==='quarters')return D().locations.filter(l=>l.private&&l.parent===current.id&&(l.allowedFaction==null||l.allowedFaction===s.player?.faction));
    if(current.private){const parent=getPlace(current.parent);return [parent,...D().locations.filter(l=>l.private&&l.parent===current.parent&&l.id!==current.id)].filter(Boolean);}
    return visibleLocations().filter(p=>{
      if(p.id===current.id||p.kind==='house'&&p.id!==s.player?.home)return false;
      const d=Math.hypot(p.x-current.x,p.y-current.y);
      return d<=24 && !p.private;
    }).sort((a,b)=>Math.hypot(a.x-current.x,a.y-current.y)-Math.hypot(b.x-current.x,b.y-current.y)).slice(0,8);
  }
  function featuresAt(id=state().location){const p=getPlace(id);if(!p)return [];if(p.features)return p.features.slice();
    const defaults={cafe:['food','drink','counter','people'],restaurant:['food','drink','counter','people'],bowling:['bowling','people'],darts:['darts','people'],stadium:['running','people'],office:['desk','computer','people','first-aid'],street:['street','traffic','moped-park','people'],district:['street','people','shops'],landmark:['sightseeing','people'],order:['meeting-room','computer','people'],industrial:['street'],underpass:['street'],alley:['street','moped-park','people'],danger:['street']};return defaults[p.kind]||[];
  }
  function canDo(feature){return featuresAt().includes(feature);}
  function mapSVG(){const s=state(),points=visibleLocations();let markers=points.map(p=>{let color=({office:'#e7b45c',order:'#c35b6b',cafe:'#6eaa91',restaurant:'#d29a66',bowling:'#8f8bd2',darts:'#9a8b68',stadium:'#78a5c8',landmark:'#c9bd8b',house:'#8ca8ba',district:'#8698a5',street:'#9ca8a4',industrial:'#9a7961',underpass:'#73818d',alley:'#8b7770',danger:'#a64d4d'})[p.kind]||'#aaa';return `<g class="map-point" data-place="${p.id}" tabindex="0" role="button" aria-label="${p.name}"><circle cx="${p.x}" cy="${p.y}" r="${p.kind==='office'?1.8:1.3}" fill="${color}" stroke="#17202a" stroke-width=".45"/><title>${p.name}</title></g>`}).join('');
    return `<svg class="berlin-map" viewBox="0 0 100 100" role="img" aria-label="Схематичная карта Берлина и окрестностей"><defs><pattern id="grid" width="5" height="5" patternUnits="userSpaceOnUse"><path d="M 5 0 L 0 0 0 5" fill="none" stroke="#31404a" stroke-width=".12"/></pattern></defs><rect width="100" height="100" fill="#1a2931"/><rect width="100" height="100" fill="url(#grid)"/><path d="M4 22 Q25 10 42 19 T82 18 Q96 25 95 43 Q85 59 92 75 Q69 94 45 86 Q23 94 7 76Z" fill="#243b3e" stroke="#48665e" stroke-width=".7"/><path d="M2 48 Q22 42 36 48 T65 46 T98 52 M16 5 Q24 24 30 39 T43 93 M57 2 Q51 27 61 46 T58 97 M84 5 Q74 30 79 47 T84 91" stroke="#708a86" stroke-width=".65" fill="none" opacity=".9"/><path d="M12 36 Q34 28 48 35 T83 32 M8 66 Q29 54 48 63 T89 66 M23 15 Q40 42 53 58 T70 86" stroke="#c0a77a" stroke-width=".35" fill="none" stroke-dasharray="1.5 1.5"/><text x="50" y="96" fill="#8fa29e" font-size="2.5" text-anchor="middle">БЕРЛИН · 2023 · СХЕМА</text>${markers}</svg>`;
  }
  function getNearby(){return getLocalExits();}
  window.OD_WORLD={visibleLocations,travel,getPlace,mapSVG,getNearby,getLocalExits,featuresAt,canDo,canEnter};
})();
