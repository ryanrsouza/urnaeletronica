// ===============================
// SCRIPT PRINCIPAL DO SITE - Urna Eletrônica Escolar
// Todas as funções JS do site centralizadas e comentadas aqui.
// ===============================

// ----------------------
// 1. Usuário SIMULADO em localStorage (Fake API)
// ----------------------
// No início, vamos salvar e ler os usuários e eleições do localStorage.
// Assim você pode testar o site sem backend.
// Depois é só trocar pelas chamadas reais de API!

// Função para obter usuários do "banco" (localStorage)
function getUsuarios() {
  // Busca a lista. Se não existir, retorna []
  return JSON.parse(localStorage.getItem("usuarios")) || [];
}

// Função para salvar usuários no "banco"
function setUsuarios(lista) {
  localStorage.setItem("usuarios", JSON.stringify(lista));
}

// Função para obter eleições do usuário logado
function getEleicoes() {
  // Cada usuário pode ter sua lista, aqui simplificamos para salvar tudo em "eleicoes"
  return JSON.parse(localStorage.getItem("eleicoes")) || [];
}

// Função para salvar eleições
function setEleicoes(lista) {
  localStorage.setItem("eleicoes", JSON.stringify(lista));
}

// ----------------------
// 2. Cadastro de Usuário
// ----------------------
// Página: cadastro.html
const cadastroForm = document.getElementById("cadastroForm");
if (cadastroForm) {
  cadastroForm.addEventListener("submit", function (e) {
    e.preventDefault();

    // Obtem valores dos campos
    const username = document.getElementById("username").value.trim();
    const email = document.getElementById("email").value.trim();
    const senha = document.getElementById("senha").value;

    // Validação simples
    if (!username || !email || !senha) {
      mostrarModal("Preencha todos os campos!", "error");
      return;
    }

    // Busca usuários cadastrados
    const usuarios = getUsuarios();

    // Checa se já existe o email
    if (usuarios.some(u => u.email === email)) {
      mostrarModal("Email já cadastrado. Faça login ou use outro.", "warning");
      return;
    }

    // Cria novo usuário e salva
    usuarios.push({ username, email, senha });
    setUsuarios(usuarios);

    mostrarModal("Cadastro realizado! Agora faça login.", "success", null, () => {
      window.location.href = "index.html";
    });
  });
}

// ----------------------
// 3. Login do Usuário
// ----------------------
// Página: index.html
const loginForm = document.getElementById("loginForm");
if (loginForm) {
  loginForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const email = document.getElementById("email").value.trim();
    const senha = document.getElementById("senha").value;

    // Busca usuários cadastrados
    const usuarios = getUsuarios();

    // Procura o usuário
    const usuario = usuarios.find(u => u.email === email && u.senha === senha);

    if (usuario) {
      // Salva informações básicas de sessão
      localStorage.setItem("usuarioLogado", JSON.stringify(usuario));
      window.location.href = "home.html";
    } else {
      mostrarModal("Credenciais inválidas. Tente novamente.", "error");
    }
  });
}

// ----------------------
// 4. Proteção de Rotas (acesso restrito)
// ----------------------
// Impede acesso a páginas internas sem login
function checkLogin() {
  // Lista de páginas protegidas (adicione outras se quiser)
  const paginasProtegidas = [
    "home.html",
    "conta.html",
    "minhaseleicoes.html",
    "criareleicao.html",
    "cadastrarcandidatos.html",
    "resultados.html"
  ];
  const estaProtegida = paginasProtegidas.some(p => window.location.pathname.endsWith(p));
  if (estaProtegida && !localStorage.getItem("usuarioLogado")) {
    // Redireciona sem modal pois não está na página ainda
    window.location.href = "index.html";
  }
}
// Executa a checagem ao carregar qualquer página
checkLogin();

// ----------------------
// 5. Logout
// ----------------------
function logout() {
  localStorage.removeItem("usuarioLogado");
  window.location.href = "index.html";
}

// Exemplo de botão logout: <button onclick="logout()">Sair</button>
// Ou adicione ao botão via JS:
const btnSair = document.getElementById("sair-conta");
if (btnSair) btnSair.onclick = logout;

