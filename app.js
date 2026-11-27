import { Chess } from 'https://cdn.jsdelivr.net/npm/chess.js@1.4.0/+esm';
import { setupMissions } from './missions.js?v=5';
import { lessons, games, tactics, notes } from './study.js?v=4';

const $ = id => document.getElementById(id);
const piece = {k:'rei',q:'dama',r:'torre',b:'bispo',n:'cavalo',p:'peão'};
const glyph = {k:'♚',q:'♛',r:'♜',b:'♝',n:'♞',p:'♟'};
const value = {k:0,q:900,r:500,b:330,n:320,p:100};
const uci = m => m.from + m.to + (m.promotion || '');
const parse = code => ({from:code.slice(0,2),to:code.slice(2,4),promotion:code[4]});
const label = m => m ? m.san : '';
const center = ['d4','e4','d5','e5'];
const openingHome = ['b1','g1','c1','f1','b8','g8','c8','f8'];
const modes = [['Missões','★'],['Aulas','◈'],['Táticas','✦'],['Jogar','♞'],['Partidas','▤'],['Progresso','◉']];
let progress = {done:[],xp:0,errors:{}};
try {
  const current = JSON.parse(localStorage.getItem('academy-v4'));
  const old = JSON.parse(localStorage.getItem('academy-v1'));
  if (current) progress = current;
  else if (old) {
    const legacyIndexes = [0,1,3,4,5,6];
    const mapIndex = i => old.done?.some(id => id > 5) ? i : (legacyIndexes[i] ?? i);
    progress = {xp:old.xp || 0,done:(old.done || []).map(mapIndex),errors:Object.fromEntries(Object.entries(old.errors || {}).map(([i, errors])=>[mapIndex(Number(i)),errors]))};
    save();
  }
} catch {}

let mode='Aulas', index=0, step=0, game, selection='', wrong=false, solved=false;
let hint=false, feedback='', promotion=[], timeline=[], cursor=0, gameIndex=0;
let busy=false, turnToken=0, reason='', historyNotes=[];
function save() { try { localStorage.setItem('academy-v4',JSON.stringify(progress)); } catch {} }
function lesson() { return lessons[index]; }
function unlocked(i) { return lessons[i].level === 1 || progress.done.includes(i) || progress.xp >= (lessons[i].level-1)*100; }
function start(next=mode, i=0) {
  turnToken++;
  mode=next; index=i; step=0; selection=''; wrong=false; solved=false;
  hint=false; feedback=''; promotion=[]; timeline=[]; cursor=0; reason=''; historyNotes=[]; busy=false;
  game=new Chess();
  if (next==='Partidas') {
    gameIndex=i;
    game.loadPgn(games[i].pgn);
    timeline=game.history({verbose:true});
    game.reset();
  }
  if (['Aulas','Táticas'].includes(next) && lesson().fen!=='start') game.load(lesson().fen);
  render();
}

function evaluate(position, color) {
  if (position.isCheckmate()) return position.turn()===color ? -30000 : 30000;
  if (position.isDraw()) return 0;
  let score=0;
  for (const row of position.board()) for (const p of row) {
    if (!p) continue;
    const file='abcdefgh'.indexOf(p.square[0]), rank=Number(p.square[1]);
    const centrality=7-Math.abs(file-3.5)-Math.abs(rank-4.5);
    let bonus=0;
    if (p.type==='n'||p.type==='b') bonus=centrality*7;
    if (p.type==='p') bonus=centrality*4+(p.color==='w'?rank-2:7-rank)*5;
    score+=(p.color===color?1:-1)*(value[p.type]+bonus);
  }
  return score;
}

function candidate(position, move) {
  const color=move.color;
  position.move(move);
  try {
    let score=evaluate(position,color), reply=null;
    if (!position.isGameOver()) {
      score=Infinity;
      for (const response of position.moves({verbose:true})) {
        position.move(response);
        const result=evaluate(position,color);
        position.undo();
        if (result<score) { score=result; reply=response; }
      }
    }
    return {move, score, reply};
  } finally {
    position.undo();
  }
}

