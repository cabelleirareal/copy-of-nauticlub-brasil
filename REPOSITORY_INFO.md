# 📋 Informações Completas do Repositório - Copy of NautiClub Brasil

## 📌 Visão Geral do Projeto

**Nome:** Copy of NautiClub Brasil  
**Descrição:** Uma plataforma institucional moderna e luxuosa para o mercado náutico, oferecendo catálogo de embarcações, inspeções técnicas e consultoria para estaleiros.  
**Tipo:** Aplicação Web (React + TypeScript)  
**Stack:** Vite, React 19, React Router, TypeScript, Tailwind CSS

---

## 📁 Estrutura do Repositório

```
copy-of-nauticlub-brasil/
├── App.tsx                 # Componente raiz com roteamento
├── index.tsx              # Ponto de entrada da aplicação
├── types.ts               # Definições de tipos TypeScript
├── constants.ts           # Constantes (dados de barcos, marcas, contato)
├── vite.config.ts         # Configuração Vite
├── tsconfig.json          # Configuração TypeScript
├── package.json           # Dependências do projeto
├── metadata.json          # Metadados da aplicação
├── index.html             # HTML principal
├── README.md              # Documentação básica
├── .gitignore             # Arquivos ignorados pelo git
├── .gitattributes         # Atributos git
├── nvmrc                  # Versão Node.js
├── preinstall.js          # Script de pré-instalação
│
├── components/
│   ├── Navbar.tsx         # Barra de navegação responsiva
│   ├── Footer.tsx         # Rodapé
│   ├── BoatCard.tsx       # Card de exibição de barcos
│   ├── LeadModal.tsx      # Modal para captura de leads
│   └── WhatsAppButton.tsx # Botão flutuante do WhatsApp
│
└── pages/
    ├── Home.tsx           # Página inicial com hero section
    ├── Catalog.tsx        # Catálogo de embarcações com filtros
    ├── Sell.tsx           # Página para vender barcos
    ├── Inspection.tsx     # Serviço de inspeção técnica
    ├── Shipyards.tsx      # Serviços B2B para estaleiros
    ├── Brands.tsx         # Marcas parceiras
    ├── About.tsx          # Sobre a empresa
    └── Contact.tsx        # Página de contato
```

---

## 🔧 Stack Tecnológico

### Dependências Principais
- **React:** ^19.2.4 - Framework UI moderno
- **React Router:** ^7.13.0 - Roteamento da aplicação
- **React DOM:** ^19.2.4 - Renderização do React para DOM

### DevDependencies
- **Vite:** ^6.2.0 - Bundler e dev server
- **TypeScript:** ~5.8.2 - Tipagem estática
- **Tailwind CSS:** Framework de estilos (via plugin Vite)
- **@vitejs/plugin-react:** ^5.0.0 - Suporte React no Vite
- **serve:** ^14.2.4 - Servidor para produção

### Requisitos
- **Node.js:** >=20
- **Gemini API Key:** Necessária para funcionalidades de IA

---

## 📄 Configurações Importantes

### vite.config.ts
- **Porta de Desenvolvimento:** 3000
- **Suporte a variáveis de ambiente:** GEMINI_API_KEY
- **Path alias:** @/ mapeia para raiz do projeto

### tsconfig.json
- **Target:** ES2022
- **Module:** ESNext
- **JSX:** react-jsx
- **Strict mode desativado** para mais flexibilidade

---

## 🗂️ Tipos de Dados (types.ts)

### BoatStatus (Enum)
- AVAILABLE = "Disponível"
- SOLD = "Vendido"
- RESERVED = "Reservado"

### Boat Interface
```typescript
{
  id: string;
  name: string;
  brand: string;
  year: number;
  size: number;
  price: number | string;
  type: string;
  status: BoatStatus;
  images: string[];
  specs: {
    pax: number;
    engine: string;
    hours?: number;
  };
  featured?: boolean;
}
```

