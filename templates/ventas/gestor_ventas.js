
$(window).on('load', function () {
  setTimeout(function () {
    $(".loader-page").css({ visibility: "hidden", opacity: "0" })
  }, 1000);
});

const firebaseConfig = {
  apiKey: "AIzaSyDf5UIMl-yWAgMAMxVNodeh2mOcQf6R5dM",
  authDomain: "trender-8bed4.firebaseapp.com",
  projectId: "trender-8bed4",
  storageBucket: "trender-8bed4.appspot.com",
  messagingSenderId: "777425251936",
  appId: "1:777425251936:web:c6bd4adf8823049cda1d05",
  measurementId: "G-BMEV2H4T6M"
};
firebase.initializeApp(firebaseConfig);

const db = firebase.firestore();

const formRegistartVentas = document.getElementById('registrar-ventas');

const getVentas = () => db.collection('ventas').orderBy("NumeroVenta", 'desc').get();
const tableVentas = document.getElementById('TablaVentas');

window.addEventListener('DOMContentLoaded', async (e) => {
  const querySnapshot = await getVentas();
  var count = 0;
  querySnapshot.forEach(doc => {
    count += 1;
    tableVentas.innerHTML += `
  <tr>
  <td id=${'fecha' + count} class="align-middle">${doc.data().fecha}</td>
  <td id=${'NumeroVenta' + count} class="align-middle">${doc.data().NumeroVenta}</td>
  <td id=${'NombreClienteV' + count} class="align-middle">${doc.data().NombreClienteV}</td>
  <td id=${'IdentiClienteV' + count} class="align-middle">${doc.data().IdentiClienteV}</td>
  <td id=${'totalCursos' + count} class="align-middle">${doc.data().totalCursos}</td>
  <td id=${'TotalVenta' + count} class="align-middle">${doc.data().TotalVenta}</td>
  <td id=${'Vendedor' + count} class="align-middle">${doc.data().Vendedor}</td>
  <td id=${'EstadoV' + count} class="align-middle">${doc.data().EstadoV}</td>
  <td>
    <button type="button" class="btn btn-danger">
      <i class="fas fa-trash-alt"></i> 
      </button>
      <button id=${count} type="button" class="btn btn-primary"  data-toggle="modal" data-target="#EditarOrden" onclick="editarOrden(this)">
      <i class="fas fa-pencil-alt"> </i>
      </button>
      </i></button>
    <button id=${count} type="button" class="btn btn-warning"  data-toggle="modal" data-target="#verOrden" onclick="verInfOrden(this)">
    <i class="fas fa-adjust"> </i>
    </button>
    
  </td>
  </tr>
  `

  })
})



async function verInfOrden(val) {
  const id = val.id;
  console.log(id);
  document.getElementById("modalLabel").innerHTML = 'Orden: ' + document.getElementById("NumeroVenta" + id).innerText
  document.getElementById("FechaOrden").innerHTML = 'Fecha: ' + document.getElementById("fecha" + id).innerText
  document.getElementById("NombreClienteOrden").innerHTML = 'Cliente: ' + document.getElementById("NombreClienteV" + id).innerText
  document.getElementById("idClienteOrden").innerHTML = 'Identificacion: ' + document.getElementById("IdentiClienteV" + id).innerText
  document.getElementById("TotalOrdenV").value = document.getElementById("TotalVenta" + id).innerText
  document.getElementById("VenderdorOrdenV").innerHTML = "Vendedor: " + document.getElementById("Vendedor" + id).innerText

  const querySnapshot = await db.collection('ventas').where('NumeroVenta', '==', document.getElementById("NumeroVenta" + id).innerText).get();
  var count = 0;
  const tableVentas = document.getElementById('tablaCrusosOrden');
  tableVentas.innerHTML = "";
  tableVentas.innerHTML += `
  <thead class="table-dark text-center">
    <tr>
      <th class="text-center">Curso</th>
      <th class="text-center">Area</th>
      <th class="text-center">Cantidad</th>
      <th class="text-center">Precio</th>
      <th class="text-center">Total</th>
    </tr>
</thead>
    `

  querySnapshot.forEach(doc => {
    for (i in doc.data().filas) {
      tableVentas.innerHTML += `
      <tr>
      <td class="align-middle text-center">${doc.data().filas[i].CursoClienteV}</td>
      <td class="align-middle text-center">${doc.data().filas[i].AreaClienteV}</td>
      <td class="align-middle text-center">${doc.data().filas[i].CantidadV}</td>
      <td class="align-middle text-center">${doc.data().filas[i].PrecioCursoV}</td>
      <td class="align-middle text-center">${doc.data().filas[i].totalV}</td>
      </tr>
        `
    }



  })

}

