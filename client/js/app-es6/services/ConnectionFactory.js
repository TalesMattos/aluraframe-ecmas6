
/* Module Pattern: Unidade de código confinada em que ninguém tem acesso ao conteúdo dele.
                    A partir daí, decidimos o que deve ser exportado para o mundo exterior com o 'return',
                        no caso uma classe.
    Uma maneira de criarmos um escopo privado no JavaScript é colocando o código em uma função. 
    'var ConnectionFactory' recebe uma função anônima auto-invocada e está com escopo global
    Tudo isso para que as variáveis sejam privadas
*/
// Não é mais necessário esse padrão pois o código foi refatorado para usar o sistema de módulo do ES6
// var ConnectionFactory = (function() {


// no ES6 não é possível criar variável estáticas, portanto esse 'workaround'
const stores = ['negociacoes'];
const idbName = 'aluraframe';
const idbVersion = '3';
let connection = null; // só deve haver 1 conexão para a app (comum no JS, diferente do Java onde há pool de conexões)
let closeConn = null;

// no ES6 não é possível criar variável estáticas, portanto esse 'workaround'
// return class ConnectionFactory {
export class ConnectionFactory {

    constructor() {
        throw new Error('ConnectionFactory não pode ser instanciada.');
    }

    static getConnection() {
        
        return new Promise((resolve, reject) => {
            
            let openRequest = window.indexedDB.open(idbName, idbVersion);
            
            openRequest.onupgradeneeded = e => {
                ConnectionFactory._createStores(e.target.result);
            };
        
            openRequest.onsuccess = e => {
                if (!connection) {
                    console.log('inicializando conexão com Indexed-DB...');
                    connection = e.target.result;
                    //Guardando a função close original que está associada à nossa connection
                    closeConn = connection.close.bind(connection);
                    //Monkey Patch: sobrescreve um método
                    connection.close = function() {
                        throw new Error('Não é permitido fechar a conexão com Indexed-DB');
                    };
                }
                resolve(connection);
            };
        
            openRequest.onerror = e => {
                console.log(e.target.error);
                reject(e.target.error.name);
            };
        });
    }

    static _createStores(connection) {
        console.log(`criando stores '${stores}' no Indexed-DB '${idbName}:${idbVersion}' ...`);
        stores.forEach(store => {
            if (connection.objectStoreNames.contains(store)) {
                connection.deleteObjectStore(store);
            } 
            connection.createObjectStore(store, {autoIncrement: true});
        });
    }

    static closeConnection() {
        if (connection) {
            /*Sem usar o bind no contexto de connection, a chamada a close deveria ser assim: 
                Reflect.apply(closeConn, connection, []);
            */
            closeConn();
            connection = null;
        }
    }
}

// })();