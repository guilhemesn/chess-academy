# Chess Academy — versão inicial

1. Extraia o ZIP. No computador, abra a pasta no VS Code.
2. Execute `python -m http.server 8000` no terminal dentro da pasta.
3. Abra http://localhost:8000 no navegador. A primeira visita exige internet para carregar chess.js.
4. Para instalar no celular, publique os arquivos estáticos em um serviço HTTPS (por exemplo, GitHub Pages). Abra o endereço no Chrome e use Instalar aplicativo ou Adicionar à tela inicial.

O service worker tenta armazenar os arquivos e a biblioteca externa para uso offline após a primeira visita. Progresso local por navegador. Não há sincronização, Stockfish ou IA generativa nesta versão. O adversário usa busca simples de dois meios-lances. As aulas têm soluções específicas, não todas as alternativas possíveis.
