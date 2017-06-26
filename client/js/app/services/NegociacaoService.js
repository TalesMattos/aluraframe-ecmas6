'use strict';

System.register(['./HttpService', './ConnectionFactory', '../dao/NegociacaoDao', '../models/Negociacao', '../models/ListaNegociacoes'], function (_export, _context) {
    "use strict";

    var HttpService, ConnectionFactory, NegociacaoDao, Negociacao, ListaNegociacoes, _createClass, NegociacaoService;

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    return {
        setters: [function (_HttpService) {
            HttpService = _HttpService.HttpService;
        }, function (_ConnectionFactory) {
            ConnectionFactory = _ConnectionFactory.ConnectionFactory;
        }, function (_daoNegociacaoDao) {
            NegociacaoDao = _daoNegociacaoDao.NegociacaoDao;
        }, function (_modelsNegociacao) {
            Negociacao = _modelsNegociacao.Negociacao;
        }, function (_modelsListaNegociacoes) {
            ListaNegociacoes = _modelsListaNegociacoes.ListaNegociacoes;
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

            _export('NegociacaoService', NegociacaoService = function () {
                function NegociacaoService() {
                    _classCallCheck(this, NegociacaoService);

                    this._httpService = new HttpService();
                }

                _createClass(NegociacaoService, [{
                    key: 'obterNegociacoesDaSemana',
                    value: function obterNegociacoesDaSemana() {

                        return this._httpService.get('negociacoes/semana') //ou url poderia ser http://localhost:3000/negociacoes/anterior (como é uma chamada local pode omitir http://localhost:3000/)
                        .then(function (negociacoesJSON) {
                            // ao invés de passar o resultado para resolve(...) estamos retornando o resultado
                            // pois assim poderemos encadear com a nova chama a função 'then' lá no NegociacaoController.js
                            return negociacoesJSON.map(function (negociacaoJSON) {
                                return new Negociacao(new Date(negociacaoJSON.data), negociacaoJSON.quantidade, negociacaoJSON.valor);
                            });
                        }).catch(function (erro) {
                            console.log(erro);
                            // atirar o erro fará com que o erro seja encadeado na próxima chamada a de 'catch' no NegociacaoController.js
                            throw new Error('Não foi possível importar as negociações da semana atual. ' + erro.message);
                        });
                    }
                }, {
                    key: 'obterNegociacoesDaSemanaAnterior',
                    value: function obterNegociacoesDaSemanaAnterior() {

                        return this._httpService.get('negociacoes/anterior').then(function (negociacoesJSON) {
                            return negociacoesJSON.map(function (negociacaoJSON) {
                                return new Negociacao(new Date(negociacaoJSON.data), negociacaoJSON.quantidade, negociacaoJSON.valor);
                            });
                        }).catch(function (erro) {
                            console.log(erro);
                            throw new Error('Não foi possível importar as negociações da semana anterior. ' + erro.message);
                        });
                    }
                }, {
                    key: 'obterNegociacoesDaSemanaRetrasada',
                    value: function obterNegociacoesDaSemanaRetrasada() {

                        return this._httpService.get('negociacoes/retrasada').then(function (negociacoesJSON) {
                            return negociacoesJSON.map(function (negociacaoJSON) {
                                return new Negociacao(new Date(negociacaoJSON.data), negociacaoJSON.quantidade, negociacaoJSON.valor);
                            });
                        }).catch(function (erro) {
                            console.log(erro);
                            throw new Error('Não foi possível importar as negociações da semana retrasada. ' + erro.message);
                        });
                    }
                }, {
                    key: 'obterNegociacoes',
                    value: function obterNegociacoes() {
                        //ES6 suporta nativamente promises:

                        //encadeia várias promises e as executas na ordem estabeleciada. 
                        //Não há mais o problema das promises disparadas separadamente, uma vez que elas são assíncronas
                        return Promise.all([this.obterNegociacoesDaSemana(), this.obterNegociacoesDaSemanaAnterior(), this.obterNegociacoesDaSemanaRetrasada()]).then(function (negociacoesResolve) {
                            //recebe o que foi passado para 'resolve' (os acumulados das várias promises = um array de arrays)
                            var negociacoes = negociacoesResolve.reduce(function (arrayConcat, array) {
                                return arrayConcat.concat(array);
                            }, [] /*inicialização de arrayConcat*/);
                            return negociacoes;
                        }).catch(function (erro) {
                            throw new Error(erro.message);
                        });
                    }
                }, {
                    key: 'cadastrar',
                    value: function cadastrar(negociacao) {

                        return ConnectionFactory.getConnection().then(function (conn) {
                            return new NegociacaoDao(conn);
                        }).then(function (dao) {
                            return dao.adicionar(negociacao);
                        }).then(function () {
                            return true;
                        }).catch(function (erro) {
                            console.log(erro);
                            throw new Error('Erro ao adicionar a negociação no Indexed-DB');
                        });
                    }
                }, {
                    key: 'listar',
                    value: function listar() {
                        return ConnectionFactory.getConnection().then(function (conn) {
                            return new NegociacaoDao(conn);
                        }).then(function (dao) {
                            return dao.listarTodos();
                        }).catch(function (e) {
                            console.log(e);
                            throw new Error('Não foi possível listar as negociações');
                        });
                    }
                }, {
                    key: 'apagarLista',
                    value: function apagarLista() {
                        return ConnectionFactory.getConnection().then(function (conn) {
                            return new NegociacaoDao(conn);
                        }).then(function (dao) {
                            return dao.apagarTodas();
                        }).catch(function (e) {
                            console.log(e);
                            throw new Error('Não foi possível apagar as negociações');
                        });
                    }
                }, {
                    key: 'remover',
                    value: function remover(negociacao) {
                        return ConnectionFactory.getConnection().then(function (conn) {
                            return new NegociacaoDao(conn);
                        }).then(function (dao) {
                            return dao.remover(negociacao);
                        }).catch(function (err) {
                            throw new Error('Não foi possível remover a negociação id: ' + negociacao.pk + '. ' + err.message);
                        });
                    }
                }, {
                    key: 'importa',
                    value: function importa(listaAtual) {
                        return this.obterNegociacoes().then(function (negociacoes) {
                            return negociacoes.filter(function (negociacao) {
                                return (// o filter elimina os itens que retornarem false na função
                                    // se não encontrou, então pode importar, pode manter no array (por isso a negação)
                                    !ListaNegociacoes.isNegociacaoJaExisteNaLista(listaAtual, negociacao)
                                );
                            });
                        }).catch(function (erro) {
                            console.log(erro);
                            throw new Error(erro.message);
                        });
                    }
                }]);

                return NegociacaoService;
            }());

            _export('NegociacaoService', NegociacaoService);
        }
    };
});
//# sourceMappingURL=NegociacaoService.js.map