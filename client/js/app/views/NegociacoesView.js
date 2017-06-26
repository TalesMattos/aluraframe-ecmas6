'use strict';

System.register(['./View', '../helpers/DateHelper', '../models/Negociacao', '../controllers/NegociacaoController'], function (_export, _context) {
    "use strict";

    var View, DateHelper, Negociacao, currentInstance, _createClass, NegociacoesView;

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    function _possibleConstructorReturn(self, call) {
        if (!self) {
            throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
        }

        return call && (typeof call === "object" || typeof call === "function") ? call : self;
    }

    function _inherits(subClass, superClass) {
        if (typeof superClass !== "function" && superClass !== null) {
            throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
        }

        subClass.prototype = Object.create(superClass && superClass.prototype, {
            constructor: {
                value: subClass,
                enumerable: false,
                writable: true,
                configurable: true
            }
        });
        if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
    }

    return {
        setters: [function (_View2) {
            View = _View2.View;
        }, function (_helpersDateHelper) {
            DateHelper = _helpersDateHelper.DateHelper;
        }, function (_modelsNegociacao) {
            Negociacao = _modelsNegociacao.Negociacao;
        }, function (_controllersNegociacaoController) {
            currentInstance = _controllersNegociacaoController.currentInstance;
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

            _export('NegociacoesView', NegociacoesView = function (_View) {
                _inherits(NegociacoesView, _View);

                function NegociacoesView(elemento) {
                    _classCallCheck(this, NegociacoesView);

                    var _this = _possibleConstructorReturn(this, (NegociacoesView.__proto__ || Object.getPrototypeOf(NegociacoesView)).call(this, elemento));

                    //usando event bubbling
                    elemento.addEventListener('click', function (event) {
                        if (event.target.nodeName == 'TH') {
                            currentInstance().ordena(event.target.textContent.toLowerCase());
                        }
                    });

                    _this._removerNegociacaoTR(elemento);

                    return _this;
                }

                _createClass(NegociacoesView, [{
                    key: '_removerNegociacaoTR',
                    value: function _removerNegociacaoTR(elemento) {

                        elemento.addEventListener('dblclick', function (ev) {
                            if (ev.target.nodeName == 'TD') {
                                var trNegociacao = ev.target.parentNode;

                                var tdsNeg = trNegociacao.querySelectorAll('td');
                                console.log(tdsNeg[0].textContent);
                                var negociacao = new Negociacao(DateHelper.textoParaData(tdsNeg[1].textContent.split('/').reverse().join('-')), tdsNeg[2].textContent, tdsNeg[3].textContent, tdsNeg[0].textContent);
                                currentInstance().remover(negociacao).then(function (ret) {
                                    trNegociacao.classList.add("fadeOut");
                                    setTimeout(function () {
                                        trNegociacao.remove();
                                    }, 500);
                                }).catch(function (err) {
                                    return console.error(err);
                                });
                            }
                        });
                    }
                }, {
                    key: 'template',
                    value: function template(model) {
                        // model é a lista de negociacoes (ListaNegociacoes)
                        return '\n            <table class="table table-hover table-bordered">\n                <thead>\n                    <tr>\n                        <th>PK</th>\n                        <th>DATA</th>\n                        <th>QUANTIDADE</th>\n                        <th>VALOR</th>\n                        <th>VOLUME</th>\n                        \n                        <!-- <th onclick="negociacaoCtrl.ordena(\'data\')">DATA</th> -->\n                        <!-- <th onclick="negociacaoCtrl.ordena(\'quantidade\')">QUANTIDADE</th> -->\n                        <!-- <th onclick="negociacaoCtrl.ordena(\'valor\')">VALOR</th> -->\n                        <!-- <th onclick="negociacaoCtrl.ordena(\'volume\')">VOLUME</th> -->\n                    </tr>\n                </thead>\n                \n                <tbody>\n                    ' + model.list.map(function (n) {
                            return '\n                                <tr>\n                                    <td>' + n.pk + '</td>\n                                    <td>' + DateHelper.dataParaTexto(n.data) + '</td>\n                                    <td>' + n.quantidade + '</td>\n                                    <td>' + n.valor + '</td>\n                                    <td>' + n.volume + '</td>\n                                </tr>\n                        ';
                        }).join('') + '\n                </tbody>\n\n                <tfoot>\n                    <td colspan="4"></td>\n                    <!--\n                            <td>' + //não é possivel inserir varias instruções dentro de uma expreção template string
                        // por isso aqui usamo a estrategia da função auto-invocada,
                        // a function fica dentro de parenteses e depois por fora abre e fecha parenteses para auto invocar
                        function () {
                            var total = 0;
                            model.list.forEach(function (n) {
                                return total += n.volume;
                            });
                            return total;
                        }() // Immediately-invoked function expression (IIFE) ou a função imediata (função auto-invocada)
                        + '\n                            </td>\n                            <td>' + // de maneira funcional. reduce() processa o array e retorna um valor
                        // o retorno de cada iteração é atribuido a variavel do primeiro parametro da function
                        model.list.reduce(function (total, n) {
                            return total + n.volume;
                        }, 0.0) // '0.0' é um parametro que inicializa o total         
                        + '\n                            </td>\n                    -->\n                    <td>\n                        ' + model.volumeTotal /*mais orientado a objeto. a totalização vai para o modelo calcular*/ + '      \n                    </td>\n                </tfoot>\n            </table>\n        ';
                    }
                }]);

                return NegociacoesView;
            }(View));

            _export('NegociacoesView', NegociacoesView);
        }
    };
});
//# sourceMappingURL=NegociacoesView.js.map