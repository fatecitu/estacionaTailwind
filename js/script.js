/* IndexedDB */
const NOME_BANCO = 'EstacionamentoDB'
const VERSAO_BANCO = 1
const NOME_STORE = 'veiculos'
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
const bancoPronto = abrirBanco()
/* Salva um veiculo */
async function salvarVeiculo(veiculo){
    const banco = await bancoPronto
    return new Promise((resolve, reject) => {
        const requisicao = banco.transaction(NOME_STORE, 'readwrite').objectStore(NOME_STORE).add(veiculo)
        requisicao.onsuccess = () => resolve(requisicao.result)
        requisicao.onerror = () => reject(requisicao.error)
    })
}
/* verifica o submit do formulário*/
formVeiculo.addEventListener('submit', async(evento) => {
    evento.preventDefault() //evita recarregar
    const arquivo = document.querySelector('#foto').files[0]
    const veiculo = {
        marca: document.querySelector('#marca').value,
        modelo: document.querySelector('#modelo').value.trim(),
        ano: Number(document.querySelector('#ano').value),
        preco: Number(document.querySelector('#preco').value),
        eletrico: document.querySelector('#eletrico').checked,
        foto: arquivo || null,
        criadoEm: new Date().toISOString()
    }
    try {
        await salvarVeiculo(veiculo) //tentamos salvar
        formVeiculo.reset() //limpamos o form
        Swal.fire({title:'Cadastrado!',
            text: 'O veiculo foi salvo com sucesso',
            icon: 'success',
            timer: 2000})
    } catch (erro){
        Swal.fire({
            title: 'Erro', 
            text: erro.message||'Não foi possível salvar o veículo.', 
            icon: 'error',
            timer: 6000 //6000ms ou 6s
    })
    }
})

/* Informa falhas na inicialização do banco */
bancoPronto.catch((erro) => {
    console.error('Erro ao abrir o banco', erro)
    Swal.fire('Erro', 'Não foi possível abrir o banco local', 'error')
})
/* Os parenteses no fim são um IIFE (Immediatily Invoked Function 
Expression) ou seja, a função deve ser executada imediatamente. */