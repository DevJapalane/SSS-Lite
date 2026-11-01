# SSS Lite

**Solar System Simulator Lite**: um app web leve para ver o Sistema Solar em 3D, direto no navegador do celular ou do computador. Mostra o Sol, os 8 planetas e Plutão (planeta anão).

Projeto acadêmico de Engenharia de Software, planejado com Scrum (backlog PB01–PB13).

## O que o app faz
- **Visão Corpo:** um corpo por vez, grande, com textura fotográfica, girando no próprio eixo com a inclinação real.
- **Visão Sistema:** todos os corpos em órbitas circulares simplificadas, com distâncias comprimidas e velocidade proporcional ao período real (1 ano terrestre = 20 s). Tem botões Pausar/Retomar e Focar.
- **Comparar:** dois corpos lado a lado **em escala real**, com frases de proporção ("O Sol é 109 vezes maior que a Terra em diâmetro") e barras de massa em escala logarítmica.
- **Painel de dados:** raio, diâmetro, gravidade, massa e velocidade orbital, em km ou em proporção à Terra.
- **Rótulos flutuantes** para tocar nos corpos que ficam pequenos demais na tela.
- **Instalável (PWA):** pode ser adicionado à tela inicial do Android, do iOS e do desktop. Funciona **apenas online**.

## Stack
- React 19 + TypeScript + Vite
- React Three Fiber + drei (three.js)
- Zustand (estado global)
- CSS Modules com variáveis de tema (sem framework de UI)
- vite-plugin-pwa (manifesto e service worker mínimo)
- Vitest (testes) e oxlint (lint)

## Como rodar
Pré-requisito: Node.js 20 ou mais novo.

```bash
npm install
npm run dev        # servidor de desenvolvimento (http://localhost:5173)
npm run dev:host   # o mesmo, acessível pelo celular na mesma rede Wi-Fi
npm test           # testes
npm run lint       # lint
npm run build      # checagem de tipos + build de produção (pasta dist/)
npm run preview    # serve o build localmente
npm run icons      # regenera os ícones a partir de public/favicon.svg
```

## Publicar na Vercel (via GitHub)
O repositório já tem o `vercel.json`. O build é `npm run build` e a saída fica em `dist`. Para publicar com a conta **DevJapalane**:

1. Confira que o código está no GitHub: `git push` para a branch `master` de `DevJapalane/SSS-Lite`.
2. Acesse o site da Vercel e entre com **Continue with GitHub**, usando a conta DevJapalane.
3. Clique em **Add New… → Project**.
4. Na lista de repositórios, encontre **SSS-Lite** e clique em **Import**. Se ele não aparecer, clique em **Adjust GitHub App Permissions** e libere o acesso a esse repositório.
5. Na tela de configuração, deixe como está: Framework Preset **Vite**, Build Command `npm run build`, Output Directory `dist`. Não há variáveis de ambiente.
6. Clique em **Deploy**. Em cerca de 1 minuto sai um endereço `https://….vercel.app`.
7. A partir daí, **cada `git push` na `master` publica uma nova versão** automaticamente. Pushes em outras branches geram endereços de pré-visualização.

**Depois de publicar, teste no celular:**
- **Android (Chrome):** menu ⋮ → **Instalar app** (ou **Adicionar à tela inicial**).
- **iOS (Safari):** o próprio app mostra uma dica: **Compartilhar → Adicionar à Tela de Início**.

A instalação só funciona em HTTPS. A Vercel já entrega HTTPS; em `localhost` o navegador também permite.

## Estrutura
```
src/data      dados fixos dos corpos (NASA)
src/scene     tudo que é 3D (React Three Fiber)
src/ui        interface 2D (lista, painéis, botões)
src/store     estado global (Zustand)
src/styles    tema e variáveis CSS
src/utils     funções puras (formatação, escalas, frases), cobertas por testes
src/sw.ts     service worker mínimo (sem cache)
public/       ícones e texturas
```

Regras e decisões do projeto: [CLAUDE.md](CLAUDE.md). Texturas: [public/textures/README.md](public/textures/README.md).

## Créditos
- **Texturas dos corpos celestes:** Solar System Scope, licença CC BY 4.0.
- **Dados:** NASA Planetary Fact Sheet e NASA Sun Fact Sheet.
- **Fontes:** Inter e Space Grotesk, licença SIL Open Font License.
- **Bibliotecas:** React, three.js, React Three Fiber, drei, Zustand e Vite, todas de código aberto (licença MIT).
