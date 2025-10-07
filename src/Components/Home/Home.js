import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./home.css";

function Home() {
  const navigate = useNavigate();
  const [jogos, setJogos] = useState([]);
  const [flipped, setFlipped] = useState({});
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState(null);
  const [filtro, setFiltro] = useState("todos");
  const [ordenacao, setOrdenacao] = useState(null);
  const [menuAberto, setMenuAberto] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    fetch(
      "https://raw.githubusercontent.com/viniciuszile/My_Games_2025/refs/heads/main/Data/jogos.json"
    )
      .then((res) => {
        if (!res.ok) throw new Error("Erro ao buscar os dados");
        return res.json();
      })
      .then((data) => {
        setJogos(data);
        setLoading(false);
      })
      .catch((err) => { // Captura o erro para log ou mensagem mais específica
        console.error("Erro ao carregar os jogos:", err);
        setErro("Falha ao carregar os jogos.");
        setLoading(false);
      });
  }, []);

  function toggleFlip(index) {
    setFlipped((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  }

  function removerAcentos(str) {
    // Verifica se é uma string antes de normalizar
    if (typeof str !== 'string') return '';
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  }

  function isConcluido(situacao) {
    if (!situacao) return false;
    const normalizado = removerAcentos(situacao).toLowerCase().trim();
    // Use o valor exato do seu arquivo de dados. Pelo print, é "Concluído".
    // A função já remove acentos, então "concluido" é a chave certa.
    return normalizado === "concluido"; 
  }

  function extrairHoras(jogo) {
    const valor = jogo["Horas De Jogo"]?.trim() || "";
    // Garantir que a extração é robusta
    const match = valor.match(/\d+/); 
    const num = match ? parseInt(match[0], 10) : 0;
    
    // Seu código original:
    // const num = parseInt(valor, 10);
    // if (!isNaN(num)) {
    //   return num;
    // }
    // return 0;
    
    return num; // Se o valor for "1 hora", retorna 1. Se for "20", retorna 20.
  }

  function ordenarPorNome(a, b) {
    const nomeA = (a.nome || "").toLowerCase();
    const nomeB = (b.nome || "").toLowerCase();
    if (nomeA < nomeB) return -1;
    if (nomeA > nomeB) return 1;
    return 0;
  }

  function ordenarPorTempo(a, b) {
    // Usa a função extrairHoras
    return extrairHoras(a) - extrairHoras(b);
  }

  function toggleOrdenacaoNome() {
    if (ordenacao === "nome-asc") {
      setOrdenacao("nome-desc");
    } else {
      setOrdenacao("nome-asc");
    }
  }

  function toggleOrdenacaoTempo() {
    if (ordenacao === "tempo-asc") {
      setOrdenacao("tempo-desc");
    } else {
      setOrdenacao("tempo-asc");
    }
  }

  let jogosFiltrados = jogos.filter((jogo) => {
    if (filtro === "concluidos") return isConcluido(jogo.situacao);
    if (filtro === "nao-concluidos") return !isConcluido(jogo.situacao);
    return true;
  });

  if (ordenacao) {
    // Cria uma cópia para ordenar, o que é uma boa prática
    jogosFiltrados = [...jogosFiltrados]; 

    if (ordenacao === "nome-asc") {
      jogosFiltrados.sort(ordenarPorNome);
    } else if (ordenacao === "nome-desc") {
      jogosFiltrados.sort((a, b) => ordenarPorNome(b, a));
    } else if (ordenacao === "tempo-asc") {
      jogosFiltrados.sort(ordenarPorTempo);
    } else if (ordenacao === "tempo-desc") {
      jogosFiltrados.sort((a, b) => ordenarPorTempo(b, a));
    }
  }
  
  // Hook para fechar o menu ao clicar fora
  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuAberto(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (loading) return <p style={{ color: "#fff" }}>Carregando...</p>;
  if (erro) return <p style={{ color: "red" }}>{erro}</p>;

  const totalConcluidos = jogos.filter((j) => isConcluido(j.situacao)).length;
  // Use a mesma verificação do extrairHoras para um total de iniciados mais robusto
  const totalIniciados = jogos.filter((j) => extrairHoras(j) > 0 || j.inicio && j.inicio !== "-").length;

  return (
    <>
      <header className="status-header">
        <div>🎯 <strong>Zerados:</strong> {totalConcluidos}</div>
        <div>⏳ <strong>Iniciados:</strong> {totalIniciados}</div>
      </header>

      <button
        className="filtro-toggle"
        onClick={() => setMenuAberto(!menuAberto)}
        aria-expanded={menuAberto} // Melhoria de Acessibilidade
        aria-controls="menu-filtros" // Melhoria de Acessibilidade
      >
        🎮 Filtros
      </button>

      {menuAberto && (
        <div className="menu-flutuante" ref={menuRef} id="menu-filtros">
          <h4>Filtrar por:</h4>
          <button
            className={filtro === "todos" ? "ativo" : ""}
            onClick={() => setFiltro("todos")}
          >
            Todos
          </button>
          <button
            className={filtro === "concluidos" ? "ativo" : ""}
            onClick={() => setFiltro("concluidos")}
          >
            Concluídos
          </button>
          <button
            className={filtro === "nao-concluidos" ? "ativo" : ""}
            onClick={() => setFiltro("nao-concluidos")}
          >
            Não Concluídos
          </button>

          <h4>Ordenar por:</h4>
          <button
            className={ordenacao === "nome-asc" || ordenacao === "nome-desc" ? "ativo" : ""}
            onClick={toggleOrdenacaoNome}
          >
            Ordem alfabética{" "}
            {ordenacao === "nome-asc"
              ? "(A → Z)"
              : ordenacao === "nome-desc"
              ? "(Z → A)"
              : ""}
          </button>
          <button
            className={ordenacao === "tempo-asc" || ordenacao === "tempo-desc" ? "ativo" : ""}
            onClick={toggleOrdenacaoTempo}
          >
            Tempo de jogo{" "}
            {ordenacao === "tempo-asc"
              ? "(Menor → Maior)"
              : ordenacao === "tempo-desc"
              ? "(Maior → Menor)"
              : ""}
          </button>
          <button onClick={() => setOrdenacao(null)}>Limpar ordenação</button>

          <button onClick={() => navigate("/wishlist")}>
            🎁 Ir para Wishlist
          </button>
        </div>
      )}

      <div className="container_card">
        {jogosFiltrados.map((jogo, index) => (
          <div
            key={index}
            // A CORREÇÃO ESTÁ AQUI: USAR CRASE (`) PARA TEMPLATE LITERALS
            className={`card ${flipped[index] ? "flipped" : ""} ${
              isConcluido(jogo.situacao) ? "concluido" : "nao-concluido"
            }`}
            onClick={() => toggleFlip(index)}
            // Melhoria de Acessibilidade: permite focar e usar Enter/Espaço para virar
            tabIndex="0" 
            role="button"
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                toggleFlip(index);
              }
            }}
          >
            <div className="card-front">
              <img
                src={jogo.imagem}
                alt={`Capa do jogo ${jogo.nome || "sem nome"}`}
              />
              {/* <span className="plataforma">{jogo.plataforma}</span> */}
            </div>
              <div className="card-back">
                {/* Opcional: usar h5 ou outro elemento para o nome para semântica */}
                <p><strong>Plataforma:</strong> {jogo.plataforma || "-"}</p>
                <p><strong>Início:</strong> {jogo.inicio || "-"}</p>
                <p><strong>Término:</strong> {jogo.termino || "-"}</p>
                <p><strong>Situação:</strong> {jogo.situacao || "-"}</p>
                <p><strong>Horas De Jogo:</strong> {extrairHoras(jogo) || "-"} {extrairHoras(jogo) > 0 ? "h" : ""}</p>
                <p><strong>Dificuldade:</strong> {jogo.dificuldade || "-"}</p>
                <p><strong>Replay:</strong> {jogo.replay || "-"}</p>
                <p><strong>Nota:</strong> {jogo.nota || "-"}</p>
              </div>
          </div>
        ))}
      </div>
    </>
  );
}

export default Home;