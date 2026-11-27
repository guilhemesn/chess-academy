import { Chess } from 'https://cdn.jsdelivr.net/npm/chess.js@1.4.0/+esm';

const cap='Chess Fundamentals · Capablanca';
const chapters=[
  {name:'Encurrale o rei',tasks:[
    {fen:'7k/8/8/8/8/8/8/R6K w - - 0 1',source:cap+' · exemplo 1',ask:'Restrinja o rei preto à última fileira em um lance de torre.',move:'Ra7',hints:['Que fileira o rei teria de atravessar para sair do canto?','A torre pode controlar toda a sétima fileira a partir de a7.'],why:'Ta7 corta a passagem por g7 e h7. Agora o rei branco tem tempo para se aproximar.'},
    {fen:'7k/R7/8/8/8/8/8/7K b - - 1 1',source:cap+' · exemplo 1, após Ta7',ask:'Qual casa ainda está disponível para o rei preto? Toque nela.',square:'g8',hints:['Verifique as três casas vizinhas de h8.','A torre controla g7 e h7.'],why:'A torre corta a sétima fileira, mas ainda não dá xeque. O rei preto pode ir para g8.'},
    {fen:'6k1/R7/8/8/8/8/8/7K w - - 2 2',source:cap+' · exemplo 1, após …Rg8',ask:'Qual plano aproxima as brancas do mate?',choices:['Trazer o rei branco para apoiar a torre','Dar xeques laterais a qualquer custo','Entregar a torre para ganhar um tempo'],answer:0,hints:['Uma única torre corta espaço, mas precisa de ajuda para dar mate.','Qual peça branca ainda está no canto?'],why:'Rg2 inicia a marcha do rei branco. A torre mantém o corte enquanto o rei cobre as casas de fuga.'}
  ]},
  {name:'Leia a posição',tasks:[
    {fen:'8/8/8/4k3/8/8/8/4K2R w - - 0 1',source:cap+' · exemplo 2',ask:'O rei preto começa no centro. Corte a passagem para a quarta fileira com a torre.',move:'Rh4',hints:['Trace uma linha horizontal logo abaixo do rei preto.','Mova a torre de h1 até a quarta fileira.'],why:'Th4 impede que o rei preto atravesse a quarta fileira. O espaço disponível já diminuiu.'},
    {fen:'6k1/5ppp/8/8/8/8/8/R5K1 w - - 0 1',source:'Problema original · reconhecimento de padrões',ask:'Qual detalhe permite um ataque imediato?',choices:['O rei branco está em oposição','Os peões pretos bloqueiam as fugas do próprio rei','O peão f7 está sem defesa'],answer:1,hints:['Observe as três casas à frente do rei preto.','Depois de Ta8+, por onde o rei sairia?'],why:'Em Ta8#, a torre domina a oitava fileira. Os próprios peões impedem que o rei desça.'},
    {fen:'4k3/7r/8/3N4/8/8/8/4K3 w - - 0 1',source:'Problema original · cálculo',ask:'Dê xeque e ataque a torre no mesmo lance.',move:'Nf6+',hints:['Imagine as casas de destino do cavalo antes de jogar.','A partir de f6, o cavalo alcança e8 e h7.'],why:'Cf6+ força as pretas a cuidar do rei. A torre em h7 fica sob ataque.'}
  ]},
  {name:'Pense como um mestre',tasks:[
    {fen:'7k/5Q2/6K1/8/8/8/8/8 w - - 0 1',source:'Problema original · cálculo',ask:'Encontre qualquer mate em um lance.',mate:true,hints:['Conte as casas de fuga antes de mover a dama.','Uma possibilidade é colocar a dama em g7, protegida pelo rei.'],why:'O rei está em xeque e todas as respostas legais foram eliminadas.'},
    {fen:'7k/8/8/8/8/8/8/2B1KB2 w - - 0 1',source:cap+' · exemplo 3',ask:'Por que estes bispos conseguem trabalhar em dupla?',choices:['Ambos podem alcançar qualquer casa','Os bispos podem saltar o rei','Cada bispo controla casas de uma cor'],answer:2,hints:['Compare a cor das casas c1 e f1.','Um bispo permanece na mesma cor durante toda a partida.'],why:'Os bispos cobrem diagonais de cores opostas. Com o rei branco, podem restringir as fugas até formar uma rede de mate.'},
    {fen:'8/8/8/4k3/8/8/8/4K2Q w - - 0 1',source:cap+' · exemplo 4',ask:'Use a dama para cortar o acesso do rei preto à quarta fileira pela coluna h.',move:'Qh4',hints:['A dama também pode agir como uma torre.','Encontre a interseção da coluna h com a quarta fileira.'],why:'Dh4 reduz o espaço do rei. Nas próximas jogadas, aproxime o rei branco e preserve uma casa de fuga até poder dar mate.'}
  ]}
];
const mentors=[
  ['Lia','Investigar','O que muda se você considerar primeiro as casas de fuga e as peças sem defesa?'],
  ['Bento','Calcular','Imagine sua jogada e a melhor resposta adversária. O plano continua funcionando?']
];
export function setupMissions(root,progress,save,refreshXp) {
  progress.stars ||= {};
  let chapter=progress.missionPlace?.chapter ?? 0, task=progress.missionPlace?.task ?? 0, mentor=progress.mentor ?? 0, game, selected, help, missed, state, message;
  const lesson=()=>chapters[chapter].tasks[task];
  const key=()=>chapter+'-'+task;
  const total=()=>Object.values(progress.stars).reduce((a,b)=>a+b,0);
  function reset(){
    progress.missionPlace={chapter,task};save();
    game=new Chess(lesson().fen); selected='';help=0;missed=false;state='playing';message='';draw();
  }
  function answer(ok,explanation){
    state=ok?'won':'retry'; message=explanation;
    if(ok){
      const stars=Math.max(1,3-help-(missed?1:0));
      const old=progress.stars[key()]||0;
      progress.stars[key()]=Math.max(old,stars);
      progress.xp+=10*Math.max(0,stars-old); save(); refreshXp();
    } else missed=true;
    draw();
  }
  function draw(){
    const q=lesson(), goal=chapters[chapter], badge=goal.tasks.every((_,i)=>progress.stars[chapter+'-'+i]);
    const buttons=(html)=>'<div class="controls">'+html+'</div>';
    const squares=game.board().flat().map((p,i)=>{
      const s='abcdefgh'[i%8]+(8-Math.floor(i/8));
      const glyph={p:'♟',r:'♜',n:'♞',b:'♝',q:'♛',k:'♚'};
      return '<button class="sq '+((i%8+Math.floor(i/8))%2?'dark':'light')+' '+(p?.color==='w'?'white':'black')+(s===selected?' marked':'')+'" data-ms="'+s+'" aria-label="'+s+'" '+(state!=='playing'||q.choices?'aria-disabled="true"':'')+'>'+(p?glyph[p.type]:'')+'<span>'+s+'</span></button>';
    }).join('');
    root.innerHTML='<div class="layout"><section><div class="board-status">'+(game.turn()==='w'?'Brancas':'Pretas')+' jogam</div><div class="board">'+squares+'</div></section><div><section class="panel"><small>Missão '+(chapter+1)+' · Desafio '+(task+1)+' de '+goal.tasks.length+'</small><h1>'+goal.name+'</h1><p>'+q.ask+'</p>'+
      (q.choices&&state==='playing'?q.choices.map((c,i)=>'<button class="item" data-answer="'+i+'">'+c+'</button>').join(''):'')+
      '<div class="coach" role="status"><strong>'+mentors[mentor][0]+' · '+(state==='won'?'Desafio concluído':state==='retry'?'Vamos rever':mentors[mentor][1])+'</strong><p>'+(message||mentors[mentor][2])+'</p></div>'+
      buttons(state==='won'?'<button class="primary" data-action="next">'+(task===2?'Próxima missão':'Continuar')+'</button>':state==='retry'?'<button data-action="retry">Tentar novamente</button>':'<button data-action="hint" '+(help===2?'disabled':'')+'>Pedir pista ('+help+'/2)</button><button data-action="mentor">Trocar treinador</button>')+
      '<p><small>'+q.source+'</small></p></section><section class="panel"><h2>Mapa de missões</h2><p>★ '+total()+' / 27 estrelas'+(badge?' · Medalha conquistada':'')+'</p>'+
      chapters.map((c,i)=>'<button class="item" data-chapter="'+i+'">'+c.name+' <small>'+c.tasks.map((_,t)=>progress.stars[i+'-'+t]?'★':'☆').join('')+'</small></button>').join('')+
      '<small>Até 3 estrelas por desafio. Cada pista ou tentativa incorreta reduz a recompensa desta tentativa. Melhore seu recorde para ganhar XP.</small><details><summary>Livros e método</summary><p>As posições identificadas vêm de <a href="https://www.gutenberg.org/ebooks/33870">Chess Fundamentals</a>, de Capablanca (exemplos 1–4). As perguntas e pistas foram adaptadas para o tabuleiro.</p><p>O treino misto segue a proposta do <a href="https://www.stappenmethode.nl/en/step1.php">Workbook Step 1 Mix</a>. Os problemas marcados como originais foram criados para o aplicativo.</p></details></section></div></div>';
  }
  function handle(b){
    const q=lesson(),d=b.dataset;
    if(d.chapter!==undefined){chapter=Number(d.chapter);task=0;reset();return}
    if(d.action==='next'){task++;if(task===3){task=0;chapter=(chapter+1)%chapters.length}reset();return}
    if(d.action==='retry'){const used=help;reset();missed=true;help=used;draw();return}
    if(state!=='playing')return;
    if(d.action==='hint'){message=(mentor?'Calcule antes de tocar. ':'Procure no tabuleiro. ')+q.hints[Math.min(help,1)];help=Math.min(2,help+1);draw();return}
    if(d.action==='mentor'){mentor=1-mentor;progress.mentor=mentor;save();message=mentors[mentor][2];draw();return}
    if(d.answer!==undefined){answer(Number(d.answer)===q.answer,q.why);return}
    const s=d.ms;if(!s||q.choices)return;
    if(q.square){answer(s===q.square,s===q.square?q.why:'Confira se '+s+' fica ao alcance do rei e fora da linha da torre.');return}
    if(game.get(s)?.color===game.turn()){selected=s;draw();return}
    const move=selected && game.moves({square:selected,verbose:true}).find(m=>m.to===s);
    if(!move)return;
    selected='';game.move(move);
    const ok=q.mate?game.isCheckmate():move.san===q.move;
    answer(ok,ok?q.why:'Depois de '+move.san+', o objetivo ainda não foi alcançado. '+q.hints[0]);
  }
  return {open:reset,handle};
}
