
import {Conta} from './Conta';

export class ContaPoupanca extends Conta {

    atualiza(taxa) {
        this._saldo = this._saldo + (taxa * 2);
    }
}