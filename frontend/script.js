const botao = document.getElementById("checkBackend");
const resultado = document.getElementById("resultado");
const listaPets = document.getElementById("listaPets");

botao.addEventListener("click", async () => {
  resultado.textContent = "Consultando...";

  try {
    const resposta = await fetch("http://localhost:3001/status");
    const dados = await resposta.json();

    resultado.textContent = `${dados.mensagem} Banco definido: ${dados.banco}.`;
  } catch (error) {
    resultado.textContent = "Nao foi possivel conectar com o back-end.";
  }
});

async function carregarPets() {
  try {
    const resposta = await fetch("http://localhost:3001/pets");
    const pets = await resposta.json();

    listaPets.innerHTML = "";

    pets.forEach((pet) => {
      const card = document.createElement("article");
      card.className = "pet-card";
      card.innerHTML = `
        <h3>${pet.nome}</h3>
        <p><strong>Idade:</strong> ${pet.idade}</p>
        <p>${pet.descricao}</p>
        <span>${pet.status}</span>
      `;

      listaPets.appendChild(card);
    });
  } catch (error) {
    listaPets.innerHTML = "<p>Nao foi possivel carregar os pets.</p>";
  }
}

carregarPets();