function ranked(position) {
  return position.moves({verbose:true}).map(m=>candidate(position,m)).sort((a,b)=>b.score-a.score);
}

function idea(m, ply) {
  if (m.san.endsWith('#')) return 'O rei fica sem saída. Confira como as outras peças cobrem as casas de fuga.';
  if (m.san.startsWith('O-O')) return 'O roque tira o rei do centro e aproxima a torre do jogo.';
  if (m.promotion) return `O peão chega à última fileira e vira ${piece[m.promotion]}.`;
  if (m.san.endsWith('+')) return `É xeque. Procure se o rei pode fugir, bloquear ou capturar em ${m.to}.`;
  if (m.captured) return `O lance captura ${piece[m.captured]} em ${m.to}. Confira se há recaptura e quem se beneficia da troca.`;
  if (m.piece==='p' && center.includes(m.to)) return `O peão ocupa ${m.to} e disputa espaço no centro.`;
  if (ply<18 && ['n','b'].includes(m.piece) && openingHome.includes(m.from)) return `O ${piece[m.piece]} sai da posição inicial e entra no jogo por ${m.to}.`;
  return `O ${piece[m.piece]} vai de ${m.from} a ${m.to}. Compare as casas que controla antes e depois do lance.`;
}

function assess(position, move) {
  const choices=ranked(position);
  const best=choices[0], played=choices.find(item=>uci(item.move)===uci(move));
  const gap=best.score-played.score;
  const grade=gap>=150?'Lance ruim':gap>=40?'Pode melhorar':'Bom lance';
  let text=idea(move,position.history().length);
  if (gap>=40) {
    if (played.reply?.san.endsWith('#')) text+=` A resposta ${label(played.reply)} dá mate.`;
    else if (played.reply?.captured) text+=` A resposta ${label(played.reply)} pode capturar ${piece[played.reply.captured]}.`;
    text+=` Compare com ${label(best.move)}, que deixa uma posição melhor na análise das respostas imediatas.`;
  }
  return {grade,text};
}

function explainWrong(move, expected) {
  const goal=lesson().tips[step] || lesson().text;
  const played=candidate(game,move);
  const expectedMove=game.moves({verbose:true}).find(m=>uci(m)===expected);
  const intended=candidate(game,expectedMove);
  let explanation=`${label(move)} leva o ${piece[move.piece]} a ${move.to}. `;
  if (played.reply?.san.endsWith('#')) explanation+=`As pretas podem dar mate com ${label(played.reply)}. `;
  else if (played.reply?.captured && intended.score-played.score>=90) explanation+=`As pretas podem responder ${label(played.reply)} e tomar ${piece[played.reply.captured]}. `;
  else if (index===4) explanation+='O cavalo precisa ameaçar ao mesmo tempo o rei em e8 e a torre em h7. ';
  else if ([5,16].includes(index)) explanation+='O rei adversário ainda não recebeu mate. ';
  else if (index===7) explanation+='A dama preta em e3 continua sem ser capturada. ';
  return explanation+goal;
}

function exercise(move) {
  const expected=lesson().moves[step];
  if (uci(move)!==expected && !([5,16].includes(index) && move.san.endsWith('#'))) {
    feedback=explainWrong(move,expected);
    progress.errors[index]=(progress.errors[index]||0)+1; save();
    if (mode==='Táticas') { game.move(move); wrong=true; }
    return;
  }
  game.move(move);
  feedback=idea(move,step);
  step++;
  while (game.turn()==='b' && step<lesson().moves.length) game.move(parse(lesson().moves[step++]));
  if (step===lesson().moves.length) {
    solved=true;
    if (!progress.done.includes(index)) { progress.done.push(index); progress.xp+=50; save(); }
  }
}

function finish(message) {
  turnToken++; busy=false; selection=''; promotion=[]; reason=message;
  timeline=game.history({verbose:true}); cursor=timeline.length;
  render();
}

