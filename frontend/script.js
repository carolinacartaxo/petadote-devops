const API_URL = "http://localhost:3001";

const botao = document.getElementById("checkBackend");
const resultado = document.getElementById("resultado");
const listaPets = document.getElementById("listaPets");
const formPet = document.getElementById("formPet");
const formInteresse = document.getElementById("formInteresse");
const cancelarEdicao = document.getElementById("cancelarEdicao");
const petInteresse = document.getElementById("petInteresse");

const camposPet = {
  id: document.getElementById("petId"),
  nome: document.getElementById("nome"),
  idade: document.getElementById("idade"),
  foto: document.getElementById("foto"),
  status: document.getElementById("status"),
  descricao: document.getElementById("descricao")
};

botao.addEventListener("click", async () => {
  resultado.textContent = "Consultando...";

  try {
    const resposta = await fetch(`${API_URL}/status`);
    const dados = await resposta.json();

    resultado.textContent = `${dados.mensagem} Banco definido: ${dados.banco}.`;
  } catch (error) {
    resultado.textContent = "Nao foi possivel conectar com o back-end.";
  }
});

formPet.addEventListener("submit", async (event) => {
  event.preventDefault();

  const pet = {
    nome: camposPet.nome.value,
    idade: camposPet.idade.value,
    foto: camposPet.foto.value,
    status: camposPet.status.value,
    descricao: camposPet.descricao.value
  };

  const id = camposPet.id.value;
  const url = id ? `${API_URL}/pets/${id}` : `${API_URL}/pets`;
  const metodo = id ? "PUT" : "POST";

  try {
    const resposta = await fetch(url, {
      method: metodo,
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(pet)
    });

    if (!resposta.ok) {
      throw new Error("Erro ao salvar pet.");
    }

    limparFormularioPet();
    await carregarPets();
    resultado.textContent = id ? "Pet atualizado com sucesso." : "Pet cadastrado com sucesso.";
  } catch (error) {
    resultado.textContent = "Nao foi possivel salvar o pet.";
  }
});

formInteresse.addEventListener("submit", async (event) => {
  event.preventDefault();

  const interesse = {
    petId: petInteresse.value,
    nome: document.getElementById("nomeInteressado").value,
    email: document.getElementById("emailInteressado").value,
    telefone: document.getElementById("telefoneInteressado").value,
    mensagem: document.getElementById("mensagemInteressado").value
  };

  try {
    const resposta = await fetch(`${API_URL}/interesses`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(interesse)
    });

    if (!resposta.ok) {
      throw new Error("Erro ao enviar interesse.");
    }

    formInteresse.reset();
    resultado.textContent = "Interesse enviado com sucesso.";
  } catch (error) {
    resultado.textContent = "Nao foi possivel enviar o interesse.";
  }
});

cancelarEdicao.addEventListener("click", () => {
  limparFormularioPet();
});

async function carregarPets() {
  try {
    const resposta = await fetch(`${API_URL}/pets`);
    const pets = await resposta.json();

    listaPets.innerHTML = "";
    petInteresse.innerHTML = "";

    if (pets.length === 0) {
      listaPets.innerHTML = "<p>Nenhum pet cadastrado.</p>";
      petInteresse.innerHTML = "<option value=''>Nenhum pet disponivel</option>";
      return;
    }

    pets.forEach((pet) => {
      listaPets.appendChild(criarCardPet(pet));

      const opcao = document.createElement("option");
      opcao.value = pet.id;
      opcao.textContent = pet.nome;
      petInteresse.appendChild(opcao);
    });
  } catch (error) {
    listaPets.innerHTML = "<p>Nao foi possivel carregar os pets.</p>";
  }
}

function criarCardPet(pet) {
  const card = document.createElement("article");
  card.className = "pet-card";

  const imagem = pet.foto
    ? `<img src="${pet.foto}" alt="Foto do pet ${pet.nome}" />`
    : "";

  card.innerHTML = `
    ${imagem}
    <h3>${pet.nome}</h3>
    <p><strong>Idade:</strong> ${pet.idade}</p>
    <p>${pet.descricao}</p>
    <span>${pet.status}</span>
    <div class="acoes-card">
      <button type="button" data-acao="editar">Editar</button>
      <button type="button" data-acao="excluir" class="botao-perigo">Excluir</button>
    </div>
  `;

  card.querySelector("[data-acao='editar']").addEventListener("click", () => {
    preencherFormularioPet(pet);
  });

  card.querySelector("[data-acao='excluir']").addEventListener("click", () => {
    excluirPet(pet.id);
  });

  return card;
}

function preencherFormularioPet(pet) {
  camposPet.id.value = pet.id;
  camposPet.nome.value = pet.nome;
  camposPet.idade.value = pet.idade;
  camposPet.foto.value = pet.foto || "";
  camposPet.status.value = pet.status;
  camposPet.descricao.value = pet.descricao;
  resultado.textContent = `Editando o pet ${pet.nome}.`;
}

function limparFormularioPet() {
  formPet.reset();
  camposPet.id.value = "";
}

async function excluirPet(id) {
  const confirmou = confirm("Deseja excluir este pet?");

  if (!confirmou) {
    return;
  }

  try {
    const resposta = await fetch(`${API_URL}/pets/${id}`, {
      method: "DELETE"
    });

    if (!resposta.ok) {
      throw new Error("Erro ao excluir pet.");
    }

    await carregarPets();
    resultado.textContent = "Pet excluido com sucesso.";
  } catch (error) {
    resultado.textContent = "Nao foi possivel excluir o pet.";
  }
}

carregarPets();
