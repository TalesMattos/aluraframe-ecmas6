export class View {

    constructor(elemento) {
        this._elemento = elemento;
    }

    //Não usar métodos private '_'(convenção) na classe pai, uma vez que deseja que ele seja sobrescrito
    template() {
        throw new Error('método _template deve ser implementado na classe filha!');
    }

    update(model) {
        this._elemento.innerHTML = this.template(model);
    }
}