// esta funcion carga los selects de cursos y areas 
async function CargarSelect(idSelector, baseDatos,campo='') {
  const getDatos = () => db.collection(baseDatos).get();
  var selector = document.getElementById(idSelector);
  const querySnapshot = await getDatos();
  querySnapshot.forEach(async(doc) => {
    if (doc.data().Estado == 'Activo') {
      if (doc.data().nombre != campo){
      var option = document.createElement("option");
      option.innerHTML = doc.data().nombre;
      option.value = doc.data().nombre;
      selector.append(option);}
    };
  });
};

// Desde este punto en adelante se usan funciones y codigos para el modulo de editar ordenes

// funciona para agregar otra linea en la tabla
async function AgregarLinea() {
  const tabla = document.getElementById("tablaEditarVentas")
  let lastCell = tabla.rows.length;

  // let lastCell = parseInt(lastRow.cells[lastRow.cells.length - 1].id);
  
  tabla.insertRow(-1).innerHTML = ` <tr>
    <td>
        <select id=${'CursoClienteEditar' + lastCell} name=${'CursoClienteEditar' + lastCell} class="form-select text-center"
            aria-label="Rol" onchange="ponerPrecio(this)">
            <option value="Seleccionar" selected>Seleccionar</option>
        </select>
    </td>
    <td>
        <select id=${'AreaClienteEditar' + lastCell} name=${'AreaClienteEditar' + lastCell}  class="form-select text-center"
            aria-label="Rol">
            <option value="Seleccione el Área" selected>Seleccione</option>
        </select>
    </td>
    <td>
        <input type="number" min="1" id=${'CantidadEditar' + lastCell} class="text-center"
            placeholder="Cantidad" value="1" onchange="ActualiarTotal(this)">

    </td>
    <td>
        <input id=${'PrecioCursoEditar' + lastCell} class="text-center" placeholder="Precio Unitario">

    </td>
    <td>
        <input id=${'TotalCursoEditar' + lastCell} class="text-center" placeholder="Total" onchange="calcularTotal(this)">

    </td>
    <td id=${lastCell}>
        <span class="table-remove text-center"><button type="button"
                class=" text-center btn btn-danger btn-rounded btn-sm my-0" value="Delete"
                onclick=eliminar_row(this) onmouseover="this.style.cursor='hand'">
                Eliminarsfd
            </button>
        </span>
    </td>
  </tr>`;
  await CargarSelect('CursoClienteEditar' + lastCell, 'cursos')
  await CargarSelect('AreaClienteEditar' + lastCell, 'areas')
};

// Esta funcion elimina un fila de la tabla selecionada
function eliminar_row(row) {
  var rowIndex = row.parentNode.parentNode.parentNode.rowIndex;
  document.getElementById("tablaEditarVentas").deleteRow(rowIndex);
  calcularTotal()
};

// esta funcion calcula el total de toda la orden.
function calcularTotal() {
  const tableVentas = document.getElementById('tablaEditarVentas');
  var total = 0;
  var subTotal = 0;
  for (var i = 1; row = tableVentas.rows[i]; i++) {
    
    subTotal = document.getElementById('TotalCursoEditar' + i).value.trim();
    subTotal = subTotal.substring(subTotal.indexOf('$') + 1, subTotal.length);
    subTotal = subTotal.replace('.', '');
    total += parseInt(subTotal);
  };
  total = new Intl.NumberFormat('es-CO').format(total);
  document.getElementById('TotalEditarVenta').value = '$' + total;
};

// esta funcion pone el costo total de la venta
function ActualiarTotal(val) {
  var idVentas = val.id
  idVentas = idVentas.substring(idVentas.indexOf('ar') + 2, idVentas.length);
  
  var precio = document.getElementById('PrecioCursoEditar' + idVentas).value
  precio = precio.substring(precio.indexOf('$') + 1, precio.length);
  precio = precio.replace('.', '');
  var cantidad = document.getElementById('CantidadEditar' + idVentas).value
  var total = precio * cantidad
  total = new Intl.NumberFormat('es-CO').format(total);
  document.getElementById('TotalCursoEditar' + idVentas).value = '$' + total;
  calcularTotal()
  console.log(idVentas);
}

