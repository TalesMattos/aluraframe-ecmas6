
import {View} from './View';

export class MensagemView extends View {

    // não precisei adicionar constructor e nem chamar super! Construtor é herdado também!

    update(model) {
        super.update(model);
               
        let e = this._elemento;
        setTimeout(function() {
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

    template(model) {
        //classes "alert alert-info" são do bootstrap
        // no javascript uma string sem conteudo é avaliada como falso
        return model.texto ? `<p class="alert alert-info">${model.texto}</p>` : `<p></p>`;

    }
}