// ----------------------
// 6. Preencher Dados da Conta
// ----------------------
// Página: conta.html
if (document.body.classList.contains("conta-page")) {
  const usuario = JSON.parse(localStorage.getItem("usuarioLogado") || "{}");
  document.getElementById("nome-usuario").textContent = usuario.username || "(não encontrado)";
  document.getElementById("email-usuario").textContent = usuario.email || "(não encontrado)";
  
  // Botão Sair
  document.getElementById("sair-conta").onclick = function() {
    localStorage.removeItem("usuarioLogado");
    window.location.href = "index.html";
  };
  
  // Botão Alterar Senha
  document.getElementById("alterar-senha").onclick = function() {
    // Cria um modal customizado para input de senha
    const modalOverlay = document.getElementById('modal-overlay');
    const modalContent = modalOverlay.querySelector('.modal-content');
    
    modalContent.innerHTML = `
      <div class="modal-icon info">
        <i class="bi bi-key"></i>
      </div>
      <h2 class="modal-title">Alterar Senha</h2>
      <div style="text-align: left; margin-bottom: 1rem;">
        <label style="display: block; margin-bottom: 0.5rem; font-weight: 600;">Senha Atual:</label>
        <input type="password" id="senha-atual" style="width: 100%; padding: 0.6rem; border: 1px solid #ccc; border-radius: 6px; margin-bottom: 0.8rem;">
        
        <label style="display: block; margin-bottom: 0.5rem; font-weight: 600;">Nova Senha:</label>
        <input type="password" id="nova-senha" style="width: 100%; padding: 0.6rem; border: 1px solid #ccc; border-radius: 6px; margin-bottom: 0.8rem;">
        
        <label style="display: block; margin-bottom: 0.5rem; font-weight: 600;">Confirmar Nova Senha:</label>
        <input type="password" id="confirmar-senha" style="width: 100%; padding: 0.6rem; border: 1px solid #ccc; border-radius: 6px;">
      </div>
      <div style="display: flex; gap: 0.8rem; justify-content: center;">
        <button class="modal-button" id="cancelar-senha" style="background: #999;">Cancelar</button>
        <button class="modal-button" id="confirmar-senha-btn">Confirmar</button>
      </div>
    `;
    
    modalOverlay.classList.add('show');
    
    document.getElementById('cancelar-senha').onclick = fecharModal;
    
    document.getElementById('confirmar-senha-btn').onclick = function() {
      const senhaAtual = document.getElementById('senha-atual').value;
      const novaSenha = document.getElementById('nova-senha').value;
      const confirmarSenha = document.getElementById('confirmar-senha').value;
      
      if (!senhaAtual || !novaSenha || !confirmarSenha) {
        mostrarModal("Preencha todos os campos!", "warning");
        return;
      }
      
      if (senhaAtual !== usuario.senha) {
        mostrarModal("Senha atual incorreta!", "error");
        return;
      }
      
      if (novaSenha !== confirmarSenha) {
        mostrarModal("As senhas não coincidem!", "error");
        return;
      }
      
      if (novaSenha.length < 4) {
        mostrarModal("A nova senha deve ter pelo menos 4 caracteres!", "warning");
        return;
      }
      
      // Atualiza a senha
      const usuarios = getUsuarios();
      const index = usuarios.findIndex(u => u.email === usuario.email);
      if (index !== -1) {
        usuarios[index].senha = novaSenha;
        setUsuarios(usuarios);
        
        // Atualiza usuário logado
        usuario.senha = novaSenha;
        localStorage.setItem("usuarioLogado", JSON.stringify(usuario));
        
        fecharModal();
        mostrarModal("Senha alterada com sucesso!", "success");
      }
    };
  };
  
  // Botão Excluir Conta
  document.getElementById("excluir-conta").onclick = function() {
    const modalOverlay = document.getElementById('modal-overlay');
    const modalContent = modalOverlay.querySelector('.modal-content');
    
    modalContent.innerHTML = `
      <div class="modal-icon error">
        <i class="bi bi-exclamation-triangle"></i>
      </div>
      <h2 class="modal-title">Excluir Conta</h2>
      <p class="modal-message">Esta ação é irreversível! Todos os seus dados, incluindo eleições criadas, serão perdidos. Tem certeza que deseja continuar?</p>
      <div style="display: flex; gap: 0.8rem; justify-content: center;">
        <button class="modal-button" id="cancelar-exclusao" style="background: #999;">Cancelar</button>
        <button class="modal-button error" id="confirmar-exclusao">Excluir Conta</button>
      </div>
    `;
    
    modalOverlay.classList.add('show');
    
    document.getElementById('cancelar-exclusao').onclick = fecharModal;
    
    document.getElementById('confirmar-exclusao').onclick = function() {
      // Remove usuário da lista
      const usuarios = getUsuarios();
      const novaLista = usuarios.filter(u => u.email !== usuario.email);
      setUsuarios(novaLista);
      
      // Remove eleições do usuário
      const eleicoes = getEleicoes();
      const eleicoesFiltradas = eleicoes.filter(e => e.emailCriador !== usuario.email);
      setEleicoes(eleicoesFiltradas);
      
      // Remove sessão
      localStorage.removeItem("usuarioLogado");
      
      fecharModal();
      mostrarModal("Conta excluída com sucesso!", "success", null, () => {
        window.location.href = "index.html";
      });
    };
  };
}

