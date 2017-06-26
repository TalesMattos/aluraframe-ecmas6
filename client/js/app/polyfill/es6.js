'use strict';

console.log(' Construindo polyfill para funções ES6 não suportadas no navegador...');

if (!Array.prototype.includes) {
    console.log('Polyfill para Array.includes aplicado.');
    Array.prototype.includes = function (elemento) {
        return this.indexOf(elemento) != -1;
    };
}
//# sourceMappingURL=es6.js.map