// =========================================================================
// EURO-LOOK GARAGE: JAVASCRIPT AULAS 11 E 12 (DOM APROFUNDADO E EVENTOS)
// =========================================================================

// 1. A FONTE DE VERDADE (Estado / Dados - Aula 11)
const pecasGaragem = [
    { id: 1, nome: "Comando de Válvulas 2.0 8V", categoria: "motor", preco: 850.00, disponivel: true, desc: "Fluxo otimizado para altas rotações no Vectra." },
    { id: 2, nome: "Kit Para-choque Euro-look", categoria: "estetica", preco: 1200.00, disponivel: true, desc: "ABS de alta resistência, design limpo." },
    { id: 3, nome: "Suspensão Ajustável Coilover", categoria: "estetica", preco: 3400.00, disponivel: false, desc: "Fitment perfeito e ajuste fino de altura." },
    { id: 4, nome: "Filtro Cônico K&N Inflow", categoria: "motor", preco: 450.00, disponivel: true, desc: "Aumento de captação de ar frio." },
    { id: 5, nome: "Volante Desportivo Retro", categoria: "estetica", preco: 650.00, disponivel: true, desc: "Acabamento em pele e centro em alumínio." }
];

const pecasFavoritas = new Set();

// 2. FUNÇÕES PURAS E MÉTODOS DE ARRAY (Aula 11)
const calcularTotalEstoque = (pecas) => {
    return pecas
        .filter(peca => peca.disponivel)
        .reduce((total, peca) => total + peca.preco, 0);
};

const contarPecasPorCategoria = (pecas, categoriaBuscada) => {
    return pecas.filter(peca => peca.categoria === categoriaBuscada).length;
};

// 3. MANIPULAÇÃO SEGURA DO DOM (Segurança contra XSS)
function criarCardPeca(peca) {
    const article = document.createElement('article');
    article.classList.add('card-peca');
    article.dataset.id = peca.id;

    const titulo = document.createElement('h3');
    titulo.textContent = peca.nome;

    const descricao = document.createElement('p');
    descricao.textContent = peca.desc;

    const preco = document.createElement('p');
    preco.className = 'preco';
    preco.textContent = peca.disponivel ? `R$ ${peca.preco.toFixed(2)}` : 'Indisponível no momento';
    if (!peca.disponivel) preco.style.color = '#c0392b';

    const btnFavorito = document.createElement('button');
    btnFavorito.type = 'button';
    btnFavorito.className = 'btn-favoritar';
    btnFavorito.setAttribute('aria-pressed', 'false');
    btnFavorito.textContent = '⭐ Favoritar';

    const btnDetalhes = document.createElement('button');
    btnDetalhes.type = 'button';
    btnDetalhes.className = 'btn-detalhes';
    btnDetalhes.textContent = 'Ver Detalhes';

    article.append(titulo, descricao, preco, btnFavorito, btnDetalhes);
    return article;
}

// 4. RENDERIZAÇÃO DA GARAGEM E ESTATÍSTICAS
function renderizarGaragem() {
    const gradeMotor = document.getElementById('grade-motor');
    const gradeEstetica = document.getElementById('grade-estetica');

    gradeMotor.replaceChildren();
    gradeEstetica.replaceChildren();

    pecasGaragem.forEach(peca => {
        const card = criarCardPeca(peca);
        if (peca.categoria === 'motor') {
            gradeMotor.append(card);
        } else {
            gradeEstetica.append(card);
        }
    });

    atualizarResumoEstatisticas();
}

function atualizarResumoEstatisticas() {
    const lista = document.getElementById('lista-estatisticas');

    const totalItensMotor = contarPecasPorCategoria(pecasGaragem, 'motor');
    const totalItensEstetica = contarPecasPorCategoria(pecasGaragem, 'estetica');
    const valorTotalEstoque = calcularTotalEstoque(pecasGaragem);

    lista.replaceChildren();

    const linhas = [
        `Itens de Motor: ${totalItensMotor}`,
        `Itens de Estética: ${totalItensEstetica}`,
        `Valor total em Estoque: R$ ${valorTotalEstoque.toFixed(2)}`,
        `Peças Favoritas: ${pecasFavoritas.size}`
    ];

    linhas.forEach(texto => {
        const li = document.createElement('li');
        li.textContent = texto;
        lista.append(li);
    });
}

// 5. EVENTOS E DELEGAÇÃO (Aula 12)
function iniciarEventos() {
    const formOrcamento = document.getElementById('form-orcamento');
    const divMensagem = document.getElementById('mensagem-sucesso');

    if (formOrcamento) {
        formOrcamento.addEventListener('submit', (evento) => {
            evento.preventDefault();
            divMensagem.textContent = 'Obrigado! A sua solicitação foi enviada com sucesso.';
            divMensagem.classList.remove('feedback-oculto');
            divMensagem.classList.add('feedback-visivel');
            formOrcamento.reset();
        });
    }

    const mainArea = document.querySelector('main');
    mainArea.addEventListener('click', (evento) => {
        const btnFavoritar = evento.target.closest('.btn-favoritar');
        if (btnFavoritar) {
            const card = btnFavoritar.closest('article');
            const id = Number(card.dataset.id);

            if (pecasFavoritas.has(id)) {
                pecasFavoritas.delete(id);
                btnFavoritar.setAttribute('aria-pressed', 'false');
                btnFavoritar.style.color = '';
            } else {
                pecasFavoritas.add(id);
                btnFavoritar.setAttribute('aria-pressed', 'true');
                btnFavoritar.style.color = '#f1c40f';
            }
            atualizarResumoEstatisticas();
            return;
        }

        const btnDetalhes = evento.target.closest('.btn-detalhes');
        if (btnDetalhes) {
            const tituloPeca = btnDetalhes.closest('article').querySelector('h3').textContent;
            const selectPeca = document.getElementById('peca');
            const opcaoEncontrada = Array.from(selectPeca.options).find(opt => opt.text.includes(tituloPeca));

            if (opcaoEncontrada) {
                selectPeca.value = opcaoEncontrada.value;
            } else {
                selectPeca.value = 'outro';
                document.getElementById('mensagem').value = `Interesse na peça: ${tituloPeca}`;
            }

            document.querySelector('#orcamento').scrollIntoView({ behavior: 'smooth' });
        }
    });
}

// 6. INICIALIZAÇÃO
renderizarGaragem();
iniciarEventos();