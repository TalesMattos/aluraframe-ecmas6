
import {Conta} from './Conta';

export class ContaCorrente extends Conta {

    atualiza(taxa) {
        this._saldo += taxa;
    }
}