function naturalEnd() {
  finish(game.isCheckmate()?(game.turn()==='b'?'Você venceu por xeque-mate.':'O computador venceu por xeque-mate.'):'A partida terminou empatada.');
}

function playTraining(move) {
  historyNotes.push(assess(game,move));
  game.move(move);
  if (game.isGameOver()) { naturalEnd(); return; }
  busy=true;
  const token=++turnToken;
  setTimeout(()=>{
    if (token!==turnToken) return;
    const choices=ranked(game);
    const best=choices[0];
    const options=choices.filter(c=>c.score>=best.score-35);
    const response=options[Math.floor(Math.random()*options.length)].move;
    historyNotes.push({grade:'Computador',text:idea(response,game.history().length)});
    game.move(response); busy=false;
    if (game.isGameOver()) naturalEnd(); else render();
  },140);
}

function canMove() {
  return !busy&&!wrong&&!solved&&!reason&&mode!=='Partidas'&&!game.isGameOver()&&!promotion.length;
}

function handleSquare(square) {
  if (!canMove()) return;
  if (game.get(square)?.color===game.turn()) selection=selection===square?'':square;
  else if (selection) {
    const moves=game.moves({square:selection,verbose:true}).filter(m=>m.to===square);
    if (moves.length>1) promotion=moves;
    else if (moves.length) { applyMove(moves[0]); return; }
  }
  render();
}

function applyMove(move) {
  selection=''; hint=false; promotion=[]; feedback='';
  if (mode==='Jogar') playTraining(move); else exercise(move);
  render();
}

function seek(next) {
  feedback='';
  cursor=Math.min(timeline.length,Math.max(0,next));
  game=new Chess(cursor ? timeline[cursor-1].after : undefined);
  render();
}

function button(id,text,disabled=false,primary=false) {
  return `<button id="${id}" ${disabled?'disabled':''} ${primary?'class="primary"':''}>${text}</button>`;
}
function coach(title,text) {
  return `<div class="coach" role="status"><div class="coach-top"><span class="avatar" aria-hidden="true">♞</span><span>Assistente<strong>${title}</strong></span></div><p>${text}</p></div>`;
}
function lessonList(ids) {
  return ids.map(i=>`<button class="item ${i===index&&mode!=='Progresso'?'current':''}" data-lesson="${i}" ${mode!=='Táticas'&&!unlocked(i)?'disabled':''}><span>${progress.done.includes(i)?'✓':'○'} &nbsp;${lessons[i].title}</span><small>${mode!=='Táticas'&&!unlocked(i)?(lessons[i].level-1)*100+' XP':'Nível '+lessons[i].level}</small></button>`).join('');
}

function board() {
  const last=(mode==='Partidas'||reason)?timeline[cursor-1]:game.history({verbose:true}).at(-1);
  const target=hint?lesson().moves[step]:null;
  const legal=selection?game.moves({square:selection,verbose:true}).map(m=>m.to):[];
  return `<div class="board" aria-label="Tabuleiro">${game.board().flat().map((p,i)=>{
    const square='abcdefgh'[i%8]+(8-Math.floor(i/8));
    const dark=(Math.floor(i/8)+i%8)%2;
    const marked=[last?.from,last?.to,target?.slice(0,2),target?.slice(2,4),selection].includes(square);
    return `<button aria-label="${square}${p?' · '+piece[p.type]+' '+(p.color==='w'?'brancas':'pretas'):''}" data-square="${square}" ${canMove()?'':'aria-disabled="true"'} class="sq ${dark?'dark':'light'} ${p?.color==='w'?'white':'black'} ${marked?'marked':''} ${wrong&&last?.to===square?'wrong':''} ${legal.includes(square)?'target':''}">${p?glyph[p.type]:''}<span>${i%8===0||i>=56?square:''}</span></button>`;
  }).join('')}</div>`;
}

