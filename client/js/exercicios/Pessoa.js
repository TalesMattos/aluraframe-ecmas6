import {ContaCorrente} from './ContaCorrente';
import {ContaPoupanca} from './ContaPoupanca';

class Pessoa {

    constructor(nome, sobrenome) {

        this.nome = nome;
        this.sobrenome = sobrenome;
    }

    obterNomeCompleto() {

        return `${this.nome} ${this.sobrenome}`;
    }
}

let pessoa1 = new Pessoa('Flávio', 'Almeida');
console.log(pessoa1.obterNomeCompleto());

let pessoa2 = new Pessoa('Almeida', 'Flávio');
console.log(pessoa2.obterNomeCompleto());

//Monkey Patch
//altera para a variavel pessoa2 somente
pessoa2.obterNomeCompleto = function() {
  return `${this.nome} - ${this.sobrenome}`;
}
console.log(pessoa1.obterNomeCompleto());
console.log(pessoa2.obterNomeCompleto());

//Monkey Patch
//altera para as proximas instanciações (altera na classe)
Pessoa.prototype.obterNomeCompleto = function() {
  return `${this.nome} & ${this.sobrenome}`;
}

let pessoa3 = new Pessoa('Timão', 'Pumba');
console.log(pessoa3.obterNomeCompleto());