const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');
const ffmpegPath = require('ffmpeg-static');
const { execSync } = require('child_process');

(async () => {
  try {
    const directoryPath = __dirname;
    const outputDir = path.join(directoryPath, 'output');

    // Criar pasta output se não existir
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir);
    }

    // Pegar todos arquivos .html
    const htmlFiles = fs.readdirSync(directoryPath)
      .filter(file => file.endsWith('.html'));

    if (htmlFiles.length === 0) {
      console.log('❌ Nenhum arquivo HTML encontrado.');
      return;
    }

    const browser = await chromium.launch({ headless: true });

    for (const file of htmlFiles) {
      console.log(`🎬 Processando: ${file}`);

      const tempVideoDir = path.join(directoryPath, 'temp-video');

      // Criar contexto com gravação
      const context = await browser.newContext({
        recordVideo: { dir: tempVideoDir },
        viewport: { width: 1280, height: 720 }
      });

      const page = await context.newPage();

      const filePath = 'file://' + path.join(directoryPath, file);

      await page.goto(filePath);
      await page.waitForLoadState('networkidle');

      // Tempo de gravação (5 segundos)
      await page.waitForTimeout(5000);

      await context.close(); // Finaliza gravação

      // Pegar vídeo gerado (.webm)
      const recordedFile = fs.readdirSync(tempVideoDir)[0];
      const recordedPath = path.join(tempVideoDir, recordedFile);

      const outputName = file.replace('.html', '.mp4');
      const finalOutput = path.join(outputDir, outputName);

      console.log('🔄 Convertendo para MP4...');

      // Converter para MP4 usando ffmpeg-static
      execSync(
        `"${ffmpegPath}" -y -i "${recordedPath}" -vcodec libx264 -pix_fmt yuv420p "${finalOutput}"`,
        { stdio: 'inherit' }
      );

      // Limpar pasta temporária
      fs.rmSync(tempVideoDir, { recursive: true, force: true });

      console.log(`✅ Criado: output/${outputName}`);
    }

    await browser.close();

    console.log('🚀 Processo finalizado com sucesso.');
  } catch (error) {
    console.error('❌ Erro:', error);
  }
})();