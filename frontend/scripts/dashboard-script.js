


// Obtener la cadena de consulta de la URL
var queryString = window.location.search;

// Crear un objeto URLSearchParams a partir de la cadena de consulta
var params = new URLSearchParams(queryString);

// Obtener el valor de la variable "username"
var username = params.get("username");

// Obtener el valor de la variable "email"
var email = params.get("email");


//-------------------------------------

llenar_tabla();
function llenar_tabla(){
var table = document.querySelector("#gastos_table > tbody");

// Crear un array con los datos a agregar a la tabla
var data1 = ["Elemento 1", "Elemento 2", "Elemento 3"];
var data2 = ["$1", "$2", "$3"];


// Recorrer el array con un bucle for
for (var i = 0; i < data1.length; i++) {
    console.log(i);


    // Crear un nuevo elemento de fila (tr)
    var row = document.createElement("tr");

    // Crear un nuevo elemento de celda (td) y agregar el texto del elemento correspondiente
    var cell1 = document.createElement("td");
    var inp = document.createElement("input");
    inp.type = "radio";
    inp.name = "gastos"
    inp.id = "cuenta_gasto_" + (i + 1);
    var lab = document.createElement("label");
    lab.htmlFor = "cuenta_gasto_" + (i + 1);
    lab.id = "label_cuenta_gasto_" + (i + 1);
    lab.textContent = document.createTextNode(data1[i]).textContent; 


    var cell2 = document.createElement("td");
    cell2.className = "dinero_gasto";
    cell2.id = "label_valor_gasto_" + (i + 1);

    var cellText2 = document.createTextNode(data2[i]);


    var cell3 = document.createElement("td");
    var a1 = document.createElement("a");
    a1.setAttribute("data-toggle", "modal")
    a1.setAttribute("data-target", "#modifico_gasto");
    

    let i1 = document.createElement("i");
    i1.setAttribute("class", "fa-solid fa-pen");
    


    var a2 = document.createElement("a");
    let i2 = document.createElement("i");
    i2.setAttribute("class", "fa-solid fa-trash");

    
    cell1.appendChild(inp);
    cell1.appendChild(lab);
    
    cell2.appendChild(cellText2);
    
    cell3.appendChild(a1);
    a1.appendChild(i1);

    cell3.appendChild(a2);
    a2.appendChild(i2);

    // Agregar la celda a la fila
    row.appendChild(cell1);
    row.appendChild(cell2);
    row.appendChild(cell3);

    // Agregar la fila a la tabla
    table.appendChild(row);

}   

let rowTotal = document.createElement("tr");

var cellTotal = document.createElement("td");
cellTotal.style.textAlign = "center";

let b1 = document.createElement("b");
b1.textContent = "TOTAL";

var cellValor = document.createElement("td");
cellValor.id = "total_gasto";

var b2 = document.createElement("b");





cellTotal.appendChild(b1);
rowTotal.appendChild(cellTotal)
cellValor.appendChild(b2);
rowTotal.appendChild(cellValor);
table.appendChild(rowTotal);
}

//LLENAR PLACEHOLDER
const rows = document.querySelectorAll('table tr');
let column1Value;
let column2Value;

// Iterar sobre cada enlace y agregar un evento clic
document.querySelectorAll('table a').forEach((link) => {
  link.addEventListener('click', (event) => {
    event.preventDefault(); // Prevenir la acción predeterminada del enlace

    // Obtener la fila actual donde se encuentra el enlace
    const currentRow = link.parentNode.parentNode;
    
    // Obtener el índice de la fila actual en la tabla
    const rowIndex = Array.from(rows).indexOf(currentRow);

    // Obtener los valores de cada columna según la fila seleccionada
    column1Value = rows[rowIndex].querySelectorAll('td')[0].textContent;
    

    column2Value = rows[rowIndex].querySelectorAll('td')[1].textContent;


    // Imprimir los valores de cada columna en la consola
    document.querySelector("#cambio_tipo").setAttribute("value", column1Value);
    
    document.querySelector("#cambio_valor").setAttribute("value", column2Value);
  });
});





const celdasGasto = document.querySelectorAll('.dinero_gasto');

// Variable para guardar el total
let totalGasto = 0;

// Iterar sobre las celdas y sumar los valores
celdasGasto.forEach(celda => {
  // Obtener el valor de la celda y eliminar el símbolo "$"
  const valor = parseFloat(celda.innerText.replace('$', ''));
  // Sumar el valor a la variable totalGasto
  totalGasto += valor;
});

// Mostrar el total en el elemento con id="total_gasto"
const elementoTotal = document.querySelector('#total_gasto b');
elementoTotal.innerText = `$${totalGasto}`;

function cambioGasto(){
  document.getElementById("label_cuenta_gasto_1").textContent = "HOLA";

}


