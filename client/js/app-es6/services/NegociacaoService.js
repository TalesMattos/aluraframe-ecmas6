import {HttpService} from './HttpService';
import {ConnectionFactory} from './ConnectionFactory';
import {NegociacaoDao} from '../dao/NegociacaoDao';
import {Negociacao} from '../models/Negociacao';
import {ListaNegociacoes} from '../models/ListaNegociacoes';

export class NegociacaoService {

    constructor() {
        this._httpService = new HttpService();
    }

    obterNegociacoesDaSemana() {
        
       return this._httpService.get('negociacoes/semana')//ou url poderia ser http://localhost:3000/negociacoes/anterior (como é uma chamada local pode omitir http://localhost:3000/)
                .then(negociacoesJSON => {
                    // ao invés de passar o resultado para resolve(...) estamos retornando o resultado
                    // pois assim poderemos encadear com a nova chama a função 'then' lá no NegociacaoController.js
                    return negociacoesJSON.map(negociacaoJSON => 
                                            new Negociacao(new Date(negociacaoJSON.data), negociacaoJSON.quantidade, negociacaoJSON.valor));
                }) 
                .catch(erro => {
                    console.log(erro);
                    // atirar o erro fará com que o erro seja encadeado na próxima chamada a de 'catch' no NegociacaoController.js
                    throw new Error('Não foi possível importar as negociações da semana atual. ' + erro.message);
                });
    }

    obterNegociacoesDaSemanaAnterior() {

        return this._httpService.get('negociacoes/anterior') 
                .then(negociacoesJSON => {
                    return negociacoesJSON.map(negociacaoJSON => 
                                            new Negociacao(new Date(negociacaoJSON.data), negociacaoJSON.quantidade, negociacaoJSON.valor));
                }) 
                .catch(erro => {
                    console.log(erro);
                    throw new Error('Não foi possível importar as negociações da semana anterior. ' + erro.message);
                });
    }
    
    obterNegociacoesDaSemanaRetrasada() {

       return this._httpService.get('negociacoes/retrasada')
                .then(negociacoesJSON => {
                     return negociacoesJSON.map(negociacaoJSON => 
                                            new Negociacao(new Date(negociacaoJSON.data), negociacaoJSON.quantidade, negociacaoJSON.valor));
                }) 
                .catch(erro => {
                    console.log(erro);
                    throw new Error('Não foi possível importar as negociações da semana retrasada. ' + erro.message);
                });
    }

    obterNegociacoes() {
        //ES6 suporta nativamente promises:

        //encadeia várias promises e as executas na ordem estabeleciada. 
        //Não há mais o problema das promises disparadas separadamente, uma vez que elas são assíncronas
        return Promise.all([this.obterNegociacoesDaSemana()
                            , this.obterNegociacoesDaSemanaAnterior()
                            , this.obterNegociacoesDaSemanaRetrasada()
                        ]).then(negociacoesResolve => { //recebe o que foi passado para 'resolve' (os acumulados das várias promises = um array de arrays)
                            let negociacoes = negociacoesResolve
                                    .reduce((arrayConcat, array) => arrayConcat.concat(array), []/*inicialização de arrayConcat*/);
                            return negociacoes;
                        }).catch(erro => {
                            throw new Error(erro.message)
                        });
    }

    cadastrar(negociacao) {

        return ConnectionFactory.getConnection()
            .then(conn => new NegociacaoDao(conn))
            .then(dao => dao.adicionar(negociacao))
            .then(() => true)
            .catch(erro => {
                console.log(erro);
                throw new Error('Erro ao adicionar a negociação no Indexed-DB')
            });
    }

    listar() {
        return ConnectionFactory.getConnection()
            .then(conn => new NegociacaoDao(conn))
            .then(dao => dao.listarTodos())
            .catch(e => {
                console.log(e);
                throw new Error('Não foi possível listar as negociações');
            });

    }

    apagarLista() {
        return ConnectionFactory.getConnection()
                .then(conn => new NegociacaoDao(conn))
                .then(dao => dao.apagarTodas())
                .catch(e => {
                    console.log(e);
                    throw new Error('Não foi possível apagar as negociações');
                });
    }

    remover(negociacao) {
        return ConnectionFactory.getConnection()
            .then(conn => new NegociacaoDao(conn))
            .then(dao => dao.remover(negociacao))
            .catch(err => {
                throw new Error('Não foi possível remover a negociação id: ' + negociacao.pk + '. ' + err.message);
            });
    }

    importa(listaAtual) {
        return this.obterNegociacoes()
                .then(negociacoes => 
                    negociacoes.filter(negociacao =>  // o filter elimina os itens que retornarem false na função
                        // se não encontrou, então pode importar, pode manter no array (por isso a negação)
                        !ListaNegociacoes.isNegociacaoJaExisteNaLista(listaAtual, negociacao)
                    )
                )
                .catch(erro => {
                    console.log(erro);
                    throw new Error(erro.message);
                });

    }

}