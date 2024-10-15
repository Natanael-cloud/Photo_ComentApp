const photoInput = document.getElementById('photoInput');
// Seleciona o elemento de entrada de arquivo onde o usuário escolhe a foto.

const photoPreview = document.getElementById('photoPreview');
// Seleciona o elemento de imagem para exibir a pré-visualização da foto selecionada.

const photoComment = document.getElementById('photoComment');
// Seleciona o campo de texto para inserir um comentário sobre a foto.

const saveButton = document.getElementById('saveButton');
// Seleciona o botão que salva a foto e o comentário.

const photoGallery = document.getElementById('photoGallery');
// Seleciona a galeria onde as fotos da pasta selecionada serão exibidas.

const folderInput = document.getElementById('folderInput');
// Seleciona o campo de texto para inserir o nome de uma nova pasta.

const createFolderButton = document.getElementById('createFolderButton');
// Seleciona o botão para criar uma nova pasta.

const folderGallery = document.getElementById('folderGallery');
// Seleciona a galeria onde as pastas criadas serão exibidas.

const folderSelect = document.getElementById('folderSelect');
// Seleciona o menu dropdown para escolher a pasta onde a foto será salva.

const backButton = document.getElementById('backButton');
// Seleciona o botão de "Voltar" que permite retornar à galeria de pastas.

let selectedPhoto = '';
// Armazena a URL da foto atualmente selecionada.

let folders = {};
// Objeto que armazena as pastas criadas e suas respectivas fotos.

let currentFolder = '';
// Armazena o nome da pasta atualmente exibida.

// Exibe a foto selecionada
photoInput.addEventListener('change', (event) => {
  const file = event.target.files[0];
  // Obtém o primeiro arquivo (foto) selecionado pelo usuário.

  const reader = new FileReader();
  // Cria uma instância de FileReader para ler o conteúdo do arquivo.

  reader.onload = function (e) {
    selectedPhoto = e.target.result;
    // Quando o arquivo for carregado, armazena o resultado (URL da foto) em `selectedPhoto`.

    photoPreview.src = selectedPhoto;
    // Define a URL da foto no elemento de pré-visualização da foto.
  };

  reader.readAsDataURL(file);
  // Lê o arquivo como uma URL de dados para ser exibida como imagem.
});

// Cria uma nova pasta
createFolderButton.addEventListener('click', () => {
  const folderName = folderInput.value;
  // Obtém o nome da nova pasta inserido pelo usuário.

  if (folderName && !folders[folderName]) {
    // Verifica se o nome da pasta não está vazio e se já não existe.

    folders[folderName] = [];
    // Cria uma nova pasta vazia no objeto `folders`.

    updateFolderGallery();
    // Atualiza a galeria de pastas exibidas.

    updateFolderSelect();
    // Atualiza o menu dropdown com as pastas disponíveis.

    folderInput.value = '';
    // Limpa o campo de input do nome da pasta após a criação.
  } else {
    alert('Folder already exists or invalid name!');
    // Exibe um alerta se o nome da pasta já existir ou for inválido.
  }
});

// Atualiza a lista de pastas no seletor
function updateFolderSelect() {
  folderSelect.innerHTML = '';
  // Limpa todas as opções do seletor de pasta.

  for (const folder in folders) {
    // Para cada pasta no objeto `folders`, faz o seguinte:

    const option = document.createElement('option');
    // Cria uma nova opção para o seletor.

    option.value = folder;
    // Define o valor da opção como o nome da pasta.

    option.textContent = folder;
    // Define o texto visível da opção como o nome da pasta.

    folderSelect.appendChild(option);
    // Adiciona a nova opção ao seletor de pasta.
  }
}

