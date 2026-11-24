/**
 * Recebe as sugestões de pauta do site (seção do jornal Conecta TI) e envia por e-mail para o ClubeDS.
 *
 * Como configurar (leva uns 3 minutos):
 * 1. Entre no Google com a conta que vai ENVIAR os e-mails (pode ser a própria ds.clube00@gmail.com).
 * 2. Abra script.google.com > Novo projeto. Apague o conteúdo, cole este código e salve.
 * 3. Confira o e-mail em DESTINO, logo abaixo (é para onde as sugestões chegam).
 * 4. Implantar > Nova implantação > tipo "App da Web".
 *    - Executar como: Eu
 *    - Quem pode acessar: Qualquer pessoa
 *    Na primeira vez, o Google pede autorização para enviar e-mails: aceite.
 * 5. Copie a URL gerada e coloque em VITE_PAUTA_ENDPOINT (no .env e nas variáveis da Vercel).
 *    Depois faça um novo deploy do site.
 *
 * Observação: se mudar este código depois, é preciso criar uma nova versão em
 * Implantar > Gerenciar implantações (a URL continua a mesma).
 * Limite do Gmail: cerca de 100 e-mails por dia em conta gratuita.
 */
var DESTINO = 'ds.clube00@gmail.com';

function doPost(e) {
  try {
    var d = JSON.parse(e.postData.contents);
    var nome = limpa(d.nome, 80, true);
    var email = limpa(d.email, 120, true);
    var pauta = limpa(d.pauta, 1500, false);
    if (nome.length < 2 || pauta.length < 10) return resposta('invalido');

    // freio simples contra spam: no máximo 5 envios por minuto no total
    var cache = CacheService.getScriptCache();
    var n = Number(cache.get('pautas') || 0);
    if (n >= 5) return resposta('limite');
    cache.put('pautas', String(n + 1), 60);

    var opcoes = { name: 'Site Clube D/S' };
    if (/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) opcoes.replyTo = email;

    var corpo = 'Nova sugestão de pauta para o Conecta TI\n\n' +
      'Nome: ' + nome + '\n' +
      'E-mail: ' + (email || '(não informado)') + '\n' +
      'Enviado em: ' + (d.enviadoEm || new Date().toISOString()) + '\n\n' +
      '--- Pauta ---\n' + pauta + '\n';
    MailApp.sendEmail(DESTINO, 'Sugestão de pauta — Conecta TI (' + nome + ')', corpo, opcoes);
    return resposta('ok');
  } catch (err) {
    return resposta('erro');
  }
}

// remove caracteres de controle e corta no tamanho máximo; campos de uma linha só perdem quebras de linha
function limpa(valor, max, umaLinha) {
  var s = String(valor == null ? '' : valor).replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, '');
  if (umaLinha) s = s.replace(/\s+/g, ' ');
  return s.trim().slice(0, max);
}

function resposta(texto) {
  return ContentService.createTextOutput(texto);
}
