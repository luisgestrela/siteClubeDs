# Clube D/S — React

```
npm install
cp .env.example .env     # coloque o link do WhatsApp (e, se quiser, os dominios de e-mail)
npm run dev              # http://localhost:5173
```
Requer Node 18 ou superior. Para publicar (Vercel), adicione as variaveis `VITE_*` do `.env` nas configuracoes do projeto; o `vercel.json` ja trata as rotas.

Fluxo: botao "Quero participar" -> pagina `/participar` -> formulario -> dados gravados na Planilha Google -> caixa perguntando se a pessoa quer entrar na comunidade do WhatsApp -> mensagem de sucesso + secao da comunidade.
Banco de dados: siga `docs/google-apps-script.gs` para criar a planilha e coloque a URL gerada em `VITE_FORM_ENDPOINT`. Sem ela, nada e gravado.
Documento oficial: `public/documentos/ClubeDS-Documento-Oficial.pdf` (botao ao lado de "Quero participar" no fim da home).

Professores: edite `src/dados.js` (nome, cargo, areas e foto em `public/professores/`). Cursos do formulario tambem ficam la.

Equipe e hackathon: em `src/dados.js`, troque os nomes do presidente e do vice em `LIDERES` e, quando quiser, liste os projetos do Power Tech Hackathon em `PROJETOS_HACKATHON` (a grade so aparece quando a lista tem itens). As fotos ficam em `public/equipe/`.

## Desafios de lógica (`/desafios`)
Os botões "Desafios de lógica" da home abrem `/desafios` em uma nova aba. Fluxo: tela de carregamento (robô voando) -> Buddy chega e conversa -> escolha do nível. Só o nível **Fácil** está pronto (Decifre o Padrão, Adivinhe o Número e Ordene a Fila); Médio e Difícil aparecem como "Em breve".
- Falas do Buddy: `src/desafios/falas.js` (marque `perto`/`animado` para mudar o comportamento dele).
- Imagens: `public/buddy/` (expressões) e `public/buddy/voando/` (23 frames do voo).
- Sons: `public/audio/carregamento.mp3` (toca durante o carregamento) e `public/audio/tema.mp3` (loop até sair da página). Lógica em `src/desafios/audio.js`.
- A página abre com um botão de play (`public/buddy/play.webp`): o clique nele inicia o carregamento e libera o áudio no navegador.
- Jogos: `src/desafios/Padrao.jsx`, `Numero.jsx`, `Fila.jsx`. A pontuação e as estrelas ficam salvas só no navegador (localStorage). Ranking compartilhado exigiria um banco (ex.: Supabase).