// Atualiza a galeria de pastas
function updateFolderGallery() {
  folderGallery.innerHTML = '';
  // Limpa o conteúdo da galeria de pastas.

  photoGallery.style.display = 'none';
  // Oculta a galeria de fotos.

  folderGallery.style.display = 'flex';
  // Exibe a galeria de pastas.

  backButton.style.display = 'none';
  // Oculta o botão de "Voltar".

  for (const folder in folders) {
    const folderContainer = document.createElement('div');
    // Cria um contêiner para cada pasta.

    const folderPreview = document.createElement('img');
    // Cria um elemento de imagem para mostrar a prévia da primeira foto na pasta.

    const folderLabel = document.createElement('p');
    // Cria um rótulo para exibir o nome da pasta.

    const deleteFolderButton = document.createElement('button');
    // Cria um botão para excluir a pasta.

    folderLabel.textContent = folder;
    // Define o nome da pasta no rótulo.

    deleteFolderButton.textContent = 'Delete Folder';
    // Define o texto do botão de exclusão de pasta.

    folderContainer.classList.add('folder');
    // Adiciona uma classe CSS ao contêiner da pasta.

    if (folders[folder].length > 0) {
      folderPreview.src = folders[folder][0].photo;
      // Se a pasta contém fotos, exibe a primeira como prévia.
    } else {
      folderPreview.src = '';
      // Se a pasta está vazia, não exibe prévia.
    }

    folderContainer.appendChild(folderPreview);
    // Adiciona a pré-visualização ao contêiner.

    folderContainer.appendChild(folderLabel);
    // Adiciona o rótulo ao contêiner.

    folderContainer.appendChild(deleteFolderButton);
    // Adiciona o botão de exclusão ao contêiner.

    folderContainer.addEventListener('click', () => {
      renderFolderContents(folder);
      // Exibe o conteúdo da pasta ao clicar no contêiner.
    });

    deleteFolderButton.addEventListener('click', (e) => {
      e.stopPropagation();
      // Impede que o clique no botão de exclusão abra a pasta.

      deleteFolder(folder);
      // Exclui a pasta.
    });

    folderGallery.appendChild(folderContainer);
    // Adiciona o contêiner da pasta à galeria de pastas.
  }
}

// Salva a foto com o comentário na pasta selecionada
saveButton.addEventListener('click', () => {
  const comment = photoComment.value;
  // Obtém o comentário inserido pelo usuário.

  const selectedFolder = folderSelect.value;
  // Obtém a pasta selecionada no seletor.

  if (!selectedFolder) {
    alert('Please select a folder!');
    // Se nenhuma pasta for selecionada, exibe um alerta.
    return;
  }

  if (selectedPhoto && comment) {
    const photoEntry = {
      photo: selectedPhoto,
      comment: comment
    };
    // Cria um objeto com a foto e o comentário.

    folders[selectedFolder].push(photoEntry);
    // Adiciona a foto e o comentário à pasta selecionada.

    renderFolderContents(selectedFolder);
    // Exibe as fotos da pasta.

    photoPreview.src = '';
    // Limpa a pré-visualização da foto.

    photoComment.value = '';
    // Limpa o campo de comentário.
  } else {
    alert('Please select a photo and add a comment!');
    // Se não houver foto ou comentário, exibe um alerta.
  }
});

// Renderiza o conteúdo da pasta selecionada
function renderFolderContents(folderName) {
  currentFolder = folderName;
  // Define a pasta atual sendo exibida.

  photoGallery.innerHTML = '';
  // Limpa a galeria de fotos.

  photoGallery.style.display = 'flex';
  // Exibe a galeria de fotos.

  folderGallery.style.display = 'none';
  // Oculta a galeria de pastas.

  backButton.style.display = 'inline';
  // Exibe o botão de "Voltar".

  folders[folderName].forEach((entry, index) => {
    const photoContainer = document.createElement('div');
    // Cria um contêiner para cada foto.

    const img = document.createElement('img');
    // Cria um elemento de imagem para a foto.

    const p = document.createElement('p');
    // Cria um parágrafo para o comentário.

    const deletePhotoButton = document.createElement('button');
    // Cria um botão para excluir a foto.

    img.src = entry.photo;
    // Define o caminho da foto no elemento de imagem.

    p.textContent = entry.comment;
    // Define o texto do comentário no parágrafo.

    deletePhotoButton.textContent = 'Delete Photo';
    // Define o texto do botão de excluir a foto.

    photoContainer.classList.add('photo');
    // Adiciona uma classe CSS ao contêiner da foto.

    deletePhotoButton.addEventListener('click', () => {
      deletePhoto(folderName, index);
      // Exclui a foto ao clicar no botão de exclusão.
    });

    photoContainer.appendChild(img);
    // Adiciona a foto ao contêiner.

    photoContainer.appendChild(p);
    // Adiciona o comentário ao contêiner.

    photoContainer.appendChild(deletePhotoButton);
    // Adiciona o botão de exclusão ao contêiner.

    photoGallery.appendChild(photoContainer);
    // Adiciona o contêiner da foto à galeria de fotos.
  });
}

// Função para voltar à galeria de pastas
backButton.addEventListener('click', () => {
  updateFolderGallery();
  // Atualiza a galeria de pastas para exibir novamente.
});

// Função para excluir uma foto
function deletePhoto(folderName, photoIndex) {
  folders[folderName].splice(photoIndex, 1);
  // Remove a foto do array na pasta especificada.

  renderFolderContents(folderName);
  // Atualiza a galeria de fotos para refletir a exclusão.
}

// Função para excluir uma pasta
function deleteFolder(folderName) {
  delete folders[folderName];
  // Remove a pasta e todo o seu conteúdo do objeto `folders`.

  updateFolderGallery();
  // Atualiza a galeria de pastas.

  updateFolderSelect();
  // Atualiza o seletor de pastas.
}

