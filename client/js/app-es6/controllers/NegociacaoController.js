
import {ListaNegociacoes} from '../models/ListaNegociacoes';
import {Mensagem} from '../models/Mensagem';
import {Negociacao} from '../models/Negociacao';
import {NegociacoesView} from '../views/NegociacoesView';
import {MensagemView} from '../views/MensagemView';
import {DateHelper} from '../helpers/DateHelper';
import {Bind} from '../helpers/Bind';
import {NegociacaoService} from '../services/NegociacaoService';

// (não estamos exportando NegociacaoController por que ela será um Singleton: 
//      vamos exportar uma função que retorna sempre a mesma instância )
// ver final do arquivo.. 
class NegociacaoController {

    //É mais performático criar propriedades de classe para buscar elementos no DOM
    // se estivessem buscando dentro do método adicion(), por ex., iria percorrer o DOM tantas vezes quanto o botão fosse acionado
    // buscar elementos no DOM é custoso
    constructor() {
        //.bind diz para o método querySelector manter uma associação com document quando for atribuído ao $
        let $ = document.querySelector.bind(document);

        this._inputData = $("#data");
        this._inputQuantidade = $("#quantidade");
        this._inputValor = $("#valor"); 

        /*Como a _armadilha foi passada por meio de arrow function, onde o 'this' é estático/léxico 
                ('this' é fixo, ou seja, é o mesmo contexto do objeto ao qual a arrow function está inserida) 
            e não por meio de uma function normal, onde o 'this' é dinâmico
                ('this' varia de acordo com o contexto ao qual a função é chamada)
            então, vamos deixar comentada essa possibilidade
        */
        //'this' é dinâmico, varia com o contexto, por isso é necessário enviar 
        //  'this' (NegociacaoController) como parametro, sinalizando qual deve ser o contexto dentro da function
        // Será necessário usar API de reflexão para invocar a função armadilha, nesse modo
        //primeiro param: 'this' é o contexto em que a função vai ser executada
        /*
            this._listaNegociacoes = new ListaNegociacoes(this, function(model) {
                console.log(this); 
                this._negociacoesView.update(this._listaNegociacoes);
            });
        */
        /* Assim funciona bem também (variável auxiliar para this)
            let self = this;
            this._listaNegociacoes = new ListaNegociacoes(function(model) { 
                self._negociacoesView.update(model);
            });
        */
        // com Arrow Function o 'this' é fixo, e considera o contexto atual para executar dentro da função armadilha
        /* - Não vamos mais usar armadilha (Observer), vamos usar Proxy para não poluir o modelo com armadilhas
            this._listaNegociacoes = new ListaNegociacoes(model =>
                    this._negociacoesView.update(this._listaNegociacoes));
        /* com uso de Proxy (muito verbos)
            let self = this;
            this._listaNegociacoes = new Proxy(new ListaNegociacoes(), {}
                //handler(contém as armadilhas/trap)
                get(target, prop, receiver) {
                    if (['add', 'esvazia'].includes(prop) && typeof(target[prop]) == typeof(Function)) {
                        return function() {
                            //target: _listaNegociacoes
                            //prop: add ou esvazia
                            //receiver: referencia ao próprio proxy 
                            console.log(`interceptando ${prop}`);
                            Reflect.apply(target[prop], target, arguments); //arguments é um objeto implicito que contem todos os parametros/argumentos da chamada
                            self._negociacoesView.update(target); //nem com arrow function seria possivel acessar o contexto desse controller
                        }
                    }
                    return Reflect.get(target, prop, receiver);
                }
            });
        */
        
        // Vamos usar o pattern factory com ProxyFactory.js. Também vamos usar com Bind.js para fazer associação entre modelo e view
        // Bind deixa claro que é para fazer uma associação entre o modelo e a view quando alguns métodos forem invocados
        this._listaNegociacoes = new Bind(new ListaNegociacoes()
                                        , new NegociacoesView($('#idNegociacoesView'))
                                        , 'add', 'esvazia', 'remover', 'ordena', 'ordenaReverso');
        
        this._mensagem = new Bind(new Mensagem()
                                , new MensagemView($("#idMensagemView"))
                                , 'texto');

        this._ordemAtualNegociacoes = '';

        this._negociacaoService = new NegociacaoService();

        this._init();
    }

    _init() {

        this._listarNegociacoesIDB();

        // setInterval(() => this.importaNegociacoes(), 10000);
    }

    importaNegociacoes() {
        this._negociacaoService.importa(this._listaNegociacoes.list)
            .then(negociacoes => {
                    negociacoes.forEach(negociacao => this.adicionar(negociacao));
                    if (negociacoes.length > 0)
                        this._mensagem.texto = 'Negociações foram importadas com sucesso';
                    else 
                        this._mensagem.texto = 'Não existe negociações para importar ou elas já foram importadas';
            })
            .catch(e => this._mensagem.texto = e.message);
    }

