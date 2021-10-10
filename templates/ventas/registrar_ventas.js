
$(window).on('load', function () {
  setTimeout(function () {
    $(".loader-page").css({ visibility: "hidden", opacity: "0" })
  }, 1000);
});

// Esta funcion valida el fromulario antes de enviarlo
function validacion() {
  var nombreCliente = document.getElementById('NombreClienteV').value
  var identificacionCliente = document.getElementById('IdentiClienteV').value
  if (nombreCliente === '' | identificacionCliente == '') {
    swal("Upps!", "Al parecer falta información", "error")
    return false;
  }
  return true;
}

// las credenciales para acceder a la base de datos firebase
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

// esta funcion carga los selects de cursos y areas 
async function CargarSelect(idSelector, baseDatos) {
  const getDatos = () => db.collection(baseDatos).get();
  var selector = document.getElementById(idSelector);
  const querySnapshot = await getDatos();
  querySnapshot.forEach(doc => {
    if (doc.data().Estado == 'Activo') {
      var option = document.createElement("option");
      option.innerHTML = doc.data().nombre;
      option.value = doc.data().nombre;
      selector.append(option);
    }
  })
}

// cuando la ventana cargue, traiga todos los cursos y sus modaldiades
window.addEventListener('DOMContentLoaded', async (e) => {

  var consecutivo = 0;
  const getVentas = () => db.collection('ventas').orderBy("NumeroVenta", 'desc').limit(1).get();
  const querySnapshot = await getVentas();
  querySnapshot.forEach(doc => {
    consecutivo = doc.data().NumeroVenta;
    consecutivo = parseInt(consecutivo.substring(7, 9)) + 1

  });
  if (consecutivo < 10) {
    document.getElementById('NumeroVenta').innerHTML = 'SO-10000' + consecutivo
  }
  else {
    document.getElementById('NumeroVenta').innerHTML = 'SO-1000' + consecutivo
  }
  await CargarSelect('CursoClienteV1', 'cursos')
  await CargarSelect('AreaClienteV1', 'areas')

})

function eliminar_row(row) {
  var rowIndex = row.parentNode.parentNode.parentNode.rowIndex;
  document.getElementById("tablaResgistrarVentas").deleteRow(rowIndex);
};

// funciona para agregar otra linea en la tabla
async function AgregarLinea() {
  const tabla = document.getElementById("tablaResgistrarVentas")
  let lastRow = tabla.rows[tabla.rows.length - 1];
  let lastCell = parseInt(lastRow.cells[lastRow.cells.length - 1].id) + 1;
  tabla.insertRow(-1).innerHTML = ` <tr>
  <td>
      <select id=${'CursoClienteV' + lastCell} name=${'CursoClienteV' + lastCell} class="form-select text-center"
          aria-label="Rol" onchange="ponerPrecio(this)">
          <option value="Seleccionar" selected>Seleccionar</option>
      </select>
  </td>
  <td>
      <select id=${'AreaClienteV' + lastCell} name=${'AreaClienteV' + lastCell}  class="form-select text-center"
          aria-label="Rol">
          <option value="Seleccione el Área" selected>Seleccione</option>
      </select>
  </td>
  <td>
      <input type="number" min="1" id=${'CantidadV' + lastCell} class="text-center"
          placeholder="Cantidad" value="1" onchange="ActualiarTotal(this),calcularTotal(this)">

  </td>
  <td>
      <input id=${'PrecioCursoV' + lastCell} class="text-center" placeholder="Precio Unitario">

  </td>
  <td>
      <input id=${'TotalV' + lastCell} class="text-center" placeholder="Total" onchange="calcularTotal(this)">

  </td>
  <td id=${lastCell}>
      <span class="table-remove text-center"><button type="button"
              class=" text-center btn btn-danger btn-rounded btn-sm my-0" value="Delete"
              onclick=eliminar_row(this) onmouseover="this.style.cursor='hand'">
              Eliminar
          </button>
      </span>
  </td>
</tr>`;
  await CargarSelect('CursoClienteV' + lastCell, 'cursos')
  await CargarSelect('AreaClienteV' + lastCell, 'areas')
}


