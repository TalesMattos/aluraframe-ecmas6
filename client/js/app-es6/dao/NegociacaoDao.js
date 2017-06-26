
import {Negociacao} from '../models/Negociacao';

/*
Para lidar também com o o IndexedDB outros desenvolvedores tornaram públicas suas bibliotecas. 
Por exemplo, há o Dexie e o Db.js, este último utiliza promises assim como fizemos.
*/
export class NegociacaoDao {

    constructor(connection) {
        this._connection = connection;
        this._store = 'negociacoes';
    }

    adicionar(negociacao) {
        return new Promise((resolve, reject) => {
            let transaction = this._connection.transaction([this._store], 'readwrite');
            let store = transaction.objectStore(this._store);
            let request = store.add(negociacao);

            // #### VAI CANCELAR A TRANSAÇÃO. O evento onerror será chamado.
            // transaction.abort();// equivalente ao rollback do banco de dados relacional
            //??? por que nao chama request.onabort ???
            request.onabort = e => console.log(`Erro ao adicionar (transação abortada): ${e}`);

            request.onsuccess = e => {
                console.log('PK: ' + e.target.result);
                negociacao.pk = e.target.result;
                resolve();
            };
            request.onerror = e => reject(e.target.error.name);
        });
    }

    listarTodos() {
        return new Promise((resolve, reject) => {
            let request = this._connection.transaction([this._store], 'readonly')
                                          .objectStore(this._store)
                                          .openCursor();
            let listaNegociacoes = [];

            request.onsuccess = e => {
                let negociacaoAtual = e.target.result;
                if (negociacaoAtual) {
                    let dados = negociacaoAtual.value;
                    listaNegociacoes.push(new Negociacao(dados._data, dados._quantidade, dados._valor, negociacaoAtual.primaryKey));
                    negociacaoAtual.continue();
                } else {
                    resolve(listaNegociacoes);
                }
            }

            request.onerror = e => reject(e.target.error.name);
        });
    }

    apagarTodas() {
        return new Promise((resolve, reject) => {
            let request = this._connection.transaction([this._store], 'readwrite')
                                          .objectStore(this._store)
                                          .clear();
                                    
            request.onsuccess = e => resolve('Negociações apagadas com sucesso no Indexed-DB');
            request.onerror = e => {
                console.log(e.target.error);
                reject(e.target.error.name);
            };
        });
    }

    remover(negociacao) {
        return new Promise((resolve, reject) => {
            let request = this._connection.transaction([this._store], 'readwrite')
                                          .objectStore(this._store)
                                          .delete(negociacao.pk);
            request.onsuccess = e => resolve('Negociação removida com sucesso do Indexed-DB');
            request.onerror = e => {
                    console.error(e);
                    reject(e.target.error.name);
                }
        });
    }

}