import React, { useState, useEffect } from "react";
import "./home.css";

function Home() {
  const [jogos, setJogos] = useState([]);
  const [flipped, setFlipped] = useState({});
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState(null);

  useEffect(() => {
    fetch("https://raw.githubusercontent.com/viniciuszile/Jogos-Main/refs/heads/main/Data/jogos.json")
      .then((res) => {
        if (!res.ok) {
          throw new Error("Erro ao buscar os dados");
        }
        return res.json();
      })
      .then((data) => {
        setJogos(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Erro ao carregar JSON:", err);
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

  // Função para remover acentos
  function removerAcentos(str) {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  }

  // Função para saber se está concluído de forma flexível
function isConcluido(situacao) {
  if (!situacao) return false;
  const normalizado = removerAcentos(situacao).toLowerCase().trim();
  return normalizado === "concluido";
}


  if (loading) return <p style={{ color: "#fff" }}>Carregando...</p>;
  if (erro) return <p style={{ color: "red" }}>{erro}</p>;

  return (
    <div className="container_card">
      {jogos.map((jogo, index) => (
        <div
          key={index}
          className={`card ${flipped[index] ? "flipped" : ""} ${
            isConcluido(jogo.situacao) ? "concluido" : "nao-concluido"
          }`}
          onClick={() => toggleFlip(index)}
        >
          <div className="card-front">
            <img src={jogo.imagem} alt={`Capa do jogo ${jogo.nome}`} />
            <span className="plataforma">{jogo.plataforma}</span>
          </div>
          <div className="card-back">
            <p><strong>Início:</strong> {jogo.inicio}</p>
            <p><strong>Término:</strong> {jogo.termino}</p>
            <p><strong>Situação:</strong> {jogo.situacao}</p>
            <p><strong>Tempo de jogo:</strong> {jogo.tempo}</p>
            <p><strong>Dificuldade:</strong> {jogo.dificuldade}</p>
            <p><strong>Nota:</strong> {jogo.nota}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

export default Home;
