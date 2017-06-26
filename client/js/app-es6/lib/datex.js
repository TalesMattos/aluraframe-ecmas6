
/*
Simulando uma biblioteca externa que, por coincidência, tem uma classe com o mesmo nome de uma 
 já existente no sistema. Isso irá ocasionar erro na aplicação, pois o último script importado no html
 que contiver a classe repetida, irá sobrescrever a anterior.
 
 Para fugir disso iremos usar o sistema de módulos do ES6:
 Uma vez ativado o sistema de módulos do ES6, todo conteúdo de um script deixa de estar no escopo global
    , não sendo mais acessível para os outros. Nenhuma classe estaria mais no escopo global.
 Para tanto, é necessário que export e import sejam feitos em cada arquivo onde há dependência

 */
class DateHelper {

    stringToDate(sDate) {
        //.. faz alguma coisa
    }
}