"use strict";

System.register([], function (_export, _context) {
    "use strict";

    var _typeof, _createClass, ProxyFactory;

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    return {
        setters: [],
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

            _export("ProxyFactory", ProxyFactory = function () {
                function ProxyFactory() {
                    _classCallCheck(this, ProxyFactory);
                }

                _createClass(ProxyFactory, null, [{
                    key: "create",
                    value: function create(objeto /*model*/, props /*as prop serão interceptadas*/, acao /*armadilha*/) {

                        return new Proxy(objeto, {
                            get: function get(target, prop, receiver) {
                                if (props.includes(prop) && ProxyFactory._ehFuncao(target[prop])) {
                                    return function () {
                                        var retApply = Reflect.apply(target[prop], target, arguments);
                                        acao(target);
                                        return retApply;
                                    };
                                }
                                return Reflect.get(target, prop, receiver);
                            },
                            set: function set(target, prop, value, receiver) {
                                var retSet = Reflect.set(target, prop, value, receiver);
                                if (props.includes(prop)) acao(target);
                                return retSet;
                            }
                        });
                    }
                }, {
                    key: "_ehFuncao",
                    value: function _ehFuncao(funcao) {
                        return (typeof funcao === "undefined" ? "undefined" : _typeof(funcao)) == (typeof Function === "undefined" ? "undefined" : _typeof(Function));
                    }
                }]);

                return ProxyFactory;
            }());

            _export("ProxyFactory", ProxyFactory);
        }
    };
});
//# sourceMappingURL=ProxyFactory.js.map