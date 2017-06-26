"use strict";

System.register([], function (_export, _context) {
    "use strict";

    var _createClass, DateHelper;

    function _toConsumableArray(arr) {
        if (Array.isArray(arr)) {
            for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) {
                arr2[i] = arr[i];
            }

            return arr2;
        } else {
            return Array.from(arr);
        }
    }

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

            _export("DateHelper", DateHelper = function () {
                function DateHelper() {
                    _classCallCheck(this, DateHelper);

                    throw new Error("DateHelper não pode ser instanciada!");
                }

                /* texto deve estar no formato: 'yyyy-MM-dd' */


                _createClass(DateHelper, null, [{
                    key: "textoParaData",
                    value: function textoParaData(texto) {
                        if (!/^\d{4}-\d{1,2}-\d{1,2}$/.test(texto)) throw new Error("data deve estar no formato aaaa-mm-dd: " + texto);

                        return new (Function.prototype.bind.apply(Date, [null].concat(_toConsumableArray(texto
                        //cria um array separando pelo caracter ou string informada
                        .split('-')
                        //.map percorre cada item do array para trata-lo
                        //Arrow function: não utiliza a palavra reservada 'function' e usa a flecha '=>' após os parametros
                        // se for uma única expressão (1 linha) na Arrow function, não é necessário chaves nem de return (pode suprimir porque é incluido implicitamente)
                        //Ex.: map((item, index) => item - 1  (menos verboso)
                        .map(function (item, index) {
                            if (index == 1) return item - 1; // decrementa o mes pois quando passa para o construtor de Date ele entente que os meses são de 0 à 11
                            else return item;
                        })))))();
                    }
                }, {
                    key: "dataParaTexto",
                    value: function dataParaTexto(data) {
                        //Usando Template String com 'backtick ou cráse(``)' (evita concatenação com '+' fazendo interpolação automaticamente nas expressões)
                        return data.getDate() + "/" + (data.getMonth() + 1) + "/" + data.getFullYear();
                    }
                }]);

                return DateHelper;
            }());

            _export("DateHelper", DateHelper);
        }
    };
});
//# sourceMappingURL=DateHelper.js.map