import {currentInstance} from './controllers/NegociacaoController';// importando a função que retorna um Singleton de NegociacaoController
import {} from './polyfill/fetch'; // fetch não exporta nada, mas é necessário importa-lo

let negociacaoCtrl = currentInstance();

// não é mais feito o bind direto na tag do html (index.html fazia isso nas tags correspondentes)
// bind para nao perder a associação com negCtrl (manter o "this" em negociacaoCtrl)
document.querySelector('.form').onsubmit = negociacaoCtrl.adiciona.bind(negociacaoCtrl); 
document.querySelector('#idBtImportar').onclick = negociacaoCtrl.importaNegociacoes.bind(negociacaoCtrl); 
document.querySelector('#idBtApagar').onclick = negociacaoCtrl.apaga.bind(negociacaoCtrl); 
