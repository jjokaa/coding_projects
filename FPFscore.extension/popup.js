document.getElementById("preencher").addEventListener("click", async function () {
  const dadosTexto = document.getElementById("dadosFicha").value;
  const fichaJogo = parseFicha(dadosTexto);

  if (!fichaJogo || fichaJogo.length === 0) {
      alert("Erro: Nenhum jogador encontrado. Verifica o formato dos dados.");
      return;
  }

  // Enviar os dados para o content script que manipula o site
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    chrome.scripting.executeScript({
      target: { tabId: tabs[0].id },
      function: (fichaJogo) => {
          const linhasJogadores = document.querySelectorAll("tbody tr");
  
          fichaJogo.forEach(({ numero, nome, titular }) => {
              let jogadorEncontrado = false;
  
              linhasJogadores.forEach(linha => {
                  let nomeNoSite = linha.querySelector(".playerTable.name")?.textContent.trim();
                  let inputNumero = linha.querySelector("input[id*='JerseyNumber']");
                  let checkboxTitular = linha.querySelector(".playerTable.initialPlayer input[type='checkbox']");
                  let checkboxSuplente = linha.querySelector(".playerTable.benchPlayer input[type='checkbox']");
                  let checkboxConvocado = linha.querySelector(".playerTable.convocated input[type='checkbox']");
  
                  if (nomeNoSite && compararNomes(nomeNoSite, nome)) {
                      jogadorEncontrado = true;
  
                      // Selecionar "Convocados"
                      if (checkboxConvocado && !checkboxConvocado.checked) {
                          checkboxConvocado.checked = true;
                          checkboxConvocado.dispatchEvent(new Event("change", { bubbles: true }));
                      }
  
                      // Selecionar titular ou suplente
                      if (titular && checkboxTitular) {
                          checkboxTitular.checked = true;
                          checkboxTitular.dispatchEvent(new Event("change", { bubbles: true }));
                      } else if (!titular && checkboxSuplente) {
                          checkboxSuplente.checked = true;
                          checkboxSuplente.dispatchEvent(new Event("change", { bubbles: true }));
                      }
  
                      // Preencher número da camisola
                      if (inputNumero) {
                          if (inputNumero.disabled) {
                              inputNumero.removeAttribute("disabled");
                          }
                          inputNumero.value = numero;
                          inputNumero.dispatchEvent(new Event("input", { bubbles: true }));
                          inputNumero.dispatchEvent(new Event("change", { bubbles: true }));
                      }
                  }
              });
  
              if (!jogadorEncontrado) {
                  console.warn(`Jogador não encontrado: ${nome}`);
              }
          });
  
          // Função para comparar nomes
          function compararNomes(nomeSite, nomeFicha) {
              const normalizar = nome => nome
                  .toLowerCase()
                  .normalize("NFD").replace(/[\u0300-\u036f]/g, "") // Remove acentos
                  .replace(/[^a-z\s]/g, "") // Remove caracteres especiais
                  .split(" ")
                  .filter(p => p.length > 2); // Evita comparar preposições e letras isoladas
  
              const partesSite = normalizar(nomeSite);
              const partesFicha = normalizar(nomeFicha);
  
              return partesFicha.every(parte => partesSite.includes(parte));
          }
      },
      args: [fichaJogo]
    });
  });
});

// Função para processar a ficha de jogo
function parseFicha(texto) {
  let linhas = texto.split("\n").map(l => l.trim()).filter(l => l !== "");

  let ficha = [];
  let titular = true; // Começa por considerar titulares

  for (let linha of linhas) {
      if (linha.toLowerCase().includes("suplentes")) {
          titular = false; // Quando encontra "Suplentes", passa a ler suplentes
          continue;
      }
      if (linha.match(/^\d+/)) { // Apenas processa linhas que começam com número
          let partes = linha.split(" ");
          let numero = partes.shift();
          let nome = partes.join(" "); // O resto é o nome

          ficha.push({ numero, nome, titular });
      }
  }
  return ficha;
}