    apaga() {
        if (this._listaNegociacoes.list.length == 0) {
            this._mensagem.texto = 'Não existe negociação para ser apagada';
        } else {
            this._negociacaoService.apagarLista()
                .then(msg => {
                    console.log(msg);
                    this._listaNegociacoes.esvazia();
                    this._mensagem.texto = 'As negociações foram apagadas com sucesso';
                })
                .catch(e => this._mensagem.texto = e);
        }
    }

    remover(negociacao) {
        return this._negociacaoService.remover(negociacao)
            .then(msg => {
                let posNaLista = ListaNegociacoes.obterPosicaoNegociacaoNLista(this._listaNegociacoes.list, negociacao);
                    console.log(posNaLista + ' posição');
                if (posNaLista >= 0) {
                    //timeout para dar tempo de animar com fadeOut antes de chamar update da view via Bind (gambiarra)
                    setTimeout(() => this._listaNegociacoes.remover(posNaLista), 550); 
                    this._mensagem.texto = 'A negociação foi apagada com sucesso';
                }
            })
            .catch(e => { 
                this._mensagem.texto = e.message
                throw new Error(e.message);
            });
    }

    _listarNegociacoesIDB() {
        this._negociacaoService.listar()
            .then(lista => lista.forEach(n => this._listaNegociacoes.add(n)))
            // .then(() => console.log('!@#$%¨-------1')) // pode encadear quantos 'then' quiser para a mesma promise
            // .then(() => console.log('!@#$%¨-------2'))
            .catch(e => this._mensagem.texto = e);
    }

    adicionar(negociacao) {

        if (ListaNegociacoes.isNegociacaoJaExisteNaLista(this._listaNegociacoes.list, negociacao)) {
            this._mensagem.texto = 'Essa negociação já existe: ' + negociacao;
            return false;
        }

        return this._negociacaoService.cadastrar(negociacao)
            .then(ok => {
                if (ok) {
                    console.log('Negociação adicionada ao Indexed-DB com sucesso');
                    this._listaNegociacoes.add(negociacao);   
                    return true;                 
                } else {
                    return false;
                }
            })
            .catch(erro => this._mensagem.texto = `Erro ao adicionar Negociação: ${erro}`);
    }

    adiciona(event) {
        event.preventDefault();
        let negociacao = this._criarNegociacaoViaInputs();
        this.adicionar(negociacao)
            .then(ok => {
                if (ok) {
                    this._mensagem.texto = 'Negociação adicionada com sucesso!';
                    this._limpaFormulario();
                } else {
                    this._mensagem.texto = 'Erro ao adicionar negociação na lista!';
                }
            });

        /*######### testes*/
        let negociacao2 = null;
        try {
            negociacao2 = this._criarNegociacaoViaInputs();
        } catch(erro) {
            this._mensagem.texto = `Erro ao criar Negociação: ${erro}`;
            return;
        }
        console.log(['2016', '10', '25'].join(','));
        console.log(new Date(2016, 8, 30));
        // Encontre todos os '-' na string e substitua por ','
        console.log('2016-10-25'.replace(/-/g, ',')); //RegExp em JavaScript fica entre 2 '/' ('/regex/'). 'g' é referente à global
        //data vem no formato yyyy-mm-dd. Exemplo: '2016-10-22'
        console.log(typeof(this._inputData.value) + " " + this._inputData.value);
        this._listaNegociacoes.list.length = 0; // não vai atingir a lista de _listaNegociacoes (programado defensivamente)
        this._listaNegociacoes.list.push(negociacao2); // não vai atingir a lista de _listaNegociacoes (programado defensivamente)
        let dataConcatDiaMesAno = DateHelper.dataParaTexto(negociacao2.data);
        console.log('Data concatenada: ' + dataConcatDiaMesAno);
        console.log(this._listaNegociacoes.list);
    }

    _criarNegociacaoViaInputs() {
        return new Negociacao(
                    DateHelper.textoParaData(this._inputData.value),
                    parseInt(this._inputQuantidade.value),
                    parseFloat(this._inputValor.value)
                );
    }

    _limpaFormulario() {
        console.log('limpando formulário...');
        this._inputData.value = '';
        this._inputQuantidade.value = 1;
        this._inputValor.value = 0.0;
        this._inputData.focus();
    }

    ordena(coluna) {
        // Não podemos fazer a.quantidade ou a.data, 
        // porque a propriedade usada no critério de ordenação é escolhida pelo usuário. 
        // Sendo assim, usamos a sintaxe objeto[nomePropriedade] para acessar a propriedade do objeto
        if (this._ordemAtualNegociacoes == coluna)
            this._listaNegociacoes.ordenaReverso();
        else
            this._listaNegociacoes.ordena((a, b) => a[coluna] - b[coluna]);
        this._ordemAtualNegociacoes = coluna;
    }
}


// Singleton
let negociacaoCtrl = new NegociacaoController();
export function currentInstance() {
    return negociacaoCtrl;
} 