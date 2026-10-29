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
