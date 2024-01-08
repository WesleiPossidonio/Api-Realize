# Api Website Vagas

<p>
  A Ideia inicial desse projeto é que a empresa possa entrar em uma rota privada e dentro dessa rota criar novas vagas de emprego. 
</p>

## Pré-requisitos
Certifique-se de ter as seguintes ferramentas instaladas em sua máquina:

- [Node.js](https://nodejs.org/)
- [Yarn](https://yarnpkg.com/)
- [PostgreSQL](https://www.postgresql.org/)

## Configuração do Ambiente

1. Clone o repositório:

```bash
git clone https://github.com/seu-usuario/seu-projeto.git
cd seu-projeto
````

## Instale as dependências:
```bash
yarn install
````
## Configure as variáveis de ambiente:
```bash
#Multer                #DB                 #Firebase
SECRET_KAY             DB_HOST=            FIREBASE_API_KEY=
EXPIRESIN_KAY=         DB_USERNAME=        AUTH_DOMAIN=
                       DB_PASSWORD=        PORJECT_ID=
                       DB_DATABASE=        STORAGE_BUCKET=
                       DB_DIALECT=         MESSAGIN_SENDERG_ID=
                                           APP_ID= 
                                    
````

## Banco de Dados
# Execute as migrações para criar as tabelas no PostgreSQL:
```bash
yarn sequelize db:migrate
````

## Executando o Projeto
```bash
yarn start
````

<p>O servidor estará disponível em http://localhost:3000 por padrão.</p>

## Endpoints da API

A seguir estão alguns dos principais endpoints da API, juntamente com os métodos HTTP permitidos e exemplos de requisições.

### 1. **Cadastrar Empresas**

- **Método:** POST
- **Endpoint:** `/companies`

#### Exemplo de Requisição:

```bash
curl -X POST http://localhost:3000/companies
````

### 2. **Login**

- **Método:** POST
- **Endpoint:** `/sessions`

#### Exemplo de Requisição:

```bash
curl -X POST http://localhost:3000/sessions
````

### 2. **Cadastrar Vagas**

- **Método:** POST
- **Endpoint:** `/vacancies`

#### Exemplo de Requisição:

```bash
curl -X POST http://localhost:3000/vacancies
````

### 2. **Buscar Vagas**

- **Método:** GET
- **Endpoint:** `/listVacancies`

#### Exemplo de Requisição:

```bash
curl -X GET http://localhost:3000/listVacancies
````
Licença
Este projeto é licenciado sob a Licença XYZ - veja o arquivo LICENSE.md para mais detalhes.












