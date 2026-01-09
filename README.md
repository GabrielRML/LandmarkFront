# LandmarkFront 🗺️

Sistema de gerenciamento de pontos turísticos com integração ao IBGE para busca de municípios brasileiros. Aplicação web desenvolvida com React, TypeScript e Vite.

## 📋 Sobre o Projeto

O LandmarkFront é uma aplicação frontend para cadastro e gerenciamento de pontos turísticos. O sistema permite:

- Cadastro de pontos turísticos com nome, descrição e localização
- Busca e filtragem de pontos turísticos
- Integração com API do IBGE para seleção de municípios
- Edição e exclusão de pontos turísticos
- Paginação de resultados
- Interface moderna e responsiva com TailwindCSS

## Como Rodar o Projeto

### Pré-requisitos

Antes de começar, você precisa ter instalado em sua máquina:

- [Node.js](https://nodejs.org/) (versão 16 ou superior)
- [npm](https://www.npmjs.com/) ou [yarn](https://yarnpkg.com/)

### Instalação

1. Clone o repositório ou navegue até a pasta do projeto:
```bash
cd G:\LandmarkFront
```

2. Instale as dependências do projeto:
```bash
npm install
```

### Configuração da API

O projeto espera que a API backend esteja rodando. Por padrão, a aplicação se conecta a:

```
http://localhost:5131/api
```

Se sua API estiver rodando em outro endereço, crie um arquivo `.env` na raiz do projeto:

```bash
VITE_API_BASE_URL=http://localhost:5131/api
```

### Executando o Projeto

Para rodar o projeto em modo de desenvolvimento:

```bash
npm run dev
```

A aplicação estará disponível em: **http://localhost:5173**

## Tecnologias Utilizadas

- **React 19** - Biblioteca para construção de interfaces
- **TypeScript** - Superset JavaScript com tipagem estática
- **Vite** - Build tool e dev server
- **TailwindCSS 4** - Framework CSS utility-first
- **Axios** - Cliente HTTP para requisições
- **SweetAlert2** - Alertas e modais elegantes
- **FontAwesome** - Biblioteca de ícones
- **API IBGE** - Integração para dados de municípios

## Funcionalidades

### Busca de Pontos Turísticos
Sistema de busca com debounce para filtrar pontos turísticos por nome em tempo real.

### Modal de Cadastro/Edição
Interface intuitiva para criar e editar pontos turísticos com:
- Validação de campos
- Integração com API do IBGE para seleção de município
- Seleção de estado e município com dropdowns cascata

### Paginação
Sistema de paginação completo para navegar pelos resultados.
