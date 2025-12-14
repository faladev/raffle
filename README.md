<div align="center">
  
# 🎁 Raffle - Sistema de Sorteio

<p align="center">
  <img src="https://img.shields.io/badge/Bun-000000?style=for-the-badge&logo=bun&logoColor=white" alt="Bun" />
  <img src="https://img.shields.io/badge/React-19.2-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React" />
  <img src="https://img.shields.io/badge/TypeScript-5.9-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Vite-7.2-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite" />
  <img src="https://img.shields.io/badge/Supabase-3FCF8E?style=for-the-badge&logo=supabase&logoColor=white" alt="Supabase" />
  <img src="https://img.shields.io/badge/TailwindCSS-4.1-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="Tailwind" />
</p>

<p align="center">
  Sistema moderno e intuitivo para organizar sorteios de amigo secreto e outros tipos de sorteio com interface elegante e experiência interativa.
</p>

</div>

---

## ✨ Funcionalidades

- 🎲 **Criação de Sorteios**: Interface simples para criar grupos de sorteio
- 🔗 **Links Personalizados**: Links únicos para administradores e participantes
- 🎴 **Raspadinha Interativa**: Experiência divertida ao revelar o sorteado com efeito de scratch card
- 👥 **Gestão de Participantes**: Adicione quantos participantes quiser
- 🔒 **Segurança**: Tokens únicos para cada participante e administrador
- 📱 **Responsivo**: Interface adaptada para todos os dispositivos
- 🎨 **Design Moderno**: UI elegante com gradientes e animações suaves

## 🚀 Tecnologias

Este projeto utiliza as tecnologias mais modernas do ecossistema JavaScript:

- **[Bun](https://bun.sh)** - Runtime JavaScript ultrarrápido
- **[React 19](https://react.dev)** - Biblioteca UI com React Compiler
- **[TypeScript](https://www.typescriptlang.org)** - Tipagem estática
- **[Vite](https://vitejs.dev)** - Build tool de próxima geração
- **[TanStack Router](https://tanstack.com/router)** - Roteamento type-safe
- **[Supabase](https://supabase.com)** - Backend e banco de dados
- **[Tailwind CSS](https://tailwindcss.com)** - Framework CSS utility-first
- **[Biome](https://biomejs.dev)** - Linter e formatter ultra-rápido

## 📋 Pré-requisitos

Antes de começar, você precisa ter instalado:

- [Bun](https://bun.sh) >= 1.0
- [Node.js](https://nodejs.org) >= 18 (opcional, caso não use Bun)
- Conta no [Supabase](https://supabase.com)

## 🔧 Instalação

1. **Clone o repositório**

```bash
git clone https://github.com/faladev/raffle.git
cd raffle
```

2. **Instale as dependências**

```bash
bun install
```

3. **Configure as variáveis de ambiente**

Crie um arquivo `.env` na raiz do projeto:

```env
VITE_SUPABASE_URL=sua_url_do_supabase
VITE_SUPABASE_ANON_KEY=sua_chave_anonima
```

4. **Configure o banco de dados**

Execute os scripts SQL no seu projeto Supabase:

```bash
# Aplique o schema
schema.sql

# Aplique as funções
fix-functions.sql
```

## 🎮 Uso

### Desenvolvimento

```bash
bun dev
```

O aplicativo estará disponível em `http://localhost:5173`

### Build para produção

```bash
bun run build
```

### Preview da build

```bash
bun preview
```

### Linting

```bash
# ESLint
bun lint

# Biome (recomendado)
bun lint:check
```

## 🚀 Deploy no GitHub Pages

Este projeto está configurado para deploy automático no GitHub Pages.

### Configuração Inicial

1. **Ative o GitHub Pages no seu repositório**
   - Vá em `Settings` > `Pages`
   - Em `Source`, selecione `GitHub Actions`

2. **Configure as variáveis de ambiente**
   - Vá em `Settings` > `Secrets and variables` > `Actions`
   - Adicione os seguintes secrets:
     - `VITE_SUPABASE_URL`: Sua URL do Supabase
     - `VITE_SUPABASE_ANON_KEY`: Sua chave anônima do Supabase

3. **Ajuste o base path no vite.config.ts**
   - Se seu repositório se chama `raffle`, o base já está configurado
   - Se for diferente, altere a linha `base: "/nome-do-repo/"`

4. **Faça push para a branch main**
   ```bash
   git add .
   git commit -m "Configure GitHub Pages deployment"
   git push origin main
   ```

5. **Acesse seu site**
   - Após o deploy, seu site estará em: `https://faladev.github.io/raffle/`

### Deploy Manual

Você também pode fazer deploy manual:

```bash
bun run build
# Faça upload do conteúdo da pasta 'dist' para seu servidor
```

## 📁 Estrutura do Projeto

```
raffle/
├── src/
│   ├── assets/          # Recursos estáticos
│   ├── components/      # Componentes React
│   │   ├── CreateRaffle.tsx
│   │   └── ScratchCard.tsx
│   ├── lib/             # Utilitários e helpers
│   │   ├── supabase.ts
│   │   └── supabase-helpers.ts
│   ├── routes/          # Rotas da aplicação
│   │   ├── index.tsx           # Criação de sorteio
│   │   ├── admin.$token.tsx    # Painel admin
│   │   ├── p.$token.tsx        # Seleção de participante
│   │   └── reveal.$token.tsx   # Revelação do sorteado
│   ├── utils/           # Funções utilitárias
│   ├── main.tsx         # Entry point
│   └── types.ts         # Definições de tipos
├── public/              # Arquivos públicos
└── ...configs           # Arquivos de configuração
```

## 🎯 Fluxo de Uso

1. **Criar Sorteio**: Acesse a página inicial e crie um grupo com nome e participantes
2. **Compartilhar Link**: Receba o link de administrador para gerenciar e o link público para os participantes
3. **Participantes Entram**: Cada participante acessa o link público e seleciona seu nome
4. **Revelar Sorteado**: Com um efeito de raspadinha interativo, cada um descobre seu sorteado

## 🛠️ Scripts Disponíveis

| Comando | Descrição |
|---------|-----------|
| `bun dev` | Inicia servidor de desenvolvimento |
| `bun build` | Gera build de produção |
| `bun preview` | Preview da build de produção |
| `bun lint` | Executa ESLint |
| `bun lint:check` | Executa Biome check |

## 🎨 Características Técnicas

### Performance
- ⚡ Compilado com React Compiler para otimização automática
- 🚀 Build extremamente rápido com Vite + Bun
- 📦 Code splitting automático com TanStack Router

### Segurança
- 🔐 Tokens únicos por participante
- 🛡️ Row Level Security (RLS) no Supabase
- 🔒 Validação de dados server-side

### UX/UI
- 🎴 Efeito scratch card interativo
- 🌈 Gradientes modernos e animações suaves
- 📱 Design responsivo mobile-first
- ♿ Acessibilidade com ARIA labels

## 🤝 Contribuindo

Contribuições são bem-vindas! Sinta-se à vontade para:

1. Fazer fork do projeto
2. Criar uma branch para sua feature (`git checkout -b feature/MinhaFeature`)
3. Commit suas mudanças (`git commit -m 'Adiciona MinhaFeature'`)
4. Push para a branch (`git push origin feature/MinhaFeature`)
5. Abrir um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 👨‍💻 Autor

Desenvolvido com ❤️ por **FalaDev**

---

<div align="center">

**[⬆ Voltar ao topo](#-raffle---sistema-de-sorteio)**

</div>