### BrandPartner Interface
```typescript
{
  id: string;
  name: string;
  logo: string;
  description: string;
  category: string;
}
```

### Lead Interface
```typescript
{
  name: string;
  email: string;
  phone: string;
  message: string;
  boatId?: string;
  type: 'INTEREST' | 'SELL' | 'INSPECTION' | 'SHIPYARD';
}
```

---

## 🚀 Funcionalidades Principais

### 1. Home Page (/)
- Hero section com imagem luxuosa
- Ações rápidas (Inspeção, Consultoria, Marcas, Contato)
- Seção manifesto com história da empresa
- Cards de embarcações em destaque
- Badges de confiança (Vistoria 360°, Negociação Direta, Apoio Jurídico)
- CTA final para contato

**Estatísticas Exibidas:**
- 15k+ Embarcações Curadas
- 100% Segurança Jurídica

### 2. Catálogo (/catalogo)
- Listagem de embarcações com filtros dinâmicos
- Filtros por tipo: Todos, Yachts, Cruiser, Sport, Jet Ski
- Busca por nome ou marca
- Exibição de status e preço
- Cards com especificações (tamanho, pax, motor)
- Modal de interesse para leads

### 3. Vender Barco (/vender)
- Formulário para anunciar embarcação
- Campos: Marca/Modelo, Ano, Tamanho, Preço Pretendido
- Informações do vendedor: Nome, WhatsApp
- Benefícios: Exposição Nacional, Taxas Justas, Assessoria Premium
- Confirmação de sucesso

### 4. Inspeção Técnica (/inspecao)
- Detalhes de auditoria e laudos técnicos
- 150+ itens verificados
- Entrega de laudo em 24h
- 4 etapas do processo:
  1. Agendamento
  2. Inspeção Física
  3. Teste de Mar
  4. Laudo Digital

### 5. Estaleiros (/estaleiros) - B2B
- Consultoria para fabricantes
- Serviços: Design & Inovação, Treinamento Comercial, Marketing de Luxo
- Depoimento de sucesso (40% aumento em conversão)

### 6. Marcas (/marcas)
- Exibição de marcas parceiras

### 7. Sobre (/sobre)
- História da empresa
- Missão: Transformar a experiência náutica através de segurança, transparência e tecnologia
- Visão: Ser a autoridade máxima em consultoria náutica na América Latina até 2026
- Pilares fundamentais: Curadoria de ativos, Consultoria de gestão, Inovação tecnológica

### 8. Contato (/contato)
- Formulário de contato
- Informações da empresa:
  - **Endereço:** Av. Atlântica, 4500 - Balneário Camboriú, SC
  - **Telefone:** +55 (47) 99999-0000
  - **Email:** contato@nauticlub.com.br
- Link WhatsApp direto
- Placeholder de mapa

---

## 🎨 Componentes

### Navbar.tsx
- Logo com âncora
- Menu responsivo (desktop/mobile)
- Muda de estilo ao fazer scroll
- Links ativos destacados

### Footer.tsx
- Não especificado nos arquivos lidos

### BoatCard.tsx
- Imagem do barco com hover zoom
- Badge de destaque
- Informações: tipo, ano, tamanho, pax, motor
- Preço formatado em BRL
- Botão de interesse (abre LeadModal)

### LeadModal.tsx
- Captura dados de interesse do usuário
- Associado a um barco (boatId opcional)
- Envia lead para contato

### WhatsAppButton.tsx
- Botão flutuante para WhatsApp
- Facilita contato direto

---

## 📊 Dados Estáticos (constants.ts)

### HERO_IMAGE
`/images/hero-focker-333.webp` - Imagem principal do site

### BOATS Array
Exemplo de estrutura com 2 barcos:
1. **Focker 333 Gran Turismo**
   - Tipo: Lancha
   - Ano: 2023
   - Tamanho: 33 pés
   - Preço: R$ 850.000
   - Status: Available
   - Descrição: Lancha moderna, sofisticada e pronta para navegação de alto padrão

