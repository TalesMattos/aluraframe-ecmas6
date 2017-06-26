'use strict';

System.register(['./controllers/NegociacaoController', './polyfill/fetch'], function (_export, _context) {
  "use strict";

  var currentInstance, negociacaoCtrl;
  return {
    setters: [function (_controllersNegociacaoController) {
      currentInstance = _controllersNegociacaoController.currentInstance;
    }, function (_polyfillFetch) {}],
    execute: function () {
      negociacaoCtrl = currentInstance();


      // não é mais feito o bind direto na tag do html (index.html fazia isso nas tags correspondentes)
      // bind para nao perder a associação com negCtrl (manter o "this" em negociacaoCtrl)
      document.querySelector('.form').onsubmit = negociacaoCtrl.adiciona.bind(negociacaoCtrl);
      document.querySelector('#idBtImportar').onclick = negociacaoCtrl.importaNegociacoes.bind(negociacaoCtrl);
      document.querySelector('#idBtApagar').onclick = negociacaoCtrl.apaga.bind(negociacaoCtrl);
    }
  };
});
//# sourceMappingURL=boot.js.map