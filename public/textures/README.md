# Texturas

Texturas 2K (2048×1024) do **Solar System Scope**, convertidas para WebP.

- Origem: `https://www.solarsystemscope.com/textures/download/<arquivo>`
- Licença: **CC BY 4.0** — o crédito é obrigatório. O app terá uma tela **"Créditos"**, em texto e sem links, com:
  > Texturas dos corpos celestes: Solar System Scope, licença CC BY 4.0.

O app funciona sem nenhum destes arquivos: cada corpo tem uma `fallbackColor` em `src/data/bodies.ts`, usada enquanto a textura carrega ou se ela não existir.

## Arquivos esperados

| Arquivo nesta pasta | Original (Solar System Scope) | Uso | Tamanho WebP |
|---|---|---|---|
| `sun.webp` | `2k_sun.jpg` | Sol | ~197 KB |
| `mercury.webp` | `2k_mercury.jpg` | Mercúrio | ~403 KB |
| `venus_atmosphere.webp` | `2k_venus_atmosphere.jpg` | Vênus (visual padrão, com nuvens) | ~31 KB |
| `earth_daymap.webp` | `2k_earth_daymap.jpg` | Terra | ~129 KB |
| `mars.webp` | `2k_mars.jpg` | Marte | ~190 KB |
| `jupiter.webp` | `2k_jupiter.jpg` | Júpiter | ~101 KB |
| `saturn.webp` | `2k_saturn.jpg` | Saturno | ~27 KB |
| `saturn_ring_alpha.webp` | `2k_saturn_ring_alpha.png` | Anéis de Saturno (com transparência) | ~5 KB |
| `uranus.webp` | `2k_uranus.jpg` | Urano | ~7 KB |
| `neptune.webp` | `2k_neptune.jpg` | Netuno | ~14 KB |

**Lua:** ainda sem textura (usa a cor de fallback). Para adicionar: baixar `2k_moon.jpg`, converter para `moon.webp` com os passos abaixo e preencher `texture: 'moon.webp'` em `src/data/moon.ts`.

**Plutão:** o Solar System Scope não tem textura de Plutão. Por enquanto ele usa a cor de fallback. Uma alternativa futura é o mapa global da New Horizons (NASA, domínio público).

**Removidas na revisão final:** `venus_surface`, `earth_clouds` e `earth_nightmap` (opcionais, ~820 KB) nunca foram usadas pelo app. Se uma versão futura usar, basta baixar e converter de novo com os passos abaixo.

As texturas são carregadas sob demanda, e o service worker não guarda nada em cache (o app é apenas online).

## Como converter para WebP

Qualidade 80 mantém a aparência e reduz o conjunto de ~6,9 MB (JPG) para ~1,9 MB.

**Opção 1: sharp-cli (Node, sem instalar no projeto)**, rodando na pasta com os originais:

```bash
npx sharp-cli -i 2k_mars.jpg -o mars.webp -f webp -q 80
```

**Opção 2: cwebp** (Google, `libwebp`):

```bash
cwebp -q 80 2k_mars.jpg -o mars.webp
cwebp -q 80 -alpha_q 90 2k_saturn_ring_alpha.png -o saturn_ring_alpha.webp
```

**Opção 3: no navegador:** [squoosh.app](https://squoosh.app), formato WebP, qualidade 80.

Regras: manter 1K–2K (nunca 4K/8K, que pesam demais em celular), remover o prefixo `2k_` e salvar nesta pasta com os nomes da tabela.
