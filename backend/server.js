const express = require("express");
const cors = require("cors");

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

const pets = [
  {
    id: 1,
    nome: "Mel",
    idade: "2 anos",
    descricao: "Cachorra docil, vacinada e disponivel para adocao.",
    status: "Disponivel"
  },
  {
    id: 2,
    nome: "Tom",
    idade: "1 ano",
    descricao: "Gato tranquilo que gosta de carinho e ambientes calmos.",
    status: "Disponivel"
  }
];

app.get("/", (req, res) => {
  res.send("Backend do PetAdote funcionando");
});

app.get("/status", (req, res) => {
  res.json({
    mensagem: "Back-end do PetAdote funcionando.",
    banco: "MongoDB"
  });
});

app.get("/pets", (req, res) => {
  res.json(pets);
});

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