// esta funcion busca el precio de acuerdo con el curso seleccionado
async function ponerPrecio(val) {
  var idVentas = val.id
  idVentas = idVentas.substring(idVentas.indexOf('V') + 1, idVentas.length);
  const stateQueryRes = await db.collection('cursos').where('nombre', '==', val.value).get();
  stateQueryRes.forEach(doc => {
    var precio = doc.data().Costo
    var precioUnitario = new Intl.NumberFormat('es-CO').format(precio);
    document.getElementById('PrecioCursoV' + idVentas).value = '$' + precioUnitario;
    var total = precio * document.getElementById('CantidadV' + idVentas).value
    total = new Intl.NumberFormat('es-CO').format(total);
    document.getElementById('TotalV' + idVentas).value = '$' + total;

  })
  calcularTotal()


}

// esta funcion pone el costo total de la venta
function ActualiarTotal(val) {
  var idVentas = val.id
  idVentas = idVentas.substring(idVentas.indexOf('V') + 1, idVentas.length);
  var precio = document.getElementById('PrecioCursoV' + idVentas).value
  precio = precio.substring(precio.indexOf('$') + 1, precio.length);
  precio = precio.replace('.', '');
  var cantidad = document.getElementById('CantidadV' + idVentas).value
  var total = precio * cantidad
  total = new Intl.NumberFormat('es-CO').format(total);
  document.getElementById('TotalV' + idVentas).value = '$' + total;
  calcularTotal()
}

// Esta funcion envia los datos a la base de datos
const formRegistartVentas = document.getElementById('registrar-ventas');
formRegistartVentas.addEventListener('submit', async (e) => {
  const filas = [];
  e.preventDefault();
  val = validacion()
  const tableVentas = document.getElementById('tablaResgistrarVentas');
  if (val) {
    var totalCursos = 0;
    for (var i = 1, row; row = tableVentas.rows[i]; i++) {
      var select = document.getElementById("CursoClienteV" + i);
      const CursoClienteV = select.options[select.selectedIndex].value.trim();
      var select = document.getElementById("AreaClienteV" + i);
      const AreaClienteV = select.options[select.selectedIndex].value.trim();
      const PrecioCursoV = document.getElementById('PrecioCursoV' + i).value.trim();
      const CantidadV = document.getElementById('CantidadV' + i).value.trim();
      const totalV = document.getElementById('TotalV' + i).value.trim();
      var select = document.getElementById("EstadoV" + i);
      if (CursoClienteV == 'Seleccionar' |  AreaClienteV == 'Seleccionar') {
        val = false
      }
      totalCursos += parseInt(CantidadV);
      var fila = {
        CursoClienteV,
        AreaClienteV,
        PrecioCursoV,
        CantidadV,
        totalV,
      };
      filas.push(fila)
    }

    const NumeroVenta = document.getElementById('NumeroVenta').innerText;
    const NombreClienteV = document.getElementById('NombreClienteV').value;
    const IdentiClienteV = document.getElementById('IdentiClienteV').value;
    const TotalVenta = document.getElementById('TotalVenta').value.trim();
    const EstadoV = 'Cerrada';
    const Vendedor = "EStiven";
    let fecha = new Date().toISOString().slice(0, 10)
    if (val) {
      await db.collection('ventas').doc().set({
        fecha,
        NumeroVenta,
        NombreClienteV,
        IdentiClienteV,
        filas,
        EstadoV,
        TotalVenta,
        Vendedor,
        totalCursos
      })
      formRegistartVentas.reset();
      swal("Comfirmada!", "La venta se agregó correctamente.", "success")
        .then(() => {
          window.location.href = 'gestor_ventas.html';
        });

    }
    else {
      swal("Upps!", "Al parecer falta información", "error")
    }
  }
}
);

// esta funcion calcula el total de toda la orden.
function calcularTotal() {

  const tableVentas = document.getElementById('tablaResgistrarVentas');
  var total = 0;
  var subTotal = 0;
  for (var i = 1; row = tableVentas.rows[i]; i++) {
    subTotal = document.getElementById('TotalV' + i).value.trim();
    subTotal = subTotal.substring(subTotal.indexOf('$') + 1, subTotal.length);
    subTotal = subTotal.replace('.', '');
    total += parseInt(subTotal);

  };

  total = new Intl.NumberFormat('es-CO').format(total);
  document.getElementById('TotalVenta').value = '$' + total;
};

