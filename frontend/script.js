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
      const mensagemVazia = document.createElement("p");
      mensagemVazia.textContent = "Nenhum pet cadastrado.";
      listaPets.appendChild(mensagemVazia);

      const opcaoVazia = document.createElement("option");
      opcaoVazia.value = "";
      opcaoVazia.textContent = "Nenhum pet disponivel";
      petInteresse.appendChild(opcaoVazia);
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
    listaPets.innerHTML = "";

    const mensagemErro = document.createElement("p");
    mensagemErro.textContent = "Nao foi possivel carregar os pets.";
    listaPets.appendChild(mensagemErro);
  }
}

function criarCardPet(pet) {
  const card = document.createElement("article");
  card.className = "pet-card";

  if (pet.foto) {
    const imagem = document.createElement("img");
    imagem.src = pet.foto;
    imagem.alt = `Foto do pet ${pet.nome}`;
    card.appendChild(imagem);
  }

  const nome = document.createElement("h3");
  nome.textContent = pet.nome;
  card.appendChild(nome);

  const idade = document.createElement("p");
  const idadeLabel = document.createElement("strong");
  idadeLabel.textContent = "Idade:";
  idade.appendChild(idadeLabel);
  idade.append(` ${pet.idade}`);
  card.appendChild(idade);

  const descricao = document.createElement("p");
  descricao.textContent = pet.descricao;
  card.appendChild(descricao);

  const status = document.createElement("span");
  status.textContent = pet.status;
  card.appendChild(status);

  const acoes = document.createElement("div");
  acoes.className = "acoes-card";

  const botaoEditar = document.createElement("button");
  botaoEditar.type = "button";
  botaoEditar.textContent = "Editar";
  botaoEditar.addEventListener("click", () => {
    preencherFormularioPet(pet);
  });

  const botaoExcluir = document.createElement("button");
  botaoExcluir.type = "button";
  botaoExcluir.className = "botao-perigo";
  botaoExcluir.textContent = "Excluir";
  botaoExcluir.addEventListener("click", () => {
    excluirPet(pet.id);
  });

  acoes.appendChild(botaoEditar);
  acoes.appendChild(botaoExcluir);
  card.appendChild(acoes);

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
