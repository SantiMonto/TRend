const firebaseConfig = {
    apiKey: "AIzaSyDf5UIMl-yWAgMAMxVNodeh2mOcQf6R5dM",
    authDomain: "trender-8bed4.firebaseapp.com",
    projectId: "trender-8bed4",
    storageBucket: "trender-8bed4.appspot.com",
    messagingSenderId: "777425251936",
    appId: "1:777425251936:web:c6bd4adf8823049cda1d05",
    measurementId: "G-BMEV2H4T6M"
  };

const app = firebase.initializeApp(firebaseConfig);
const db = firebase.firestore(app)

//variables DOM

const getCursos = () => db.collection('cursos').get();

async function drawCursos(){
    const cursos_table = document.getElementById('table_cursos')
    const querySnapshot = await getCursos();
    let contenidoHtml = "";
    querySnapshot.forEach ((C) => {
    let Entrada = C.data();
    contenidoHtml += `
    <tr>
      <th class="text-center">${Entrada.ID}</td>
      <td class="text-center">${Entrada.Curso}</td>
      <td class="text-center">${Entrada.Area}</td>
      <td class="text-center">${Entrada.Instructor}</td>
      <td class="text-center">$${Entrada.Costo}</td>
      <td class="text-center">${Entrada.Estado}</td>
      <td class="text-center">
        <button style="background-color: blue; border-color: blue; color:white"><i class="fas fa-eye"></i></button>
        <button id=${Entrada.ID} onclick="drawEdit(this)" style="background-color: green; border-color: green; color:white"><i class="fas fa-edit"></i></button>
        <button style="background-color: red; border-color: red; color:white"><i class="far fa-trash-alt"></i></button>
      </td>
    </tr>`
})
    cursos_table.innerHTML = contenidoHtml
}

async function prueba(val){
    const cursos_table = document.getElementById('table_cursos');
    var name = val.value;
    var expression = new RegExp(name);
    const querySnapshot = await getCursos();
    querySnapshot.forEach ((C) => {
        if (expression.test(C.data().Curso)){
            console.log("Prueba Satisfactoria")
            cursos_table.innerHTML = `
            <tr>
                <th class="text-center">${C.data().ID}</td>
                <td class="text-center">${C.data().Curso}</td>
                <td class="text-center">${C.data().Area}</td>
                <td class="text-center">${C.data().Instructor}</td>
                <td class="text-center">$${C.data().Costo}</td>
                <td class="text-center">${C.data().Estado}</td>
                <td class="text-center">
                    <button style="background-color: blue; border-color: blue; color:white"><i class="fas fa-eye"></i></button>
                    <button style="background-color: green; border-color: green; color:white"><i class="fas fa-edit"></i></button>
                    <button style="background-color: red; border-color: red; color:white"><i class="far fa-trash-alt"></i></button>
                </td>
            </tr>`
        }
    })
}

async function drawEdit(val){
    const form = document.getElementById('content_section');
    var name = val.id;
    var expression = new RegExp(name);
    const querySnapshot = await getCursos();
    var doc_id;
    querySnapshot.forEach ((C) => {
        if (expression.test(C.data().ID)){
            doc_id = C.id;
            form.innerHTML = `
            <form id="edit_course">
            <div class="mb-3 col-4 container">
                <label for="TextInput" class="form-label">Identificador del Curso</label>
                <input type="text" name="ID" class="form-control" value="${C.data().ID}">  
            </div>
            <div class="mb-3 col-4 container">
                <label for="TextInput" class="form-label">Nombre del Curso</label>
                <input type="text" name="Name_Course" class="form-control" value="${C.data().Curso}">
            </div>
            <div class="mb-3 col-4 container">
                <label for="Select" class="form-label">Area</label>
                <select name="Area" class="form-select" value="${C.data().Area}">
                <option>OOP</option>
                <option>Móvil</option>
                </select>
            </div>
            <div class="mb-3 col-4 container">
                <label for="TextInput" class="form-label">Instructor</label>
                <input type="text" name="Instructor" class="form-control" value="${C.data().Instructor}">
            </div>
            <div class="mb-3 col-4 container">
                <label for="TextInput" class="form-label">Precio</label>
                <input type="text" name="Precio" class="form-control" value="${C.data().Costo}">
            </div>
            <div class="mb-3 col-4 container">
                <label for="Select" class="form-label">Estado</label>
                <select name="Estado" class="form-select" value="${C.data().Estado}">
                    <option>Activo</option>
                    <option>Cancelado</option>
                </select>
            </div>
            <div class="col-4 container">
                <button type="submit" class="btn btn-dark">Enviar</button>
                <button type="reset" class="btn btn-dark" onclick="location.href='gestor_cursos.html'">Cancelar</button>
            </div>
            </form>`
        }
    })

    const edit_form = document.getElementById('edit_course');
        edit_form.addEventListener('submit', (e) => {
            e.preventDefault();
            db.collection('cursos').doc(doc_id).update({
                ID: edit_form.ID.value,
                Curso: edit_form.Name_Course.value,
                Area: edit_form.Area.value,
                Instructor: edit_form.Instructor.value,
                Costo: edit_form.Precio.value,
                Estado: edit_form.Estado.value,
            })
        })

}

drawCursos()
