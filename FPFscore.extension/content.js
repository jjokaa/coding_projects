function preencherNoSite(fichaJogo) {
    const linhasJogadores = document.querySelectorAll("tbody tr");

    fichaJogo.forEach(({ numero, nome, titular }) => {
        let jogadorEncontrado = false;

        linhasJogadores.forEach(linha => {
            let nomeNoSite = linha.querySelector(".playerTable.name")?.textContent.trim();
            let inputNumero = linha.querySelector("input[id*='JerseyNumber']");
            let checkboxTitular = linha.querySelector(".playerTable.initialPlayer input[type='checkbox']");
            let checkboxSuplente = linha.querySelector(".playerTable.benchPlayer input[type='checkbox']");

            if (nomeNoSite && compararNomes(nomeNoSite, nome)) {
                jogadorEncontrado = true;

                // Primeiro, marcar titular ou suplente
                setTimeout(() => {
                    if (titular && checkboxTitular) {
                        checkboxTitular.checked = true;
                        checkboxTitular.dispatchEvent(new Event("change", { bubbles: true }));
                    } else if (!titular && checkboxSuplente) {
                        checkboxSuplente.checked = true;
                        checkboxSuplente.dispatchEvent(new Event("change", { bubbles: true }));
                    }
                }, 100);

                // Depois, esperar um pouco e preencher o número
                setTimeout(() => {
                    if (inputNumero && !inputNumero.disabled) {
                        inputNumero.value = numero;
                        inputNumero.dispatchEvent(new Event("input", { bubbles: true }));
                    }
                }, 500);
            }
        });

        if (!jogadorEncontrado) {
            console.warn(`Jogador não encontrado: ${nome}`);
        }
    });
}

// Função para comparar nomes (permite pequenas diferenças)
function compararNomes(nomeSite, nomeFicha) {
    const nomeSiteParts = nomeSite.toLowerCase().split(" ");
    const nomeFichaParts = nomeFicha.toLowerCase().split(" ");

    return nomeFichaParts.every(part => nomeSiteParts.includes(part));
}