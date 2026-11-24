import { useEffect, useState } from 'react';
import { JORNAL_EMAIL } from '../dados.js';

// URL do Google Apps Script que envia a sugestão por e-mail (veja docs/google-apps-script-pauta.gs).
// Sem ela, o botão abre o app de e-mail da pessoa com a mensagem já escrita (mailto).
const ENDPOINT = import.meta.env.VITE_PAUTA_ENDPOINT || '';
const MAX = 1000;

export default function SugerirPauta({ onFechar }) {
  const [f, setF] = useState({ nome: '', email: '', pauta: '', site: '' }); // "site" é a isca anti-robô (fica escondida)
  const [erro, setErro] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [ok, setOk] = useState(false);
  const [viaEmail, setViaEmail] = useState(false);

  useEffect(() => {
    const esc = (e) => e.key === 'Escape' && onFechar();
    const antes = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', esc);
    return () => { window.removeEventListener('keydown', esc); document.body.style.overflow = antes; };
  }, [onFechar]);

  const mudar = (campo) => (e) => setF({ ...f, [campo]: e.target.value });

  async function enviar(e) {
    e.preventDefault();
    if (enviando) return;
    const nome = f.nome.trim();
    const email = f.email.trim();
    const pauta = f.pauta.trim();
    if (nome.length < 2) return setErro('Diga o seu nome.');
    if (email && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return setErro('Esse e-mail parece inválido. Pode deixar em branco se preferir.');
    if (pauta.length < 10) return setErro('Conte a sua ideia com um pouco mais de detalhe (mínimo de 10 letras).');
    setErro('');
    if (f.site) { setOk(true); return; } // robô preencheu a isca: finge que deu certo e não envia nada

    if (!ENDPOINT) {
      const corpo = `Nome: ${nome}${email ? `\nE-mail: ${email}` : ''}\n\n${pauta}`;
      window.location.href = `mailto:${JORNAL_EMAIL}?subject=${encodeURIComponent('Sugestão de pauta — Conecta TI')}&body=${encodeURIComponent(corpo)}`;
      setViaEmail(true); setOk(true);
      return;
    }
    setEnviando(true);
    try {
      // text/plain evita o preflight do CORS; o Apps Script lê o JSON em e.postData.contents
      await fetch(ENDPOINT, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({ nome, email, pauta, enviadoEm: new Date().toISOString() }),
      });
      setOk(true);
    } catch {
      setErro('Não foi possível enviar agora. Verifique sua conexão e tente de novo.');
    }
    setEnviando(false);
  }

  return (
    <div className="modal" onClick={onFechar}>
      <div className="pauta" role="dialog" aria-modal="true" aria-labelledby="pauta-t" onClick={(e) => e.stopPropagation()}>
        {ok ? (
          <div className="ok">
            <div className="okmark" aria-hidden="true">✓</div>
            <h2 id="pauta-t">Pauta enviada!</h2>
            <p className="sub">{viaEmail ? 'Abrimos o seu app de e-mail com a mensagem pronta. É só enviar por lá.' : 'Obrigado pela ideia. O ClubeDS vai ler com carinho.'}</p>
            <button type="button" className="btn" autoFocus onClick={onFechar}>Fechar</button>
          </div>
        ) : (
          <form onSubmit={enviar} noValidate>
            <div className="jn-tag">{'// CONECTA TI'}</div>
            <h2 id="pauta-t">Sugerir uma pauta</h2>
            <p className="sub">Tem uma ideia de matéria, novidade ou evento? Manda para a gente.</p>
            <label>Seu nome
              <input type="text" value={f.nome} onChange={mudar('nome')} maxLength={80} autoComplete="name" autoFocus required />
            </label>
            <label><span>Seu e-mail <small>(opcional, para a gente responder)</small></span>
              <input type="email" value={f.email} onChange={mudar('email')} maxLength={120} autoComplete="email" />
            </label>
            <label>Sua pauta
              <textarea value={f.pauta} onChange={mudar('pauta')} maxLength={MAX} rows={5} required placeholder="Sobre o que a gente deveria escrever?" />
              <span className="cnt">{f.pauta.length}/{MAX}</span>
            </label>
            <label className="hp" aria-hidden="true">Não preencha este campo
              <input type="text" tabIndex={-1} autoComplete="off" value={f.site} onChange={mudar('site')} />
            </label>
            {erro && <p className="erro" role="alert">{erro}</p>}
            <div className="pauta-acts">
              <button type="submit" className="btn go" disabled={enviando}>{enviando ? 'Enviando…' : 'Enviar pauta'}</button>
              <button type="button" className="btn ghost" onClick={onFechar}>Cancelar</button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
