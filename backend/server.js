const express = require("express");
const cors = require("cors");
const { PrismaClient } = require("@prisma/client");

const app = express();
const port = 3001;
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

function registrarErro(contexto, error) {
  console.error(`[${contexto}]`, error);
}

const petsIniciais = [
  {
    nome: "Mel",
    idade: "2 anos",
    descricao: "Cachorra docil, vacinada e disponivel para adocao.",
    foto: "",
    status: "Disponivel"
  },
  {
    nome: "Tom",
    idade: "1 ano",
    descricao: "Gato tranquilo que gosta de carinho e ambientes calmos.",
    foto: "",
    status: "Disponivel"
  }
];

function validarPet(dados) {
  return dados.nome && dados.idade && dados.descricao && dados.status;
}

function validarObjectId(id) {
  return /^[a-f\d]{24}$/i.test(id);
}

async function garantirPetsIniciais() {
  const total = await prisma.pet.count();

  if (total === 0) {
    await prisma.pet.createMany({
      data: petsIniciais
    });
  }
}

app.get("/", (req, res) => {
  res.send("Backend do PetAdote funcionando");
});

app.get("/status", (req, res) => {
  res.json({
    mensagem: "Back-end do PetAdote funcionando.",
    banco: "MongoDB"
  });
});

app.get("/pets", async (req, res) => {
  try {
    await garantirPetsIniciais();

    const pets = await prisma.pet.findMany({
      orderBy: {
        criadoEm: "desc"
      }
    });

    res.json(pets);
  } catch (error) {
    registrarErro("listar pets", error);
    res.status(500).json({ erro: "Erro ao listar pets." });
  }
});

app.get("/pets/:id", async (req, res) => {
  const { id } = req.params;

  if (!validarObjectId(id)) {
    return res.status(400).json({ erro: "ID invalido." });
  }

  try {
    const pet = await prisma.pet.findUnique({
      where: { id }
    });

    if (!pet) {
      return res.status(404).json({ erro: "Pet nao encontrado." });
    }

    res.json(pet);
  } catch (error) {
    registrarErro("buscar pet", error);
    res.status(500).json({ erro: "Erro ao buscar pet." });
  }
});

app.post("/pets", async (req, res) => {
  const { nome, idade, descricao, foto, status } = req.body;

  if (!validarPet(req.body)) {
    return res.status(400).json({ erro: "Preencha nome, idade, descricao e status." });
  }

  try {
    const pet = await prisma.pet.create({
      data: {
        nome,
        idade,
        descricao,
        foto: foto || "",
        status
      }
    });

    res.status(201).json(pet);
  } catch (error) {
    registrarErro("cadastrar pet", error);
    res.status(500).json({ erro: "Erro ao cadastrar pet." });
  }
});

app.put("/pets/:id", async (req, res) => {
  const { id } = req.params;
  const { nome, idade, descricao, foto, status } = req.body;

  if (!validarObjectId(id)) {
    return res.status(400).json({ erro: "ID invalido." });
  }

  if (!validarPet(req.body)) {
    return res.status(400).json({ erro: "Preencha nome, idade, descricao e status." });
  }

  try {
    const pet = await prisma.pet.update({
      where: { id },
      data: {
        nome,
        idade,
        descricao,
        foto: foto || "",
        status
      }
    });

    res.json(pet);
  } catch (error) {
    registrarErro("atualizar pet", error);
    res.status(404).json({ erro: "Pet nao encontrado." });
  }
});

app.delete("/pets/:id", async (req, res) => {
  const { id } = req.params;

  if (!validarObjectId(id)) {
    return res.status(400).json({ erro: "ID invalido." });
  }

  try {
    await prisma.interesse.deleteMany({
      where: {
        petId: id
      }
    });

    await prisma.pet.delete({
      where: { id }
    });

    res.status(204).send();
  } catch (error) {
    registrarErro("excluir pet", error);
    res.status(404).json({ erro: "Pet nao encontrado." });
  }
});

app.post("/interesses", async (req, res) => {
  const { petId, nome, email, telefone, mensagem } = req.body;

  if (!petId || !nome || !email || !mensagem) {
    return res.status(400).json({ erro: "Preencha pet, nome, email e mensagem." });
  }

  if (!validarObjectId(petId)) {
    return res.status(400).json({ erro: "Pet invalido." });
  }

  try {
    const interesse = await prisma.interesse.create({
      data: {
        petId,
        nome,
        email,
        telefone: telefone || "",
        mensagem
      }
    });

    res.status(201).json(interesse);
  } catch (error) {
    registrarErro("enviar interesse", error);
    res.status(500).json({ erro: "Erro ao enviar interesse." });
  }
});

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
