import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./Wishlist.css";

function Wishlist() {
  const [jogos, setJogos] = useState([]);
  const [flipped, setFlipped] = useState({});
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState(null);

  const [filtro, setFiltro] = useState("todos"); // todos, comprados, nao-comprados
  const [ordenacao, setOrdenacao] = useState(null); // prioridade-asc, prioridade-desc, plataforma-asc, plataforma-desc
  const [menuAberto, setMenuAberto] = useState(false);
  const menuRef = useRef(null);

  const navigate = useNavigate();

  useEffect(() => {
    fetch(
      "https://raw.githubusercontent.com/viniciuszile/My_Games_2025/refs/heads/main/Data/wish.json"
    )
      .then((res) => {
        if (!res.ok) throw new Error("Erro ao buscar os dados");
        return res.json();
      })
      .then((data) => {
        setJogos(data);
        setLoading(false);
      })
      .catch(() => {
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

  function isComprado(comprado) {
    if (!comprado) return false;
    return comprado.toLowerCase().trim() === "sim";
  }

  function removerAcentos(str) {
    return str
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .trim();
  }

  function prioridadeParaNumero(p) {
    if (!p) return 4;
    const pNormalizada = removerAcentos(p);
    const map = { alta: 1, media: 2, baixa: 3 };
    return map[pNormalizada] || 4;
  }

  function ordenarPorPrioridade(a, b) {
    return prioridadeParaNumero(a.prioridade) - prioridadeParaNumero(b.prioridade);
  }

  function ordenarPorPlataforma(a, b) {
    const pA = (a.plataforma || "").toLowerCase();
    const pB = (b.plataforma || "").toLowerCase();
    if (pA < pB) return -1;
    if (pA > pB) return 1;
    return 0;
  }

  // Filtragem
  let jogosFiltrados = jogos.filter((jogo) => {
    if (filtro === "comprados" && !isComprado(jogo.comprado)) return false;
    if (filtro === "nao-comprados" && isComprado(jogo.comprado)) return false;
    return true;
  });

  // Ordenação
  if (ordenacao === "plataforma-asc") {
    jogosFiltrados = [...jogosFiltrados].sort(ordenarPorPlataforma);
  } else if (ordenacao === "plataforma-desc") {
    jogosFiltrados = [...jogosFiltrados].sort((a, b) => ordenarPorPlataforma(b, a));
  } else if (ordenacao === "prioridade-asc") {
    jogosFiltrados = [...jogosFiltrados].sort(ordenarPorPrioridade);
  } else if (ordenacao === "prioridade-desc") {
    jogosFiltrados = [...jogosFiltrados].sort((a, b) => ordenarPorPrioridade(b, a));
  }

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

  return (
    <>
      <button className="filtro-toggle" onClick={() => setMenuAberto(!menuAberto)}>
        🎮 Filtros
      </button>

      {menuAberto && (
        <div className="menu-flutuante" ref={menuRef}>
          <h4>Filtrar por:</h4>
          <button className={filtro === "todos" ? "ativo" : ""} onClick={() => setFiltro("todos")}>
            Todos
          </button>
          <button className={filtro === "comprados" ? "ativo" : ""} onClick={() => setFiltro("comprados")}>
            Comprados
          </button>
          <button className={filtro === "nao-comprados" ? "ativo" : ""} onClick={() => setFiltro("nao-comprados")}>
            Não Comprados
          </button>

          <h4>Ordenar por:</h4>
          <button
            className={ordenacao === "plataforma-asc" ? "ativo" : ""}
            onClick={() =>
              setOrdenacao(ordenacao === "plataforma-asc" ? "plataforma-desc" : "plataforma-asc")
            }
          >
            Plataforma {ordenacao === "plataforma-asc" ? "(A → Z)" : ordenacao === "plataforma-desc" ? "(Z → A)" : ""}
          </button>
          <button
            className={ordenacao === "prioridade-asc" ? "ativo" : ""}
            onClick={() =>
              setOrdenacao(ordenacao === "prioridade-asc" ? "prioridade-desc" : "prioridade-asc")
            }
          >
            Prioridade {ordenacao === "prioridade-asc" ? "(Alta → Baixa)" : ordenacao === "prioridade-desc" ? "(Baixa → Alta)" : ""}
          </button>
          <button onClick={() => setOrdenacao(null)}>Limpar ordenação</button>

          {/* Botão para voltar para Home */}
          <button onClick={() => navigate("/")}>🏠 Voltar para Home</button>
        </div>
      )}

      <div className="container_card">
        {jogosFiltrados.map((jogo, index) => (
          <div
            key={index}
            className={`card ${flipped[index] ? "flipped" : ""} ${
              isComprado(jogo.comprado) ? "comprado" : "nao-comprado"
            }`}
            onClick={() => toggleFlip(index)}
          >
            <div className="card-front">
              <img
                src={jogo.link}
                alt={`Capa do jogo`}
                onError={(e) => {
                  e.currentTarget.src = "https://via.placeholder.com/250x350?text=Sem+Imagem";
                }}
              />
              <span className="plataforma">{jogo.plataforma}</span>
            </div>
            <div className="card-back">
              <p>
                <strong>Comprado:</strong> {jogo.comprado}
              </p>
              <p>
                <strong>Prioridade:</strong> {jogo.prioridade}
              </p>
              <p>
                <strong>Plataforma:</strong> {jogo.plataforma}
              </p>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

export default Wishlist;
