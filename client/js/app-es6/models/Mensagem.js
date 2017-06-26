export class Mensagem {

    constructor(texto='') { // valor padrão se nada for informado para o construtor
        this._texto = texto;
    }

    get texto() {
        return this._texto;
    }

    // msg.texto = 'x'; ou msg.texto('y');
    set texto(texto) {
        this._texto = texto;
    }
}