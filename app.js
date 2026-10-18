/* Spire Atlas · V1.01 — a static, privacy-friendly Slay the Spire 2 fan companion.
   Live monster data: https://github.com/ptrlrd/spire-codex (see README for attribution).
   All user input is stored locally; this app cannot read your in-game save/map. */
(() => {
  'use strict';
  const STORE = 'spire-atlas-run-v1';
  const DB_CACHE = 'spire-atlas-enemies-v1';
  const DATA_URLS = [
    'https://raw.githubusercontent.com/ptrlrd/spire-codex/main/data/eng/monsters.json',
    'https://spire-codex.com/api/monsters?lang=eng'
  ];
  const REGIONS = [
    { id:'overgrowth', name:'The Overgrowth', act:'ACT I', actNumber:1, short:'Overgrowth', start:1, end:17, desc:'A living labyrinth of tangled growth and restless creatures.', image:'assets/overgrowth.svg', color:'#6ea77b' },
    { id:'underdocks', name:'The Underdocks', act:'ACT I', actNumber:1, short:'Underdocks', start:1, end:17, desc:'A drowned maze of creaking piers and lurking deep-sea predators.', image:'assets/underdocks.svg', color:'#72bbcb' },
    { id:'hive', name:'The Hive', act:'ACT II', actNumber:2, short:'Hive', start:18, end:33, desc:'An amber-lit colony alive with swarming dangers.', image:'assets/hive.svg', color:'#d4a25b' },
    { id:'glory', name:'Glory', act:'ACT III', actNumber:3, short:'Glory', start:34, end:49, desc:'A monumental ascent through clockwork ruins and lost grandeur.', image:'assets/glory.svg', color:'#b5a2cc' }
  ];
  const ROOMS = [
    { id:'Monster', icon:'⚔', label:'Monster' }, { id:'Elite', icon:'♛', label:'Elite' },
    { id:'Rest', icon:'♨', label:'Rest' }, { id:'Merchant', icon:'⚖', label:'Shop' },
    { id:'Event', icon:'?', label:'Unknown' }, { id:'Treasure', icon:'⬡', label:'Chest' },
    { id:'Boss', icon:'♜', label:'Boss' }, { id:'Ancient', icon:'✧', label:'Ancient' }
  ];
  const SAMPLE = [
    { id:'AXE_RUBY_RAIDER', name:'Axe Raider', type:'Normal', min_hp:20,max_hp:22, min_hp_ascension:21,max_hp_ascension:23, encounters:[{act:'Act 1 - Overgrowth'}], image_url:'/static/images/monsters/axe_ruby_raider.webp', moves:[{id:'SWING_1',name:'Swing 1',intent:'Attack + Defend',damage:{normal:5,ascension:6},block:5},{id:'SWING_2',name:'Swing 2',intent:'Attack + Defend',damage:{normal:5,ascension:6},block:5},{id:'BIG_SWING',name:'Big Swing',intent:'Attack',damage:{normal:12,ascension:13}}], attack_pattern:{type:'cycle',initial_move:'SWING_1',description:'Swing 1 → Swing 2 → Big Swing → repeat',states:[{id:'SWING_1',type:'move',move_id:'SWING_1',next:'SWING_2'},{id:'SWING_2',type:'move',move_id:'SWING_2',next:'BIG_SWING'},{id:'BIG_SWING',type:'move',move_id:'BIG_SWING',next:'SWING_1'}]} },
    { id:'BYGONE_EFFIGY', name:'Bygone Effigy',type:'Elite',min_hp:127, min_hp_ascension:132,encounters:[{act:'Act 1 - Overgrowth'}],image_url:'/static/images/monsters/bygone_effigy.webp',moves:[{id:'SLEEP',name:'Sleep',intent:'Sleep'},{id:'WAKE',name:'Wake',intent:'Buff',powers:[{power_id:'STRENGTH',amount:10,target:'self'}]},{id:'SLASHES',name:'Slashes',intent:'Attack',damage:{normal:13,ascension:15}}],attack_pattern:{type:'conditional', initial_move:'SLEEP', description:'Starts asleep; subsequent moves depend on its state.',states:[]} },
    { id:'BOWLBUG_ROCK',name:'Bowlbug (Rock)',type:'Normal',min_hp:45,max_hp:48,min_hp_ascension:46,max_hp_ascension:49,encounters:[{act:'Act 2 - Hive'}], image_url:'/static/images/monsters/bowlbug_rock.webp', moves:[{id:'HEADBUTT',name:'Headbutt',intent:'Attack',damage:{normal:15,ascension:16}},{id:'DIZZY',name:'Dizzy',intent:'Stun'}],attack_pattern:{type:'conditional', initial_move:'HEADBUTT',description:'Starts with Headbutt',states:[]} },
    { id:'BOWLBUG_NECTAR',name:'Bowlbug (Nectar)',type:'Normal',min_hp:35,max_hp:38,min_hp_ascension:36,max_hp_ascension:39,encounters:[{act:'Act 2 - Hive'}],image_url:'/static/images/monsters/bowlbug_nectar.webp',moves:[{id:'THRASH',name:'Thrash',intent:'Attack',damage:{normal:3}},{id:'BUFF',name:'Buff',intent:'Buff',powers:[{power_id:'STRENGTH',amount:15,target:'self'}]},{id:'THRASH2',name:'Thrash2',intent:'Attack',damage:{normal:3}}],attack_pattern:{type:'cycle',initial_move:'THRASH',description:'Thrash → Buff → Thrash2',states:[{id:'THRASH_MOVE',type:'move',move_id:'THRASH',next:'BUFF_MOVE'},{id:'BUFF_MOVE',type:'move',move_id:'BUFF',next:'THRASH2_MOVE'},{id:'THRASH2_MOVE',type:'move',move_id:'THRASH2',next:'THRASH2_MOVE'}]} },
    { id:'AEONGLASS',name:'Aeonglass',type:'Boss',min_hp:512,min_hp_ascension:535,encounters:[{act:'Act 3 - Glory'}],image_url:'/static/images/monsters/aeonglass.webp', moves:[{id:'EBB',name:'Ebb',intent:'Attack + Defend',block:33,damage:{normal:26,ascension:32}},{id:'EYE_LASERS',name:'Eye Lasers',intent:'Attack',damage:{normal:11,ascension:12,hit_count:2}},{id:'INCREASING_INTENSITY',name:'Increasing Intensity',intent:'Status + Buff'}],attack_pattern:{type:'cycle',initial_move:'EBB',description:'Ebb → Eye Lasers → Increasing Intensity → repeat',states:[{id:'EBB_MOVE',type:'move',move_id:'EBB',next:'EYE_LASERS_MOVE'},{id:'EYE_LASERS_MOVE',type:'move',move_id:'EYE_LASERS',next:'INCREASING_INTENSITY_MOVE'},{id:'INCREASING_INTENSITY_MOVE',type:'move',move_id:'INCREASING_INTENSITY',next:'EBB_MOVE'}]} },
    { id:'AXEBOT',name:'Axebot',type:'Normal',min_hp:70,max_hp:78,min_hp_ascension:76,max_hp_ascension:86,encounters:[{act:'Act 3 - Glory'}],image_url:'/static/images/monsters/axebot.webp',moves:[{id:'BOOT_UP',name:'Boot Up',intent:'Defend + Buff',block:10,powers:[{power_id:'STRENGTH',target:'self',amount:3}]},{id:'ONE_TWO',name:'One Two',intent:'Attack',damage:{normal:9,ascension:10,hit_count:2}},{id:'HAMMER_UPPERCUT',name:'Hammer Uppercut',intent:'Attack + Debuff',damage:{normal:12,ascension:14},powers:[{power_id:'WEAK',target:'player',amount:2},{power_id:'FRAIL',target:'player',amount:2}]}],attack_pattern:{type:'conditional',initial_move:'BOOT_UP',description:'Boot Up is the documented opener; later transitions require checking the in-game intent.'}},
    { id:'WATERFALL_GIANT',name:'Waterfall Giant',type:'Boss',encounters:[{act:'Act 1 - Underdocks'}], moves:[],attack_pattern:{type:'unknown',description:'Connect to the community database for move details.'} }
  ];
  const byId = id => document.getElementById(id);
  const $ = (selector, root=document) => root.querySelector(selector);
  const $$ = (selector, root=document) => Array.from(root.querySelectorAll(selector));
  const safeText = s => (s == null ? '' : String(s));
  const esc = s => safeText(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const clamp = (n,min,max) => Math.min(max,Math.max(min,n));
  const TYPES = ['Normal','Elite','Boss'];
  const defaultState = () => ({region:'overgrowth', floorByRegion:{overgrowth:1,underdocks:1,hive:18,glory:34}, rooms:{}, notes:{}, visited:{}, ascension:false,allActs:false,lastEnemy:null,combatSessions:{}});
  function restore(){ try {const value=JSON.parse(localStorage.getItem(STORE)); if(value && typeof value==='object') return {...defaultState(),...value, floorByRegion:{...defaultState().floorByRegion,...value.floorByRegion}, rooms:value.rooms||{},notes:value.notes||{},visited:value.visited||{}};}catch{} return defaultState(); }
  let state=restore(), monsters=SAMPLE.slice(), dataOrigin='sample', view='combat', quickFilter='All', combatFilter='All', selectedEnemy=null, activeEnemy=null, moveTurn=1, toastTimeout;
  if(!state.combatSessions||typeof state.combatSessions!=='object')state.combatSessions={};
  if(!REGIONS.some(r=>r.id===state.region))state.region='overgrowth';
  function activeRegion(){return REGIONS.find(r=>r.id===state.region)||REGIONS[0];}
  function activeFloor(){const r=activeRegion();return clamp(Number(state.floorByRegion[r.id])||r.start,r.start,r.end);}
  function roomKey(region=state.region,floor=activeFloor()){return `${region}:${floor}`;}
  function persist(){try{localStorage.setItem(STORE,JSON.stringify(state));byId('saveStatus').textContent='● Saved locally';}catch{byId('saveStatus').textContent='● Storage unavailable';}}
  function toast(text){const node=byId('toast');node.textContent=text;node.classList.add('visible');clearTimeout(toastTimeout);toastTimeout=setTimeout(()=>node.classList.remove('visible'),2700);}
  function regionForMonster(m){const acts=Array.isArray(m.encounters)?m.encounters:[];return REGIONS.filter(r=>acts.some(e=>safeText(e.act).toLowerCase().includes(r.short.toLowerCase()))).map(r=>r.id);}
  function monstersForRegion(id){return monsters.filter(m=>regionForMonster(m).includes(id));}
  function switchView(next){view=next;$$('.nav-link').forEach(el=>el.classList.toggle('active',el.dataset.view===view)); for(const v of ['combat','run','bestiary','about'])byId(v+'View').hidden=v!==view;byId('breadcrumb').textContent=({combat:'ENEMY MOVES',run:'FLOOR TRACKER',bestiary:'BESTIARY',about:'GUIDE'})[view]||'ENEMY MOVES';if(next==='combat'){renderCombatRoster();renderCombat();}if(next==='bestiary')renderBestiary();if(next==='run')renderLocation();window.scrollTo({top:0,behavior:'smooth'});}
  function chooseRegion(id){if(!REGIONS.some(r=>r.id===id))return; state.region=id; byId('combatRegion').value=id; selectedEnemy=null;persist();renderLocation();renderQuick();renderCombatRoster();renderCombat();}
  function setFloor(n){const r=activeRegion(),old=activeFloor(),next=clamp(Number.isFinite(Number(n))?Number(n):old,r.start,r.end);state.floorByRegion[r.id]=next;state.visited[roomKey(r.id,old)]=true;persist();renderLocation();updateCombatLocation();}
  function setRoom(room){const k=roomKey();state.rooms[k]=(state.rooms[k]===room?'':room);state.visited[k]=true;persist();renderLocation();}
  function renderLocation(){const r=activeRegion(),floor=activeFloor(),k=roomKey();byId('heroImage').src=r.image;byId('heroImage').alt=r.name+' illustrated landscape';byId('heroAct').textContent=r.act+' · '+(r.actNumber===1?'PATH SELECTION':'YOUR ASCENT');byId('heroName').textContent=r.name;byId('heroDescription').textContent=r.desc;byId('heroFloor').textContent=String(floor).padStart(2,'0');byId('regionSelect').value=r.id;byId('floorInput').min=r.start;byId('floorInput').max=r.end;byId('floorInput').value=floor;byId('floorProgress').textContent=`${floor-r.start+1} OF ${r.end-r.start+1}`;byId('roomPicker').innerHTML=ROOMS.map(x=>`<button class="room-btn ${state.rooms[k]===x.id?'active':''}" data-room="${x.id}" aria-pressed="${state.rooms[k]===x.id}"><span class="room-icon">${x.icon}</span><span class="room-name">${x.label}</span></button>`).join('');byId('floorTrack').innerHTML=Array.from({length:r.end-r.start+1},(_,i)=>{const n=r.start+i,key=roomKey(r.id,n),kind=state.rooms[key]||'',icon=ROOMS.find(x=>x.id===kind)?.icon||n;return `<button class="floor-node ${n===floor?'current':''} ${state.visited[key]||state.rooms[key]||state.notes[key]?'visited':''} ${kind==='Boss'?'boss':''}" data-floor="${n}" title="Floor ${n}${kind?' · '+kind:''}" aria-label="Go to floor ${n}${kind?' · '+kind:''}" aria-current="${n===floor?'step':'false'}">${icon}</button>`;}).join('');byId('floorNotes').value=state.notes[k]||'';$$('.region-link').forEach(el=>el.classList.toggle('active',el.dataset.region===r.id));}
  // Source files use /static/images/monsters/{id}.webp. The image CDN
  // serves them directly under /monsters/{id}.webp.
  function imageFallbacks(m){
    const paths=[m.image_url,m.beta_image_url].filter(Boolean).map(safeText);
    const results=[];
    for(const path of paths){
      // English and beta data releases may use differently versioned image paths.
      // Restrict URLs to known monster assets on the source provider.
      if(!/^\/static\/(?:data(?:-beta)?\/v[0-9.]+\/)?images\/monsters\/[a-z0-9_\-]+\.(webp|png)$/i.test(path))continue;
      const filename=path.split('/').pop();
      results.push('https://spire-codex.com'+path,
        'https://cdn.spire-codex.com'+path,
        'https://cdn.spire-codex.com'+path.replace(/^\/static/, ''),
        'https://cdn.spire-codex.com/monsters/'+filename);
    }
    return [...new Set(results)];
  }
  function makeImage(m,className=''){const urls=imageFallbacks(m);const img=document.createElement('img');img.alt=m.name+' enemy illustration';img.loading='lazy';img.decoding='async';if(className)img.className=className;let i=0;function next(){if(i<urls.length){img.src=urls[i++];}else{img.hidden=true;img.classList.add('failed-art');}}img.addEventListener('error',next);if(urls.length)next();else img.hidden=true;return img;}
  function enemyCard(m){const button=document.createElement('button');button.type='button';button.className='enemy-card';button.dataset.type=m.type;button.setAttribute('aria-label','View '+m.name+' attack pattern');const wrap=document.createElement('span');wrap.className='enemy-image-wrap';wrap.innerHTML='<span class="art-glow"></span><span class="missing-art" aria-hidden="true">✦</span>';wrap.append(makeImage(m));const bottom=document.createElement('span');bottom.className='enemy-card-bottom';const strong=document.createElement('strong');strong.textContent=m.name;const small=document.createElement('small');small.className=m.type==='Elite'?'elite':m.type==='Boss'?'boss':'';small.textContent=m.type+' · '+(m.attack_pattern?.type==='cycle'?'Pattern':'Moves');bottom.append(strong,small);button.append(wrap,bottom);button.addEventListener('click',()=>openDetail(m.id));return button;}
  function showEmpty(grid,text){const el=document.createElement('div');el.className='empty-state';el.textContent=text;grid.append(el);}
  function renderQuick(){if(!byId('quickSearch'))return;const results=monsters.filter(m=> (state.allActs||regionForMonster(m).includes(state.region))&&(quickFilter==='All'||m.type===quickFilter)&&m.name.toLowerCase().includes(byId('quickSearch').value.trim().toLowerCase())).sort(sortEnemies);const grid=byId('quickEnemyGrid');grid.replaceChildren(...results.slice(0,8).map(enemyCard));if(!results.length)showEmpty(grid,dataOrigin==='sample'?'No matching enemies in the offline sample. Connect online to load the full bestiary.':'No enemies found. Try another region or search.');byId('regionCount').textContent=`${monstersForRegion(state.region).length} ENEMIES`;$$('#quickFilters .filter').forEach(el=>el.classList.toggle('active',el.dataset.filter===quickFilter));}
  function sortEnemies(a,b){const rank={Normal:0,Elite:1,Boss:2};return (rank[a.type]??3)-(rank[b.type]??3)||a.name.localeCompare(b.name);}
  function renderBestiary(){const q=byId('allSearch').value.trim().toLowerCase(),region=byId('bestiaryRegion').value,type=byId('bestiaryType').value;const results=monsters.filter(m=>(region==='All'||regionForMonster(m).includes(region))&&(type==='All'||m.type===type)&&m.name.toLowerCase().includes(q)).sort(sortEnemies);byId('allResultCount').textContent=`${results.length} ${results.length===1?'enemy':'enemies'}`;const grid=byId('allEnemyGrid');grid.replaceChildren(...results.map(enemyCard));if(!results.length)showEmpty(grid,'Nothing found. Try a different search or region.');}
  function moveById(m,id){return (m.moves||[]).find(mov=>mov.id===id);}
  function damageText(move){const d=move?.damage;if(!d)return '';const raw=state.ascension ? (d.ascension??d.normal):d.normal;if(raw===undefined||raw===null)return '';const hitCount=Number(d.hit_count)||1;return hitCount>1?`${raw} × ${hitCount}`:`${raw}`;}
  function detailMoveValue(move){const parts=[];const dmg=damageText(move);if(dmg)parts.push(`${dmg} dmg`);if(move.block!==undefined&&move.block!==null)parts.push(`${move.block} block`);if(Array.isArray(move.powers))for(const power of move.powers){parts.push(`${safeText(power.power_id).replaceAll('_',' ')} ${power.amount??''} (${power.target==='player'?'you':'self'})`)};if(move.heal)parts.push(`${move.heal} heal`);return parts.join(' · ')||'—';}
  function intentIcon(intent){const s=safeText(intent).toLowerCase();if(s.includes('attack'))return '⚔';if(s.includes('defend'))return '◈';if(s.includes('buff'))return '✧';if(s.includes('debuff'))return '☣';if(s.includes('stun')||s.includes('sleep'))return '☽';if(s.includes('summon'))return '♟';return '◇';}
  /* Guaranteed turns are displayed only when every followed edge is explicitly
     present in a simple cycle state machine. Absence of an edge is unknown,
     never silently inferred from the list order or human-readable description. */
  function knownPath(m,steps=12){const pat=m.attack_pattern||{};if(!pat.initial_move)return [];const first=moveById(m,pat.initial_move);if(!first)return [];if(pat.type!=='cycle'||!Array.isArray(pat.states))return [first];const map=new Map(pat.states.filter(s=>s&&s.type==='move'&&s.move_id).map(s=>[s.id,s]));let cur=pat.states.find(s=>s?.move_id===pat.initial_move && s.type==='move');if(!cur)return [first];const output=[];for(let i=0;i<steps;i++){const move=moveById(m,cur.move_id);if(!move)break;output.push(move);if(!cur.next||!map.has(cur.next))break;cur=map.get(cur.next);}return output;}
  function patternType(m){const type=m.attack_pattern?.type||'unknown';return {cycle:'Linked move cycle',random:'Random selection',conditional:'Conditional AI',mixed:'Mixed behavior'}[type]||'Pattern unavailable';}
  function patternExplanation(m, path){const pat=m.attack_pattern||{};if(path.length>=2)return 'The connected game-data state machine specifies these moves in order. Use the turn selector to inspect the next documented action.';if(path.length===1)return 'The opening move is documented, but later transitions are not sufficiently linked to promise the next attack.';if(pat.type==='random')return 'This enemy chooses among moves; no single next attack can be guaranteed from the move list.';if(pat.type==='conditional'||pat.type==='mixed')return 'The next action may depend on HP, previous actions, buffs, combat conditions, or randomness.';return 'The available data does not provide a complete, reliable turn-by-turn sequence. The moves below are possible actions, not a forecast.';}
  function openDetail(id){const m=monsters.find(e=>e.id===id);if(!m)return;activeEnemy=m;moveTurn=1;state.lastEnemy=id;persist();renderDetails();byId('detailBackdrop').hidden=false;byId('detailDrawer').classList.add('open');byId('detailDrawer').setAttribute('aria-hidden','false');document.body.classList.add('drawer-open');byId('closeDetail').focus();}
  function closeDetail(){byId('detailBackdrop').hidden=true;byId('detailDrawer').classList.remove('open');byId('detailDrawer').setAttribute('aria-hidden','true');document.body.classList.remove('drawer-open');activeEnemy=null;}
  function renderDetails(){if(!activeEnemy)return;const m=activeEnemy,r=regionForMonster(m).map(id=>REGIONS.find(r=>r.id===id)).filter(Boolean);const pat=m.attack_pattern||{},path=knownPath(m,Math.max(12,moveTurn+2));byId('detailName').textContent=m.name;byId('detailType').textContent=m.type.toUpperCase();byId('detailType').className='type-label '+m.type.toLowerCase();byId('detailRegion').textContent=r.length?r.map(e=>`${e.act} · ${e.short}`).join(' / '):'Special encounter / unknown region';const hpMin=state.ascension?(m.min_hp_ascension??m.min_hp):m.min_hp,hpMax=state.ascension?(m.max_hp_ascension??m.max_hp):m.max_hp;byId('detailHp').textContent=hpMin===undefined?'—':hpMax===null||hpMax===undefined||hpMax===hpMin?`${hpMin}`:`${hpMin}–${hpMax}`;byId('detailStyle').textContent=patternType(m);byId('patternTitle').textContent=pat.type==='cycle'?'Attack sequence':'Possible attack behavior';byId('patternDescription').textContent=patternExplanation(m,path);const art=byId('detailImage'),fallback=byId('detailFallback'),imgs=imageFallbacks(m);let pointer=0;art.hidden=true;fallback.hidden=false;art.onload=()=>{art.hidden=false;fallback.hidden=true;};art.onerror=()=>{if(pointer<imgs.length){art.src=imgs[pointer++];}else{art.hidden=true;fallback.hidden=false;}};if(imgs.length)art.src=imgs[pointer++];else art.removeAttribute('src');const isKnown=path.length>=moveTurn;const current=isKnown?path[moveTurn-1]:null;const sessionForDetail=combatSession(m);const priorStrength=sessionForDetail.mode==='manual'?combatContext(m).strength:strengthOfList(m,sessionForDetail,path.slice(0,Math.max(0,moveTurn-1)));byId('detailStrength').textContent=`Strength before turn ${moveTurn}: ${priorStrength>=0?'+':''}${priorStrength} (from earlier buffs and OTHER STR)`;byId('turnValue').textContent=`TURN ${moveTurn}`;byId('turnMinus').disabled=moveTurn<=1;byId('turnPlus').disabled=moveTurn>=20;byId('nextMoveLabel').textContent=current?moveTurn===1?'DOCUMENTED OPENER':'DOCUMENTED MOVE':'NEXT MOVE UNCERTAIN';byId('nextMoveName').textContent=current?current.name:'Cannot reliably predict';byId('nextMoveDetail').textContent=current?`${current.intent||'Unknown intent'}${attackStats(current,priorStrength)?' · '+attackStats(current,priorStrength).label+' damage':' · '+detailMoveValue(current)}`:'Review the possible moves below and check the in-game intent.';
    const timeline=byId('moveTimeline');timeline.replaceChildren();if(path.length){path.slice(Math.max(0,Math.min(moveTurn-4,path.length-7)),Math.max(0,Math.min(moveTurn-4,path.length-7))+7).forEach((move,i)=>{const turnNumber=Math.max(0,Math.min(moveTurn-4,path.length-7))+i+1;const card=document.createElement('div');card.className='timeline-card'+(turnNumber===moveTurn?' current':'');card.innerHTML=`<span class="timeline-number">TURN ${turnNumber}</span><span class="intent-icon">${intentIcon(move.intent)}</span><strong>${esc(move.name)}</strong><small>${esc(attackStats(move,strengthOfList(m,combatSession(m),path.slice(0,turnNumber-1)))?attackStats(move,strengthOfList(m,combatSession(m),path.slice(0,turnNumber-1))).label+' damage':move.intent||'—')}</small>`;timeline.append(card);});}else{const p=document.createElement('div');p.className='timeline-card random';p.innerHTML='<span class="timeline-number">VARIABLE AI</span><span class="intent-icon">◇</span><strong>No fixed move order</strong><small>Possible actions below</small>';timeline.append(p);}
    byId('patternWarning').textContent=path.length>=2?'Sequence relies on the linked game-data edges and may change with game updates.':'Do not assume that moves are used in the listed order.';
    const list=byId('moveList');list.replaceChildren();for(const move of (m.moves||[])){const row=document.createElement('div');row.className='move-line';const ico=document.createElement('span');ico.className='move-icon';ico.textContent=intentIcon(move.intent);const main=document.createElement('div');main.className='move-main';const strong=document.createElement('strong');strong.textContent=move.name||move.id;const small=document.createElement('small');small.textContent=move.intent||'Unknown intent';main.append(strong,small);const value=document.createElement('span');value.className='move-val';value.textContent=attackStats(move,priorStrength)?attackStats(move,priorStrength).label+' dmg':detailMoveValue(move);row.append(ico,main,value);list.append(row);}if(!(m.moves||[]).length)showEmpty(list,'Moves unavailable in this offline sample. Reconnect and refresh the database.');byId('moveCount').textContent=`${(m.moves||[]).length} MOVES`;
    byId('externalGuide').href='https://spire-codex.com/monsters/'+encodeURIComponent(m.id.toLowerCase());
  }
  // The combat journal keeps ACTUAL moves separately from a documented fixed cycle.
  // Strength is a flat per-hit attack modifier. Earlier self-applied Strength only:
  // actions in the current turn are never assumed to have resolved before its attack.
  function combatSession(m){
    if(!m)return null;
    if(!state.combatSessions[m.id]||typeof state.combatSessions[m.id]!=='object')
      state.combatSessions[m.id]={mode:hasAutoCycle(m)?'auto':'manual',turn:1,history:[],extraStrength:0,previewMove:null};
    const c=state.combatSessions[m.id];
    c.history=Array.isArray(c.history)?c.history.filter(id=>typeof id==='string').slice(-60):[];
    if(c.previewMove!=null&&typeof c.previewMove!=='string')c.previewMove=null;
    c.extraStrength=clamp(Number(c.extraStrength)||0,-999,999);
    c.turn=clamp(Number(c.turn)||1,1,30);
    if(!hasAutoCycle(m))c.mode='manual';
    return c;
  }
  function strengthOnMove(move){
    return (Array.isArray(move?.powers)?move.powers:[]).reduce((sum,p)=>
      safeText(p.power_id).toUpperCase()==='STRENGTH' && safeText(p.target).toLowerCase()==='self' && Number.isFinite(Number(p.amount))
      ? sum+Number(p.amount):sum,0);
  }
  function innateStrength(m){
    const powers=Array.isArray(m.innate_powers)?m.innate_powers:[];
    return powers.reduce((sum,p)=>safeText(p.power_id||p.id).toUpperCase()==='STRENGTH' && Number.isFinite(Number(p.amount))
      ? sum+Number(p.amount):sum,0);
  }
  // A few linked steps alone do not establish a repeating cycle. Require
  // explicit transitions ending in a documented loop (possibly after an opener).
  function hasAutoCycle(m){
    const p=m.attack_pattern;
    if(p?.type!=='cycle'||!p.initial_move||!Array.isArray(p.states))return false;
    const nodes=new Map(p.states.filter(n=>n&&n.type==='move'&&n.move_id).map(n=>[n.id,n]));
    const first=p.states.find(n=>n?.type==='move'&&n.move_id===p.initial_move);
    if(!first)return false;
    let current=first;
    const seen=new Set();
    for(let i=0;i<Math.min(nodes.size+1,60);i++){
      if(seen.has(current.id))return true;
      seen.add(current.id);
      if(!moveById(m,current.move_id)||!current.next||!nodes.has(current.next))return false;
      current=nodes.get(current.next);
    }
    return false;
  }
  function combatContext(m){
    const session=combatSession(m),auto=session.mode==='auto'&&hasAutoCycle(m);
    const path=auto?knownPath(m,34):[];
    const history=auto?path.slice(0,session.turn-1):session.history.map(id=>moveById(m,id)).filter(Boolean);
    const strengthGained=history.reduce((sum,move)=>sum+strengthOnMove(move),0);
    const starting=innateStrength(m)+session.extraStrength;
    const strength=clamp(starting+strengthGained,-999,999);
    const preview=!auto&&session.previewMove?moveById(m,session.previewMove):null;
    const move=auto?path[session.turn-1]:preview||(session.history.length===0?moveById(m,m.attack_pattern?.initial_move):null);
    const turn=auto?session.turn:session.history.length+1;
    return {session,auto,path,history,strength,strengthGained,starting,move,turn,preview};
  }
  function attackStats(move,strength){
    if(!move?.damage)return null;
    const dmg=move.damage,raw=state.ascension?(dmg.ascension??dmg.normal):dmg.normal;
    if(!Number.isFinite(Number(raw)))return null;
    const count=state.ascension?(dmg.hit_count_ascension??dmg.hit_count??1):(dmg.hit_count??1);
    const hits=clamp(Number(count)||1,1,99),base=Number(raw),perHit=Math.max(0,base+strength),total=perHit*hits;
    return {base,perHit,hits,total,adjust:strength,label:hits>1?`${perHit} × ${hits}`:`${perHit}`};
  }
  function combatDamageDetail(move,strength){
    const d=attackStats(move,strength);
    if(!d)return '';
    return `Base ${d.base} ${d.adjust>=0?'+':'−'} ${Math.abs(d.adjust)} Strength = ${d.perHit} per hit${d.hits>1?' × '+d.hits+' hits = '+d.total+' total':''}`;
  }
  function updateCombatLocation(){const r=activeRegion();byId('combatLocation').textContent=`${r.act} · FLOOR ${String(activeFloor()).padStart(2,'0')}`;}
  function chooseCombatEnemy(m){if(!m)return;selectedEnemy=m;state.lastEnemy=m.id;combatSession(m);persist();renderCombatRoster();renderCombat();}
  function availableCombatEnemies(){
    const region=byId('combatRegion').value||state.region,q=byId('combatSearch').value.trim().toLowerCase();
    return monsters.filter(m=>(region==='All'||regionForMonster(m).includes(region)) && (combatFilter==='All'||m.type===combatFilter) && m.name.toLowerCase().includes(q)).sort(sortEnemies);
  }
  function renderCombatRoster(){
    const list=byId('combatEnemyList'),enemies=availableCombatEnemies();
    byId('combatCount').textContent=`${enemies.length} FOES`;
    $$('#combatFilters .filter').forEach(b=>b.classList.toggle('active',b.dataset.filter===combatFilter));
    list.replaceChildren();
    for(const m of enemies){
      const b=document.createElement('button');b.className='roster-enemy'+(selectedEnemy?.id===m.id?' active':'');b.type='button';b.dataset.enemyId=m.id;
      const thumb=document.createElement('span');thumb.className='roster-portrait';thumb.append(makeImage(m));
      const copy=document.createElement('span');copy.className='roster-copy';
      const name=document.createElement('strong');name.textContent=m.name;
      const meta=document.createElement('small');meta.textContent=`${m.type.toUpperCase()} · ${hasAutoCycle(m)?'CYCLE':'VARIABLE'}`;
      copy.append(name,meta);const arrow=document.createElement('span');arrow.className='roster-arrow';arrow.textContent='›';
      b.append(thumb,copy,arrow);b.addEventListener('click',()=>chooseCombatEnemy(m));list.append(b);
    }
    if(!enemies.length)showEmpty(list,dataOrigin==='sample'?'No match in the offline sample. Refresh online for the full bestiary.':'No enemies match this filter.');
    const selectedStillVisible=selectedEnemy&&enemies.some(m=>m.id===selectedEnemy.id);
    if(selectedStillVisible)selectedEnemy=enemies.find(m=>m.id===selectedEnemy.id);
    if(!selectedStillVisible){
      const remembered=enemies.find(m=>m.id===state.lastEnemy);
      selectedEnemy=remembered||enemies[0]||null;
      if(selectedEnemy)combatSession(selectedEnemy);
    }
    $$('.roster-enemy',list).forEach(b=>b.classList.toggle('active',b.dataset.enemyId===selectedEnemy?.id));
    updateCombatLocation();
  }
  function renderCombat(){
    updateCombatLocation();
    const m=selectedEnemy;
    if(!m){byId('combatEnemyName').textContent='No enemy selected';byId('combatArt').dataset.enemyId='';byId('combatArt').hidden=true;byId('combatArtFallback').hidden=false;byId('combatNextMove').textContent='Search or choose an enemy';byId('combatPossibleList').replaceChildren();byId('combatDamage').textContent='—';byId('combatDamageCaption').textContent='UNKNOWN';byId('combatStrength').textContent='0 Strength';return;}
    const r=regionForMonster(m).map(id=>REGIONS.find(region=>region.id===id)).filter(Boolean);
    const info=combatContext(m),{session,auto,path,history,strength,strengthGained,starting,move,turn,preview}=info;
    const panelRegion=r[0]||activeRegion();
    byId('combatStageBackdrop').style.backgroundImage=`linear-gradient(180deg,#100b16a1,#100c14b0),url('${panelRegion.image}')`;
    byId('combatRegionLabel').textContent=r.length?r.map(e=>`${e.act} · ${e.short.toUpperCase()}`).join(' / '):'SPECIAL ENCOUNTER';
    byId('combatType').textContent=`${m.type.toUpperCase()} ENCOUNTER`;
    byId('combatEnemyName').textContent=m.name;
    const low=state.ascension?(m.min_hp_ascension??m.min_hp):m.min_hp;
    const high=state.ascension?(m.max_hp_ascension??m.max_hp):m.max_hp;
    byId('combatHp').textContent=low==null?'HP UNKNOWN':`${low}${high!=null&&high!==low?'–'+high:''} HP`;
    // Keep a loaded portrait visible while stepping through turns.
    const art=byId('combatArt'),fallback=byId('combatArtFallback');
    if(art.dataset.enemyId!==m.id){
      art.dataset.enemyId=m.id;
      const urls=imageFallbacks(m);let pointer=0;
      art.onload=()=>{if(selectedEnemy?.id===m.id){art.hidden=false;fallback.hidden=true;}};
      art.onerror=()=>{if(selectedEnemy?.id!==m.id)return;if(pointer<urls.length)art.src=urls[pointer++];else{art.hidden=true;fallback.hidden=false;}};
      art.hidden=true;fallback.hidden=false;
      if(urls.length)art.src=urls[pointer++];else art.removeAttribute('src');
    }
    const stats=attackStats(move,strength);
    byId('combatIntentIcon').textContent=move?intentIcon(move.intent):'◇';
    byId('combatIntentText').textContent=preview?'WHAT IF · '+(move.intent||'Unknown').toUpperCase():move?(move.intent||'Unknown').toUpperCase():'CHECK IN-GAME INTENT';
    byId('combatNextMove').textContent=move?(move.name||move.id):'Move cannot be predicted';
    byId('combatMoveInfo').textContent=preview?`What-if preview · ${move.intent||'Unknown intent'} · NOT a prediction`:move?`${auto?'Documented action':'Documented opening move'} · ${move.intent||'Unknown intent'}`:'Tap Preview beside a possible move to see its buff-adjusted damage. Record moves after they happen.';
    byId('combatDamage').textContent=stats?stats.label:'—';
    byId('combatDamageCaption').textContent=preview?'WHAT IF':move?'INCOMING':'UNKNOWN';
    byId('combatDamageUnits').textContent=stats?stats.hits>1?`${stats.total} TOTAL ${preview?'PREVIEW':'DAMAGE'}`:preview?'POSSIBLE DAMAGE':'DAMAGE':'NO CONFIRMED ATTACK';
    const gainedThisMove=strengthOnMove(move);
    byId('combatDamageBreakdown').textContent=stats
      ?combatDamageDetail(move,strength)+(gainedThisMove?` · This move also grants ${gainedThisMove>0?'+':''}${gainedThisMove} Strength for following attacks.`:'')
      :gainedThisMove?`Gains ${gainedThisMove>0?'+':''}${gainedThisMove} Strength with this action. Subsequent attacks receive that much extra damage per hit.`
      :move?'No documented attack damage for this action. Other effects may apply.':'Possible attacks below use all previously recorded Strength.';
    byId('combatStrength').textContent=`${strength>0?'+':''}${strength} Strength`;
    byId('combatBuffSummary').textContent=`${strengthGained?`${strengthGained>0?'+':''}${strengthGained} from ${auto?'earlier documented moves':'moves you recorded'}`:'No Strength buffs from previous moves'}${starting?', '+(starting>0?'+':'')+starting+' starting/other':''}.`;
    byId('extraStrengthValue').textContent=String(session.extraStrength);
    byId('combatTurn').textContent=String(turn);
    byId('combatPrev').disabled=!auto||session.turn<=1;
    byId('combatNext').disabled=!auto||session.turn>=30||path.length<=session.turn;
    $$('#combatModeSwitch button').forEach(b=>{b.classList.toggle('selected',b.dataset.mode===(auto?'auto':'manual'));b.disabled=b.dataset.mode==='auto'&&!hasAutoCycle(m);});
    byId('combatManualActions').hidden=auto;
    byId('combatUndo').disabled=session.history.length===0;
    byId('combatUncertainty').textContent=auto?'Linked source moves are shown in order. Strength from earlier self-buffs is applied per hit. In-game actions can still diverge.':'Manual mode: enemy move choices may be random or conditional. Record observed actions to apply Strength buffs to later previews.';
    const timeline=byId('combatTimeline');timeline.replaceChildren();
    const display=auto?path.slice(Math.max(0,turn-3),Math.min(path.length,turn+5)).map((mov,i)=>({move:mov,num:i+Math.max(0,turn-3)+1})):history.slice(-7).map((mov,i)=>({move:mov,num:i+Math.max(0,history.length-7)+1}));
    let shown=0;
    for(const entry of display){
      const row=document.createElement('button');row.type='button';row.className='combat-timeline-step'+(auto&&entry.num===turn?' is-current':'');
      if(!auto)row.disabled=true;
      row.innerHTML=`<span>TURN ${entry.num}</span><b>${intentIcon(entry.move.intent)}</b><strong>${esc(entry.move.name)}</strong>`;
      const previous=auto?path.slice(0,entry.num-1):history.slice(0,entry.num-1);
      const str=strengthOfList(m,session,previous),d=attackStats(entry.move,str);
      const tag=document.createElement('small');tag.textContent=d?`${d.label} dmg`:strengthOnMove(entry.move)?`+${strengthOnMove(entry.move)} STR`:entry.move.intent||'—';row.append(tag);
      if(auto)row.addEventListener('click',()=>{session.turn=entry.num;persist();renderCombat();});
      timeline.append(row);shown++;
    }
    if(!auto){const next=document.createElement('div');next.className='combat-timeline-step future';next.innerHTML=`<span>TURN ${turn}</span><b>?</b><strong>Observe intent</strong><small>Record after action</small>`;timeline.append(next);shown++;}
    if(!shown){const empty=document.createElement('div');empty.className='empty-state';empty.textContent='No documented order. Record moves as they happen.';timeline.append(empty);}
    const allMoves=byId('combatPossibleList');allMoves.replaceChildren();
    for(const mv of (m.moves||[])){
      const item=document.createElement('div');item.className='combat-move-row'+(preview?.id===mv.id?' is-previewed':'');
      const glyph=document.createElement('span');glyph.className='combat-move-glyph';glyph.textContent=intentIcon(mv.intent);
      const textBox=document.createElement('span');textBox.className='combat-move-text';
      const label=document.createElement('strong');label.textContent=mv.name||mv.id;
      const sub=document.createElement('small');sub.textContent=mv.intent||'Unknown intent';textBox.append(label,sub);
      const power=document.createElement('div');power.className='combat-move-power';
      const hit=attackStats(mv,strength);const boost=strengthOnMove(mv);
      if(hit){const dmg=document.createElement('strong');dmg.textContent=hit.label+' dmg';power.append(dmg);const base=document.createElement('small');base.textContent=`base ${hit.base}${strength?' · STR '+(strength>0?'+':'')+strength:''}`;power.append(base);}
      if(boost){const tag=document.createElement('span');tag.className='combat-buff-tag';tag.textContent=`${boost>0?'+':''}${boost} STR ↗`;power.append(tag);}
      const other=(Array.isArray(mv.powers)?mv.powers:[]).filter(p=>safeText(p.power_id).toUpperCase()!=='STRENGTH'||p.target!=='self');
      for(const p of other){const pill=document.createElement('small');pill.className='combat-other-buff';pill.textContent=`${safeText(p.power_id).replaceAll('_',' ')} ${p.amount??''} · ${p.target||'effect'}`;power.append(pill);}
      if(mv.block!=null){const block=document.createElement('small');block.textContent=`${mv.block} block`;power.append(block);}
      if(!hit&&!boost&&!mv.block&&!other.length){const missing=document.createElement('small');missing.textContent='No damage listed';power.append(missing);}
      item.append(glyph,textBox,power);
      if(!auto){
        const actions=document.createElement('div');actions.className='combat-move-actions';
        const previewButton=document.createElement('button');previewButton.type='button';previewButton.className='combat-preview-move';previewButton.textContent=preview?.id===mv.id?'Previewing ✓':'Preview';
        previewButton.setAttribute('aria-label',`Preview ${mv.name} damage with current Strength, without recording it`);
        previewButton.setAttribute('aria-pressed',String(preview?.id===mv.id));
        previewButton.addEventListener('click',()=>{session.previewMove=mv.id;persist();renderCombat();byId('combatReadout').scrollIntoView({block:'center',behavior:'smooth'});});
        const b=document.createElement('button');b.type='button';b.className='combat-log-move';b.textContent='Record +';b.setAttribute('aria-label',`Record ${mv.name} as an observed move`);
        b.addEventListener('click',()=>{session.history.push(mv.id);session.previewMove=null;persist();renderCombat();});
        actions.append(previewButton,b);item.append(actions);
      }
      allMoves.append(item);
    }
    if(!(m.moves||[]).length)showEmpty(allMoves,'No move data in the offline sample. Refresh when connected to load more enemies.');
    byId('combatMoveCount').textContent=`${(m.moves||[]).length} MOVES`;
    byId('combatPatternNotes').textContent=m.attack_pattern?.description || (auto?'Linked sequence from community game data':'Actions may be chosen conditionally or at random.');
    byId('combatSourceLink').href='https://spire-codex.com/monsters/'+encodeURIComponent(m.id.toLowerCase());
  }
  function strengthOfList(m,session,list){return clamp(innateStrength(m)+session.extraStrength+list.reduce((s,mv)=>s+strengthOnMove(mv),0),-999,999);}
  function normalizeData(payload){const items=Array.isArray(payload)?payload:Array.isArray(payload?.monsters)?payload.monsters:Array.isArray(payload?.data)?payload.data:[];return items.filter(m=>m&&typeof m.name==='string'&&typeof m.id==='string'&&TYPES.includes(m.type)).map(m=>({...m,moves:Array.isArray(m.moves)?m.moves:[],encounters:Array.isArray(m.encounters)?m.encounters:[]}));}
  function updateDataIndicator(message,mode){const el=byId('dataIndicator');el.querySelector('span').textContent=message;el.classList.toggle('offline',mode==='offline');el.classList.toggle('loaded',mode==='online');}
  function adoptData(items,origin){if(!items.length)return;const activeId=selectedEnemy?.id;monsters=items;if(activeId)selectedEnemy=monsters.find(x=>x.id===activeId)||null;dataOrigin=origin;updateDataIndicator(`${items.length} enemies · ${origin==='cache'?'cached':origin==='live'?'database live':'offline sample'}`,origin==='sample'?'offline':'online');renderQuick();renderBestiary();renderCombatRoster();renderCombat();if(activeEnemy){const found=monsters.find(m=>m.id===activeEnemy.id);if(found){activeEnemy=found;renderDetails();}}}
  async function fetchWithTimeout(url,ms=13000){const controller=new AbortController(),timeout=setTimeout(()=>controller.abort(),ms);try{const response=await fetch(url,{cache:'no-cache',signal:controller.signal});if(!response.ok)throw new Error('HTTP '+response.status);return await response.json();}finally{clearTimeout(timeout);}}
  async function loadDatabase(force=false){if(!force){try{const cache=JSON.parse(localStorage.getItem(DB_CACHE)||'null');const parsed=normalizeData(cache?.items);if(parsed.length>=50)adoptData(parsed,'cache');}catch{}}
    for(const url of DATA_URLS){try{const items=normalizeData(await fetchWithTimeout(url));if(items.length<50)throw new Error('Incomplete database');adoptData(items,'live');try{localStorage.setItem(DB_CACHE,JSON.stringify({saved:Date.now(),items}));}catch{} if(force)toast(`Updated ${items.length} enemies`);return;}catch(e){console.warn('Enemy source unavailable:',url,e?.message||e);}}
    if(dataOrigin==='sample'){adoptData(SAMPLE,'sample');if(force)toast('Offline — showing a small sample');}else if(force)toast('Could not update — using cached data');}
  function wire(){for(const r of REGIONS){const option=document.createElement('option');option.value=r.id;option.textContent=`${r.act} · ${r.short}`;byId('regionSelect').append(option);const extra=document.createElement('option');extra.value=r.id;extra.textContent=`${r.act} · ${r.short}`;byId('bestiaryRegion').append(extra);}
    const all=document.createElement('option');all.value='All';all.textContent='All regions';byId('bestiaryRegion').prepend(all);byId('bestiaryRegion').value='All';byId('regionNav').innerHTML=REGIONS.map(r=>`<button class="region-link" data-region="${r.id}"><span class="region-dot" style="background:${r.color}"></span><span class="region-label">${esc(r.short)}<small>${r.act}</small></span></button>`).join('');
    $$('.nav-link').forEach(b=>b.addEventListener('click',()=>switchView(b.dataset.view)));byId('homeBrand').addEventListener('click',e=>{e.preventDefault();switchView('combat');});byId('regionNav').addEventListener('click',e=>{const b=e.target.closest('[data-region]');if(!b)return;chooseRegion(b.dataset.region);switchView('combat');});byId('regionSelect').addEventListener('change',e=>chooseRegion(e.target.value));byId('floorMinus').addEventListener('click',()=>setFloor(activeFloor()-1));byId('floorPlus').addEventListener('click',()=>setFloor(activeFloor()+1));byId('floorInput').addEventListener('change',e=>setFloor(e.target.value));byId('floorTrack').addEventListener('click',e=>{const b=e.target.closest('[data-floor]');if(b)setFloor(Number(b.dataset.floor));});byId('roomPicker').addEventListener('click',e=>{const b=e.target.closest('[data-room]');if(b)setRoom(b.dataset.room);});byId('floorNotes').addEventListener('input',e=>{const k=roomKey();state.notes[k]=e.target.value.slice(0,4000);state.visited[k]=true;persist();});byId('clearRoute').addEventListener('click',()=>{const r=activeRegion();if(!confirm(`Clear notes, visited floors and room types for ${r.short}?`))return;for(const store of ['rooms','notes','visited'])for(const k of Object.keys(state[store]))if(k.startsWith(r.id+':'))delete state[store][k];persist();renderLocation();toast('Region notes cleared');});
    byId('allSearch').addEventListener('input',renderBestiary);byId('bestiaryRegion').addEventListener('change',renderBestiary);byId('bestiaryType').addEventListener('change',renderBestiary);
    for(const r of REGIONS){const option=document.createElement('option');option.value=r.id;option.textContent=`${r.act} · ${r.short}`;byId('combatRegion').append(option);}
    const allRegion=document.createElement('option');allRegion.value='All';allRegion.textContent='All regions';byId('combatRegion').prepend(allRegion);byId('combatRegion').value=state.region;
    byId('combatSearch').addEventListener('input',()=>{renderCombatRoster();renderCombat();});
    byId('combatRegion').addEventListener('change',()=>{renderCombatRoster();renderCombat();});
    $$('#combatFilters .filter').forEach(b=>b.addEventListener('click',()=>{combatFilter=b.dataset.filter;renderCombatRoster();renderCombat();}));
    byId('combatTrackerLink').addEventListener('click',()=>switchView('run'));
    byId('floorShortcut').addEventListener('click',()=>switchView('run'));
    byId('backToMoves').addEventListener('click',()=>switchView('combat'));
    byId('combatPrev').addEventListener('click',()=>{if(!selectedEnemy)return;const c=combatSession(selectedEnemy);c.turn=Math.max(1,c.turn-1);persist();renderCombat();});
    byId('combatNext').addEventListener('click',()=>{if(!selectedEnemy)return;const c=combatSession(selectedEnemy);c.turn=Math.min(30,c.turn+1);persist();renderCombat();});
    $$('#combatModeSwitch button').forEach(b=>b.addEventListener('click',()=>{if(!selectedEnemy)return;const c=combatSession(selectedEnemy);if(b.dataset.mode==='auto'&&!hasAutoCycle(selectedEnemy))return;c.mode=b.dataset.mode;persist();renderCombat();}));
    byId('combatUndo').addEventListener('click',()=>{if(!selectedEnemy)return;combatSession(selectedEnemy).history.pop();persist();renderCombat();});
    byId('combatReset').addEventListener('click',()=>{if(!selectedEnemy)return;const c=combatSession(selectedEnemy);c.turn=1;c.history=[];c.extraStrength=0;c.previewMove=null;persist();renderCombat();toast('Combat reset');});
    byId('extraStrengthMinus').addEventListener('click',()=>{if(!selectedEnemy)return;const c=combatSession(selectedEnemy);c.extraStrength=clamp(c.extraStrength-1,-999,999);persist();renderCombat();});
    byId('extraStrengthPlus').addEventListener('click',()=>{if(!selectedEnemy)return;const c=combatSession(selectedEnemy);c.extraStrength=clamp(c.extraStrength+1,-999,999);persist();renderCombat();});
    byId('closeDetail').addEventListener('click',closeDetail);byId('detailBackdrop').addEventListener('click',closeDetail);document.addEventListener('keydown',e=>{if(e.key==='Escape'&&activeEnemy)closeDetail();});byId('turnMinus').addEventListener('click',()=>{moveTurn=Math.max(1,moveTurn-1);renderDetails();});byId('turnPlus').addEventListener('click',()=>{moveTurn=Math.min(20,moveTurn+1);renderDetails();});byId('turnReset').addEventListener('click',()=>{moveTurn=1;renderDetails();});byId('ascToggle').checked=!!state.ascension;byId('combatAscToggle').checked=!!state.ascension;byId('ascToggle').addEventListener('change',e=>{state.ascension=e.target.checked;byId('combatAscToggle').checked=state.ascension;persist();renderDetails();renderCombat();});byId('combatAscToggle').addEventListener('change',e=>{state.ascension=e.target.checked;byId('ascToggle').checked=state.ascension;persist();renderDetails();renderCombat();});byId('refreshData').addEventListener('click',()=>{toast('Checking for updated enemy data…');loadDatabase(true);});byId('helpButton').addEventListener('click',()=>switchView('about'));
  }
  wire();renderLocation();renderQuick();renderBestiary();renderCombatRoster();renderCombat();updateDataIndicator('Loading latest enemy database…','offline');loadDatabase();
})();
