// =========================================
// PÁGINA DE RESULTADOS DA ELEIÇÃO
// =========================================

let eleicaoAtual = null;
let cargoAtual = null;
let modoVisualizacao = 'geral'; // 'geral' ou 'vencedor'

// Carrega a eleição ao iniciar a página
document.addEventListener('DOMContentLoaded', () => {
  carregarEleicao();
  
  // Event listener para toggle de visualização
  const radios = document.querySelectorAll('input[name="visualizacao"]');
  radios.forEach(radio => {
    radio.addEventListener('change', (e) => {
      modoVisualizacao = e.target.value;
      renderizarResultados();
    });
  });
});

// Carrega os dados da eleição
function carregarEleicao() {
  const urlParams = new URLSearchParams(window.location.search);
  const eleicaoId = urlParams.get('id');
  
  if (!eleicaoId) {
    mostrarMensagemErro('Eleição não encontrada.');
    return;
  }
  
  const eleicoes = JSON.parse(localStorage.getItem('eleicoes') || '[]');
  eleicaoAtual = eleicoes.find(e => e.id == eleicaoId);
  
  if (!eleicaoAtual) {
    mostrarMensagemErro('Eleição não encontrada.');
    return;
  }
  
  // Atualiza cabeçalho
  document.getElementById('nome-eleicao').textContent = `Resultados: ${eleicaoAtual.nome}`;
  document.getElementById('descricao-eleicao').textContent = eleicaoAtual.descricao || 'Veja os resultados detalhados da votação por cargo.';
  
  // Renderiza abas de cargos
  renderizarCargos();
  
  // Seleciona o primeiro cargo
  if (eleicaoAtual.cargos && eleicaoAtual.cargos.length > 0) {
    selecionarCargo(eleicaoAtual.cargos[0].nome);
  }
}

// Renderiza as abas de cargos
function renderizarCargos() {
  const tabsContainer = document.getElementById('cargos-tabs');
  tabsContainer.innerHTML = '';
  
  if (!eleicaoAtual.cargos || eleicaoAtual.cargos.length === 0) {
    tabsContainer.innerHTML = '<p style="color: #999;">Nenhum cargo cadastrado.</p>';
    return;
  }
  
  eleicaoAtual.cargos.forEach(cargo => {
    const button = document.createElement('button');
    button.className = 'cargo-tab';
    button.textContent = cargo.nome;
    button.dataset.cargo = cargo.nome;
    button.addEventListener('click', () => selecionarCargo(cargo.nome));
    tabsContainer.appendChild(button);
  });
}

// Seleciona um cargo e atualiza a visualização
function selecionarCargo(nomeCargo) {
  cargoAtual = nomeCargo;
  
  // Atualiza classe active nas abas
  document.querySelectorAll('.cargo-tab').forEach(tab => {
    if (tab.dataset.cargo === nomeCargo) {
      tab.classList.add('active');
    } else {
      tab.classList.remove('active');
    }
  });
  
  renderizarResultados();
}

