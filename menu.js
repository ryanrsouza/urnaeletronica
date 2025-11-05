// Função para inserir o menu lateral
document.addEventListener('DOMContentLoaded', function() {
    const menuContainer = document.getElementById('menu-container');
    if (menuContainer) {
        menuContainer.innerHTML = `
        <nav class="menulateral">
            <div class="menu-top">
                <ul>
                    <li class="menu-items">
                        <a href="home.html">
                            <span class="icon"><i class="bi bi-house-door"></i></span>
                            <span class="txt-link">Página inicial</span>
                        </a>
                    </li>
                </ul>

                <ul>
                    <li class="menu-items">
                        <a href="conta.html">
                            <span class="icon"><i class="bi bi-person"></i></span>
                            <span class="txt-link">Conta</span>
                        </a>
                    </li>
                </ul>
            </div>

            <div class="menu-bottom">
                <ul>
                    <li class="menu-items">
                        <a href="ajuda.html">
                            <span class="icon"><i class="bi bi-question-circle"></i></span>
                            <span class="txt-link">Ajuda</span>
                        </a>
                    </li>
                </ul>

                <ul>
                    <li class="menu-items">
                        <a href="sobrenos.html">
                            <span class="icon"><i class="bi bi-person-vcard-fill"></i></span>
                            <span class="txt-link">Sobre nós</span>
                        </a>
                    </li>
                </ul>
            </div>
        </nav>`;
        
       
    }
});


        