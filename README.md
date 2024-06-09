Here's an adapted version of the front-end README using a similar structure to the back-end README, with placeholders and additional information included:

# About the Project
Small and medium-sized enterprises (SMEs) play a significant role in economic and social development. The adoption and promotion of sustainable business practices are gaining momentum, driven in part by international legislation. SMEs face specific challenges in publicizing their sustainable practices. This project aims to support these enterprises in effectively measuring and reporting their performance using Environmental, Social, and Governance (ESG) criteria through the development of a web-based self-assessment tool. The proposed system offers a simplified self-assessment and performance report with improvement suggestions, ensuring transparency and visibility of the steps necessary to achieve sustainable practices.

# Front-End in Next.js

This repository contains a front-end application developed using [Next.js](https://nextjs.org/), bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app). Follow the steps below to set up and run the project on your local machine.

## Prerequisites

Before starting, make sure you have the following tools installed on your system:

- [Node.js](https://nodejs.org/) (version 14 or higher)
- [Yarn](https://classic.yarnpkg.com/en/docs/install) (recommended) or [npm](https://www.npmjs.com/get-npm)

## Instructions

Before running the front-end, ensure the back-end is running. Follow these steps:

1. **Set up and run the back-end:**
   - Access the [tcc-api](https://github.com/ticflay/tcc-api) repository and follow the instructions to run the back-end.

Then, proceed with the following steps to set up and run the front-end:

1. **Clone the repository:**
```sh
git clone <repository link>
```

2. **Install dependencies:**

Navigate to the project directory and run the following command to install the dependencies using Yarn:

```sh
cd your-repository
yarn
```

or with npm:

```sh
cd your-repository
npm install
```

3. **Set environment variables:**

Create a `.env.local` file in the root directory of the project and set the necessary environment variables, including the API URL for the back-end.

```plaintext
NEXT_PUBLIC_API_URL=http://localhost:3000
```

Make sure to replace `http://localhost:3000` with the URL where your back-end is running if it's different.

### Running the Project

After configuring the environment variables, you can start the development server with the following command:

```sh
yarn dev
```

or with npm:

```sh
npm run dev
```

The application will be running at http://localhost:3000 by default.

## Building for Production

To build the project for production, run the following command:

```sh
yarn build
```

or with npm:

```sh
npm run build
```

This will create an optimized production build in the `.next` directory. You can then start the production server with:

```sh
yarn start
```

or with npm:

```sh
npm start
```

### pt-br
# Sobre o projeto
As pequenas e médias empresas têm um papel importante no desenvolvimento econômico e social, e a adoção e divulgação de práticas empresariais sustentáveis vêm ganhando cada vez mais força, inclusive por legislações internacionais. Para divulgar suas práticas sustentáveis, as pequenas e médias empresas enfrentam desafios específicos. Esse trabalho tem o objetivo de apoiar essas empresas a mensurar e relatar de forma efetiva seu desempenho, utilizando critérios Ambientais, Sociais e de Governança, através do desenvolvimento de uma ferramenta web de autoavaliação. O sistema proposto traz uma autoavaliação simplificada e relatório de desempenho com sugestões de melhoria, garantindo a transparência e visibilidade do que é necessário para atingir práticas sustentáveis.

# Front-End em Next.js

Este repositório contém uma aplicação front-end desenvolvida usando [Next.js](https://nextjs.org/), inicializada com [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app). Siga as etapas abaixo para configurar e executar o projeto em sua máquina local.

## Pré-requisitos

Antes de começar, certifique-se de ter as seguintes ferramentas instaladas em seu sistema:

- [Node.js](https://nodejs.org/) (versão 14 ou superior)
- [Yarn](https://classic.yarnpkg.com/en/docs/install) (recomendado) ou [npm](https://www.npmjs.com/get-npm)

## Instruções

Siga estas etapas para configurar e executar o projeto:

1. **Clonar o repositório:**
```sh
git clone <copiar link do repositório>
```

2. **Instalar as dependências:**

Navegue até o diretório do projeto e execute o seguinte comando para instalar as dependências com o Yarn:

```sh
cd seu-repositorio
yarn
```

ou com o npm:

```sh
cd seu-repositorio
npm install
```

3. **Configurar variáveis de ambiente:**

Crie um arquivo `.env.local` no diretório raiz do projeto e configure as variáveis de ambiente necessárias, incluindo a URL da API para o back-end.

```plaintext
NEXT_PUBLIC_API_URL=http://localhost:3000
```

Certifique-se de substituir `http://localhost:3000` pela URL onde seu back-end está em execução, se for diferente.

### Executar o Projeto

Após configurar as variáveis de ambiente, você pode iniciar o servidor de desenvolvimento com o seguinte comando:

```sh
yarn dev
```

ou com o npm:

```sh
npm run dev
```

A aplicação estará em execução em http://localhost:3000 por padrão.

## Construindo para Produção

Para construir o projeto para produção, execute o seguinte comando:

```sh
yarn build
```

ou com o npm:

```sh
npm run build
```

Isso criará uma build otimizada de produção no diretório `.next`. Você pode então iniciar o servidor de produção com:

```sh
yarn start
```

ou com o npm:

```sh
npm start
```

### Conclusion

By following these instructions, you will be able to set up, run, and build the front-end project efficiently. For any further questions or contributions, please refer to the project's contribution guidelines and contact information.
