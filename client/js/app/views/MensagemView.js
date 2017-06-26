'use strict';

System.register(['./View'], function (_export, _context) {
    "use strict";

    var View, _createClass, _get, MensagemView;

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

            _get = function get(object, property, receiver) {
                if (object === null) object = Function.prototype;
                var desc = Object.getOwnPropertyDescriptor(object, property);

                if (desc === undefined) {
                    var parent = Object.getPrototypeOf(object);

                    if (parent === null) {
                        return undefined;
                    } else {
                        return get(parent, property, receiver);
                    }
                } else if ("value" in desc) {
                    return desc.value;
                } else {
                    var getter = desc.get;

                    if (getter === undefined) {
                        return undefined;
                    }

                    return getter.call(receiver);
                }
            };

            _export('MensagemView', MensagemView = function (_View) {
                _inherits(MensagemView, _View);

                function MensagemView() {
                    _classCallCheck(this, MensagemView);

                    return _possibleConstructorReturn(this, (MensagemView.__proto__ || Object.getPrototypeOf(MensagemView)).apply(this, arguments));
                }

                _createClass(MensagemView, [{
                    key: 'update',
                    value: function update(model) {
                        _get(MensagemView.prototype.__proto__ || Object.getPrototypeOf(MensagemView.prototype), 'update', this).call(this, model);

                        var e = this._elemento;
                        setTimeout(function () {
                            //console.log('veja quem é this no contexto dinâmico de uma function tradiciona ao exibir uma mensagem...');
                            //console.log(this);
                            //this._elemento.innerHTML = ''; // ERRO ('this' não é mais o contexto de MensagemView)
                            //e.innerHTML = ''; // OK
                        }, 1);

                        // Arrow Function tem o 'this' estático/lexico, ou seja, ele é fixo
                        //  e se refere ao contexto ao qual foi declarado (não na chamada tempo de execução), nesse caso: MensagemView
                        // por isso é possível acessar a propriedade this._elemento que está na classe pai View
                        // com a function tradicional não é possível, pois ela tem contexto dinâmico,
                        //  e nesse caso, o 'this' dentro da function tradicional já não é mais o 'this' de MensagemView,
                        //  pois é o 'this' dinâmico referente ao momento em que a função foi chamada, e não declarada
                        // setTimeout(() =>  this._elemento.innerHTML = '', 5000);
                    }
                }, {
                    key: 'template',
                    value: function template(model) {
                        //classes "alert alert-info" são do bootstrap
                        // no javascript uma string sem conteudo é avaliada como falso
                        return model.texto ? '<p class="alert alert-info">' + model.texto + '</p>' : '<p></p>';
                    }
                }]);

                return MensagemView;
            }(View));

            _export('MensagemView', MensagemView);
        }
    };
});
//# sourceMappingURL=MensagemView.js.map