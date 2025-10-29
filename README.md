# 🏥 Projeto Clínica de Estética (Frontend)

Este repositório contém o código-fonte do **Frontend** para a aplicação web da Clínica de Estética Cris Moro. O projeto foi desenvolvido em React e Tailwind CSS, focado em uma experiência de usuário moderna, acessível (a11y) e em um painel administrativo completo para gestão de conteúdo.

A aplicação é dividida em duas partes principais:
1.  **Site Público:** A vitrine da clínica para pacientes, com páginas de serviços, agendamento e um questionário personalizado.
2.  **Painel Administrativo:** Uma área privada (protegida por login) onde o administrador pode gerir o conteúdo do site, como adicionar ou editar serviços.

![Screenshot da Homepage do projeto](caminho/para/sua/imagem.png)

---

## 🚀 Funcionalidades

### 👩‍💻 Site Público (Cliente)

* **Homepage:** Apresentação principal com um carrossel de ecrã inteiro (Swiper.js) destacando os serviços e o espaço.
* **Página de Serviços:** Carrega dinamicamente os serviços a partir da API, com descrições e imagens (layout texto/imagem alternado).
* **Página Sobre:** Apresenta a história e os valores da clínica.
* **Página de Agendamento:** Formulário para agendamento rápido de serviços.
* **Questionário Personalizado:** Um formulário complexo de múltiplas secções para que a clínica possa avaliar o paciente antes da consulta.
* **Acessibilidade (a11y):** Foco em semântica HTML (landmarks), navegação por teclado (anéis de foco) e compatibilidade com leitores de tela (atributos ARIA).
* **Design Responsivo:** Totalmente adaptável a dispositivos móveis e tablets.

### 🔐 Painel Administrativo (Admin)

* **Autenticação:** Página de login que se comunica com a API para autenticar o administrador (preparada para tokens JWT).
* **Rotas Protegidas:** O painel (`/painel`) só é acessível após o login.
* **Dashboard (CRUD de Serviços):**
    * **Visualizar (Read):** Lista todos os serviços cadastrados numa tabela.
    * **Criar (Create):** Abre um modal para adicionar um novo serviço (título, descrição, preço, imagem).
    * **Atualizar (Update):** Permite editar um serviço existente no mesmo modal.
    * **Excluir (Delete):** Permite excluir um serviço, com confirmação.

---

## 🛠️ Tecnologias Utilizadas

* **React.js:** Biblioteca principal para a construção da interface.
* **Tailwind CSS:** Framework CSS utility-first para estilização rápida e responsiva.
* **React Router (v6):** Para gestão das rotas da aplicação (públicas e privadas).
* **Swiper.js:** Para o carrossel interativo da homepage.
* **Axios:** (ou `fetch`) Para realizar as chamadas HTTP para a API.
* **React Icons:** Para iconografia.
* **ESLint:** Para garantir a qualidade e padronização do código.

---

## ⚙️ Instalação e Execução (Desenvolvimento)

Para executar este projeto localmente, siga os passos abaixo:

1.  **Clone o repositório:**
    ```bash
    git clone [URL_DO_SEU_REPOSITORIO_AQUI]
    ```

2.  **Navegue até a pasta do projeto:**
    ```bash
    cd landPage-CrisMoro
    ```

3.  **Instale as dependências:**
    ```bash
    npm install
    ```

4.  **Execute a aplicação:**
    ```bash
    npm start
    ```

5.  Abra o seu navegador e acesse `http://localhost:3000`.

---

## 🔗 Conexão com o Backend (API)

Este projeto é **apenas o frontend** da aplicação. Para que as funcionalidades de login, agendamento, questionário e o CRUD de serviços funcionem, é necessário um **backend (API)** a correr simultaneamente.

* A configuração da URL base da API pode ser encontrada em `src/services/api.js`.
* O frontend espera que a API forneça as seguintes rotas principais:
    * `POST /login` (Para autenticação)
    * `GET /servicos` (Para listar os serviços)
    * `POST /servicos` (Para criar um novo serviço)
    * `PUT /servicos/:id` (Para atualizar um serviço)
    * `DELETE /servicos/:id` (Para excluir um serviço)
    * `POST /agendamentos` (Para receber dados do formulário)
    * `POST /questionario` (Para receber dados do questionário)

---

## 📁 Estrutura de Pastas (Simplificada)