// ----------------------
// 7. Listar Eleições do Usuário
// ----------------------
// Página: minhaseleicoes.html
if (window.location.pathname.endsWith("minhaseleicoes.html")) {
  const usuario = JSON.parse(localStorage.getItem("usuarioLogado") || "{}");
  const eleicoes = getEleicoes().filter(e => e.emailCriador === usuario.email);

  const tbody = document.getElementById("lista-pleitos");
  tbody.innerHTML = "";

  if (eleicoes.length === 0) {
    const tr = document.createElement("tr");
    const td = document.createElement("td");
    td.colSpan = 4;
    td.textContent = "Nenhum pleito cadastrado.";
    tr.appendChild(td);
    tbody.appendChild(tr);
  } else {
    eleicoes.forEach(eleicao => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${eleicao.nome || ""}</td>
        <td>${eleicao.dataInicio || ""}</td>
        <td>${eleicao.dataFim || ""}</td>
        <td><button class="consultar-btn" onclick="window.location.href='resultados.html?id=${eleicao.id}'">Ver Resultados</button></td>
      `;
      tbody.appendChild(tr);
    });
  }
}

// ----------------------
// 8. Criar Nova Eleição
// ----------------------
// Página: criareleicao.html
if (window.location.pathname.endsWith("criareleicao.html")) {
  // Lista temporária de cargos da eleição
  let cargos = [];

  // Adicionar cargo ao clicar no botão
  document.getElementById("adicionar-cargo").onclick = function () {
    const nome = document.getElementById("nome-cargo").value.trim();
    const tamanho = document.getElementById("tamanho-numero").value;
    if (!nome || !tamanho) {
      mostrarModal("Preencha nome do cargo e tamanho do número.", "warning");
      return;
    }
    cargos.push({ nome, tamanho });
    mostrarModal(`Cargo "${nome}" adicionado!`, "success");
    // Aqui você pode atualizar uma lista visual, se quiser
    document.getElementById("nome-cargo").value = "";
    document.getElementById("tamanho-numero").value = "";
  };

  // Criar pleito
  document.getElementById("criar-pleito-btn").onclick = function () {
    const nome = document.getElementById("nome-pleito").value.trim();
    const descricao = document.getElementById("descricao").value.trim();
    const dataInicio = document.getElementById("data-inicio").value;
    const dataFim = document.getElementById("data-fim").value;

    if (!nome || !dataInicio || !dataFim || cargos.length === 0) {
      mostrarModal("Preencha todos os campos e adicione pelo menos um cargo.", "error");
      return;
    }

    const usuario = JSON.parse(localStorage.getItem("usuarioLogado") || "{}");
    const todasEleicoes = getEleicoes();
    
    // Cria objeto da eleição
    const novaEleicao = {
      id: Date.now(), // ID único baseado em timestamp
      nome,
      descricao,
      dataInicio,
      dataFim,
      cargos,
      emailCriador: usuario.email,
      candidatos: [] // Array vazio para candidatos
    };
    
    todasEleicoes.push(novaEleicao);
    setEleicoes(todasEleicoes);
    
    // Salva o ID da eleição atual para uso na próxima página
    localStorage.setItem("eleicaoAtualId", novaEleicao.id);

    mostrarModal("Eleição criada com sucesso! Agora você pode adicionar candidatos.", "success", null, () => {
      window.location.href = "cadastrarcandidatos.html";
    });
  };

  // Adicionar candidato (simples, só mensagem!)
  const btnAdicionarCandidato = document.getElementById("adicionar-candidato");
  if (btnAdicionarCandidato) {
    btnAdicionarCandidato.onclick = function () {
      mostrarModal("Funcionalidade de adicionar candidatos ainda será implementada.", "info");
    };
  }

  // Finalizar cadastro (apenas uma mensagem)
  const btnFinalizarCadastro = document.getElementById("finalizar-cadastro");
  if (btnFinalizarCadastro) {
    btnFinalizarCadastro.onclick = function () {
      mostrarModal("Cadastro finalizado! Volte para a página inicial.", "success", null, () => {
        window.location.href = "home.html";
      });
    };
  }
}

// ----------------------
// 8. Página de Cadastro de Candidatos
// ----------------------
// Página: cadastrarcandidatos.html
// Carrega informações da eleição criada e permite adicionar candidatos

if (window.location.pathname.includes("cadastrarcandidatos.html")) {
  // Recupera o ID da eleição atual
  const eleicaoId = localStorage.getItem("eleicaoAtualId");
  
  if (!eleicaoId) {
    mostrarModal("Nenhuma eleição selecionada. Retorne à página de criar eleição.", "warning", null, () => {
      window.location.href = "criareleicao.html";
    });
  } else {
    // Busca a eleição pelo ID
    const todasEleicoes = getEleicoes();
    let eleicaoAtual = todasEleicoes.find(e => e.id == eleicaoId);
    
    if (eleicaoAtual) {
      // Inicializa array de candidatos se não existir
      if (!eleicaoAtual.candidatos) {
        eleicaoAtual.candidatos = [];
      }
      
      // Atualiza o título da página com o nome da eleição
      const tituloEleicao = document.getElementById("titulo-eleicao");
      if (tituloEleicao) {
        tituloEleicao.textContent = "Adicionar Candidatos - " + eleicaoAtual.nome;
      }
      
      // Preenche o select de cargos
      const selectCargo = document.getElementById("cargo-candidato");
      if (selectCargo && eleicaoAtual.cargos) {
        eleicaoAtual.cargos.forEach(cargo => {
          const option = document.createElement("option");
          option.value = cargo.nome;
          option.textContent = cargo.nome;
          option.dataset.tamanho = cargo.tamanho; // Armazena tamanho do número
          selectCargo.appendChild(option);
        });
        
        // Atualiza limite do campo número quando trocar cargo
        selectCargo.addEventListener("change", function() {
          const selectedOption = this.options[this.selectedIndex];
          const tamanhoNumero = selectedOption.dataset.tamanho;
          const inputNumero = document.getElementById("numero-candidato");
          
          if (tamanhoNumero && inputNumero) {
            const maxNumero = Math.pow(10, tamanhoNumero) - 1;
            inputNumero.max = maxNumero;
            inputNumero.placeholder = `Número (até ${tamanhoNumero} dígitos)`;
          }
        });
      }
      
      // Função para renderizar cards de candidatos
      function renderizarCandidatos() {
        const container = document.getElementById("lista-candidatos");
        container.innerHTML = "";
        
        if (eleicaoAtual.candidatos.length === 0) {
          container.innerHTML = '<p style="text-align: center; color: #999; padding: 2rem;">Nenhum candidato cadastrado</p>';
          return;
        }
        
        eleicaoAtual.candidatos.forEach((candidato, index) => {
          const card = document.createElement("div");
          card.className = "candidato-card";
          card.innerHTML = `
            <div class="candidato-info">
              <div class="nome">${candidato.nome}</div>
              <div class="detalhes">
                ${candidato.cargo} • Nº ${candidato.numero} • ${candidato.partido}
              </div>
            </div>
            <button class="remove-candidato-btn" data-index="${index}">×</button>
          `;
          container.appendChild(card);
        });
        
        // Adiciona eventos de remoção
        container.querySelectorAll(".remove-candidato-btn").forEach(btn => {
          btn.addEventListener("click", function() {
            const index = parseInt(this.dataset.index);
            const candidato = eleicaoAtual.candidatos[index];
            
            // Cria modal de confirmação personalizado
            const modalOverlay = document.getElementById('modal-overlay');
            const modalContent = modalOverlay.querySelector('.modal-content');
            
            modalContent.innerHTML = `
              <div class="modal-icon warning">
                <i class="bi bi-exclamation-triangle"></i>
              </div>
              <h2 class="modal-title">Remover Candidato</h2>
              <p class="modal-message">Deseja remover <strong>${candidato.nome}</strong> (Nº ${candidato.numero})?</p>
              <div style="display: flex; gap: 0.8rem; justify-content: center;">
                <button class="modal-button" id="cancelar-remocao" style="background: #999;">Cancelar</button>
                <button class="modal-button error" id="confirmar-remocao">Remover</button>
              </div>
            `;
            
            modalOverlay.classList.add('show');
            
            document.getElementById('cancelar-remocao').onclick = fecharModal;
            
            document.getElementById('confirmar-remocao').onclick = function() {
              eleicaoAtual.candidatos.splice(index, 1);
              
              // Atualiza no localStorage
              const todasEleicoes = getEleicoes();
              const eleicaoIndex = todasEleicoes.findIndex(e => e.id == eleicaoId);
              todasEleicoes[eleicaoIndex] = eleicaoAtual;
              setEleicoes(todasEleicoes);
              
              fecharModal();
              renderizarCandidatos();
              mostrarModal("Candidato removido com sucesso!", "success");
            };
          });
        });
      }
      
      // Renderiza candidatos existentes
      renderizarCandidatos();
      
      // Adicionar candidato
      const btnAdicionar = document.getElementById("adicionar-candidato");
      if (btnAdicionar) {
        btnAdicionar.onclick = function() {
          const nome = document.getElementById("nome-candidato").value.trim();
          const cargo = document.getElementById("cargo-candidato").value;
          const numero = document.getElementById("numero-candidato").value;
          const partido = document.getElementById("partido-candidato").value.trim();
          const foto = document.getElementById("foto-candidato").value.trim();
          
          if (!nome || !cargo || !numero) {
            mostrarModal("Preencha nome, cargo e número do candidato.", "warning");
            return;
          }
          
          // Valida tamanho do número
          const cargoSelecionado = eleicaoAtual.cargos.find(c => c.nome === cargo);
          if (cargoSelecionado && numero.length != cargoSelecionado.tamanho) {
            mostrarModal(`O número deve ter exatamente ${cargoSelecionado.tamanho} dígitos para o cargo ${cargo}.`, "error");
            return;
          }
          
          // Adiciona candidato
          eleicaoAtual.candidatos.push({
            nome,
            cargo,
            numero,
            partido: partido || "Sem partido",
            foto: foto || ""
          });
          
          // Atualiza no localStorage
          const todasEleicoes = getEleicoes();
          const eleicaoIndex = todasEleicoes.findIndex(e => e.id == eleicaoId);
          todasEleicoes[eleicaoIndex] = eleicaoAtual;
          setEleicoes(todasEleicoes);
          
          // Limpa formulário
          document.getElementById("nome-candidato").value = "";
          document.getElementById("numero-candidato").value = "";
          document.getElementById("partido-candidato").value = "";
          document.getElementById("foto-candidato").value = "";
          
          // Renderiza novamente
          renderizarCandidatos();
          
          mostrarModal("Candidato adicionado com sucesso!", "success");
        };
      }
      
      // Finalizar cadastro
      const btnFinalizar = document.getElementById("finalizar-cadastro");
      if (btnFinalizar) {
        btnFinalizar.onclick = function() {
          if (eleicaoAtual.candidatos.length === 0) {
            mostrarModal("Adicione pelo menos um candidato antes de finalizar.", "warning");
            return;
          }
          
          localStorage.removeItem("eleicaoAtualId");
          mostrarModal("Cadastro de candidatos finalizado com sucesso!", "success", null, () => {
            window.location.href = "minhaseleicoes.html";
          });
        };
      }
    }
  }
}

// ----------------------
// 9. Link para Cadastro na Tela de Login
// ----------------------
// Página: index.html
const toggleCadastro = document.getElementById("toggleCadastro");
if (toggleCadastro) {
  toggleCadastro.onclick = function (e) {
    e.preventDefault();
    window.location.href = "cadastro.html";
  };
}

// -------------
// Redirecionamento dos cards na home
// -------------
if (document.body.classList.contains("home")) {
  // Seleciona o card "Nova Eleição" e adiciona o evento de clique
  const cardNovaEleicao = document.getElementById("card-nova-eleicao");
  if (cardNovaEleicao) {
    cardNovaEleicao.style.cursor = "pointer"; // mostra que é clicável
    cardNovaEleicao.onclick = function () {
      window.location.href = "criareleicao.html";
    };
  }

  // Seleciona o card "Minhas Eleições" e adiciona o evento de clique
  const cardMinhasEleicoes = document.getElementById("card-minhas-eleicoes");
  if (cardMinhasEleicoes) {
    cardMinhasEleicoes.style.cursor = "pointer";
    cardMinhasEleicoes.onclick = function () {
      window.location.href = "minhaseleicoes.html";
    };
  }
}

// ----------------------
// FIM DO SCRIPT PRINCIPAL
// ----------------------

// Qualquer dúvida, altere, teste e brinque bastante! ;-)