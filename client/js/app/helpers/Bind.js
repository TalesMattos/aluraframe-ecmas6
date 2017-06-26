'use strict';

System.register(['../services/ProxyFactory'], function (_export, _context) {
    "use strict";

    var ProxyFactory, Bind;

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    return {
        setters: [function (_servicesProxyFactory) {
            ProxyFactory = _servicesProxyFactory.ProxyFactory;
        }],
        execute: function () {
            _export('Bind', Bind =

            /* REST Operator é análogo ao varargs do java (irá permitir receber infinitos parâmetros)
                e esses infinitos paramtros terão sua representação em um array.
                Só pode ser usado no ultimo paramtro da function, do contrário seria impossível saber quais seriam valores
                dos parametros subsequentes, pois o rest operator vai até o infinito e além
                    
                    *É uma sintaxee parecida com a do Spread Operator, mas o Spread serve para invocar um método
                    passando um array e eis que o Spread irá quebrar o array de forma a criar uma correspondencia
                    para todos os paramtros do método/function que foi invocado
            */
            function Bind(model, view) {
                _classCallCheck(this, Bind);

                for (var _len = arguments.length, props = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
                    props[_key - 2] = arguments[_key];
                }

                var proxy = ProxyFactory.create(model, props, function (model) {
                    return view.update(model);
                });
                view.update(model); //atualizando pela primeira vez

                //em javascript um construtor pode devolvel qualquer 'coisa'
                return proxy; // isso é bizzaro, muito!!
            });

            _export('Bind', Bind);
        }
    };
});
//# sourceMappingURL=Bind.js.map