// esta funcion busca el precio de acuerdo con el curso seleccionado
async function ponerPrecio(val) {
  var idVentas = val.id
  idVentas = idVentas.substring(idVentas.indexOf('ar') + 2, idVentas.length);
  const stateQueryRes = await db.collection('cursos').where('nombre', '==', val.value).get();
  stateQueryRes.forEach(doc => {
    var precio = doc.data().Costo
    var precioUnitario = new Intl.NumberFormat('es-CO').format(precio);
    document.getElementById('PrecioCursoEditar' + idVentas).value = '$' + precioUnitario;
    var total = precio * document.getElementById('CantidadEditar' + idVentas).value
    total = new Intl.NumberFormat('es-CO').format(total);
    document.getElementById('TotalCursoEditar' + idVentas).value = '$' + total;

  })
  calcularTotal()


}

async function editarOrden(val) {
  const id = val.id;
  document.getElementById("NumeroVentaEditar").innerHTML = document.getElementById("NumeroVenta" + id).innerText
  document.getElementById("NombreClienteEditar").value = document.getElementById("NombreClienteV" + id).innerText
  document.getElementById("IdentiClienteEditar").value = document.getElementById("IdentiClienteV" + id).innerText
  document.getElementById("TotalEditarVenta").value = document.getElementById("TotalVenta" + id).innerText

  const tableVentas = document.getElementById('tablaEditarVentas');
  tableVentas.innerHTML = "";
  tableVentas.innerHTML += `
  <thead class="table-dark text-center">
    <tr>
      <th class="text-center">Curso</th>
      <th class="text-center">Area</th>
      <th class="text-center">Cantidad</th>
      <th class="text-center">Precio Unitario</th>
      <th class="text-center">Total</th>
      <th class="text-center">Accion</th>

    </tr>
  </thead>`;
  const querySnapshot = await db.collection('ventas').where('NumeroVenta', '==', document.getElementById("NumeroVenta" + id).innerText).get();
  querySnapshot.forEach(async(doc) => {
    for (i in doc.data().filas) {
      var index = parseInt(i) + 1;
      tableVentas.innerHTML += `
      <tr>
          <td>
              <select id=${'CursoClienteEditar' + index } name=${'CursoClienteEditar' + index } 
                class="form-select text-center" aria-label="Rol"
                onchange="ponerPrecio(this)">
                <option value=${doc.data().filas[i].CursoClienteV} selected>${doc.data().filas[i].CursoClienteV}</option>
              </select>
          </td>
          <td>
            <select id=${'AreaClienteEditar' + index } name=${'AreaClienteEditar' + index } 
                class="form-select text-center" aria-label="Rol">
                <option value=${doc.data().filas[i].AreaClienteV} selected>${doc.data().filas[i].AreaClienteV}</option>
            </select>
          </td>
          <td>
            <input type="number" min="1" id=${'CantidadEditar' + index }  class="text-center"
              placeholder="Cantidad" value=${doc.data().filas[i].CantidadV} onchange="ActualiarTotal(this),calcularTotal()">
          </td>
          <td>
            <input id=${'PrecioCursoEditar' + index }  class="text-center" placeholder="Precio Unitario" value=${doc.data().filas[i].PrecioCursoV}>
          </td>
          <td>
              <input id=${'TotalCursoEditar' + index }  class="text-center" placeholder="Total"
                  onchange="calcularTotal(this),calcularTotal(this)" value=${doc.data().filas[i].totalV}>
          </td>
          <td id=${i} >
          <span class="table-remove text-center"><button type="button"
                  class=" text-center btn btn-danger btn-rounded btn-sm my-0"
                  value="Delete" onclick=eliminar_row(this)
                  onmouseover="this.style.cursor='hand'">
                  Eliminar
              </button>
          </span>
      </td>
        
  
      </tr>`;

      await CargarSelect('CursoClienteEditar' + index, 'cursos',doc.data().filas[i].CursoClienteV);
      await CargarSelect('AreaClienteEditar' + index, 'areas',doc.data().filas[i].AreaClienteV);
 
 
      
    }

    // await CargarSelect('AreaClienteV' + i, 'areas')


  })


}


