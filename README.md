# PetAdote

Projeto da primeira entrega da disciplina de DevOps.

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

## Como executar o projeto

Para subir os servicos, execute:

```bash
docker compose up --build
```

Depois acesse:

- Front-end: http://localhost:8080
- Back-end: http://localhost:3001
- Status da API: http://localhost:3001/status
- Banco de dados: MongoDB na porta 27017

Para parar os containers:

```bash
docker compose down
```

## Comandos principais

```bash
docker compose up --build
docker compose down
git status
git branch
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


## Integrantes da equipe

- Ana Carolina Cartaxo
- Ana Paula Oliveira
- Anna Luiza Britto
