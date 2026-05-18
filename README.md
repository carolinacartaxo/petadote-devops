# PetAdote

Projeto da disciplina de DevOps.

O PetAdote é uma proposta de sistema web para um abrigo de resgate divulgar pets disponiveis para adocao. Nesta etapa inicial, o foco é deixar o ambiente organizado, conteinerizado e pronto para a continuidade do desenvolvimento.

## Objetivo da aplicacao

O sistema tem como objetivo facilitar a divulgacao de pets disponiveis para adoção. Nas proximas etapas, um administrador podera cadastrar, editar e remover pets, e usuarios interessados poderao visualizar os pets e enviar um formulario de interesse.

## Tecnologias utilizadas

- HTML, CSS e JavaScript
- Node.js
- Express
- MongoDB
- Prisma
- Docker
- Docker Compose
- SonarQube
- GitHub Actions

## Como executar o projeto

Para subir os servicos, execute:

```bash
docker compose up --build
```

Depois acesse:

- Front-end: http://localhost:8080
- Back-end: http://localhost:3001
- Status da API: http://localhost:3001/status
- Lista de pets: http://localhost:3001/pets
- Banco de dados: MongoDB na porta 27017

Para parar os containers:

```bash
docker compose down
```

## SonarQube

O projeto possui um servico do SonarQube no Docker Compose e o arquivo `sonar-project.properties` na raiz do repositorio.

Para iniciar o SonarQube localmente:

```bash
docker compose up -d sonarqube
```

Depois acesse:

- SonarQube: http://localhost:9000

No primeiro acesso, use o login padrao:

- Usuario: `admin`
- Senha: `admin`

Depois crie um token no SonarQube e execute a analise local com o SonarScanner:

```bash
docker run --rm \
  --network projeto-devops_default \
  -e SONAR_HOST_URL=http://sonarqube:9000 \
  -e SONAR_TOKEN=seu_token_aqui \
  -v "$PWD:/usr/src" \
  sonarsource/sonar-scanner-cli
```

## GitHub Actions

O workflow de CI esta em `.github/workflows/ci.yml`. Ele instala as dependencias do backend, gera o Prisma Client, valida o Docker Compose e executa a analise do SonarQube.

Para a etapa do SonarQube funcionar no GitHub, cadastre estes secrets no repositorio:

- `SONAR_HOST_URL`: URL do servidor SonarQube
- `SONAR_TOKEN`: token gerado no SonarQube

O workflow roda em pushes e pull requests para as branches `main` e `develop`.

## Comandos principais

```bash
docker compose up --build
docker compose down
docker compose up -d sonarqube
git status
git branch
```

## Como acessar o banco de dados

Com os containers rodando, acesse o MongoDB pelo terminal:

```bash
docker exec -it petadote-database mongosh
```

Dentro do MongoDB, selecione o banco do projeto:

```javascript
use petadote
```

Para ver as collections:

```javascript
show collections
```

Para listar os pets salvos:

```javascript
db.Pet.find()
```

Para listar os interesses de adocao:

```javascript
db.Interesse.find()
```

Para sair:

```javascript
exit
```

## Estrutura do projeto

```text
projeto-devops/
├── backend/
│   ├── prisma/
│   │   └── schema.prisma
│   ├── Dockerfile
│   ├── package.json
│   └── server.js
├── frontend/
│   ├── Dockerfile
│   ├── index.html
│   ├── script.js
│   └── style.css
├── docker-compose.yml
├── .gitignore
└── README.md
```

## GitFlow

Branches planejadas para a organizacao do projeto:

- `main`: branch principal
- `develop`: branch de desenvolvimento
- `feature/frontend`: estrutura inicial do front-end
- `feature/backend`: estrutura inicial do back-end

## CRUD principal inicial

O CRUD principal do projeto sera o cadastro de pets:

- Create: cadastrar um novo pet
- Read: listar e visualizar pets disponiveis
- Update: editar informacoes de um pet
- Delete: remover um pet

## Rotas da API

- `GET /status`: verifica se o back-end esta funcionando
- `GET /pets`: lista os pets cadastrados
- `GET /pets/:id`: busca um pet especifico
- `POST /pets`: cadastra um novo pet
- `PUT /pets/:id`: atualiza um pet
- `DELETE /pets/:id`: remove um pet
- `POST /interesses`: cadastra o interesse de um usuario em adotar um pet

## Como testar as funcionalidades

1. Suba o projeto:

```bash
docker compose up --build
```

2. Abra o front-end:

```text
http://localhost:8080
```

3. Cadastre um pet usando o formulario "Cadastro de pet".

4. Verifique se o pet aparece na lista "Pets disponiveis".

5. Use os botoes "Editar" e "Excluir" para testar update e delete.

6. Use o formulario "Interesse em adocao" para enviar os dados de uma pessoa interessada.

## Integrantes da equipe

- Ana Carolina Cartaxo
- Ana Paula Oliveira
- Anna Luiza Britto
