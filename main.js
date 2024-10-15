const { app, BrowserWindow } = require('electron');  // Importa os módulos 'app' e 'BrowserWindow' do Electron.
const path = require('path');  // Importa o módulo 'path' do Node.js para manipular caminhos de arquivos.

function createWindow() {
  // Cria uma nova janela de navegação com dimensões definidas
  const win = new BrowserWindow({
    width: 800,   // Largura da janela em pixels
    height: 600,  // Altura da janela em pixels
    webPreferences: {  // Configurações adicionais da janela
      preload: path.join(__dirname, 'renderer.js'),  // Carrega o arquivo 'renderer.js' antes do conteúdo da janela.
      nodeIntegration: true,  // Permite usar módulos do Node.js dentro da janela.
    }
  });

  win.loadFile('index.html');  // Carrega o arquivo HTML principal na janela.
}

app.whenReady().then(() => {  
  // Executa a função createWindow quando o Electron estiver pronto para criar janelas
  createWindow();

  app.on('activate', () => {
    // No macOS, geralmente os aplicativos não fecham completamente ao fechar a última janela,
    // então esta função recria a janela quando o ícone do app é clicado e não há janelas abertas.
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  // Fecha a aplicação quando todas as janelas forem fechadas, exceto no macOS (darwin).
  // No macOS, os apps costumam permanecer abertos mesmo após o fechamento de todas as janelas.
  if (process.platform !== 'darwin') app.quit();
});

