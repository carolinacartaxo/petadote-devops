const express = require("express");
const cors = require("cors");

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Backend do PetAdote funcionando");
});

app.get("/status", (req, res) => {
  res.json({
    mensagem: "Back-end do PetAdote funcionando.",
    banco: "MongoDB"
  });
});

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
