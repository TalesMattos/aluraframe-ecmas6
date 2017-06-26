export class HttpService {

    _hangleErrors(resp) {
        if (resp.ok) { // se ok é verdadeiro, é porque o status é um valor entre 200 e 299 (válido)
            return resp;
        } else {
            throw new Error(`Erro ao obter resposta da requisição ajax. Status: ${resp.status} para URL: ${resp.url}`);
        }
    }

    get(url) {
        //usando API de busca nativa do EcmaScript2015 (ou, EcmaScript6): 'Fetch API'
        // 'fetch' é uma variável que se encontra no escopo global
        // retorna uma promise
        console.log('usando Fetch API para requisição ajax... ' + url);
        return fetch(url)
            .then(resp => this._hangleErrors(resp))
            .then(resp => resp.json()); // resp.json() substitui a necessidade JSON.parse(resp). Poderia ser resp.text() também
    }

    post(url, dado) {
        return fetch(url, {
                    headers: {'Content-type' : 'application/json'},
                    method: 'POST',
                    body: JSON.stringify(dado)
                })
                .then(resp => this._hangleErrors(resp));

    }

    get_OLD(url) {
        return new Promise((resolve, reject) => {
            let xhr = new XMLHttpRequest();
            xhr.open('GET', url);

            /*sempre que a requisição mudar de estado esse listener será invocado*/
            xhr.onreadystatechange = () => { // poderia usar também: xhr.addEventListener('load', () => {...  
                /* Possíveis estados:
                    0: Requisição ainda não iniciada
                    1: Conexão com o servidor estabelecida
                    2: Requisição recebida no servidor
                    3: Processando requisição
                    4: Requisição concluída e resposta pronta (a resposta pode ser um erro também)
                */
                if (xhr.readyState == 4) {
                    if (xhr.status == 200) {
                        resolve(JSON.parse(xhr.responseText));
                    } else {
                        reject(xhr.responseText);
                    }
                }
            };

            xhr.send();

            /* Poderia ser assim, mas optamos por: xhr.onreadystatechange = () => { ...
                    xhr.addEventListener('load', () => { 
                        if (xhr.status == 200) {
                            let resposta = xhr.responseText;
                            console.log(resposta);
                            let listaNegociacoesImportadas = JSON.parse(resposta);
                            listaNegociacoesImportadas.forEach(negociacao =>
                                this._listaNegociacoes.add(new Negociacao(new Date(negociacao.data), negociacao.quantidade, negociacao.valor)) );
                        } else {
                            console.log(`response error status: ${xhr.status}`)
                        }
                    });
            */
        });
    }


    post_OLD(url, dado) {

        return new Promise((resolve, reject) => {

            let xhr = new XMLHttpRequest();
            xhr.open("POST", url, true);
            xhr.setRequestHeader("Content-type", "application/json");
            xhr.onreadystatechange = () => {
                if (xhr.readyState == 4) {
                    if (xhr.status == 200) {
                        resolve(JSON.parse(xhr.responseText));
                    } else {
                        reject(xhr.responseText);
                    }
                }
            };
            xhr.send(JSON.stringify(dado)); // usando JSON.stringifly para converter objeto em uma string no formato JSON.
        });

    }
}