// Renderiza os resultados do cargo atual
function renderizarResultados() {
  if (!cargoAtual) return;
  
  const container = document.getElementById('resultados-cargo');
  
  // Busca candidatos do cargo
  const candidatos = (eleicaoAtual.candidatos || []).filter(c => c.cargo === cargoAtual);
  
  if (candidatos.length === 0) {
    container.innerHTML = `
      <div class="mensagem-vazia">
        <i class="bi bi-inbox"></i>
        <p>Nenhum candidato cadastrado para este cargo.</p>
      </div>
    `;
    atualizarResumo(0, 0, 0, 0);
    return;
  }
  
  // Busca votos da eleição (armazenados em localStorage)
  const votosKey = `votos_eleicao_${eleicaoAtual.id}`;
  const votosData = JSON.parse(localStorage.getItem(votosKey) || '{}');
  
  // Se não houver dados de votos, inicializa com zeros
  if (!votosData[cargoAtual]) {
    votosData[cargoAtual] = {
      candidatos: {},
      brancos: 0,
      nulos: 0
    };
    // Para demonstração, gera votos aleatórios
    candidatos.forEach(c => {
      votosData[cargoAtual].candidatos[c.numero] = gerarVotosAleatorios();
    });
    votosData[cargoAtual].brancos = Math.floor(Math.random() * 50);
    votosData[cargoAtual].nulos = Math.floor(Math.random() * 30);
    localStorage.setItem(votosKey, JSON.stringify(votosData));
  }
  
  const votosCargo = votosData[cargoAtual];
  
  // Adiciona votos aos candidatos
  const candidatosComVotos = candidatos.map(c => ({
    ...c,
    votos: votosCargo.candidatos[c.numero] || 0
  }));
  
  // Ordena por votos (decrescente)
  candidatosComVotos.sort((a, b) => b.votos - a.votos);
  
  // Calcula totais
  const totalVotosValidos = candidatosComVotos.reduce((sum, c) => sum + c.votos, 0);
  const votosBrancos = votosCargo.brancos || 0;
  const votosNulos = votosCargo.nulos || 0;
  const totalVotos = totalVotosValidos + votosBrancos + votosNulos;
  
  // Renderiza tabela
  let html = `
    <h2>${cargoAtual}</h2>
    <table class="tabela-resultados">
      <thead>
        <tr>
          <th>Candidato</th>
          <th class="center">Número</th>
          <th>Partido</th>
          <th class="center">Votos</th>
          <th>Percentual</th>
        </tr>
      </thead>
      <tbody>
  `;
  
  // Filtra candidatos conforme modo de visualização
  const candidatosFiltrados = modoVisualizacao === 'vencedor' 
    ? [candidatosComVotos[0]] 
    : candidatosComVotos;
  
  candidatosFiltrados.forEach((candidato, index) => {
    const percentual = totalVotosValidos > 0 
      ? ((candidato.votos / totalVotosValidos) * 100).toFixed(2) 
      : 0;
    
    const isVencedor = index === 0 && modoVisualizacao === 'geral';
    const rowClass = isVencedor ? 'vencedor' : '';
    
    html += `
      <tr class="${rowClass}">
        <td>
          <div class="candidato-foto">
            ${candidato.foto 
              ? `<img src="${candidato.foto}" alt="${candidato.nome}">` 
              : '<div class="sem-foto"><i class="bi bi-person"></i></div>'
            }
            <div>
              <div class="candidato-nome">
                ${candidato.nome}
                ${isVencedor ? '<span class="badge-vencedor">VENCEDOR</span>' : ''}
              </div>
            </div>
          </div>
        </td>
        <td class="center"><strong>${candidato.numero}</strong></td>
        <td>${candidato.partido || '-'}</td>
        <td class="center"><strong>${candidato.votos}</strong></td>
        <td>
          <div class="percentual-barra">
            <div class="barra">
              <div class="barra-preenchida" style="width: ${percentual}%"></div>
            </div>
            <span class="percentual-texto">${percentual}%</span>
          </div>
        </td>
      </tr>
    `;
  });
  
  html += `
      </tbody>
    </table>
  `;
  
  container.innerHTML = html;
  
  // Atualiza resumo
  atualizarResumo(totalVotos, totalVotosValidos, votosBrancos, votosNulos);
}

// Atualiza o resumo de votos
function atualizarResumo(total, validos, brancos, nulos) {
  document.getElementById('total-votos').textContent = total;
  document.getElementById('votos-validos').textContent = validos;
  document.getElementById('votos-brancos').textContent = brancos;
  document.getElementById('votos-nulos').textContent = nulos;
}

// Gera votos aleatórios para demonstração
function gerarVotosAleatorios() {
  return Math.floor(Math.random() * 500) + 50;
}

// Mostra mensagem de erro
function mostrarMensagemErro(mensagem) {
  const container = document.querySelector('.brancoconteudo');
  container.innerHTML = `
    <div class="mensagem-vazia">
      <i class="bi bi-exclamation-triangle"></i>
      <h2>${mensagem}</h2>
      <p><a href="minhaseleicoes.html">Voltar para Minhas Eleições</a></p>
    </div>
  `;
}
