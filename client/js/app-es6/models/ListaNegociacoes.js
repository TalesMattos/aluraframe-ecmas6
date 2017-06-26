
export class ListaNegociacoes {

    constructor(/*contexto, armadilha*/) {
        //this._contexto = contexto; // somente é usado quando passamos o contexto por function tradicional e não arrow function
        //this._armadilha = armadilha; // Não vamos mais usar armadilha (Observer Pattern) para não poluir o modelo, vamos usar proxy
        this._negociacoes = [];
        // Object.freeze(this); // se não comentar não será possível esvaziar a lista
    }

    add(e) {
        // console.log('adicionando...');

        this._negociacoes.push(e); // trap do proxy não consegue interceptar pois não há atribuição na propriedade _negociacoes 
        //this._negociacoes = [].concat(this._negociacoes, e); //gambiarra para a trap/armadilha do proxy poder interceptar a adição (não deve ser usado, não é performático)

        /*Como a _armadilha foi passada por meio de arrow function, onde o 'this' é estático/léxico 
                ('this' é fixo, ou seja, é o mesmo contexto do objeto ao qual a arrow function está inserida, declarada) 
            e não por meio de uma function normal, onde o 'this' é dinâmico
                ('this' varia de acordo com o contexto ao qual a função é chamada e não declarada)
            então, vamos deixar comentada essa possibilidade
        */
        // API de reflexão do javascript. Recebe: 
        //    a função a ser executada
        //    o contexto em que vai ser executada
        //    array de parametros que será passado junto com a função, no caso o modele (esse objeto atual)
        // Reflect.apply(this._armadilha, this._contexto, [this]);

        //this._armadilha(this); // chama a função armadilha passando o modelo, que é ele mesmo
    }

    remover(index) { 
        if (index >= 0)
            this._negociacoes.splice(index, 1);
    }

    get list() {
        //Programação defensiva: cria um novo array com uma cópia do que foi passado
        return [].concat(this._negociacoes);
    }

    esvazia() {
        console.log('esvaziando...');

        this._negociacoes = [];
        //this._armadilha(this);
    }

    get volumeTotal() {
       // de maneira funcional. reduce() processa o array e retorna um valor
       // o retorno de cada iteração é atribuido a variavel do primeiro parametro da function
       return this._negociacoes.reduce((total, n) => total + n.volume, 0.0); // '0.0' é um parametro que inicializa o total 
    }

    ordena(comparator) {
        this._negociacoes.sort(comparator);
    }

    ordenaReverso() {
        this._negociacoes.reverse();
    }

    static isNegociacaoJaExisteNaLista(listaNegociacoes, negociacao) {
        return listaNegociacoes.some(negociacaoExistente => // varre o array e retorna true se encontrar uma correspondência. quanto encontra já para de percorrer
                negociacao.isEquals(negociacaoExistente) // comparando strings, pq objetos estão apontando para regiões de memória diferentes
                // listaNegociacoes.indexOf(negociacao) == -1)) // indexOf retorna a posição no array ou -1 se não achar (não funciona pq não consegue comparar objetos: estão a)
            );
    }

    static obterPosicaoNegociacaoNLista(listaNegociacoes, negociacao) {
        if (!listaNegociacoes || !negociacao)
            return;
        for (var i = 0; i < listaNegociacoes.length; i++) {
            var negItem = listaNegociacoes[i];
            if (negociacao.isEquals(negItem)) {
                return i;
            }
        }
    }

}