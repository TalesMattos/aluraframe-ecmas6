
export class ProxyFactory {

    static create(objeto/*model*/, props/*as prop serão interceptadas*/, acao/*armadilha*/) {
        
        return new Proxy(objeto, { 
            get(target, prop, receiver) {
                if (props.includes(prop) && ProxyFactory._ehFuncao(target[prop])) {
                    return function() {
                        let retApply = Reflect.apply(target[prop], target, arguments);
                        acao(target);
                        return retApply;
                    }
                }
                return Reflect.get(target, prop, receiver);
            },

            set(target, prop, value, receiver) {
                let retSet = Reflect.set(target, prop, value, receiver);
                if (props.includes(prop))
                    acao(target);
                return retSet;
            }
        });
    }

    static _ehFuncao(funcao) {
        return typeof(funcao) == typeof(Function);
    }
}