function render() {
  $('xp').textContent=progress.xp+' XP';
  for (const el of $('nav').querySelectorAll('[data-mode]')) el.setAttribute('aria-pressed',String(el.dataset.mode===mode));
  const isGame=mode==='Jogar', famous=mode==='Partidas', replay=famous||reason;
  if (mode==='Missões') { missions.open(); return; }
  if (mode==='Progresso') {
    $('app').innerHTML=`<section class="panel"><h1>Seu progresso</h1><p>${progress.done.length} de ${lessons.length} aulas e exercícios concluídos</p><progress max="${lessons.length}" value="${progress.done.length}"></progress><h2>Trilha de estudo</h2>${lessonList(lessons.map((_,i)=>i))}</section>`;
    return;
  }
  const status=wrong?'Tentativa incorreta':replay?`Lance ${cursor} de ${timeline.length}`:busy?'Computador pensando…':game.isCheckmate()?'Xeque-mate':(game.turn()==='w'?'Brancas':'Pretas')+' jogam'+(game.isCheck()?' · Xeque':'');
  let sidebar, controls;
  if (replay) {
    controls=button('first','Início',cursor===0)+button('prev','Anterior',cursor===0)+button('next','Próximo lance',cursor===timeline.length);
    const move=timeline[cursor-1], record=historyNotes[cursor-1];
    const title=famous?games[gameIndex].title:'Revisão da partida';
    const overview=famous?games[gameIndex].players:reason;
    sidebar=`<section class="panel"><h1>${title}</h1><p class="muted">${overview}</p>
      ${coach(move?(record?record.grade+' · ':'')+label(move):'Posição inicial',move?(record?.text||notes[gameIndex]?.[cursor]||idea(move,cursor-1)):(timeline.length?'Avance um lance de cada vez. Antes de avançar, tente prever o que o jogador ameaça.':'A partida foi encerrada antes do primeiro lance.'))}
      <div class="move-list" aria-label="Histórico de lances">${timeline.map((m,i)=>`<button data-ply="${i+1}" aria-pressed="${cursor===i+1}">${i%2===0?(Math.floor(i/2)+1)+'. ':''}${label(m)}</button>`).join('')}</div>
      ${reason?button('new','Nova partida',false,true):''}</section>`;
    if (famous) sidebar+=`<section class="panel"><h2>Partidas clássicas</h2>${games.map((g,i)=>`<button class="item ${i===gameIndex?'current':''}" data-game="${i}">${g.title}</button>`).join('')}</section>`;
  } else if (isGame) {
    controls=button('undo','Desfazer',!historyNotes.length)+button('end','Encerrar partida',false,true);
    const yourMove=historyNotes.at(historyNotes.length%2?-1:-2);
    const reply=historyNotes.length%2?null:historyNotes.at(-1);
    sidebar=`<section class="panel"><h1>Partida comentada</h1><p class="muted">Você joga de brancas. O assistente avalia as respostas imediatas antes de sugerir alternativas.</p>${coach(yourMove?.grade||'Antes do primeiro lance',yourMove?.text||'Procure ocupar o centro, desenvolver as peças menores e preparar o roque.')}${reply?`<p class="muted">${reply.text}</p>`:''}</section>`;
  } else {
    const ids=mode==='Táticas'?tactics:lessons.map((_,i)=>i);
    const next=ids.slice(ids.indexOf(index)+1).find(i=>mode==='Táticas'||unlocked(i));
    controls=button('reset',wrong?'Voltar ao início do problema':'Reiniciar',false,wrong)+button('hint','Dica',wrong||solved);
    sidebar=`<section class="panel"><small>${mode==='Táticas'?'Tática':'Aula'} · Nível ${lesson().level}</small><h1>${lesson().title}</h1>
      ${coach(wrong?'Por que o lance falhou':solved?'Exercício concluído':hint?'Dica':feedback?'Seu último lance':'O que observar',feedback|| (hint?lesson().tips[step]:lesson().text))}
      <progress max="${lesson().moves.length}" value="${step}"></progress>${solved&&next!==undefined?`<button class="primary" data-lesson="${next}">Continuar</button>`:''}</section>
      <section class="panel"><h2>${mode==='Táticas'?'Problemas':'Trilha de estudo'}</h2>${lessonList(ids)}</section>`;
    if (mode==='Aulas') sidebar+=`<details class="panel"><summary>Referências das aulas</summary><p>Estude os princípios e finais básicos com <a href="https://www.gutenberg.org/ebooks/33870">Chess Fundamentals</a>, de Capablanca. O estudo de partidas lance a lance segue a abordagem de <a href="https://www.batsfordbooks.com/book/logical-chess-move-by-move-2/">Logical Chess</a>, de Irving Chernev.</p></details>`;
  }
  if (isGame||famous) {
    sidebar+=`<section class="panel"><h2>Converse com o treinador</h2><div class="controls">${button('inspect','O que observar?',busy||game.isGameOver())}${button('line','Mostre uma linha',busy||game.isGameOver())}</div>${feedback?coach('Análise da posição',feedback):''}</section>`;
  }
  $('app').innerHTML=`<div class="layout"><section class="board-panel"><div class="board-status">${status}</div>${board()}
    ${promotion.length?`<div class="controls" aria-label="Promoção">${promotion.map(m=>`<button data-promotion="${m.promotion}">${piece[m.promotion]}</button>`).join('')}${button('cancel','Cancelar')}</div>`:''}
    <div class="controls">${controls}</div></section><div class="sidebar">${sidebar}</div></div>`;
}

