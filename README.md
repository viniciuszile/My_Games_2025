# 🎮 My games 2025

Projeto pessoal em React para organizar os jogos que iniciei neste ano, diferenciando os que já zerei dos que ainda estão em andamento. Além disso, permite registrar minha experiência e feedback sobre cada jogo, funcionando como um diário gamer visual.

---

## 🌐 Link do projeto

[Acesse aqui a versão online](https://zile-games-2025.netlify.app/)

---

## 💡 Diferencial Técnico

- Utiliza um JSON hospedado no GitHub como fonte dos dados dos jogos.
- As imagens também estão hospedadas no GitHub.
- O React consome esse JSON via `fetch()`, simulando uma API estática.
- Arquitetura simples, sem backend, usando o GitHub como CDN e "API".

---

## 🚀 Funcionalidades

- Visualização dos jogos em cards com frente (imagem e plataforma) e verso (detalhes).
- Filtros por jogos concluídos, não concluídos ou todos.
- Ordenação por nome e tempo de jogo, em ordem crescente ou decrescente.
- Cards clicáveis para virar e mostrar mais informações.

---

## 📦 Exemplo do JSON usado

```json
{
  "nome": "Celeste",
  "imagem": "https://raw.githubusercontent.com/viniciuszile/Fotos-Jogos/main/celeste.jpg",
  "plataforma": "Steam (PC)",
  "inicio": "03/01/2025",
  "termino": "08/01/2025",
  "situacao": "Concluído",
  "Horas De Jogo": "17",
  "dificuldade": "Alta",
  "nota": "10"
}
