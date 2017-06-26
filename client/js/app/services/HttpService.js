'use strict';

System.register([], function (_export, _context) {
    "use strict";

    var _createClass, HttpService;

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

            _export('HttpService', HttpService = function () {
                function HttpService() {
                    _classCallCheck(this, HttpService);
                }

                _createClass(HttpService, [{
                    key: '_hangleErrors',
                    value: function _hangleErrors(resp) {
                        if (resp.ok) {
                            // se ok é verdadeiro, é porque o status é um valor entre 200 e 299 (válido)
                            return resp;
                        } else {
                            throw new Error('Erro ao obter resposta da requisi\xE7\xE3o ajax. Status: ' + resp.status + ' para URL: ' + resp.url);
                        }
                    }
                }, {
                    key: 'get',
                    value: function get(url) {
                        var _this = this;

                        //usando API de busca nativa do EcmaScript2015 (ou, EcmaScript6): 'Fetch API'
                        // 'fetch' é uma variável que se encontra no escopo global
                        // retorna uma promise
                        console.log('usando Fetch API para requisição ajax... ' + url);
                        return fetch(url).then(function (resp) {
                            return _this._hangleErrors(resp);
                        }).then(function (resp) {
                            return resp.json();
                        }); // resp.json() substitui a necessidade JSON.parse(resp). Poderia ser resp.text() também
                    }
                }, {
                    key: 'post',
                    value: function post(url, dado) {
                        var _this2 = this;

                        return fetch(url, {
                            headers: { 'Content-type': 'application/json' },
                            method: 'POST',
                            body: JSON.stringify(dado)
                        }).then(function (resp) {
                            return _this2._hangleErrors(resp);
                        });
                    }
                }, {
                    key: 'get_OLD',
                    value: function get_OLD(url) {
                        return new Promise(function (resolve, reject) {
                            var xhr = new XMLHttpRequest();
                            xhr.open('GET', url);

                            /*sempre que a requisição mudar de estado esse listener será invocado*/
                            xhr.onreadystatechange = function () {
                                // poderia usar também: xhr.addEventListener('load', () => {...  
                                /* Possíveis estados:
                                    0: Requisição ainda não iniciada
                                    1: Conexão com o servidor estabelecida
                                    2: Requisição recebida no servidor
                                    3: Processando requisição
                                    4: Requisição concluída e resposta pronta (a resposta pode ser um erro também)
                                */
                                if (xhr.readyState == 4) {
                                    if (xhr.status == 200) {
                                        resolve(JSON.parse(xhr.responseText));
                                    } else {
                                        reject(xhr.responseText);
                                    }
                                }
                            };

                            xhr.send();

                            /* Poderia ser assim, mas optamos por: xhr.onreadystatechange = () => { ...
                                    xhr.addEventListener('load', () => { 
                                        if (xhr.status == 200) {
                                            let resposta = xhr.responseText;
                                            console.log(resposta);
                                            let listaNegociacoesImportadas = JSON.parse(resposta);
                                            listaNegociacoesImportadas.forEach(negociacao =>
                                                this._listaNegociacoes.add(new Negociacao(new Date(negociacao.data), negociacao.quantidade, negociacao.valor)) );
                                        } else {
                                            console.log(`response error status: ${xhr.status}`)
                                        }
                                    });
                            */
                        });
                    }
                }, {
                    key: 'post_OLD',
                    value: function post_OLD(url, dado) {

                        return new Promise(function (resolve, reject) {

                            var xhr = new XMLHttpRequest();
                            xhr.open("POST", url, true);
                            xhr.setRequestHeader("Content-type", "application/json");
                            xhr.onreadystatechange = function () {
                                if (xhr.readyState == 4) {
                                    if (xhr.status == 200) {
                                        resolve(JSON.parse(xhr.responseText));
                                    } else {
                                        reject(xhr.responseText);
                                    }
                                }
                            };
                            xhr.send(JSON.stringify(dado)); // usando JSON.stringifly para converter objeto em uma string no formato JSON.
                        });
                    }
                }]);

                return HttpService;
            }());

            _export('HttpService', HttpService);
        }
    };
});
//# sourceMappingURL=HttpService.js.map