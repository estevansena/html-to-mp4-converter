# 🎬 HTML to MP4 Converter

Converte automaticamente arquivos `.html` em `.mp4` usando Playwright + ffmpeg-static.

## 🚀 O que faz
- Detecta todos os `.html` na pasta
- Grava 5 segundos de cada página
- Converte para `.mp4`
- Salva os arquivos na pasta `/output`

## 📦 Requisitos
- Node.js 18+
- NPM

(Não precisa instalar FFmpeg manualmente)

## 🔧 Instalação
```bash
npm install
npx playwright install
```

## ▶️ Como rodar
```bash
node index.js
```

## 📁 Saída
Os vídeos gerados ficam em:

```
output/
 ├─ arquivo1.mp4
 ├─ arquivo2.mp4
```

Cada `.html` gera um `.mp4` com o mesmo nome.

## ⚙️ Configurações
Duração do vídeo (em milissegundos):
```js
await page.waitForTimeout(5000);
```

Resolução:
```js
viewport: { width: 1280, height: 720 }
```

---
Projeto simples para converter HTML em vídeo automaticamente.