$('nav').innerHTML=modes.map(([name,icon])=>`<button data-mode="${name}"><span aria-hidden="true">${icon}</span>${name}</button>`).join('');
$('nav').onclick=event=>{
  const next=event.target.closest('button')?.dataset.mode;
  if (!next||next===mode) return;
  start(next,next==='Táticas'?tactics[0]:0);
};
$('app').onclick=event=>{
  const control=event.target.closest('button');
  if (!control||control.disabled) return;
  if(mode==='Missões'){missions.handle(control);return}
  const {lesson:id,game:classic,ply,square,promotion:promote}=control.dataset;
  if (id!==undefined) { start(mode==='Progresso'?'Aulas':mode,Number(id)); return; }
  if (classic!==undefined) { start('Partidas',Number(classic)); return; }
  if (ply!==undefined) { seek(Number(ply)); return; }
  if (square) { handleSquare(square); return; }
  if (promote) { applyMove(promotion.find(m=>m.promotion===promote)); return; }
  switch(control.id) {
    case 'inspect':
    case 'line': {
      const best=ranked(game)[0];
      if (!best) break;
      feedback=control.id==='line'
        ? 'Uma continuação para comparar é '+best.move.san+(best.reply?' '+best.reply.san:'')+'. '+idea(best.move,game.history().length)
        : game.isCheck()?'Seu rei está em xeque. Compare as fugas, os bloqueios e as capturas possíveis.':best.move.captured?'Observe '+best.move.to+'. Há uma captura disponível ali. Antes de decidir, conte as recapturas.':'Observe o '+piece[best.move.piece]+' em '+best.move.from+'. Que casas ele alcança e que resposta pode provocar?';
      render(); break;
    }
    case 'first': seek(0); break;
    case 'prev': seek(cursor-1); break;
    case 'next': seek(cursor+1); break;
    case 'reset': start(mode,index); break;
    case 'new': start('Jogar'); break;
    case 'hint': hint=true; feedback=''; render(); break;
    case 'end': finish('Você encerrou a partida.'); break;
    case 'cancel': promotion=[]; render(); break;
    case 'undo':
      turnToken++; busy=false; promotion=[]; selection='';
      game.undo(); historyNotes.pop();
      if (game.turn()==='b') { game.undo(); historyNotes.pop(); }
      render();
      break;
  }
};
const missions=setupMissions($('app'),progress,save,()=>{ $('xp').textContent=progress.xp+' XP'; });
start('Missões');
if ('serviceWorker' in navigator) navigator.serviceWorker.register('./sw.js').catch(console.warn);
