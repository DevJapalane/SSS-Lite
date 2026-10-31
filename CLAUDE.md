# SSS Lite – contexto do projeto

SSS Lite (Solar System Simulator Lite): app web de visualização 3D do Sistema Solar. Projeto acadêmico planejado com Scrum (backlog PB01–PB13, entregue em etapas).

- App web progressivo (PWA), acessado pelo navegador de celulares Android/iOS e desktop. Funciona apenas online.
- Diferencial: **LEVEZA**. Precisa rodar liso em celular intermediário. Toda decisão técnica deve respeitar isso.
- Escopo: Sol, 8 planetas e Plutão (identificado como planeta anão).
- Interface em português do Brasil; código (variáveis, funções, arquivos) em inglês.
- Dados: tabela fixa no código (`src/data/bodies.ts`), baseada no NASA Planetary Fact Sheet. Sem exibir links no app.

## Stack
React + TypeScript + Vite, React Three Fiber, @react-three/drei, Zustand (estado global), CSS Modules ou CSS puro com variáveis (sem frameworks de UI pesados), vite-plugin-pwa, Vitest. Deploy na Vercel.

## Direção visual: "realista com interface estilizada"
- Corpos celestes realistas (texturas fotográficas, Sol emissivo, anéis de Saturno).
- Interface estilizada: fundo espacial escuro com campo de estrelas sutil, painéis translúcidos (leve blur, bordas arredondadas, borda fina clara), uma única cor de destaque (azul-ciano), tipografia geométrica (Space Grotesk para títulos, Inter para texto, via @fontsource, sem depender de CDN).
- Layout base (do esboço do cliente): lista de corpos à esquerda e visualização 3D ocupando o centro. No celular, a lista vira barra/gaveta inferior e o painel de informações vira um cartão deslizável.
- Tokens visuais ficam em `src/styles/theme.css` — usar as variáveis, não cores soltas.

## Duas visões
- **Visão Corpo** (padrão): um corpo por vez, grande, centralizado.
- **Visão Sistema**: todos os corpos juntos. Distâncias SEMPRE comprimidas (nunca reais); exibir aviso discreto "Tamanhos e distâncias fora de escala" quando aplicável.
- Tamanho em escala real só existe no modo de comparação.

## Regras de desempenho
Texturas em WebP de 1K–2K, carregadas sob demanda (lazy + Suspense); limitar devicePixelRatio a no máximo 2; sem pós-processamento pesado; poucas luzes; reaproveitar geometrias.

Texturas: ver `public/textures/README.md` (Solar System Scope, CC BY 4.0 — crédito obrigatório na tela "Créditos", em texto, sem links). Sem textura, cada corpo usa `fallbackColor`.

## Estrutura
```
src/data    dados fixos dos corpos (tipados)
src/scene   tudo que é 3D (React Three Fiber)
src/ui      interface 2D (lista, painéis)
src/store   estado global (Zustand)
src/styles  tema e variáveis CSS
src/utils   funções puras auxiliares
public/textures  texturas WebP
```

## Comandos
- `npm run dev` – servidor de desenvolvimento
- `npm run build` – checagem de tipos + build de produção
- `npm test` – testes (Vitest)

## Como trabalhar comigo (IMPORTANTE)
Sou estudante de Engenharia de Software e quero APRENDER com este projeto. Por isso:
1. Antes de implementar, explique brevemente a abordagem e por quê.
2. Ao criar arquivos ou trechos não óbvios, comente o PORQUÊ (não o quê).
3. Ao terminar cada etapa, entregue um resumo com: o que foi feito, decisões tomadas e alternativas descartadas, conceitos novos que apareceram (ex.: o que é um hook, um store, uma projeção de câmera), como eu testo, e uma sugestão de mensagem de commit.
4. Não faça itens de backlog que não foram pedidos na etapa atual.

Base de conhecimento do projeto (resumos de etapas, instruções): `../Instructions/`.
