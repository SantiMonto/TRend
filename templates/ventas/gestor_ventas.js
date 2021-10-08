
// $(window).on('load', function () {
//   setTimeout(function () {
//     $(".loader-page").css({ visibility: "hidden", opacity: "0" })
//   }, 1000);
// });

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
  querySnapshot.forEach(doc => {
    tableVentas.innerHTML += `
  <tr>
  <th class="align-middle">${doc.data().fecha}</th>
  <th class="align-middle">${doc.data().NumeroVenta}</th>
  <td class="align-middle">${doc.data().NombreClienteV}</td>
  <td class="align-middle">${doc.data().IdentiClienteV}</td>
  <td class="align-middle">${doc.data().totalCursos}</td>
  <td class="align-middle">${doc.data().TotalVenta}</td>
  <td class="align-middle">${doc.data().Vendedor}</td>
  <td class="align-middle">${doc.data().EstadoV}</td>
  <td>
    <button type="button" class="btn btn-danger">
      <i class="fas fa-trash-alt"></i> </button>
    <button type="button" class="btn btn-primary">
      <i class="fas fa-pencil-alt"></i></button>
    <div class="text-center">
      <a href="" type="button" class="btn btn-default btn-warning" id="open_form_label" data-toggle="modal" data-target="#createLabel">
        Label</a>
    </div>
  </td>
  </tr>
  `

  })
})

document.addEventListener("DOMContentLoaded", function(event) {
  var button = document.getElementById("open_form_label");
  button.addEventListener("click",function(e){
  });
});


