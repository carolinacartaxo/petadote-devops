const test = require("node:test");
const assert = require("node:assert/strict");
const app = require("./server");

function iniciarServidor() {
  return new Promise((resolve) => {
    const server = app.listen(0, () => resolve(server));
  });
}

async function request(server, path, options = {}) {
  const { port } = server.address();
  const resposta = await fetch(`http://127.0.0.1:${port}${path}`, options);
  const body = await resposta.json();

  return {
    status: resposta.status,
    body
  };
}

test("GET /status retorna status da API", async () => {
  const server = await iniciarServidor();

  try {
    const resposta = await request(server, "/status");

    assert.equal(resposta.status, 200);
    assert.equal(resposta.body.banco, "MongoDB");
  } finally {
    server.close();
  }
});

test("GET /pets/:id rejeita id invalido", async () => {
  const server = await iniciarServidor();

  try {
    const resposta = await request(server, "/pets/id-invalido");

    assert.equal(resposta.status, 400);
    assert.equal(resposta.body.erro, "ID invalido.");
  } finally {
    server.close();
  }
});

test("POST /pets valida campos obrigatorios", async () => {
  const server = await iniciarServidor();

  try {
    const resposta = await request(server, "/pets", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ nome: "Lua" })
    });

    assert.equal(resposta.status, 400);
    assert.equal(resposta.body.erro, "Preencha nome, idade, descricao e status.");
  } finally {
    server.close();
  }
});
