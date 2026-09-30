/* IndexedDB */
const NOME_BANCO = 'EstacionamentoDB'
const VERSAO_BANCO = 1
const NOME_STORE = 'veiculos'
let banco
/* Elementos do HTML */
const formVeiculo = document.querySelector('#formVeiculo')
const tabelaVeiculos = document.querySelector('#tabelaVeiculos')
const mensagemVazia = document.querySelector('#mensagemVazia')
//getElementById sempre busca apenas no id. O querySelector procura pelo id ou classe CSS


/* Abre o banco e cria a coleção de veículos na 1a execução */
function abrirBanco(){
    return new Promise((resolve, reject) => {
        //reject(new Error('erro de teste como exemplo'))
        const requisicao = indexedDB.open(NOME_BANCO, VERSAO_BANCO)
        requisicao.onupgradeneeded = (evento) => {
            const bancoAtual = evento.target.result
            if(!bancoAtual.objectStoreNames.contains(NOME_STORE)){
                //Se não existir ainda...
                bancoAtual.createObjectStore(NOME_STORE, { keyPath: 'id', autoIncrement: true})
            }
        }
        requisicao.onsuccess = () => resolve(requisicao.result)
        requisicao.onerror = () => reject(requisicao.error)
    })
}
/* Inicializa o banco */
(async function inicializar() {
    try{
        banco = await abrirBanco()
    } catch (erro) {
        console.error('Erro ao abrir o banco', erro)
        Swal.fire('Erro','Não foi possível abrir o banco local', erro)
    }
})()
/* Os parenteses no fim são um IIFE (Immediatily Invoked Function 
Expression) ou seja, a função deve ser executada imediatamente. */