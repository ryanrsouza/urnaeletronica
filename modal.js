// =========================================
// SISTEMA DE MODAL PERSONALIZADO
// =========================================

// Cria o HTML do modal e adiciona ao DOM
function criarModalHTML() {
  if (document.getElementById('modal-overlay')) return; // Já existe
  
  const modalHTML = `
    <div class="modal-overlay" id="modal-overlay">
      <div class="modal-content">
        <div class="modal-icon" id="modal-icon">
          <i class="bi bi-exclamation-circle"></i>
        </div>
        <h2 class="modal-title" id="modal-title">Atenção</h2>
        <p class="modal-message" id="modal-message"></p>
        <button class="modal-button" id="modal-button">OK</button>
      </div>
    </div>
  `;
  
  document.body.insertAdjacentHTML('beforeend', modalHTML);
  
  // Adiciona event listener para fechar o modal
  const overlay = document.getElementById('modal-overlay');
  const button = document.getElementById('modal-button');
  
  button.addEventListener('click', fecharModal);
  
  // Fecha o modal ao clicar fora dele
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) {
      fecharModal();
    }
  });
  
  // Fecha o modal ao pressionar ESC
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && overlay.classList.contains('show')) {
      fecharModal();
    }
  });
}

// Mostra o modal com a mensagem
function mostrarModal(mensagem, tipo = 'info', titulo = null, callback = null) {
  criarModalHTML();
  
  const overlay = document.getElementById('modal-overlay');
  const icon = document.getElementById('modal-icon');
  const titleElement = document.getElementById('modal-title');
  const messageElement = document.getElementById('modal-message');
  const button = document.getElementById('modal-button');
  
  // Define o ícone baseado no tipo
  const icones = {
    error: 'bi-x-circle',
    success: 'bi-check-circle',
    warning: 'bi-exclamation-triangle',
    info: 'bi-info-circle'
  };
  
  // Define o título baseado no tipo
  const titulos = {
    error: 'Erro',
    success: 'Sucesso',
    warning: 'Atenção',
    info: 'Informação'
  };
  
  // Atualiza o ícone
  icon.className = `modal-icon ${tipo}`;
  icon.innerHTML = `<i class="bi ${icones[tipo] || icones.info}"></i>`;
  
  // Atualiza o título
  titleElement.textContent = titulo || titulos[tipo] || titulos.info;
  
  // Atualiza a mensagem
  messageElement.textContent = mensagem;
  
  // Atualiza a classe do botão
  button.className = `modal-button ${tipo}`;
  
  // Remove event listeners antigos
  const newButton = button.cloneNode(true);
  button.parentNode.replaceChild(newButton, button);
  
  // Adiciona novo event listener
  newButton.addEventListener('click', () => {
    fecharModal();
    if (callback && typeof callback === 'function') {
      callback();
    }
  });
  
  // Mostra o modal
  overlay.classList.add('show');
  newButton.focus();
}

// Fecha o modal
function fecharModal() {
  const overlay = document.getElementById('modal-overlay');
  if (overlay) {
    overlay.classList.remove('show');
  }
}

// Sobrescreve o alert nativo (opcional)
function substituirAlert() {
  window.alertOriginal = window.alert;
  window.alert = function(mensagem) {
    mostrarModal(mensagem, 'info');
  };
}

// Inicializa o modal quando o DOM estiver pronto
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', criarModalHTML);
} else {
  criarModalHTML();
}
