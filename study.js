export const lessons=[
{title:'Controle do centro',level:1,text:'Ocupe o centro com peões para ganhar espaço e abrir linhas.',fen:'start',moves:['e2e4','e7e5','d2d4'],tips:['Avance o peão do rei duas casas.','As pretas disputam o centro.','Ocupe também d4.']},
{title:'Desenvolva os cavalos',level:1,text:'Desenvolva peças menores para casas ativas antes de iniciar ataques.',fen:'start',moves:['e2e4','e7e5','g1f3','b8c6'],tips:['Abra espaço no centro.','As pretas desenvolvem.','Desenvolva o cavalo e ataque e5.','As pretas defendem o peão.']},
{title:'Bispo ativo',level:1,text:'Desenvolva o bispo mirando o centro e pontos vulneráveis.',fen:'start',moves:['e2e4','e7e5','f1c4'],tips:['Abra a diagonal do bispo.','As pretas ocupam o centro.','Coloque o bispo em uma diagonal ativa.']},
{title:'Roque e segurança',level:2,text:'O roque tira o rei do centro e aproxima a torre das colunas centrais.',fen:'r1bqkbnr/pppp1ppp/2n5/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 2 4',moves:['e1g1'],tips:['Faça o roque curto e leve o rei à segurança.']},
{title:'Garfo de cavalo',level:2,text:'Um garfo cria ameaças simultâneas e pode ganhar material.',fen:'4k3/7r/8/3N4/8/8/8/4K3 w - - 0 1',moves:['d5f6'],tips:['Dê xeque em f6 e ataque a torre de h7.']},
{title:'Mate em um',level:2,text:'Procure xeques forçados e confirme se o rei tem casas de fuga.',fen:'7k/5Q2/6K1/8/8/8/8/8 w - - 0 1',moves:['f7g7'],tips:['Encontre o mate com a dama protegida pelo rei.']},
{title:'Promoção',level:2,text:'Um peão que chega à última fileira pode promover e decidir a partida.',fen:'7k/P7/8/8/8/8/8/4K3 w - - 0 1',moves:['a7a8q'],tips:['Promova o peão a dama.']},
{title:'Peça sem defesa',level:3,text:'Antes de atacar, conte atacantes e defensores. Uma peça sobrecarregada pode não proteger tudo.',fen:'r3k3/8/8/8/8/4q3/4R3/4K3 w - - 0 1',moves:['e2e3'],tips:['Capture a dama em e3 com a torre.']},
{title:'Ative a torre',level:3,text:'Torres ganham força em colunas abertas e na sétima fileira.',fen:'4k3/8/8/8/8/8/R7/4K3 w - - 0 1',moves:['a2a7'],tips:['Leve a torre à sétima fileira para restringir o rei.']}
];
export const games=[
{title:'A Partida Imortal',players:'Anderssen × Kieseritzky · Londres, 1851',pgn:'1. e4 e5 2. f4 exf4 3. Bc4 Qh4+ 4. Kf1 b5 5. Bxb5 Nf6 6. Nf3 Qh6 7. d3 Nh5 8. Nh4 Qg5 9. Nf5 c6 10. g4 Nf6 11. Rg1 cxb5 12. h4 Qg6 13. h5 Qg5 14. Qf3 Ng8 15. Bxf4 Qf6 16. Nc3 Bc5 17. Nd5 Qxb2 18. Bd6 Bxg1 19. e5 Qxa1+ 20. Ke2 Na6 21. Nxg7+ Kd8 22. Qf6+ Nxf6 23. Be7#',themes:['Desenvolvimento rápido e iniciativa podem compensar material.','A dama e as peças brancas coordenam um ataque ao rei.','O sacrifício final abre caminho para o mate.']},
{title:'A Partida do Século',players:'Donald Byrne × Bobby Fischer · Nova York, 1956',pgn:'1. Nf3 Nf6 2. c4 g6 3. Nc3 Bg7 4. d4 O-O 5. Bf4 d5 6. Qb3 dxc4 7. Qxc4 c6 8. e4 Nbd7 9. Rd1 Nb6 10. Qc5 Bg4 11. Bg5 Na4 12. Qa3 Nxc3 13. bxc3 Nxe4 14. Bxe7 Qb6 15. Bc4 Nxc3 16. Bc5 Rfe8+ 17. Kf1 Be6 18. Bxb6 Bxc4+ 19. Kg1 Ne2+ 20. Kf1 Nxd4+ 21. Kg1 Ne2+ 22. Kf1 Nc3+ 23. Kg1 axb6 24. Qb4 Ra4 25. Qxb6 Nxd1 26. h3 Rxa2 27. Kh2 Nxf2 28. Re1 Rxe1 29. Qd8+ Bf8 30. Nxe1 Bd5 31. Nf3 Ne4 32. Qb8 b5 33. h4 h5 34. Ne5 Kg7 35. Kg1 Bc5+ 36. Kf1 Ng3+ 37. Ke1 Bb4+ 38. Kd1 Bb3+ 39. Kc1 Ne2+ 40. Kb1 Nc3+ 41. Kc1 Rc2#',themes:['Desenvolver as peças e controlar o centro.','Fischer sacrifica a dama para obter atividade e ataque.','Peças coordenadas podem valer mais que material.']},
{title:'Opera Game',players:'Paul Morphy × Duque de Brunswick e Conde Isouard · Paris, 1858',pgn:'1. e4 e5 2. Nf3 d6 3. d4 Bg4 4. dxe5 Bxf3 5. Qxf3 dxe5 6. Bc4 Nf6 7. Qb3 Qe7 8. Nc3 c6 9. Bg5 b5 10. Nxb5 cxb5 11. Bxb5+ Nbd7 12. O-O-O Rd8 13. Rxd7 Rxd7 14. Rd1 Qe6 15. Bxd7+ Nxd7 16. Qb8+ Nxb8 17. Rd8#',themes:['Desenvolva peças com tempo, atacando alvos.','Abrir linhas para as torres é decisivo.','O desenvolvimento rápido permite atacar o rei preso no centro.']}
];

