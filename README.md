# 🗳️ Urna Eletrônica - Projeto Integrador

## 📌 Sobre o projeto
Este projeto tem como objetivo simular uma **urna eletrônica** utilizando **Arduino** e um **site integrado** para gerenciamento de candidatos e resultados.  

A proposta busca aproximar conceitos de **tecnologia**, **segurança digital** e **cidadania**, permitindo compreender como sistemas de votação eletrônica podem ser estruturados.  

---

## 🎯 Funcionalidades previstas
- 📷 **Exibição dos candidatos** (nome, número e foto).  
- 🔢 **Digitação do número** do candidato no teclado.  
- ❌ **Correção do voto** antes da confirmação.  
- ✅ **Registro automático** do voto na memória da urna.  
- 📊 **Contagem e armazenamento seguro** dos votos.  
- 🌐 **Envio dos resultados** ao servidor ao final da eleição.  

---

## 🛠️ Tecnologias que serão utilizadas
- **Arduino Uno/Mega** – microcontrolador principal.  
- **C++ (Arduino IDE)** – programação da urna.  
- **HTML, CSS e JavaScript** – desenvolvimento do site.  
- **Servidor web** – armazenamento de candidatos e resultados.  

---

## ⚙️ Funcionamento planejado

O sistema será estruturado em três etapas principais: **inicialização**, **votação** e **finalização**.  

### 🔹 1. Inicialização
- Ao ser ligada, a urna **conecta-se à internet**.  
- O Arduino acessa o **servidor do site** e baixa:  
  - **Lista de candidatos** (nome, número, partido).  
  - **Fotos dos candidatos** (para exibição na tela).  
- Após essa sincronização inicial, a urna **desconecta da internet** e permanece em **modo offline** para a votação.  

---

### 🔹 2. Votação
- O eleitor **digita o número do candidato** no teclado.  
- O sistema busca as informações correspondentes e exibe:  
  - **Nome do candidato**.  
  - **Número**.  
  - **Foto**.  
- O eleitor pode então:  
  - Pressionar **CONFIRMA ✅** para registrar o voto.  
  - Pressionar **CORRIGE ❌** para apagar e digitar novamente.  
- O voto confirmado é **armazenado localmente** na memória do Arduino.  

---

### 🔹 3. Finalização
- Ao término da votação, o administrador ativa o **modo de encerramento**.  
- A urna **se conecta novamente à internet**.  
- Os **resultados são enviados ao servidor**, tornando-se disponíveis no site.  
- Também poderá ser possível gerar **relatórios locais** (ex.: via display ou cartão SD, se implementado).  

---

### 🔹 Fluxo resumido
1. **Conexão inicial** → baixa dados do servidor.  
2. **Votação offline** → votos registrados com segurança.  
3. **Envio final** → resultados transmitidos ao servidor.  

---

## 👨‍🏫 Autores
O projeto está sendo desenvolvido pelos alunos:

- Alex Sandro Correa de Oliveira Junior
- Davy da Silva Alves Azevedo
- Gabriel Soares de Mattos
- Ryan Reis de Souza




