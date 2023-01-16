let livros = [];
const endpoitAPI = `https://guilhermeonrails.github.io/casadocodigo/livros.json`;
const valorTotal = document.getElementById(`valor_total_livros_disponiveis`);

getLivros();

const lugarInserirLivros = document.getElementById(`livros`); 


async function getLivros(){
    const res = await fetch(endpoitAPI);
    livros = await res.json();
    console.table(livros);
    let livrosDesconto = aplicarDesconto(livros);
    
    livrosNaTela(livrosDesconto); 
}


function livrosNaTela(livrosTela) {
    valorTotal.innerHTML = ``;
    lugarInserirLivros.innerHTML = ``;

    livrosTela.forEach(livroTela => {

        let disponibilidade = livroTela.quantidade > 0 ? `livro__imagens` : `livro__imagens indisponivel`

        lugarInserirLivros.innerHTML += `
            <div class="livro">

                <img class="${disponibilidade}" src="${livroTela.imagem}" alt="${livroTela.alt}" />
                <h2 class="livro__titulo">
                    ${livroTela.titulo}
                </h2>

                <p class="livro__descricao">${livroTela.autor}</p>
                <p class="livro__preco" id="preco">R$${livroTela.preco.toFixed(2)}</p>

                <div class="tags">
                    <span class="tag">${livroTela.categoria}</span>
                </div>

            </div>
        `;
    });
}

function aplicarDesconto(livros) {
    const desconto = 0.3;
    livrosDesconto = livros.map(livro =>{
        return {...livro, preco: livro.preco - (livro.preco * desconto)}
    });

    return livrosDesconto
}

let btns = document.querySelectorAll(`.btn`);
btns.forEach(btn => btn.addEventListener(`click`, filtrarLivros));

function filtrarLivros() {
    const elementoBtn = document.getElementById(this.id);
    const categoria = elementoBtn.value;
    livrosFiltrados = categoria == `disponiveis` ?  filtrarDisponibilidade() :  filtrarCategoria(categoria);
    livrosNaTela(livrosFiltrados);
    if(categoria == `disponiveis`){
        const valorTotal = calcValorTotal(livrosFiltrados);
        exbirValor(valorTotal);
    }
}

function filtrarCategoria(categoria) {
    return livros.filter(livros => livros.categoria == categoria);
}

function filtrarDisponibilidade() {
    return livros.filter(livro => livro.quantidade > 0);
}

function exbirValor(valor) {
    valorTotal.innerHTML = `
        <div class="livros__disponiveis">
            <p>Todos os livros disponíveis por R$ <span id="valor">${valor}</span></p>
        </div>
    `;
}

function calcValorTotal(livroF) {
    return livroF.reduce((acc, livroF) => acc + livroF.preco, 0).toFixed(2);
}

let bntOrdenaPreco = document.getElementById(`btnOrdenarPorPreco`);
bntOrdenaPreco.addEventListener(`click`, ordernarLivros);

function ordernarLivros() {
    let livrosOrdenados = livros.sort((a, b) => a.preco - b.preco);
    livrosNaTela(livrosOrdenados);
}




