# NeuroCart

O NeuroCart é um protótipo de recomendação de produtos que combina uma API em Node.js, MongoDB e um modelo TensorFlow.js treinado a partir do histórico de compras.

O projeto mostra o fluxo completo de uma recomendação em pequena escala: os dados de usuários e produtos são servidos por uma API, o navegador prepara os vetores de características, o treinamento roda em um Web Worker e a interface exibe os produtos ordenados pelo score previsto.

## O que está implementado

- API em Node.js e Express para usuários e produtos
- Persistência em MongoDB e script de seed
- Treinamento do modelo no navegador com TensorFlow.js
- Web Worker para isolar treinamento e recomendação
- Codificação de categoria, cor, preço e idade
- Rede neural densa com saída de classificação binária
- Ranking das recomendações pelo score previsto
- Hooks de progresso e visualização por TFVisor
- Frontend estático servido pela mesma aplicação Node.js

## Arquitetura

```text
Navegador
  |
  | HTTP
  v
API Express
  |
  v
MongoDB

Interface
  |
  v
Web Worker
  |
  v
Modelo TensorFlow.js
  |
  v
Recomendações ordenadas
```

A API cuida do acesso aos dados. O treinamento e a inferência atualmente acontecem no navegador.

## Fluxo da recomendação

1. Usuários e produtos são carregados pela API.
2. As características dos produtos são normalizadas e codificadas.
3. O histórico de compras é convertido em vetores de usuário.
4. As amostras de treino combinam vetores de usuário e produto.
5. Uma pequena rede neural densa é treinada com TensorFlow.js.
6. O usuário selecionado é combinado com cada produto.
7. Os scores previstos são ordenados para gerar as recomendações.

É uma implementação voltada a estudo e experimentação. Não apresento este repositório como um serviço de recomendação pronto para produção.

## Executando localmente

Requisitos:

- Node.js 22 ou superior
- Docker com Docker Compose, ou MongoDB local

Suba o MongoDB:

```bash
docker compose up -d
```

Crie o arquivo de ambiente:

```bash
cp .env.example .env
```

Instale as dependências e carregue os dados:

```bash
npm ci
npm run seed
```

Inicie a aplicação:

```bash
npm start
```

Acesse:

```text
http://localhost:3000
```

## Configuração

```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017
MONGODB_DB_NAME=ecommerce-aula
```

## Verificação

```bash
npm run check
```

## Limitações atuais

- A base de treino é pequena e sintética.
- O modelo é treinado no navegador em vez de ser publicado como artefato versionado.
- A qualidade das recomendações ainda não possui avaliação offline formal.
- Autenticação, autorização e isolamento multi-tenant não fazem parte deste protótipo.
- Todos os produtos são pontuados. Em um catálogo grande seria necessário um estágio de recuperação de candidatos antes do ranking.

## Origem do projeto

Este repositório começou a partir de um exercício de sistema de recomendação do material do curso Engenharia de Software com IA Aplicada, publicado pela UNIPDS e Erick Wendel. A partir dessa base, usei o projeto para estudar o fluxo de recomendação e acrescentei uma API com MongoDB, persistência, seed e organização do repositório.

Material de referência:
https://github.com/unipds-engenharia-de-ia-aplicada/engenharia-de-software-com-ia-aplicada

A atribuição ao material original foi mantida de forma intencional.

## Language

English version: [README.md](README.md)
