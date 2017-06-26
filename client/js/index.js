var campos = [
    document.querySelector('#data'),
    document.querySelector('#quantidade'),
    document.querySelector('#valor')
];

console.log(campos);

var formIncluir = document.querySelector(".form");
formIncluir.addEventListener("submit", function(event) {
    event.preventDefault(); // evita osubmit de toda a página
    var tr = document.createElement("tr");
    campos.forEach(function(campo) {
        var td = document.createElement("td");
        td.textContent = campo.value; // usar .value ao invés de .textContent, pois são campos de input
        tr.appendChild(td);
    });
    var tdVolume = document.createElement("td");
    tdVolume.textContent = campos[1].value * campos[2].value;
    tr.appendChild(tdVolume);
    var tbody = document.querySelector("tbody");
    tbody.appendChild(tr);

    formIncluir.reset();
    campos[0].focus();
});