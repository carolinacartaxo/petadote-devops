const botao = document.getElementById("checkBackend");
const resultado = document.getElementById("resultado");

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
