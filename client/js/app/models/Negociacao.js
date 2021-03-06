'use strict';

System.register(['../helpers/DateHelper'], function (_export, _context) {
    "use strict";

    var DateHelper, _createClass, Negociacao;

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    return {
        setters: [function (_helpersDateHelper) {
            DateHelper = _helpersDateHelper.DateHelper;
        }],
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

            _export('Negociacao', Negociacao = function () {
                // Mesmo nome do arquivo para ficar claro, mas não é obrigatório

                /* uso de '_' como prefixo é uma convenção para dizer que determinado atributo só deve ser alterado dentro da class.
                    (Ou seja, é um atributo somente de leitura, uma vez que javascript não possui modificadores de acesso, como o 'private')
                    (É apenas um aviso ao programador: 'Ei, não acesse essa variavel com prefixo '_')
                    Para acessar variáveis com prefixo '_' usar métodos acessadores. São métodos que tem oi prefixo 'get' 
                   */

                function Negociacao(data, quantidade, valor, pk) {
                    _classCallCheck(this, Negociacao);

                    if (pk) this._pk = parseInt(pk);
                    /* Aqui declaramos as propriedades/atributos da classe. Aqui elas serão construídas. Não usar a palavra reservada 'var' como precedente dos atributos */
                    this._data = new Date(data.getTime()); // Programação defensiva (Assim como no Java, OO em JavaScript recebe parâmetros por referência 
                    //   e se a referencia for alterada, também irá alterar o atributo que recebeu a referência)
                    this._quantidade = parseInt(quantidade); // quantidade já é imutavel (não tem método para alterar seu valor, a não ser pela atribuição direta com '=')
                    this._valor = parseFloat(valor); // valor já é imutavel (não tem método para alterar seu valor, a não ser pela atribuição direta com '=')
                    // Object.freeze(this); // torna o objeto imutavel (nem mesmo as variaveis privadas por convenção agora podem ser modificadas)
                    // No entanto, Object.freeze(this) é Shallow, superficial e não consegue imutar o atributa data por exemplo, pois ele também é um objeto
                    //n.data.setDate(1) irá altarar o valor da data (não a data propriamente dita) se não houver uma programação defensiva
                }

                /* esses são métodos (não funções) - chama-se método por conveção,
                    pois está em uma classee também porque não possui a palavra reservada function
                    Exemplo:
                                getData() {
                                    return this._data;
                                }
                    Mas também é possível: usar a palavra reservada 'get' para acessar a propriedade, somente, como leitura.
                    E a sintaxe de chamada não exigirá os '()' e nem o prefixo 'get', será acessada como se fosse uma propriedade da classe
                    */

                _createClass(Negociacao, [{
                    key: 'isEquals',
                    value: function isEquals(outraNegociacao) {

                        // return JSON.stringify(this) == JSON.stringify(outraNegociacao)

                        if (this.pk && outraNegociacao.pk) return this.pk == outraNegociacao.pk;

                        return DateHelper.dataParaTexto(this.data) == DateHelper.dataParaTexto(outraNegociacao.data) && this.quantidade == outraNegociacao.quantidade && this.valor == outraNegociacao.valor;

                        // se só a data e o valor fosse critérios de comparação
                        // return this._data.getTime() == outraNegociacao.data.getTime()
                        //     && this._valor == outraNegociacao.valor;
                    }
                }, {
                    key: 'pk',
                    get: function get() {
                        return this._pk;
                    },
                    set: function set(pk) {
                        this._pk = parseInt(pk);
                    }
                }, {
                    key: 'volume',
                    get: function get() {
                        return this._quantidade * this._valor;
                    }
                }, {
                    key: 'data',
                    get: function get() {
                        return new Date(this._data.getTime()); // Programação defensiva para evitar alteração do valor da data
                    }
                }, {
                    key: 'quantidade',
                    get: function get() {
                        return this._quantidade;
                    }
                }, {
                    key: 'valor',
                    get: function get() {
                        return this._valor;
                    }
                }]);

                return Negociacao;
            }());

            _export('Negociacao', Negociacao);
        }
    };
});
//# sourceMappingURL=Negociacao.js.map