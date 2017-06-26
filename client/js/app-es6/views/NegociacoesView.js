
import {View} from './View';
import {DateHelper} from '../helpers/DateHelper';
import {Negociacao} from '../models/Negociacao';
import {currentInstance} from '../controllers/NegociacaoController';

/* Esse conceito de trazer o html para o mundo javascript por meio de classes view
    é muito usado no framework React, do facebook, no qual se usa uma API para facilitar o auto-complete e outros componentes proprietários.
   Já o Angular deixa a view a cargo tão somente do HTML.
*/
export class NegociacoesView extends View {

    constructor(elemento) {
        super(elemento);

        //usando event bubbling
        elemento.addEventListener('click', function(event) {
            if (event.target.nodeName == 'TH') {
                currentInstance().ordena(event.target.textContent.toLowerCase());
            }
        });

        this._removerNegociacaoTR(elemento);

    }

    _removerNegociacaoTR(elemento) {

        elemento.addEventListener('dblclick', function(ev) {
            if (ev.target.nodeName == 'TD') {
                let trNegociacao = ev.target.parentNode;
                
                    let tdsNeg = trNegociacao.querySelectorAll('td');
                    console.log(tdsNeg[0].textContent);
                    let negociacao = new Negociacao(
                                        DateHelper.textoParaData(tdsNeg[1].textContent.split('/').reverse().join('-'))
                                      , tdsNeg[2].textContent
                                      , tdsNeg[3].textContent
                                      , tdsNeg[0].textContent);
                    currentInstance().remover(negociacao)
                        .then(ret => {
                            trNegociacao.classList.add("fadeOut");
                            setTimeout(function() {    
                                trNegociacao.remove();
                            }, 500);
                        })
                        .catch(err => console.error(err));
            }
        });
    }

    //usando template string pois com aspas simples seria necessário concatenar com '+' todas as quebras de linha
    template(model) { // model é a lista de negociacoes (ListaNegociacoes)
        return `
            <table class="table table-hover table-bordered">
                <thead>
                    <tr>
                        <th>PK</th>
                        <th>DATA</th>
                        <th>QUANTIDADE</th>
                        <th>VALOR</th>
                        <th>VOLUME</th>
                        
                        <!-- <th onclick="negociacaoCtrl.ordena('data')">DATA</th> -->
                        <!-- <th onclick="negociacaoCtrl.ordena('quantidade')">QUANTIDADE</th> -->
                        <!-- <th onclick="negociacaoCtrl.ordena('valor')">VALOR</th> -->
                        <!-- <th onclick="negociacaoCtrl.ordena('volume')">VOLUME</th> -->
                    </tr>
                </thead>
                
                <tbody>
                    ${model.list.map(n => `
                                <tr>
                                    <td>${n.pk}</td>
                                    <td>${DateHelper.dataParaTexto(n.data)}</td>
                                    <td>${n.quantidade}</td>
                                    <td>${n.valor}</td>
                                    <td>${n.volume}</td>
                                </tr>
                        `).join('')}
                </tbody>

                <tfoot>
                    <td colspan="4"></td>
                    <!--
                            <td>${//não é possivel inserir varias instruções dentro de uma expreção template string
                                  // por isso aqui usamo a estrategia da função auto-invocada,
                                  // a function fica dentro de parenteses e depois por fora abre e fecha parenteses para auto invocar
                                    (function() {
                                        let total = 0;
                                        model.list.forEach(n => total += n.volume);
                                        return total;
                                    })() // Immediately-invoked function expression (IIFE) ou a função imediata (função auto-invocada)
                                }
                            </td>
                            <td>${ // de maneira funcional. reduce() processa o array e retorna um valor
                                // o retorno de cada iteração é atribuido a variavel do primeiro parametro da function
                                    model.list.reduce(function(total, n) {
                                        return total + n.volume;    
                                    }, 0.0) // '0.0' é um parametro que inicializa o total         
                                }
                            </td>
                    -->
                    <td>
                        ${model.volumeTotal /*mais orientado a objeto. a totalização vai para o modelo calcular*/}      
                    </td>
                </tfoot>
            </table>
        `;
    }
}

