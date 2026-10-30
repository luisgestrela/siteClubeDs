import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Intro from '../desafios/Intro.jsx';
import Buddy from '../desafios/Buddy.jsx';
import Padrao from '../desafios/Padrao.jsx';
import Numero from '../desafios/Numero.jsx';
import Fila from '../desafios/Fila.jsx';
import { Estrelas, lerProgresso } from '../desafios/comum.jsx';
import { alternarMudo, aoMudarMudo, estaMudo, pararTudo, aoMudarBloqueio, somBloqueado } from '../desafios/audio.js';
import '../desafios/desafios.css';

const JOGOS = [
  { id: 'padrao', nome: 'Decifre o Padrão', conceito: 'Reconhecimento de padrões', fases: 8, Comp: Padrao,
    desc: 'Descubra a regra escondida em sequências de números, formas e cores e complete o próximo item.' },
  { id: 'numero', nome: 'Adivinhe o Número', conceito: 'Busca binária', fases: 3, Comp: Numero,
    desc: 'Ache o número secreto com poucos palpites. Existe uma estratégia que sempre vence. Será que você a descobre?' },
  { id: 'fila', nome: 'Ordene a Fila', conceito: 'Algoritmos de ordenação', fases: 4, Comp: Fila,
    desc: 'Barras embaralhadas, e você só pode trocar as vizinhas. Ordene com o menor número de trocas.' },
];

export default function Desafios() {
  const [tela, setTela] = useState('intro'); // intro | niveis | jogos | <id do jogo>
  const [prog, setProg] = useState({});
  const [mudo, setMudo] = useState(estaMudo());
  const [bloq, setBloq] = useState(somBloqueado());

  // ao sair da página (voltar ao site), a música para
  useEffect(() => { const off = aoMudarMudo(setMudo); const off2 = aoMudarBloqueio(setBloq); return () => { off(); off2(); pararTudo(); }; }, []);
  useEffect(() => { document.title = 'Desafios de lógica — Clube D/S'; }, []);
  useEffect(() => { setProg(lerProgresso()); window.scrollTo(0, 0); }, [tela]);

  const jogo = JOGOS.find((j) => j.id === tela);

  return (
    <div className="dz">
      <header className="dz-top">
        <Link to="/" className="dz-logo" aria-label="Voltar ao site do Clube D/S"><b>{'<D'}</b>/<b>{'S>'}</b> <span>Desafios</span></Link>
        <div className="dz-acoes">
          <button type="button" className={'som' + (bloq && !mudo ? ' chama' : '')} onClick={alternarMudo} aria-pressed={mudo} aria-label={mudo ? 'Ligar o som' : 'Desligar o som'}>{mudo ? '🔇 Som desligado' : bloq ? '🔈 Toque para ativar o som' : '🔊 Som ligado'}</button>
          <Link to="/" className="lnk">Voltar ao site</Link>
        </div>
      </header>

      {tela === 'intro' && <Intro onEscolher={() => setTela('jogos')} />}
      {tela === 'niveis' && <Intro direto onEscolher={() => setTela('jogos')} />}

      {tela === 'jogos' && (
        <main className="jogos wrap">
          <div className="jogos-h">
            <Buddy expr="feliz" mini />
            <div>
              <span className="tag2">NÍVEL FÁCIL</span>
              <h1>Escolha um desafio</h1>
              <p>Cada jogo tem fases que ficam mais difíceis. Faça com calma, peça dicas quando precisar e conquiste as 3 estrelas.</p>
            </div>
          </div>
          <div className="cards">
            {JOGOS.map((j, k) => {
              const est = (prog[j.id] || []).reduce((a, b) => a + (b || 0), 0);
              return (
                <article className={'jcard c' + k} key={j.id}>
                  <span className="jn">{k + 1}</span>
                  <h2>{j.nome}</h2>
                  <span className="chip2">{j.conceito}</span>
                  <p>{j.desc}</p>
                  <div className="jf">
                    <span>{j.fases} fases</span>
                    <span><Estrelas n={est > 0 ? Math.max(1, Math.round((est / (j.fases * 3)) * 3)) : 0} /> <small>{est}/{j.fases * 3}</small></span>
                  </div>
                  <button type="button" className="btn" onClick={() => setTela(j.id)}>{est > 0 ? 'Jogar de novo' : 'Jogar'}</button>
                </article>
              );
            })}
          </div>
          <button type="button" className="btn ghost" onClick={() => setTela('niveis')}>← Trocar de nível</button>
        </main>
      )}

      {jogo && <main className="wrap jogo-pg"><jogo.Comp onSair={() => setTela('jogos')} /></main>}
    </div>
  );
}
