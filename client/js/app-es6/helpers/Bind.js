
import {ProxyFactory} from '../services/ProxyFactory';

export class Bind {

    /* REST Operator é análogo ao varargs do java (irá permitir receber infinitos parâmetros)
        e esses infinitos paramtros terão sua representação em um array.
        Só pode ser usado no ultimo paramtro da function, do contrário seria impossível saber quais seriam valores
        dos parametros subsequentes, pois o rest operator vai até o infinito e além
            
            *É uma sintaxee parecida com a do Spread Operator, mas o Spread serve para invocar um método
            passando um array e eis que o Spread irá quebrar o array de forma a criar uma correspondencia
            para todos os paramtros do método/function que foi invocado
    */
    constructor(model, view, /*REST Operator */...props) {
        
        let proxy = ProxyFactory.create(model, props, model => view.update(model));
        view.update(model); //atualizando pela primeira vez

        //em javascript um construtor pode devolvel qualquer 'coisa'
        return proxy; // isso é bizzaro, muito!!
    }
}