function opening(title, level, text, moves, tips) {
  return {title, level, text, fen:'start', moves:moves.split(' '), tips};
}
lessons.push(
  opening('Abertura Italiana',1,'O bispo em c4 mira f7, ponto defendido apenas pelo rei na posição inicial.', 'e2e4 e7e5 g1f3 b8c6 f1c4',['Ocupe e4.','','Ataque e5 com o cavalo de g1.','','Desenvolva o bispo em c4.']),
  opening('Gambito da Dama',2,'O peão de c4 desafia d5. Se as pretas capturarem, fica mais fácil disputar o centro com e4.', 'd2d4 d7d5 c2c4',['Comece com d4.','','Pressione d5 com o peão de c.']),
  opening('Abertura Espanhola',2,'O bispo em b5 pressiona o cavalo que defende e5. As brancas podem rocar e preparar c3 e d4.', 'e2e4 e7e5 g1f3 b8c6 f1b5',['Ocupe e4.','','Ataque e5 com o cavalo.','','Pressione c6 com o bispo em b5.']),
  opening('Defesa Francesa · avanço',3,'Depois de e5, as brancas ganham espaço. Observe como as pretas podem atacar a base da cadeia em d4 com c5.', 'e2e4 e7e6 d2d4 d7d5 e4e5',['Comece com e4.','','Forme o centro com d4.','','Avance a e5 e veja a cadeia d4–e5.']),
  opening('Siciliana Aberta',3,'As brancas trocam o peão de d pelo de c das pretas. Isso abre a coluna c para as pretas e facilita o desenvolvimento branco.', 'e2e4 c7c5 g1f3 d7d6 d2d4 c5d4 f3d4',['Ocupe e4.','','Prepare d4 com Cf3.','','Abra o centro com d4.','','Recapture com o cavalo em d4.']),
  {title:'Oposição',level:2,text:'Os reis separados por uma casa se bloqueiam. Quem precisa mover costuma ceder passagem.',fen:'8/4k3/8/8/4K3/4P3/8/8 w - - 0 1',moves:['e4e5'],tips:['Avance o rei para e5 e deixe e6 entre os reis.']},
  {title:'Peão passado',level:2,text:'Um peão passado não tem peões inimigos capazes de pará-lo à frente na mesma coluna ou nas vizinhas.',fen:'7k/8/P7/8/8/8/8/4K3 w - - 0 1',moves:['a6a7','h8g7','a7a8q'],tips:['Avance o peão até a7.','','Promova em a8.']},
  {title:'Mate de corredor',level:2,text:'Uma fileira de peões pode prender o rei. Procure um xeque de torre na última fileira.',fen:'6k1/5ppp/8/8/8/8/8/R5K1 w - - 0 1',moves:['a1a8'],tips:['Leve a torre a a8 e confira as casas de fuga.']}
);
export const tactics = [4,5,7,16,6];
export const notes = [
  {2:'O Gambito do Rei oferece um peão para desviar e5 e abrir a coluna f.', 34:'A dama preta ganha um peão em b2 enquanto o rei continua no centro. Conte as peças brancas que podem chegar com xeque.',43:'A dama atrai o cavalo para f6. O bispo pode então dar mate em e7.'},
  {22:'O cavalo ataca a dama em c5 e leva a dama a uma casa afastada do jogo central.',34:'Fischer oferece a dama para ganhar tempos com xeques. Observe a ação conjunta das peças menores.',82:'A torre chega a c2 e encerra o ataque com ajuda do cavalo e do bispo.'},
  {13:'Db3 cria pressão em f7 e b7. Observe como a dama e o bispo colaboram contra f7.',23:'O roque longo coloca a torre em d1 e permite atacar pela coluna aberta.',31:'O sacrifício desvia o cavalo de d7 e libera a entrada da torre em d8.'}
];
