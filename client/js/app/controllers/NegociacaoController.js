'use strict';

System.register(['../models/ListaNegociacoes', '../models/Mensagem', '../models/Negociacao', '../views/NegociacoesView', '../views/MensagemView', '../helpers/DateHelper', '../helpers/Bind', '../services/NegociacaoService'], function (_export, _context) {
    "use strict";

    var ListaNegociacoes, Mensagem, Negociacao, NegociacoesView, MensagemView, DateHelper, Bind, NegociacaoService, _typeof, _createClass, NegociacaoController, negociacaoCtrl;

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    return {
        setters: [function (_modelsListaNegociacoes) {
            ListaNegociacoes = _modelsListaNegociacoes.ListaNegociacoes;
        }, function (_modelsMensagem) {
            Mensagem = _modelsMensagem.Mensagem;
        }, function (_modelsNegociacao) {
            Negociacao = _modelsNegociacao.Negociacao;
        }, function (_viewsNegociacoesView) {
            NegociacoesView = _viewsNegociacoesView.NegociacoesView;
        }, function (_viewsMensagemView) {
            MensagemView = _viewsMensagemView.MensagemView;
        }, function (_helpersDateHelper) {
            DateHelper = _helpersDateHelper.DateHelper;
        }, function (_helpersBind) {
            Bind = _helpersBind.Bind;
        }, function (_servicesNegociacaoService) {
            NegociacaoService = _servicesNegociacaoService.NegociacaoService;
        }],
        execute: function () {
            _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
                return typeof obj;
            } : function (obj) {
                return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
            };

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

            NegociacaoController = function () {

                //É mais performático criar propriedades de classe para buscar elementos no DOM
                // se estivessem buscando dentro do método adicion(), por ex., iria percorrer o DOM tantas vezes quanto o botão fosse acionado
                // buscar elementos no DOM é custoso
                function NegociacaoController() {
                    _classCallCheck(this, NegociacaoController);

                    //.bind diz para o método querySelector manter uma associação com document quando for atribuído ao $
                    var $ = document.querySelector.bind(document);

                    this._inputData = $("#data");
                    this._inputQuantidade = $("#quantidade");
                    this._inputValor = $("#valor");

                    /*Como a _armadilha foi passada por meio de arrow function, onde o 'this' é estático/léxico 
                            ('this' é fixo, ou seja, é o mesmo contexto do objeto ao qual a arrow function está inserida) 
                        e não por meio de uma function normal, onde o 'this' é dinâmico
                            ('this' varia de acordo com o contexto ao qual a função é chamada)
                        então, vamos deixar comentada essa possibilidade
                    */
                    //'this' é dinâmico, varia com o contexto, por isso é necessário enviar 
                    //  'this' (NegociacaoController) como parametro, sinalizando qual deve ser o contexto dentro da function
                    // Será necessário usar API de reflexão para invocar a função armadilha, nesse modo
                    //primeiro param: 'this' é o contexto em que a função vai ser executada
                    /*
                        this._listaNegociacoes = new ListaNegociacoes(this, function(model) {
                            console.log(this); 
                            this._negociacoesView.update(this._listaNegociacoes);
                        });
                    */
                    /* Assim funciona bem também (variável auxiliar para this)
                        let self = this;
                        this._listaNegociacoes = new ListaNegociacoes(function(model) { 
                            self._negociacoesView.update(model);
                        });
                    */
                    // com Arrow Function o 'this' é fixo, e considera o contexto atual para executar dentro da função armadilha
                    /* - Não vamos mais usar armadilha (Observer), vamos usar Proxy para não poluir o modelo com armadilhas
                        this._listaNegociacoes = new ListaNegociacoes(model =>
                                this._negociacoesView.update(this._listaNegociacoes));
                    /* com uso de Proxy (muito verbos)
                        let self = this;
                        this._listaNegociacoes = new Proxy(new ListaNegociacoes(), {}
                            //handler(contém as armadilhas/trap)
                            get(target, prop, receiver) {
                                if (['add', 'esvazia'].includes(prop) && typeof(target[prop]) == typeof(Function)) {
                                    return function() {
                                        //target: _listaNegociacoes
                                        //prop: add ou esvazia
                                        //receiver: referencia ao próprio proxy 
                                        console.log(`interceptando ${prop}`);
                                        Reflect.apply(target[prop], target, arguments); //arguments é um objeto implicito que contem todos os parametros/argumentos da chamada
                                        self._negociacoesView.update(target); //nem com arrow function seria possivel acessar o contexto desse controller
                                    }
                                }
                                return Reflect.get(target, prop, receiver);
                            }
                        });
                    */

                    // Vamos usar o pattern factory com ProxyFactory.js. Também vamos usar com Bind.js para fazer associação entre modelo e view
                    // Bind deixa claro que é para fazer uma associação entre o modelo e a view quando alguns métodos forem invocados
                    this._listaNegociacoes = new Bind(new ListaNegociacoes(), new NegociacoesView($('#idNegociacoesView')), 'add', 'esvazia', 'remover', 'ordena', 'ordenaReverso');

                    this._mensagem = new Bind(new Mensagem(), new MensagemView($("#idMensagemView")), 'texto');

                    this._ordemAtualNegociacoes = '';

                    this._negociacaoService = new NegociacaoService();

                    this._init();
                }

                _createClass(NegociacaoController, [{
                    key: '_init',
                    value: function _init() {

                        this._listarNegociacoesIDB();

                        // setInterval(() => this.importaNegociacoes(), 10000);
                    }
                }, {
                    key: 'importaNegociacoes',
                    value: function importaNegociacoes() {
                        var _this = this;

                        this._negociacaoService.importa(this._listaNegociacoes.list).then(function (negociacoes) {
                            negociacoes.forEach(function (negociacao) {
                                return _this.adicionar(negociacao);
                            });
                            if (negociacoes.length > 0) _this._mensagem.texto = 'Negociações foram importadas com sucesso';else _this._mensagem.texto = 'Não existe negociações para importar ou elas já foram importadas';
                        }).catch(function (e) {
                            return _this._mensagem.texto = e.message;
                        });
                    }
                }, {
                    key: 'apaga',
                    value: function apaga() {
                        var _this2 = this;

                        if (this._listaNegociacoes.list.length == 0) {
                            this._mensagem.texto = 'Não existe negociação para ser apagada';
                        } else {
                            this._negociacaoService.apagarLista().then(function (msg) {
                                console.log(msg);
                                _this2._listaNegociacoes.esvazia();
                                _this2._mensagem.texto = 'As negociações foram apagadas com sucesso';
                            }).catch(function (e) {
                                return _this2._mensagem.texto = e;
                            });
                        }
                    }
                }, {
                    key: 'remover',
                    value: function remover(negociacao) {
                        var _this3 = this;

                        return this._negociacaoService.remover(negociacao).then(function (msg) {
                            var posNaLista = ListaNegociacoes.obterPosicaoNegociacaoNLista(_this3._listaNegociacoes.list, negociacao);
                            console.log(posNaLista + ' posição');
                            if (posNaLista >= 0) {
                                //timeout para dar tempo de animar com fadeOut antes de chamar update da view via Bind (gambiarra)
                                setTimeout(function () {
                                    return _this3._listaNegociacoes.remover(posNaLista);
                                }, 550);
                                _this3._mensagem.texto = 'A negociação foi apagada com sucesso';
                            }
                        }).catch(function (e) {
                            _this3._mensagem.texto = e.message;
                            throw new Error(e.message);
                        });
                    }
                }, {
                    key: '_listarNegociacoesIDB',
                    value: function _listarNegociacoesIDB() {
                        var _this4 = this;

                        this._negociacaoService.listar().then(function (lista) {
                            return lista.forEach(function (n) {
                                return _this4._listaNegociacoes.add(n);
                            });
                        })
                        // .then(() => console.log('!@#$%¨-------1')) // pode encadear quantos 'then' quiser para a mesma promise
                        // .then(() => console.log('!@#$%¨-------2'))
                        .catch(function (e) {
                            return _this4._mensagem.texto = e;
                        });
                    }
                }, {
                    key: 'adicionar',
                    value: function adicionar(negociacao) {
                        var _this5 = this;

                        if (ListaNegociacoes.isNegociacaoJaExisteNaLista(this._listaNegociacoes.list, negociacao)) {
                            this._mensagem.texto = 'Essa negociação já existe: ' + negociacao;
                            return false;
                        }

                        return this._negociacaoService.cadastrar(negociacao).then(function (ok) {
                            if (ok) {
                                console.log('Negociação adicionada ao Indexed-DB com sucesso');
                                _this5._listaNegociacoes.add(negociacao);
                                return true;
                            } else {
                                return false;
                            }
                        }).catch(function (erro) {
                            return _this5._mensagem.texto = 'Erro ao adicionar Negocia\xE7\xE3o: ' + erro;
                        });
                    }
                }, {
                    key: 'adiciona',
                    value: function adiciona(event) {
                        var _this6 = this;

                        event.preventDefault();
                        var negociacao = this._criarNegociacaoViaInputs();
                        this.adicionar(negociacao).then(function (ok) {
                            if (ok) {
                                _this6._mensagem.texto = 'Negociação adicionada com sucesso!';
                                _this6._limpaFormulario();
                            } else {
                                _this6._mensagem.texto = 'Erro ao adicionar negociação na lista!';
                            }
                        });

                        /*######### testes*/
                        var negociacao2 = null;
                        try {
                            negociacao2 = this._criarNegociacaoViaInputs();
                        } catch (erro) {
                            this._mensagem.texto = 'Erro ao criar Negocia\xE7\xE3o: ' + erro;
                            return;
                        }
                        console.log(['2016', '10', '25'].join(','));
                        console.log(new Date(2016, 8, 30));
                        // Encontre todos os '-' na string e substitua por ','
                        console.log('2016-10-25'.replace(/-/g, ',')); //RegExp em JavaScript fica entre 2 '/' ('/regex/'). 'g' é referente à global
                        //data vem no formato yyyy-mm-dd. Exemplo: '2016-10-22'
                        console.log(_typeof(this._inputData.value) + " " + this._inputData.value);
                        this._listaNegociacoes.list.length = 0; // não vai atingir a lista de _listaNegociacoes (programado defensivamente)
                        this._listaNegociacoes.list.push(negociacao2); // não vai atingir a lista de _listaNegociacoes (programado defensivamente)
                        var dataConcatDiaMesAno = DateHelper.dataParaTexto(negociacao2.data);
                        console.log('Data concatenada: ' + dataConcatDiaMesAno);
                        console.log(this._listaNegociacoes.list);
                    }
                }, {
                    key: '_criarNegociacaoViaInputs',
                    value: function _criarNegociacaoViaInputs() {
                        return new Negociacao(DateHelper.textoParaData(this._inputData.value), parseInt(this._inputQuantidade.value), parseFloat(this._inputValor.value));
                    }
                }, {
                    key: '_limpaFormulario',
                    value: function _limpaFormulario() {
                        console.log('limpando formulário...');
                        this._inputData.value = '';
                        this._inputQuantidade.value = 1;
                        this._inputValor.value = 0.0;
                        this._inputData.focus();
                    }
                }, {
                    key: 'ordena',
                    value: function ordena(coluna) {
                        // Não podemos fazer a.quantidade ou a.data, 
                        // porque a propriedade usada no critério de ordenação é escolhida pelo usuário. 
                        // Sendo assim, usamos a sintaxe objeto[nomePropriedade] para acessar a propriedade do objeto
                        if (this._ordemAtualNegociacoes == coluna) this._listaNegociacoes.ordenaReverso();else this._listaNegociacoes.ordena(function (a, b) {
                            return a[coluna] - b[coluna];
                        });
                        this._ordemAtualNegociacoes = coluna;
                    }
                }]);

                return NegociacaoController;
            }();

            negociacaoCtrl = new NegociacaoController();
            function currentInstance() {
                return negociacaoCtrl;
            }

            _export('currentInstance', currentInstance);
        }
    };
});
//# sourceMappingURL=NegociacaoController.js.map