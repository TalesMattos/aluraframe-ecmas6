'use strict';

System.register([], function (_export, _context) {
    "use strict";

    var _createClass, ListaNegociacoes;

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    return {
        setters: [],
        execute: function () {
            _createClass = function () {
                function defineProperties(target, props) {
                    for (var i = 0; i < props.length; i++) {
                        var descriptor = props[i];
                        descriptor.enumerable = descriptor.enumerable || false;
                        descriptor.configurable = true;
                        if ("value" in descriptor) descriptor.writable = true;
                        Object.defineProperty(target, descriptor.key, descriptor);
                    }
                }

                return function (Constructor, protoProps, staticProps) {
                    if (protoProps) defineProperties(Constructor.prototype, protoProps);
                    if (staticProps) defineProperties(Constructor, staticProps);
                    return Constructor;
                };
            }();

            _export('ListaNegociacoes', ListaNegociacoes = function () {
                function ListaNegociacoes() /*contexto, armadilha*/{
                    _classCallCheck(this, ListaNegociacoes);

                    //this._contexto = contexto; // somente é usado quando passamos o contexto por function tradicional e não arrow function
                    //this._armadilha = armadilha; // Não vamos mais usar armadilha (Observer Pattern) para não poluir o modelo, vamos usar proxy
                    this._negociacoes = [];
                    // Object.freeze(this); // se não comentar não será possível esvaziar a lista
                }

                _createClass(ListaNegociacoes, [{
                    key: 'add',
                    value: function add(e) {
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
                }, {
                    key: 'remover',
                    value: function remover(index) {
                        if (index >= 0) this._negociacoes.splice(index, 1);
                    }
                }, {
                    key: 'esvazia',
                    value: function esvazia() {
                        console.log('esvaziando...');

                        this._negociacoes = [];
                        //this._armadilha(this);
                    }
                }, {
                    key: 'ordena',
                    value: function ordena(comparator) {
                        this._negociacoes.sort(comparator);
                    }
                }, {
                    key: 'ordenaReverso',
                    value: function ordenaReverso() {
                        this._negociacoes.reverse();
                    }
                }, {
                    key: 'list',
                    get: function get() {
                        //Programação defensiva: cria um novo array com uma cópia do que foi passado
                        return [].concat(this._negociacoes);
                    }
                }, {
                    key: 'volumeTotal',
                    get: function get() {
                        // de maneira funcional. reduce() processa o array e retorna um valor
                        // o retorno de cada iteração é atribuido a variavel do primeiro parametro da function
                        return this._negociacoes.reduce(function (total, n) {
                            return total + n.volume;
                        }, 0.0); // '0.0' é um parametro que inicializa o total 
                    }
                }], [{
                    key: 'isNegociacaoJaExisteNaLista',
                    value: function isNegociacaoJaExisteNaLista(listaNegociacoes, negociacao) {
                        return listaNegociacoes.some(function (negociacaoExistente) {
                            return (// varre o array e retorna true se encontrar uma correspondência. quanto encontra já para de percorrer
                                negociacao.isEquals(negociacaoExistente)
                            );
                        } // comparando strings, pq objetos estão apontando para regiões de memória diferentes
                        // listaNegociacoes.indexOf(negociacao) == -1)) // indexOf retorna a posição no array ou -1 se não achar (não funciona pq não consegue comparar objetos: estão a)
                        );
                    }
                }, {
                    key: 'obterPosicaoNegociacaoNLista',
                    value: function obterPosicaoNegociacaoNLista(listaNegociacoes, negociacao) {
                        if (!listaNegociacoes || !negociacao) return;
                        for (var i = 0; i < listaNegociacoes.length; i++) {
                            var negItem = listaNegociacoes[i];
                            if (negociacao.isEquals(negItem)) {
                                return i;
                            }
                        }
                    }
                }]);

                return ListaNegociacoes;
            }());

            _export('ListaNegociacoes', ListaNegociacoes);
        }
    };
});
//# sourceMappingURL=ListaNegociacoes.js.map