2. **Intermarine 48**
   - Tipo: Yacht
   - Ano: 2022
   - Tamanho: 48 pés
   - Preço: R$ 1.800.000
   - Status: Available

### BRAND_PARTNERS
- Focker
- Intermarine

### CONTACT_INFO
```javascript
{
  phone: "+55 47 98903-5173",
  email: "contato@nauticlub.com.br",
  address: "Balneário Camboriú - SC"
}
```

---

## 🔌 Integração Gemini API

- **Chave de API:** Configurada em `.env.local` como `GEMINI_API_KEY`
- **Uso:** Definida em `vite.config.ts` como variável de ambiente global
- **Permissões requeridas:** Camera e Microphone (definidos em metadata.json)

---

## 📱 Design & Estilo

### Cores
- **Primary:** Cor principal (azul/navy - navegação)
- **Accent:** Cor de destaque (laranja/coral - CTAs)
- **Background:** nauti-bg (cinza claro)
- **Slate:** Tons de cinza para textos secundários

### Tipografia
- **Display Font:** Padrão display para títulos (elegância)
- **Body Font:** Padrão sans-serif
- **Tracking:** Letras espaçadas em elementos premium

### Responsive
- Grid system com Tailwind CSS
- Breakpoints: sm, md, lg
- Mobile-first approach

---

## 🔄 Roteamento

Utiliza `HashRouter` do React Router DOM. Rotas:

| Rota | Componente | Descrição |
|------|-----------|-----------|
| / | Home | Página inicial |
| /catalogo | Catalog | Catálogo de barcos |
| /vender | Sell | Anunciar barco |
| /inspecao | Inspection | Inspeção técnica |
| /estaleiros | Shipyards | B2B Estaleiros |
| /marcas | Brands | Marcas parceiras |
| /sobre | About | Sobre a empresa |
| /contato | Contact | Contato |

---

## 🔐 Segurança

- **Framework:** Tailwind CSS para prevenção de XSS
- **Validação:** Formulários com atributos required
- **Ambiente:** Variáveis sensíveis em .env.local

---

## 📦 Scripts NPM

```json
{
  "dev": "vite",                    // Inicia dev server na porta 3000
  "build": "vite build",            // Build para produção
  "preview": "vite preview",        // Preview do build
  "start": "serve -s dist -l 3000"  // Inicia servidor de produção
}
```

---

## 📜 Histórico de Commits Recentes

```
f4800ae Update constants.ts
dda0560 Update WhatsAppButton.tsx
c7edbb2 Update WhatsAppButton.tsx
3590eb0 Update package.json
7bf97e2 Update vite.config.ts
688e464 Update package.json
1f9e775 Update package.json
db56df8 Merge pull request #2 from cabelleirareal/nauticlubbr
36bd3be Merge pull request #1 from cabelleirareal/main
6dd8bb5 Update package.json
```

---

## 🎯 Próximos Passos Sugeridos

1. **Integração de Backend:** Conectar formulários a uma API para salvar leads
2. **Autenticação:** Sistema de login para vendedores e compradores
3. **Pagamentos:** Integração com gateway de pagamentos
4. **Notificações:** Sistema de email/WhatsApp para confirmações
5. **Dashboard:** Painel administrativo para gerenciar barcos e leads
6. **Mapas:** Integração real com Google Maps para localização
7. **Chat:** Sistema de chat em tempo real para negociações
8. **Analytics:** Rastreamento de eventos e conversões

---

## 📞 Informações de Contato do Projeto

- **Email:** contato@nauticlub.com.br
- **Telefone:** +55 (47) 98903-5173 / +55 (47) 99999-0000
- **Localização:** Balneário Camboriú - SC

---

**Última Atualização:** 2026-05-04  
**Gerado por:** Claude Code
