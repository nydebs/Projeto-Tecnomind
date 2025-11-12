# 🧠 Tecnomind
Uma plataforma de Gestão do Conhecimento e Desenvolvimento Profissional, voltada para a pesquisa de termos técnicos na área de Tecnologia da Informação (TI), com o apoio de um chatbot interativo que facilita o acesso e a compreensão dos conceitos.
<div align="center">
<p>[Tela Inicial]</p>
  <img width="1920" height="1080" alt="Captura de tela 2025-11-05 225156" src="https://github.com/user-attachments/assets/ddf27aaf-017b-479a-86ca-4fc6da4fb7d4" />
<p><br>[Tela Login com o Google]</p>
  <img width="1852" height="845" alt="Captura de tela 2025-11-11 080852" src="https://github.com/user-attachments/assets/5876916c-5746-4e2c-95c1-6a3f2b657a51" />
<p><br>[Tela do Chatbot]</p>
  <img width="1920" height="1080" alt="Captura de tela 2025-11-05 225134" src="https://github.com/user-attachments/assets/c04b653c-da2a-4f12-963c-516c168acd09" />


**Plataforma de gestão de conhecimento e desenvolvimento profissional com chatbot interativo para termos técnicos em TI**

[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://choosealicense.com/licenses/mit/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?logo=nodedotjs)](https://nodejs.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-14+-4169E1?logo=postgresql)](https://www.postgresql.org/)
[![Google Gemini](https://img.shields.io/badge/Google_Gemini-1.5_Flash-4285F4?logo=google)](https://ai.google.dev/)

[Demo ao Vivo](#) · [Reportar Bug](https://github.com/tecnomind/tecnomind/issues) · [Solicitar Feature](https://github.com/tecnomind/tecnomind/issues)

</div>

---

## 📋 Sobre o Projeto

O **Tecnomind** é uma plataforma inovadora que utiliza Inteligência Artificial para auxiliar profissionais e estudantes de TI a superarem barreiras linguísticas e conceituais relacionadas a termos técnicos em inglês. Desenvolvido como Trabalho de Conclusão de Curso na Faculdade Metropolitana de Manaus, o projeto integra Gestão do Conhecimento e IA generativa para promover o aprendizado contínuo.

### 🎯 Problema Resolvido

Segundo pesquisa da EF Education First (2023), a limitação no inglês técnico está entre os principais fatores que comprometem a inserção e o crescimento de profissionais de TI em ambientes globalizados. O Tecnomind resolve essa lacuna oferecendo explicações estruturadas e contextualizadas em tempo real.

### ✨ Principais Funcionalidades

- 🤖 **Chatbot Inteligente com Google Gemini** - Respostas contextualizadas usando o modelo gemini-1.5-flash-latest
- 📚 **Estrutura Didática em 4 Pontos** - O que é, Como usar, Por que usar, Mapa de Aprendizado
- 🔐 **Autenticação Segura Google OAuth 2.0** - Login simplificado e seguro
- 💾 **Histórico Contextual** - Conversas persistentes que mantêm o contexto da sessão
- 📱 **Interface Responsiva** - Design adaptável para desktop, tablet e mobile
- 🎨 **UX Otimizada** - 87% de aprovação em testes de usabilidade

---

## 🎬 Demonstração

### Interface Principal

<div align="center">
  <img src="docs/screenshots/landing-page.png" alt="Landing Page" width="45%">
  <img src="docs/screenshots/chatbot-interface.png" alt="Interface do Chatbot" width="45%">
  <img alt="Link do Vídeo">
</div>

### Exemplo de Interação

```
Usuário: "O que é API REST?"

Tecnomind:
📌 O que é: Interface de comunicação entre sistemas usando protocolo HTTP
🔧 Como usar: Através de requisições GET, POST, PUT, DELETE para endpoints
💡 Por que usar: Permite integração escalável e padronizada entre aplicações
🗺️ Mapa de Aprendizado: HTTP → REST → JSON → Autenticação → Versionamento
```

---

## 🛠️ Stack Tecnológico

### Frontend
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![Bootstrap](https://img.shields.io/badge/Bootstrap-7952B3?style=for-the-badge&logo=bootstrap&logoColor=white)
![Figma](https://img.shields.io/badge/Figma-F24E1E?style=for-the-badge&logo=figma&logoColor=white)

### Backend
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white)

### Inteligência Artificial
![Google Gemini](https://img.shields.io/badge/Google_Gemini-4285F4?style=for-the-badge&logo=google&logoColor=white)

### Ferramentas
![Git](https://img.shields.io/badge/Git-F05032?style=for-the-badge&logo=git&logoColor=white)
![GitHub](https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white)

---

## 🚀 Começando

### 📦 Pré-requisitos

Certifique-se de ter instalado:

- [Node.js](https://nodejs.org/) (versão 18 ou superior)
- [PostgreSQL](https://www.postgresql.org/) (versão 14 ou superior)
- [npm](https://www.npmjs.com/) ou [yarn](https://yarnpkg.com/)
- [Git](https://git-scm.com/)
- Conta Google Cloud com API Gemini habilitada
- Credenciais OAuth 2.0 do Google

### 💻 Instalação

1. **Clone o repositório**
   ```bash
   git clone https://github.com/nydebs/Projeto-Tecnomind.git
   cd Projeto-Tecnomind
   ```

2. **Instale as dependências**
   ```bash
   npm install
   ```

3. **Configure o banco de dados PostgreSQL**
   ```bash
   # Crie o banco de dados
   createdb tecnomind
   ```

4. **Configure as variáveis de ambiente**
   ```bash
   cp .env.example .env
   ```
   
   Edite o arquivo `.env` com suas configurações:
   ```env
   # Banco de Dados
   DATABASE_URL="postgresql://usuario:senha@localhost:5432/tecnomind"
   
   # Google Gemini API
   GEMINI_API_KEY=sua_chave_api_gemini
   
   # Google OAuth 2.0
   GOOGLE_CLIENT_ID=seu_client_id
   GOOGLE_CLIENT_SECRET=seu_client_secret
   
   # Servidor
   PORT=3000
   NODE_ENV=development
   
   # JWT
   JWT_SECRET=sua_chave_secreta_jwt
   ```

5. **Execute as migrações do Prisma**
   ```bash
   npx prisma migrate dev
   npx prisma generate
   ```

6. **Inicie o servidor de desenvolvimento**
   ```bash
   npm run dev
   ```

7. **Acesse no navegador**
   ```
   http://localhost:3000
   ```

---

## 📖 Como Usar

### Autenticação

1. Acesse a landing page do Tecnomind
2. Clique em "Entrar com Google"
3. Autorize o acesso à sua conta Google
4. Você será redirecionado para a interface do chatbot

### Consultando Termos Técnicos

```javascript
// Exemplo de consulta via chatbot
"O que é Docker?"
"Explique microserviços"
"Como funciona GraphQL?"
```

### Estrutura de Resposta

Todas as respostas seguem o formato estruturado em 4 pontos:

- **O que é**: Definição clara e concisa do termo
- **Como usar**: Exemplos práticos de aplicação
- **Por que usar**: Benefícios e casos de uso
- **Mapa de Aprendizado**: Roadmap de estudos relacionados

---

## 🗂️ Estrutura do Projeto

```
📦 TECNOMIND/
├── 📁 back-end/
│   ├── 📁 config/    # Controladores da aplicação
│   ├── 📁 node_modules/           # Rotas da API
│   ├── 📁 prisma/         # Lógica de negócio
│   ├── 📁 routes/      # Autenticação e validação
│   ├── 📁 config/
|   └── ⚙️.env
|   └── {} package-lock.json
|   └── {} package.json        # Configurações (OAuth, DB)
│   └── 📄 server.js         # Ponto de entrada do servidor
├── 📁 front-end/
│   ├── 📁 img/             # Arquivos estáticos
│   └── index.css
│   └── index.html
│   └── chatbot.css
│   └── chatbot.html
├── 📁 views/                # Templates HTML
│   ├── landing.html         # Página inicial
│   └── chat.html            # Interface do chatbot
├── 📁 prisma/               # Schema e migrações do Prisma
│   └── schema.prisma        # Modelo de dados
├── 📁 docs/                 # Documentação adicional
│   ├── 📁 screenshots/      # Capturas de tela
│   └── 📁 diagrams/         # Diagramas UML
├── 📁 tests/                # Testes automatizados
├── 📄 package.json
├── 📄 .env.example
└── 📄 README.md
```

---

## 🏗️ Arquitetura do Sistema

### Modelo de Dados (Prisma Schema)

```prisma
model User {
  id            String        @id @default(uuid())
  email         String        @unique
  name          String
  picture       String?
  googleId      String        @unique
  createdAt     DateTime      @default(now())
  chatMessages  ChatMessage[]
}

model ChatMessage {
  id        String   @id @default(uuid())
  userId    String
  user      User     @relation(fields: [userId], references: [id])
  role      String   // 'user' ou 'assistant'
  content   String
  createdAt DateTime @default(now())
}
```

### Fluxo de Autenticação

1. Usuário clica em "Entrar com Google"
2. Redirecionamento para OAuth 2.0 do Google
3. Google valida credenciais e retorna token
4. Servidor gera JWT para sessão
5. Cliente armazena JWT para requisições autenticadas

### Integração com Google Gemini

```javascript
// Exemplo simplificado da integração
const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ 
  model: 'gemini-1.5-flash-latest',
  systemInstruction: `Você é um assistente especializado em TI.
  Responda sempre seguindo este formato:
  1. O que é: [definição]
  2. Como usar: [exemplos práticos]
  3. Por que usar: [benefícios]
  4. Mapa de Aprendizado: [roadmap]`
});
```

---

## 📊 Requisitos do Sistema

### Requisitos Funcionais (RF)

- **RF001**: Barra de pesquisa para consulta de termos técnicos
- **RF002**: Retorno estruturado em 4 pontos (definição, uso, benefícios, roadmap)
- **RF003**: Autenticação via Google OAuth 2.0
- **RF004**: Acesso a roadmap de estudo vinculado ao termo
- **RF005**: Exibição de foto do usuário após login
- **RF006**: Histórico de pesquisas persistente
- **RF007**: Canal de suporte "Fale Conosco"

### Requisitos Não-Funcionais (RNF)

- **RNF001**: Tempo de resposta ≤ 1 minuto (média atual: 10s)
- **RNF002**: Interface responsiva para todos os dispositivos
- **RNF003**: Ícones interativos e intuitivos
- **RNF004**: Suporte para 2.000 usuários simultâneos
- **RNF005**: Suporte a siglas, abreviações e padrões de escrita técnica
- **RNF006**: Recuperação automática em caso de falha (≤ 30s)

---

## 🧪 Testes

### Executando Testes

```bash
# Testes unitários
npm test

# Testes de integração
npm run test:integration

# Cobertura de testes
npm run test:coverage
```

### Resultados de Usabilidade

- ✅ **87%** de aprovação em testes de usabilidade
- ✅ **45%** do público-alvo: Estudantes de TI
- ✅ **30%** do público-alvo: Profissionais de TI
- ✅ **25%** do público-alvo: Docentes

---

## 🤝 Contribuindo

Contribuições são sempre bem-vindas! Este projeto segue a metodologia ágil com desenvolvimento iterativo e incremental.

### Como Contribuir

1. Faça um Fork do projeto
2. Crie uma Branch para sua Feature (`git checkout -b feature/NovaFuncionalidade`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova funcionalidade X'`)
4. Push para a Branch (`git push origin feature/NovaFuncionalidade`)
5. Abra um Pull Request

### Diretrizes de Contribuição

- Siga o padrão de código existente
- Adicione testes para novas funcionalidades
- Atualize a documentação quando necessário
- Mantenha commits atômicos e descritivos

---

## 🔮 Trabalhos Futuros

### Melhorias Planejadas

- ⚡ **Otimização de Performance**: Reduzir latência de resposta de 10s para <3s
- 📚 **Expansão de Conteúdo**: Ampliar glossário para diferentes especializações de TI
- 🎯 **IA Avançada**: Integrar recursos de personalização contextual aprimorados
- 🌐 **Internacionalização**: Suporte multilíngue (PT-BR, EN, ES)
- 📊 **Analytics**: Dashboard de progresso e estatísticas de aprendizado
- 🔔 **Notificações**: Sistema de lembretes de estudo personalizados

---

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---

## 👨‍💻 Equipe de Desenvolvimento

**Faculdade Metropolitana de Manaus - ADS232M01**

| Membro | Papel | GitHub | LinkedIn |
|--------|-------|--------|----------|
| **Deborah Evelyn da Silva Lira** | Full Stack Developer | [@nydebs](https://github.com/nydebs) | [LinkedIn]([www.linkedin.com/in/deborah-evelyn-da-silva-lira](https://www.linkedin.com/in/deborah-evelyn-a1b4681ba?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app)) |
| **Gabriel Fernando Tapajós Dantona** | UI/UX Designer | [@gabriel-dantona](#) | [LinkedIn](#) |
| **Karen Heloisa Santos da Silva** | UX Designer | [@karen-silva](#) | [LinkedIn](#) |
| **Levi de Almeida Geber** | AI Integration Specialist | [@levi-geber](#) | [LinkedIn](#) |
| **Saymon Vieira de Brito Souza** | UX Designer | [@saymon-souza](#) | [LinkedIn](#) |

**Orientadora**: [Profa. Luana Magalhães Leal](https://github.com/ProfaLuanaLeal) 

---

## 📚 Referências Acadêmicas

Este projeto é fundamentado em pesquisas científicas de:

- NONAKA & TAKEUCHI (1997) - Gestão do Conhecimento
- DAVENPORT & PRUSAK (1998) - Capital Intelectual
- RUSSELL & NORVIG (2021) - Inteligência Artificial
- NIELSEN (1993) - Usabilidade
- CALLEGARO et al. (2022) - Transformação Digital e GC

---

## 🙏 Agradecimentos

- Faculdade Metropolitana de Manaus pelo apoio institucional
- Google Cloud pela API Gemini
- Comunidade open-source do Node.js e PostgreSQL
- Todos os participantes dos testes de usabilidade

---

## 📞 Contato

**Suporte Técnico**: tecnomind.suporte@gmail.com

**Repositório**: [github.com/tecnomind/tecnomind](https://github.com/tecnomind/tecnomind)

---

<div align="center">

**⭐ Se este projeto foi útil, considere dar uma estrela no GitHub!**

**Desenvolvido com ❤️ pela equipe Tecnomind**

**TCC - Análise e Desenvolvimento de Sistemas | 2025**

</div>
