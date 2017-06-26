export class DateHelper {
    
    constructor() {
        throw new Error("DateHelper não pode ser instanciada!");
    }

    /* texto deve estar no formato: 'yyyy-MM-dd' */
    static textoParaData(texto) {
        if (!/^\d{4}-\d{1,2}-\d{1,2}$/.test(texto))
            throw new Error(`data deve estar no formato aaaa-mm-dd: ${texto}`);
        
        return new Date(
            //Spread Operator separa um array e os coloca sequencialmente nas posições de parâmetros do construtor
            ...texto
            //cria um array separando pelo caracter ou string informada
            .split('-')
            //.map percorre cada item do array para trata-lo
            //Arrow function: não utiliza a palavra reservada 'function' e usa a flecha '=>' após os parametros
            // se for uma única expressão (1 linha) na Arrow function, não é necessário chaves nem de return (pode suprimir porque é incluido implicitamente)
            //Ex.: map((item, index) => item - 1  (menos verboso)
            .map((item, index) => {
                if (index == 1)
                    return item - 1; // decrementa o mes pois quando passa para o construtor de Date ele entente que os meses são de 0 à 11
                else
                    return item;
            })
        );
    }

    static dataParaTexto(data) {
        //Usando Template String com 'backtick ou cráse(``)' (evita concatenação com '+' fazendo interpolação automaticamente nas expressões)
        return `${data.getDate()}/${data.getMonth() + 1}/${data.getFullYear()}`;
    }
}