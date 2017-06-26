'use strict';

System.register(['../models/Negociacao'], function (_export, _context) {
    "use strict";

    var Negociacao, _createClass, NegociacaoDao;

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    return {
        setters: [function (_modelsNegociacao) {
            Negociacao = _modelsNegociacao.Negociacao;
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

            _export('NegociacaoDao', NegociacaoDao = function () {
                function NegociacaoDao(connection) {
                    _classCallCheck(this, NegociacaoDao);

                    this._connection = connection;
                    this._store = 'negociacoes';
                }

                _createClass(NegociacaoDao, [{
                    key: 'adicionar',
                    value: function adicionar(negociacao) {
                        var _this = this;

                        return new Promise(function (resolve, reject) {
                            var transaction = _this._connection.transaction([_this._store], 'readwrite');
                            var store = transaction.objectStore(_this._store);
                            var request = store.add(negociacao);

                            // #### VAI CANCELAR A TRANSAÇÃO. O evento onerror será chamado.
                            // transaction.abort();// equivalente ao rollback do banco de dados relacional
                            //??? por que nao chama request.onabort ???
                            request.onabort = function (e) {
                                return console.log('Erro ao adicionar (transa\xE7\xE3o abortada): ' + e);
                            };

                            request.onsuccess = function (e) {
                                console.log('PK: ' + e.target.result);
                                negociacao.pk = e.target.result;
                                resolve();
                            };
                            request.onerror = function (e) {
                                return reject(e.target.error.name);
                            };
                        });
                    }
                }, {
                    key: 'listarTodos',
                    value: function listarTodos() {
                        var _this2 = this;

                        return new Promise(function (resolve, reject) {
                            var request = _this2._connection.transaction([_this2._store], 'readonly').objectStore(_this2._store).openCursor();
                            var listaNegociacoes = [];

                            request.onsuccess = function (e) {
                                var negociacaoAtual = e.target.result;
                                if (negociacaoAtual) {
                                    var dados = negociacaoAtual.value;
                                    listaNegociacoes.push(new Negociacao(dados._data, dados._quantidade, dados._valor, negociacaoAtual.primaryKey));
                                    negociacaoAtual.continue();
                                } else {
                                    resolve(listaNegociacoes);
                                }
                            };

                            request.onerror = function (e) {
                                return reject(e.target.error.name);
                            };
                        });
                    }
                }, {
                    key: 'apagarTodas',
                    value: function apagarTodas() {
                        var _this3 = this;

                        return new Promise(function (resolve, reject) {
                            var request = _this3._connection.transaction([_this3._store], 'readwrite').objectStore(_this3._store).clear();

                            request.onsuccess = function (e) {
                                return resolve('Negociações apagadas com sucesso no Indexed-DB');
                            };
                            request.onerror = function (e) {
                                console.log(e.target.error);
                                reject(e.target.error.name);
                            };
                        });
                    }
                }, {
                    key: 'remover',
                    value: function remover(negociacao) {
                        var _this4 = this;

                        return new Promise(function (resolve, reject) {
                            var request = _this4._connection.transaction([_this4._store], 'readwrite').objectStore(_this4._store).delete(negociacao.pk);
                            request.onsuccess = function (e) {
                                return resolve('Negociação removida com sucesso do Indexed-DB');
                            };
                            request.onerror = function (e) {
                                console.error(e);
                                reject(e.target.error.name);
                            };
                        });
                    }
                }]);

                return NegociacaoDao;
            }());

            _export('NegociacaoDao', NegociacaoDao);
        }
    };
});
//# sourceMappingURL=NegociacaoDao.js.map